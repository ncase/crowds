//////////////////
// HELPERS ///////
//////////////////

Math.TAU = 6.2831853072; // for true believers

// The poor man's jQuery
function $(query){
	return document.querySelector(query);
}
function $all(query){
	return [].slice.call(document.querySelectorAll(query));
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
	canvas.style.width = (width) + "px";
	canvas.style.height = (height) + "px";

	return canvas;
	
}

// Copy an object
function cloneObject(obj){
	return JSON.parse(JSON.stringify(obj));
}

// Get words
function getWords(wordsID){
	var dom = $("words#"+wordsID);
	if(dom){
		return dom.innerHTML.trim();
	}else{
		return "";
	}
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
function tweenPosition(from, to, callback, ease, speed){
	var x1 = from.x;
	var y1 = from.y;
	var x2 = to.x;
	var y2 = to.y;
	var dx = x2-x1;
	var dy = y2-y1;
	var t = 0;
	ease = ease || easeInOutSine;
	speed = speed || 3/60;
	var handle = subscribe("update", function(){

		// Time
		t += speed;
		if(t>=1){
			from.x = x2;
			from.y = y2;
			unsubscribe(handle);
			return;
		}

		// Update
		from.x = x1 + dx*easeInOutSine(t);
		from.y = y1 + dy*easeInOutSine(t);

		// Callback
		if(callback){
			callback(from);
		}

	});
}
/*function tweenBox(box, to){
	var from = {
		x: parseInt(box.style.left),
		y: parseInt(box.style.top)
	};
	to.x = (to.x===undefined) ? from.x : to.x;
	to.y = (to.y===undefined) ? from.y : to.y;
	tweenPosition(from, to, function(position){
		box.style.left = position.x + "px";
		box.style.top = position.y + "px";
	});
}*/
// From Robert Penner: http://robertpenner.com/scripts/easing_equations.txt
function easeInOutSine(t) {
	return -1/2 * (Math.cos((Math.TAU/2)*t) - 1);
};
function easeLinear(t){
	return t;
}

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

// Some Vector Shtuff
function getVectorFromTo(from, to){
	return {
		x: to.x - from.x,
		y: to.y - from.y,
	};
}
function getVectorLength(v){
	return Math.sqrt(v.x*v.x + v.y*v.y);
}
function getUnitVector(v){
	var length = getVectorLength(v);
	return {
		x: v.x/length,
		y: v.y/length
	};
}
function multiplyVector(v, scale){
	return {
		x: v.x * scale,
		y: v.y * scale
	};
}
function addVectors(a,b){
	return {
		x: a.x + b.x,
		y: a.y + b.y
	};
}
function rotateVector(v, a){
	return {
		x: Math.cos(a)*v.x - Math.sin(a)*v.y,
		y: Math.sin(a)*v.x + Math.cos(a)*v.y 
	}
}

// Cross Browser Crap
function _getBoundingClientRect(dom){
	//debugger;
	var bounds = dom.getBoundingClientRect();
	if(bounds.x===undefined) bounds.x = bounds.left; // crossbrowser crap
	if(bounds.y===undefined) bounds.y = bounds.top; // crossbrowser crap
	return bounds;
}
function _stopPropButton(button){
	button.onmousedown = function(event){
		event.stopPropagation();
	};
	button.ontouchstart = function(event){
		event.stopPropagation();
	};
}