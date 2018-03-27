function Drawing(){

	var self = this;

	// Update!
	self.update = function(){

		// Connection
		if(self.connectFrom){
			// Over any peeps? Connect to THAT! Else, connect to Mouse
			var peepHovered = _mouseOverPeep(CONNECT_TO_BUFFER); // buffer of 20px
			if(peepHovered==self.connectFrom) peepHovered=null; // if same, nah
			self.connectTo = peepHovered ? peepHovered : Mouse;
		}

		// Erase
		if(self.isErasing){
			self.eraseTrail.unshift([Mouse.x,Mouse.y]); // add to start
			if(self.eraseTrail.length>10){
				self.eraseTrail.pop(); // remove from end
			}
		}else{
			self.eraseTrail.pop(); // remove from end
		}

	};

	// Connection!
	self.connectFrom = null;
	self.connectTo = null;
	self.startConnect = function(from){
		self.connectFrom = from;
	};
	self.endConnect = function(){
		self.connectFrom = null;
	};

	// Erase!
	self.isErasing = false;
	self.eraseTrail = [];
	self.startErase = function(){
		self.isErasing = true;
	};
	self.endErase = function(){
		self.isErasing = false;
	};

	// Draw
	self.draw = function(ctx){

		// Connecting...
		if(self.connectFrom){
			ctx.strokeStyle = "#ccc";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(self.connectFrom.x, self.connectFrom.y);
			ctx.lineTo(self.connectTo.x, self.connectTo.y);
			ctx.stroke();
		}

		// Erase
		if(self.eraseTrail.length>0){
			ctx.strokeStyle = "#dd4040";
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(self.eraseTrail[0][0], self.eraseTrail[0][1]);
			for(var i=1; i<self.eraseTrail.length; i++){
				ctx.lineTo(self.eraseTrail[i][0], self.eraseTrail[i][1]);
			}
			ctx.stroke();
		}

	};

}