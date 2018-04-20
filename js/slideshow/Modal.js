
// SHOW BONUS BOXES
subscribe("bonus/show", function(bonus_id){
	var words = document.querySelector("bonus#"+bonus_id).innerHTML.trim();
	$("#modal_content").innerHTML = words;
	Modal.show(true); // show large for bonus
});

// SHOW REFERENCES
subscribe("reference/show", function(ref_id){
	var footnote = document.querySelector("reference#"+ref_id+" > div").innerHTML.trim();
	$("#modal_content").innerHTML = footnote;
	Modal.show(false); // show small for references
});

// ESCAPE (keyboard shortcut)
subscribe("key/down/escape", function(){
	Modal.hide();
});

window.Modal = {
	show: function(large){
		$("#modal_container").setAttribute("show","yes");
		$("#modal").setAttribute("size", large ? "large" : "small");
	},
	hide: function(){
		publish("sound/button");
		$("#modal_container").removeAttribute("show");
	}
};

$("#modal_bg").onclick = Modal.hide;
$("#modal_close").onclick = Modal.hide;