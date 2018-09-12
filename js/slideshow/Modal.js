
// SHOW BONUS BOXES
subscribe("bonus/show", function(bonus_id){
	
	publish("sound/button");

	var words = document.querySelector("bonus#"+bonus_id).innerHTML.trim();
	$("#modal_content").innerHTML = words;
	Modal.show(true); // show large for bonus
});

// SHOW REFERENCES
//var SHOWING_SUPPORTERS = false;
subscribe("reference/show", function(ref_id){
	
	publish("sound/button");

	var footnote = document.querySelector("reference#"+ref_id+" > div").innerHTML.trim();
	$("#modal_content").innerHTML = footnote;
	var noteLength = $("#modal_content").innerText.length; // innerTEXT, so no links

	// HACK: IF IT'S PATREON PEOPLE, *NOW* SHOW IFRAME
	if(ref_id=="supporters"){
		$("#modal_content").innerHTML = footnote+'<br><br>'+
			'<iframe src="supporters/" width="730" height="330" style="border:none; margin:0 auto; display:block"></iframe>';
	}

	if($("reference#"+ref_id).getAttribute("large")){
		Modal.show(true); // force large
	}else{
		Modal.show(noteLength>500); // variable length
	}

});

// ESCAPE (keyboard shortcut)
subscribe("key/down/escape", function(){
	Modal.hide();
});

window.Modal = {
	currentlyShowing: "",
	show: function(large){
		$("#modal_container").setAttribute("show","yes");
		$("#modal").setAttribute("size", large ? "large" : "small");
		$("#modal_content_container").scrollTop = 0; // scroll to top
	},
	hide: function(){
		Modal.currentlyShowing = "";
		publish("sound/button");
		$("#modal_container").removeAttribute("show");
	},
	showAll: function(thing){

		// ALL the things, in one go!
		var html = "";
		$all(thing).filter(function(thing){
			return !thing.getAttribute("hidden"); // NOT hidden
		}).forEach(function(thing){
			html += "<div>"+thing.innerHTML+"</div>";
		});
		$("#modal_content").innerHTML = html;
		
		// Show in large box
		Modal.show(true);

	}
};

$("#modal_bg").onclick = Modal.hide;
$("#modal_close").onclick = Modal.hide;
_stopPropButton($("#modal_bg"));
_stopPropButton($("#modal_close"));

// Show big collected modals
subscribe("modal/bonus", function(){
	if(Modal.currentlyShowing == "bonus"){
		Modal.hide();
	}else{
		Modal.currentlyShowing = "bonus";
		Modal.showAll("bonus");
	}
});
subscribe("modal/references", function(){
	if(Modal.currentlyShowing == "reference"){
		Modal.hide();
	}else{
		Modal.currentlyShowing = "reference";
		Modal.showAll("reference");
	}
});

// Translations
subscribe("modal/translations", function(){

	if(Modal.currentlyShowing == "translations"){
		Modal.hide();
	}else{
		Modal.currentlyShowing = "translations";

		// Translation HTML
		var html = "";
		if(window.TRANSLATIONS.length>0){
			html += getWords("translations_exist");
		}else{
			html += getWords("translations_do_not_exist");
		}
		html += " <a target='_blank' href='"+window.ADD_YOUR_OWN_LINK+"'>"+getWords("translations_add")+"</a>";
		html += " <a href='.'>"+getWords("translations_original")+"</a>";
		html += "<div style='height:12px'></div>";
		html += _createLinks(" · ");
		
		$("#modal_content").innerHTML = html;
			
		// Show in large box
		Modal.show(false);

	}

});

// MOBILE URGGHHHH
$("#modal_content_container").ontouchstart = function(event){
	event.stopPropagation();
};
$("#modal_content_container").ontouchmove = function(event){
	event.stopPropagation();
};


