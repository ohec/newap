// ==UserScript==
// @name          Frame Killer Plus
// @namespace     http://www.arantius.com/
// @description	  Replaces the current page with the biggest frame
// @include       http://www.example.com/
// ==/UserScript==

// Originally written by Anthony Lieuallen of http://www.arantius.com/
// and included here with his gracious permission

var i=0,f,bigArea=-1,frameArea,newLoc='';
// use xpath here to circumvent security restrictions that prevent
// reading the src directly
var frames=document.evaluate("//frame", document, null,
    XPathResult.ANY_TYPE, null);
while (f = frames.iterateNext()) {
    frameArea = (parseInt(f.offsetWidth) *
        parseInt(f.offsetHeight));
    if (frameArea > bigArea) {
        bigArea = frameArea;
        newLoc = f.src;
    }
}
if (''!=newLoc) {
    document.location.replace(newLoc);
}
