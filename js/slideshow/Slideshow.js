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
	self.IS_TRANSITIONING = false;
	self.goto = function(index, forceClear){

		// Wait for transition to finish!
		if(self.IS_TRANSITIONING) return;
		self.IS_TRANSITIONING = true;
		
		// Which slide?
		self.slideIndex = index;
		var isFirstSlide = (self.currentSlide==null);
		var slide = SLIDES[self.slideIndex];

		// Clear?
		var _delayNewSlide = 0;
		if((slide.clear || forceClear) && !isFirstSlide){
			_delayNewSlide = 800;
			self.scratch.scratchOut(); // Scratch out
			$("#container").removeAttribute("sim_is_running"); // remove that UI
			Simulations.IS_RUNNING = false; // STAHP
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
						if(self.boxes.getChildByID(childConfig.id)){
							self.boxes.removeChildByID(childConfig.id, withFade);
						}
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
						var box = self.boxes.getChildByID(childConfig.id);
						box.classList.add("transitionable");
						var from = {
							x: parseInt(box.style.left),
							y: parseInt(box.style.top)
						};
						var to = {
							x: (childConfig.x===undefined) ? from.x : childConfig.x,
							y: (childConfig.y===undefined) ? from.y : childConfig.y
						};
						box.style.left = to.x+"px";
						box.style.top = to.y+"px";
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
							if(childConfig.ONLY_IF_IT_DOESNT_ALREADY_EXIST
								&& self.simulations.sims.length>0){
								// then nothing
							}else{
								self.simulations.add(childConfig, withFade);
							}
							break;
					}
				})

			}, _delayAdd);

			// I'm the new slide now
			self.currentSlide = slide;

			// On start (if any)
			self.currentState = {};
			if(slide.onstart) slide.onstart(self, self.currentState);

			// Transition done... sorta!
			_setTimeout(function(){
				self.IS_TRANSITIONING = false;
			},800);

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
		self.goto(index, true);
	};
	self.next = function(){
		if(self.slideIndex >= SLIDES.length-1) return; // there's no next
		self.goto(self.slideIndex+1);
	};

	// Clear out the DOM
	self.clear = function(){
		self.boxes.clear();
		self.simulations.clear();
		self.dom.innerHTML = "";
		pencil.gotoFrame(0);
	};

	// Update
	self.update = function(){
		var slide = self.currentSlide;
		if(slide){
			self.simulations.update();
			if(slide.onupdate) slide.onupdate(self, self.currentState);
		}
	};

	// Draw
	self.draw = function(){
		self.simulations.draw();
	}

}

////////////////////////////////
// BUTTON SOUNDS COZ WHATEVER //
////////////////////////////////

var _BUTTON_SOUND = 0;
subscribe("sound/button",function(){
	_BUTTON_SOUND = (_BUTTON_SOUND+1)%3;
	SOUNDS["button"+_BUTTON_SOUND].play();
});