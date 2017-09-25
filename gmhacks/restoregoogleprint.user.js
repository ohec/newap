// ==UserScript==
// @name          Restore Google Print
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   restore normal browser functionality in Google Print
// @include       http://print.google.com/print*
// ==/UserScript==

// restore context menu
unsafeWindow.document.oncontextmenu = null;

// remove clear GIFs that obscure divs with background images
var snapDots = document.evaluate("//img[@src='images/cleardot.gif']",
    document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for(var i = snapDots.snapshotLength - 1; i >= 0; i--) {
    var elmDot = snapDots.snapshotItem(i);
    var elmWrapper = elmDot.parentNode;
    while (elmWrapper.nodeName.toLowerCase() != 'div') {
        elmWrapper = elmWrapper.parentNode;
    }
    var urlImage = getComputedStyle(elmWrapper, '').backgroundImage;
    urlImage = urlImage.replace(/url\((.*?)\)/g, '$1');
    // make image clickable
    var elmClone = elmDot.cloneNode(true);
    elmClone.style.border = 'none';
    elmClone.src = urlImage;
    var elmLink = document.createElement('a');
    elmLink.href = urlImage;
    elmLink.appendChild(elmClone);
    elmDot.parentNode.insertBefore(elmLink, elmDot);
    elmDot.parentNode.removeChild(elmDot);
}
