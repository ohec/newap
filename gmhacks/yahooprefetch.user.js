// ==UserScript==
// @name          Yahoo! Prefetcher
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   prefetch first link on Yahoo! web search results
// @include       http://search.yahoo.com/search*
// ==/UserScript==

var elmFirstResult = document.evaluate("//a[@class='yschttl']", document,
    null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
if (!elmFirstResult) return;
var urlFirstResult = unescape(elmFirstResult.href.replace(/^.*\*-/, ''));
var oRequest = {
    method: 'GET',
    url: urlFirstResult,
    headers: {'X-Moz': 'prefetch',
	      'Referer': document.location.href}};
GM_log('prefetching ' + urlFirstResult);
GM_xmlhttpRequest(oRequest);
