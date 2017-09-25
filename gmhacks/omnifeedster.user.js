// ==UserScript==
// @name          OmniFeedster
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   display who's linking to this page (via Feedster)
// @include       http://*
// ==/UserScript==

var _expanded = false;

function getFeedsterLinks(sID) {
    var urlFeedster = 'http://feedster.com/links.php?' +
        'type=rss&limit=5&url=' + escape(getCurrentUrl());
    GM_xmlhttpRequest({
        method: 'GET',
        url: urlFeedster,
        onload: function(oResponseDetails) {
            if (oResponseDetails.status != 200) {
                _refresh(sID, '');
                return;
            }
            var oParser = new DOMParser();
            var oDom = oParser.parseFromString(
                oResponseDetails.responseText, 'application/xml');
            if (oDom.firstChild.nodeName == 'parsererror') {
                _refresh(sID, '');
                return;
            }
	    var html, arItems, oItem, urlLink, sTitle, sDescription;
            html = '<ul style="list-style: none; margin: 0; padding: 0">';
            arItems = oDom.getElementsByTagName('item');
            for (var i = 0; i < arItems.length; i++) {
                oItem = arItems[i];
                urlLink = oItem.getElementsByTagName('link')[0].textContent;
                sTitle = oItem.getElementsByTagName('title')[0].textContent;
                sDescription = unescape(oItem.getElementsByTagName(
                    'description')[0].textContent.replace(/<\S[^>]*>/g, ''));
            html += '<li><a style="display: block; padding-bottom: 2px; ' +
                'border-bottom: 1px solid #888; text-decoration: none; ' +
                'background-color: transparent; color: navy; font: 10px ' +
                '"Gill Sans", Verdana, sans-serif; font-weight: normal; ' +
                'font-variant: none;" href="' + urlLink + '" title="' + 
                sDescription + '">' + sTitle + '</a></li>';
        }
        html += '</ul>';
        _refresh(sID, html);
    }});
}

function _refresh(sID, htmlContent) {
    var elmFloater = document.getElementById(sID);
    if (!elmFloater) { return; }
    var elmContent = document.getElementById(sID + '_content');
    if (!elmContent) { return; }
    elmContent.innerHTML = htmlContent + 
        '[<a style="text-decoration: none; background-color: ' +
        'transparent; color: navy; font: 10px "Gill Sans", Verdana, ' +
        'sans-serif; font-weight: normal; font-variant: none;" ' +
        'title="Find this page on Feedster!" ' +
        'href="http://feedster.com/links.php?url=' + 
        escape(getCurrentUrl()) + '">more</a>]';
    var style = getComputedStyle(elmContent, '');
    var iHeight = parseInt(style.height) + 15;
    elmFloater.height = iHeight;
    GM_setValue(getPrefixFromID(sID) + '.height', iHeight);
}

function getCurrentUrl() {
    var urlThis = location.href;
    var iHashPos = urlThis.indexOf('#');
    if (iHashPos != -1) {
        urlThis = urlThis.substring(0, iHashPos);
    }
    return urlThis;
}

function getDraggableFromEvent(event) {
    var elmDrag = event.target;
    if (!elmDrag) { return null; }
    while (elmDrag.nodeName != 'BODY' &&
        elmDrag.className != 'drag' &&
        elmDrag.className != 'nodrag') {
        elmDrag = elmDrag.parentNode;
    }
    if (elmDrag.className != 'drag') { return null; }
    return elmDrag;
}

document.addEventListener('mousedown', function(event) {
    var elmDrag = getDraggableFromEvent(event);
    if (!elmDrag) { return true; }
    var style = getComputedStyle(elmDrag, '');
    var iStartElmTop = parseInt(style.top);
    var iStartElmLeft = parseInt(style.left);
    var iStartCursorX = event.clientX;
    var iStartCursorY = event.clientY;
    elmDrag._mousemove = function(event) {
        elmDrag.style.top = (event.clientY + iStartElmTop - 
            iStartCursorY) + 'px';
        elmDrag.style.left = (event.clientX + iStartElmLeft - 
            iStartCursorX) + 'px';
        return false;
    };
    document.addEventListener('mousemove', elmDrag._mousemove, true);
    return false;
}, true);

document.addEventListener('mouseup', function(event) { 
    var elmDrag = getDraggableFromEvent(event);
    if (!elmDrag) { return true; }
    savePosition(elmDrag);
    document.removeEventListener('mousemove', elmDrag._mousemove, true);
}, true);

function getPrefixFromID(sID) {
    return 'floater.' + sID;
}

function savePosition(elmDrag) {
    var sID = elmDrag.id;
    var style = getComputedStyle(elmDrag, '');
    GM_setValue(getPrefixFromID(sID) + '.left', parseInt(style.left));
    GM_setValue(getPrefixFromID(sID) + '.top', parseInt(style.top));
}

function createFloater(sTitle, sID) {
    var elmFloater = document.createElement('div');
    elmFloater.id = sID;
    elmFloater.className = 'drag';
    var iLeft = GM_getValue(getPrefixFromID(sID) + '.left', 10);
    var iTop = GM_getValue(getPrefixFromID(sID) + '.top', 10);
    var iWidth = GM_getValue(getPrefixFromID(sID) + '.width', 150);
    _expanded = GM_getValue(getPrefixFromID(sID) + 
        '.expanded', false);
    var iHeight = _expanded ? GM_getValue(
        getPrefixFromID(sID) + '.height', 100) : 13;
    elmFloater.setAttribute('style', 'position: absolute; left: ' + 
        iLeft + 'px; top: ' + iTop + 'px; width: ' + iWidth + 
        'px; height: ' + iHeight + 'px; font: 9px Verdana, sans-serif; ' +
        'background-color: #faebd7; color: #333; opacity: 0.9; ' +
        'z-index: 99; border: 1px solid black');

    var elmHeader = document.createElement('h1');
    elmHeader.id = sID + '_header';
    elmHeader.setAttribute('style', 'position: relative; margin: 0; ' +
        'padding: 0; left: 0; top: 0; width: 100%; height: 13px; ' +
        'background-color: navy; color: #eee; text-align: center; ' +
        'opacity: 1.0; cursor: move; font: 9px Verdana, sans-serif;');
    if (sTitle) {
        elmHeader.appendChild(document.createTextNode(sTitle));
    }
    elmFloater.appendChild(elmHeader);

    var elmContent = document.createElement('div');
    elmContent.id = sID + '_content';
    elmContent.className = 'nodrag';
    elmContent.setAttribute('style', 'position: absolute; top: 14px; ' +
        'left: 0; width: 100%; overflow: hidden; background-color: ' +
        '#faebd7; color: #333; border: 0; margin: 0; padding: 0; ' +
        'font: 10px "Gill Sans", Verdana, sans-serif');
    elmContent.style.display = _expanded ? 'block' : 'none';
    elmContent.value = GM_getValue(getPrefixFromID(sID) + '.text', '');
    elmFloater.appendChild(elmContent);

    var elmExpand = document.createElement('a');
    elmExpand.id = sID + '_expand';
    elmExpand.className = 'nodrag';
    elmExpand.innerHTML = _expanded ? '&#9660;' : '&#9654;';
    elmExpand.setAttribute('style', 'display: block; position: ' +
        'absolute; top: 1px; left: 1px; width: 8px; height: 8px; ' +
        'font: 10px Verdana, sans-serif; border: 0; margin-top: ' + 
        (_expanded ? '0px' : '-2px') + '; padding: 0; ' +
        'background-color: transparent; color: white; ' +
        'text-decoration: none');
    elmExpand.title = 'Show/hide details';
    elmExpand.href = '#';
    elmExpand.addEventListener('click', function(event) {
        _expanded = !_expanded;
        GM_setValue(getPrefixFromID(sID) + '.expanded', 
            _expanded);
        elmFloater.style.height = (_expanded ? 
            GM_getValue(getPrefixFromID(sID) + '.height', 100) : 13) + 'px';
        elmExpand.innerHTML = _expanded ? '&#9660;' : '&#9654;';
        elmExpand.style.marginTop = _expanded ? '0px' : '-2px';
        elmContent.style.display = _expanded ? 'block' : 'none';
        if (_expanded) {
            getFeedsterLinks(sID);
        }
        event.preventDefault();
    }, true);
    elmHeader.appendChild(elmExpand);

    window.addEventListener('load', function() { 
        document.body.appendChild(elmFloater);
        if (_expanded) {
            getFeedsterLinks(sID);
        }
    }, true);
}

createFloater('OmniFeedster', 'omnifeedster');
