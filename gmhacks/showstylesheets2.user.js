// ==UserScript==
// @name          Show Stylesheets 2
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   adds links to all of page's stylesheets + inline styles
// @include       *
// ==/UserScript==

var arHtmlStylesheetLinks = new Array();
var bHasInlineStyles = false; 
for (var i = document.styleSheets.length - 1; i >= 0; i--) {
    var oStylesheet = document.styleSheets[i];

    if (oStylesheet.href == location.href) {
        bHasInlineStyles = true;
    }

    var ssMediaText = oStylesheet.media.mediaText;
    if (ssMediaText) {
        ssMediaText = 'media=&quot;' + ssMediaText + '&quot;';
    }
    arHtmlStylesheetLinks.push('<a title="' +
        ssMediaText + '" href="' +
        oStylesheet.href + '">' +
        oStylesheet.href.split('/').pop() + '</a>');
}

if (bHasInlineStyles) {
    arHtmlStylesheetLinks.push('<a href="view-source:' + 
        location + '">inline styles</a>');
}

if (!arHtmlStylesheetLinks.length) return;
var elmWrapperDiv = document.createElement('div');
elmWrapperDiv.innerHTML = 'Stylesheets: ' +
    arHtmlStylesheetLinks.join(' &middot; ');
elmWrapperDiv.style.textAlign = 'center';
elmWrapperDiv.style.fontSize = 'small';
elmWrapperDiv.style.fontFamily = 'sans-serif';
document.body.insertBefore(elmWrapperDiv, document.body.firstChild);
