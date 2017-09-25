// ==UserScript==
// @name          BetterDir
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   make Apache 1.3-style directory listings prettier
// @include       *
// ==/UserScript==

function addGlobalStyle(css) {
    var elmHead, elmStyle;
    elmHead = document.getElementsByTagName('head')[0];
    if (!elmHead) { return; }
    elmStyle = document.createElement('style');
    elmStyle.type = 'text/css';
    elmStyle.innerHTML = css;
    elmHead.appendChild(elmStyle);
}

// if page title does not start with "Index of /", bail
if (!(/^Index of \//.test(document.title))) { return; }

// If we can't find the PRE element, this is either
// not a directory listing at all, or it's an
// Apache 2.x listing with fancy table output enabled
var arPre = document.getElementsByTagName('pre');
if (!arPre.length) { return; }
var elmPre = arPre[0];
    
// find the column headers, or bail
var snapHeaders = document.evaluate(
    "//a[contains(@href, '?')]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
if (!snapHeaders.snapshotLength) { return; }
    
// Tables aren't evil, they're just supposed to be used for tabular data.
// This is tabular data, so let's make a TABLE element
var elmTable = document.createElement('table');
// give the table a summary, for accessibility
elmTable.setAttribute('summary', 'Directory listing');
var elmCaption = document.createElement('caption');
// the "title" of the table should go in a CAPTION element
// inside the TABLE element, for semantic purity
elmCaption.textContent = document.evaluate("//head/title",
    document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,
    null).singleNodeValue.textContent;
elmTable.appendChild(elmCaption);
    
var elmTR0 = document.createElement('tr');
var iNumHeaders = 0;
for (var i = 0; i < snapHeaders.snapshotLength; i++) {
    var elmHeader = snapHeaders.snapshotItem(i);
    // column headers go into TH elements, for accessibility
    var elmTH = document.createElement('th');
    var elmLink = document.createElement('a');
    elmLink.href = elmHeader.href;
    elmLink.innerHTML = elmHeader.innerHTML;
    // give each of the column header links a title,
    // to explain what will happen when you click on them
    elmLink.title = "Sort by " + elmHeader.innerHTML.toLowerCase();
    elmTH.appendChild(elmLink);
    elmTR0.appendChild(elmTH);
    iNumHeaders++;
}
elmTable.appendChild(elmTR0);

var sPreText = elmPre.innerHTML;
if (/<hr/.test(sPreText)) {
    sPreText = sPreText.split(/<hr.*?>/)[1];
}
var arRows = sPreText.split(/\n/);
var nRows = arRows.length;
var bOdd = true;
for (var i = 0; i < nRows; i++) {
    var sRow = arRows[i];
    sRow = sRow.replace(/^\s*|\s*$/g, '');
    if (!sRow) { continue; }
    if (/\<hr/.test(sRow)) { continue; }
    var arTemp = sRow.split(/<\/a>/);
    var sLink = arTemp[0] + '</a>';
    if (/<img/.test(sLink)) {
        sLink = sLink.split(/<img.*?>/)[1];
    }
    sRestOfLine = arTemp[1];
    arRestOfCols = sRestOfLine.split(/\s+/);
    
    var elmTR = document.createElement('tr');
    var elmTD = document.createElement('td');
    elmTD.innerHTML = sLink;
    elmTR.appendChild(elmTD);
    
    var iNumColumns = arRestOfCols.length;
    var bRightAlign = false;
    for (var j = 1 /* really */; j < iNumColumns; j++) {
        var sColumn = arRestOfCols[j];
        if (/\d\d:\d\d/.test(sColumn)) {
            elmTD.innerHTML += ' ' + sColumn;
        } else {
            elmTD = document.createElement('td');
            elmTD.innerHTML = arRestOfCols[j];
            if (bRightAlign) {
                elmTD.setAttribute('class', 'flushright');
            }
            elmTR.appendChild(elmTD);
        }
        bRightAlign = true;
    }
    while (iNumColumns <= iNumHeaders) {
        elmTR.appendChild(document.createElement('td'));
        iNumColumns++;
    }
        
    // zebra-stripe table rows, from
    // http://www.alistapart.com/articles/zebratables/
    // and http://www.alistapart.com/articles/tableruler/
    elmTR.style.backgroundColor = bOdd ? '#eee' : '#fff';
    elmTR.addEventListener('mouseover', function() { 
        this.className = 'ruled';
    }, true);
    elmTR.addEventListener('mouseout', function() {
        this.className = '';
    }, true);
    elmTable.appendChild(elmTR);
    
    bOdd = !bOdd;
}

// copy address footer -- probably a much easier way to do this,
// but it's not always there (depends on httpd.conf options)
var sFooter = document.getElementsByTagName('address')[0];
var elmFooter = null;
if (sFooter) {
    elmFooter = document.createElement('address');
    elmFooter.innerHTML = sFooter.innerHTML;
}

window.addEventListener('load', 
    function() {
        document.body.innerHTML = '';
        document.body.appendChild(elmTable);
        if (elmFooter) {
            document.body.appendChild(elmFooter);
        }
    },
    true);

// now that everything is semantic and accessible,
// make it a little prettier too
addGlobalStyle(
'table {' +
'  border-collapse: collapse;' +
'  border-spacing: 0px 5px;' +
'  margin-top: 1em;' +
'  width: 100%;' +
'}' +
'caption {' +
'  text-align: left;' +
'  font-weight: bold;' +
'  font-size: 180%;' +
'  font-family: Optima, Verdana, sans-serif;' +
'}' +
'tr {' +
'  padding-bottom: 5px;' +
'}' +
'td, th {' +
'  font-size: medium;' +
'  text-align: right;' +
'}' +
'th {' +
'  font-family: Optima, Verdana, sans-serif;' +
'  padding-right: 10px;' +
'  padding-bottom: 0.5em;' +
'}' +
'th:first-child {' +
'  padding-left: 20px;' +
'}' +
'td:first-child,' +
'td:last-child,' +
'th:first-child,' +
'th:last-child {' +
'  text-align: left;' +
'}' +
'td {' +
'  font-family: monospace;' +
'  border-bottom: 1px solid silver;' +
'  padding: 3px 10px 3px 20px;' +
'  border-bottom: 1px dotted #003399;' +
'}' +
'td a {' +
'  text-decoration: none;' +
'}' +
'tr.ruled {' +
'  background-color: #88eecc ! important;' +
'}' +
'address {' +
'  margin-top: 1em;' +
'  font-style: italic;' +
'  font-family: Optima, Verdana, sans-serif;' +
'  font-size: small;' +
'  background-color: transparent;' +
'  color: silver;' +
'}');
