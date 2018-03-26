_hack_HIDE_BARS = true;

canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

var initData = {
	"goal": "herp derp",
	"contagion": 0,
	"peeps": [
		[27+20,154],[30+20,263],[39+10,444],[73+10,63],[88+10,367],
		[125,210],
		[125,290], // 6
		[140+10,470],[195+5,128],[215+5,358],
		[221,38],[295,450],[332,121],
		[375,290], // 13
		[375,210],
		[378,397],[429,52],[451,183],[445,459],[461,323]
	],
	"connections": [[6,13]]
};

// Add peeps!
loadNetwork(initData);


var instruction1 = new Image();
instruction1.src = "img/instruction_connect.png";
var instruction2 = new Image();
instruction2.src = "img/instruction_disconnect.png";
function _preUpdate(){
	ctx.drawImage(instruction1, 0, 0, 500, 500);
	ctx.drawImage(instruction2, 0, 0, 500, 500);
}



// Update
update();