// ==UserScript==
// @name          Amazon Larger Images
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   display larger product images on Amazon
// @include       http://amazon.tld/*
// @include       http://*.amazon.tld/*
// ==/UserScript==

var elmProductImage = document.evaluate(
    "//img[contains(@src, 'MZZZZZZZ')]", document, null,
    XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
if (!elmProductImage) return;
var elmParent = elmProductImage.parentNode;
while (elmParent && (elmParent.nodeName != 'BODY')) {
    elmParent.style.width = 'auto';
    elmParent.style.height = 'auto';
    elmParent = elmParent.parentNode;
}
var elmNewImage = document.createElement('img');
elmNewImage.src = elmProductImage.src.replace(/MZZZZZZZ/, 'LZZZZZZZ');
elmNewImage.style.border = '0';
elmProductImage.parentNode.replaceChild(elmNewImage, elmProductImage);
