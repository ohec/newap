// ==UserScript==
// @name          Nice Titles
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   render link titles with translucent floating window
// @include       *
// ==/UserScript==

// based on code by Stuart Langridge
// and included here with his gracious permission
// http://www.kryogenix.org/code/browser/nicetitle/

var CURRENT_NICE_TITLE;

function makeNiceTitles() {
    var snapTitles = document.evaluate("//*[@title]",
        document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i=0; i<snapTitles.snapshotLength; i++) {
        var elm = snapTitles.snapshotItem(i);
        elm.setAttribute("nicetitle",elm.title);
        elm.removeAttribute("title");
        elm.addEventListener("mouseover",showNiceTitle,true);
        elm.addEventListener("mouseout",hideNiceTitle,true);
        elm.addEventListener("focus",showNiceTitle,true);
        elm.addEventListener("blur",hideNiceTitle,true);
    }
}

function findPosition( oLink ) {
    if (oLink.offsetParent) {
        for (var posX = 0, posY = 0; oLink.offsetParent; 
             oLink = oLink.offsetParent) {
            posX += oLink.offsetLeft;
            posY += oLink.offsetTop;
        }
        return [ posX, posY ];
    } else {
        return [ oLink.x, oLink.y ];
  }
}

function showNiceTitle(event) {
    if (CURRENT_NICE_TITLE) {
        hideNiceTitle(CURRENT_NICE_TITLE);
    }
    var elmTarget;
    if (event && event.target) {
        elmTarget = event.target;
    }
    if (!elmTarget) { return; }
    if (elmTarget.nodeType == 3 /* text node */) {
        elmTarget = getParentElement(elmTarget);
    }
    if (!elmTarget) { return; }
    attrNiceTitle = elmTarget.getAttribute("nicetitle");
    if (!attrNiceTitle) { return; }
    
    var elmWrapper = document.createElement("div");
    elmWrapper.className = "nicetitle";
    tnt = document.createTextNode(attrNiceTitle);
    pat = document.createElement("p");
    pat.className = "titletext";
    pat.appendChild(tnt);
    elmWrapper.appendChild(pat);
    if (elmTarget.href) {
        tnd = document.createTextNode(elmTarget.href);
        pad = document.createElement("p");
        pad.className = "destination";
        pad.appendChild(tnd);
        elmWrapper.appendChild(pad);
    }
    var h_pixels, t_pixels, w, h, mpos, mx, my;
    STD_WIDTH = 300;
    if (elmTarget.href) {
        h = elmTarget.href.length;
    } else { h = attrNiceTitle.length; }
    if (attrNiceTitle.length) {
        t = attrNiceTitle.length;
    }
    h_pixels = h*6; t_pixels = t*10;
    if (h_pixels > STD_WIDTH) {
        w = h_pixels;
    } else if ((STD_WIDTH>t_pixels) && (t_pixels>h_pixels)) {
        w = t_pixels;
    } else if ((STD_WIDTH>t_pixels) && (h_pixels>t_pixels)) {
        w = h_pixels;
    } else {
        w = STD_WIDTH;
    }
    elmWrapper.style.width = w + 'px';
    mpos = findPosition(elmTarget);
    mx = mpos[0];
    my = mpos[1];
    elmWrapper.style.left = (mx+15) + 'px';
    elmWrapper.style.top = (my+35) + 'px';
    if (window.innerWidth && ((mx+w) > window.innerWidth)) {
        elmWrapper.style.left = (window.innerWidth - w - 25) + "px";
    }
    if (document.body.scrollWidth && ((mx+w)>document.body.scrollWidth)) {
        elmWrapper.style.left = (document.body.scrollWidth - w - 25)+"px";
    }
    document.body.appendChild(elmWrapper);
    CURRENT_NICE_TITLE = elmWrapper;
}

function hideNiceTitle(e) {
    if (CURRENT_NICE_TITLE) {
        document.body.removeChild(CURRENT_NICE_TITLE);
        CURRENT_NICE_TITLE = null;
    }
}

function getParentElement(node) {
    while (node && (node.nodeType != 1)) {
        node = node.parentNode;
    }
    return node;
}

function getMousePosition(event) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
    return [x,y];
}

function addGlobalStyle(css) {
    var elmHead, elmStyle;
    elmHead = document.getElementsByTagName('head')[0];
    if (!elmHead) { return; }
    elmStyle = document.createElement('style');
    elmStyle.type = 'text/css';
    elmStyle.innerHTML = css;
    elmHead.appendChild(elmStyle);
}

addGlobalStyle(
'div.nicetitle {' +
'    position: absolute;' +
'    padding: 4px;' +
'    top: 0px;' +
'    left: 0px;' +
'    background-color: black;' +
'    color: white;' +
'    font-size: 13px;' +
'    font-family: Verdana, Helvetica, Arial, sans-serif;' +
'    width: 25em;' +
'    font-weight: bold;' +
'    -moz-border-radius: 12px !important;' +
'    -moz-opacity: 0.75;' +
'}' + 
'div.nicetitle p {' +
'    margin: 0; padding: 0 3px;' +
'}' +
'div.nicetitle p.destination {' +
'    font-size: 9px;' +
'    text-align: left;' +
'    padding-top: 3px;' +
'}');

window.addEventListener("load", makeNiceTitles, true);
