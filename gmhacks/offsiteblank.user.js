// ==UserScript==
// @name          Offsite Blank
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   force offsite links to open in a new window
// @include       http*://*
// @exclude       http*://*.google.tld/*
// @exclude       http*://*.yahoo.tld/*
// ==/UserScript==

var sCurrentHost = location.host;
var arLinks = document.links;
for (var i = arLinks.length - 1; i >= 0; i--) {
    var elmLink = arLinks[i];
    if (elmLink.host && elmLink.host != sCurrentHost) {
            elmLink.target = "_blank";
    }
}
