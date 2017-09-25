// ==UserScript==
// @name          XmlHttpRequest Tracing
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   Trace XmlHttpRequest calls into the Javascript Console
// @include       http://pick.some.domain
// ==/UserScript==

// based on code by Julien Couvreur
// and included here with his gracious permission

XMLHttpRequest.prototype.uniqueID = function() {
    if (!this.uniqueIDMemo) {
        this.uniqueIDMemo = Math.floor(Math.random() * 1000);
    }
    return this.uniqueIDMemo;
}

XMLHttpRequest.prototype.oldOpen = XMLHttpRequest.prototype.open;

var newOpen = function(method, url, async, user, password) {
    GM_log("[" + this.uniqueID() + "] intercepted open (" + 
                method + " , " + 
                url + " , " + 
                async + " , " + 
                user + " , " + 
                password + ")");
    this.oldOpen(method, url, async, user, password);
}

XMLHttpRequest.prototype.open = newOpen;

XMLHttpRequest.prototype.oldSend = XMLHttpRequest.prototype.send;

var newSend = function(a) {
    var xhr = this;
    GM_log("[" + xhr.uniqueID() + "] intercepted send (" + a + ")");
    var onload = function() { 
        GM_log("[" + xhr.uniqueID() + "] intercepted load: " + 
                xhr.status + 
                " " + xhr.responseText); 
    };
        
    var onerror = function() { 
        GM_log("[" + xhr.uniqueID() + "] intercepted error: " + 
                xhr.status); 
    };
        
    xhr.addEventListener("load", onload, false);
    xhr.addEventListener("error", onerror, false);

    xhr.oldSend(a);
}

XMLHttpRequest.prototype.send = newSend;
