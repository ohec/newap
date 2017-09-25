// ==UserScript==
// @name            Popup Window Styler
// @namespace       http://youngpup.net/userscripts
// @description     Style popup windows that use the javascript: pseudo-protocol
// @include         *
// ==/UserScript==

var candidates = document.links;
for (var cand = null, i = 0; (cand = candidates[i]); i++) {
    if (cand.href.toLowerCase().indexOf("javascript:") == 0) {
        with (cand.style) {
            background = "#ddd";
            borderTop = "2px solid white";
            borderLeft = "2px solid white";
            borderRight = "2px solid #999";
            borderBottom = "2px solid #999";
            padding = ".5ex 1ex";
            color = "black";
            textDecoration = "none";
        }
    }
}
