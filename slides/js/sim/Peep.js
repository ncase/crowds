function Peep(config){
	
	var self = this;

	// Properties
	self.x = config.x;
	self.y = config.y;
	self.infected = !!config.infected;
	self.sim = config.sim;

	// Update:
	self.numFriends = 0;
	self.numInfectedFriends = 0;
	self.faceX = 0;
	self.faceY = 0;
	self.faceBlink = 0;
	self.isMajority = false;
	var _faceFollow = 0.75+(Math.random()*0.1);
	self.update = function(){

		// Face position!
		var faceVector = {
			x: (self.sim.mouse.x-self.x)/5,
			y: (self.sim.mouse.y-self.y)/5
		};
		faceVector.mag = Math.sqrt(faceVector.x*faceVector.x + faceVector.y*faceVector.y);
		var max_distance = 5;
		if(faceVector.mag>max_distance){
			faceVector.x = faceVector.x * (max_distance/faceVector.mag);
			faceVector.y = faceVector.y * (max_distance/faceVector.mag);
		}
		self.faceX = self.faceX*_faceFollow + faceVector.x*(1-_faceFollow);
		self.faceY = self.faceY*_faceFollow + faceVector.y*(1-_faceFollow);

		// Blink?
		if(!self.faceBlink){
			if(Math.random()<0.002) self.faceBlink=true;
		}else{
			if(Math.random()<0.07) self.faceBlink=false;
		}

		// Friends connected... or infected
		var friends = self.sim.getFriendsOf(self);
		self.numFriends = friends.length;
		self.numInfectedFriends = 0;
		friends.forEach(function(friend){
			if(friend.infected) self.numInfectedFriends++;
		});

		// Past threshold?
		self.isPastThreshold = false;
		if(self.sim.contagion==0){
			// simple
			if(self.numInfectedFriends>0) self.isPastThreshold = true;
		}else{
			// complex
			if(self.numFriends>0){
				var ratio = self.numInfectedFriends/self.numFriends;
				if(ratio>=self.sim.contagion-0.0001){ // floating point errors
					self.isPastThreshold = true;
				}
			}
		}

	};

	// Body Sprite
	self.sprite = new Sprite({
		src: "sprites/peeps.png",
		frames:6, sw:200, sh:200,
	});
	self.sprite.pivotX = 100;
	self.sprite.pivotY = 100;
	var _initSpriteScale = 0.3;
	self.sprite.scale = _initSpriteScale;
	//self.sprite.gotoFrame(1);

	// Draw
	var radius = 25;
	var barWidth = radius*1.75;
	var barHeight = 10;
	var bodyRotation = Math.TAU*Math.random();
	var PEEP_COLORS = [
		"#B4B4B4", // gray
		"#F73C50", // red
		"#FEE576", // yellow
		"#86F5FB", // blue
		"#7DE74E", // green
		"#FBCBDC" // pink
	];
	self.draw = function(ctx){

		ctx.save();
		ctx.translate(self.x, self.y);

		var s;
		if(s = self.sim.options.scale) ctx.scale(s,s);

		// Circle
		var infectedFrame = self.sim.options.infectedFrame || 1;
		var infectedColor = PEEP_COLORS[infectedFrame];
		var myFrame = self.infected ? infectedFrame : 0;
		var myColor = PEEP_COLORS[myFrame];
		self.sprite.rotation = bodyRotation;
		if(self.isPastThreshold){ // highlight!

			ctx.globalAlpha = 0.4;
			self.sprite.scale = _initSpriteScale*1.25;
			
			self.sprite.gotoFrame(infectedFrame);
			self.sprite.draw(ctx);

			ctx.globalAlpha = 1;
			self.sprite.scale = _initSpriteScale;

		}
		self.sprite.gotoFrame(myFrame);
		self.sprite.draw(ctx);

		// Face
		ctx.save();
		ctx.translate(self.faceX, self.faceY);
		self.sprite.rotation = 0;
		self.sprite.gotoFrame(self.faceBlink ? 7 : 6);
		self.sprite.draw(ctx);
		ctx.restore();

		//////////////////////////////////////////////////////////
		// LABEL FOR INFECTED/FRIENDS, BAR, AND CONTAGION LEVEL //
		//////////////////////////////////////////////////////////

		// DON'T show bar if simple contagion
		if(self.sim.contagion>0){

			ctx.save();

			var bgColor = "#eee";
			var uiColor = "#666";

			// Say: Infected/Friends (% then n/n)
			ctx.translate(0,-43);
			ctx.font = '10px FuturaHandwritten';
			ctx.fillStyle = uiColor;
			ctx.textBaseline = "middle";
			ctx.fontWeight = "bold";
			ctx.textAlign = "center";
			if(self.numFriends>0){
				var labelNum = self.numInfectedFriends+"/"+self.numFriends;
				var labelPercent = Math.round(100*(self.numInfectedFriends/self.numFriends)) + "%";
				var label = labelNum + "=" + labelPercent;
				ctx.fillText(label, 0, 0);
			}else{
				ctx.fillText("∅", 0, -1);
			}

			// the gray bg
			ctx.translate(0,10);
			ctx.fillStyle = bgColor;
			ctx.beginPath();
			ctx.rect(-barWidth/2, -barHeight/2, barWidth, barHeight);
			ctx.fill();
			
			// the color fill
			if(self.numFriends>0){
				ctx.fillStyle = infectedColor;
				ctx.beginPath();
				ctx.rect(-barWidth/2, -barHeight/2, barWidth*(self.numInfectedFriends/self.numFriends), barHeight);
				ctx.fill();
			}

			// a pointer for contagion level
			ctx.translate(0, -barHeight/2);
			ctx.save();
				ctx.translate(barWidth*self.sim.contagion - barWidth/2, 0);
				ctx.lineCap = "butt";
				ctx.strokeStyle = uiColor;
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(0,0);
				ctx.lineTo(0,barHeight);
				ctx.stroke();
			ctx.restore();

			ctx.restore();

		}

		ctx.restore();

	};

	// Hit Test
	self.hitTest = function(x,y,buffer){
		if(buffer===undefined) buffer=0;
		var dx = self.x-x;
		var dy = self.y-y;
		var dist2 = dx*dx+dy*dy;
		var r = radius+buffer;
		var s;
		if(s = self.sim.options.scale) r*=s;
		return (dist2<r*r);
	};

	// Infect
	self.infect = function(){
		self.infected = true;
	};

}
