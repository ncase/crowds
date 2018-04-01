function Connection(config){

	var self = this;

	// Properties
	self.from = config.from;
	self.to = config.to;
	self.uncuttable = config.uncuttable || false;
	self.sim = config.sim;

	// Sprite
	self.sprite = new Sprite({
		src: "sprites/line.png",
		frames:1, sw:300, sh:20,
	});
	self.sprite.pivotX = 2.8;
	self.sprite.pivotY = 10;

	// Update
	self.update = function(){};

	// Draw
	self.draw = function(ctx){
		/*
		ctx.strokeStyle = "#444";
		ctx.lineWidth = self.uncuttable ? 6 : 3; // thick=uncuttable
		ctx.beginPath();
		ctx.moveTo(self.from.x, self.from.y);
		ctx.lineTo(self.to.x, self.to.y);
		ctx.stroke();
		*/
		ctx.save();
		ctx.translate(self.from.x, self.from.y);
		var dx = self.to.x - self.from.x;
		var dy = self.to.y - self.from.y;
		var a = Math.atan2(dy,dx);
		var dist = Math.sqrt(dx*dx + dy*dy);
		self.sprite.scaleX = dist/300;
		self.sprite.scaleY = self.uncuttable ? 1 : 0.5; // thick=uncuttable
		self.sprite.rotation = a;
		self.sprite.draw(ctx);
		ctx.restore();
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