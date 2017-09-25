// ==UserScript==
// @name          Hyphen Spam Remover
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   remove search results with 2 or more hyphens in domain
// @include       http://www.google.com/search*
// ==/UserScript==

var snapFilter = document.evaluate(
    "//a[starts-with(translate(translate(@href, 'http:', ''), " +
    "'.:abcdefghijklmnopqrstuvwxyz0123456789', ''), '//--')]" +
    "/ancestor::p[@class='g']", document, null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = snapFilter.snapshotLength - 1; i >= 0; i--) {
    var elmFilter = snapFilter.snapshotItem(i);
    elmFilter.parentNode.removeChild(elmFilter);
}
