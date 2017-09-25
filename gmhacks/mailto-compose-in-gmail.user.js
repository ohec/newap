// ==UserScript==
// @name          Mailto Compose In GMail
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   Rewrites "mailto:" links to GMail compose links
// @include       *
// ==/UserScript==

// based on code by Julien Couvreur
// and included here with his gracious permission

function processMailtoLinks() {
    var xpath = "//a[starts-with(@href,'mailto:')]";
    var res = document.evaluate(xpath, document, null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
                                    
    var linkIndex, mailtoLink;
    for (linkIndex = 0; linkIndex < res.snapshotLength; linkIndex++) { 
        mailtoLink = res.snapshotItem(linkIndex);

        var href = mailtoLink.href;
        var matches = href.match(/^mailto:([^\?]*)(\?([^?]*))?/);
        var emailTo, params, emailCC, emailSubject, emailBody;

        emailTo = matches[1];  
        params = matches[3];
        if (params) {
            var splitQS = params.split('&');
            var paramIndex, param;
            
            for (paramIndex = 0; paramIndex < splitQS.length; paramIndex++) {
                param = splitQS[paramIndex];
                nameValue = param.match(/([^=]+)=(.*)/);
                if (nameValue && nameValue.length == 3) {                   
                    switch(nameValue[1]) {
                        case "to":
                            emailTo += "%2C%20" + nameValue[2];
                            break;
                        case "cc":
                            emailCC = nameValue[2];
                            break;
                        case "subject":
                            emailSubject = nameValue[2];
                            break;
                        case "body":
                            emailBody = nameValue[2];
                            break;
                    }
                }
            }
        }
                    
        var newUrl = "https://mail.google.com/mail?view=cm&tf=0" + 
            (emailTo ? ("&to=" + emailTo) : "") + 
            (emailCC ? ("&cc=" + emailCC) : "") +
            (emailSubject ? ("&su=" + emailSubject) : "") +
            (emailBody ? ("&body=" + emailBody) : "");

        mailtoLink.href = newUrl;
    }
}
    
window.addEventListener("load", processMailtoLinks, false);
