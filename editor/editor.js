window.onload = function(){
	init();
}

canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

var initData;
if(window.location.hash){
	initData = JSON.parse(window.location.hash.substr(1));
}else{
	initData = {
		"goal": "herp derp",
		"contagion": contagionThreshold,
		"peeps": [ [200,200], [300,300] ],
		"connections": [ [0,1] ]
	};
}

function init(){

	// Add peeps!
	_loadData(initData);

	// Update
	update();

}

// KEYS TO ADD & REMOVE PEEPS
window.addEventListener("keydown", function(event){

	// "S" for SAVE
	if(event.keyCode==83){
		event.cancelBubble = true;
		event.stopPropagation();
		event.preventDefault();
		_save();
	}

	// "1" to "2" TO ADD A PEEP
	var keybase = 48;
	if(event.keyCode>=keybase+1 && event.keyCode<=keybase+2){
		// Am I hovering over a peep (no buffer)?
		var peepHovered = _mouseOverPeep(0);
		if(peepHovered){
			removePeep(peepHovered); // If so, DELETE IT
		}else{
			var state = event.keyCode-keybase;
			addPeep(Mouse.x, Mouse.y, state); // If not, ADD ONE
		}
	}

});

// SPACE TO MOVE PEEPS
var movingPeep = null;
var movingPeepOffset = {x:0,y:0}
function _preUpdate(){
	if(movingPeep){
		movingPeep.x = Mouse.x - movingPeepOffset.x;
		movingPeep.y = Mouse.y - movingPeepOffset.y;
	}
}
window.addEventListener("keydown", function(event){
	if(event.keyCode==32){
		var peepHovered = _mouseOverPeep(0);
		if(peepHovered){
			movingPeep = peepHovered;
			movingPeepOffset.x = Mouse.x - movingPeep.x;
			movingPeepOffset.y = Mouse.y - movingPeep.y;
		}
	}
});
window.addEventListener("keyup", function(event){
	if(event.keyCode==32){
		movingPeep = null;
	}
});

// BUTTONS: SAVE / LOAD / CLEAR
var dataTextbox = $("#data");
var _saveData = function(){
	var network = saveNetwork();
	return {
		goal: $("#goal").value,
		contagion: contagionThreshold,
		peeps: network.peeps,
		connections: network.connections
	}
}
var _save = function(){
	var newData;
	if(SIM_IS_RUNNING){
		newData = initData;
	}else{
		newData = _saveData();
	}
	dataTextbox.value = JSON.stringify(newData);
	dataTextbox.select();
	window.location.hash = dataTextbox.value;
};
$("#buttonSave").onclick = _save;
var _loadData = function(data){
	loadNetwork(data);
	$("#goal").value = data.goal;
	$("#contagionSlider").value = Math.round(data.contagion*12);
	_getThreshold();
}
$("#buttonLoad").onclick = function(){
	try{
		var data = JSON.parse(dataTextbox.value);
		_loadData(data);
		dataTextbox.value = "loaded!";
	}catch(e){
		alert("DATA AIN'T PROPER JSON, YO");
	}
};
$("#buttonClear").onclick = function(){
	clearNetwork();
};

// Editing the Mission Goal statement: DON'T PROPAGATE KEYS
$("#goal").addEventListener("keydown", function(event){
	event.cancelBubble = true;
	event.stopPropagation();
});



/////////////////////////////////////////
//// RUN THE SIMULATION, YO /////////////
/////////////////////////////////////////

var SIM_IS_RUNNING = false;
var SIM_STEP = 0;
var _updateSimRunningUI = function(){
	if(SIM_IS_RUNNING){
		$("#simIsNotRunning").style.display = "none";
		$("#simIsRunning").style.display = "inline";
		document.body.style.background = "#777";
		$("#sim_step").innerHTML = SIM_STEP;
	}else{
		$("#simIsNotRunning").style.display = "inline";
		$("#simIsRunning").style.display = "none";
		document.body.style.background = "";
	}
};
_updateSimRunningUI();
$("#simStart").onclick = function(){
	SIM_STEP = 0;
	SIM_IS_RUNNING = true;
	initData = _saveData();
	_updateSimRunningUI();
};
$("#simStop").onclick = function(){
	SIM_IS_RUNNING = false;
	_loadData(initData);
	update();
	_updateSimRunningUI();
};

var contagionThreshold = 0;
var _getThreshold = function(){
	contagionThreshold = $("#contagionSlider").value/12;
	$("#contagionLabel").innerHTML = Math.floor(contagionThreshold*100)+"%";
}
$("#contagionSlider").oninput = _getThreshold;
_getThreshold();

function stepSimulation(){
	
	// Consider all peeps, and their friends
	var toInfect = [];
	peeps.forEach(function(peep){

		// How many infected friends?
		if(peep.numFriends==0) return; // No friends? NVM.
		var ratioOfInfectedFriends = peep.numInfectedFriends/peep.numFriends;

		// Passed threshold?
		if(contagionThreshold==0){ // simple contagion, just ANY friend
			if(peep.numInfectedFriends>0) toInfect.push(peep);
		}else{
			// greater OR EQUALS (fuzz coz floating point)
			if(ratioOfInfectedFriends>=contagionThreshold-0.0001){
				toInfect.push(peep);
			}
		}

	});

	// "Infect" the peeps who need to get infected
	toInfect.forEach(function(peep){
		peep.state = 2;
	});

}
$("#simNext").onclick = function(){
	SIM_STEP++;
	_updateSimRunningUI();
	stepSimulation();
};

function $(query){
	return document.querySelector(query);
}
