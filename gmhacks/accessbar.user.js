// ==UserScript==
// @name          Access Bar
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   show accesskeys defined on page
// @include       *
// ==/UserScript==

function addGlobalStyle(css) {
    var elmHead, elmStyle;
    elmHead = document.getElementsByTagName('head')[0];
    if (!elmHead) { return; }
    elmStyle = document.createElement('style');
    elmStyle.type = 'text/css';
    elmStyle.innerHTML = css;
    elmHead.appendChild(elmStyle);
}

var snapAccesskeys = document.evaluate(
    "//*[@accesskey]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
if (!snapAccesskeys.snapshotLength) { return; }
var arDescriptions = new Array();
for (var i = snapAccesskeys.snapshotLength - 1; i >= 0; i--) {
    var elm = snapAccesskeys.snapshotItem(i);
    var sDescription = '';
    if (elm.nodeName.toLowerCase() == 'input') {
        var elmLabel = document.evaluate("//label[@for='" + elm.name + "']",
            document,
	    null,
	    XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
        if (elmLabel) {
            sDescription = label.title;
            if (!sDescription) { sDescription = label.textContent; }
        }
    }
    if (!sDescription) { sDescription = elm.textContent; }
    if (!sDescription) { sDescription = elm.title; }
    if (!sDescription) { sDescription = elm.name; }
    if (!sDescription) { sDescription = elm.id; }
    if (!sDescription) { sDescription = elm.href; }
    if (!sDescription) { sDescription = elm.value; }
    var htmlDescription = '<strong>[' +
	elm.getAttribute('accesskey').toUpperCase() + ']</strong> ';
    if (elm.href) {
	htmlDescription += '<a href="' + elm.href + '">' + 
	    sDescription + '</a>';
    } else {
	htmlDescription += sDescription;
    }
    arDescriptions.push(htmlDescription);
}
arDescriptions.sort();
var elmWrapper = document.createElement('div');
elmWrapper.id = 'accessbar-div-0';
var html = '<div><ul><li class="first">' + arDescriptions[0] + '</li>';
for (var i = 1; i < arDescriptions.length; i++) {
    html += '<li>' + arDescriptions[i] + '</li>';
}
html += '</ul></div>';
elmWrapper.innerHTML = html;
document.body.style.paddingBottom = "4em";
window.addEventListener(
    "load",
    function() { document.body.appendChild(elmWrapper); },
    true);
addGlobalStyle(
'#accessbar-div-0 {'+
'  position: fixed;' +
'  left: 0;' +
'  right: 0;' +
'  bottom: 0;' +
'  top: auto;' +
'  border-top: 1px solid silver;' +
'  background: black;' +
'  color: white;' +
'  margin: 1em 0 0 0;' +
'  padding: 5px 0 0.4em 0;' +
'  width: 100%;' +
'  font-family: Verdana, sans-serif;' +
'  font-size: small;' +
'  line-height: 160%;' +
'}' +
'#accessbar-div-0 a,' +
'#accessbar-div-0 li,' +
'#accessbar-div-0 span,' +
'#accessbar-div-0 strong {' +
'  background-color: transparent;' +
'  color: white;' +
'}' +
'#accessbar-div-0 div {' +
'  margin: 0 1em 0 1em;' +
'}' +
'#accessbar-div-0 div ul {' +
'  margin-left: 0;' +
'  margin-bottom: 5px;' +
'  padding-left: 0;' +
'  display: inline;' +
'}' +
'#accessbar-div-0 div ul li {' +
'  margin-left: 0;' +
'  padding: 3px 15px;' +
'  border-left: 1px solid silver;' +
'  list-style: none;' +
'  display: inline;' +
'}' +
'#accessbar-div-0 div ul li.first {' +
'  border-left: none;' +
'  padding-left: 0;' +
'}');
