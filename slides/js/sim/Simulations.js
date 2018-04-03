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

	////////////////////////
	// SIMULATION RUNNING //
	////////////////////////

	subscribe("sim/start", function(){
		Simulations.IS_RUNNING = true;
		self.sims.forEach(function(sim){
			sim.save(); // save for later resetting
		});
		publish("sim/next");
	});
	subscribe("sim/reset", function(){
		Simulations.IS_RUNNING = false;
		self.sims.forEach(function(sim){
			sim.reload(); // reload the network pre-sim
		});
	});
	subscribe("sim/next", function(){
		self.sims.forEach(function(sim){
			sim.nextStep();
		});
	});

	///////////////////////
	// HELPERS AND STUFF //
	///////////////////////

	// Get Child!
	self.getChildByID = function(id){
		return self.sims.find(function(sim){
			return sim.id==id;
		});
	};

}

function Sim(config){

	var self = this;
	self.config = config;
	self.networkConfig = cloneObject(config.network);
	self.container = config.container;
	self.options = config.options || {};

	self.id = config.id;

	// Canvas
	if(config.fullscreen){
		var container = $("#simulations_container");
		var simOffset = self.container.dom.getBoundingClientRect();
		self.canvas = createCanvas(container.clientWidth, container.clientHeight);
		self.canvas.style.left = -simOffset.x;
		self.canvas.style.top = -simOffset.y;
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
		if(self.options.startUncuttable){
			self.connections.forEach(function(c){
				c.uncuttable = true;
			});
		}

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
			var fullscreenOffsetX = config.x + simOffset.x;
			var fullscreenOffsetY = config.y + simOffset.y;
			self.mouse.x -= fullscreenOffsetX;
			self.mouse.y -= fullscreenOffsetY;
			self.mouse.lastX -= fullscreenOffsetX;
			self.mouse.lastY -= fullscreenOffsetY;
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

		// update confetti & winword...
		self.confetti.forEach(function(confetti){

			confetti.x += confetti.vx;
			confetti.y += confetti.vy;
			confetti.spin += confetti.spinSpeed;

			confetti.vy += confetti.g;

			confetti.vx *= 0.95;
			confetti.vy *= 0.95;

		});
		if(self.winWord.ticker>=0){
			self.winWord.ticker += 1/60;
			if(self.winWord.ticker>5){
				self.winWord.ticker = -1;
			}
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
			var fullscreenOffsetX = config.x + simOffset.x;
			var fullscreenOffsetY = config.y + simOffset.y;
			ctx.translate(fullscreenOffsetX, fullscreenOffsetY);
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

		// Draw confetti - NOT AFFECTED BY TRANSFORMS.
		ctx.fillStyle = "#dd4040";
		self.confetti.forEach(function(confetti){
			ctx.save();
			var offsetX = -Math.sin(confetti.spin)*9;
			ctx.translate(confetti.x+offsetX, confetti.y);
			ctx.rotate(Math.sin(confetti.spin)*0.2);
			ctx.beginPath();
			ctx.rect(-20,-10,40,20);
			ctx.fill();
			ctx.restore();
		});

		// Draw WIN WORD
		if(self.winWord.ticker>=0){

			ctx.save();
			ctx.translate(self.winWord.x, self.winWord.y);
			ctx.scale(2,2); // retina

			// expand
			if(self.winWord.ticker<0.2){
				var scale = self.winWord.ticker/0.2;
				ctx.scale(scale,scale);
			}

			// fade away
			if(self.winWord.ticker>4){
				var alpha = -(self.winWord.ticker-5);
				ctx.globalAlpha = alpha;
			}

			ctx.font = '80px FuturaHandwritten';
			ctx.fillStyle = "#000";
			ctx.textBaseline = "middle";
			ctx.fontWeight = "bold";
			ctx.textAlign = "center";
			var label = getWords("WIN");
			ctx.fillText(label, 0, 0);

			ctx.restore();

		}

	};

	// Kill
	self.kill = function(){
		self.clear();
	};

	///////////////////
	// WINNER WINNER //
	///////////////////

	self.wonBefore = false;
	self.confetti = [];
	self.winWord = {x:0, y:0, ticker:-1};

	self.win = function(){

		// ONLY ONCE
		if(self.wonBefore) return;
		self.wonBefore = true;

		// Get center of peeps
		var fullscreenOffsetX = config.x + simOffset.x;
		var fullscreenOffsetY = config.y + simOffset.y;
		var bounds = getBoundsOfPoints(self.peeps);
		var cx = bounds.x + bounds.width/2;
		var cy = bounds.y + bounds.height/2;
		cx += fullscreenOffsetX;
		cy += fullscreenOffsetY;
		cx *= 2; // retina
		cy *= 2; // retina

		// Place Win Word
		self.winWord.x = cx;
		self.winWord.y = cy;
		self.winWord.ticker = 0;

		// Place confetti
		for(var i=0; i<100; i++){
			var angle = Math.random()*Math.TAU;
			var burst = bounds.width/15;
			var frame = Math.floor(Math.random()*5);
			var spinSpeed = 0.03+Math.random()*0.03;
			var confetti = {
				x: cx,
				y: cy,
				vx: Math.cos(angle)*Math.random()*burst,
				vy: Math.sin(angle)*Math.random()*burst - burst*0.25,
				frame: frame,
				spinSpeed: spinSpeed,
				spin: Math.random()*Math.TAU,
				g: 0.05+Math.random()*0.10
			};
			self.confetti.push(confetti);
		}

	};

	////////////////////////
	// SIMULATION RUNNING //
	////////////////////////

	self.save = function(){
		self.networkConfig = self.getCurrentNetwork();
	};

	self.reload = function(){
		self.init();
	};

	self.nextStep = function(){

		// "Infect" the peeps who need to get infected
		// TODO: Connection animation
		self.peeps.filter(function(peep){
			return peep.isPastThreshold;
		}).forEach(function(peep){
			peep.infect();
		});

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

	self.getCurrentNetwork = function(){
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
		return savedNetwork;
	};
	self.serialize = function(){
		var savedNetwork = self.getCurrentNetwork();
		return '{\n'+
		'\t"contagion":'+savedNetwork.contagion+",\n"+
		'\t"peeps":'+JSON.stringify(savedNetwork.peeps)+",\n"+
		'\t"connections":'+JSON.stringify(savedNetwork.connections)+"\n"+
		'}';
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
		removeFromArray(self.peeps, peep); // BYE peep
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
