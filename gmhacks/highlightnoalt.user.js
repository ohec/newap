// ==UserScript==
// @name          Highlight No Alt
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   highlight images without alternate text
// @include       *
// ==/UserScript==

var snapBadImages = document.evaluate("//img[not(@alt)]",
    document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = snapBadImages.snapshotLength - 1; i >= 0; i--) {
    var elmBadImage = snapBadImages.snapshotItem(i);
    elmBadImage.style.MozOutline = "2px solid red";
    elmBadImage.title = 'Missing ALT attribute! src="' +
	elmBadImage.src + '"';
}
