window.TRANSLATIONS = [];
window.ADD_YOUR_OWN_LINK = "http://derp";

var r = new XMLHttpRequest();
r.open("GET", "translations.txt", true);
r.onreadystatechange = function () {
	
	if(r.readyState != 4 || r.status != 200) return;

	// Parse available translations
	// Only lines of the form "nn: name"
	var response = r.responseText;
	var lines = response.split("\n");
	var available = lines.filter(function(line){
		return (/^\w\w\:?\s+(.+)/).test(line); // ww: wwwwww
	});
	for(var i=0; i<available.length; i++){
		var a = available[i];
		var code = a.match(/\w\w/)[0];
		var lang = a.match(/^\w\w\:?\s+(.+)/)[1];
		if(code=="en") continue; // English is just an example
		TRANSLATIONS.push({
			code: code,
			lang: lang
		});
	}
	TRANSLATIONS = TRANSLATIONS.sort(function(a,b){
		return a.lang>b.lang;
	});

	// Show translations (if any)
	if(TRANSLATIONS.length>0){
		var html = "";
		html += getWords("translations_exist").toLowerCase();
		html += " <a target='_blank' href='"+window.ADD_YOUR_OWN_LINK+"'>"+getWords("translations_add")+"</a>";
		html += " | ";
		html += _createLinks(" · ");
		$("#translations").innerHTML = html;
	}

};
r.send();

function _createLinks(separator){
	var html = "";
	for(var i=0; i<TRANSLATIONS.length; i++){
		var t = TRANSLATIONS[i];
		if(i>0) html+=separator;
		html += "<a href='"+t.code+".html' style='text-decoration:none'>";
		html += t.lang;
		html += "</a>";
	}
	return html;
}