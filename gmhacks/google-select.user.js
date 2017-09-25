// ==UserScript==
// @name		Google User Persitance Thing
// @namespace		http://www.rhyley.org/gm/
// @description		Add a drop-down box with your Google IDs
// @include		http*://*.google.tld/*
// ==/UserScript==

// based on code by Jason Rhyley
// and included here with his gracious permission

// ** Replace this array with your Yahoo IDs **
var gUserIDs = new Array("Put","Your","User","ID","Here");

var login = null;
var password = null;

function buildLoginThing() {
    if (gUserIDs[0] == 'Put') {
	alert('You must configure the script before it will \n' +
	      'work propery. Go to "Manage User Scripts" and\n' +
	      'click the "Edit" button to configure the script.');
	return;
    }
    
    var elmSelect = document.createElement("select");
    elmSelect.name = "Email";
    elmSelect.style.width = "10em";
    elmSelect.addEventListener('change', function() {
	if (this.selectedIndex == this.options.length-1) {
	    window.setTimeout(function() {
		var elmNew = document.createElement("input");
		elmNew.type = "text";
		elmNew.name = "Email";
		elmNew.style.width = "10em";
		login.parentNode.replaceChild(elmNew, login);
		login = elmNew;
		login.focus();
	    }, 0);
	}
	else {
	    password.focus();
	}
    }, true);
    
    var arOptions = new Array();
    var i;
    for (i in gUserIDs) {
	arOptions[i] = document.createElement("option");
	arOptions[i].setAttribute("value",gUserIDs[i]);
	arOptions[i].text = gUserIDs[i];
	elmSelect.appendChild(arOptions[i]);
    }
    arOptions[i] = document.createElement("option");
    arOptions[i].text = "Other...";
    elmSelect.appendChild(arOptions[i]);
    login.parentNode.replaceChild(elmSelect, login);
    login = elmSelect;
}

if (document.forms.length) {
    for (var k = 0; k < document.forms.length; k++) {
	var elmForm = document.forms[k];
	if (elmForm.action.indexOf('ServiceLogin') != -1) {
	    login = elmForm.elements.namedItem('Email');
	    password = elmForm.elements.namedItem('Passwd');
	    break;
	}
    }
}

if (!login) { return; }
password.style.width = "10em";
buildLoginThing();
setTimeout(function() { password.focus(); }, 100);
