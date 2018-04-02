// 3 - Complex Contagion

SLIDES.push(
{
	chapter: "Complex",
	clear:true,

	add:[
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
	]

},
{
	chapter: "Complex-Cascade",
	clear:true,

	add:[
		// Lil' contagion
		{
			type:"sim",
			x:0, y:0,
			fullscreen: true,
			network: {
				"contagion":0,
				"peeps":CASCADE_PUZZLE.peeps,
				"connections":CASCADE_PUZZLE.connections
			},
			options:{
				infectedFrame: 3,
				scale: 1.25,
				startUncuttable: true
			}
		},
	]

},
);