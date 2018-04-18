// Load just enough for the splash screen
subscribe("prepreload", function(){

	Preload([

		// For the Sim
		{id:"button_large", image:"sprites/button_large.png"},
		{id:"line", image:"sprites/line.png"},
		{id:"peeps", image:"sprites/peeps.png"},
		{id:"pencil", image:"sprites/pencil.png"},

	],function(progress){
		console.log("Pre-Preloader: "+progress);
		if(progress==1){
			var pre_preloader = $("#pre_preloader");
			pre_preloader.parentNode.removeChild(pre_preloader);
			
			//slideshow.gotoChapter("Preloader");
			slideshow.gotoChapter("Networks-Threshold");

			publish("preload");
		}
	});

});

// Load the rest of it
window.PRELOAD_PROGRESS = 0;
subscribe("preload", function(){

	Preload([

		// Music
		{id:"bg_music", audio:"audio/bg_music.mp3"},

		// For the slides
		{id:"sandbox_tools", image:"sprites/sandbox_tools.png"},
		{id:"scratch", image:"sprites/scratch.png"},
		{id:"tutorial_connect", image:"sprites/tutorial_connect.png"},
		{id:"tutorial_disconnect", image:"sprites/tutorial_disconnect.png"},

	],function(progress){
		console.log("Preloader: "+progress);
		window.PRELOAD_PROGRESS = progress;
	});

});


///////////////////////////////////////////
///////////////////////////////////////////

var IMAGES = {}; // todo: actually USE these images
var SOUNDS = {};
function Preload(assets, onProgress){

	var loaded = 0;
	var _onAssetLoad = function(){
		loaded++;
		onProgress(loaded/assets.length);
	};

	assets.forEach(function(asset){

		// Image
		if(asset.image){
			var img = new Image();
			img.onload = _onAssetLoad;
			img.src = asset.image;
			IMAGES[asset.id] = img;
		}

		// Audio
		if(asset.audio){
			var sound = new Howl({ src:[asset.audio] });
			sound.once('load', _onAssetLoad);
			SOUNDS[asset.id] = sound;
		}

	});

}


