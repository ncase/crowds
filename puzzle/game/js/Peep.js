var PEEP_STATE_COLORS = {
	1: "#ccc",
	2: "#dd4040"
};

function Peep(config){
	
	var self = this;

	// Properties
	self.x = config.x;
	self.y = config.y;
	self.state = config.state;

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
			x: (Mouse.x-self.x)/5,
			y: (Mouse.y-self.y)/5
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
			if(Math.random()<0.09) self.faceBlink=false;
		}

		// Friends connected... or infected
		var friends = self.sim.getConnected(self);
		self.numFriends = friends.length;
		self.numInfectedFriends = 0;
		friends.forEach(function(friend){
			if(friend.state==2) self.numInfectedFriends++;
		});

	};

	// Draw
	var radius = 20;
	var barWidth = 30;
	var barHeight = 10;
	self.draw = function(ctx){

		ctx.save();
		ctx.translate(self.x, self.y);

		// Circle
		//ctx.fillStyle = (self.state==1) ? "#ccc" : "#dd4040"; //"#ffdf00";
		var myColor = PEEP_STATE_COLORS[self.state];
		ctx.fillStyle = myColor;
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, Math.TAU, false);
		ctx.fill();

		// INFECT ON NEXT TURN?
		/*var infectOnNextTurn = (self.numFriends>0 && self.numInfectedFriends/self.numFriends>=CONTAGION_THRESHOLD);
		if(infectOnNextTurn){
			ctx.strokeStyle = PEEP_STATE_COLORS[2];
			ctx.lineWidth = 2;
			ctx.stroke();
		}*/

		// Face
		ctx.save();
		ctx.translate(self.faceX, self.faceY);
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			if(self.faceBlink){
				ctx.beginPath();
				ctx.rect(-14, -1, 8, 2);
				ctx.fill();
				ctx.beginPath();
				ctx.rect(6, -1, 8, 2);
				ctx.fill();
			}else{
				ctx.beginPath();
				ctx.arc(-10, -1, 3, 0, Math.TAU, false);
				ctx.fill();
				ctx.beginPath();
				ctx.arc(10, -1, 3, 0, Math.TAU, false);
				ctx.fill();
			}
			ctx.beginPath();
			ctx.rect(-7, 4, 14, 2);
			ctx.fill();
		ctx.restore();

		//////////////////////////////////////////////////////////
		// LABEL FOR INFECTED/FRIENDS, BAR, AND CONTAGION LEVEL //
		//////////////////////////////////////////////////////////

		//if(!_hack_HIDE_BARS && !self._hack_TESTED){

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
			self._drawThreshold(ctx, CONTAGION_THRESHOLD);

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
		self.state = 2;
	}

}
function _mouseOverPeep(buffer){
	var result;
	peeps.forEach(function(peep){
		if(peep.hitTest(Mouse.x, Mouse.y, buffer)) result=peep;
	});
	return result;
}
function addPeep(x,y, state){
	var peep = new Peep({
		x:x, y:y,
		state: state ? state : 1
	});
	peeps.push(peep);
}
function removePeep(peep){
	removeAllConnectedTo(peep); // remove connections first
	peeps.splice(peeps.indexOf(peep),1); // BYE peep
}