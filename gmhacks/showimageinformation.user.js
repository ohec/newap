// ==UserScript==
// @name          Show Image Information
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   display information on all images on a page
// @include       http://*
// ==/UserScript==

var elmWrapper = document.createElement('div');
elmWrapper.innerHTML = '<div style="position: fixed; bottom: 0; ' +
    'left: 0; padding: 1px 4px 3px 4px; background-color: #ddd; ' +
    'color: #000; border-top: 1px solid #bbb; border-left: 1px ' +
    'solid #bbb; font-family: sans-serif; font-size: x-small;">' +
    '<a href="#" title="Display report of all images on this page" ' +
    'id="displayinfo" style="background-color: transparent; ' +
    'color: black; font-size: x-small; font-family: sans-serif; ' + 
    'text-decoration: none;">Image report</a></div>';
document.body.append(elmWrapper);
document.getElementById('displayinfo').addEventListener(
    'click', function(event) {
    var html = '<html><head><title>' + document.title +
        '</title></head><body>';
    var oImages = new Object();
    for (var i = 0; i < document.images.length; i++) {
        var elmImage = document.images[i];
        var urlSrc = elmImage.src || '';
        if (!urlSrc) { continue; }
        if (oImages[urlSrc]) { continue; }
        oImages[urlSrc] = 1;
        var style = getComputedStyle(elmImage, '');
        var iWidth = parseInt(style.width);
        var iHeight = parseInt(style.height);
        var sTitle = elmImage.title || '';
        var sAlt = elmImage.alt || '';
        var urlLongdesc = elmImage.longdesc || '';
        html += '<p><img width="' + iWidth + '" height="' + iHeight +
            '" src="' + urlSrc + '"></p><table border="1" ' +
            'cellpadding="3" cellspacing="0"><tr><th>src</th><td>' +
            '<a href="' + urlSrc + '">' + urlSrc + '</a></td></tr>' +
            '<tr><th>width</th><td>' + iWidth + '</td></tr>' +
            '<tr><th>height</th><td>' + iHeight + '</td></tr>';
        if (sTitle) {
            html += '<tr><th>title</th><td>' + sTitle + '</td></tr>';
        }
        if (sAlt) {
            html += '<tr><th>alt</th><td>' + sAlt + '</td></tr>';
        }
        if (urlLongdesc) {
            html += '<tr><th>longdesc</th><td><a href="' + urlLongdesc + 
                '">' + urlLongdesc + '</a></td></tr>';
        }
        html += '</table><br><hr>';
    }
    html += '</body></html>';
    GM_openInTab('data:text/html,' + html);
    event.preventDefault();
}, true);
