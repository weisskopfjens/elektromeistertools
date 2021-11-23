//
// Source Tag: Input
// get input and set vars
function getAll() {
	//const myElement = document.getElementById('io');
	var inputElements = document.getElementsByTagName("input");
	for (let i = 0; i < inputElements.length; i++) {
		// get element and write it to a global var
		// console.log(inputElements[i].id, inputElements[i].value);
		if (inputElements[i].value != "") {
			window[inputElements[i].id] = inputElements[i].value.replace(",", ".");
		} else {
			window[inputElements[i].id] = null;
		}
	}
}

//
// Source Tag: Input
// get input and set vars
function getAllInput() {
	//const myElement = document.getElementById('io');
	var inputElements = document.getElementsByTagName("input");
	for (let i = 0; i < inputElements.length; i++) {
		// get element and write it to a global var
		// console.log(inputElements[i].id, inputElements[i].value);
		if (inputElements[i].value != "") {
			inputElements[i].id = inputElements[i].value.replace(",", ".");
			return inputElements
		} else {
			inputElements[i].id = null;
			return inputElements
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

function optionsFromTable(table, selection_col, result_col) {
	var o = "";
	for (let i in table) {
		o += '<option value="' + table[i][result_col].replace(",", ".") + '">' + table[i][selection_col] + '</option>';
	}
	return o;
}

function setValueFromSelect(id, targetid) {
	const element = document.getElementById(targetid);
	element.value = id.value;
}

// Convert from degrees to radians.
Math.rad = function (degrees) {
	return degrees * Math.PI / 180;
}

// Convert from radians to degrees.
Math.deg = function (radians) {
	return radians * 180 / Math.PI;
}

// Convert from degrees to radians.
math.rad = function (degrees) {
	return degrees * Math.PI / 180;
}

// Convert from radians to degrees.
math.deg = function (radians) {
	return radians * 180 / Math.PI;
}

// Usage: 
//drawLineWithArrows(50, 50, 150, 50, 5, 8, true, true);

// x0,y0: the line's starting point
// x1,y1: the line's ending point
// width: the distance the arrowhead perpendicularly extends away from the line
// height: the distance the arrowhead extends backward from the endpoint
// arrowStart: true/false directing to draw arrowhead at the line's starting point
// arrowEnd: true/false directing to draw arrowhead at the line's ending point

function drawLineWithArrows(ctx, x0, y0, x1, y1, aWidth, aLength, arrowStart, arrowEnd, label = "") {
	var dx = x1 - x0;
	var dy = y1 - y0;
	var angle = Math.atan2(dy, dx);
	var length = Math.sqrt(dx * dx + dy * dy);
	//
	ctx.translate(x0, y0);
	ctx.rotate(angle);
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(length, 0);
	if (arrowStart) {
		ctx.moveTo(aLength, -aWidth);
		ctx.lineTo(0, 0);
		ctx.lineTo(aLength, aWidth);
	}
	if (arrowEnd) {
		ctx.moveTo(length - aLength, -aWidth);
		ctx.lineTo(length, 0);
		ctx.lineTo(length - aLength, aWidth);
	}


	ctx.stroke();
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	ctx.lineWidth = 1;
	ctx.font = "20px monospace";
	ctx.strokeText(label, (x0 + x1) / 2, (y0 + y1) / 2);

	//ctx.fillText(label, (x0+x1)/2, (y0+y1)/2);
	ctx.stroke();
}

/*Object.prototype.getName = function () { 
	var prop; 
	for (prop in self) {
	   if (Object.prototype.hasOwnProperty.call(self, prop) && self[prop] === this && self[prop].constructor == this.constructor) { 
		 return prop; 
	   } 
	} 
	return ""; // no name found 
  };*/


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