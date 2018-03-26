PEEP_STATE_COLORS[2] = "#eebb55"; // yellow
_hack_SHOW_BOTH_STATES = true;
_hack_REINTEGRATION_PUZZLE = true;

canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

var initData = {
	"contagion":1/3,
	"peeps":[[237,70,1],[67,125,1],[172,189,1],[315,185,1],[432,119,1],[249,342,2],[160,381,2],[335,396,2]],
	"connections":[[5,6],[2,0],[0,1],[0,3],[4,0],[5,7]]
};
_makeUncuttable(initData.connections);

// Add peeps!
loadNetwork(initData);

// Update
update();

// SHOW CONTAGION UI
showContagionUI();

function _onUpdate(){

	// Winner iff NO ONE is infected!
	var nooneIsInfected = true;
	peeps.forEach(function(peep){
		if(peep.state==2) nooneIsInfected=false;
	});
	YOU_ARE_WINNER = nooneIsInfected;

}

function _infectPeople(){

	// Consider all peeps, and their friends
	peeps.forEach(function(peep){

		// How many infected friends?
		if(peep.numFriends==0) return; // No friends? NVM.
		var ratioOfInfectedFriends = peep.numInfectedFriends/peep.numFriends;

		// If susceptible, if %>=1/3 of friends infected, get infected
		// If infected, if %<1/3 of friends not infected, get not infected
		peep._NEXT_STATE = peep.state; // default
		if(peep.state==1){
			if(ratioOfInfectedFriends>=1/3){
				peep._NEXT_STATE = 2;
			}
		}
		if(peep.state==2){
			if(ratioOfInfectedFriends<=1/3){
				peep._NEXT_STATE = 1;
			}
		}

	});

	// "Infect" the peeps who need to get infected
	peeps.forEach(function(peep){
		peep.state = peep._NEXT_STATE;
	});

}