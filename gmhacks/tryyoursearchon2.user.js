// ==UserScript==
// @name            Try Your Search On
// @namespace       http://www.oreilly.com/catalog/greasemonkeyhks/
// @description     Link to competitors from Google web and image search
// @include         http://www.google.tld/search*
// @include         http://images.google.tld/images*
// ==/UserScript==
        
function getOtherWebSearches(q) {
    q = escape(q);
    return '' +
'<a href="http://search.yahoo.com/search?p=' + q + '">Yahoo</a>, ' +
'<a href="http://web.ask.com/web?q=' + q + '">Ask Jeeves</a>, ' +
'<a href="http://alltheweb.com/search?q=' + q + '">AlltheWeb</a>, ' +
'<a href="http://s.teoma.com/search?q=' + q + '">Teoma</a>, ' +
'<a href="http://search.msn.com/results.aspx?q=' + q + '">MSN</a>, ' +
'<a href="http://search.lycos.com/default.asp?query=' + q + '">Lycos</a>, ' +
'<a href="http://technorati.com/cosmos/search.html?url=' + q + 
'">Technorati</a>, ' +
'<a href="http://feedster.com/search.php?q=' + q + '">Feedster</a>, ' +
'<a href="http://www.daypop.com/search?q=' + q + '">Daypop</a>, ' +
'<a href="http://bloglines.com/search?t=1&amp;q=' + q + '>Bloglines</a>';
}

function addOtherWebSearches() {
    var elmHeader = document.evaluate("//table[@bgcolor='#e5ecf9']",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,
        null).singleNodeValue;
    if (!elmHeader) return;
    var q = document.forms.namedItem('gs').elements.namedItem('q').value;
    var elmOther = document.createElement('div');
    var html = '<p style="font-size: small">Try your search on ';
    html += getOtherWebSearches(q);
    html += '</p>';
    elmOther.innerHTML = html;
    elmHeader.parentNode.insertBefore(elmOther, elmHeader.nextSibling);
}

function getOtherImageSearches(q) {
    q = escape(q);
    return '' +
'<a href="http://images.search.yahoo.com/search/images?p=' + q + 
'">Yahoo</a>, ' +
'<a href="http://pictures.ask.com/pictures?q=' + q + '">Ask Jeeves</a>, ' +
'<a href="http://www.alltheweb.com/search?cat=img&q=' + q + 
'">AlltheWeb</a>, ' +
'<a href="http://search.msn.com/images/results.aspx?q=' + q + '">MSN</a>, ' +
'<a href="http://www.picsearch.com/search.cgi?q=' + q + '">PicSearch</a>, ' +
'<a href="http://www.ditto.com/searchResults.asp?ss=' + q + '">Ditto</a>, ' +
'<a href="http://www.creatas.com/searchResults.aspx?' + 'searchString=' + q + 
'">Creatas</a>, ' +
'<a href="http://www.freefoto.com/search.jsp?queryString=' + q +
'">FreeFoto</a>, ' +
'<a href="http://www.webshots.com/search?query=' + q + '">WebShots</a>, ' +
'<a href="http://nix.larc.nasa.gov/search?qa=' + q + '">NASA</a>, ' +
'<a href="http://www.flickr.com/photos/search/text:' + q + '">Flickr</a>';
    return s;
}

function addOtherImageSearches() {
    var elmTable = document.evaluate(
        "//a[starts-with(@href, '/images?q=')]/ancestor::table" +
        "[@width='100%'][@border='0'][@cellpadding='0'][@cellspacing='0']",
        document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, 
        null).singleNodeValue;
    if (!elmTable) { return; }
    var elmTR = document.createElement('tr');
    var q = document.forms.namedItem('gs').elements.namedItem('q').value;
    var html = '<td align="left"><span style="font-size: small">' +
        'Try your search on ';
    html += getOtherImageSearches(q);
    html += '</span></td>';
    elmTR.innerHTML = html;
    elmTable.appendChild(elmTR);
}

if (/^http:\/\/www\.google\.[\w\.]+\/search/i.test(location.href)) {
    addOtherWebSearches();
}
else if (/^http:\/\/images\.google\.[\w\.]+\/images/i.test(location.href)) {
    addOtherImageSearches();
}
