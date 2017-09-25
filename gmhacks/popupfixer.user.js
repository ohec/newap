// ==UserScript==
// @name            Popup Window Fixer
// @namespace       http://youngpup.net/userscripts
// @description     Fixes javascript: pseudo-links that popup windows
// @include         *
// ==/UserScript==

const urlRegex = /\b(https?:\/\/[^\s+\"\<\>\'\(\)]+)/ig;
var candidates = document.getElementsByTagName("a");

for (var cand = null, i = 0; (cand = candidates[i]); i++) {
    if (cand.getAttribute("onclick") == null && 
	cand.href.toLowerCase().indexOf("javascript:") == 0) {
	var match = cand.href.match(urlRegex);
	if (!match) { continue; }
	cand.href = match[0];
    }
}
