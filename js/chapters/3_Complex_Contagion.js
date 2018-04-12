// 3 - Complex Contagion

SLIDES.push(

{
	chapter: "Complex",
	clear:true,

	add:[

		// Intro text
		{
			type:"box",
			id:"_3_complex",
			text:"_3_complex",
			x:0, y:0, w:480, h:540
		},

		// Sim
		{
			type:"sim",
			x:0, y:0,
			fullscreen: true,
			network: {
				"contagion":0.25,
				"peeps":[[819,90,0],[911,182,0],[905,310,0],[821,413,0],[688,252,0],[551,251,1]],
				"connections":[[4,3,0],[2,4,0],[4,1,0],[4,0,0]]
			},
			options:{
				infectedFrame: 3,
				scale: 1.75
			}
		},

		// UI for the simulation
		{
			type:"box",
			x:520, y:340,
			sim_ui:"red"
		}

	],

	onupdate:function(slideshow, state){

		// Show end if ALL infected
		if(!state.ended){
			var sim = slideshow.simulations.sims[0];
			var peepCount = 0;
			sim.peeps.forEach(function(peep){
				if(peep.infected) peepCount++;
			});
			if(peepCount==sim.peeps.length){
				state.ended = true;
				sim.win();
				slideshow.next();
			}
		}

	}

},

{
	remove:[
		{type:"box", id:"_3_complex"}
	],
	add:[
		{
			type:"box",
			text:"_3_complex_2",
			x:0, y:0, w:480, h:540
		}
	]
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