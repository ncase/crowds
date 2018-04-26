/*************************

Giant "everything" class that handles all the misc UI:
navigation, modal dialogues, audio, etc

*************************/
function Navigation(){

	var self = this;

	// Navigation buttons
	var nav_buttons = $all("#navigation > div");
	nav_buttons.forEach(function(nav){

		// Show label bubble
		(function(nav){
			nav.onmouseover = function(){
				_showBubble(nav);
			};
			nav.onmouseout = function(){
				_hideBubble();
			};
		})(nav);

		// If it's a chapter, when you click it, go to that chapter!
		var chapter = nav.getAttribute("chapter");
		if(chapter){
			(function(nav, chapter){
				nav.onclick = function(){
					publish("sound/button");
					slideshow.gotoChapter(chapter);
				};
				_stopPropButton(nav);
			})(nav, chapter);
		}

		// If it's a modal...
		var modal = nav.getAttribute("modal");
		if(modal){
			(function(nav, modal){
				nav.onclick = function(){
					publish("sound/button");
					publish("modal/"+modal);
				};
				_stopPropButton(nav);
			})(nav, modal);
		}

	});
	subscribe("slideshow/goto/",function(chapterID){

		nav_buttons.forEach(function(nav){
			var chapter = nav.getAttribute("chapter");
			if(chapter==chapterID){
				nav.setAttribute("highlight", true);
			}else{
				nav.removeAttribute("highlight");
			}
		});

	});
				
	// Navigation label bubble
	var bubble = $("#nav_bubble");
	var isShowingBubble = false;
	var _showBubble = function(nav){

		var offset = _getBoundingClientRect(nav).x - _getBoundingClientRect($("#navigation")).x;
		var label = nav.children[1].innerHTML;
		bubble.style.left = ( offset - (220/2) + (36/2) ) + "px";
		bubble.innerHTML = label;

		bubble.style.display = "block";
		setTimeout(function(){
			bubble.style.opacity = 1;
			bubble.style.top = (-85) + "px";
		},1);
		isShowingBubble = true;

	};
	var _hideBubble = function(){
		isShowingBubble = false;
		bubble.style.opacity = 0;
		bubble.style.top = (-80) + "px";
	};
	var _countdown = 0;
	subscribe("update", function(){
		if(isShowingBubble){
			_countdown = 0.25;
		}else{
			if(_countdown>0){
				_countdown -= 1/60;
			}else{
				bubble.style.display = "none";
			}
		}
	});

	// Sound
	var isMute = false;
	$("#sound").onclick = function(){
		if(isMute){
			Howler.mute(isMute = false);
			$("#sound").setAttribute("mute","no");
		}else{
			Howler.mute(isMute = true);
			$("#sound").setAttribute("mute","yes");
		}
	};
	_stopPropButton($("#sound"));

}

/****************************

SOCIAL SHARING 

****************************/

var shareURL = encodeURIComponent( window.location.href );
var shareTitle = encodeURIComponent( $("#share_title").innerText.trim() );
var shareDesc = encodeURIComponent( $("#share_desc").innerText.trim() );

$("#fb").href = "https://www.facebook.com/sharer/sharer.php?u="+shareURL+"&t="+shareDesc+" "+shareURL;
$("#tw").href = "https://twitter.com/intent/tweet?source="+shareURL+"&text="+shareDesc+" "+shareURL;
$("#em").href = "mailto:?subject="+shareTitle+"&body="+shareDesc+" "+shareURL;
