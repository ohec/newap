// ==UserScript==
// @name          Really Valid?
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   check if pages claiming to be valid (X)HTML really are
// @include       *
// ==/UserScript==

var snapValidLinks = document.evaluate(
    "//a[@href='http://validator.w3.org/check/referer']",
    document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
if (!snapValidLinks.snapshotLength) return;
GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://validator.w3.org/check?uri=' + escape(location),
    onload: function(oResponse) {
        if (/This Page Is Valid/.test(oResponse.responseText)) return;
        for (var i = 0; i < snapValidLinks.snapshotLength; i++) {
            var elmInvalid = snapValidLinks.snapshotItem(i);
            elmInvalid.title = 'This page claimed to validate, but it lied';
            elmInvalid.innerHTML = 'Invalid markup!';
        }
    }
});
