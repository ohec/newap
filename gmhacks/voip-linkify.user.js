// ==UserScript==
// @name           SunRocket VoIP Dial Linkify
// @namespace      http://www.muehlen.com/
// @description    Convert unlinked phone numbers to SunRocket VoIP links
// @include        *
// ==/UserScript==

// based on code by Ralf Muehlen
// and included here with his gracious permission

const voipRE=/\b(\d\d\d-\d\d\d-\d\d\d\d|\d\d\d\) \d\d\d-\d\d\d\d)\b/ig;

function trackUrl(t) {
    return "https://www.sunrocket.com/members/contacts/clickToCall.do" +
        "?phoneToCall=" + String(t).replace(/\) /g, "-") + 
        "&action=/viewIndex.do";
}

// tags we will scan looking for un-hyperlinked urls
var allowedParents = ["abbr", "acronym", "address", "applet", "b",
    "bdo", "big", "blockquote", "body", "caption", "center", "cite",
    "code", "dd", "del", "div", "dfn", "dt", "em", "fieldset",
    "font", "form", "h1", "h2", "h3", "h4", "h5", "h6", "i", "iframe",
    "ins", "kdb", "li", "object", "pre", "p", "q", "samp", "small",
    "span", "strike", "s", "strong", "sub", "sup", "td", "th", "tt",
    "u", "var"];
    
var xpath = "//text()[(parent::" + allowedParents.join(" or parent::") + 
    ")]";

var candidates = document.evaluate(xpath, document, null, 
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var cand = null, i = 0; (cand = candidates.snapshotItem(i)); i++) {
    if (voipRE.test(cand.nodeValue)) {
	var span = document.createElement("span");
	var source = cand.nodeValue;
	
	cand.parentNode.replaceChild(span, cand);
	
	voipRE.lastIndex = 0;
	for (var match = null, lastLastIndex = 0;
	     (match = voipRE.exec(source)); ) {
	    span.appendChild(document.createTextNode(
                source.substring(lastLastIndex, match.index)));
	    
	    var a = document.createElement("a");
	    a.setAttribute("href", trackUrl(match[0]));
	    a.appendChild(document.createTextNode(match[0]));
	    span.appendChild(a);
	    
	    lastLastIndex = voipRE.lastIndex;
	}

	span.appendChild(document.createTextNode(
            source.substring(lastLastIndex)));
	span.normalize();
    }
}
