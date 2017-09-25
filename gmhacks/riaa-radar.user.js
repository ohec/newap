// ==UserScript==
// @name        RIAA Radar
// @namespace   http://www.magnetbox.com/riaa/
// @description Warn before buying albums produced by RIAA-supported labels
// @include     http://*.amazon.tld/*
// ==/UserScript==

// based on code by Ben Tesch
// included here with his gracious permission

var radar = 'http://www.magnetbox.com/riaa/check.asp?asin=';
var asin = "";
var index = window.location.href.indexOf('/-/');
if (index != -1) {
    asin = window.location.href.substring(index + 3, index + 13);
} else {
    index = window.location.href.indexOf('ASIN');
    if (index != -1) {
	asin = window.location.href.substring(index + 5, index + 15);
    }
}
if (!asin) { return; }
GM_xmlhttpRequest({method:'GET', url: radar + asin, 
    onload:function(results) {
    var status = "unknown";
    
    if (results.responseText.match('button_warn.gif')) {
	status = "Warning!";
    } else {
	if (results.responseText.match('No album was found.')) {
	    status = "Unknown";
	} else {
	    status = "Safe!";
	}
    }
    
    var origTitle = document.evaluate("//b[@class='sans']",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,
        null).singleNodeValue;
    if (!origTitle) { return; }
    var div = origTitle.parentNode;
    var titlechld = origTitle.firstChild;
    var title = titlechld.nodeValue;
    var newTitle = document.createElement('b');
    newTitle.setAttribute('class', 'sans');
    var titleText = document.createTextNode(title);
    newTitle.appendChild(titleText);
    var sp = document.createTextNode(' ');
    var link = document.createElement('a');
    link.title = "RIAA Radar";
    link.href = radar + asin;
    
    var pic = document.createElement('img');
    pic.setAttribute('title', "RIAA Radar: " + status);
    if (status == 'Warning!') {
	pic.src = "http://www.magnetbox.com/riaa/images/button_warn2.gif";
    } else if (status == 'Safe!') {
	pic.src = "http://www.magnetbox.com/riaa/images/button_safe2.gif";
    } else {
	pic.src = "http://www.magnetbox.com/riaa/images/button_caution2.gif";
    }
    pic.style.border = "0px"; 
    link.appendChild(pic);
    
    div.insertBefore(newTitle, origTitle);
    div.insertBefore(sp, origTitle);
    div.insertBefore(link, origTitle);
    div.removeChild(origTitle);
}});
