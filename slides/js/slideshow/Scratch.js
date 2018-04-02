function Scratch(){

	var self = this;
	self.dom = $("#scratch");

	self.scratchIn = function(){
		self.startUpdateLoop(false, function(){
			self.dom.style.display = "none";
		});
	};

	self.scratchOut = function(){
		self.dom.style.display = "block";
		self.startUpdateLoop(true);
	};

	self.startUpdateLoop = function(out, callback){
		var frame = 0;
		var xOffset = out ? 0 : -100;
		var handle = subscribe("update", function(){
			var yOffset = Math.floor(frame)*(-100);
			self.dom.style.backgroundPosition = xOffset+"% "+yOffset+"%";
			if(frame>19){
				unsubscribe(handle);
				if(callback) callback();
				return;
			}
			frame+=0.5;
		});
	};

}