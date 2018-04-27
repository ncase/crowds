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
			if(box.kill) box.kill();
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
		if(config.x) box.style.left = config.x + "px";
		if(config.y) box.style.top = config.y + "px";
		if(config.w) box.style.width = config.w + "px";
		if(config.h) box.style.height = config.h + "px";
		if(config.hidden) box.style.display = "none";

		// background
		if(config.background){
			box.style.left = "-1000px";
			box.style.top = "-1000px";
			box.style.width = 10000 + "px";
			box.style.height = 10000 + "px";
			box.style.background = config.background;
		}

		// words:
		if(config.text){
			box.innerHTML = getWords(config.text);
			if(config.align) box.style.textAlign = config.align;
			if(config.color) box.style.color = config.color;
			if(config.fontSize) box.style.fontSize = config.fontSize;
			if(config.lineHeight) box.style.lineHeight = config.lineHeight;
		}

		// pics:
		if(config.img){
			box.classList.add("image");
			box.style.backgroundImage = "url("+config.img+")"
		}

		// Sim UI
		if(config.sim_ui){
			var simUI = new SimUI(box, config.sim_ui);
		}

		// Sandbox UI
		if(config.sandbox){
			var sandboxUI = new SandboxUI(box);
		}

		// Replace "next" buttons!
		var next;
		if(next = box.querySelector("next")){
			
			// Create next button
			var nextButton = document.createElement("div");
			nextButton.className = "next_button";
			nextButton.innerHTML = next.innerHTML;
			nextButton.onclick = function(){
				publish("sound/button");
				slideshow.next();
			};

			// to prevent sim from resetting...
			_stopPropButton(nextButton);

			// Replace it in parent!
			next.parentNode.replaceChild(nextButton, next);

		}

		// Add onclicks to "ref"s!
		box.querySelectorAll("ref").forEach(function(ref){
			ref.onclick = function(){
				var id = ref.id;
				publish("reference/show",[id]);
			};
			_stopPropButton(ref);
		});

		// Bonus boxes...
		box.querySelectorAll("bon").forEach(function(bon){
			var title = $("bonus#"+bon.id+" > h3").innerHTML.trim();
			bon.innerHTML = title;
			bon.onclick = function(){
				publish("bonus/show", [bon.id]);
			};
			_stopPropButton(bon);
		});

		// Replace icons
		box.querySelectorAll("icon").forEach(function(icon){

			// Create next button
			var name = icon.getAttribute("name");
			var src = "sprites/icons/"+name+".png";
			var img = new Image();
			img.src = src;
			img.className = "peep_icon";

			// Replace it in parent!
			icon.parentNode.replaceChild(img, icon);

		});

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
	self.showChildByID = function(id, withFade){
		var toShow = self.getChildByID(id);
		if(!withFade){
			toShow.style.display = "block";
		}else{
			fadeIn(self.dom, toShow);
		}
	};
	
	self.removeChildByID = function(id, withFade){
		
		var removeBox = self.getChildByID(id);
		if(!withFade){
			self.dom.removeChild(removeBox);
		}else{
			fadeOut(self.dom, removeBox);
		}
		removeFromArray(self.boxes, removeBox);
		if(removeBox.kill) removeBox.kill();

	};

}
