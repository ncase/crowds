canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

var initData = {
	"contagion":0,
	"peeps":[[72,85,2],[335,203,1],[417,256,1],[442,344,1],[374,421,1],[272,416,1],[205,330,1],[243,246,1],[111,232,1],[214,112,1]],
	"connections":[[8,9],[7,2],[2,6],[6,1],[7,6],[6,5],[5,1],[1,4],[3,1],[2,1],[1,7],[7,3],[7,4],[5,7],[6,3],[6,4],[5,2],[5,3],[5,4],[4,2],[4,3],[3,2]]
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