// 0 - INTRODUCTION
SLIDES.push(

{
	chapter: "Conclusion",
	clear:true,

	add:[

		// Words
		{
			type:"box",
			id:"conclusion_1",
			text:"conclusion_1", x:0, y:0, w:960, h:540
		},
		{
			type:"box",
			img:"sprites/conclusion.png", x:-10, y:-15, w:470, h:562
		},

	]

},

{
	chapter: "Conclusion-Splash",
	clear:true,

	add:[

		// Splash
		{
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
			id:"conclusion_2",
			text:"conclusion_2", x:210, y:0, w:540, h:540, align:"center"
		},

	]

},

{

	remove:[
		{type:"box", id:"conclusion_2"}
	],
	add:[
		{
			type:"box",
			id:"conclusion_3",
			text:"conclusion_3", x:210, y:160, w:540, h:220, align:"center"
		}
	]

},

{
	remove:[
		{type:"box", id:"conclusion_3"}
	],
	onstart: function(slideshow, state){
		// splash animation, then auto-next to CREDITS.
		var splash = slideshow.simulations.sims[0];
		splash.options.CONCLUSION = true;
		splash.options.CONCLUSION_GLOW_RADIUS = 0;
		setTimeout(function(){
			slideshow.next();
		},7000);
	},
	onupdate: function(slideshow, state){
		var splash = slideshow.simulations.sims[0];
		splash.options.CONCLUSION_GLOW_RADIUS += 3;
	}
}

);