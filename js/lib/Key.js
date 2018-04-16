//////////////////////////////
// KEYS (it's a secret) //////
//////////////////////////////

var KEYS = {
	32: "space",
	49: "1",
	50: "2",
	8: "delete",
	27: "escape"
};

window.addEventListener("keydown", function(event){
	var key = KEYS[event.keyCode];
	if(key) publish("key/down/"+key);
});

window.addEventListener("keyup", function(event){
	var key = KEYS[event.keyCode];
	if(key) publish("key/up/"+key);
});