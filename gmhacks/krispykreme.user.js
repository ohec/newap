// ==UserScript==
// @name          Krispy Kreme Tracker
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @include       http://maps.google.com/*
// @description   Track nearest Krispy Kreme in Google Maps
// ==/UserScript==

var YAHOO_APP_ID = 'diveintomark.org';

function NSResolver() {
    return "urn:yahoo:lcl";
}

var elmHeader = document.evaluate("//*[@class='title']", document,
    null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
if (!elmHeader) { return; }
elmHeader.innerHTML += 
    ' <span id="krispykreme" style="font-size: small;"></span>';
var elmKrispyKreme = document.getElementById('krispykreme');
_m.map.addStateListener(function() { 
    var ptCenter = _m.map.getCenterLatLng();
    if (window._ptLastKnownCenter && 
        (ptCenter.distanceFrom(window._ptLastKnownCenter) < 0.001)) { return; }
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://api.local.yahoo.com/LocalSearchService/" +
             "V1/localSearch?appid=" + YAHOO_APP_ID + 
             "&query=krispy+kreme&latitude=" + ptCenter.y.toString() + 
             "&longitude=" + ptCenter.x.toString() + "&radius=50",
        onload: function(oResponseDetails) {
            elmKrispyKreme.innerHTML = '';
            window._ptLastKnownCenter = ptCenter;
            var oParser = new DOMParser();
            var oDom = oParser.parseFromString(
                oResponseDetails.responseText, 'application/xml');
            var elmResult = document.evaluate("//yahoo:Result", oDom, 
                NSResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, 
                null).singleNodeValue;
            if (!elmResult) return;
            var elmDistance = document.evaluate("//yahoo:Distance", 
                elmResult, NSResolver, XPathResult.FIRST_ORDERED_NODE_TYPE,
                null).singleNodeValue;
            if (!elmDistance) return;
            var usDistance = elmDistance.textContent;
            var elmAddress = document.evaluate("//yahoo:Address",
                elmResult, NSResolver, XPathResult.FIRST_ORDERED_NODE_TYPE,
                null).singleNodeValue;
            if (!elmAddress) return;
            var usAddress = elmAddress.textContent;
            var elmCity = document.evaluate("//yahoo:City", oDom,
                NSResolver, XPathResult.FIRST_ORDERED_NODE_TYPE,
                null).singleNodeValue;
            if (!elmCity) return;
            var usCity = elmCity.textContent;
            var elmState = document.evaluate("//yahoo:State", oDom,
                NSResolver, XPathResult.FIRST_ORDERED_NODE_TYPE,
                null).singleNodeValue;
            if (!elmState) return;
            var usState = elmState.textContent;
            elmKrispyKreme.innerHTML = 
                '&mdash; Nearest Krispy Kreme: ' +
                '<a href="http://maps.google.com/maps?q=' + 
                escape(usAddress + ' ' + usCity + ' ' + usState) + 
                '">' + usAddress + ', ' + usCity + ' ' + usState + 
               '</a> (' + usDistance + ' miles)';
        }});
});
