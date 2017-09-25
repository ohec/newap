// ==UserScript==
// @name          Missing Attachment
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   Warn before sending Gmail messages without attachments
// @include       http*://mail.google.com/mail/?*view=cv*
// @include       http*://mail.google.com/mail/?*view=page*
// ==/UserScript==

// add more keywords here if necessary
var words = ["attach", "attachment", "attached", "file", "files"];

// creates a regex like of the form /\b(foo|bar|baz)\b/i
var regex = new RegExp("\\b(" + words.join("|") + ")\\b", "i");

var form = document.getElementById("compose_form");

document.addEventListener("click", function(e) {
    if (e.target.id != "send") { return true; }
    var allLines = form.elements.namedItem('msgbody').value.split("\n");
    for (var i = 0, line; line = allLines[i]; i++) {
	// by convention, reply lines start with ">". Some people like
	// to be clever and use other characters. If you encounter this,
	// you can test for those characters as well.
	if (line[0] == ">") { continue; }
        if (!line.match(regex)) { continue; }
	if (isFileAttached()) { continue; }
	if (!window.confirm("WARNING\n\n" + 
            "This message mentions attachments, but none " + 
            "are included.\n\n" +
            "Really send?\n\n" + 
            "Suspicious line:\n" + 
            "\"" + line + "\"")) {
	    e.stopPropagation();
	}
	break;
    }
}, true);

function isFileAttached() {
    var iter = document.evaluate(".//input[@type='file']", 
        form, null, XPathResult.ANY_TYPE, null);
    var input;
    while (input = iter.iterateNext()) {
	if (input.value != "") {
	    return true;
	}
    }
    return false;
}
