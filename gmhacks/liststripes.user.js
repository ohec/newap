// ==UserScript==
// @name          List Stripes
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   shade alternating rows of lists
// @include       *
// ==/UserScript==

var arListItems = document.getElementsByTagName('li');
var bHighlight = true;
for (var i = arListItems.length - 1; i >= 0; i--) {
    var elmListItem = arListItems[i];
    elmListItem.style.backgroundColor = bHighlight ? '#ddd' : '#fff';
    elmListItem.style.color = '#000';
    bHighlight = !bHighlight;
}
