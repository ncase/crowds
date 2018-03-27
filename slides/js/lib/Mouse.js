/////////////////////////////
// MOUSE ////////////////////
/////////////////////////////

var Mouse = {
	x:0, y:0,
	pressed:false
};
Mouse.ondown = function(){}; // add your own callback
Mouse.onmove = function(){}; // add your own callback
Mouse.onup = function(){}; // add your own callback
Mouse._ondown = function(event){
	Mouse.pressed = true;
	Mouse._onmove(event);
	Mouse.ondown();
};
Mouse._onmove = function(event){
	Mouse.x = event.clientX;
	Mouse.y = event.clientY;
	Mouse.onmove();
};
Mouse._onup = function(event){
	Mouse.pressed = false;
	Mouse.onup();
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
		event.preventDefault();
		callback(_event);
	};
}

// INIT
Mouse.init = function(target){

	// Regular mouse
	target.addEventListener("mousedown", Mouse._ondown);
	target.addEventListener("mousemove", Mouse._onmove);
	window.addEventListener("mouseup", Mouse._onup);

	// Touch events
	target.addEventListener("touchstart", _touchWrapper(Mouse._ondown), false);
	target.addEventListener("touchmove", _touchWrapper(Mouse._onmove), false);
	document.body.addEventListener("touchend", function(){
		Mouse._onup();
	}, false);

};