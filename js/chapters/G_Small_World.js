SLIDES.push(

{
	chapter: "SmallWorld",
	clear:true,

	add:[

		// Sim
		// use a DRAWING to impose SOFT CONSTRAINTS
		{
			type:"sim",
			x:150, y:0,
			fullscreen: true,
			network: {
				"contagion":0.25,
				"peeps":[[485,50,1],[581,97,0],[389,101,0],[579,200,0],[399,193,0],[487,243,0],[290,312,0],[201,358,0],[196,446,0],[278,509,0],[381,374,0],[367,469,0],[596,370,0],[680,315,0],[778,354,0],[784,454,0],[700,506,0],[604,459,0]],
				"connections":[[13,12,0],[12,17,0],[17,16,0],[16,15,0],[15,14,0],[14,13,0],[12,14,0],[14,17,0],[17,13,0],[13,15,0],[15,12,0],[12,16,0],[16,14,0],[13,16,0],[15,17,0],[7,6,0],[6,10,0],[10,11,0],[11,9,0],[9,8,0],[8,7,0],[7,10,0],[10,9,0],[9,7,0],[6,9,0],[8,11,0],[11,6,0],[6,8,0],[7,11,0],[10,8,0]]
			},
			options:{
				infectedFrame: 3,
				scale: 1,
				startUncuttable: true,
				_wisdom: true
			}
		},

		// UI for the simulation
		{
			type:"box",
			id:"ui",
			x:70, y:180,
			sim_ui:"blue"
		},


		// Words
		{
			type:"box",
			text:"bb_1",
			x:0, y:10, w:350, h:170
		},

		// Words
		{
			id:"end",
			type:"box",
			text:"bb_2",
			x:0, y:270, w:300, h:230,
			hidden: true
		}

	],

	onupdate:function(slideshow, state){

		// If ALL infected...
		var sim = slideshow.simulations.sims[0];
		var peepCount = 0;
		sim.peeps.forEach(function(peep){
			if(peep.infected) peepCount++;
		});

		// Win
		if(!state.ended){
			if(peepCount==sim.peeps.length){
				var boxes = slideshow.boxes;
				boxes.showChildByID("end", true);
				state.ended = true;
				sim.win();
			}
		}

	}

},

{
	chapter: "SmallWorld-Explanation",
	clear:true,
	add:[

		// PIC
		{
			type:"box",
			img:"sprites/small_world.png", x:-10, y:95, w:970, h:284
		},

		// Words
		{
			type:"box",
			text:"bb_small_world_1", x:0, y:0, w:960, h:120,
		},
		{
			type:"box",
			text:"bb_small_world_2", x:0, y:120, w:320, h:50,
			fontSize:"19px", lineHeight:"21px",
			align:"center"
		},
		{
			type:"box",
			text:"bb_small_world_3", x:320, y:120, w:320, h:50,
			fontSize:"19px", lineHeight:"21px",
			align:"center"
		},
		{
			type:"box",
			text:"bb_small_world_4", x:640, y:130, w:320, h:40,
			fontSize:"30px", lineHeight:"30px",
			align:"center"
		},
		{
			type:"box",
			text:"bb_small_world_5", x:0, y:360, w:640, h:180,
		},
		{
			type:"box",
			text:"bb_small_world_end", x:640, y:440, w:320, h:100,
			align:"center"
		}

	]
}

);