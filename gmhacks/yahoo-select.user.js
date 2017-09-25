// ==UserScript==
// @name		Yahoo! User Persitance Thing
// @namespace		http://www.rhyley.org/gm/
// @description		Add a drop-down box to the Yahoo login form
// @include		http*://*.yahoo.tld/*
// ==/UserScript==

// based on code by Jason Rhyley
// and included here with his gracious permission

// ** Replace this array with your Yahoo IDs **
var gUserIDs = new Array("Put","Your","User","ID","Here");

var login = null;
var password = null;

function buildLoginThing() {
    if (gUserIDs[0] == 'Put'){
	alert('You must configure the script before it will \n' +
	      'work propery. Go to "Manage User Scripts" and\n' +
	      'click the \"Edit\" button to configure the script.');
	return;
    }

    var elmSelect = document.createElement("select");
    elmSelect.id = "username";
    elmSelect.name = "login";
    elmSelect.className = "yreg_ipt";
    elmSelect.addEventListener('change', function() {
	if (this.selectedIndex == this.options.length-1) {
	    window.setTimeout(function() {
		var elmNew = document.createElement("input");
		elmNew.type = "text";
		elmNew.id = "username";
		elmNew.name = "login";
		elmNew.className = "yreg_ipt";
		login.parentNode.replaceChild(elmNew, login);
		login = elmNew;
		login.focus();
	    }, 0);
	} else {
	    password.focus();
	}
    }, true);
    var arOptions = new Array();
    for (var i in gUserIDs) {
	arOptions[i] = document.createElement("option");
	arOptions[i].value = gUserIDs[i];
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
	if (elmForm.action.indexOf('login.yahoo.com') != -1) {
	    elmForm.addEventListener('submit', function(e) {
		e.stopPropagation();
		e.preventDefault();
	    }, true);
	    login = elmForm.elements.namedItem('login');
	    password = elmForm.elements.namedItem('passwd');
	    break;
	}
    }
}

if (!login) { return; }
if (location.href.indexOf("mail.yahoo.com") != -1) {
    location.href = "http://login.yahoo.com/config/login?.done=" +
	"http%3a%2f%2fmail%2eyahoo%2ecom";
} else {
    buildLoginThing();
    setTimeout(function() { password.focus(); }, 100);
}
