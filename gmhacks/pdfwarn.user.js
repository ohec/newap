// ==UserScript==
// @name          PDF Warn
// @namespace     http://www.sencer.de/
// @description	  Ask before opening PDF links
// @include       *
// ==/UserScript==
//
// based on code by Sencer Yurdagul and Michael Bolin
// and included here with their gracious permission
// http://www.sencer.de/code/greasemonkey/pdfwarn.user.js

for (var i = document.links.length - 1; i >= 0; i--) {
    var elmLink = document.links[i];
    if (elmLink.href && elmLink.href.match(/^[^\\?]*pdf$/i)) {
	var sFilename = elmLink.href.match(/[^\/]+pdf$/i);
	elmLink.addEventListener('click', function(event) {
	    if (!window.confirm('Are you sure you want to ' +
				'open the PDF file "' +
				sFilename + '"?')) {
		event.stopPropagation();
		event.preventDefault();
	    }
	}, true);
    }    
}
