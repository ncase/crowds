// 2 - Simple Contagion

// Puzzles for re-use in Complex Contagion...
var CONTAGION_PUZZLE = {
	"peeps":[[53,195,1],[169,297,0],[416,228,0],[323,325,0],[550,234,0],[787,304,0],[627,328,0],[415,419,0],[544,422,0],[906,199,0]],
	"connections":[[0,1],[1,3],[3,2],[3,7],[7,8],[8,6],[6,4],[4,2],[6,5],[5,9]]
};
var CASCADE_PUZZLE = {
	"peeps":[[34,63,1],[171,97,0],[311,179,0],[191,240,0],[309,312,0],[542,77,0],[450,164,0],[528,264,0],[654,229,0],[661,117,0],[869,295,0],[720,337,0],[926,428,0],[845,508,0],[706,464,0]],
	"connections":[[0,1],[3,2],[2,4],[4,3],[6,7],[7,8],[8,9],[9,5],[5,6],[6,9],[9,7],[7,5],[5,8],[8,6],[11,10],[11,14],[14,13],[13,12],[12,10],[11,12],[12,14],[14,10],[10,13],[13,11]]
};

SLIDES.push(
{
	chapter: "Simple",
	clear:true,

	add:[
		// Lil' contagion
		{
			type:"sim",
			x:0, y:80,
			fullscreen: true,
			network: {
				"contagion":0,
				"peeps":CONTAGION_PUZZLE.peeps,
				"connections":CONTAGION_PUZZLE.connections
			},
			options:{
				infectedFrame: 1,
				scale: 1.25
			}
		},
	]

},
{
	chapter: "Simple-Cascade",
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
				infectedFrame: 1,
				scale: 1.25,
				startUncuttable: true
			}
		},
	]

},
);