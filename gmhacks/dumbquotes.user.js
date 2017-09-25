// ==UserScript==
// @name          DumbQuotes
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   straighten curly quotes and apostrophes
// @include       *
// ==/UserScript==

var arReplacements = {
    "\xa0": " ",
    "\xa9": "(c)",
    "\xae": "(r)",
    "\xb7": "*",
    "\u2018": "'",
    "\u2019": "'",
    "\u201c": '"',
    "\u201d": '"',
    "\u2026": "...",
    "\u2002": " ",
    "\u2003": " ",
    "\u2009": " ",
    "\u2013": "-",
    "\u2014": "--",
    "\u2122": "(tm)"};
var arRegex = new Array();
for (var sKey in arReplacements) {
    arRegex[sKey] = new RegExp(sKey, 'g');
}

var snapTextNodes = document.evaluate("//text()[" +
    "not(ancestor::script) and not(ancestor::style)]",
    document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = snapTextNodes.snapshotLength - 1; i >= 0; i--) {
    var elmTextNode = snapTextNodes.snapshotItem(i);
    var sText = elmTextNode.data;
    for (var sKey in arReplacements) {
        sText = sText.replace(arRegex[sKey], arReplacements[sKey]);
    }
    elmTextNode.data = sText;
}
