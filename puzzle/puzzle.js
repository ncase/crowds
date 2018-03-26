var currentSlide = 0;

function loadSlide(index){

	var slide = $("slides").children[index];
	if(!slide) return;

	if(slide.getAttribute("level")){
		var iframe = $("#content_puzzle");
		iframe.src = "game/game.html?level="+slide.getAttribute("level");
		//iframe.width = slide.getAttribute("width");
		//iframe.height = slide.getAttribute("height");
	}

	var words = $("#content_words");
	words.innerHTML = slide.innerHTML;

}

function $(query){
	return document.querySelector(query);
}

function nextLevel(){
	currentSlide++;
	loadSlide(currentSlide);
}

loadSlide(currentSlide);