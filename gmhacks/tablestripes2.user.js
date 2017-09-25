// ==UserScript==
// @name          Table Stripes
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   shade alternating rows of data tables
// @include       *
// ==/UserScript==

var snapTableRows = document.evaluate("//table//th/ancestor::table//tr",
    document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var bHighlight = true;
for (var i = snapTableRows.snapshotLength - 1; i >= 0; i--) {
    var elmRow = snapTableRows.snapshotItem(i);
    elmRow.style.backgroundColor = bHighlight ? '#ddd' : '#fff';
    elmRow.style.color = '#000';
    bHighlight = !bHighlight;
}
