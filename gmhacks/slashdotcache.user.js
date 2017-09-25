// ==UserScript==
// @name        Slashdot Cache
// @namespace   http://www.cs.uni-magdeburg.de/~vlaube/Projekte/GreaseMonkey/
// @description Adds links to web caches on Slashdot
// @include     http://slashdot.tld/*
// @include     http://*.slashdot.tld/*
// ==/UserScript==

// based on code by Valentin Laube
// and included here with his gracious permission

var coralcacheicon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA'+
'oAAAAKCAYAAACNMs%2B9AAAAgUlEQVQY042O0QnCQBQEZy0sFiEkVVxa8GxAuLOLgD3cV'+
'RKwAytYf05JkGgGFt7H8nZkG10UgBNwZE0F7j77JiIJGPlNFhGzgwOQd%2FQytrEJdjtb'+
'rs%2FORAqRZBvZBrQxby2nv5iHniqokquUgM%2FH8Hadh57HNG05rlMgFXDL0vE%2FL%2'+
'BEXVN83HSenAAAAAElFTkSuQmCC';
var mirrordoticon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAo'+
'AAAAKCAYAAACNMs%2B9AAAAbklEQVQY05WQMRKEMAwDNzzqUobWv%2BBedvcK3EKZV4km'+
'BiYFE9RYI3mssZIkRjD1Qnbfsvv2uJjdF6AApfELkpDEZ12XmHcefpJEiyrAF%2Fi1G8H'+
'3ajZPjOJVdPfMGV3N%2FuGlvseopprNdz2NFn4AFndcO4mmiYkAAAAASUVORK5CYII%3D';
var googleicon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAA'+
'AKCAIAAAACUFjqAAAAiklEQVQY02MUjfmmFxPFgAuIxnz7jwNcU9BngSjae%2FbDxJUPj'+
'1z%2BxMDAYKPLlx8u72wswMDAwASRnrjyIQMDw%2BoW3XfbbfPD5SFchOGCHof2nHmPaT'+
'gTpmuEPA8LeR6GsKHSNrp8E1c%2B3Hv2A8QKG10%2BiDjUaRD7Qmsuw51GlMcYnXcE4Aq'+
'SyRn3Abz4culPbiCuAAAAAElFTkSuQmCC';
var backgroundimage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA'+
'DEAAAAOCAYAAACGsPRkAAAAHXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBUaGUgR0lNUO'+
'9kJW4AAAC7SURBVEjH7daxDYMwEEbhh11cAxKSKYEV0qeKMgETZBbPkgmYIEqVPisAJZa'+
'QTOPCUprQZYAY8Sb4P11zGcD9dT0BFuhIpx6wt%2FPjnX0BTxEpjako8uLv1%2FvV49xM'+
'CGEBLgqwIlI2dZsEAKDIC5q6RURKwCqgM6ZCa01Kaa0xpgLo1CZLsW23YgcdiANxIH4g%'+
'2FOqTHL%2FtVkDv3EyMMSlAjBHnZoBeATaEsIzTkMxF%2FOoZp2F7O2y2hwfwA3URQvMn'+
'dliTAAAAAElFTkSuQmCC';

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('' +
'a.coralcacheicon, a.mirrordoticon, a.googleicon { \n' +
'  padding-left: 15px; background: center no-repeat; \n' +
'} \n' +
'a.coralcacheicon { \n' +
'  background-image: url(' +coralcacheicon + '); \n' +
'} \n' +
'a.mirrordoticon { \n' +
'  background-image: url(' + mirrordoticon + '); \n' +
'} \n' +
'a.googleicon { \n' +
'  background-image: url(' + googleicon + '); \n' +
'} \n' +
'a.coralcacheicon:hover, a.mirrordoticon:hover, ' +
'a.googleicon:hover { \n' +
'  opacity: 0.5; \n' +
'} \n' +
'div.backgroundimage { \n' +
'  display:inline; \n' +
'  white-space: nowrap; \n' +
'  padding:3px; \n' +
'  background:url(' +  backgroundimage + ') center no-repeat; \n' +
'}');

var link, anchor, background;
for (var i=0; i<document.links.length; i++) {
    link = document.links[i];
    
    // filter relative links
    if(link.getAttribute('href').substring(0,7) != 'http://') {
	continue;
    }
    
    // filter all other links
    if(link.parentNode.nodeName.toLowerCase() != 'i' &&
       (link.parentNode.nodeName.toLowerCase() != 'font' ||
	link.parentNode.color != '#000000' || link.parentNode.size == '2') &&
       (!link.nextSibling || !link.nextSibling.nodeValue || 
	link.nextSibling.nodeValue.charAt(1) != '[')) {
	continue;
    }

    // add background
    background = document.createElement('div');
    background.className = 'backgroundimage';
    link.parentNode.insertBefore(background, link.nextSibling);
    
    //add mirrordot link
    anchor = document.createElement('a');
    anchor.href = 'http://www.mirrordot.com/find-mirror.html?' + link.href;
    anchor.title = 'MirrorDot - Solving the Slashdot Effect';
    anchor.className = 'mirrordoticon';
    background.appendChild(anchor);
    
    //add coral cache link
    anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.host += '.nyud.net:8090';
    anchor.title = 'Coral - The NYU Distribution Network';
    anchor.className = 'coralcacheicon';
    background.appendChild(anchor);
    
    //add google cache link
    anchor = document.createElement('a');
    anchor.href = 'http://www.google.com/search?q=cache:' + link.href;
    anchor.title = 'Google Cache';
    anchor.className = 'googleicon';
    background.appendChild(anchor);
    
    // add a space so it wraps nicely
    link.parentNode.insertBefore(document.createTextNode(' '),
        link.nextSibling);
}
