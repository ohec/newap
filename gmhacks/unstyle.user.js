// ==UserScript==
// @name          Unstyle
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   remove all CSS styles
// @include       *
// ==/UserScript==

// disable all externally linked stylesheets
for (var i = document.styleSheets.length - 1; i >= 0; i--) {
    document.styleSheets[i].disabled = true;
}

var arAllElements = (typeof document.all != 'undefined') ?
    document.all : document.getElementsByTagName('*');
for (var i = arAllElements.length - 1; i >= 0; i--) {
    var elmOne = arAllElements[i];
    if (elmOne.nodeName.toUpperCase() == 'STYLE') {
	// remove <style> elements defined in the page <head>
	elmOne.parentNode.removeChild(element);
    } else {
	// remove per-element styles and style-related attributes
	elmOne.setAttribute('style', '');
	elmOne.setAttribute('size', '');
	elmOne.setAttribute('face', '');
	elmOne.setAttribute('color', '');
	elmOne.setAttribute('bgcolor', '');
	elmOne.setAttribute('background', '');
    }
}
