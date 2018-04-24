function Scratch(){

	var self = this;
	self.canvas = $("#scratch");
	self.ctx = self.canvas.getContext("2d");

	// 711 x 400
	var w = 711;
	var h = 400;

	self.scratchIn = function(){

		// SOUND!
		SOUNDS.scratch_in.play();

		// anim
		self.startUpdateLoop(false, function(){
			self.canvas.style.display = "none";
		});
		
	};

	self.scratchOut = function(){

		// SOUND!
		SOUNDS.scratch_in.play();

		// anim
		self.canvas.style.display = "block";
		self.startUpdateLoop(true);

	};

	self.startUpdateLoop = function(out, callback){
		var frame = 0;
		var xOffset = out ? 0 : w;
		var handle = subscribe("update", function(){
			var yOffset = Math.floor(frame)*h;

			// Redraw canvas
			self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
			self.ctx.drawImage(
				IMAGES.scratch,
				xOffset, yOffset, w, h,
				0, 0, w, h);
			
			// Staaaahhhhhp
			if(frame>19){
				unsubscribe(handle);
				if(callback) callback();
				return;
			}
			frame+=0.5;

		});
	};

}