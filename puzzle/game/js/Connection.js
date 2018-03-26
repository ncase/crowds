function Connection(config){

	var self = this;

	// Properties
	self.from = config.from;
	self.to = config.to;
	self.uncuttable = config.uncuttable || false;

	// Update
	self.update = function(){
	};

	// Draw
	self.draw = function(ctx){
		ctx.strokeStyle = self.uncuttable ? "#000" : "#888";
		ctx.lineWidth = 2; //self.uncuttable ? 3 : 2;
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
function addConnection(from, to, uncuttable){

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
		from:from, to:to,
		uncuttable:uncuttable
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
function _makeUncuttable(arrayOfConnections){
	for(var i=0; i<arrayOfConnections.length; i++){
		arrayOfConnections[i].push(true);
	}
}