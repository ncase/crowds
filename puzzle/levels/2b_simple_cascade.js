_hack_HIDE_BARS = true;

canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

var initData = {
	"contagion":0,
	"peeps":[[57,72,2],[454,371,1],[418,438,1],[338,408,1],[333,340,1],[406,304,1],[269,116,1],[234,172,1],[305,173,1],[141,88,1],[143,243,1],[82,304,1],[124,366,1],[200,353,1],[215,276,1]],
	"connections":[[6,7],[4,1],[5,4],[4,3],[3,1],[1,2],[1,5],[5,2],[3,5],[4,2],[3,2],[8,6],[8,7],[9,0],[14,10],[10,11],[11,12],[12,13],[13,14],[14,11],[10,12],[13,10],[11,13],[12,14]]
}
_makeUncuttable(initData.connections);

// Add peeps!
loadNetwork(initData);

// Update
update();

// SHOW CONTAGION UI
showContagionUI();

function _onUpdate(){

	// Winner iff EVERYONE is infected!
	var everyoneIsInfected = true;
	peeps.forEach(function(peep){
		if(peep.state!=2) everyoneIsInfected=false;
	});
	YOU_ARE_WINNER = everyoneIsInfected;

}