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
	self.sandbox_state = 0; // 0-pencil | 1-add_peep | 2-add_infected | 3-move | 4-delete | 5-bomb
	self.update = function(){

		var mouse = self.sim.mouse;

		// TOTAL HACK: if you're clicking within the sandbox UI, FORGET IT
		if(self.sim.SANDBOX_MODE){
			if(mouse.x>0 && mouse.x<280){
				if(mouse.justPressed){
					return; // FORGET ITTTTTT
				}
			}
		}

		// IF SANDBOX STATE = PENCIL, complex mouse shtuff
		if(self.sandbox_state==0){

			// JUST CLICKED & SIM'S RUNNING? STOP
			if(Simulations.IS_RUNNING && mouse.justPressed){
				Simulations.IS_RUNNING = false;
				publish("sim/stop");
			}

			// only if sim is NOT RUNNING
			if(!Simulations.IS_RUNNING){

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

			}else{
				self.state = 0;
			}

			// In "NORMAL" state... tell Pencil what frame to go to
			if(self.state==0){
				if(!Simulations.IS_RUNNING){
					var peepHovered = self.sim.getHoveredPeep(20);
					pencil.gotoFrame( peepHovered ? 1 : 0 );
				}else{
					pencil.gotoFrame(0);
				}
			}

			// In "CONNECTING" state... show where to connect to
			if(self.state==1){

				// Connect to a nearby hovered peep?
				var peepHovered = self.sim.getHoveredPeep(20);
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

				// Pencil's always RED
				pencil.gotoFrame(2);

			}

		}else{
			self.state=0;
		}

		// IF SANDBOX STATE = ADD/DELETE PEEP or BOMB, just click to activate!
		if(self.sandbox_state!=0){
			if(mouse.justPressed){

				// TODO: Publish sound effects!

				// Add Peep
				if(self.sandbox_state==1){
					self.sim._addPeepAtMouse(false); // not infected
				}

				// Add Infected Peep
				if(self.sandbox_state==2){
					self.sim._addPeepAtMouse(true); // IS infected
				}

				// Delete Peep
				if(self.sandbox_state==4){
					self.sim._deletePeep();
				}

				// BOMB
				if(self.sandbox_state==5){
					var contagionLevel = self.sim.contagion; // hack for sandbox: keep contagion the same
					self.sim.clear();
					self.sim.contagion = contagionLevel;
				}

			}
		}

		// IF SANDBOX STATE = MOVE...
		if(self.sandbox_state==3){
			if(mouse.justPressed) self.sim._startMove();
			if(mouse.justReleased) self.sim._stopMove();
		}

		// If trail too long, or NOT cutting, pop trail from end
		if(self.cutTrail.length>10 || self.state!=2 || self.sandbox_state!=0){
			self.cutTrail.pop();
		}

	};

	// Draw
	self.draw = function(ctx){

		ctx.lineJoin = "round";
		ctx.lineCap = "round";

		// Connecting!
		if(self.state==1){
			var tempConnection = new Connection({
				from:self.connectFrom, to:self.connectTo,
				sim:self.sim
			});
			ctx.save();
			ctx.globalAlpha = 0.5;
			tempConnection.draw(ctx);
			ctx.restore();
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