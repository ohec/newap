// ==UserScript==
// @name          Homestar-Fullon
// @namespace     http://apps.bcheck.net/greasemonkey/
// @description	  Make HomeStarRunner cartoons fill your browser window
// @include       http://homestarrunner.com/*
// @include       http://www.homestarrunner.com/*
// ==/UserScript==

// based on code by Timothy Rice
// and included here with his gracious permission

function resize() {
    var objs = document.getElementsByTagName('embed');
    var o = objs[0];
    var bar = objs[1];
    
    if(o && o.width && o.height && o.width>0 && o.height>0) {
	var dw = window.innerWidth;
	var dh = window.innerHeight - (bar&&bar.height?bar.height*2:0);
	var ar = o.width/o.height;
	if (dw/ar <= dh) {
	    dh = Math.floor(dw / ar);
	} else {
	    dw = Math.floor(dh * ar);
	}
	
	/* set embedded object's size */
	o.width = dw;
	o.height = dh;
    }
}

/* remove margin */
document.body.style.margin = "0px";

/* resize embed when window is resized */
window.addEventListener("resize", resize, false);

/* resize on first load */
resize();
