// ==UserScript==
// @name          Scourge of Arial
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   banish the scourge of Arial
// @include       *
// ==/UserScript==

var arElements = document.getElementsByTagName('*');
for (var i = arElements.length - 1; i >= 0; i--) {
    var elm = arElements[i];
    var style = getComputedStyle(elm, '');
    if (/arial/i.test(style.fontFamily)) {
        elm.style.fontFamily = style.fontFamily.replace(/arial/i, '');
    }
}
