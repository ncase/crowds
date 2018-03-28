window.onload = function(){

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
		
		window.requestAnimationFrame(update);

	}
	window.requestAnimationFrame(update);

	// First slide!
	slideshow.gotoChapter("Networks");

}