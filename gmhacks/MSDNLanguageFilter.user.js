// ==UserScript==
// @name          MSDN Language Filter
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   Allows you to filter the samples on MSDN for certain languages
// @include       http://msdn.microsoft.com/*
// ==/UserScript==

var ShowCPP = false;
var ShowVB = false;
var ShowJScript = false;
var ShowCS = true;

var MSDNLanguageFilter = {
    FilterLanguages: function() 
    {
        var xpath = "//span[@class = 'lang']";
        var res = document.evaluate(xpath, document, null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (var i = 0; i < res.snapshotLength; i++) 
        {
            var spanHTML = res.snapshotItem(i).innerHTML;
            
            var isVB = (spanHTML.match(/Visual.*Basic/i) != null);
            var isCS = (spanHTML.match(/C#/i) != null);
            var isCPP = (spanHTML.match(/C\+\+/i) != null);
            var isJScript = (spanHTML.match(/JScript/i) != null);
            
            if  (!isVB && !isCS && !isCPP && !isJScript)
            {
                return;
            }

            var keepLang = 
                (isCPP && ShowCPP) || 
                (isCS && ShowCS) || 
                (isVB && ShowVB) ||
                (isJScript && ShowJScript) ||
                (!isCPP && !isCS && !isVB && !isJScript);
            
            if (!keepLang) 
            {
                this.CleanSpan(res.snapshotItem(i), res.snapshotItem(i+1));
            }
        }
    },

    CleanSpan: function(startSpan, endSpan) 
    {
        var currentNode = startSpan;
        while (currentNode != null && 
               (endSpan == null || currentNode != endSpan)) 
        {
            var nextNode = currentNode.nextSibling;
            currentNode.parentNode.removeChild(currentNode);
            currentNode = nextNode;
        }
    }
}

MSDNLanguageFilter.FilterLanguages();
