// ==UserScript==
// @name          Table Crosshair
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   highlight current row and column in data tables
// @include       *
// ==/UserScript==

var arTableRows = document.getElementsByTagName('tr');
var arCellXref = new Array();
for (var i = arTableRows.length - 1; i >= 0; i--) {
    var elmRow = arTableRows[i];
    elmRow.addEventListener('mouseover', function() {
        this._backgroundColor = this.style.backgroundColor;
        this._color = this.style.color;
        this.style.backgroundColor = '#88eecc';
        this.style.color = '#000';
    }, true);
    elmRow.addEventListener('mouseout', function() {
        this.style.backgroundColor = this._backgroundColor;
        this.style.color = this._color;
    }, true);
    var arCells = elmRow.getElementsByTagName('td');
    for (var j = arCells.length - 1; j >= 0; j--) {
        var elmCell = arCells[j];
        var iCellIndex = elmCell.cellIndex;
        if (!(iCellIndex in arCellXref)) {
            arCellXref[iCellIndex] = new Array();
        }
        arCellXref[iCellIndex].push(elmCell);
    }
    for (var j = arCells.length - 1; j >= 0; j--) {
        var elmCell = arCells[j];
        elmCell.addEventListener('mouseover', function() {
            var iThisIndex = this.cellIndex;
            for (var k = arCellXref[iThisIndex].length - 1; k >= 0; k--) {
                var elm = arCellXref[iThisIndex][k];
                elm.setAttribute('_backgroundColor', elm.style.backgroundColor);
                elm.setAttribute('_color', elm.style.color);
                elm.style.backgroundColor = '#88eecc';
                elm.style.color = '#000';
            }
        }, true);
        elmCell.addEventListener('mouseout', function() {
            var iThisIndex = this.cellIndex;
            for (var k = arCellXref[iThisIndex].length - 1; k >= 0; k--) {
                var elm = arCellXref[iThisIndex][k];
                elm.style.backgroundColor = elm.getAttribute('_backgroundColor');
                elm.style.color = elm.getAttribute('_color');
            }
        }, true);
    }
}
