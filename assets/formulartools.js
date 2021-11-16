var globalCalcScopes = {}

function generateForm(id, formulas, calcScope) {
    const maindiv = document.getElementById(id);
    maindiv.innerHTML = "";
    form = document.createElement("form");
    form.setAttribute('id', 'form');

    resetbutton = document.createElement("input");
    resetbutton.setAttribute('id', 'resetbtn');
    resetbutton.setAttribute('value', 'Zurücksetzen');
    resetbutton.setAttribute("class", "btn btn-primary mb-3");

    buttonrow = document.createElement("div");
    buttonrow.setAttribute("class", "row");
    button1col = document.createElement("div");
    button1col.setAttribute("class", "col col-sm-2");
    button1col.appendChild(resetbutton);
    buttonrow.appendChild(button1col);
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
    table.setAttribute("data-page-list", "[25, 50, 100, all]");
    table.setAttribute("data-filter-control", "true");
    table.setAttribute("data-show-export", "true");

    form.appendChild(table);
    maindiv.appendChild(form);

    resultdiv = document.createElement("div");
    resultdiv.setAttribute("class", "p-3 border bg-light");
    resultdiv.setAttribute("id", "result");
    maindiv.appendChild(resultdiv)

    var $table = $('#table')
    $table.bootstrapTable('destroy').bootstrapTable({
        height: 550,
        columns: [{
                title: 'Kategorie',
                field: 'category',
                align: 'center',
                valign: 'middle',
                filterControl: 'select',
                sortable: true
            },
            {
                title: 'Formelbuchstabe',
                field: 'sign',
                align: 'center',
                valign: 'middle',
                filterControl: 'select',
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
                filterControl: 'select',
                sortable: true
            },
            /*{
                title: 'Ergebnis',
                field: 'result',
                align: 'center',
                valign: 'middle',
                sortable: true

            },*/
            {
                title: 'Einheit',
                field: 'unit',
                align: 'center',
                valign: 'middle',
                filterControl: 'select',
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
            formularhint.innerHTML = mj(decVarname(latex)).outerHTML;
            //console.log(latex,decVarname(latex))
            formularhintcol.appendChild(formularhint);
            formularrowdiv.appendChild(formularhintcol);
        } catch (err) {
            console.log(err);
            continue;
        }
        formulardiv.appendChild(formularrowdiv);
    }
    if (formulas[row.category][row.sign].adddescription != undefined) {
        formularrowdiv2 = document.createElement("div");
        formularrowdiv2.setAttribute("class", "row gx-5");
        formularhintcol2 = document.createElement("div");
        formularhintcol2.setAttribute("class", "col");
        formularhintcol2.innerHTML = formulas[row.category][row.sign].adddescription;
        formularrowdiv2.appendChild(formularhintcol2);
        formulardiv.appendChild(formularrowdiv2);
    }
    return formulardiv.outerHTML;
}

function inputFormatter(value, row, index) {
    div = document.createElement("div");
    input = document.createElement("input");
    input.setAttribute("class", "form-control tableinput");
    input.setAttribute("id", "idinput" + index);
    input.setAttribute("value", value);
    input.setAttribute("tindex", index);
    input.setAttribute("onchange", 'inputValue("input",this)');
    if (row.input != "") {
        input.readOnly = true;
    }
    div.appendChild(input);

    // Select from Table?
    if (formulas[row.category][row.sign].table !== undefined) {
        select = document.createElement("select");
        select.setAttribute("class", "form-select");
        select.setAttribute("onchange", 'setValueFromSelect(this,"idinput' + index + '");inputValue("input", document.getElementById("idinput' + index + '"));');
        select.setAttribute("aria-label", "Default select example");
        select.setAttribute("id", "idselect" + index);
        if (row.input != "") {
            select.setAttribute("disabled", "");
        }
        select.innerHTML = optionsFromTable(formulas[row.category][row.sign].table, formulas[row.category][row.sign].tablecolumn1, formulas[row.category][row.sign].tablecolumn2);
        selectformtext = document.createElement("div");
        selectformtext.setAttribute("class", "form-text");
        selectformtext.appendChild(select);
        div.appendChild(selectformtext);
    }

    return div.outerHTML;
}

function doCalculation() {
    console.log("Calculate")
    TableInputToVariables();
    calculateFormulars("result", formulas);
    VariablesToTableInput();
    console.log(globalCalcScopes)
}

// Set bootstrap table value
function inputValue(field, inputelement) {
    value = inputelement.value.replaceAll(",", ".");
    $('#table').bootstrapTable('updateCell', {
        index: parseInt(inputelement.getAttribute("tindex"), 10),
        field: field,
        value: value
    });
    doCalculation();
}

function normalizeCategory(category) {
    output = category.replaceAll(" ", "");
    return output;
}

function calculateFormulars(resultid, formulas) {
    //const result = document.getElementById(resultid);
    //result.innerHTML = '';
    for (var categoryname in formulas) {
        for (var sign in formulas[categoryname]) {
            // jump over description
            if (sign === 'description') {
                continue;
            }
            if (globalCalcScopes[normalizeCategory(categoryname)] != undefined) {
                if (globalCalcScopes[normalizeCategory(categoryname)][encVarname(sign)] != undefined) {
                    v = globalCalcScopes[normalizeCategory(categoryname)][encVarname(sign)]
                    if (v != "") {
                        continue;
                    }
                }
            }

            obj = formulas[categoryname][sign];
            let parenthesis = 'keep'
            let implicit = 'hide'
            for (let expr of obj.expression) {
                try {
                    node = math.parse(encVarname(expr), globalCalcScopes[normalizeCategory(categoryname)]);
                    globalCalcScopes[normalizeCategory(categoryname)][encVarname(sign)] = math.format(node.compile().evaluate(globalCalcScopes[normalizeCategory(categoryname)]));
                } catch (err) {

                    continue;
                }

                try {
                    const latex = node ? node.toTex({
                        parenthesis: parenthesis,
                        implicit: implicit
                    }) : ''
                    MathJax.typesetClear();
                    result.innerHTML += sign + " = ";
                    result.appendChild(mj(decVarname(latex)));
                    result.innerHTML += " = " + globalCalcScopes[normalizeCategory(categoryname)][encVarname(sign)] + formulas[categoryname][sign]["unit"] + " [" + formulas[
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
        if (row.input == "") {
            continue;
        }
        if (globalCalcScopes[normalizeCategory(row.category)] == undefined) {
            //console.log("category:",normalizeCategory(row.category),"=undefined");
            globalCalcScopes[normalizeCategory(row.category)] = {}
        }
        if (globalCalcScopes[normalizeCategory(row.category)][encVarname(row.sign)] == undefined) {
            //console.log("sign:",encVarname(row.sign),"=undefined");
            globalCalcScopes[normalizeCategory(row.category)][encVarname(row.sign)] = {}
        }
        globalCalcScopes[normalizeCategory(row.category)][encVarname(row.sign)] = row.input;
    }
    console.log("T2V", globalCalcScopes);
}

function VariablesToTableInput() {
    var $table = $('#table');
    rows = $table.bootstrapTable('getData');
    i = 0;
    for (var row of rows) {
        //console.log(row)
        //console.log(normalizeCategory(row.category),encVarname(row.sign));

        if (globalCalcScopes[normalizeCategory(row.category)] == undefined) {
            i++;
            continue;
        }
        newvalue = globalCalcScopes[normalizeCategory(row.category)][encVarname(row.sign)];

        if (newvalue == undefined) {
            i++;
            continue;
        }
        $('#table').bootstrapTable('updateCell', {
            index: i,
            field: "input",
            value: parseFloat(newvalue).toFixed(4)
        });
        i++;
    }
    console.log("V2T", globalCalcScopes);
}

function ResetForm() {
    var $table = $('#table');
    rows = $table.bootstrapTable('getData');
    i = 0;
    for (var row of rows) {
        $('#table').bootstrapTable('updateCell', {
            index: i,
            field: "input",
            value: ""
        });
        i++;
    }
    globalCalcScopes = {};
    TableInputToVariables();
    var $result = $('#result');
    result.innerHTML="";

}

function encVarname(input) {
    //let re = /\b(?!sqrt|frac|cos|sin|tan|pi|acos|rad|deg\b)[A-Za-zα-ωΑ-Ω]{1,10}[0-9]{0,5}/g;
    //input = input.replaceAll(re, '_$&');
    return input;
}

function decVarname(input) {
    /*let re = /{\\\_{1}/g;
    input = input.replaceAll(re, '{');
    let re2 = /\\\_{1}/g;
    input = input.replaceAll(re2, ' ');
    let re3 = /_{1}/g;
    input = input.replaceAll(re3, '');*/
    return input;
}

// ##################################################################
//
// Add config for angle format to mathjs
//
// ##################################################################

// our extended configuration options
const config = {
    angles: 'deg' // 'rad', 'deg', 'grad'
}

function AddAngleConfig() {

    let replacements = {}
 
    // create trigonometric functions replacing the input depending on angle config
    const fns1 = ['sin', 'cos', 'tan', 'sec', 'cot', 'csc']
    fns1.forEach(function (name) {
        const fn = math[name] // the original function

        const fnNumber = function (x) {
            // convert from configured type of angles to radians
            switch (config.angles) {
                case 'deg':
                    return fn(x / 360 * 2 * Math.PI)
                case 'grad':
                    return fn(x / 400 * 2 * Math.PI)
                default:
                    return fn(x)
            }
        }

        // create a typed-function which check the input types
        replacements[name] = math.typed(name, {
            'number': fnNumber,
            'Array | Matrix': function (x) {
                return math.map(x, fnNumber)
            }
        })
    })

    // create trigonometric functions replacing the output depending on angle config
    const fns2 = ['asin', 'acos', 'atan', 'atan2', 'acot', 'acsc', 'asec']
    fns2.forEach(function (name) {
        const fn = math[name] // the original function

        const fnNumber = function (x) {
            const result = fn(x)

            if (typeof result === 'number') {
                // convert to radians to configured type of angles
                switch (config.angles) {
                    case 'deg':
                        return result / 2 / Math.PI * 360
                    case 'grad':
                        return result / 2 / Math.PI * 400
                    default:
                        return result
                }
            }

            return result
        }

        // create a typed-function which check the input types
        replacements[name] = math.typed(name, {
            'number': fnNumber,
            'Array | Matrix': function (x) {
                return math.map(x, fnNumber)
            }
        })
    })

    // import all replacements into math.js, override existing trigonometric functions
    math.import(replacements, {
        override: true
    })

}