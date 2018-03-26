canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

PEEP_STATE_COLORS[2] = "#8b9dc3";

var initData = {
	"contagion":0.25,
	"peeps":[[109,87,2],[186,106,1],[219,177,1],[158,251,1],[73,230,1],[46,152,1],[271,302,1],[316,234,1],[410,229,1],[454,318,1],[401,396,1],[307,388,1]],
	"connections":[[11,6],[11,10],[10,9],[9,8],[8,7],[7,6],[6,9],[8,11],[10,7],[7,11],[10,8],[9,11],[6,10],[9,7],[6,8],[3,2],[5,4],[1,0]]
}
_makeUncuttable(initData.connections);

// Add peeps!
loadNetwork(initData);

// Update
update();

// SHOW CONTAGION UI
showContagionUI();