// ==UserScript==
// @name          Table Ruler
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   highlight current row in data tables
// @include       *
// ==/UserScript==

var arTableRows = document.getElementsByTagName('tr');
for (var i = arTableRows.length - 1; i >= 0; i--) {
    var elmRow = arTableRows[i];
    var sBackgroundColor = elmRow.style.backgroundColor;
    var sColor = elmRow.style.color;
    elmRow.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#88eecc';
        this.style.color = '#000';
    }, true);
    elmRow.addEventListener('mouseout', function() {
        this.style.backgroundColor = sBackgroundColor;
        this.style.color = sColor;
    }, true);
}
