// ==UserScript==
// @name           UPS/FedEx Tracking Linkify
// @namespace      http://scripts.slightlyinsane.com
// @description    Link package tracking numbers to appropriate site
// @include        *
// ==/UserScript==

// Based on code by Justin Novack and Logan Ingalls
// and included here with their gracious permission.
// Originally licensed under a Create Commons license.
// Visit http://creativecommons.org/licenses/by-sa/2.0/ for details.

var UPSRegex = new RegExp('\\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{'+
'2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\\dT]\\d\\d\\d ?\\d\\d\\d\\d '+
'?\\d\\d\\d)\\b', 'ig');
var FEXRegex = new RegExp('\\b(\\d\\d\\d\\d ?\\d\\d\\d\\d ?\\d\\d\\d\\'+
'd)\\b', 'ig');
var USARegex = new RegExp('\\b(\\d\\d\\d\\d ?\\d\\d\\d\\d ?\\d\\d\\d\\'+
'd ?\\d\\d\\d\\d ?\\d\\d\\d\\d ?\\d\\d|\\d\\d\\d\\d ?\\d\\d\\d\\d ?\\d'+
'\\d\\d\\d ?\\d\\d\\d\\d ?\\d\\d\\d\\d)\\b', 'ig');

function UPSUrl(t) {
    return 'http://wwwapps.ups.com/WebTracking/processInputRequest?sor'+
        't_by=status&tracknums_displayed=1&TypeOfInquiryNumber=T&loc=e'+
        'n_US&InquiryNumber1=' + String(t).replace(/ /g, '') + 
        '&track.x=0&track.y=0';
}

function FEXUrl(t) {
    return 'http://www.fedex.com/cgi-bin/tracking?action=track&languag'+
        'e=english&cntry_code=us&initial=x&tracknumbers=' + 
        String(t).replace(/ /g, '');
}

function USAUrl(t) {
    return 'http://trkcnfrm1.smi.usps.com/netdata-cgi/db2www/cbd_243.d'+
        '2w/output?CAMEFROM=OK&strOrigTrackNum=' + 
        String(t).replace(/ /g, '');
}

// tags we will scan looking for un-hyperlinked urls
var allowedParents = [
    'abbr', 'acronym', 'address', 'applet', 'b', 'bdo', 'big', 
    'blockquote', 'body', 'caption', 'center', 'cite', 'code', 
    'dd', 'del', 'div', 'dfn', 'dt', 'em', 'fieldset', 'font', 
    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'iframe',
    'ins', 'kdb', 'li', 'object', 'pre', 'p', 'q', 'samp', 
    'small', 'span', 'strike', 's', 'strong', 'sub', 'sup', 
    'td', 'th', 'tt', 'u', 'var'];
    
var xpath = '//text()[(parent::' + allowedParents.join(' or parent::') +
    ')]';

var candidates = document.evaluate(xpath, document, null, 
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

//var t0 = new Date().getTime();
for (var cand = null, i = 0; (cand = candidates.snapshotItem(i)); i++) {
    // UPS Track
    if (UPSRegex.test(cand.nodeValue)) {
	var span = document.createElement('span');
	var source = cand.nodeValue;
	cand.parentNode.replaceChild(span, cand);
	
	UPSRegex.lastIndex = 0;
	for (var match = null, lastLastIndex = 0; 
	     (match = UPSRegex.exec(source)); ) {
	    span.appendChild(document.createTextNode(
                source.substring(lastLastIndex, match.index)));
	    
	    var a = document.createElement('a');
	    a.setAttribute('href', UPSUrl(match[0]));
	    a.setAttribute('title', 'Linkified to UPS');
	    a.appendChild(document.createTextNode(match[0]));
	    span.appendChild(a);
	    
	    lastLastIndex = UPSRegex.lastIndex;
	}

	span.appendChild(document.createTextNode(
            source.substring(lastLastIndex)));
	span.normalize();
    } else if (USARegex.test(cand.nodeValue)) {
	// USPS Track
	var span = document.createElement('span');
	var source = cand.nodeValue;
	
	cand.parentNode.replaceChild(span, cand);
	
	USARegex.lastIndex = 0;
	for (var match = null, lastLastIndex = 0;
	     (match = USARegex.exec(source)); ) {
	    span.appendChild(document.createTextNode(
                source.substring(lastLastIndex, match.index)));
	    
	    var a = document.createElement('a');
	    a.setAttribute('href', USAUrl(match[0]));
	    a.setAttribute('title', 'Linkified to USPS');
	    a.appendChild(document.createTextNode(match[0]));
	    span.appendChild(a);
	    
	    lastLastIndex = USARegex.lastIndex;
	}
	
	span.appendChild(document.createTextNode(
            source.substring(lastLastIndex)));
	span.normalize();
    } else if (FEXRegex.test(cand.nodeValue)) {
	// FedEx Track
	var span = document.createElement('span');
	var source = cand.nodeValue;
	
	cand.parentNode.replaceChild(span, cand);
	
	FEXRegex.lastIndex = 0;
	for (var match = null, lastLastIndex = 0; 
	     (match = FEXRegex.exec(source)); ) {
	    span.appendChild(document.createTextNode(
                source.substring(lastLastIndex, match.index)));
	    
	    var a = document.createElement('a');
	    a.setAttribute('href', FEXUrl(match[0]));
	    a.setAttribute('title', 'Linkified to FedEx');
	    a.appendChild(document.createTextNode(match[0]));
	    span.appendChild(a);
	    
	    lastLastIndex = FEXRegex.lastIndex;
	}
	
	span.appendChild(document.createTextNode(
            source.substring(lastLastIndex)));
	span.normalize();
    }
}
