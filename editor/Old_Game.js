Math.TAU = Math.PI*2;

var canvas = document.getElementById("canvas");// || document.createElement("canvas");
canvas.style.cursor = "none";
var ctx = canvas.getContext('2d');

var peeps = [];
var connections = [];
var drawing = new Drawing();
var cursor = new Cursor();

var clearNetwork = function(){
	peeps = [];
	connections = [];
};
var loadNetwork = function(data){

	// Clear!
	clearNetwork();

	// Peeps
	data.peeps.forEach(function(p){
		addPeep(p[0], p[1], p[2]);
	});

	// Connections
	data.connections.forEach(function(c){
		var from = peeps[c[0]];
		var to = peeps[c[1]];
		addConnection(from, to);
	});

}
var saveNetwork = function(){
	var data = {
		peeps: [],
		connections: []
	};
	peeps.forEach(function(peep){
		data.peeps.push([peep.x, peep.y, peep.state]);
	});
	connections.forEach(function(c){
		var fromIndex = peeps.indexOf(c.from);
		var toIndex = peeps.indexOf(c.to);
		data.connections.push([fromIndex, toIndex]);
	});
	return data;
}

var DRAW_STATE = 0; // 0-nothing | 1-connecting | 2-erasing
var DRAW_CONNECT_FROM = null;
var CONNECT_FROM_BUFFER = 15;
var CONNECT_TO_BUFFER = 25;

function update(){

	// Mouse logic...
	if(Mouse.justPressed && DRAW_STATE===0){
		
		// Clicked on a peep?
		var peepClicked = _mouseOverPeep(CONNECT_FROM_BUFFER); // buffer of 20px
		if(peepClicked){
			DRAW_CONNECT_FROM = peepClicked;
			DRAW_STATE = 1; // START CONNECTING
			drawing.startConnect(peepClicked); // Drawing logic
		}else{
			DRAW_STATE = 2; // START ERASING
		}

	}
	if(DRAW_STATE==2){ // ERASE

		// Intersect with any connections?
		var line = [Mouse.lastX, Mouse.lastY, Mouse.x, Mouse.y];
		for(var i=connections.length-1; i>=0; i--){ // going BACKWARDS coz killing
			var c = connections[i];
			if(c.hitTest(line)) connections.splice(i,1);
		}
		drawing.startErase(); // Drawing logic

	}
	if(Mouse.justReleased && DRAW_STATE!==0){

		// Connecting peeps, and released on a peep?
		if(DRAW_STATE==1){
			var peepReleased = _mouseOverPeep(CONNECT_TO_BUFFER); // buffer of 20px
			if(peepReleased){ // connect 'em!
				addConnection(DRAW_CONNECT_FROM, peepReleased);
				DRAW_CONNECT_FROM = null;
			}
			drawing.endConnect(); // Drawing logic
		}else if(DRAW_STATE==2){
			drawing.endErase(); // Drawing logic
		}
		DRAW_STATE = 0; // back to normal

	}
	Mouse.update();

	// Cursor Logic
	if(DRAW_STATE==0){
		var peepHovered = _mouseOverPeep(CONNECT_FROM_BUFFER); // buffer of 20px
		if(peepHovered){
			cursor.setMode(Cursor.CONNECT);
		}else{
			cursor.setMode(Cursor.NORMAL);
		}
	}
	if(DRAW_STATE==1){
		cursor.setMode(Cursor.CONNECT);
	}
	if(DRAW_STATE==2){
		cursor.setMode(Cursor.ERASE);
	}

	// Update Logic
	connections.forEach(function(connection){
		connection.update(ctx);
	});
	drawing.update();
	peeps.forEach(function(peep){
		peep.update();
	});
	cursor.update();

	// Draw Logic
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.scale(2,2);
	_preUpdate();
	//ctx.translate(0,100);

		connections.forEach(function(connection){
			connection.draw(ctx);
		});
		drawing.draw(ctx);
		peeps.forEach(function(peep){
			peep.draw(ctx);
		});
		cursor.draw(ctx);

	_onUpdate();
	ctx.restore();

	// RAF
	requestAnimationFrame(update);

}
function _preUpdate(){
	// TO IMPLEMENT
}
function _onUpdate(){
	// TO IMPLEMENT
}

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
		var friends = getConnected(self);
		self.numFriends = friends.length;
		self.numInfectedFriends = 0;
		friends.forEach(function(friend){
			if(friend.state==2) self.numInfectedFriends++;
		});

	};

	// Draw
	var radius = 20;
	var bubbleScale = 1;
	var bubbleScaleVel = 0;
	self.draw = function(ctx){

		ctx.save();
		ctx.translate(self.x, self.y);

		// Circle
		ctx.fillStyle = (self.state==1) ? "#ccc" : "#dd4040"; //"#ffdf00";
		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, Math.TAU, false);
		ctx.fill();

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

		// Say: Infected/Friends
		var label = self.numInfectedFriends + "/" + self.numFriends;
		ctx.font = '12px sans-serif';
		ctx.fillStyle = "#000";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fontWeight = "bold";
		ctx.fillText(label, 0, -27);

		ctx.restore();

	};

	// Hit Test
	self.hitTest = function(x,y,buffer){
		if(buffer===undefined) buffer=0;
		var dx = self.x-x;
		var dy = self.y-y;
		var dist2 = dx*dx+dy*dy;
		var r = radius+buffer;
		return (dist2<r*r);
	};

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

function Connection(config){

	var self = this;

	// Properties
	self.from = config.from;
	self.to = config.to;

	// Update
	self.update = function(){
	};

	// Draw
	self.draw = function(ctx){
		ctx.strokeStyle = "#333";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(self.from.x, self.from.y);
		ctx.lineTo(self.to.x, self.to.y);
		ctx.stroke();
	};

	// Hit Test with a LINE SEGMENT
	// code adapted from https://gist.github.com/Joncom/e8e8d18ebe7fe55c3894
	self.hitTest = function(line){

		var p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y;
		p0_x = line[0];
		p0_y = line[1];
		p1_x = line[2];
		p1_y = line[3];
		p2_x = self.from.x;
		p2_y = self.from.y;
		p3_x = self.to.x;
		p3_y = self.to.y;

    	var s1_x, s1_y, s2_x, s2_y;
	    s1_x = p1_x - p0_x;
	    s1_y = p1_y - p0_y;
	    s2_x = p3_x - p2_x;
	    s2_y = p3_y - p2_y;
	    var s, t;
	    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
	    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

		return (s >= 0 && s <= 1 && t >= 0 && t <= 1);

	};

}
function addConnection(from, to){

	// Don't allow connect if connecting to same...
	if(from==to) return;

	// ...or if already exists, in either direction
	for(var i=0; i<connections.length; i++){
		var c = connections[i];
		if(c.from==from && c.to==to) return;
		if(c.from==to && c.to==from) return;
	}

	// Otherwise, sure!
	connections.push(new Connection({
		from:from, to:to
	}));
	
}
function getConnected(peep){
	var results = [];
	for(var i=0; i<connections.length; i++){ // in either direction
		var c = connections[i];
		if(c.from==peep) results.push(c.to);
		if(c.to==peep) results.push(c.from);
	}
	return results;
}
function removeAllConnectedTo(peep){
	for(var i=connections.length-1; i>=0; i--){ // backwards index coz we're deleting
		var c = connections[i];
		if(c.from==peep || c.to==peep){ // in either direction
			connections.splice(i,1); // remove!
		}
	}
}

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
			ctx.strokeStyle = "#666";
			ctx.lineWidth = 3;
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

var cursorImage = new Image();
cursorImage.src = "cursor.png";
function Cursor(){
	var self = this;

	// MODES
	// 0 - normal
	// 1 - hover, CAN connect
	// 2 - erase
	self.mode = 0;
	self.setMode = function(mode){
		self.mode = mode;
	};

	// Rotate when mouse pressed
	self.rotation = 0; 

	// Update
	self.update = function(){
		var r = Mouse.pressed ? -0.2 : 0;
		self.rotation = self.rotation*0.5 + r*0.5;
	};

	// Draw
	self.draw = function(ctx){
		if(!self.visible) return; // NAH
		ctx.save();
		ctx.translate(Mouse.x, Mouse.y);
		ctx.rotate(self.rotation);
		var sx;
		switch(self.mode){
			case Cursor.NORMAL: sx=0; break;
			case Cursor.CONNECT: sx=1; break;
			case Cursor.ERASE: sx=2; break;
		}
		sx = sx*100;
		ctx.drawImage(cursorImage,
					  sx, 0, 100, 100,
					  0, -40, 40, 40);
		ctx.restore();
	};

	// HIDE OR SHOW
	self.visible = true;
	self.show = function(){
		self.visible = true;
	};
	self.hide = function(){
		self.visible = false;
	};

}
Cursor.NORMAL = 0;
Cursor.CONNECT = 1;
Cursor.ERASE = 2;

/////////////////////////////
// MOUSE ////////////////////
/////////////////////////////

var Mouse = {
	x:0, y:0,
	pressed:false
};
Mouse.ondown = function(event){
	cursor.show();
	Mouse.pressed = true;
	Mouse.onmove(event);
};
Mouse.onmove = function(event){
	cursor.show();
	Mouse.x = event.offsetX;
	Mouse.y = event.offsetY;
};
Mouse.onup = function(event){
	Mouse.pressed = false;
};
Mouse.update = function(){

	// Just pressed, or just released (one frame ago)
	Mouse.justPressed = (!Mouse.lastPressed && Mouse.pressed);
	Mouse.justReleased = (Mouse.lastPressed && !Mouse.pressed);

	// The last frame's stuff
	Mouse.lastX = Mouse.x;
	Mouse.lastY = Mouse.y;
	Mouse.lastPressed = Mouse.pressed;

};
canvas.addEventListener("mousedown", Mouse.ondown);
canvas.addEventListener("mousemove", Mouse.onmove);
window.addEventListener("mouseup", Mouse.onup);

// TOUCH.
function _touchWrapper(callback){
	return function(event){
		var _event = {};
		_event.offsetX = event.changedTouches[0].clientX;
		_event.offsetY = event.changedTouches[0].clientY;
		event.preventDefault();
		callback(_event);
	};
}
canvas.addEventListener("touchstart", _touchWrapper(Mouse.ondown), false);
canvas.addEventListener("touchmove", _touchWrapper(Mouse.onmove), false);
document.body.addEventListener("touchend", function(){
	cursor.hide();
	Mouse.onup();
}, false);



