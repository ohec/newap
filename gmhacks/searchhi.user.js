// ==UserScript==
// @name          Search Highlight
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   highlight search terms when coming a search engine
// @include       *
// @exclude       http://www.google.com/search*
// ==/UserScript==

// based on code by Stuart Langridge
// and included here with his gracious permission
// http://www.kryogenix.org/code/browser/searchhi/

function highlightWord(node, word) {
    if (node.hasChildNodes) {
	for (var hi_cn = 0; hi_cn<node.childNodes.length; hi_cn++) {
	    highlightWord(node.childNodes[hi_cn], word);
	}
    }
	
    if (node.nodeType == 3) { // text node
	tempNodeVal = node.nodeValue.toLowerCase();
	tempWordVal = word.toLowerCase();
	if (tempNodeVal.indexOf(tempWordVal) != -1) {
	    pn = node.parentNode;
	    if (pn.className != "searchword") {
		nv = node.nodeValue;
		ni = tempNodeVal.indexOf(tempWordVal);
		before = document.createTextNode(nv.substr(0,ni));
		docWordVal = nv.substr(ni, word.length);
		after = document.createTextNode(nv.substr(ni+word.length));
		hiwordtext = document.createTextNode(docWordVal);
		hiword = document.createElement("span");
		hiword.className = "searchword";
		hiword.style.backgroundColor = 'yellow';
		hiword.style.color = 'black';
		hiword.appendChild(hiwordtext);
		pn.insertBefore(before, node);
		pn.insertBefore(hiword, node);
		pn.insertBefore(after, node);
		pn.removeChild(node);
	    }
	}
    }
}

function highlightSearchKeywords() {
    var ref = document.referrer;
    if (ref.indexOf('?') == -1) { return; }
    var qs = ref.substr(ref.indexOf('?')+1);
    var qsa = qs.split('&');
    for (var i = 0; i < qsa.length; i++) {
	var qsip = qsa[i].split('=');
	if (qsip.length == 1) { continue; }
	if (qsip[0] == 'q') {
	    var words = unescape(qsip[1].replace(/\+/g,' ')).split(/\s+/);
	    for (var w = 0; w < words.length; w++) {
		highlightWord(document.body, words[w]);
	    }
	}
    }
}

window.addEventListener('load', highlightSearchKeywords, true);
