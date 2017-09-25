// ==UserScript==
// @name          Identify Password Fields
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   Decorates password fields with a background pattern
// @include       *
// ==/UserScript==

// based on code by Julien Couvreur
// and included here with his gracious permission

// add CSS rule
var rule = "input.GM_PasswordField { background-image: url(data:image/gif,"+
    "GIF89a%04%00%04%00%B3%00%00%FF%FF%FF%FF%FF%00%FF%00%FF%FF%00%00%00%FF"+
    "%FF%00%FF%00%00%00%FF%00%00%00%CC%CC%CC%FF%FF%FF%00%00%00%00%00%00%00"+
    "%00%00%00%00%00%00%00%00%00%00%00!%F9%04%01%00%00%09%00%2C%00%00%00%0"+
    "0%04%00%04%00%00%04%070I4k%A22%02%00%3B) }";
var styleNode = document.createElement("style");
styleNode.type = "text/css";
styleNode.innerHTML = rule;
document.getElementsByTagName('head')[0].appendChild(styleNode);

// find all password fields and mark them with a class
var xpath = "//input[translate(@type,'PASSWORD','password')='password']";
var res = document.evaluate(xpath, document, null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
for (var inputIndex = 0; inputIndex < res.snapshotLength; inputIndex++) {
    passwordInput = res.snapshotItem(inputIndex);
    passwordInput.className += " GM_PasswordField";
}
