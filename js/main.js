window.onload = function(){

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

	// Start Preloading!
	publish("prepreload");

}

subscribe("START", function(){

	// Music
	SOUNDS.bg_music.volume(0.5);
	SOUNDS.bg_music.loop(true);
	SOUNDS.bg_music.play();

	// Show Navigation
	$("#navigation").style.display = "block";

	// Show Skip Button
	$("#skip").style.display = "block";
	$("#skip").onclick = function(){
		slideshow.next();
	};

	// Introduction
	slideshow.next();

});