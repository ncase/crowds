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
	self.add = function(config){

		// Add to DOM
		var box = document.createElement("div");
		box.className = "box";
		self.dom.appendChild(box);

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
	self.removeChildByID = function(id){
		var removeBox = self.getChildByID(id);
		self.dom.removeChild(removeBox);
		removeFromArray(self.boxes, removeBox);
	};

}
