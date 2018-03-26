//////////////////////////
// THE SLIDESHOW, YO /////
//////////////////////////

var SLIDES = [];
var slideshow = new Slideshow();

function Slideshow(){

	var self = this;

	// The DOM & properties...
	self.dom = $("#slideshow");
	self.slideIndex = 0;
	
	// GOTO and NEXT
	self.goto = function(index){
		
		self.slideIndex = index;
		var slide = SLIDES[index];

		// Clear DOM
		self.clear();

		// Add boxes
		slide.boxes = slide.boxes || [];
		slide.boxes.forEach(function(box){
			var boxDOM = document.createElement("div");
			boxDOM.className = "word_box";
			if(box.words) boxDOM.innerHTML = $("words#"+box.words).innerHTML;
			if(box.x) boxDOM.style.left = box.x;
			if(box.y) boxDOM.style.top = box.y;
			if(box.w) boxDOM.style.width = box.w;
			if(box.h) boxDOM.style.height = box.h;
			self.dom.appendChild(boxDOM);
		});

	};
	self.gotoChapter = function(chapterID){
		var index = SLIDES.findIndex(function(slide){
			return slide.chapter == chapterID;
		});
		self.goto(index);
	};
	self.next = function(){
		self.goto(self.slideIndex+1);
	};

	// Clear out the DOM
	self.clear = function(){
		self.dom.innerHTML = "";
	};

}

// On load, set slideshow to first slide
window.addEventListener("load", function(){
	slideshow.goto(0);
});