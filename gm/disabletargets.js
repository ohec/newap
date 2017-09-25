// ==UserScript==
// @name            Disable Targets For Downloads
// @namespace       http://www.rhyley.org/
// @description     Don't open a new window on links to binary files
// @include         http://*
// @include         https://*
// @version         0.1
// @require      https://github.com/IDMComputerSolutions/urlize.js/raw/master/urlize.js
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @require         https://greasyfork.org/scripts/29174-xpath/code/XPath.js?version=189853
// @author          Mikey Cawley
// @grant           none
// ==/UserScript==

// based on code by Jason Rhyley
// and included here with his gracious permission

// Add other file extensions here as needed
var oExp = new RegExp("(\.zip|\.rar|\.exe|\.tar|\.jar|\.xpi|\.gzip|" + "\.gz|\.ace|\.bin|\.ico|\.jpg|\.gif|\.pdf|\.3GP|\.7Z|\.AAC|\.ACE|\.AIF|\.ARJ|\.ASF|\.AVI|\.BIN|\.BZ2|\.EXE|\.GZ|\.GZIP|\.IMG|\.ISO|\.LZH|\.M4A|\.M4V|\.MKV|\.MOV|\.MP3|\.MP4|\.MPA|\.MPE|\.MPEG|\.MPG|\.MSI|\.MSU|\.OGG|\.OGV|\.PDF|\.PLJ|\.PPS|\.PPT|\.QT|\.R0*|\.R1*|\.RA|\.RAR|\.RM|\.RMVB|\.SEA|\.SIT|\.SITX|\.TAR|\.TIF|\.TIFF|\.WAV|\.WMA|\.WMV|\.Z|\.ZIP|\.MP4|\.JAR\n)$", "i");
var snapLinks = document.evaluate("//a[@onclick] | //a[@target]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < snapLinks.snapshotLength; i++) {
    var elmLink = snapLinks.snapshotItem(i);
    console.log(elmLink.href);
    if (elmLink.href && oExp.exec(elmLink.href)) {
        elmLink.target = "";
        elmLink.addEventListener("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
        }, true);
    }
}
/*
(function () {
    "use strict";

    // Your code here...
})();*/