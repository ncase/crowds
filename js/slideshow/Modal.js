
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
	var noteLength = $("#modal_content").innerText.length; // innerTEXT, so no links
	Modal.show(noteLength>500); // variable length
});

// ESCAPE (keyboard shortcut)
subscribe("key/down/escape", function(){
	Modal.hide();
});

window.Modal = {
	show: function(large){
		$("#modal_container").setAttribute("show","yes");
		$("#modal").setAttribute("size", large ? "large" : "small");
		$("#modal_content_container").scrollTop = 0; // scroll to top
	},
	hide: function(){
		publish("sound/button");
		$("#modal_container").removeAttribute("show");
	},
	showAll: function(thing){

		// ALL the things, in one go!
		var html = "";
		$all(thing).forEach(function(thing){
			html += "<div>"+thing.innerHTML+"</div>";
		});
		$("#modal_content").innerHTML = html;
		
		// Show in large box
		Modal.show(true);

	}
};

$("#modal_bg").onclick = Modal.hide;
$("#modal_close").onclick = Modal.hide;

// Show big collected modals
subscribe("modal/bonus", function(){
	Modal.showAll("bonus");
});
subscribe("modal/references", function(){
	Modal.showAll("reference");
});