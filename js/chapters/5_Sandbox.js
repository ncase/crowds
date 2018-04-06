// 0 - INTRODUCTION
SLIDES.push(
{
	chapter: "Sandbox",
	clear:true,

	add:[

		// The fullscreen simulation
		{
			type:"sim",
			x:0, y:0,
			fullscreen: true,
			network: {
				"contagion":0,
				"peeps":[[443,213,1],[570,309,0],[686,194,0]],
				"connections":[[0,1,0],[1,2,0]]
			}
		},

		// The Sandbox UI
		{
			type:"box",
			x:0, y:0,
			sandbox:true
		},

		// Simulation UI
		{
			type:"box",
			x:35, y:450,
			sim_ui:"red"
		}


	]

}
);