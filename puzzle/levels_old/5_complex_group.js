canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

PEEP_STATE_COLORS[2] = "#8b9dc3";

var initData = {
	"contagion":1/4,
	"peeps":[[199,165,1],[292,165,1],[146,251,1],[347,251,1],[202,333,1],[297,334,1]],
	"connections":[[4,2],[2,0],[0,1],[1,3],[3,5],[5,4]]
}
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
var lastCount = 0;
function _startSimulation(){
	PEEP_TO_INFECT = 0;
	peeps[PEEP_TO_INFECT].infect();
	peeps[PEEP_TO_INFECT]._hack_TESTED = true;
	lastCount = 1;
}
function _stopSimulation(){
	peeps.forEach(function(peep){
		peep._hack_TESTED = false;
	});
}
function _stepSimulation(){

	_infectPeople();

	// Did count stay the same?
	var countStayedTheSame = (lastCount == _numPeopleInfected());
	lastCount = _numPeopleInfected();

	// If so, yay, next round	
	if(countStayedTheSame){
		PEEP_TO_INFECT++;
		lastCount = 1;
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

		// If everyone's infected, FAIL.
		var everyoneIsInfected = (_numPeopleInfected()==6);
		if(everyoneIsInfected){
			setTimeout(function(){
				alert("Alas, everyone's infected!");
				_stopSim();
			},500);
		}

	}

}

function _numPeopleInfected(){
	var count = 0;
	peeps.forEach(function(peep){
		if(peep.state==2) count++;
	});
	return count;
}

