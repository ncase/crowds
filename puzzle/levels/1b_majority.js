PEEP_STATE_COLORS[2] = "#eebb55";

canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

var initData = {
	"contagion":0.5,
	"peeps":[[128,122,2],[239,84,2],[356,131,2],[74,224,1],[95,333,1],[170,401,1],[286,411,1],[376,342,1],[403,236,1]],
	"connections":[]
}

// Add peeps!
loadNetwork(initData);

// Update
update();

function _onUpdate(){

	// WINNER? Only if ALL peeps think drinking is in the majority
	var progress = 0;
	peeps.forEach(function(peep){
		if(peep.numFriends>0 &&peep.numInfectedFriends/peep.numFriends>=0.5){
			progress++;
		}
	});
	YOU_ARE_WINNER = (progress==9);

	// Progress...
	var label = "FOOLED: "+progress+" out of 9 peeps";
	ctx.font = '14px sans-serif';
	ctx.fillStyle = PEEP_STATE_COLORS[2];
	ctx.textAlign = "center";
	ctx.fillText(label, 250, 465);
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = PEEP_STATE_COLORS[2];

	ctx.beginPath();
	ctx.rect(160, 470, 180, 10);
	ctx.stroke();
	ctx.beginPath();
	ctx.rect(160, 470, 180*(progress/9), 10);
	ctx.fill();

}