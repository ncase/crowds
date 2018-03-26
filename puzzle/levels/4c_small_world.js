canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

PEEP_STATE_COLORS[2] = "#8b9dc3";

var initData = {
	"contagion":0.25,
	"peeps":[[190,80,2],[267,70,1],[152,147,1],[316,116,1],[60,300,1],[138,293,1],[40,382,1],[90,449,1],[169,433,1],[194,362,1],[199,206,1],[293,197,1],[346,288,1],[412,311,1],[286,333,1],[433,386,1],[372,437,1],[299,408,1]],
	"connections":[[0,1],[2,10],[11,3],[14,17],[13,12],[16,15],[8,9],[5,4],[6,7]]
}
_makeUncuttable(initData.connections);

// Add peeps!
loadNetwork(initData);

// Update
update();

// SHOW CONTAGION UI
showContagionUI();
