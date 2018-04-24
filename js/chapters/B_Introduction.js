SLIDES.push(

{
	chapter: "Introduction",

	remove:[
		{type:"box", id:"title"},
		{type:"box", id:"button"}
	],

	add:[

		// Splash
		{
			ONLY_IF_IT_DOESNT_ALREADY_EXIST: true,
			type:"sim",
			x:960/2, y:540/2,
			fullscreen: true,
			network: SPLASH_NETWORK,
			options:{
				splash: true,
				randomStart: 20
			}
		},

		// Words
		{
			type:"box",
			id:"intro",
			text:"intro", x:180, y:0, w:600, h:540, align:"center"
		},

	]

},
{
	remove:[
		{ type:"box", id:"intro" }
	],
	add:[
		{
			type:"box",
			id:"intro_2",
			text:"intro_2", x:180, y:0, w:600, h:540, align:"center"
		}
	]
}

);