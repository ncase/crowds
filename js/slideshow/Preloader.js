// Load just enough for the splash screen
subscribe("prepreload", function(){

	Preload([

		// For the Sim
		{image:"sprites/button_large.png"},
		{image:"sprites/line.png"},
		{image:"sprites/peeps.png"},
		{image:"sprites/pencil.png"},

	],function(progress){
		console.log("Pre-Preloader: "+progress);
		if(progress==1){
			var pre_preloader = $("#pre_preloader");
			pre_preloader.parentNode.removeChild(pre_preloader);
			slideshow.gotoChapter("Preloader");
			publish("preload");
		}
	});

});

// Load the rest of it
window.PRELOAD_PROGRESS = 0;
subscribe("preload", function(){

	Preload([

		// Music
		{audio:"audio/bg_music.mp3"},

		// For the slides
		{image:"sprites/sandbox_tools.png"},
		{image:"sprites/scratch.png"},
		{image:"sprites/tutorial_connect.png"},
		{image:"sprites/tutorial_disconnect.png"},

	],function(progress){
		console.log("Preloader: "+progress);
		window.PRELOAD_PROGRESS = progress;
	});

});


///////////////////////////////////////////
///////////////////////////////////////////

var preload_images = [];
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
		}

	});

}


