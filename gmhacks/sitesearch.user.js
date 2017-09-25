// ==UserScript==
// @name          Site Search
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   adds a site search on every page using Google Site Search
// @include       http://*
// @exclude       http://*.google.tld/*
// ==/UserScript==

var elmSearchDiv = document.createElement('div');
elmSearchDiv.innerHTML = 
    '<form method="GET" action="http://www.google.com/search">' +
    '<label for="as_q">Search this site:</label> ' +
    '<input type="text" name="as_q" accesskey="S"> ' +
    '<input type="hidden" name="q" value="site:' + location.host + '">' +
    '<input type="submit" value="Search">' +
    '</form>';
document.body.insertBefore(elmSearchDiv, document.body.firstChild);
elmSearchDiv.style.fontSize = 'small';
elmSearchDiv.style.textAlign = 'right';
elmSearchDiv.style.borderBottom = '1px solid silver';
