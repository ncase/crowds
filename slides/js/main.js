window.onload = function(){

	// Setting up the main stuff
	window.simulations = new Simulations();
	window.slideshow = new Slideshow();
	window.pencil = new Pencil();

	// Initializing the Mouse
	Mouse.init(document.body);

	// Animation loop IS update loop for now, whatever
	function update(){

		// Update
		simulations.update();
		slideshow.update();
		pencil.update();
		Mouse.update();

		// Draw
		simulations.draw();
		pencil.draw();
		
		window.requestAnimationFrame(update);

	}
	window.requestAnimationFrame(update);

	// First slide!
	slideshow.gotoChapter("Networks");

}