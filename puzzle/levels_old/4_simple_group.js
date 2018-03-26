canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

PEEP_STATE_COLORS[2] = "#8b9dc3";

/*var initData = {
	"contagion":0,
	"peeps":[[199,165,1],[292,165,1],[146,251,1],[347,251,1],[202,333,1],[297,334,1]],
	"connections":[]
}*/
var initData = {
	"contagion":0,
	"peeps":[[199,165,1],[292,165,1],[146,251,1],[347,251,1],[202,333,1],[297,334,1]],
	"connections":[[4,2],[2,0],[0,1],[1,3],[3,5],[5,4]]
};
_makeUncuttable(initData.connections);

// Add peeps!
loadNetwork(initData);

// Update
update();

// SHOW CONTAGION UI
showContagionUI();

/////////////////////
// TEST EVERY PEEP //
/////////////////////

var PEEP_TO_INFECT = 0;
function _startSimulation(){
	PEEP_TO_INFECT = 0;
	var peep = peeps[PEEP_TO_INFECT];
	peep.infect();
	peep._hack_TESTED = true;
}
function _stopSimulation(){
	peeps.forEach(function(peep){
		peep._hack_TESTED = false;
	});
}
function _stepSimulation(){

	// Everyone infected?
	var everyoneIsInfected = _isEveryoneInfected();

	// If everyone infected, reset! and increment.
	if(everyoneIsInfected){
		PEEP_TO_INFECT++;
		if(peeps[PEEP_TO_INFECT]){
			SIM_STEP = 0;
			_resetToBeforeSimStarted();
			var peep = peeps[PEEP_TO_INFECT];
			peep.infect();
			peep._hack_TESTED = true;
		}else{
			YOU_ARE_WINNER = true;
		}
	}else{

		// Otherwise, keep on infecting.
		_infectPeople();

		// If didn't infect in single step, you MESSED UP.
		everyoneIsInfected = _isEveryoneInfected();
		if(!everyoneIsInfected){
			setTimeout(function(){
				alert("Alas, you did not infect everyone in a SINGLE step!");
				_stopSim();
			},500);
		}

	}


}

function _isEveryoneInfected(){
	var everyoneIsInfected = true;
	peeps.forEach(function(peep){
		if(peep.state!=2) everyoneIsInfected=false;
	});
	return everyoneIsInfected;
}