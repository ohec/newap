// ==UserScript==
// @name          Anti-Disabler
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   restore context menus on sites that try to disable them
// @include       *
// @exclude       http*://mail.google.com/*
// @exclude       http://maps.google.com/*
// ==/UserScript==

with(document.wrappedJSObject || document) {
	onmouseup = null;
	onmousedown = null;
	oncontextmenu = null;
}

var arAllElements = document.getElementsByTagName('*');
for(var i = arAllElements.length - 1; i >= 0; i--) {
	var elmOne = arAllElements[i];
	with(elmOne.wrappedJSObject || elmOne) {
		onmouseup = null;
		onmousedown = null;
		oncontextmenu = null;
	}
}
