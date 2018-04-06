// 1 - NETWORKS
SLIDES.push(

// PLAY AROUND: how to connect & disconnect
{

	chapter: "Networks",

	clear:true,
	add:[

		// The top instructions
		{
			type:"box",
			text:"_1_tutorial_start", x:280, y:0, w:400, h:70, align:"center"
		},

		// The fullscreen simulation
		{
			type:"sim",
			x:0, y:10,
			fullscreen: true,
			network: {
				"contagion":0,
				"peeps":[[44,184,0],[155,215,0],[237,105,0],[309,213,0],[646,211,0],[328,305,0],[629,308,0],[417,111,0],[539,375,0],[216,299,0],[107,311,0],[-61,220,0],[87,452,0],[733,147,0],[760,293,0],[753,448,0],[744,46,0],[134,33,0],[929,181,0],[848,111,0],[1013,330,0],[880,269,0],[538,128,0],[208,391,0],[853,356,0]],
				"connections":[[5,6]]
			}
		},

		// "Connect" instruction (words & picture)
		{
			type:"box",
			id:"connect_words",
			text:"_1_tutorial_connect", x:280, y:183, w:400, align:"center", color:"#ccc"
		},
		{
			type:"box",
			id:"connect_pic",
			img:"sprites/tutorial_connect.png", x:330, y:150, w:300, h:100
		},

		// "Disconnect" instruction (words & picture)
		{
			type:"box",
			id:"disconnect_words",
			text:"_1_tutorial_disconnect", x:280, y:280, w:400, align:"center", color:"#ccc"
		},
		{
			type:"box",
			id:"disconnect_pic",
			img:"sprites/tutorial_disconnect.png", x:327, y:245, w:300, h:100
		},

		// The bottom instructions & button (hidden at first)
		{
			type:"box",
			id:"end_words",
			text:"_1_tutorial_end", x:230, y:425, w:500, h:70, align:"center",
			//hidden:true
		}

	],

	// Logic to fade in/out words & stuff
	onupdate:function(slideshow, state){

		// Count number of connections this & last time
		var sim = slideshow.simulations.sims[0];
		var numConnections = sim.connections.length;
		if(state.lastConnections===undefined) state.lastConnections=numConnections;
		state.currConnections = numConnections;

		// SHOW/HIDE INSTRUCTIONS
		var boxes = slideshow.boxes;
		// If connections went UP, hide "connect" instructions
		if(state.currConnections > state.lastConnections){
			state.canConnect = true;
			boxes.hideChildByID("connect_words");
			boxes.hideChildByID("connect_pic");
		}
		// If connections went DOWN, hide "connect" instructions
		if(state.currConnections < state.lastConnections){
			state.canDisconnect = true;
			boxes.hideChildByID("disconnect_words");
			boxes.hideChildByID("disconnect_pic");
		}
		// If did both, show end
		if(state.canConnect && state.canDisconnect){
			boxes.showChildByID("end_words");
			//boxes.showChildByID("end_button");
		}

		// update # of connections in state
		state.lastConnections = state.currConnections;

	}

},

// PLAY AROUND: how the "threshold" model workds
// diagonal
{

	chapter: "Networks-Threshold",

	clear:true,
	add:[

		// TEXT
		{
			type:"box",
			id:"_1_threshold",
			text:"_1_threshold", x:80, y:25, w:300
		},
		{
			type:"box",
			id:"_1_threshold_end",
			text:"_1_threshold_end", x:80, y:400, w:300
		},

		// SIMULATION: THRESHOLD
		{
			type:"sim",
			x:400, y:70,
			fullscreen: true,
			network: {
				"contagion":0.5,
				"peeps":[[95,65,0],[417,380,1],[52,340,0],[399,92,1]],
				"connections":[[2,3],[3,1]],
			},
			options:{
				infectedFrame: 2,
				scale: 2
			}
		}

	]
},

// pre-puzzle ramble
{
	remove:[
		{ type:"box", id:"_1_threshold" },
		{ type:"box", id:"_1_threshold_end" }
	],
	add:[
		{
			type:"box",
			id:"_1_pre_puzzle",
			text:"_1_pre_puzzle", x:80, y:25, w:325, h:540
		}
	]
},


// PUZZLE: The "Majority Illusion" puzzle
{

	chapter: "Networks-Majority",

	clear:true,
	add:[

		// The puzzle!
		{
			id:"puzzle",
			type:"sim",
			x:480-250, y:25,
			fullscreen: true,
			network: {
				"contagion":0.5,
				"peeps":[[106,106,1],[239,52,1],[376,110,1],[27,221,0],[54,365,0],[162,458,0],[308,467,0],[407,371,0],[453,241,0]],
				"connections":[],
			},
			options:{
				infectedFrame: 2,
				scale: 1.5
			}
		},

		// Done? Let's go... (hidden at first...)
		{
			type:"box",
			id:"_1_puzzle_end",
			text:"_1_puzzle_end", x:680, y:430, w:300, align:"center",
			hidden:true
		}

	],

	onupdate:function(slideshow, state){

		// Win only if EVERYONE hits threshold
		if(!state.won){

			var sim = slideshow.simulations.sims[0];
			var peepCount = 0;
			sim.peeps.forEach(function(peep){
				if(peep.isPastThreshold) peepCount++;
			});
			if(peepCount==9){
				state.won = true;
				slideshow.boxes.showChildByID("_1_puzzle_end");
				sim.win();
			}

		}

	}

},

// post-puzzle ramble, introduce simple contagion
{
	remove:[
		{ type:"box", id:"_1_puzzle_end" }
	],
	move:[
		// shift sim to side
		{type:"sim", id:"puzzle", x:0}
	],
	add:[
		// new text
		{
			type:"box",
			id:"_1_post_puzzle",
			text:"_1_post_puzzle", x:600, y:0, w:300
		}
	]
}

);