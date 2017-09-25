// ==UserScript==
// @name          Magic Line
// @namespace     http://diveintomark.org/projects/greasemonkey/
// @description   The magic personal command line for the web
// @include       *
// ==/UserScript==

var _onkeypress = null;
var gURLs = [];
var gSelectedIndex = 0;

String.prototype.trim = function() {
    return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
}

String.prototype.normalize = function() {
    return this.replace(/\s+/g, ' ').trim();
}

String.prototype.startswith = function(sMatch) {
    return this.indexOf(sMatch) == 0;
}

String.prototype.replaceString = function(sOld, sNew) {
    var re = '';
    var arSpecialChars = ['\\', '[', ']', '(', ')', '.', '*', '+', 
			  '^', '$', '?', '|', '{', '}'];
    for (var i = 0; i < sOld.length; i++) {
	var c = sOld.charAt(i);
	if (arSpecialChars.contains(c)) {
	    re += '\\' + c;
	} else {
	    re += c;
	}
    }
    var oRegExp = new RegExp('(' + re + ')', 'gim');
    return this.replace(oRegExp, sNew);
}

String.prototype.lpad = function(cPadder, iMaxLen) {
    var s = this;
    for (var i = s.length; i < iMaxLen; i++) {
	s = cPadder + s;
    }
    return s;
}

String.prototype.rpad = function(cPadder, iMaxLen) {
    var s = this;
    for (var i = s.length; i < iMaxLen; i++) {
	s = s + cPadder;
    }
    return s;
}

String.prototype.toAscii = function() {
    return this.replace(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\-\=\_\
			  \+\[\]\\\{\}\|\;\'\:\"\,\.\/\<\>\? ]/g, ' ');
}

String.prototype.containsAll = function(arKeywords) {
    var s = this.toLowerCase();
    for (var i = 0; i < arKeywords.length; i++) {
	var sKeyword = arKeywords[i].toLowerCase();
	if (s.indexOf(sKeyword) == -1) {
	    return false;
	}
    }
    return true;
}

String.prototype.containsAny = function(arKeywords) {
    var s = this.toLowerCase();
    for (var i = 0; i < arKeywords.length; i++) {
	var sKeyword = arKeywords[i].toLowerCase();
	if (s.indexOf(sKeyword) != -1) {
	    return true;
	}
    }
    return false;
}

String.prototype.toXML = function() {
    var oParser = new DOMParser();
    return oParser.parseFromString(this, 'application/xml');
}

Array.prototype.contains = function(sString) {
    for (var i = 0; i < this.length; i++) {
	if (this[i] == sString) {
	    return true;
	}
    }
    return false;
}

XMLDocument.prototype.NSResolver = function(prefix) {
    return {
'atom03': 'http://purl.org/atom/ns#',
'atom10': 'http://www.w3.org/2005/Atom',
'dc': 'http://purl.org/dc/elements/1.1/',
'foaf': 'http://xmlns.com/foaf/0.1/',
'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
'rss09': 'http://my.netscape.com/rdf/simple/0.9/',
'rss10': 'http://purl.org/rss/1.0/',
'xhtml': 'http://www.w3.org/1999/xhtml'
    }[prefix];
}

XMLDocument.prototype.textOf = function(elmRoot, sXPath) {
    var elmTarget = document.evaluate(sXPath, elmRoot, this.NSResolver,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return (elmTarget?elmTarget.textContent:'').replace(/<\S[^>]*>/g,'');
}

XMLDocument.prototype.firstOf = function(elmRoot, sXPath) {
    return document.evaluate(sXPath, elmRoot, this.NSResolver,
        XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

XMLDocument.prototype.arrayOf = function(elmRoot, sXPath) {
    var snapResults = document.evaluate(sXPath, elmRoot, this.NSResolver,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var arResults = [];
    for (var i = 0; i < snapResults.snapshotLength; i++) {
	arResults.push(snapResults.snapshotItem(i));
    }
    return arResults;
}

var PoorMansFeedParser = {
    // some day I'll port my Universal Feed Parser to Javascript...
    
    feed: "/atom03:feed | " +
          "/atom10:feed | " +
          "/rdf:RDF/rss10:channel | " +
          "/rdf:RDF/rss09:channel | " +
          "/rss/channel",

    entries: "/atom03:feed/atom03:entry | " +
             "/atom10:feed/atom10:entry | " +
             "/rdf:RDF/rss10:item | " +
             "/rdf:RDF/rss09:item | " +
             "/rss/channel/item",

    title: "./atom03:title | " +
           "./atom10:title | " +
           "./rss10:title | " +
           "./rss09:title | " +
           "./dc:title | " +
           "./title",

    link: "./atom03:link[@rel='alternate']/@href | " +
          "./atom10:link[@rel='alternate']/@href | " +
          "./rss10:link | " +
          "./rss09:link | " +
          "./link",

    description: "./atom03:tagline | " +
                 "./atom10:tagline | " +
                 "./atom03:summary | " +
                 "./atom10:summary | " +
                 "./rss10:description | " +
                 "./rss09:description | " +
                 "./dc:description | " +
                 "./description",

    keywords: "./dc:subject | " +
              "./category",

    name: "./atom03:author/atom03:name | " +
            "./atom10:author/atom10:name | " +
            "./dc:creator | " +
            "./dc:author | " +
            "./dc:publisher | " +
            "./dc:owner | " +
            "./author | " +
            "./managingEditor | " +
            "./managingeditor | " +
            "./webMaster | " +
            "./webmaster",

    _parseElement: function(oDom, elmRoot) {
	var oResults = {};
	oResults.url = oDom.textOf(elmRoot, this.link);
	oResults.title = oDom.textOf(elmRoot, this.title);
	oResults.name = oDom.textOf(elmRoot, this.name);
	oResults.description = oDom.textOf(elmRoot, this.description);
	oResults.keywords = oDom.textOf(elmRoot, this.keywords);
	return oResults;
    },

    parse: function(sFeed) {
	var oResults = {feed: {}, entries: []};
	var oDom = sFeed.toXML();
	var elmFeed = oDom.firstOf(oDom, this.feed);
	if (elmFeed) {
	    oResults.feed = this._parseElement(oDom, elmFeed);
	}
	var arEntries = oDom.arrayOf(oDom, this.entries);
	for (var i = 0; i < arEntries.length; i++) {
	    var elmEntry = arEntries[i];
	    if (elmEntry) {
		oResults.entries.push(this._parseElement(oDom, elmEntry));
	    }
	}
	return oResults;
    },
}

var PoorMansFOAFParser = {
    person: "//foaf:Person",
    name: "./foaf:name",
    url: "./foaf:homepage/@rdf:resource",
    keywords: "./dc:subject",

    _parsePerson: function(oDom, elmRoot) {
	var oResults = {};
	return oResults;
    },

    parse: function(sFoaf) {
	var arResults = [];
	var oDom = sFoaf.toXML();
	var arPerson = oDom.arrayOf(oDom, this.person);
	for (var i = 0; i < arPerson.length; i++) {
	    var elmPerson = arPerson[i];
	    if (elmPerson) {
		var oPerson = {};
		oPerson.name = oDom.textOf(elmPerson, this.name);
		oPerson.url = oDom.textOf(elmPerson, this.url);
		oPerson.keywords = oDom.textOf(elmPerson, this.keywords);
		arResults.push(oPerson);
	    }
	}
	return arResults;
    }
}

function getPageFoaf() {
    var elmPossible = document.evaluate("//link[@rel][@type][@href]",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var arFoaf = [];
    for (var i = 0; i < elmPossible.snapshotLength; i++) {
	var elm = elmPossible.snapshotItem(i);
	if (!elm.rel || !elm.type || !elm.href) { continue; }
	var sRel = elm.rel.toLowerCase().normalize();
	if ((sRel + ' ').indexOf('meta ') == -1) { continue; }
	var sType = elm.type.toLowerCase().trim();
	if (sType != 'application/rdf+xml') { continue; }
	var urlFoaf = elm.href.trim();
	arFoaf.push(urlFoaf);
    }
    return arFoaf;
}

function getPageFeeds() {
    var elmPossible = document.evaluate("//*[@rel][@type][@href]",
        document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var arFeeds = [];
    for (var i = 0; i < elmPossible.snapshotLength; i++) {
	var elm = elmPossible.snapshotItem(i);
	if (!elm.rel || !elm.type || !elm.href) { continue; }
	var sRel = elm.rel.toLowerCase().normalize();
	if ((sRel + ' ').indexOf('alternate ') == -1) { continue; }
	var sType = elm.type.toLowerCase().trim();
	if ((sType != 'application/rss+xml') &&
	    (sType != 'application/atom+xml') &&
	    (sType != 'text/xml')) { continue; }
	var urlFeed = elm.href.trim();
	arFeeds.push(urlFeed);
    }
    return arFeeds;
}

function saveInfo(iIndex, sURL, sTitle, sName, sDescription, sKeywords, 
		  sReferrer, sSource) {
    sTitle = (sTitle || '').trim().toAscii();
    sName = (sName || '').trim().toAscii();
    sDescription = (sDescription || '').trim().toAscii();
    sKeywords = (sKeywords || '').replace(/,/g, ' ').normalize().toAscii();
    sReferrer = (sReferrer || '').trim().toAscii();
    GM_setValue(iIndex + '.url', sURL);
    GM_setValue(iIndex + '.title', sTitle);
    GM_setValue(iIndex + '.name', sName);
    GM_setValue(iIndex + '.description', sDescription);
    GM_setValue(iIndex + '.keywords', sKeywords);
    GM_setValue(iIndex + '.referrer', sReferrer);
    GM_setValue(iIndex + '.source', sSource);
    GM_setValue(iIndex + '.magicsearch',
        sURL.toLowerCase().substring(0, 255).rpad(' ', 255) + ' ' +
        sTitle.toLowerCase().substring(0, 255).rpad(' ', 255) + ' ' + 
        sName.toLowerCase().substring(0, 255).rpad(' ', 255) + ' ' +
        sDescription.toLowerCase().substring(0, 255).rpad(' ', 255) + ' ' +
        sKeywords.toLowerCase().substring(0, 255).rpad(' ', 255) + ' ' +
        sReferrer.toLowerCase().substring(0, 255).rpad(' ', 255) + ' ' +
        sSource.toLowerCase().substring(0, 255).rpad(' ', 255));
}

function findHistory(sKeywords) {
    var sMatchKeywords, iIndex;
    for (iIndex = 0; sMatchKeywords = GM_getValue('history.' + iIndex + 
	'.keywords', null); 
	 ++iIndex) {
	if (sKeywords == sMatchKeywords) { break; }
    }
    return iIndex;
}

function findCacheURL(sURL) {
    var sMatchURL, iIndex;
    for (iIndex = 0; sMatchURL = GM_getValue('cache.' + iIndex + '.url', 
					     null);
        ++iIndex) {
	if (sURL == sMatchURL) { break; }
    }
    return iIndex;
}

function findURL(sURL) {
    var sMatchURL, iIndex;
    for (iIndex = 0; sMatchURL = GM_getValue(iIndex + '.url', null);
        ++iIndex) {
	if (sURL == sMatchURL) { break; }
    }
    return iIndex;
}

function collectPageInfo() {
    try {
	var sURL = window.top.location.href;
    } catch (e) {
	var sURL = document.location.href;
    }
    var sTitle = (window.top.document.title || '');
    try {
	sTitle = sTitle.valueOf();
	sTitle = new String(sTitle).trim();
    } catch (e) {
	sTitle = '';
    }
    var sName = '';
    var sDescription = '';
    var sKeywords = '';

    // if this page has an entry already, get its index; otherwise
    // we'll create a new entry at the next available index
    var iIndex = findURL(sURL);

    // collect keywords, descriptions, and authors from <meta> elements
    var snapMeta = document.evaluate("//meta", document, null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var arKeywords = ['keywords', 'dc.keywords'];
    var arDescription = ['description', 'dc.description'];
    var arName = ['author', 'creator', 'owner', 'dc.author',
        'dc.creator', 'dc.publisher'];
    var arTitle = ['title', 'dc.title'];
    for (var i = 0; i < snapMeta.snapshotLength; i++) {
	var elmMeta = snapMeta.snapshotItem(i);
	var sMetaName = elmMeta.getAttribute("name");
	if (!sMetaName) { continue; }
	sMetaName = sMetaName.toLowerCase().trim();
	var sContent = elmMeta.getAttribute("content");
	if (!sContent) { continue; }
	sContent = sContent.normalize() + ' ';
	if (arKeywords.contains(sMetaName) &&
	    (sKeywords.indexOf(sContent.toLowerCase()) == -1)) {
	    sKeywords += sContent.toLowerCase();
	} else if (arDescription.contains(sMetaName) &&
		   (sDescription.indexOf(sContent) == -1)) {
	    sDescription += sContent;
	} else if (arName.contains(sMetaName) &&
		   (sName.indexOf(sContent) == -1)) {
	    sName += sContent;
	} else if (!sTitle && arTitle.contains(sMetaName)) {
	    sTitle = sContent.trim();
	}
    }

    // collect keywords from <a rel="tag"> elements
    for (var i = 0; i < document.links.length; i++) {
	var elmLink = document.links[i];
	var sRel = (elmLink.rel || '').toLowerCase().normalize() + ' ';
	if (sRel.indexOf('tag ') != -1) {
	    sKeywords += elmLink.textContent.normalize() + ' ';
	}
    }

    // save page info
    saveInfo(iIndex, sURL, sTitle, sName, sDescription,
        sKeywords, document.referrer, 'history');
}

function collectXFNInfo() {
    var sXFNRel = 'contact acquaintance friend met co-worker coworker ' +
	'colleague co-resident coresident neighbor child parent ' +
	'sibling brother sister spouse wife husband kin relative ' +
	'muse crush date sweetheart me ';
    var arXFN = [];
    for (var i = 0; i < document.links.length; i++) {
	var elmLink = document.links[i];
	var sRel = (elmLink.rel || '').toLowerCase().normalize();
	if (!sRel) { continue; }
	var arRel = sRel.split(' ');
	for (var j = 0; j < arRel.length; j++) {
	    if (sXFNRel.indexOf(arRel[j] + ' ') != -1) {
		arXFN.push({
                    url: elmLink.href,
                    name: elmLink.textContent.normalize(),
                    description: (elmLink.title || '').normalize(),
                    keywords: sRel
                });
		break;
	    }
	}
    }
    for (var i = 0; i < arXFN.length; i++) {
	var oXFN = arXFN[i];
	var iXFNIndex = findURL(oXFN.url);
	saveInfo(iXFNIndex, oXFN.url, '', oXFN.name,
            oXFN.description, oXFN.keywords, '', 'XFN');
    }
}

function collectFOAFInfo() {
    var arFoaf = getPageFoaf();
    for (var i = 0; i < arFoaf.length; i++) {
	var sFoafURL = arFoaf[i];
	var iCacheIndex = findCacheURL(sFoafURL);
	if (GM_getValue('cache.' + iCacheIndex + '.url')) { continue; }
	GM_setValue('cache.' + iCacheIndex + '.url', sFoafURL);
	GM_setValue('cache.' + iCacheIndex + '.date', 
		    (new Date()).toString());
	GM_xmlhttpRequest({
            method: 'GET',
            url: sFoafURL,
            onload: function(oResponseDetails) {
                var arPerson = PoorMansFOAFParser.parse(
                    oResponseDetails.responseText);
		for (var i = 0; i < arPerson.length; i++) {
		    var oPerson = arPerson[i];
		    if (!oPerson.url) { continue; }
		    var iPersonIndex = findURL(oPerson.url);
		    saveInfo(iPersonIndex,
			     oPerson.url,
			     GM_getValue(iPersonIndex + 
					 '.title', ''),
			     GM_getValue(iPersonIndex + 
					 '.name', oPerson.name),
			     GM_getValue(iPersonIndex + 
					 '.description', ''),
			     GM_getValue(iPersonIndex + 
					 '.keywords', oPerson.keywords),
			     GM_getValue(iPersonIndex + 
					 '.referrer', sFoafURL),
			     GM_getValue(iPersonIndex + 
					 '.source', 'FOAF'));
		}
	    }});
    }
}

function collectFeedInfo() {
    var arFeeds = getPageFeeds();
    for (var i = 0; i < arFeeds.length; i++) {
	var sFeedURL = arFeeds[i];
	var iCacheIndex = findCacheURL(sFeedURL);
	var lCache = Date.parse(GM_getValue(
            'cache.' + iCacheIndex + '.date', new Date(0).toString()));
	var lNow = new Date().getTime();
	if (lCache != 0) {
	    if (lNow < lCache) { continue; }
	    if (lNow - lCache < 86400000) { continue; } // 1 day
	}
	GM_setValue('cache.' + iCacheIndex + '.url', sFeedURL);
	var dateNow = new Date(0);
	dateNow.setTime(lNow);
	GM_setValue('cache.' + iCacheIndex + '.date', dateNow.toString());
	GM_xmlhttpRequest({
            method: 'GET',
            url: sFeedURL,
            onload: function(oResponseDetails) {
                var oData = PoorMansFeedParser.parse(
                    oResponseDetails.responseText);
		var oFeed = oData.feed;
		if (oFeed.url) {
		    var iFeedIndex = findURL(oFeed.url);
		    saveInfo(iFeedIndex,
			     oFeed.url,
			     GM_getValue(iFeedIndex + 
					 '.title', oFeed.title),
			     GM_getValue(iFeedIndex + 
					 '.name', oFeed.name),
			     GM_getValue(iFeedIndex + 
					 '.description', oFeed.description),
			     GM_getValue(iFeedIndex + 
					 '.keywords', '') + ' ' + 
			                 oFeed.keywords,
			     GM_getValue(iFeedIndex + 
					 '.referrer', ''),
			     GM_getValue(iFeedIndex + 
					 '.source', 'feed'));
		}
		var arEntries = oData.entries;
		if (arEntries.length) {
		    for (var i = 0; i < arEntries.length; i++) {
			var oEntry = arEntries[i];
			if (!oEntry.url) { continue; }
			var iEntryIndex = findURL(oEntry.url);
			saveInfo(iEntryIndex,
				 oEntry.url,
				 GM_getValue(iEntryIndex + 
					     '.title', oEntry.title),
				 GM_getValue(iEntryIndex + 
					     '.name', oEntry.name),
				 GM_getValue(iEntryIndex + 
					     '.description', 
					     oEntry.description),
				 GM_getValue(iEntryIndex + 
					     '.keywords', '') + ' ' + 
				             oEntry.keywords,
				 GM_getValue(iEntryIndex + 
					     '.referrer', ''),
				 GM_getValue(iEntryIndex + 
					     '.source', 'feed'));
		    }
		}
	    }});
    }
}

function displayKeyFromEvent(e) {
    var bCtrlKey = e.ctrlKey;
    var bAltKey = e.altKey;
    var bShiftKey = e.shiftKey;
    var sDisplayKey = (bCtrlKey ? 'Ctrl + ' : '') +
	(bAltKey ? 'Alt + ' : '') +
	(bShiftKey ? 'Shift + ' : '');
    var sKey = String.fromCharCode(e.which);
    switch (e.keyCode) {
    case e.DOM_VK_TAB: return sDisplayKey + 'Tab';
    case e.DOM_VK_CLEAR: return sDisplayKey + 'Clear';
    case e.DOM_VK_RETURN: return sDisplayKey + 'Return';
    case e.DOM_VK_ENTER: return sDisplayKey + 'Enter';
    case e.DOM_VK_PAUSE: return sDisplayKey + 'Pause';
    case e.DOM_VK_ESCAPE: return sDisplayKey + 'Esc';
    case e.DOM_VK_SPACE: return sDisplayKey + 'Space';
    case e.DOM_VK_PAGE_UP: return sDisplayKey + 'PgUp';
    case e.DOM_VK_PAGE_DOWN: return sDisplayKey + 'PgDn';
    case e.DOM_VK_END: return sDisplayKey + 'End';
    case e.DOM_VK_HOME: return sDisplayKey + 'Home';
    case e.DOM_VK_LEFT: return sDisplayKey + 'Left Arrow';
    case e.DOM_VK_UP: return sDisplayKey + 'Up Arrow';
    case e.DOM_VK_RIGHT: return sDisplayKey + 'Right Arrow';
    case e.DOM_VK_DOWN: return sDisplayKey + 'Down Arrow';
    case e.DOM_VK_PRINTSCREEN: return sDisplayKey + 'PrtSc';
    case e.DOM_VK_INSERT: return sDisplayKey + 'Ins';
    case e.DOM_VK_DELETE: return sDisplayKey + 'Del';
    case e.DOM_VK_NUMPAD0: return sDisplayKey + 'NumPad 0';
    case e.DOM_VK_NUMPAD1: return sDisplayKey + 'NumPad 1';
    case e.DOM_VK_NUMPAD2: return sDisplayKey + 'NumPad 2';
    case e.DOM_VK_NUMPAD3: return sDisplayKey + 'NumPad 3';
    case e.DOM_VK_NUMPAD4: return sDisplayKey + 'NumPad 4';
    case e.DOM_VK_NUMPAD5: return sDisplayKey + 'NumPad 5';
    case e.DOM_VK_NUMPAD6: return sDisplayKey + 'NumPad 6';
    case e.DOM_VK_NUMPAD7: return sDisplayKey + 'NumPad 7';
    case e.DOM_VK_NUMPAD8: return sDisplayKey + 'NumPad 8';
    case e.DOM_VK_NUMPAD9: return sDisplayKey + 'NumPad 9';
    case e.DOM_VK_MULTIPLY: return sDisplayKey + 'NumPad *';
    case e.DOM_VK_ADD: return sDisplayKey + 'NumPad +';
    case e.DOM_VK_SEPARATOR: return sDisplayKey + 'NumPad Sep';
    case e.DOM_VK_SUBTRACT: return sDisplayKey + 'NumPad -';
    case e.DOM_VK_DECIMAL: return sDisplayKey + 'NumPad .';
    case e.DOM_VK_DIVIDE: return sDisplayKey + 'NumPad /';
    case e.DOM_VK_F1: return sDisplayKey + 'F1';
    case e.DOM_VK_F2: return sDisplayKey + 'F2';
    case e.DOM_VK_F3: return sDisplayKey + 'F3';
    case e.DOM_VK_F4: return sDisplayKey + 'F4';
    case e.DOM_VK_F5: return sDisplayKey + 'F5';
    case e.DOM_VK_F6: return sDisplayKey + 'F6';
    case e.DOM_VK_F7: return sDisplayKey + 'F7';
    case e.DOM_VK_F8: return sDisplayKey + 'F8';
    case e.DOM_VK_F9: return sDisplayKey + 'F9';
    case e.DOM_VK_F10: return sDisplayKey + 'F10';
    case e.DOM_VK_F11: return sDisplayKey + 'F11';
    case e.DOM_VK_F12: return sDisplayKey + 'F12';
    case e.DOM_VK_F13: return sDisplayKey + 'F13';
    case e.DOM_VK_F14: return sDisplayKey + 'F14';
    case e.DOM_VK_F15: return sDisplayKey + 'F15';
    case e.DOM_VK_F16: return sDisplayKey + 'F16';
    case e.DOM_VK_F17: return sDisplayKey + 'F17';
    case e.DOM_VK_F18: return sDisplayKey + 'F18';
    case e.DOM_VK_F19: return sDisplayKey + 'F19';
    case e.DOM_VK_F20: return sDisplayKey + 'F20';
    case e.DOM_VK_F21: return sDisplayKey + 'F21';
    case e.DOM_VK_F22: return sDisplayKey + 'F22';
    case e.DOM_VK_F23: return sDisplayKey + 'F23';
    case e.DOM_VK_F24: return sDisplayKey + 'F24';
    case e.DOM_VK_NUM_LOCK: return sDisplayKey + 'NumLk';
    case e.DOM_VK_SCROLL_LOCK: return sDisplayKey + 'ScrLk';
    }
    if (/^[a-zA-z0-9;=,\`\.\/;\'\[\]\\]$/.test(sKey)) {
	return sDisplayKey + sKey.toUpperCase();
    }
    return '';
}

function magicSubmit(event) {
    var elmForm = event ? event.target : this;
    while (elmForm.nodeName.toUpperCase() != 'FORM') {
	elmForm = elmForm.parentNode;
    }
    if (!elmForm.id || elmForm.id != 'magicform') {
	return elmForm._submit();
    }
    var doc = window.top.document;
    var elmMagicLine = doc.getElementById('magicline');
    var usMagicLine = elmMagicLine.value;
    usMagicLine = usMagicLine.normalize();
    var elmMagicResults = doc.getElementById('magicresults');
    if (elmMagicResults) {
	var sURL = gURLs[gSelectedIndex];
	var arKeywords = usMagicLine.split(' ');
	arKeywords.sort();
	usMagicLine = arKeywords.join(' ');
	var iHistoryIndex = findHistory(usMagicLine);
	GM_setValue('history.' + iHistoryIndex + '.keywords', 
		    usMagicLine);
	GM_setValue('history.' + iHistoryIndex + '.url', sURL);
	window.setTimeout(function() {
	    window.top.location.href = sURL;
	}, 0);
    } else if (usMagicLine) {
	var ssMagicLine = escape(usMagicLine);
	window.setTimeout(function() {
	    window.top.location.href = GM_getValue('searchengine',
                'http://www.google.com/search?q=') + ssMagicLine;
	}, 0);
    }
    magicHide();
    event.preventDefault();
    return false;
}

function magicKeypress(event) {
    var sKey = displayKeyFromEvent(event);
    if (sKey == 'Esc') {
	magicHide();
	return true;
    } else if (sKey == 'Up Arrow' || sKey == 'Down Arrow') {
	magicScrollResults(sKey == 'Up Arrow');
	event.preventDefault();
	return false;
    }
    window.setTimeout(function() {
	if (!magicSearch()) {
	    magicHideResults();
	}
    }, 0);
    return true;
}

function magicHideResults() {
    var doc = window.top.document;
    var elmMagicResults = doc.getElementById('magicresults');
    if (!elmMagicResults) { return; }
    elmMagicResults.parentNode.style.height = '76px';
    elmMagicResults.parentNode.removeChild(elmMagicResults);
}

function magicScrollResults(bUp) {
    var doc = window.top.document;
    var elmMagicResults = doc.getElementById('magicresults');
    if (!elmMagicResults) { return; }
    var iNumResults = gURLs.length;
    if (iNumResults <= 1) { return; }
    var iOldSelectedIndex = gSelectedIndex;
    var iNewSelectedIndex = iOldSelectedIndex + (bUp ? -1 : 1);
    if (iNewSelectedIndex < 0) {
	iNewSelectedIndex = iNumResults - 1;
    }
    if (iNewSelectedIndex >= iNumResults) {
	iNewSelectedIndex = 0;
    }
    var arResults = elmMagicResults.getElementsByTagName('li');
    var elmOld = arResults[iOldSelectedIndex];
    var elmNew = arResults[iNewSelectedIndex];
    elmOld.style.backgroundColor = '#333';
    elmOld.style.color = 'white';
    elmNew.style.backgroundColor = '#ccc';
    elmNew.style.color = 'black';
    gSelectedIndex = iNewSelectedIndex;
}

function magicSearch() {
    var doc = window.top.document;
    var elmMagicLine = doc.getElementById('magicline');
    if (!elmMagicLine) { return false; }
    var sKeywords = elmMagicLine.value;
    sKeywords = sKeywords.toLowerCase().normalize();
    if (!sKeywords) { return false; }
    var arKeywords = sKeywords.split(' ');
    arKeywords.sort();
    sKeywords = arKeywords.join(' ');
    var iHistoryIndex = findHistory(sKeywords);
    var arResults = [];
    for (var i = 0; sMagicSearch = GM_getValue(i + 
					       '.magicsearch'); i++) {
	var iMatch = -1;
	var iLowestMatch = 99999;
	for (var j = 0; j < arKeywords.length; j++) {
	    iMatch = sMagicSearch.indexOf(arKeywords[j]);
	    if (iMatch == -1) { break; }
	    if (iMatch < iLowestMatch) {
		iLowestMatch = iMatch;
	    }
	}
	if (iMatch == -1 || iLowestMatch == 99999) { continue; }
	arResults.push(iLowestMatch.toString().lpad('0', 6) + ' ' +
            i + ' ' + sMagicSearch);
    }
    if (!arResults.length) { return false; }
    arResults.sort();
    var elmMagicDiv = doc.getElementById('magicdiv');
    if (!elmMagicDiv) { return false; } // should never happen
    var elmMagicResults = doc.getElementById('magicresults');
    if (!elmMagicResults) {
	elmMagicResults = doc.createElement('div');
	elmMagicResults.id = 'magicresults';
	elmMagicResults.setAttribute("style", 
	    "opacity: 1.0; background-color: #333; color: white; " +
            "overflow: hidden;");
	elmMagicDiv.appendChild(elmMagicResults);
    }
    var htmlResults = '<ul style="opacity: 1.0; list-style: none; ' +
	'margin: 0; padding: 0; text-align: left;">';
    var sHistoryURL = GM_getValue('history.' + iHistoryIndex + '.url');
    if (sHistoryURL) {
	for (var iSelectedIndex = 0; 
	     iSelectedIndex < arResults.length; 
	     iSelectedIndex++) {
	    if (arResults[iSelectedIndex].split(' ')[2] == sHistoryURL) {
		var sHistoryResults = arResults[iSelectedIndex];
		for (var j = iSelectedIndex; j > 0; j--) {
		    arResults[j] = arResults[j - 1];
		}
		arResults[0] = sHistoryResults;
		break;
	    }
	}
    }
    gSelectedIndex = 0;
    gURLs = [];
    var iMaxResults = GM_getValue('maxresults', 6);
    for (var i = 0; (i < iMaxResults) && (i < arResults.length); i++) {
	var arLines = [];
	var iIndex = arResults[i].split(' ')[1];
	var sURL = GM_getValue(iIndex + '.url', '');
	gURLs.push(sURL);
	var sTitle = GM_getValue(iIndex + '.title', '');
	var sName = GM_getValue(iIndex + '.name', '');
	var sDescription = GM_getValue(iIndex + '.description', '');
	var sKeywords = GM_getValue(iIndex + '.keywords', '');
	var sReferrer = GM_getValue(iIndex + '.referrer', '');
	var sSource = GM_getValue(iIndex + '.source', '');
	if (sTitle) {
	    arLines.push(sTitle);
	}
	if (sName && (!sTitle || sName.containsAny(arKeywords))) {
	    arLines.push(sName);
	}
	if (sDescription.containsAny(arKeywords)) {
	    arLines.push(sDescription);
	}
	if (sKeywords.containsAny(arKeywords)) {
	    arLines.push('tags: ' + sKeywords);
	}
	if (sReferrer.containsAny(arKeywords)) {
	    arLines.push('via: ' + sReferrer);
	}
	if (sSource.containsAny(arKeywords)) {
	    arLines.push('source: ' + sSource);
	}
	arLines.push(sURL);
	for (var j = 0; j < arKeywords.length; j++) {
	    var sKeyword = arKeywords[j];
	    for (var k = 0; k < arLines.length; k++) {
		arLines[k] = arLines[k].replaceString(sKeyword, 
						      '<b>$1</b>');
	    }
	}
	arLines[arLines.length - 1] = '<span style="font-size: 9px;">' + 
	    arLines[arLines.length - 1] + '</span>';
	htmlResults += '<li style="opacity: 1.0; display: block; ' +
	    'margin: 0; padding: 5px 10px 5px 10px; line-height: 140%; ' +
	    'text-align: left; font-weight: normal; font-size: 12px; ' +
	    'font-family: Optima, Verdana, sans-serif; font-variant: none;';
	if (i == gSelectedIndex) {
	    htmlResults += ' background-color: #ccc; color: black;';
	} else {
	    htmlResults += ' background-color: #333; color: white;';
	}
	if (i > 0) {
	    htmlResults += ' margin-top: 5px; border-top: 1px dotted #888;';
	}
	htmlResults += '"><nobr>';
	htmlResults += arLines.join('</nobr><br><nobr>');
	htmlResults += '</nobr></li>';
    }
    htmlResults += '</ul>';
    elmMagicResults.innerHTML = htmlResults;
    var style = getComputedStyle(elmMagicResults, '');
    elmMagicDiv.style.height = 76 + parseInt(style.height) + 'px';
    return true;
}

function magicHide() {
    var doc = window.top.document;
    var elmWrapper = doc.getElementById('magicwrapper');
    if (!elmWrapper) { return; }
    doc.getElementById('magicline').blur(); // fixes weird focus issue
    elmWrapper.parentNode.removeChild(elmWrapper);
    HTMLFormElement.prototype.submit = HTMLFormElement.prototype._submit;
    HTMLFormElement.prototype._submit = null;
    if (_onkeypress) {
	var unsafeDocument = document.wrappedJSObject || document;
	unsafeDocument.onkeypress = _onkeypress;
	_onkeypress = null;
    }
}

function magicShow() {
    var doc = window.top.document;
    var elmMagic = doc.createElement('div');
    elmMagic.id = 'magicwrapper';
    var iWidth = window.top.innerWidth;
    var iHeight = window.top.innerHeight;
    elmMagic.setAttribute("style", "z-index: 99998; position: fixed; " +
        "top: 0; left: 0; width: " + iWidth + "px; height: " + iHeight + 
        "px; background-color: white; color: black; opacity: 0.88;");
    elmMagic.innerHTML = '<div id="magicdiv" style="z-index: 99999; ' +
	'opacity: 1.0; position: fixed; top: 50px; left: ' + 
	((iWidth / 2) - 250) + 'px; width: 500px; height: 76px; ' +
	'-moz-border-radius: 1em; background-color: #333; ' +
	'color: white; margin: 0; padding: 0">' +
	'<div style="opacity: 1.0; display: block; margin: 10px 0 0 0; ' +
	'padding: 0; text-align: center; font-size: 12px; ' +
	'font-family: Optima, Verdana, sans-serif; font-weight: normal;' +
	'font-variant: small-caps; letter-spacing: 0.1em;">' +
	'&mdash; Magic Line &mdash;</div><form id="magicform" ' +
	'style="opacity: 1.0; position: relative; padding: 0; ' +
	'margin: 1em 0 0 0;"><input style="opacity: 1.0; ' +
	'background: #333; color: white; border: 1px solid white; ' +
	'display: block; width: 460px; margin: 10px auto 10px auto; ' +
	'padding: 1px 1em 1px 1em; -moz-border-radius: 1em; ' +
	'font-size: 11px; font-family: Optima, Verdana, sans-serif;"' +
	'type="text" name="magicline" id="magicline" value="" ' +
	'autocomplete="off"></form></div>';
    HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = magicSubmit;
    doc.body.appendChild(elmMagic);
    var elmForm = doc.getElementById('magicform');
    elmForm.addEventListener('submit', magicSubmit, true);
    elmForm.addEventListener('keypress', magicKeypress, true);
    var unsafeDocument = document.wrappedJSObject || document;
    if (unsafeDocument.onkeypress) {
	_onkeypress = unsafeDocument.onkeypress;
	unsafeDocument.onkeypress = null;
    }
    doc.getElementById('magicline').focus();
}

function onkeypress(event) {
    var doc = window.top.document;
    var elmMagicWrapper = doc.getElementById('magicwrapper');
    if (elmMagicWrapper) { return true; }
    var sDisplayKey = displayKeyFromEvent(event);
    var sMagicKey = GM_getValue('key', 'Ctrl + Shift + L');
    if (!sDisplayKey || sDisplayKey != sMagicKey) {
	return true;
    }
    magicShow();
    event.preventDefault();
    return false;
}

document.addEventListener('keypress', onkeypress, true);
if (/^http/.test(window.top.location.href)) {
    window.addEventListener('load', function() {
	window.setTimeout(function() {
	    collectPageInfo();
	    collectXFNInfo();
	    collectFeedInfo();
	    collectFOAFInfo();
	}, 0);
    }, true);
}
