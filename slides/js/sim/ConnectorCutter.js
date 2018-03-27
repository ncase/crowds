function ConnectorCutter(config){

	var self = this;
	self.config = config;
	self.sim = config.sim;

	// Connecting/Cutting
	self.connectFrom = null;
	self.connectTo = null;
	self.isCutting = false;
	self.cutTrail = [];

	// Update!
	self.state = 0; // 0-nothing | 1-connecting | 2-cutting
	self.update = function(){

		var mouse = self.sim.mouse;

		// JUST CLICKED, and state=0... can either start connecting or cutting!
		if(mouse.justPressed && self.state===0){
			
			// Clicked on a peep?
			var peepClicked = self.sim.getHoveredPeep(20);
			if(peepClicked){
				self.state = 1; // START CONNECTING
				self.connectFrom = peepClicked;
			}else{
				self.state = 2; // START ERASING
			}

		}

		// JUST RELEASED, and state!=0... can either stop connecting or cutting!
		if(mouse.justReleased && self.state!==0){

			// End connect?
			if(self.state==1){
				var peepReleased = self.sim.getHoveredPeep(20);
				if(peepReleased){
					self.sim.addConnection(self.connectFrom, peepReleased);
				}
			}

			// back to normal
			self.state = 0; 

		}

		// In "NORMAL" state... tell Pencil what frame to go to
		if(self.state==0){
			var peepHovered = self.sim.getHoveredPeep(20); // buffer of 20px
			pencil.gotoFrame( peepHovered ? 1 : 0 );
		}

		// In "CONNECTING" state... show where to connect to
		if(self.state==1){

			// Connect to a nearby hovered peep?
			var peepHovered = self.sim.getHoveredPeep(20); // buffer of 20px
			if(peepHovered==self.connectFrom) peepHovered=null; // if same, nah
			self.connectTo = peepHovered ? peepHovered : mouse;

			// Pencil's always DARK
			pencil.gotoFrame(1);

		}

		// In "CUTTING" state... cut intersected lines! & add to trail
		if(self.state==2){

			// Try cutting
			var line = [mouse.lastX, mouse.lastY, mouse.x, mouse.y];
			self.sim.tryCuttingConnections(line);
		
			// Add to trail
			self.cutTrail.unshift([mouse.x,mouse.y]); // add to start
			if(self.cutTrail.length>10){
				self.cutTrail.pop(); // remove from end
			}

			// Pencil's always RED
			pencil.gotoFrame(2);

		}else{
			self.cutTrail.pop(); // oh, and if not cutting, pop from end anyway
		}

	};

	// Draw
	self.draw = function(ctx){

		ctx.lineJoin = "round";
		ctx.lineCap = "round";

		// Connecting!
		if(self.state==1){
			ctx.strokeStyle = "#ccc";
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.moveTo(self.connectFrom.x, self.connectFrom.y);
			ctx.lineTo(self.connectTo.x, self.connectTo.y);
			ctx.stroke();
		}

		// Cutting!
		if(self.cutTrail.length>0){
			ctx.strokeStyle = "#dd4040";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(self.cutTrail[0][0], self.cutTrail[0][1]);
			for(var i=1; i<self.cutTrail.length; i++){
				ctx.lineTo(self.cutTrail[i][0], self.cutTrail[i][1]);
			}
			ctx.stroke();
		}

	};

}