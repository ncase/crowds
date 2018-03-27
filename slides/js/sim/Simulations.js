/******************************

An interactive game in the BACKGROUND of the Slideshow...
(if fullscreen, origin is top-left of slideshow)
(if not, allow MULTIPLE canvasses & games.)

******************************/

function Simulations(){

	var self = this;
	self.dom = $("#simulations");

	self.sims = [];

	// Clear All Sims
	self.clear = function(){
		self.sims.forEach(function(sim){
			self.dom.removeChild(sim.canvas);
			sim.kill();
		});
	};

	// Show Sims
	self.showSims = function(simConfigs){
		self.clear();
		simConfigs.forEach(function(simConfig){
			var sim = new Sim(simConfig);
			self.dom.appendChild(sim.canvas);
			self.sims.push(sim);
		});
	};

	// Update
	self.update = function(){
		self.sims.forEach(function(sim){
			sim.update();
		});
	};

	// Draw
	self.draw = function(){
		self.sims.forEach(function(sim){
			sim.draw();
		});
	};

}

function Sim(config){

	var self = this;
	self.config = config;
	self.networkConfig = config.network;

	// Canvas
	self.canvas = createCanvas(500, 500);
	self.canvas.style.left = config.x || 0;
	self.canvas.style.top = config.y || 0;
	self.canvas.style.border = "1px solid #ccc";
	self.ctx = self.canvas.getContext('2d');

	// Mouse, offset!
	self.mouse = {x:0, y:0};

	// Connector-Cutter
	self.connectorCutter = new ConnectorCutter({sim:self});

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
			var from = self.peeps[c[0]],
				to = self.peeps[c[1]],
				uncuttable = c[2];
			self.addConnection(from, to, uncuttable);
		});

		// Contagion
		self.contagion = self.networkConfig.contagion;

	};

	// Update
	self.update = function(){

		// "Mouse", offset!
		var canvasBounds = self.canvas.getBoundingClientRect();
		self.mouse = cloneObject(Mouse);
		self.mouse.x -= canvasBounds.x;
		self.mouse.y -= canvasBounds.y;
		self.mouse.lastX -= canvasBounds.x;
		self.mouse.lastY -= canvasBounds.y;

		// Connector-Cutter
		self.connectorCutter.update();

		// Connections & Peeps
		self.connections.forEach(function(connection){
			connection.update();
		});
		self.peeps.forEach(function(peep){
			peep.update();
		});

	};

	// Draw
	self.draw = function(){

		// Retina
		var ctx = self.ctx;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.save();
		ctx.scale(2,2);

		// Draw all of it!
		self.connectorCutter.draw(ctx);
		self.connections.forEach(function(connection){
			connection.draw(ctx);
		});
		self.peeps.forEach(function(peep){
			peep.draw(ctx);
		});

		ctx.restore();

	};

	// Kill
	self.kill = function(){
		self.clear();
	};

	////////////////
	// HELPERS... //
	////////////////

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
	self.getFriendsOf = function(peep){
		var friends = [];
		for(var i=0; i<self.connections.length; i++){ // in either direction
			var c = self.connections[i];
			if(c.from==peep) friends.push(c.to);
			if(c.to==peep) friends.push(c.from);
		}
		return friends;
	};
	self.getHoveredPeep = function(mouseBuffer){
		return self.peeps.find(function(peep){
			return peep.hitTest(self.mouse.x, self.mouse.y, mouseBuffer);
		});
	};
	self.tryCuttingConnections = function(line){
		for(var i=self.connections.length-1; i>=0; i--){ // going BACKWARDS coz killing connections
			var c = self.connections[i];
			if(c.uncuttable) continue; // don't touch the UNCUTTABLES
			if(c.hitTest(line)) self.connections.splice(i,1);
		}
	};


	//////////////
	// INIT NOW //
	//////////////

	self.init();

}