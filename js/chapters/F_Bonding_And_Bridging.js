SLIDES.push(

{
	chapter: "BB",
	clear:true,

	add:[

		// Sim
		// DRAWING FOR SOFT CONSTRAINTS...
		{
			type:"sim",
			x:0, y:130,
			fullscreen: true,
			network: {
				"contagion":0.25,
				"peeps":[
					[90,-67,1],[181,-71,0],[36,21,0],[107,98,0],[206,92,0],[244,6,0],
					[416,106,1],[352,181,0],[415,267,0],[528,268,0],[595,186,0],[532,107,0],
					[769,-68,1],[701,6,0],[753,96,0],[855,110,0],[928,35,0],[867,-59,0]
				],
				"connections":[[13,12,0],[12,17,0],[16,15,0],[14,13,0],[13,16,0],[14,17,0],[17,15,0],[15,12,0],[12,16,0],[15,13,0],[17,16,0],[14,12,0],[13,17,0],[0,1,0],[2,5,0],[4,3,0],[15,14,0],[14,16,0]]
			},
			options:{
				infectedFrame: 3,
				scale: 1,
				_wisdom: true,
				NO_BONK: true
			}
		},

		// UI for the simulation
		{
			type:"box",
			id:"ui",
			x:370, y:445,
			sim_ui:"blue"
		},

		// Words
		{
			type:"box",
			text:"bonding_1",
			x:230, y:0+15, w:500, h:70,
			align:"center"
		},

		// Words 2
		{
			type:"box",
			text:"bonding_2",
			x:300, y:70+15, w:360, h:100,
			align:"center"
		},

		// Words End
		{
			id:"end",
			type:"box",
			text:"bonding_end",
			x:660, y:290, w:300, h:250,
			hidden:true
		}

	],

	onupdate:function(slideshow, state){

		// If Peeps[6] to Peep[11] pass..
		var sim = slideshow.simulations.sims[0];
		var peepCount = 0;
		for(var i=6; i<=11; i++){
			var peep = sim.peeps[i];
			if(peep.infected) peepCount++;
		}

		// Win
		if(!state.ended){
			if(peepCount==6){
				var boxes = slideshow.boxes;
				boxes.showChildByID("end", true);
				state.ended = true;
				sim.win({
					x:330+5, y:160-120+5,
					width:280, height:280,
					small:true
				});
			}
		}

	}

},

{
	chapter: "BB-Bridge",
	clear:true,

	add:[

		// Sim
		{
			type:"sim",
			x:-70, y:-30,
			fullscreen: true,
			network: {
				"contagion":0.25,
				"peeps":[[182,92,1],[300,106,0],[107,196,0],[151,300,0],[301,309,0],[354,213,0],[441,384,0],[500,290,0],[644,304,0],[691,422,0],[621,510,0],[491,488,0]],
				"connections":[[6,7,1],[7,8,1],[8,9,1],[9,10,1],[10,11,1],[11,6,1],[6,9,1],[9,11,1],[11,8,1],[8,10,1],[10,7,1],[7,9,1],[11,7,1],[6,10,1],[6,8,1],[0,1,1],[1,5,1],[5,4,1],[4,3,1],[2,3,1],[2,0,1],[3,1,1]]
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
			x:95, y:390,
			sim_ui:"blue"
		},

		// Words
		{
			type:"box",
			text:"bridging_1",
			x:340, y:30, w:620, h:120
		},

		// Words End
		{
			id:"end",
			type:"box",
			text:"bridging_end",
			x:660, y:180, w:300, h:360,
			hidden:true
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

}

);