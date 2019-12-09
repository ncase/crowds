/******************************************

THE SLIDESHOW
- foreground: words & pictures

******************************************/

var SLIDES = [];

function Slideshow(){

	var self = this;

	// The DOM & properties...
	self.dom = $("#slideshow");

	// My stuff...
	self.boxes = new Boxes();
	self.simulations = new Simulations();
	self.scratch = new Scratch();
	
	// GOTO and NEXT
	self.goto = function(index){
	
		// Which slide?
		self.slideIndex = index;
		var slide = SLIDES[self.slideIndex];


		_setTimeout(function(){

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

			} );

			// I'm the new slide now
			self.currentSlide = slide;

		});

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