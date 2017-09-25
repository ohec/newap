// ==UserScript==
// @namespace     http://visitjesper.homeip.net
// @name          Google Maps: Show Lat/Long coordinates under mouse
// @include       http://maps.google.tld/*
// @description   Show current latitude and longitude on Google Maps
// ==/UserScript==

// based on code by Jesper Ronn-Jensen
// and included here with his gracious permission

var elmToggle = document.getElementById('toggle');
if (!elmToggle) { return; }
elmToggle.previousSibling.innerHTML+=
    '&nbsp;<span id="curLatLong"></span>';
var curLatLong = document.getElementById('curLatLong');
curLatLong.style.fontFamily = 'monospace';
curLatLong.style.fontSize = 'medium';
curLatLong.style.fontWeight = 'normal';
unsafeWindow.addEventListener('load', function() {
    alert(_m.map);
    unsafeWindow._m.map.addStateListener(function(map) {
	GM_log('called my state listener');
	var elmCurLatLong = document.getElementById('curLatLong');
	elmCurLatLong.innerHTML = 'Current position: ' +
            map.getCenterLatLng();
    }, true);
}, true);
