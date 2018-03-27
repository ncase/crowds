Math.TAU = Math.PI*2;

var canvas = document.getElementById("canvas");// || document.createElement("canvas");
canvas.style.cursor = "none";
var ctx = canvas.getContext('2d');

var peeps = [];
var connections = [];
var drawing = new Drawing();
var cursor = new Cursor();

var winnerImage = new Image();
winnerImage.src = "img/winner.png";

var CONTAGION_THRESHOLD = 0;
var CONTAGION_THRESHOLD_2 = 0;

var clearNetwork = function(){
	peeps = [];
	connections = [];
};
var loadNetwork = function(data){

	// Clear!
	clearNetwork();

	// Peeps
	data.peeps.forEach(function(p){
		addPeep(p[0], p[1], p[2]);
	});

	// Connections
	data.connections.forEach(function(c){
		var from = peeps[c[0]];
		var to = peeps[c[1]];
		var uncuttable = c[2];
		addConnection(from, to, uncuttable);
	});

	// Contagion threshold?
	if(data.contagion !== undefined){
		CONTAGION_THRESHOLD = data.contagion;
	}else{
		CONTAGION_THRESHOLD = 0;
	}
	if(data.contagion2 !== undefined){
		CONTAGION_THRESHOLD_2 = data.contagion2;
	}else{
		CONTAGION_THRESHOLD_2 = 0;
	}

}
var saveNetwork = function(){
	var data = {
		peeps: [],
		connections: [],
		contagion: CONTAGION_THRESHOLD,
		contagion2: CONTAGION_THRESHOLD_2,
	};
	peeps.forEach(function(peep){
		data.peeps.push([peep.x, peep.y, peep.state]);
	});
	connections.forEach(function(c){
		var fromIndex = peeps.indexOf(c.from);
		var toIndex = peeps.indexOf(c.to);
		data.connections.push([fromIndex, toIndex, c.uncuttable]);
	});
	return data;
}

var DRAW_STATE = 0; // 0-nothing | 1-connecting | 2-erasing
var DRAW_CONNECT_FROM = null;
var CONNECT_FROM_BUFFER = 15;//25;
var CONNECT_TO_BUFFER = 25;

var YOU_ARE_WINNER = false;

function update(){

	// Mouse logic...
	if(SIM_IS_RUNNING){
		DRAW_STATE = 0; // back to normal
		Mouse.update();
	}else{
		if(Mouse.justPressed && DRAW_STATE===0){
			
			// Clicked on a peep?
			var peepClicked = _mouseOverPeep(CONNECT_FROM_BUFFER); // buffer of 20px
			if(peepClicked){
				DRAW_CONNECT_FROM = peepClicked;
				DRAW_STATE = 1; // START CONNECTING
				drawing.startConnect(peepClicked); // Drawing logic
			}else{
				DRAW_STATE = 2; // START ERASING
			}

		}
		if(DRAW_STATE==2){ // ERASE

			// Intersect with any CUTTABLE connections?
			var line = [Mouse.lastX, Mouse.lastY, Mouse.x, Mouse.y];
			for(var i=connections.length-1; i>=0; i--){ // going BACKWARDS coz killing
				var c = connections[i];
				if(c.uncuttable) continue; // don't touch the UNCUTTABLES
				if(c.hitTest(line)) connections.splice(i,1);
			}
			drawing.startErase(); // Drawing logic

		}
		if(Mouse.justReleased && DRAW_STATE!==0){

			// Connecting peeps, and released on a peep?
			if(DRAW_STATE==1){
				var peepReleased = _mouseOverPeep(CONNECT_TO_BUFFER); // buffer of 20px
				if(peepReleased){ // connect 'em!
					addConnection(DRAW_CONNECT_FROM, peepReleased);
					DRAW_CONNECT_FROM = null;
				}
				drawing.endConnect(); // Drawing logic
			}else if(DRAW_STATE==2){
				drawing.endErase(); // Drawing logic
			}
			DRAW_STATE = 0; // back to normal

		}
		Mouse.update();

		// Cursor Logic
		if(DRAW_STATE==0){
			var peepHovered = _mouseOverPeep(CONNECT_FROM_BUFFER); // buffer of 20px
			if(peepHovered){
				cursor.setMode(Cursor.CONNECT);
			}else{
				cursor.setMode(Cursor.NORMAL);
			}
		}
		if(DRAW_STATE==1){
			cursor.setMode(Cursor.CONNECT);
		}
		if(DRAW_STATE==2){
			cursor.setMode(Cursor.ERASE);
		}

	}

	// Update Logic
	connections.forEach(function(connection){
		connection.update(ctx);
	});
	drawing.update();
	peeps.forEach(function(peep){
		peep.update();
	});
	cursor.update();

	// Draw Logic
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = SIM_IS_RUNNING ? "#eee" : "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.scale(2,2);
	_preUpdate();
	//ctx.translate(0,100);

		connections.forEach(function(connection){
			connection.draw(ctx);
		});
		drawing.draw(ctx);
		peeps.forEach(function(peep){
			peep.draw(ctx);
		});
		cursor.draw(ctx);

	_onUpdate();
	if(YOU_ARE_WINNER){
		ctx.drawImage(winnerImage, 0, 0, 500, 500);
	}
	ctx.restore();

	// RAF
	requestAnimationFrame(update);

}
function _preUpdate(){
	// TO IMPLEMENT
}
function _onUpdate(){
	// TO IMPLEMENT
}

///////////////////////////////////////
// CONTAGION UI, WHY NOT HMMMM ////////
///////////////////////////////////////

function $(query){
	return document.querySelector(query);
}

function showContagionUI(){

	// Just display the div
	$("#sim_ui").style.display = "block";
	_updateSimRunningUI();

}

var SIM_IS_RUNNING = false;
var SIM_STEP = 0;
var _updateSimRunningUI = function(){
	if(SIM_IS_RUNNING){
		$("#sim_is_not_running").style.display = "none";
		$("#sim_is_running").style.display = "inline";
		//document.body.style.background = "#777";
		$("#sim_step").innerHTML = SIM_STEP;
	}else{
		$("#sim_is_not_running").style.display = "inline";
		$("#sim_is_running").style.display = "none";
		//document.body.style.background = "";
	}
};


var _networkBeforeSimulationStarted = null;
function _startSim(){
	SIM_STEP = 0;
	SIM_IS_RUNNING = true;
	_networkBeforeSimulationStarted = saveNetwork();
	_updateSimRunningUI();
	_startSimulation();
};
$("#sim_start").onclick = _startSim;
function _stopSim(){
	SIM_IS_RUNNING = false;
	_resetToBeforeSimStarted();
	_updateSimRunningUI();
	_stopSimulation();
};
$("#sim_stop").onclick = _stopSim;
function _simNext(){
	SIM_STEP++;
	_updateSimRunningUI();
	_stepSimulation();
};
$("#sim_next").onclick = _simNext;

function _resetToBeforeSimStarted(){
	loadNetwork(_networkBeforeSimulationStarted);
}
function _startSimulation(){
	// To Implement
}
function _stopSimulation(){
	// To Implement
}
function _stepSimulation(){
	_infectPeople();
}

function _infectPeople(){

	// Consider all peeps, and their friends
	var toInfect = [];
	peeps.forEach(function(peep){

		// How many infected friends?
		if(peep.numFriends==0) return; // No friends? NVM.
		var ratioOfInfectedFriends = peep.numInfectedFriends/peep.numFriends;

		// Passed threshold?
		if(CONTAGION_THRESHOLD==0){ // simple contagion, just ANY friend
			if(peep.numInfectedFriends>0) toInfect.push(peep);
		}else{
			// greater OR EQUALS (fuzz coz floating point)
			if(ratioOfInfectedFriends>=CONTAGION_THRESHOLD-0.0001){
				toInfect.push(peep);
			}
		}

	});

	// "Infect" the peeps who need to get infected
	toInfect.forEach(function(peep){
		peep.infect();
	});

}

