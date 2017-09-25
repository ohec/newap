// ==UserScript==
// @name          ALT Tooltips
// @namespace     http://www.arantius.com/
// @description	  Display ALT text as tooltip if no title is available
// @include       *
// ==/UserScript==

// Originally written by Anthony Lieuallen of http://www.arantius.com/
// and included here with his gracious permission

var res = document.evaluate("//area|//img", 
	document, null,	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null); 
var i, el;
for (i=0; el=res.snapshotItem(i); i++) {
	if (''==el.title && ''!=el.alt) el.title='ALT: '+el.alt;
}
