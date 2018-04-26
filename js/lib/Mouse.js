/////////////////////////////
// MOUSE ////////////////////
/////////////////////////////

var Mouse = {
	x:0, y:0,
	pressed:false
};
Mouse.ondown = function(event){
	Mouse.pressed = true;
	Mouse.onmove(event);
	publish("mouse/down");
};
Mouse.onmove = function(event){
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
	publish("mouse/move");
};
Mouse.onup = function(event){
	Mouse.pressed = false;
	publish("mouse/up");
};
Mouse.update = function(){

	// Just pressed, or just released (one frame ago)
	Mouse.justPressed = (!Mouse.lastPressed && Mouse.pressed);
	Mouse.justReleased = (Mouse.lastPressed && !Mouse.pressed);

	// The last frame's stuff
	Mouse.lastX = Mouse.x;
	Mouse.lastY = Mouse.y;
	Mouse.lastPressed = Mouse.pressed;

};
// TOUCH.
function _touchWrapper(callback){
	return function(event){
		var _event = {};
		_event.clientX = event.changedTouches[0].clientX;
		_event.clientY = event.changedTouches[0].clientY;
		//event.preventDefault();
		callback(_event);
	};
}

// ALSO DON'T SCROLL WHEN TOUCH
document.body.addEventListener("touchstart", function(e){
    e.preventDefault(); 
},false); // do NOT capture.
document.body.addEventListener("touchmove", function(e){
    e.preventDefault(); 
},false); // do NOT capture.

// INIT
Mouse.init = function(target){

	// Regular mouse
	target.addEventListener("mousedown", Mouse.ondown);
	target.addEventListener("mousemove", Mouse.onmove);
	window.addEventListener("mouseup", Mouse.onup);

	// Touch events
	target.addEventListener("touchstart", _touchWrapper(Mouse.ondown), false);
	target.addEventListener("touchmove", _touchWrapper(Mouse.onmove), false);
	document.body.addEventListener("touchend", function(){
		Mouse.onup();
	}, false);

};