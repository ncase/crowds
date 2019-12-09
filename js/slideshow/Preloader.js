// Load just enough for the splash screen
subscribe("prepreload", function(){

	Preload([

		// For the Splash
		{id:"button_large", image:"sprites/button_large.png"},
		{id:"line", image:"sprites/line.png"},
		{id:"peeps", image:"sprites/peeps.png"},
		{id:"pencil", image:"sprites/pencil.png"},

	],function(progress){
		if(progress==1){
			publish("prepreload/done");
			publish("preload");
		}
	});

});

// Load the rest of it
window.PRELOAD_PROGRESS = 0;
subscribe("preload", function(){

	Preload([

		// For the slides
		{id:"red_button", image:"sprites/red_button.png"},
		{id:"scratch", image:"sprites/scratch.png"},
		{id:"small_world", image:"sprites/small_world.png"},
		{id:"tutorial_connect", image:"sprites/tutorial_connect.png"},
		{id:"tutorial_disconnect", image:"sprites/tutorial_disconnect.png"},

		// UI
		{id:"arrow", image:"sprites/ui/arrow.png"},
		{id:"bonus", image:"sprites/ui/bonus.png"}

	],function(progress){
		window.PRELOAD_PROGRESS = progress;
	});

});


///////////////////////////////////////////
///////////////////////////////////////////

var IMAGES = {}; // todo: actually USE these images
function Preload(assets, onProgress){

	var loaded = 0;
	var _onAssetLoad = function(){
		loaded++;
		onProgress(1);
	};

	assets.forEach(function(asset){

		// Image
		if(asset.image){
			var img = new Image();
			img.onload = _onAssetLoad;
			img.src = asset.image;
			IMAGES[asset.id] = img;
		}


	});

}


