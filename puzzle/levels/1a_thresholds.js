PEEP_STATE_COLORS[2] = "#eebb55";

canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

var initData = {
	"contagion":0,
	"peeps":[[196,200,1],[307,297,2],[199,296,1],[305,199,2]],
	"connections":[[3,2],[3,1]]
}

// Add peeps!
loadNetwork(initData);

// Update
update();
