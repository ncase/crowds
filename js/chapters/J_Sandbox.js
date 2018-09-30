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
				"contagion":0.25,
				"peeps":[[506,195,1],[621,270,0],[724,194,0]],
				"connections":[[0,1,0],[1,2,0]]
			},
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
			x:35, y:400,
			sim_ui:"red"
		},

		// Words
		{
			type:"box",
			text:"sandbox_caption",
			x:660, y:500, w:300, h:40,
			align:"right"
		}


	]

}
);