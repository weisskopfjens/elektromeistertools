//
// Source Tag: Input
// get input and set vars
function getAll() {
	//const myElement = document.getElementById('io');
	var inputElements = document.getElementsByTagName("input");
	for (let i = 0; i < inputElements.length; i++) {
		// get element and write it to a global var
		console.log(inputElements[i].id, inputElements[i].value);
		if (inputElements[i].value != "") {
			window[inputElements[i].id] = inputElements[i].value.replace(",", ".");
		} else {
			window[inputElements[i].id] = null;
		}
	}
}

//
// Target Tag: Input
// get vars and set input
function setAll() {
	var inputElements = document.getElementsByTagName("input");
	//roundAll();
	for (let i = 0; i < inputElements.length; i++) {
		// get element and write it to a global var
		if (window[inputElements[i].id] != null) {
			inputElements[i].value = parseFloat(window[inputElements[i].id]).toFixed(2).toString().replace(".", ",");
		}
	}
}

//
// Target ID: output
// Print Output
//
function print(outputstring, id) {
	id = id || "output";
	var outputElement = document.getElementById(id);
	outputstring.replace("*", "&middot;");
	outputstring.replace("/", ":");
	outputElement.innerHTML = outputElement.innerHTML + outputstring;
}

//
// Target ID: output
// Clear Output
//
function clear() {
	var outputElement = document.getElementById("output");
	outputElement.innerHTML = "";
}

//
// Target Tag: input
// Clear input elements values
//
function clearAll() {
	clear();
	var inputElements = document.getElementsByTagName("input");
	for (let i = 0; i < inputElements.length; i++) {
		// get element and write it to a global var
		if (window[inputElements[i].id] != null) {
			inputElements[i].value = "";
		}
	}
	getAll();
}

function initGraphics(id) {
	id = id || "canvas";
	var canvas = document.getElementById(id);
	ctx = canvas.getContext('2d');
	var width = canvas.width;
	var height = canvas.height;
}


//ImageData Modifizieren
var setPixel = function (x, y, r, g, b, a) {
	var index = (x + y * imageData.width) * 4;
	imageData.data[index] = r;
	imageData.data[index + 1] = g;
	imageData.data[index + 2] = b;
	imageData.data[index + 3] = a;
}

var getPixel = function (x, y) {
	var index = (x + y * width) * 4;
	var pixel = {
		r: imageData.data[index],
		g: imageData.data[index + 1],
		b: imageData.data[index + 2],
		a: imageData.data[index + 3]
	}
	return pixel;
}

function getImg() {
	//ImageData Auslesen
	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	imageData_width = imageData.width;
	imageData_height = imageData.height;
	imageData_data = imageData.data;
}

function putImg() {
	//ImageData Schreiben
	ctx.putImageData(imageData, 0, 0);
}

//ImageData Erzeugen
// var imageData_blank = ctx.createImageData(100, 100);

//
// Graphen für Javascript HTML5 Canvas
//

function funGraph(ctx, axes, func, color, thick) {
	var xx, yy, dx = 4,
		x0 = axes.x0,
		y0 = axes.y0,
		scale = axes.scale;
	var iMax = Math.round((ctx.canvas.width - x0) / dx);
	var iMin = axes.doNegativeX ? Math.round(-x0 / dx) : 0;
	ctx.beginPath();
	ctx.lineWidth = thick;
	ctx.strokeStyle = color;

	for (var i = iMin; i <= iMax; i++) {
		xx = dx * i;
		yy = scale * func(xx / scale);
		if (i == iMin) ctx.moveTo(x0 + xx, y0 - yy);
		else ctx.lineTo(x0 + xx, y0 - yy);
	}
	ctx.stroke();
}

function showAxes(ctx, axes) {
	var x0 = axes.x0,
		w = ctx.canvas.width;
	var y0 = axes.y0,
		h = ctx.canvas.height;
	var xmin = axes.doNegativeX ? 0 : x0;
	ctx.beginPath();
	ctx.strokeStyle = "rgb(128,128,128)";
	ctx.moveTo(xmin, y0);
	ctx.lineTo(w, y0); // X axis
	ctx.moveTo(x0, 0);
	ctx.lineTo(x0, h); // Y axis
	ctx.stroke();
}

// d = grad
// liefert Zahl zwischen 1 und -1 
function DreiecksFunktion(d) {
	a = 1.0;
	p = Math.PI * 2; //phasenlänge Bogenmaß
	phi = 0;
	return 4 * a / p * Math.abs(((((d + (phi * (Math.PI / 180))) - p / 4) % p) + p) % p - p / 2) - a;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function valueSeries(x, y, fix = 2) {
	var o;
	o = '<table class="table table-bordered"><tr>';
	for (let i of x) {
		o = o + "<td>" + i.toFixed(fix) + "</td>";
	}
	o = o + "</tr><tr>";
	for (let i of y) {
		o = o + "<td>" + i.toFixed(fix) + "</td>";
	}
	o = o + "</tr></table>";
	return o;
}

function optionsFromTable(table, selection_col,result_col) {
	var o="";
	for(let i in table) {
		o+='<option value="'+table[i][result_col].replace(",",".")+'">'+table[i][selection_col]+'</option>';
	}
	return o;
}

function setValueFromSelect(id,targetid) {
	const element = document.getElementById(targetid);
	element.value=id.value;
}