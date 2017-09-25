// ==UserScript==
// @name          Auto Reload
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   "Included pages" will get reloaded every X minutes.
// @include       http://slashdot.org/*
// @include       http://*.slashdot.org/*
// ==/UserScript==

var numMinutes = 20;
window.setTimeout("document.location.reload();", numMinutes*60*1000);
