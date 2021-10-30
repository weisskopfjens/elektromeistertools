var globalCalcScopes = {}

function generateForm2(id, formulas, calcScope) {
    const maindiv = document.getElementById(id);
    maindiv.innerHTML = "";
    form = document.createElement("form");
    form.setAttribute('id', 'form');

    submitbutton = document.createElement("input");
    submitbutton.setAttribute('type', 'submit');
    submitbutton.setAttribute('value', 'Berechnen');
    submitbutton.setAttribute("class", "btn btn-primary mb-3");

    resetbutton = document.createElement("input");
    resetbutton.setAttribute('id', 'resetbtn');
    resetbutton.setAttribute('value', 'Zurücksetzen');
    resetbutton.setAttribute("class", "btn btn-primary mb-3");

    buttonrow = document.createElement("div");
    buttonrow.setAttribute("class", "row");
    button1col = document.createElement("div");
    button1col.setAttribute("class", "col col-sm-2");
    button2col = document.createElement("div");
    button2col.setAttribute("class", "col col-sm-2");
    button1col.appendChild(submitbutton);
    button2col.appendChild(resetbutton);
    buttonrow.appendChild(button1col);
    buttonrow.appendChild(button2col);
    form.appendChild(buttonrow);

    table = document.createElement("table");
    table.setAttribute("class", "table");
    table.setAttribute("id", "table");
    table.setAttribute("data-toolbar", "#toolbar");
    table.setAttribute("data-search", "true");
    table.setAttribute("data-show-fullscreen", "true");
    table.setAttribute("data-show-columns", "true");
    table.setAttribute("data-show-columns-toggle-all", "true");
    table.setAttribute("data-detail-view", "true");
    table.setAttribute("data-show-export", "true");
    table.setAttribute("data-detail-formatter", "detailFormatter");
    table.setAttribute("data-show-pagination-switch", "true");
    table.setAttribute("data-pagination", "true");
    table.setAttribute("data-page-list", "[10, 25, 50, 100, all]");

    form.appendChild(table);
    maindiv.appendChild(form);
    var $table = $('#table')
    $table.bootstrapTable('destroy').bootstrapTable({
        height: 550,
        columns: [{
                title: 'Kategorie',
                field: 'category',
                align: 'center',
                valign: 'middle',
                sortable: true
            },
            {
                title: 'Formelbuchstabe',
                field: 'sign',
                align: 'center',
                valign: 'middle',
                sortable: true
            },
            {
                title: 'Eingabe',
                field: 'input',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: inputFormatter
            },
            {
                title: 'Beschreibung',
                field: 'description',
                align: 'center',
                valign: 'middle',
                sortable: true
            },
            {
                title: 'Ergebnis',
                field: 'result',
                align: 'center',
                valign: 'middle',
                sortable: true

            },
            {
                title: 'Einheit',
                field: 'unit',
                align: 'center',
                valign: 'middle',
                sortable: true

            }
        ]
    });

    var i = 0;
    var rows = [];
    for (var categoryname in formulas) {
        for (var sign in formulas[categoryname]) {
            // Add description?
            if (sign === 'description') {
                continue;
            }

            entry = formulas[categoryname][sign];
            rows.push({
                category: categoryname,
                sign: sign,
                input: "",
                description: entry.description,
                unit: entry.unit
            })
        }
        i++;
    }

    $table.bootstrapTable('append', rows);
}

function detailFormatter(index, row) {
    formulardiv = document.createElement("div");
    formulardiv.setAttribute("class", "container px-4");
    formularrowdiv = document.createElement("div");
    formularrowdiv.setAttribute("class", "row gx-5");
    formulardiv.appendChild(formularrowdiv);
    for (let expr of formulas[row.category][row.sign].expression) {
        try {
            node = math.parse(encVarname(expr), calcScope);
        } catch (err) {
            console.log(err);
            continue;
        }
        try {
            let parenthesis = 'keep'
            let implicit = 'hide'
            const latex = node ? node.toTex({
                parenthesis: parenthesis,
                implicit: implicit
            }) : ''
            MathJax.typesetClear();
            formularhintcol = document.createElement("div");
            formularhintcol.setAttribute("class", "col");
            formularhint = document.createElement("div");
            formularhint.setAttribute("class", "p-1 border bg-light");

            
            formularhint.innerHTML = mj( decVarname(latex) ).outerHTML;
            console.log(latex,decVarname(latex))
            formularhintcol.appendChild(formularhint);
            formularrowdiv.appendChild(formularhintcol);
        } catch (err) {
            console.log(err);
            continue;
        }
    }
    return formulardiv.outerHTML;
}

function inputFormatter(value, row, index) {
    div = document.createElement("div");
    input = document.createElement("input");
    input.setAttribute("class", "form-control tableinput");
    input.setAttribute("id", "input " + row.category + " " + row.sign);
    input.setAttribute("value", value);
    input.setAttribute("tindex", index);
    if (row.input != "") {
        input.readOnly = true;
    }
    div.appendChild(input);

    // Select from Table?
    if (formulas[row.category][row.sign].table !== undefined) {
        select = document.createElement("select");
        select.setAttribute("class", "form-select");
        select.setAttribute("onchange", 'setValueFromSelect(this,\'' + "input " + row.category + " " + row.sign + '\');');
        select.setAttribute("aria-label", "Default select example");
        select.setAttribute("id", "idselect" + row.sign);
        select.innerHTML = optionsFromTable(formulas[row.category][row.sign].table, formulas[row.category][row.sign].tablecolumn1, formulas[row.category][row.sign].tablecolumn2);
        selectformtext = document.createElement("div");
        selectformtext.setAttribute("class", "form-text");
        selectformtext.appendChild(select);
        div.appendChild(selectformtext);
    }

    return div.outerHTML;
}

// Set bootstrap table value
function inputValue(field, inputelement) {
    $('#table').bootstrapTable('updateCell', {
        index: parseInt(inputelement.getAttribute("tindex"), 10),
        field: field,
        value: inputelement.value
    });
}

function calculateFormulars2(resultid, formulas) {
    const result = document.getElementById(resultid);
    result.innerHTML = '';
    for (var categoryname in formulas) {
        for (var sign in formulas[categoryname]) {
            // jump over description
            if (sign === 'description') {
                continue;
            }
            obj = formulas[categoryname][sign];
            let parenthesis = 'keep'
            let implicit = 'hide'
            for (let expr of obj.expression) {
                try {
                    node = math.parse(encVarname(expr), globalCalcScopes[categoryname]);
                    //calcScope[encVarname(sign)] = math.format(node.compile().evaluate(calcScope));
                    globalCalcScopes[categoryname][encVarname(sign)] = math.format(node.compile().evaluate(globalCalcScopes[categoryname]));
                } catch (err) {
                    //console.log(err);
                    continue;
                }
                //console.log("calc");
                //console.log(expr);
                //console.log(math.format(node.compile().evaluate(calcScope)));
                try {
                    const latex = node ? node.toTex({
                        parenthesis: parenthesis,
                        implicit: implicit
                    }) : ''

                    MathJax.typesetClear();
                    result.innerHTML += sign + " = ";
                    //console.log(latex);
                    //console.log(decVarname(latex));
                    result.appendChild(mj(decVarname(latex)));
                    /*result.innerHTML += " = " + calcScope[encVarname(sign)] + " [ " + formulas[
                            categoryname][sign]
                        .description +
                        ']<br><hr>'*/
                    result.innerHTML += " = " + globalCalcScopes[categoryname][encVarname(sign)] + " [ " + formulas[
                            categoryname][sign]
                        .description +
                        ']<br><hr>'
                } catch (err) {}

            }
        }
    }
}

function TableInputToVariables() {
    var $table = $('#table');
    rows = $table.bootstrapTable('getData');
    for (var row of rows) {
        input = document.getElementById("input " + row.category + " " + row.sign);
        // input element not found?
        if (input == undefined) {
            console.log("Error:",row)
            continue;
        }
        // input element no value?
        if (input.value=="") {
            console.log("Input empty:",row)
            continue;
        }
        inputValue("input", input);
        /*if (row.input == "") {
            continue;
        }*/

        //console.log(row);

        //Set global scope
        if (globalCalcScopes[row.category] == undefined) {
            console.log("category:",row.category,"=undefined");
            globalCalcScopes[row.category] = {}
        }
        if (globalCalcScopes[row.category][encVarname(row.sign)] == undefined) {
            console.log("sign:",row.sign,"=undefined");
            globalCalcScopes[row.category][encVarname(row.sign)] = {}
        }
        globalCalcScopes[row.category][encVarname(row.sign)] = row.input;
        console.log(globalCalcScopes[row.category])
    }

}

function VariablesToTableInput() {
    for (var categoryi in globalCalcScopes) {
        for (var signi in globalCalcScopes[categoryi]) {
            varname = decVarname(signi);
            input = document.getElementById("input " + categoryi + " " + varname);
            if (globalCalcScopes[categoryi][varname] === undefined || input === undefined) {
                continue;
            }
            input.value = globalCalcScopes[categoryi][varname];
            inputValue("input", input);
        }
    }
}

function ResetForm(formulas, calcScope, resultid) {
    for (var categoryname in formulas) {
        for (var sign in formulas[categoryname]) {
            // jump over description
            if (sign === 'description') {
                continue;
            }

            const o = document.getElementById(sign);
            o.value = "";
            o.readOnly = false;
            calcScope[encVarname(sign, formulas)] = undefined;
        }
    }
    const result = document.getElementById(resultid);
    result.innerHTML = "";
    //console.log(calcScope);
}

function encVarname(input) {
    output = "";
    //console.log("enc  in: " + input);
    //let re = new RegExp('\b(?!sqrt|frac\b)[A-Za-zα-ωΑ-Ω]{1,4}[0-9]{0,2}', 'g');
    let re = /\b(?!sqrt|frac\b)[A-Za-zα-ωΑ-Ω]{1,10}[0-9]{0,5}/g;
    //let re = /(?!sqrt|frac\b)[A-Za-zα-ωΑ-Ω]{1,10}[0-9]{0,5}/g;
    input = input.replaceAll(re, '_$&');
    //console.log("enc out: " + input);
    return input;
}

function decVarname(input) {
    //console.log("dec  in: " + input);
    //let re = new RegExp('{\\\\_{1}', 'g');
    let re = /{\\\_{1}/g;
    input = input.replaceAll(re, '{');
    //let re2 = new RegExp('_{1}', 'g');
    let re2 = /\\\_{1}/g;
    input = input.replaceAll(re2, ' ');
    let re3 = /_{1}/g;
    input = input.replaceAll(re3, '');
    //console.log("dec out: " + input);
    return input;
}