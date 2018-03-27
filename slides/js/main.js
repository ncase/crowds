window.onload = function(){

	// Setting up the main stuff
	window.simulations = new Simulations();
	window.slideshow = new Slideshow();
	window.pencil = new Pencil();

	// Initializing the Mouse
	Mouse.init(document.body);

	// Animation loop IS update loop, whatever
	function update(){
		simulations.update();
		slideshow.update();
		pencil.update();
		window.requestAnimationFrame(update);
	}
	window.requestAnimationFrame(update);

	// First slide!
	slideshow.goto(0);

}