// 3 - Complex Contagion

SLIDES.push(

{
	chapter: "Complex",
	clear:true,

	add:[

		// Intro text
		{
			type:"box",
			text:"_3_complex",
			x:0, y:0, w:360, h:370
		},

		// Sim
		{
			type:"sim",
			x:0, y:0,
			fullscreen: true,
			network: {
				"contagion":0.25,
				"peeps":[[432,144,1],[438,410,1],[636,139,0],[638,414,0],[789,68,0],[916,101,0],[855,195,0],[798,320,0],[887,346,0],[917,445,0],[840,503,0]],
				"connections":[[0,2,0],[2,4,0],[2,5,0],[6,2,0],[1,3,0],[3,10,0],[3,7,0],[8,3,0],[9,3,0]]
			},
			options:{
				infectedFrame: 3,
				scale: 1.25
			}
		},

		// UI for the simulation
		{
			type:"box",
			x:440, y:225,
			sim_ui:"red"
		},

		// End text
		{
			id:"end",
			type:"box",
			text:"_3_complex_end",
			x:0, y:370, w:360, h:170, align:"right",
			hidden:true
		},

	],

	onupdate:function(slideshow, state){

		// Show end if at least 5 infected
		if(!state.ended){
			var sim = slideshow.simulations.sims[0];
			var peepCount = 0;
			sim.peeps.forEach(function(peep){
				if(peep.infected) peepCount++;
			});
			if(peepCount>=5){
				var boxes = slideshow.boxes;
				boxes.showChildByID("end", true);
				state.ended = true;
			}
		}

	}

},

{
	chapter: "Complex-Cascade",
	clear:true,

	add:[

		// Sim
		{
			type:"sim",
			x:0, y:-140,
			fullscreen: true,
			network: {
				"contagion":0.25,
				"peeps":CASCADE_PUZZLE.peeps,
				"connections":CASCADE_PUZZLE.connections
			},
			options:{
				infectedFrame: 3,
				scale: 1.25,
				startUncuttable: true
			}
		},

		// UI for the simulation
		{
			type:"box",
			x:380, y:290,
			sim_ui:"red"
		},

		// Intro text
		{
			type:"box",
			text:"_3_cascade",
			x:0, y:400, w:600, h:140
		},

		// End text
		{
			id:"end",
			type:"box",
			text:"_3_cascade_end",
			x:660, y:440, w:300, h:100,
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
				sim.win();
			}
		}

	}

},

{
	chapter: "Complex-Prevent",
	clear:true,

	add:[

		// Intro text
		{
			type:"box",
			text:"_3_prevent",
			x:0, y:0, w:350, h:200
		},

		// Lil' contagion
		{
			type:"sim",
			x:0, y:80,
			fullscreen: true,
			network: {
				"contagion":0.25,
				"peeps":CONTAGION_PUZZLE.peeps,
				"connections":CONTAGION_PUZZLE.connections
			},
			options:{
				infectedFrame: 3,
				scale: 1.25,
				startUncuttable: true
			}
		},

		// UI for the simulation
		{
			type:"box",
			x:380, y:140,
			sim_ui:"red"
		},

		// Outro text
		{
			id:"end",
			type:"box",
			text:"_3_prevent_end",
			x:660, y:440, w:300, h:100,
			hidden:true
		}

	],

	onupdate:function(slideshow, state){

		// Show end if sim is running AND no one left to infect
		// that is, it's stalled... YAY!
		var sim = slideshow.simulations.sims[0];

		if(!state.ended){
			if(Simulations.IS_RUNNING){

				// if it's a new step... 
				if(sim.STEP > state.lastStep){

					// ...but the infected count is the same as last step
					var countInfected = 0;
					sim.peeps.forEach(function(peep){ if(peep.infected) countInfected++; });
					if(state.lastInfected == countInfected){

						// oh, and it's NOT coz ALL of 'em are infected
						if(countInfected!=sim.peeps.length){

							// WIN
							var boxes = slideshow.boxes;
							setTimeout(function(){
								boxes.showChildByID("end", true);
								state.ended = true;
								sim.win();
							},500);

						}

					}else{
						state.lastInfected = countInfected;
					}

				}
				state.lastStep = sim.STEP;

			}else{
				state.lastStep = 0;
				state.lastInfected = 1;
			}

		}

	}

}

);