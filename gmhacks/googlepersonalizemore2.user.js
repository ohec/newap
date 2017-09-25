// ==UserScript==
// @name          Google Personalize More
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   add features to Google portal
// @include       http://www.google.com/ig*
// ==/UserScript==

var prefs = new Array();
prefs['bloglines'] = {
    showing: function() {
	return (GM_getValue('bloglines.show', false) &&
		(GM_getValue('bloglines.user', '')));
    },

    savePreferences: function() {
	var elmBloglinesShow = document.getElementById('bloglines_toggle');
	var elmBloglinesUser = document.getElementById('bloglines_user');
	var sBloglinesUser = elmBloglinesUser.value;
	if (sBloglinesUser != GM_getValue('bloglines.user', '')) {
	    GM_setValue('bloglines.user', elmBloglinesUser.value);
	    GM_setValue('bloglines.lastchecked', new Date(0).toUTCString());
	}
	GM_setValue('bloglines.show', elmBloglinesShow.checked);
    },

    saveInline: function() {
	var elmUsername = document.getElementById('bloglines_user');
	var sUsername = elmUsername.value;
	if (sUsername != GM_getValue('bloglines.user', '')) {
	    GM_setValue('bloglines.user', elmUsername.value);
	    GM_setValue('bloglines.lastchecked', new Date(0).toUTCString());
	    this.refresh();
	}
    },

    cancelInline: function() {
	var elmBloglinesUser = document.getElementById('bloglines_user');
	elmBloglinesUser.value = GM_getValue('bloglines.user', '');
    },

    refresh: function() {
	var usUser = GM_getValue('bloglines.user', '');
	if (!usUser) return;
	var dateLastChecked = new Date(0);
	var sLastChecked = GM_getValue('bloglines.lastchecked', 
				       dateLastChecked.toUTCString());
	dateLastChecked.setTime(Date.parse(sLastChecked));
	var dateNow = new Date();
	var iTimeSinceLastChecked = 
            dateNow.getTime() - dateLastChecked.getTime();
	if ((iTimeSinceLastChecked >= 0) && (iTimeSinceLastChecked < 60000)) {
	    this._updateDisplay(GM_getValue('bloglines.unread', 0));
	    return;
	}
	GM_setValue('bloglines.lastchecked', dateNow.toUTCString());
	GM_xmlhttpRequest({
            method: 'GET',
            headers: {
                'User-agent': 'Mozilla/4.0 (compatible) ' +
		'+http://diveintomark.org/projects/greasemonkey/' +
		'googlepersonalizemore.user.js',
		'Referer': location.href},
            url: 'http://rpc.bloglines.com/update?ver=1&user=' + escape(usUser),
            onload: this._callback
        });
    },

    html: function() {
	return '' +
'<table width="100%" cellspacing="0" cellpadding="0">' +
'<tr>' +
'<td width="80%" style="background: #e5ecf9; color: black; ' +
'font-weight: bold;">Bloglines</td>' +
'<td width="20%" style="background: #e5ecf9; color: black; ' +
'text-align: right;">' +
'<a id="bloglines_edit" name="bloglines_edit" ' +
'href="#" style="background: transparent; color: #7777cc; ' +
'font-size: small;">edit</a>' +
'</td>' +
'</tr>' +
'</table>' +
'<form id="bloglines_details" style="display: none; background: ' +
'#e5ecf9; color: black; margin: 0; padding: 2px;">' +
'<p>' +
'<label for="bloglines_user" style="font-size: small; float: left; ' +
'position: relative; height: 2.5em; margin: 2px 0 0 2px;">Login:' +
'&nbsp;</label>' +
'<input type="text" name="bloglines_user" id="bloglines_user" ' +
'size="30" value="' + GM_getValue('bloglines.user', '') + '">' +
'<br><span style="font-size: x-small;">(not sent to Google)</span>' +
'</p>' +
'<p>' +
'<a id="bloglines_remove" href="#" style="font-size: small; ' +
'background: transparent; color: #7777cc; margin-left: 2px;">' +
'remove Bloglines</a>' +
'</p>' +
'<p>' +
'<input type="submit" name="bloglines_save" id="bloglines_save" ' +
'value="Save changes"> ' +
'<input type="button" name="bloglines_cancel" id="bloglines_cancel" ' +
'value="Cancel">' +
'</p>' +
'</form>' +
'<div style="font-size: small; padding-top: 4px; padding-bottom: ' +
'4px;" id="bloglines_unread">&nbsp;</div>';
    },

    htmlPreferences: function() {
	var bShowing = prefs['bloglines'].showing();
	return '' +
'<input type="checkbox" name="bloglines_toggle" id="bloglines_toggle"' +
(bShowing ? ' checked' : '') + '>' +
'<label for="bloglines_toggle" style="font-weight: bold; background: ' +
'transparent; color: black; margin-left: 2px;">Bloglines</label><br>' +
'<div id="bloglines_details" style="margin: 5px 0 0 21px; font-size: ' +
'small; display: ' + (bShowing ? 'block' : 'none') + '">' +
'<label for="bloglines_user" style="font-size: small; float: left; ' +
'position: relative; height: 2em; margin: 2px 0 0 2px;">Login:' +
'&nbsp;</label>' +
'<input type="text" name="bloglines_user" id="bloglines_user" ' +
'size="30" value="' + GM_getValue('bloglines.user', '') + '">' +
'<br><span style="font-size: x-small;">(not sent to Google)</span>' +
'</div>' +
'<br>';
    },

    _callback: function(oResponseDetails) {
	if (oResponseDetails.status == 200) {
	    var ssResponse = oResponseDetails.responseText;
	    var ssUnreadCount =
	        oResponseDetails.responseText.replace(/\|(.*?)\|.*/, '$1');
	    var iUnreadCount = parseInt(ssUnreadCount);
	    prefs['bloglines']._updateDisplay(iUnreadCount);
	}
    },

    _updateDisplay: function(iUnreadCount) {
	var elmUnread = document.getElementById('bloglines_unread');
	if (iUnreadCount) { 
	    elmUnread.innerHTML = 
		'<a href="http://bloglines.com/myblogs">' +
		iUnreadCount.toString() + ' unread item' +
		(iUnreadCount == 1 ? '' : 's') + '</a>'; 
	} else {
	    elmUnread.innerHTML = 'No unread items';
	}
	GM_setValue('bloglines.unread', iUnreadCount); 
    }
}

prefs['amazon'] = {
    showing: function() {
	return GM_getValue('amazon.show', false);
    },

    savePreferences: function() {
	var elmAmazonShow = document.getElementById('amazon_toggle');
	GM_setValue('amazon.show', elmAmazonShow.checked);
    },

    refresh: function() { return; },

    html: function() {
	return '' +
'<table width="100%" cellspacing="0" cellpadding="0">' +
'<tr>' +
'<td width="80%" style="background: #e5ecf9; color: black; ' +
'font-weight: bold;">Amazon Search</td>' +
'<td width="20%" style="background: #e5ecf9; color: black; ' +
'text-align: right;">' +
'<a id="amazon_edit" name="amazon_edit" ' +
'href="#" style="background: transparent; color: #7777cc; ' +
'font-size: small;">edit</a>' +
'</td>' +
'</tr>' +
'</table>' +
'<form id="amazon_details" style="display: none; background: ' +
'#e5ecf9; color: black; margin: 0; padding: 2px;">' +
'<p>' +
'<a id="amazon_remove" href="#" style="font-size: small; ' +
'background: transparent; color: #7777cc; margin-left: 2px;">' +
'remove Amazon Search</a>' +
'</p>' +
'</form>' +
'<form action="http://www.amazon.com/exec/obidos/search-handle-form/" '+
'method="post">' +
'<p>' +
'<input type="hidden" name="url" value="index=blended">' +
'<input type="text" name="field-keywords" value="" ' +
'style="font-size: small;"> ' +
'<input type="submit" value="Amazon Search">' +
'</p>' +
'</form>';
    },

    htmlPreferences: function() {
	var bShowing = prefs['amazon'].showing();
	return '' +
'<input type="checkbox" name="amazon_toggle" id="amazon_toggle"' +
(bShowing ? ' checked' : '') + '>' +
'<label for="amazon_toggle" style="font-weight: bold; background: ' +
'transparent; color: black; margin-left: 2px;">Amazon</label><br>' +
'<div id="amazon_details" style="display: none"></div>' +
'<br>';
    },
}

function addEventListener(id, eventName, eventFunc) {
    var elm = document.getElementById(id);
    elm.addEventListener(eventName, eventFunc, true);
}

function prefsNameFromEvent(event) {
    var sPrefsName = event.target.id;
    sPrefsName = sPrefsName.substring(0, sPrefsName.indexOf('_'));
    return sPrefsName;
}

function showDetails(sPrefName, bShow) {
    var elmDetails = document.getElementById(sPrefName + '_details');
    var elmEdit = document.getElementById(sPrefName + '_edit');
    if (bShow) {
	elmDetails.style.display = 'block';
	if (elmEdit) { elmEdit.innerHTML = 'close edit'; }
    }
    else {
	elmDetails.style.display = 'none';
	if (elmEdit) { elmEdit.innerHTML = 'edit'; }
    }
}

function edit(event) {
    var sPrefsName = prefsNameFromEvent(event);
    var elmDetails = document.getElementById(sPrefsName + '_details');
    var styleForm = getComputedStyle(elmDetails, '');
    showDetails(sPrefsName, (styleForm.display == 'none'));
    if (event.target.nodeName.toLowerCase() != 'input') {
	event.preventDefault();
    }
}

function remove(event) {
    var sPrefsName = prefsNameFromEvent(event);
    GM_setValue(sPrefsName + '.show', false);
    showDetails(sPrefsName, false);
    var elmWrapper = document.getElementById(sPrefsName + '_wrapper');
    elmWrapper.style.display = 'none';
    event.preventDefault();
}

function saveInline(event) {
    var sPrefsName = prefsNameFromEvent(event);
    showDetails(sPrefsName, false);
    prefs[sPrefsName].saveInline();
    event.preventDefault();
}

function cancelInline(event) {
    var sPrefsName = prefsNameFromEvent(event);
    showDetails(sPrefsName, false);
    prefs[sPrefsName].cancelInline();
    event.preventDefault();
}

function add(sPrefsName, iColumn, html) {
    var elmDiv = document.createElement('div');
    elmDiv.id = sPrefsName + '_wrapper';
    elmDiv.className = 'modbox';
    elmDiv.style.borderTop = '1px solid rgb(51,102,153)';
    elmDiv.innerHTML = html;
    var elmColumn1 = document.getElementById('c_' + iColumn);
    elmColumn1.insertBefore(elmDiv, elmColumn1.firstChild);
    addEventListener(sPrefsName + '_edit', 'click', edit);
    addEventListener(sPrefsName + '_remove', 'click', remove);
    addEventListener(sPrefsName + '_details', 'submit', saveInline);
    addEventListener(sPrefsName + '_save', 'click', saveInline);
    addEventListener(sPrefsName + '_cancel', 'click', cancelInline);
    prefs[sPrefsName].refresh();
}

function savePreferencesPage(event) {
    var elmForm = event ? event.target : this;
    for (sPrefsName in prefs) {
	prefs[sPrefsName].savePreferences();
    }
    var elmMore = document.getElementById('more');
    elmMore.parentNode.removeChild(elmMore);
    elmForm._submit();
}

function setupHomePage() {
    var iColumn = 1;
    for (sPrefsName in prefs) {
	if (prefs[sPrefsName].showing()) {
	    add(sPrefsName, iColumn, prefs[sPrefsName].html());
	}
	iColumn++;
    }
}

function setupPreferencesPage() {
    addEventListener('cf', 'submit', savePreferencesPage);
    HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = savePreferencesPage;
    var elmTBody = document.evaluate(
        "//form[@id='cf']//table//tr//table/tbody", document, null,
	XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var elmMore = document.createElement('tr');
    elmMore.id = 'more';
    for (sPrefsName in prefs) {
	var elmTD = document.createElement('td');
	elmTD.width = '32%';
	elmTD.vAlign = 'top';
	elmTD.innerHTML = prefs[sPrefsName].htmlPreferences();
	elmMore.appendChild(elmTD);
	var elmSpacerTD = document.createElement('td');
	elmSpacerTD.width = '2%';
	elmMore.appendChild(elmSpacerTD);
    }
    elmTBody.insertBefore(elmMore, elmTBody.firstChild.nextSibling);
    for (sPrefsName in prefs) {
	addEventListener(sPrefsName + '_toggle', 'click', edit);
    }
}

if (/\/ig(#|\?|$)/.test(location)) {
    setupHomePage();
} else if (/\/ig\/customize(#|\?|$)/.test(location)) {
    setupPreferencesPage();
}
