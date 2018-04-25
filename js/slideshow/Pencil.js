/******************************************

THE PENCIL
it's purely visual. replace the cursor
draw / erase / click

******************************************/

function Pencil(){

	var self = this;
	self.canvas = createCanvas( $("#pencil"), 100, 100 );
	self.ctx = self.canvas.getContext('2d');

	// Sprites
	self.sprite = new Sprite({
		img: "pencil",
		frames:3, sw:200, sh:200,
	});
	self.toolsSprite = new Sprite({
		img: "sandbox_tools",
		frames:6, sw:200, sh:200,
	});
	self.sprite.pivotX = self.toolsSprite.pivotX = 0;
	self.sprite.pivotY = self.toolsSprite.pivotY = 200;
	self.sprite.scale = self.toolsSprite.scale = 0.75;

	var _size = 100;
	var _margin = 10;
	var _offset = 10;
	self.colors = [
		"#888",
		"#000",
		"#ff5555"
	];

	// Go to frame?
	self.gotoFrame = function(frame){
		self.sprite.gotoFrame(frame);
	};

	// Update
	self.update = function(){

		// Pencil's rotation
		if(isNaN(self.x)) self.x=0;
		if(isNaN(self.y)) self.y=0;
		var xy_velocity = ((Mouse.x-self.x) + (Mouse.y-self.y))/10; // in down-right direction
		var gotoRotation = -sigmoid(xy_velocity) * Math.TAU/8;
		self.sprite.rotation = self.sprite.rotation*0.8 + gotoRotation*0.2;
		self.toolsSprite.rotation = self.sprite.rotation;

		// Pencil's offset
		var gotoOffset = Mouse.pressed ? -8 : 10;
		_offset = _offset*0.5 + gotoOffset*0.5;

		// Update position
		self.x = Mouse.x;
		self.y = Mouse.y;

	};

	// Draw
	self.draw = function(){
		
		// Move DOM there
		self.canvas.style.left = (self.x-_margin) + "px";
		self.canvas.style.top = (self.y-_size+_margin) + "px";

		// Which sprite? (normal by default...)
		var sprite = self.sprite;
		var sim = slideshow.simulations.sims[0];
		if(sim){
			var frame = sim.connectorCutter.sandbox_state;
			if(frame!=0){
				sprite = self.toolsSprite;
				sprite.gotoFrame(frame);
			}
		}

		// Reset canvas
		var ctx = self.ctx;
		ctx.clearRect(0,0,self.canvas.width,self.canvas.height);
		ctx.save();
		ctx.translate(_margin*2, 200-_margin*2);

			// Draw pencil's dot
			if(!Mouse.pressed){
				ctx.save();
				ctx.fillStyle = self.colors[self.sprite.currentFrame];
				ctx.beginPath();
				ctx.globalAlpha = 0.5;
				ctx.arc(0, 0, 5, 0, Math.TAU);
				ctx.fill();
				ctx.restore();
			}

			// Draw pencil
			sprite.x = _offset;
			sprite.y = -_offset;
			sprite.draw(ctx);

		ctx.restore();

	};

}