/******************************

An interactive game in the BACKGROUND of the Slideshow...
(if fullscreen, origin is top-left of slideshow)
(if not, allow MULTIPLE canvasses & games.)

******************************/

function Simulations(){

	var self = this;
	self.dom = $("#simulations");

	self.sims = [];

	self.clear = function(){
		self.sims.forEach(function(sim){
			self.dom.removeChild(sim.canvas);
			sim.kill();
		});
	};
	self.showSims = function(simConfigs){
		self.clear();
		simConfigs.forEach(function(simConfig){
			var sim = new Sim(simConfig);
			self.dom.appendChild(sim.canvas);
			self.sims.push(sim);
		});
	};

}

function Sim(config){

	var self = this;
	self.config = config;
	self.networkConfig = config.network;

	// Canvas
	self.canvas = createCanvas(500, 500);
	self.ctx = self.canvas.getContext('2d');

	// Networks... clear/init
	self.clear = function(){
		self.peeps = [];
		self.connections = [];
		self.contagion = 0;
	};
	self.init = function(){

		// Clear!
		self.clear();

		// Peeps
		self.networkConfig.peeps.forEach(function(p){
			var x = p[0],
				y = p[1],
				infected = p[2];
			self.addPeep(x, y, infected);
		});

		// Connections
		self.networkConfig.connections.forEach(function(c){
			var from = peeps[c[0]],
				to = peeps[c[1]],
				uncuttable = c[2];
			self.addConnection(from, to, uncuttable);
		});

	};

	// Add Peeps/Connections
	self.addPeep = function(x, y, infected){
		var peep = new Peep({ x:x, y:y, infected:infected, sim:self });
		self.peeps.push(peep);
		return peep;
	};
	self.addConnection = function(from, to, uncuttable){

		// Don't allow connecting to self...
		if(from==to) return;

		// ...or if already exists, in either direction
		for(var i=0; i<self.connections.length; i++){
			var c = self.connections[i];
			if(c.from==from && c.to==to) return;
			if(c.from==to && c.to==from) return;
		}

		// Otherwise, go ahead and add it!
		var connection = new Connection({ from:from, to:to, uncuttable:uncuttable, sim:self });
		self.connections.push(connection);
		return connection;

	};

	// Update
	self.update = function(){
	};

	// INIT NOW
	self.init();

}