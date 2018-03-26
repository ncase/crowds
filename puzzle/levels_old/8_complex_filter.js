canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

var initData = {
	"contagion":1/4,
	"peeps":[[174,87,1],[319,84,1],[195,183,1],[297,178,1],[143,268,1],[60,315,1],[113,404,1],[196,342,1],[299,327,1],[341,250,1],[443,296,1],[378,394,1]],
	"connections":[[2,0],[0,1],[1,3],[3,2],[0,3],[2,1]]
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

var _ticker = 0;
var TEST_STAGE = 1;
var TESTS_PASSED = 0;
var infectedLastCount = 1;
function _onUpdate(){

	if(TEST_STAGE==1){
		PEEP_STATE_COLORS[2] = "#8b9dc3"; // cobalt
	}
	if(TEST_STAGE==2){
		PEEP_STATE_COLORS[2] = "#dd4040"; // red
	}

	if(SIM_IS_RUNNING){
		_ticker++;
		if(_ticker>7){

			// Infect people
			_ticker = 0;
			_infectPeople();
			var countChanged = (infectedLastCount<_numPeopleInfected());
			infectedLastCount = _numPeopleInfected();

			// If Test Stage = 1 (25% contagion) it SHOULD infect everyone
			// pass only when it does
			if(TEST_STAGE==1){
				if(_numPeopleInfected()==peeps.length){
					TESTS_PASSED++;
					_nextPeepTest();
					if(TESTS_PASSED==peeps.length){
						alert("Okay... now testing 33% contagion threshold...");
						TEST_STAGE=2; // NEXT STAGE
						CONTAGION_THRESHOLD = 1/3; // it's 33% THRESHOLD NOW
						TESTS_PASSED = 0;
						PEEP_TO_INFECT = 0;
						_nextPeepTest();
					}
				}else if(!countChanged){
					alert("Alas! You did NOT infect everyone at 25% contagion threshold");
					_stopSim();
				}
			}

			// If Test Stage = 2 (33% contagion) it SHOULD NOT infect everyone
			// pass only when it stays the same
			if(TEST_STAGE==2){
				if(!countChanged){
					TESTS_PASSED++;
					_nextPeepTest();
					if(TESTS_PASSED==peeps.length){
						alert("WIN!");
						YOU_ARE_WINNER = true;
						_stopSim();
					}
				}else if(_numPeopleInfected()==peeps.length){
					alert("Alas! You've infected everyone at 33% contagion threshold");
					_stopSim();
				}
			}

		}
	}
}

var PEEP_TO_INFECT = 0;
var _nextPeepTest = function(){
	_resetToBeforeSimStarted();
	if(TEST_STAGE==2) CONTAGION_THRESHOLD=1/3; // hack
	var peep = peeps[PEEP_TO_INFECT];
	if(!peep) return false;
	peep.infect();
	peep._hack_TESTED = true;
	PEEP_TO_INFECT++;
	infectedLastCount = 1;
	return true;
};

// at 25% contagion, it SHOULD infect everyone
// at 33% contagion, it SHOULD NOT infect everyone

var lastCount = 0;
function _startSimulation(){
	CONTAGION_THRESHOLD = 1/4;
	TEST_STAGE = 1;
	TESTS_PASSED = 0;
	PEEP_TO_INFECT = 0;
	_nextPeepTest();
}
function _stopSimulation(){
	CONTAGION_THRESHOLD = 1/4;
}

function _numPeopleInfected(){
	var count = 0;
	peeps.forEach(function(peep){
		if(peep.state==2) count++;
	});
	return count;
}