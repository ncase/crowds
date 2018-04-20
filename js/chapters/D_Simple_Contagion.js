// 2 - Simple Contagion

// Puzzles for re-use in Complex Contagion...
var CONTAGION_PUZZLE = {
	"peeps":[[53,195,1],[169,297,0],[416,228,0],[323,325,0],[550,234,0],[787,304,0],[627,328,0],[415,419,0],[544,422,0],[906,199,0]],
	"connections":[[0,1],[1,3],[3,2],[3,7],[7,8],[8,6],[6,4],[4,2],[6,5],[5,9]]
};
var CASCADE_PUZZLE = {
	"peeps":[[31,201,1],[148,238,0],[267,317,0],[166,392,0],[282,437,0],[481,202,0],[401,284,0],[472,367,0],[590,340,0],[602,236,0],[843,313,0],[719,376,0],[930,413,0],[846,514,0],[728,488,0]],
	"connections":[[0,1,1],[3,2,1],[2,4,1],[4,3,1],[6,7,1],[7,8,1],[8,9,1],[9,5,1],[5,6,1],[6,9,1],[9,7,1],[7,5,1],[5,8,1],[8,6,1],[11,10,1],[11,14,1],[14,13,1],[13,12,1],[12,10,1],[11,12,1],[12,14,1],[14,10,1],[10,13,1],[13,11,1]]
}

SLIDES.push(
{
	chapter: "Simple",
	clear:true,

	add:[

		// Intro text
		{
			type:"box",
			id:"simple_simple",
			text:"simple_simple",
			x:80, y:0, w:800, h:160,
			align: "center"
		},

		// Lil' contagion
		{
			type:"sim",
			id:"contagion",
			x:0, y:80,
			fullscreen: true,
			network: {
				"contagion":0,
				"peeps":CONTAGION_PUZZLE.peeps,
				"connections":CONTAGION_PUZZLE.connections
			},
			options:{
				infectedFrame: 1,
				scale: 1.25,
				_dunce: true
			}
		},

		// UI for the simulation
		{
			type:"box",
			id:"ui",
			x:380, y:165,
			sim_ui:"red"
		},

		// Outro text
		{
			id:"end",
			type:"box",
			text:"simple_simple_end",
			x:660, y:440, w:300, h:100,
			hidden:true
		}

	],

	onupdate:function(slideshow, state){

		// Show end if EVERYONE is infected
		if(!state.ended){
			var sim = slideshow.simulations.sims[0];
			var peepCount = 0;
			sim.peeps.forEach(function(peep){
				if(peep.infected) peepCount++;
			});
			if(peepCount==sim.peeps.length){
				/*var boxes = slideshow.boxes;
				boxes.showChildByID("end", true);*/
				state.ended = true;
				slideshow.next();
			}
		}

	}

},
{
	remove:[
		{type:"box", id:"simple_simple"}
	],
	move:[
		{type:"box", id:"ui", y:5},
		{type:"sim", id:"contagion", y:-80}
	],
	add:[
		{
			type:"box",
			text:"simple_simple_2",
			x:0, y:390, w:650, h:100,
			align: "right"
		},
		{
			type:"box",
			text:"simple_simple_end",
			x:660, y:440, w:300, h:90
		}
	]
},
{
	chapter: "Simple-Cascade",
	clear:true,

	add:[

		// Intro text
		{
			type:"box",
			id:"simple_cascade",
			text:"simple_cascade",
			x:80, y:0, w:800, h:100,
			align: "center"
		},

		// Sim
		{
			type:"sim",
			id:"contagion",
			x:0, y:-60,
			fullscreen: true,
			network: {
				"contagion":0,
				"peeps":CASCADE_PUZZLE.peeps,
				"connections":CASCADE_PUZZLE.connections
			},
			options:{
				infectedFrame: 1,
				scale: 1.25,
				startUncuttable: true,
				_dunce: true
			}
		},

		// UI for the simulation
		{
			type:"box",
			id:"ui",
			x:380, y:360,
			sim_ui:"red"
		},

		// End text
		{
			id:"end",
			type:"box",
			text:"simple_cascade_end",
			x:330, y:460, w:300, h:100,
			hidden:true
		},

	],

	onupdate:function(slideshow, state){

		// Show end if EVERYONE is infected
		if(!state.ended){
			var sim = slideshow.simulations.sims[0];
			var peepCount = 0;
			sim.peeps.forEach(function(peep){
				if(peep.infected) peepCount++;
			});
			if(peepCount==sim.peeps.length){
				var boxes = slideshow.boxes;
				boxes.showChildByID("end", true);
				state.ended = true;
				sim.win({
					small:true,
					x:280, y:200, width:400, height:200
				});
			}
		}

	}

},
{
	remove:[
		{type:"box", id:"simple_cascade"},
		{type:"box", id:"end"}
	],
	move:[
		{type:"box", id:"ui", y:360-80-200},
		{type:"sim", id:"contagion", y:-140-200}
	],
	add:[
		{
			type:"box",
			text:"simple_post_cascade",
			x:80, y:210, w:800, h:150,
			align: "center"
		}/*,
		{
			type:"box",
			text:"simple_post_cascade_end",
			x:660, y:450, w:300, h:90
		}*/
	]
},
);