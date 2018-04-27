// Load just enough for the splash screen
subscribe("prepreload", function(){

	Preload([

		// For the Splash
		{id:"button_large", image:"sprites/button_large.png"},
		{id:"line", image:"sprites/line.png"},
		{id:"peeps", image:"sprites/peeps.png"},
		{id:"pencil", image:"sprites/pencil.png"},

		// Sound Effects
		{id:"pencil", audio:"audio/pencil.mp3"},
		{id:"pencil_short", audio:"audio/pencil_short.mp3"},
		{id:"snip0", audio:"audio/snip0.mp3"},
		{id:"snip1", audio:"audio/snip1.mp3"},
		{id:"snip2", audio:"audio/snip2.mp3"},

		// UI
		{id:"sound", image:"sprites/ui/sound.png"},
		{id:"sharing", image:"sprites/ui/sharing.png"},

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

		// Music
		{id:"bg_music", audio:"audio/bg_music.mp3"},

		// Sound Effects
		{id:"bonk", audio:"audio/bonk.mp3"},
		{id:"boom", audio:"audio/boom.mp3"},
		{id:"button0", audio:"audio/button0.mp3"},
		{id:"button1", audio:"audio/button1.mp3"},
		{id:"button2", audio:"audio/button2.mp3"},
		{id:"chimes", audio:"audio/chimes.mp3"},
		{id:"contagion", audio:"audio/contagion.mp3"},
		{id:"party", audio:"audio/party.mp3"},
		{id:"party_short", audio:"audio/party_short.mp3"},
		{id:"pluck0", audio:"audio/pluck0.mp3"},
		{id:"pluck1", audio:"audio/pluck1.mp3"},
		{id:"pluck2", audio:"audio/pluck2.mp3"},
		{id:"pluck3", audio:"audio/pluck3.mp3"},
		{id:"pop", audio:"audio/pop.mp3"},
		{id:"scratch_in", audio:"audio/scratch_in.mp3"},
		{id:"scratch_out", audio:"audio/scratch_out.mp3"},
		{id:"squeak_down", audio:"audio/squeak_down.mp3"},
		{id:"squeak_up", audio:"audio/squeak_up.mp3"},
		{id:"trash", audio:"audio/trash.mp3"},

		// For the slides
		{id:"icons/blue", image:"sprites/icons/blue.png"},
		{id:"icons/gray", image:"sprites/icons/gray.png"},
		{id:"icons/red", image:"sprites/icons/red.png"},
		{id:"icons/yellow", image:"sprites/icons/yellow.png"},
		{id:"confetti", image:"sprites/confetti.png"},
		{id:"nasa", image:"sprites/nasa.png"},
		{id:"red_button", image:"sprites/red_button.png"},
		{id:"sandbox_tools", image:"sprites/sandbox_tools.png"},
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


