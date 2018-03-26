Cursor.NORMAL = 0;
Cursor.CONNECT = 1;
Cursor.ERASE = 2;

var cursorImage = new Image();
cursorImage.src = "img/cursor.png";

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