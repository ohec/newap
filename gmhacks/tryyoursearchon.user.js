// ==UserScript==
// @name            Try Your Search On
// @namespace       http://www.oreilly.com/catalog/greasemonkeyhks/
// @description     Link to competitors from Google search results
// @include         http://www.google.*/search*
// ==/UserScript==

// based on Butler
// http://diveintomark.org/projects/butler/
        
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

addOtherWebSearches();
