function getQueryVariable(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for(var i=0; i<vars.length; i++) {
		var pair = vars[i].split("=");
		if(pair[0]==variable) return pair[1];
	}
	return(false);
}

var levelName = getQueryVariable("level");
if(levelName){
	var newScript = document.createElement("script");
	newScript.src = "../levels/"+levelName+".js";
	setTimeout(function(){
		document.body.appendChild(newScript);
	},1);
}