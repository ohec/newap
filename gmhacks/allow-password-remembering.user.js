// ==UserScript==
// @name          Allow Password Remembering
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   Removes autocomplete="off" attributes
// @include       *
// ==/UserScript==

// based on code by Julien Couvreur
// and included here with his gracious permission

var allowAutoComplete = function(element) {
    var iAttrCount = element.attributes.length;
    for (var i = 0; i < iAttrCount; i++) {
	var oAttr = element.attributes[i];
	if (oAttr.name == 'autocomplete') {
	    oAttr.value = 'on';
	    break;
	}
    }
}

var forms = document.getElementsByTagName('form');
for (var i = 0; i < forms.length; i++) {
    var form = forms[i];
    var elements = form.elements;
    allowAutoComplete(form);
    for (var j = 0; j < elements.length; j++) {
        allowAutoComplete(elements[j]);
    }
}
