// ==UserScript==
// @name          Recent Searches
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   remember and display recent Google searches
// @include       http://www.google.tld/*
// ==/UserScript==

// based on code by Adam Langley
// and included here with his gracious permission
// http://www.imperialviolet.org/page24.html

function SavedSearches() {
    var iCount = GM_getValue('count') || 0;
    for (var i = 0; i < iCount; i++) {
        this.push({
            "searchtext": GM_getValue('searchtext.' + i, ''),
            "searchresult": GM_getValue('searchresult.' + i, '')});
    }
}

SavedSearches.prototype = new Array();

SavedSearches.prototype.find = function(sSearchText) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] == sSearchText) {
            return i;
        }
    }
    return -1;
};

SavedSearches.prototype.append = function(sSearchText) {
    GM_setValue('searchtext.' + this.length, sSearchText);
    this.push({"searchtext": sSearchText});
    GM_setValue('count', this.length);
};

var arSavedSearches = new SavedSearches();

function getCurrentSearchText() {
    var elmForm = document.forms.namedItem('gs');
    if (!elmForm) { return; }
    var elmSearchBox = elmForm.elements.namedItem('q');
    if (!elmSearchBox) { return; }
    var sKeyword = elmSearchBox.value;
    if (!sKeyword) { return; }
    return sKeyword;
}

function addCurrentSearch() {
    var sCurrentSearchText = getCurrentSearchText();
    if (!sCurrentSearchText) { return; }
    var sLastSearch = null;
    if (arSavedSearches.length) {
        sLastSearch = arSavedSearches[arSavedSearches.length - 1];
    }
    if (sLastSearch &&
        (sLastSearch['searchtext'] == sCurrentSearchText)) {
        return;
    }
    arSavedSearches.append(sCurrentSearchText);
}

function clearSavedSearches() {
    for (var i = 0; i < arSavedSearches.length; i++) {
        GM_setValue('searchtext.' + i, '');
        GM_setValue('searchresult.' + i, '');
    }
    GM_setValue('count', 0);
    arSavedSearches = new SavedSearches();
    var elmRecentSearches = document.getElementById('recentsearcheslist');
    if (elmRecentSearches) {
        elmRecentSearches.innerHTML = '';
    }
}

function injectRecentSearches() {
    if (!arSavedSearches.length) { return; }
    var elmFirst = document.evaluate("//table[@bgcolor='#e5ecf9']",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,
        null).singleNodeValue;
    if (!elmFirst) {
        elmFirst = document.evaluate("//form[@name='f']",
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,
            null).singleNodeValue;
    }
    if (!elmFirst) { return; }
    var htmlRecentSearches = '<p style="font-size: small">Recent searches: ';
    var iDisplayedCount = 0;
    for (var i = arSavedSearches.length - 1;
         (iDisplayedCount < 10) && (i >= 0); i--) {
        var oSearch = arSavedSearches[i];
        if (!oSearch['searchresult']) { continue; }
        var sSearchResult = oSearch['searchresult'];
        var iSpacePos = sSearchResult.indexOf(' ');
        var sHref = sSearchResult.substring(0, iSpacePos);
        var sTitle = sSearchResult.substring(iSpacePos + 1);
        htmlRecentSearches += '<a href="' + sHref + '" title="' + 
            sTitle + '">' + oSearch['searchtext'] + '</a> &middot; ';
        iDisplayedCount++;
    }
    if (!iDisplayedCount) { return; }
    htmlRecentSearches += '[<a id="clearsavedsearches" ' +
        'title="Clear saved searches" href="#">clear</a>]</p>';
    var elmWrapper = document.createElement('div');
    elmWrapper.id = "recentsearcheslist";
    elmWrapper.innerHTML = htmlRecentSearches;
    elmFirst.parentNode.insertBefore(elmWrapper, elmFirst.nextSibling);
    window.addEventListener('load', function() {
        var elmClearLink = document.getElementById('clearsavedsearches');
        elmClearLink.addEventListener('click', clearSavedSearches, true);
    }, true);
}

function trackClick(event) {
    var sHref, sTitle;
    if (typeof(event) == 'string') {
        sHref = event;
        sTitle = '';
    } else {
        var elmTarget = event.target;
        while ((elmTarget.nodeName != 'A') &&
               (elmTarget.nodeName != 'BODY')) {
            elmTarget = elmTarget.parentNode;
        }
        if (elmTarget.nodeName != 'A') { return; }
        var elmParent = elmTarget.parentNode;
        while ((elmParent.nodeName != 'P') &&
               (elmParent.nodeName != 'BODY')) {
            elmParent = elmParent.parentNode;
        }
        if (elmParent.nodeName != 'P') { return; }
        if (elmParent.getAttribute('class') != 'g') { return; }
        sHref = elmTarget.href;
        sTitle = elmTarget.textContent;
    }
    var iSearchIndex = arSavedSearches.find(getCurrentSearchText());
    if (iSearchIndex == -1) {
        addCurrentSearch();
        iSearchIndex = arSavedSearches.length - 1;
    }
    GM_setValue('searchresult.' + iSearchIndex,
                sHref + ' ' + sTitle);
}

function watchLocation(sPropertyName, sOldValue, sNewValue) {
    trackClick(sNewValue);
    return sNewValue;
}

if (/^\/search/.test(window.location.pathname)) {
    injectRecentSearches();
    addCurrentSearch();
    document.addEventListener('click', trackClick, true);
    var unsafeDocument = document.wrappedJSObject || document;
    unsafeDocument.watch('location', watchLocation);
    unsafeDocument.location.watch('href', watchLocation);
    unsafeWindow.watch('location', watchLocation);
    unsafeWindow.location.watch('href', watchLocation);
} else if (/^\/$/.test(window.location.pathname)) {
    injectRecentSearches();
}
