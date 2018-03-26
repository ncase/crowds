/////////////////////////////
// MOUSE ////////////////////
/////////////////////////////

var Mouse = {
	x:0, y:0,
	pressed:false
};
Mouse.ondown = function(event){
	cursor.show();
	Mouse.pressed = true;
	Mouse.onmove(event);
};
Mouse.onmove = function(event){
	cursor.show();
	Mouse.x = event.offsetX;
	Mouse.y = event.offsetY;
};
Mouse.onup = function(event){
	Mouse.pressed = false;
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
canvas.addEventListener("mousedown", Mouse.ondown);
canvas.addEventListener("mousemove", Mouse.onmove);
window.addEventListener("mouseup", Mouse.onup);

// TOUCH.
function _touchWrapper(callback){
	return function(event){
		var _event = {};
		_event.offsetX = event.changedTouches[0].clientX;
		_event.offsetY = event.changedTouches[0].clientY;
		event.preventDefault();
		callback(_event);
	};
}
canvas.addEventListener("touchstart", _touchWrapper(Mouse.ondown), false);
canvas.addEventListener("touchmove", _touchWrapper(Mouse.onmove), false);
document.body.addEventListener("touchend", function(){
	cursor.hide();
	Mouse.onup();
}, false);