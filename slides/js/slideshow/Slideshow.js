/******************************************

THE SLIDESHOW
- background: fullscreen iframe (so can draw everywhere)
- foreground: words & pictures

******************************************/

var SLIDES = [];

function Slideshow(){

	var self = this;

	// The DOM & properties...
	self.dom = $("#slideshow");
	self.slideIndex = 0;
	self.currentSlide = null;
	self.currentState = null;

	// My stuff...
	self.boxes = new Boxes();
	self.simulations = new Simulations();
	
	// GOTO and NEXT
	self.goto = function(index){
		
		self.slideIndex = index;
		self.currentSlide = SLIDES[self.slideIndex];
		var slide = self.currentSlide;

		// Clear?
		if(slide.clear) self.clear();

		// Remove stuff
		slide.remove = slide.remove || [];
		slide.remove.forEach(function(childConfig){
			switch(childConfig.type){
				case "box":
					self.boxes.removeChildByID(childConfig.id);
					break;
				case "sim":
					//self.simulations.removeChildByID(childConfig);
					break;
			}
		});

		// Move stuff
		slide.move = slide.move || [];
		slide.move.forEach(function(childConfig){
			switch(childConfig.type){
				case "box":
					//self.boxes.add(childConfig);
					break;
				case "sim":
					var sim = self.simulations.getChildByID(childConfig.id);
					sim.config.x = (childConfig.x===undefined) ? sim.config.x : childConfig.x;
					sim.config.y = (childConfig.y===undefined) ? sim.config.y : childConfig.y;
					break;
			}
		});

		// Add stuff
		slide.add = slide.add || [];
		slide.add.forEach(function(childConfig){
			switch(childConfig.type){
				case "box":
					self.boxes.add(childConfig);
					break;
				case "sim":
					self.simulations.add(childConfig);
					break;
			}
		});

		// On start (if any)
		self.currentState = {};
		if(slide.onstart) slide.onstart(self, self.currentState);

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
		self.boxes.clear();
		self.simulations.clear();
		self.dom.innerHTML = "";
	};

	// Update
	self.update = function(){
		var slide = self.currentSlide;
		self.simulations.update();
		if(slide.onupdate) slide.onupdate(self, self.currentState);
	};

	// Draw
	self.draw = function(){
		self.simulations.draw();
	}

}
