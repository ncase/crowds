canvas.style.width = 500;
canvas.style.height = 500;
canvas.width = parseInt(canvas.style.width)*2;
canvas.height = parseInt(canvas.style.height)*2;

PEEP_STATE_COLORS[1] = "#BF5FFF"; // purple
PEEP_STATE_COLORS[2] = "#83F52C"; // green
_hack_SHOW_BOTH_STATES = true;

var initData = {
	"contagion":0.75,
	"contagion2":0.95,
	"peeps":[[162,99,1],[70,183,1],[70,301,1],[141,408,1],[357,100,2],[439,183,2],[432,305,2],[358,408,2]],
	"connections":[[0,1],[1,2],[2,3],[7,6],[6,5],[5,4]]
}
_makeUncuttable(initData.connections);

// Add peeps!
loadNetwork(initData);

// Update
update();

function _onUpdate(){

	// WINNER? Only if ratio of SAME friends is 3/4<=x<1
	var progress = 0;
	peeps.forEach(function(peep){
		var sameFriendCount = 0;
		var friends = getConnected(peep);
		friends.forEach(function(friend){
			if(friend.state==peep.state) sameFriendCount++;
		});
		var sameFriendRatio = sameFriendCount/friends.length;
		if(0.75<=sameFriendRatio && sameFriendRatio<=0.95){
			progress++;
		}
	});
	YOU_ARE_WINNER = (progress==8);

	// Progress...
	var label = "SOLVED: "+progress+" out of 8 peeps";
	ctx.font = '14px sans-serif';
	ctx.fillStyle = "#888";
	ctx.textAlign = "center";
	ctx.fillText(label, 250, 465);
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#888";

	ctx.beginPath();
	ctx.rect(160, 470, 180, 10);
	ctx.stroke();
	ctx.beginPath();
	ctx.rect(160, 470, 180*(progress/8), 10);
	ctx.fill();

}