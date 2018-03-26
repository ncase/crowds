canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

PEEP_STATE_COLORS[2] = "#8b9dc3";

var initData = {
	"contagion":0.25,
	"peeps":[[46,145,1],[91,79,2],[201,146,1],[168,211,1],[75,215,1],[168,79,1],[325,82,2],[402,78,1],[279,144,1],[320,212,1],[406,215,1],[443,143,1],[197,294,2],[150,353,1],[279,292,1],[320,349,1],[283,419,1],[196,420,1]],
	"connections":[[1,5],[8,6],[6,7],[7,11],[11,10],[10,9],[9,8],[8,7],[11,6],[8,11],[7,9],[9,6],[10,8],[9,11],[0,4],[3,2],[10,6],[10,7]]
}
_makeUncuttable(initData.connections);

// Add peeps!
loadNetwork(initData);

// Update
update();

// SHOW CONTAGION UI
showContagionUI();
