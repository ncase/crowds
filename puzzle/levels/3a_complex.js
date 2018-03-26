canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

PEEP_STATE_COLORS[2] = "#8b9dc3";

var initData = {
	"contagion":0.25,
	"peeps":[[147,69,2],[77,117,1],[77,185,1],[140,226,1],[402,140,1],[143,307,2],[95,340,1],[68,389,1],[90,436,1],[151,465,1],[398,391,1]],
	"connections":[[0,4],[1,4],[2,4],[3,4],[5,10],[6,10],[7,10],[8,10],[9,10]]
}

// Add peeps!
loadNetwork(initData);

// Update
update();

// SHOW CONTAGION UI
showContagionUI();
