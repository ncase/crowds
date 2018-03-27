//////////////////
// HELPERS ///////
//////////////////

Math.TAU = 6.2831853072;

// The poor man's jQuery
function $(query){
	return document.querySelector(query);
}
function $all(query){
	return document.querySelectorAll(query);
}

// Wide Sigmoid
function sigmoid(x){
	return x / (1 + Math.abs(x));
}

// Create retina canvas
function createCanvas(canvas, width, height){

	// The "canvas" arg not provided? make a new one!
	if(arguments.length==2){
		width = arguments[0];
		height = arguments[1];
		canvas = document.createElement("canvas");
	}

	// Set difference in width & height
	canvas.width = width*2;
	canvas.height = height*2;
	canvas.style.width = width;
	canvas.style.height = height;

	return canvas;
	
}

// Copy an object
function cloneObject(obj){
	return JSON.parse(JSON.stringify(obj));
}
