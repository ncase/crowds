/******************************

Boxes of HTML. With words and pictures!

******************************/

function Boxes(){

	var self = this;
	self.dom = $("#slideshow");

	self.boxes = [];

	// Clear
	self.clear = function(){
		self.boxes.forEach(function(box){
			self.dom.removeChild(box);
		});
		self.boxes = [];
	};

	// Add Box
	self.add = function(config, withFade){

		// Add to DOM
		var box = document.createElement("div");
		box.className = "box";
		if(!withFade){
			self.dom.appendChild(box);
		}else{
			fadeIn(self.dom, box);
		}

		// Standard box properties...
		if(config.id) box.id = config.id;
		if(config.x) box.style.left = config.x;
		if(config.y) box.style.top = config.y;
		if(config.w) box.style.width = config.w;
		if(config.h) box.style.height = config.h;
		if(config.hidden) box.style.display = "none";

		// words:
		if(config.text){
			box.innerHTML = getWords(config.text);
			if(config.align) box.style.textAlign = config.align;
			if(config.color) box.style.color = config.color;
		}

		// pics:
		if(config.img){
			box.classList.add("image");
			box.style.backgroundImage = "url("+config.img+")"
		}

		// Sim Button
		if(config.sim_button){
			var simButton = SimButton(box, config.sim_button);
		}

		// Replace "next" buttons!
		var next;
		if(next = box.querySelector("next")){
			
			// Create next button
			var nextButton = document.createElement("div");
			nextButton.className = "next_button";
			nextButton.innerHTML = next.innerHTML;
			nextButton.onclick = function(){
				slideshow.next();
			};

			// Replace it in parent!
			next.parentNode.replaceChild(nextButton, next);

		}

		// Replace bonus boxes...
		// TODO

		// Add to array
		self.boxes.push(box);

	};

	// Update & Draw... nothing
	self.update = function(){};
	self.draw = function(){};

	///////////////////////
	// HELPERS AND STUFF //
	///////////////////////

	self.getChildByID = function(id){
		return self.boxes.find(function(box){
			return box.id==id;
		});
	};
	self.showChildByID = function(id){
		var toShow = self.getChildByID(id);
		toShow.style.display = "block";
	};
	self.hideChildByID = function(id){
		var toHide = self.getChildByID(id);
		toHide.style.display = "none";
	};
	self.removeChildByID = function(id, withFade){
		
		var removeBox = self.getChildByID(id);
		if(!withFade){
			self.dom.removeChild(removeBox);
		}else{
			fadeOut(self.dom, removeBox);
		}
		removeFromArray(self.boxes, removeBox);

	};

}

function SimButton(container, color){

	var self = this;
	self.container = container;
	self.container.classList.add("sim_button");

	// RESET
	var smallButton = document.createElement("div");
	smallButton.innerHTML = getWords("sim_reset");
	self.container.appendChild(smallButton);
	smallButton.onclick = function(){
		if(Simulations.IS_RUNNING){
			publish("sim/reset");
			_updateButtonUI();
		}
	};

	// START / NEXT
	var bigButton = document.createElement("div");
	self.container.appendChild(bigButton);
	bigButton.onclick = function(){
		if(!Simulations.IS_RUNNING){
			publish("sim/start");
			_updateButtonUI();
		}else{
			publish("sim/next");
		}
	};

	// Update button UI
	var _updateButtonUI = function(){
		if(!Simulations.IS_RUNNING){
			bigButton.innerHTML = getWords("sim_start");
		}else{
			bigButton.innerHTML = getWords("sim_next");
		}
	};
	_updateButtonUI();

}
