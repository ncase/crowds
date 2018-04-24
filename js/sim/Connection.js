function Connection(config){

	var self = this;

	// Properties
	self.from = config.from;
	self.to = config.to;
	self.uncuttable = config.uncuttable || false;
	self.sim = config.sim;

	// Line Sprite
	self.sprite = new Sprite({
		img: "line",
		frames:1, sw:300, sh:20,
	});
	self.sprite.pivotX = 2.8;
	self.sprite.pivotY = 10;

	// Dot Sprite
	self.dotSprite = new Sprite({
		img: "peeps",
		frames:6, sw:200, sh:200,
	});
	self.dotSprite.pivotX = 100;
	self.dotSprite.pivotY = 100;
	self.dotSprite.scale = 0.1;

	// Update
	self.update = function(){};

	// Draw
	self.draw = function(ctx){

		var s = self.sim.options.scale || 1;

		ctx.save();
		ctx.translate(self.from.x, self.from.y);
		var dx = self.to.x - self.from.x;
		var dy = self.to.y - self.from.y;
		var a = Math.atan2(dy,dx);
		var dist = Math.sqrt(dx*dx + dy*dy);
		ctx.rotate(a);

		// SHAKE
		if(self.shaking>=0 && self.shaking<1){
			self.shaking+=0.05;
			var amplitude = (1-self.shaking)*3;
			ctx.translate(0, Math.sin(self.shaking*Math.TAU*3)*amplitude);
		}

		self.sprite.scaleX = dist/300;
		self.sprite.scaleY = self.uncuttable ? 1 : 0.5; // thick=uncuttable
		//self.sprite.scaleY *= s;
		//self.sprite.rotation = a;
		self.sprite.draw(ctx);
		ctx.restore();

		// DRAW CONTAGION DOT
		if(self.contagionDot){
			var infectedFrame = self.sim.options.infectedFrame || 1;
			self.dotSprite.x = self.contagionDot.x;
			self.dotSprite.y = self.contagionDot.y;
			self.dotSprite.gotoFrame(infectedFrame);
			self.dotSprite.draw(ctx);
		}

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

	// Animate
	self.contagionDot = null;
	self.animate = function(){

		// Infection?
		var cFrom, cTo;
		if(self.from.infected && (!self.to.infected && self.to.isPastThreshold)){
			cFrom = self.from;
			cTo = self.to;
		}
		if(self.to.infected && (!self.from.infected && self.from.isPastThreshold)){
			cFrom = self.to;
			cTo = self.from;
		}

		// boop! 
		if(cFrom && cTo){

			// ANIMATE IT
			cFrom = { x:cFrom.x, y:cFrom.y };
			cTo = { x:cTo.x, y:cTo.y };
			tweenPosition(cFrom, cTo, function(point){
				self.contagionDot = point;
			}, easeLinear);

			// Then, goodbye later
			setTimeout(function(){
				self.contagionDot = null;
			},333);

		}

	};
	self.shaking = -1;
	self.shake = function(){
		self.shaking = 0;
	};

}