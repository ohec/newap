// ==UserScript==
// @name           Google Cache Continue
// @namespace      http://babylon.idlevice.co.uk/javascript/greasemonkey/
// @description    Convert Google cache links to also use Google cache
// @include        http://*/search?*q=cache:*
// ==/UserScript==

// based on code by Jonathon Ramsey
// and included here with his gracious permission

/* Modify these vars to change the appearance of the cache links */
var cacheLinkText = 'cache';
var cacheLinkStyle = "\
    a.googleCache {\
        font:normal bold x-small sans-serif;\
        color:red;\
        background-color:yellow;\
        padding:0 0.6ex 0.4ex 0.3ex;\
        margin:0.3ex;\
    }\
    a.googleCache:hover {\
        color:yellow;\
        background-color:red;\
    }\
    p#googleCacheExplanation {\
        border:1px solid green;\
        padding:1ex 0.5ex;\
        font-family:sans-serif;\
    }";

addStyles(cacheLinkStyle);

if (googleHasNoCache()) {
    addUncachedLink(urlPage);
    return;
}

var arParts = window.location.href.match(/http:\/\/[^\/]*\/([^\+]*)(\+[^&]*)/);
var urlPage = arParts[1];
var sTerms = arParts[2];

var bAlter = false;
var snapLinks = document.evaluate('//a[@href]', document,
    null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
for (var i = 0; i < snapLinks.snapshotLength; i++) {
    var elmLink = snapLinks.snapshotItem(i);
    if (bAlter && linkIsHttp(elmLink)) {
	addCacheLink(elmLink, sTerms, cacheLinkText);
    }
    if (isLastGoogleLink(elmLink)) {
	bAlter = true;
	addExplanation(elmLink, cacheLinkText);
    }
}

function addStyles(cacheLinkStyle) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cacheLinkStyle;
    document.body.appendChild(style);
}

function googleHasNoCache() {
    return 0 == document.title.indexOf('Google Search: cache:');
}

function addUncachedLink(url) {
    var urlUncached = url.split('cache:')[1];
    var elmP = document.createElement('p');
    elmP.id = 'googleCacheExplanation';
    elmP.innerHTML = "<b>Uncached:</b> <a href='http://" + urlUncached + 
        "'>" + urlUncached + '</a>';
    var suggestions = document.getElementsByTagName('blockquote')[0];
    document.body.replaceChild(elmP, 
        suggestions.previousSibling.previousSibling);
}

function linkIsHttp(link) {
    return 0 == link.href.search(/^http/);
}

function isLastGoogleLink(elmLink) {
    return (-1 < elmLink.text.indexOf('cached text'));
}

function addExplanation(link, cacheLinkText) {
    var p = document.createElement('p');
    p.id = 'googleCacheExplanation';
    p.innerHTML = "Use <a href='" +
	document.location.href +
	"' class='googleCache'>" +
	cacheLinkText +
	"</a> links to continue using the Google cache.</a>";
    var tableCell = link.parentNode.parentNode.parentNode.parentNode;
    tableCell.appendChild(p);
}

function addCacheLink(elmLink, sTerms, cacheLinkText) {
    var cacheLink = document.createElement('a');
    cacheLink.href = getCacheLinkHref(elmLink, sTerms);
    cacheLink.appendChild(document.createTextNode(cacheLinkText));
    cacheLink.className = 'googleCache';
    elmLink.parentNode.insertBefore(cacheLink, elmLink.nextSibling);
}

function getCacheLinkHref(elmLink, sTerms) {
    var href = elmLink.href.replace(/^http:\/\//, '');
    var fragment = '';
    if (hrefLinksToFragment(href)) {
	var arParts = href.match(/([^#]*)#(.*)/, href);
	href = arParts[1];
	fragment = '#' + arParts[2];
    }
    return 'http://www.google.com/search?q=cache:' + href + sTerms + fragment;
}

function hrefLinksToFragment(href) {
    return (-1 < href.indexOf('#'));
}
