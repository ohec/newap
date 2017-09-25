// ==UserScript==
// @name          Remove AccessKeys
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   remove accesskey shortcuts from web pages
// @include       *
// ==/UserScript==

var snapSubmit = document.evaluate("//*[@accesskey]",
    document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = snapSubmit.snapshotLength - 1; i >= 0; i--) {
    snapSubmit.snapshotItem(i).removeAttribute('accesskey');
}
