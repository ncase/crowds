function SimUI(container, color){

	var self = this;
	self.container = container;
	self.container.classList.add("sim_ui");

	// RESET
	var resetButton = document.createElement("div");
	resetButton.id = "reset_button";
	resetButton.innerHTML = getWords("sim_reset");
	self.container.appendChild(resetButton);
	resetButton.onclick = function(){
		if(Simulations.IS_RUNNING){
			publish("sim/reset");
			_updateButtonUI();
		}
	};

	// START / NEXT
	var startButton = document.createElement("div");
	startButton.id = "start_button";
	self.container.appendChild(startButton);
	startButton.onclick = function(){
		if(!Simulations.IS_RUNNING){
			publish("sim/start");
			_updateButtonUI();
		}else{
			publish("sim/next");
		}
	};

	// Update button UI
	var _updateButtonUI = function(){
		if(!Simulations.IS_RUNNING){
			startButton.innerHTML = getWords("sim_start");
			self.container.removeAttribute("active");
		}else{
			startButton.innerHTML = getWords("sim_next");
			self.container.setAttribute("active",true);
		}
	};
	_updateButtonUI();

}
