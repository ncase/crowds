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
	slideshow.gotoChapter("Sandbox");


});

