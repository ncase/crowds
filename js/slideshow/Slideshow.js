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
	self.scratch = new Scratch();
	
	// GOTO and NEXT
	var _delay = 300;
	self.goto = function(index){
		
		self.slideIndex = index;
		var isFirstSlide = (self.currentSlide==null);
		var slide = SLIDES[self.slideIndex];

		// Clear?
		var _delayNewSlide = 0;
		if(slide.clear && !isFirstSlide){
			_delayNewSlide = 800;
			self.scratch.scratchOut(); // Scratch out
			$("#container").removeAttribute("sim_is_running"); // remove that UI
		}

		_setTimeout(function(){

			// Scratch in?
			if(_delayNewSlide>0){
				self.clear();
				self.scratch.scratchIn(); // Scratch in
			}

			// Remove stuff
			slide.remove = slide.remove || [];
			slide.remove.forEach(function(childConfig){
				var withFade = true;
				switch(childConfig.type){
					case "box":
						self.boxes.removeChildByID(childConfig.id, withFade);
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
						var newPosition = {
							x: (childConfig.x===undefined) ? sim.config.x : childConfig.x,
							y: (childConfig.y===undefined) ? sim.config.y : childConfig.y
						};
						tweenPosition(sim.config, newPosition);
						break;
				}
			});

			// Add stuff
			slide.add = slide.add || [];
			var _delayAdd = ((slide.remove.length + slide.move.length)>0) ? _delay : 0;
			_setTimeout(function(){
				var withFade = ((slide.remove.length + slide.move.length)>0);

				slide.add.forEach(function(childConfig){
					switch(childConfig.type){
						case "box":
							self.boxes.add(childConfig, withFade);
							break;
						case "sim":
							self.simulations.add(childConfig, withFade);
							break;
					}
				})

			}, _delayAdd);

			// I'm the new slide now
			self.currentSlide = slide;

			// On start (if any)
			self.currentState = {};
			if(slide.onstart) slide.onstart(self, self.currentState);

		}, _delayNewSlide);

		// Tell everyone it's a new chapter
		if(slide.chapter && slide.chapter.indexOf("-")<0){ // is chapter and not sub-chapter
			publish("slideshow/goto/",[slide.chapter]);
		}

	};
	var _setTimeout = function(callback, delay){
		if(delay==0) return callback();
		else setTimeout(callback, delay);
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
