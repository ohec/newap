// ==UserScript==
// @name          Secure Webmail
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   force webmail to use secure connection
// @include       http://mail.google.com/*
// ==/UserScript==

window.location.href = window.location.href.replace(/^http:/, 'https:');
