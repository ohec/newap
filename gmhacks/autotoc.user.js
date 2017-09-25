// ==UserScript==
// @name         AutoTOC
// @namespace    http://runeskaug.com/greasemonkey
// @description  Creates a table of contents for all headers on the page
// @include      *
// ==/UserScript==

// based on code by Rune Skaug
// and included here with his gracious permission

//set the optional behaviour of the TOC box
// - true resets it to its initial state after you have selected a header
// - false does not reset it
var resetSelect = false;

//if true, shows a "Hide TOC" button on the right side of the bar
var showHide = true;
var hideText = "Hide TOC";

function f() {
    // only on (X)HTML pages containing at least one heading -
    // excludes XML files, text files, plugins and images
    if ( document.getElementsByTagName("html").length && 
	 (document.getElementsByTagName('h1').length ||
	  document.getElementsByTagName('h2').length ||
	  document.getElementsByTagName('h3').length ||
	  document.getElementsByTagName('h4').length )) {
	var aHs = getHTMLHeadings();
	if (aHs.length>2) { // HTML document, more than two headings.
	    addCSS(
                '#js-toc {position: fixed; left: 0; right: 0; top: auto; ' +
		'bottom: 0; height: 20px; width: 100%; vertical-align: ' +
		'middle; display: block; border-top: 1px solid #777; ' +
		'background: #ddd; margin: 0; padding: 3px; ' +
		'z-index: 9999; }\n#js-toc select { font: 8pt verdana, ' +
		'sans-serif; margin: 0; margin-left:5px; ' +
		'background-color: #fff; color: #000; float: ' +
		'left; padding: 0; vertical-align: middle;}\n' +
		'#js-toc option { font: 8pt verdana, sans-serif; ' +
		'color: #000; }\n#js-toc .hideBtn { font: 8pt verdana, ' +
		'sans-serif; float: right;' +
		'margin-left: 5px; margin-right: 10px; padding: 2px 2px; ' +
		'border: 1px dotted #333; background-color: #e7e7e7; }\n' +
		'#js-toc .hideBtn a { color: #333; text-decoration: none; '+
		'background-color: transparent;} ' +
                '#js-toc .hideBtn a:hover { ' +
		'color: #333; text-decoration: none; background-color: ' +
		'transparent;}'
            );
	    // Browser snuff++ - due to rendering bug(s) in Firefox
	    var toc = document.createElement(
                window.opera||showHide?'tocuserjselem':'div');
	    toc.id = 'js-toc';
	    tocSelect = document.createElement('select');
	    tocSelect.addEventListener("change", function() {
		if (this.value) {
		    if (resetSelect) {
			this.selectedIndex = 0;
		    }
		    window.location.href = '#' + this.value;
		}
	    }, true);
	    tocSelect.id = 'navbar-toc-select';
	    tocEmptyOption = document.createElement('option');
	    tocEmptyOption.setAttribute('value','');
	    tocEmptyOption.appendChild(
                document.createTextNode('Table of Contents'));
	    tocSelect.appendChild(tocEmptyOption);
	    toc.appendChild(tocSelect);
	    if (showHide) {
		var hideDiv = document.createElement('div');
		hideDiv.setAttribute('class','hideBtn');
		var hideLink = document.createElement('a');
		hideLink.setAttribute("href","#");
		hideLink.addEventListener('click', function(event) {
		    document.getElementById('js-toc').style.display = 'none';
		    event.preventDefault();
		}, true);
		hideLink.appendChild(document.createTextNode(hideText));
		hideDiv.appendChild(hideLink);
		toc.appendChild(hideDiv);
	    }
	    document.body.style.paddingBottom = "27px";
	    document.body.appendChild(toc);  
	    for (var i=0,aH;aH=aHs[i];i++) {
		if (aH.offsetWidth) {
		    op  = document.createElement("option");
		    op.appendChild(document.createTextNode(gs(aH.tagName)+
                        getInnerText(aH).substring(0,100)));
		    var refID = aH.id ? aH.id : aH.tagName+'-'+(i*1+1);
		    op.setAttribute("value", refID);
		    document.getElementById("navbar-toc-select").appendChild(
                        op);
		    aH.id = refID;
		}
	    }
	}
    }
    if (!window.opera) { 
        GM_registerMenuCommand('AutoTOC: Toggle display', 
            autoTOC_toggleDisplay);
    }
};

function autoTOC_toggleDisplay() {
    if (document.getElementById('js-toc').style.display == 'none') {
	document.getElementById('js-toc').style.display = 'block';
    }
    else {
	document.getElementById('js-toc').style.display = 'none';
    }
}

function getHTMLHeadings() {
    function acceptNode(node) {
	if (node.tagName.match(/^h[1-4]$/i)) {
	    return NodeFilter.FILTER_ACCEPT;
	}
	return NodeFilter.FILTER_SKIP;
    }
    outArray = new Array();
    if (document.createTreeWalker) {
	var treeWalker = document.createTreeWalker(document.documentElement,
            NodeFilter.SHOW_ELEMENT, acceptNode, true);
	if (treeWalker) {
	    var node = treeWalker.nextNode();
	    while (node) {
		outArray.push(node);
		node = treeWalker.nextNode();
	    }
	}
    }
    else {   
	var els = document.getElementsByTagName("*");
	var j = 0;
	for (var i=0,el;el=els[i];i++) {
	    if (el.tagName.match(/^h[1-4]$/i)) {
		outArray[j++] = el;
	    }
	}
    }
    return outArray;
}
function addCSS(css) {
    var head, styleLink;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    styleLink = document.createElement('link');
    styleLink.setAttribute('rel','stylesheet');
    styleLink.setAttribute('type','text/css');
    styleLink.setAttribute('href','data:text/css,'+escape(css));
    head.appendChild(styleLink);
}
function gs(s){
    s = s.toLowerCase();
    if (s=="h2") return "\u00a0 \u00a0 "
    else if (s=="h3") return "\u00a0 \u00a0 \u00a0 \u00a0 "
    else if (s=="h4") return "\u00a0 \u00a0 \u00a0 \u00a0 \u00a0 \u00a0 ";
    return "";
}
function getInnerText(el) {
    var s='';
    for (var i=0,node; node=el.childNodes[i]; i++) {
	if (node.nodeType == 1) s += getInnerText(node);
	else if (node.nodeType == 3) s += node.nodeValue;
    }
    return s;
}

f();
