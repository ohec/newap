// ==UserScript==
// @name          Zoom The Web
// @description   Apply a "zoom layout" to web pages
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @include       http://*
// ==/UserScript==

var gBackgroundColor = GM_getValue('background-color', 'navy');
var gColor = GM_getValue('color', 'white');
var gLinkBackgroundColor = GM_getValue('link-background-color', 'navy');
var gLinkColor = GM_getValue('link-color', 'yellow');

function isolate(doc, node) {
    // sanity check
    if (!doc.body) { return; }
    if (!doc) { return; }
    if (!node) { return; }
    if (!node.parentNode) { return; }
    if (node == doc.body) { return; }
    //  Remove node from its parent.
    node.parentNode.removeChild(node);
    //  Now remove everything else in the body.
    doc.body.innerHTML = '';
    //  Wrap the original node in a DIV
    var replacement_div = doc.createElement ('DIV');
    replacement_div.setAttribute('style', '' +
'margin: 0 2% !important; ' +
'text-align: left !important; ');
    replacement_div.appendChild(node);
    doc.body.appendChild(replacement_div);
};

function relax(doc, node) {
    walk_down(node, function (node) {
        if (node.width) {
            node.width = null;
        }
        node.setAttribute('style', (node.getAttribute('style') || '') +
'width: auto !important; ' +
'max-width: 100% !important; ' +
'margin-left: 0 !important; ' +
'margin-right: 0 !important; ' +
'overflow: visible !important; ');
    });
    node.setAttribute('style', (node.getAttribute('style') || '') +
'width: auto !important; ' +
'max-width: 100% !important; ' +
'overflow: visible !important; ');
}

function make_navy(doc, node) {
    walk_down(node, function (node) {
        var sName = node.tagName.toUpperCase();
        if (sName == 'A') {
            node.bgcolor = gLinkBackgroundColor;
            node.color = gLinkColor;
            node.setAttribute('style', (node.getAttribute('style') || '') +
'background: ' + gLinkBackgroundColor + ' !important; ' +
'color: ' + gLinkColor + ' !important; ' +
'text-decoration: underline !important; ' +
'border: 0 !important; ' +
'font-weight: bold !important; ');
        } else if (/^H[1-6]$/.test(sName)) {
            node.bgcolor = gBackgroundColor;
            node.color = gColor;
            node.setAttribute('style', (node.getAttribute('style') || '') +
'background: ' + gBackgroundColor + ' !important; ' +
'color: ' + gColor + ' !important; ' +
'border: 0 !important; ' +
'font-weight: bold !important; '+
'font-size: inherit !important; ');
        } else {
            node.bgcolor = gBackgroundColor;
            node.color = gColor;
            node.setAttribute('style', (node.getAttribute('style') || '') +
'background: ' + gBackgroundColor + ' !important; ' +
'color: ' + gColor + ' !important; ' +
'border: 0 !important; ' +
'font-weight: normal !important; ');
        }
    });
}

function zoom_fonts(doc, node) {
    walk_up(node, function(node) {
        var style = getComputedStyle(node, '');
        var flFontSize = 1.5 * parseInt(style.fontSize);
        node.setAttribute('style', (node.getAttribute('style') || '') +
'font-family: Optima, Verdana, sans-serif !important; ' +
'font-size: ' + flFontSize + 'px !important; ' +
'float: none !important; ' +
'width: auto !important; ' +
'height: auto !important; ' +
'line-height: ' + (1.8 * flFontSize) + 'px !important; ');
    });
}

function fix_page(doc, node) {
    doc.background = '';
    doc.bgColor = gBackgroundColor;
    if (doc.style) {
        doc.setAttribute('style', (doc.getAttribute('style') || '') +
'background: ' + gBackgroundColor + ' !important; ' +
'color: ' + gColor + ' !important; ');
    }
    if (!doc.body) { return; }
    doc.body.background = '';
    doc.body.bgColor = gBackgroundColor;
    if (doc.body.style) {
        doc.body.setAttribute('style', (doc.body.getAttribute('style') || '') +
'background: ' + gBackgroundColor + ' !important; ' +
'color: ' + gColor + ' !important; ');
    }
};

function walk_down(node, func) {
    if (node.nodeType == 1) {
        if (node.tagName != 'IMG') {
            func(node);
        }
        if (node.childNodes.length != 0) {
            for (var i=0; i<node.childNodes.length; i++) {
                walk_down(node.childNodes.item(i),func);
            }
        }
    }
}

function walk_up(node, func) {
    if (node.nodeType == 1) {
        if (node.childNodes.length != 0) {
            for (var i=0; i<node.childNodes.length; i++) {
                walk_up(node.childNodes.item(i),func);
            }
        }
        if (node.tagName != 'IMG') func(node);
    }
}

function find_biggest_elem(doc) {
    const big_element_limit = 0.25;
    var size_of_doc = 0;
    if (doc.documentElement) {
        var size_of_doc = doc.documentElement.offsetHeight *
            doc.documentElement.offsetWidth;
    }
    var body = doc.body;
    if (!body) { return; }
    var size_of_body = body.offsetHeight * body.offsetWidth;
    if (size_of_body < (0.80 * size_of_doc)) {
        size_of_body = size_of_doc;
    };
    if (size_of_body < 1) { return; }
    var max_size = 0;
    var max_elem = doc;
    var allElems = document.evaluate("//*",
                                     doc.body, null,
                                     XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                                     null);
    for (var i = 0; i < allElems.snapshotLength; i++) {
        var thisElem = allElems.snapshotItem(i);
        var thisElem_size = thisElem.offsetHeight * thisElem.offsetWidth;
        
        if (thisElem_size < size_of_body &&
            thisElem_size > max_size &&
            !contains_big_element(thisElem, size_of_body*big_element_limit)) {
            max_size = thisElem_size;
            max_elem = thisElem;
        };
    };
    //    GM_log('size_of_body = ' + size_of_body + '\n' +
    //           'max_size = ' + max_size + '\n' +
    //           'ratio = ' + (max_size/size_of_body));
  return max_elem;
};

function contains_big_element(node, limit) {
    if (node.childNodes.length != 0)
        for (var i=0; i<node.childNodes.length; i++) {
            var child = node.childNodes.item(i);
            if (!child.offsetHeight || child.offsetWidth) { continue; }
            var child_size = child.offsetHeight * child.offsetWidth;
            if (child_size > limit) return true;
        };
    return false;
};

function auto_zoom() {
    var doc = unsafeWindow.document;
    // don't do anything on pages with one element (such as text pages)
    if (doc.childNodes.length == 1) { return; }
    // don't do anything on frames
    if (doc.location.href != window.top.location.href) { return; }
    var biggest_elem = find_biggest_elem(doc);
    if (!biggest_elem) { 
        //GM_log('URL=' + doc.location.href + 
        //       '\ncould not find biggest element');
        return;
    }
    //GM_log('URL=' + doc.location.href + '\nbiggest_elem = ' +
    //    biggest_elem.nodeName + (biggest_elem.id ||
    //    biggest_elem.name || biggest_elem.className || ''));
    isolate(doc, biggest_elem);
    relax(doc, biggest_elem);
    make_navy(doc, biggest_elem);
    fix_page(doc, biggest_elem);
    zoom_fonts(doc, biggest_elem);
};

function save_prefs() {
    GM_setValue('background-color', gBackgroundColor);
    GM_setValue('color', gColor);
    GM_setValue('link-background-color', gLinkBackgroundColor);
    GM_setValue('link-color', gLinkColor);
}

auto_zoom();
