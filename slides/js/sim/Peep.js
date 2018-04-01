var PEEP_STATE_COLORS = {
	1: "#ccc",
	2: "#dd4040"
};

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

	};

	// Body Sprite
	self.sprite = new Sprite({
		src: "sprites/peeps.png",
		frames:6, sw:200, sh:200,
	});
	self.sprite.pivotX = 100;
	self.sprite.pivotY = 100;
	self.sprite.scale = 0.3;
	//self.sprite.gotoFrame(1);

	// Draw
	var radius = 25;
	var barWidth = 30;
	var barHeight = 10;
	var bodyRotation = Math.TAU*Math.random();
	self.draw = function(ctx){

		ctx.save();
		ctx.translate(self.x, self.y);

		// Circle
		self.sprite.rotation = bodyRotation;
		self.sprite.gotoFrame(self.infected ? 1 : 0);
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

		if(self.sim.contagion>0){

			ctx.save();

			// Say: Infected/Friends
			ctx.translate(0,-42);
			var labelNum = self.numInfectedFriends+"/"+self.numFriends;
			var labelPercent = "";
			if(self.numFriends>0){
				labelPercent = Math.round(100*(self.numInfectedFriends/self.numFriends)) + "%";
			}
			ctx.font = '12px sans-serif';
			ctx.fillStyle = myColor;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fontWeight = "bold";
			ctx.fillText(labelNum, 0, 0);

			// A nice bar
			ctx.translate(0,12);
			ctx.lineWidth = 1;

			// the white fill
			ctx.fillStyle = "#fff";
			ctx.beginPath();
			ctx.rect(-barWidth/2, -barHeight/2, barWidth, barHeight);
			ctx.fill();
			
			// The color fills
			if(self.numFriends>0){
				ctx.fillStyle = PEEP_STATE_COLORS[2]; // state = 2 infected
				ctx.beginPath();
				ctx.rect(-barWidth/2, -barHeight/2, barWidth*(self.numInfectedFriends/self.numFriends), barHeight);
				ctx.fill();
			}

			// The outline
			ctx.strokeStyle = myColor;
			ctx.beginPath();
			if(self.numFriends>0){
				ctx.rect(-barWidth/2, -barHeight/2, barWidth, barHeight);
			}else{
				ctx.rect(-barWidth/2, 0, barWidth, 0);
			}
			ctx.stroke();

			// a pointer for contagion level
			ctx.translate(0, barHeight/2+2);
			self._drawThreshold(ctx, self.sim.contagion);

			// Percent
			ctx.font = '8px sans-serif';
			ctx.fillStyle = "rgba(0,0,0,0.8)";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fontWeight = "bold";
			ctx.fillText(labelPercent, 0, -6);

			ctx.restore();

		}

		ctx.restore();

	};
	self._drawThreshold = function(ctx, threshold){
		ctx.save();
		ctx.translate(barWidth*threshold - barWidth/2, 0);
			
		ctx.strokeStyle = "#000"; //PEEP_STATE_COLORS[2];
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(0,-14);
		ctx.stroke();

		ctx.restore();
	}

	// Hit Test
	self.hitTest = function(x,y,buffer){
		if(buffer===undefined) buffer=0;
		var dx = self.x-x;
		var dy = self.y-y;
		var dist2 = dx*dx+dy*dy;
		var r = radius+buffer;
		return (dist2<r*r);
	};

	// Infect
	self.infect = function(){
		self.infected = true;
	};

}
