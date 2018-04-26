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
			x:35, y:375,
			sim_ui:"red"
		},

		// Words
		/*{
			type:"box",
			text:"sandbox_caption",
			x:70, y:470, w:550, h:70
		},
		{
			type:"box",
			text:"sandbox_next",
			x:605, y:455, w:300, h:100
		},*/


	]

}
);