function Sprite(config){

	var self = this;
	self.config = config;

	// Properties...
	self.x = 0;
	self.y = 0;
	self.pivotX = 0;
	self.pivotY = 0;
	self.scale = null;
	self.scaleX = 1;
	self.scaleY = 1;
	self.rotation = 0; // radians

	// Frames
	self.currentFrame = 0;
	self.totalFrames = config.frames;
	self.nextFrame = function(){
		self.currentFrame = (self.currentFrame+1)%self.totalFrames;
	};
	self.gotoFrame = function(frame){
		self.currentFrame = frame;
	};

	// Draw
	self.draw = function(ctx){
		
		var sw = config.sw;
		var sh = config.sh;
		var sx = self.currentFrame*sw;
		var sy = 0;

		ctx.save();
		ctx.translate(self.x, self.y);
		ctx.rotate(self.rotation);
		if(self.scale){
			ctx.scale(self.scale, self.scale);
		}else{
			ctx.scale(self.scaleX, self.scaleY);
		}
		ctx.translate(-self.pivotX, -self.pivotY);
		var image = IMAGES[config.img];
		ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
		ctx.restore();

	};

}