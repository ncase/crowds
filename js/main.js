window.onload = function(){

	// Start Preloading!
	publish("prepreload");

}

subscribe("prepreload/done", function(){

	// Bye Pre-Preloader!
	var pre_preloader = $("#pre_preloader");
	pre_preloader.parentNode.removeChild(pre_preloader);

	// Setting up the main stuff
	window.slideshow = new Slideshow();
	window.pencil = new Pencil();
	window.navigation = new Navigation();

	// Initializing the Mouse
	Mouse.init(document.body);

	// Animation loop IS update loop for now, whatever
	function update(){

		// Update
		slideshow.update();
		pencil.update();
		Mouse.update();

		// Draw
		slideshow.draw();
		pencil.draw();

		// Update
		publish("update");
		
		window.requestAnimationFrame(update);

	}
	window.requestAnimationFrame(update);

	// Go to THE SPLASH
	slideshow.gotoChapter("Preloader");

	// HACK - MOBILE IS HORRIBLE
	$all("a").forEach(function(a){
		a.ontouchstart = function(event){
			event.stopPropagation();
		}; // so you CAN click links
	});

});

subscribe("START", function(){

	// Music
	SOUNDS.bg_music.stop();
	SOUNDS.bg_music.volume(0.5);
	SOUNDS.bg_music.loop(true);
	SOUNDS.bg_music.play();

	// Hide translations, show navigation
	$("#translations").style.display = "none";
	$("#navigation").style.display = "block";

	// Show Skip Button
	var skippy = $("#skip");
	skippy.style.display = "block";
	skippy.onclick = function(){
		publish("sound/button");
		slideshow.next();
	};
	_stopPropButton(skippy);

	// Introduction
	slideshow.next();

});
