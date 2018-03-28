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
		self.sims = [];
	};

	// Add Sims
	self.add = function(config){
		config = cloneObject(config);
		config.container = self;
		var sim = new Sim(config);
		self.dom.appendChild(sim.canvas);
		self.sims.push(sim);
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
	self.container = config.container;

	// Canvas
	self.fullscreenOffset = {x:0, y:0};
	if(config.fullscreen){
		var container = $("#simulations_container");
		var simOffset = self.container.dom.getBoundingClientRect();
		self.canvas = createCanvas(container.clientWidth, container.clientHeight);
		self.canvas.style.left = -simOffset.x;
		self.canvas.style.top = -simOffset.y;
		self.fullscreenOffset.x = config.x + simOffset.x;
		self.fullscreenOffset.y = config.y + simOffset.y;
	}else{
		self.canvas = createCanvas(config.width||500, config.height||500);
		self.canvas.style.left = config.x || 0;
		self.canvas.style.top = config.y || 0;
	}
	//self.canvas.style.border = "1px solid #ccc";
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
				to = self.peeps[c[1]];
			self.addConnection(from, to, false);
		});
		// todo: "start uncuttable"

		// Contagion
		self.contagion = self.networkConfig.contagion;

	};

	// Update
	self.onupdate = config.onupdate || function(){};
	self.update = function(){

		// "Mouse", offset!
		var canvasBounds = self.canvas.getBoundingClientRect();
		self.mouse = cloneObject(Mouse);
		self.mouse.x -= canvasBounds.x;
		self.mouse.y -= canvasBounds.y;
		self.mouse.lastX -= canvasBounds.x;
		self.mouse.lastY -= canvasBounds.y;
		if(config.fullscreen){
			self.mouse.x -= self.fullscreenOffset.x;
			self.mouse.y -= self.fullscreenOffset.y;
			self.mouse.lastX -= self.fullscreenOffset.x;
			self.mouse.lastY -= self.fullscreenOffset.y;
		}

		// Connector-Cutter
		self.connectorCutter.update();

		// Connections & Peeps
		self.connections.forEach(function(connection){
			connection.update();
		});
		self.peeps.forEach(function(peep){
			peep.update();
		});

		// secret editor...
		// drag Peep
		if(_draggingPeep){
			_draggingPeep.x = self.mouse.x+_draggingOffset.x;
			_draggingPeep.y = self.mouse.y+_draggingOffset.y;
		}

		// On update! (for arbitrary sim-specific logic)
		self.onupdate(self);

	};

	// Draw
	self.draw = function(){

		// Retina
		var ctx = self.ctx;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		// todo: smarter redraw coz, wow, retina.
		ctx.save();
		ctx.scale(2,2);
		if(config.fullscreen){
			ctx.translate(self.fullscreenOffset.x, self.fullscreenOffset.y);
		}

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

	///////////////////////////////
	// secret keyboard interface //
	///////////////////////////////

	// todo: active only when mouse is over MY CANVAS.

	var _draggingPeep = null;
	var _draggingOffset = {x:0,y:0};
	subscribe("key/down/space",function(){
		if(!_draggingPeep){ // prevent double-activation
			var hoveredPeep = self.getHoveredPeep(0);
			if(hoveredPeep){
				_draggingPeep = hoveredPeep;
				_draggingOffset.x = _draggingPeep.x-self.mouse.x;
				_draggingOffset.y = _draggingPeep.y-self.mouse.y;
			}
		}
	});
	subscribe("key/up/space",function(){
		_draggingPeep = null;
	});
	subscribe("key/down/1",function(){
		_addPeepAtMouse(false);
	});
	subscribe("key/down/2",function(){
		_addPeepAtMouse(true);
	});
	var _addPeepAtMouse = function(infected){
		var overlapPeep = self.getHoveredPeep(20);
		if(!overlapPeep){
			self.addPeep(self.mouse.x, self.mouse.y, infected);
		}
	};
	subscribe("key/down/delete",function(){
		var toDeletePeep = self.getHoveredPeep(0);
		if(toDeletePeep) self.removePeep(toDeletePeep);
	});

	self.save = function(){
		var savedNetwork = {
			contagion: self.contagion,
			peeps: [],
			connections: []
		};
		self.peeps.forEach(function(peep){
			savedNetwork.peeps.push([Math.round(peep.x), Math.round(peep.y), peep.infected?1:0]);
		});
		self.connections.forEach(function(c){
			var fromIndex = self.peeps.indexOf(c.from);
			var toIndex = self.peeps.indexOf(c.to);
			savedNetwork.connections.push([fromIndex, toIndex]);
		});
		return JSON.stringify(savedNetwork);
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
	self.removePeep = function(peep){
		self.removeAllConnectedTo(peep); // delete all connections
		self.peeps.splice(self.peeps.indexOf(peep),1); // BYE peep
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
		mouseBuffer = mouseBuffer || 0;
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
	self.removeAllConnectedTo = function(peep){
		for(var i=self.connections.length-1; i>=0; i--){ // backwards index coz we're deleting
			var c = self.connections[i];
			if(c.from==peep || c.to==peep){ // in either direction
				self.connections.splice(i,1); // remove!
			}
		}
	};


	//////////////
	// INIT NOW //
	//////////////

	self.init();

}
