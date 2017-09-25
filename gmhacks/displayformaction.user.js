// ==UserScript==
// @name          Display Form Action
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   display form submission URL as tooltip of submit button
// @include       *
// ==/UserScript==

for (var i = document.forms.length - 1; i >= 0; i--) {
    var elmForm = document.forms[i];
    var snapSubmit = document.evaluate("//input[@type='submit']",
        elmForm, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var j = snapSubmit.snapshotLength - 1; j >= 0; j--) {
        var elmSubmit = snapSubmit.snapshotItem(j);
        elmSubmit.title = (elmForm.method.toUpperCase() || 'GET') +
            ' ' + elmForm.action;
    }
}
