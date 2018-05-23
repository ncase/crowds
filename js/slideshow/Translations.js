window.TRANSLATIONS = [];
window.ADD_YOUR_OWN_LINK = "https://github.com/ncase/crowds#how-to-translate-this-thing";

var r = new XMLHttpRequest();
var DEFAULT_LANG_CODE = 'en';

r.open("GET", "translations.txt?cache="+Math.round(1000*Math.random()), true); // force cache refresh
r.onreadystatechange = function () {
	
	if(r.readyState != 4 || r.status != 200) return;

	// Get current language code from path
	var currentCode = location.pathname.split('/').slice(-1)[0].replace('.html', '') || DEFAULT_LANG_CODE;
	
	// Parse available translations
	// Only lines of the form "nn: name"
	var response = r.responseText;
	var lines = response.split("\n");
	var available = lines.filter(function(line){
		return (/^[a-z]{2}(?:-[A-Z]{2})?\:?\s+(.+)/).test(line); // ww: wwwwww
	});
	for(var i=0; i<available.length; i++){
		var a = available[i];
		var code = a.match(/[a-z]{2}(?:-[A-Z]{2})?/)[0];
		var lang = a.match(/^[a-z]{2}(?:-[A-Z]{2})?\:?\s+(.+)/)[1];
		if(code === currentCode) continue; // Hide current language tab
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
		// Refer to root if the language is default (en)
		var href = (t.code === DEFAULT_LANG_CODE) ? '.' : (t.code+".html");
		if(i>0) html+=separator;
		html += "<a href='"+href+"' style='text-decoration:none'>";
		html += t.lang;
		html += "</a>";
	}

	// Hardcoding the external Arabic translation, oh well
	html += " · <a href='http://alexanderclay.github.io/crowds' style='text-decoration:none'>العربية</a>";

	return html;
}
