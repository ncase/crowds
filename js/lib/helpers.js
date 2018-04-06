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
		height = arguments[1];
		width = arguments[0];
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

// Get words
function getWords(wordsID){
	return $("words#"+wordsID).innerHTML;
}

// Remove from array
function removeFromArray(array, item){
	var index = array.indexOf(item);
	if(index>=0) array.splice(index,1);
}

// Fade In
function fadeIn(container, dom){
	dom.style.opacity = 0;
	dom.classList.add("transitionable");
	dom.style.display = "block";
	if(!container.contains(dom)) container.appendChild(dom);
	setTimeout(function(){
		dom.style.opacity = 1;
	},50);
}
function fadeOut(container, dom){
	dom.classList.add("transitionable");
	dom.style.opacity = 0;
	setTimeout(function(){
		if(container.contains(dom)) container.removeChild(dom);
	},300);
}

// Tween position
function tweenPosition(from, to){
	var x1 = from.x;
	var y1 = from.y;
	var x2 = to.x;
	var y2 = to.y;
	var dx = x2-x1;
	var dy = y2-y1;
	var t = 0;
	var handle = subscribe("update", function(){

		// Time
		t += 3/60;
		if(t>=1){
			from.x = x2;
			from.y = y2;
			unsubscribe(handle);
			return;
		}

		// Update
		from.x = x1 + dx*easeInOutSine(t);
		from.y = y1 + dy*easeInOutSine(t);

	});
}
// From Robert Penner: http://robertpenner.com/scripts/easing_equations.txt
function easeInOutSine(t) {
	return -1/2 * (Math.cos((Math.TAU/2)*t) - 1);
};

// Get Bounding Box of points
function getBoundsOfPoints(points){
	var minX=Infinity, minY=Infinity,
		maxX=-Infinity, maxY=-Infinity;
	points.forEach(function(p){
		if(p.x<minX) minX=p.x;
		if(p.y<minY) minY=p.y;
		if(maxX<p.x) maxX=p.x;
		if(maxY<p.y) maxY=p.y;
	});
	return {
		x: minX,
		y: minY,
		width: maxX-minX,
		height: maxY-minY,
	};
}


