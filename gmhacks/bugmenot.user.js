// ==UserScript==
// @name          Bug Me Not
// @namespace     http://www.reifysoft.com/?scr=BugMeNot
// @description   Bypass required registration using Bug Me Not
// @include       *
// ==/UserScript==

// based on code by Matt McCarthy of ReifySoft.com
// and included here with his gracious permission

// new logins gotten from the current page (reset on every page load)
var retrievals = 0;
// millisecond delay between a field losing focus and checking to see
// if any other of our fields has focus. If this is too low, the menu
// won't work because it will get "display: none" and its onclick
// won't fire.
var BLUR_TIMEOUT = 150;

var allInputs = null;
var bmnView = "http://bugmenot.com/view.php";
var bmnUri = bmnView + "?url=" + location.href;
var bmnHomeUri = "http://bugmenot.com/";
var DEBUG = false;
var bmnWrappers = new Object();

var Style = {
    menuLink: {
	border: "none",
	backgroundColor: "#fff",
	color: "#000",
	
	display: "block",
	padding: "2px",
	margin: "0",
	width: "12em",
	
	fontSize: "8pt",
	fontWeight: "normal",
	textDecoration: "none"
    },
    
    menuLinkHover: {
	backgroundColor: "#316AC5",
	color: "#fff"
    },
    
    menuLinkWrapper: {
	textAlign: "left",
	padding: "1px",
	margin: 0
    },

    bmnWrapper: {
	display: "none",
	fontFamily: "tahoma, verdana, arial, sans-serif",
	whiteSpace: "nowrap",
	
	position: "absolute",
	zIndex: 1000,
	
	padding: "2px",
	border: "1px solid #ACA899",
	backgroundColor: "#fff",
	
	opacity: "0.9",
	filter: "alpha(opacity=90)"
    }
};

function copyProperties(to, from) {
    for (var i in from) {
	to[i] = from[i];
    }
}

function main() {
    processPasswordFields();
}

function getBmnWrapper(pwFieldIndex) {
    return document.getElementById("reify-bugmenot-bmnWrapper" +
        pwFieldIndex);
}

function processPasswordFields() {
    allInputs = document.getElementsByTagName("input");
    var bmnContainer = document.createElement("div");
    bmnContainer.id = "reify-bugmenot-container";
    
    var bodyEl = document.getElementsByTagName("body")[0];
    if (!bodyEl) return;
    
    for (var i = 0; i < allInputs.length; i++) {
	var pwField = allInputs[i];
	if (!(pwField.type && pwField.type.toLowerCase() == "password")) {
	    continue;
	}
	
	var previousTextFieldInd = getPreviousTextField(i);
	if (previousTextFieldInd == -1) {
	    if (DEBUG) {
		GM_log("Couldn't find text field before password input " +
		       i + ".");
		continue;
	    }
	}

	var usernameField = allInputs[previousTextFieldInd];
	usernameField.setAttribute('usernameInputIndex',
				   previousTextFieldInd);
	usernameField.setAttribute('passwordInputIndex', i);
	Utility.addEventHandler(usernameField, "focus",
				usernameField_onfocus);
	Utility.addEventHandler(usernameField, "blur",
				usernameField_onblur);

	Utility.addEventHandler(pwField, "focus", pwField_onfocus);
	Utility.addEventHandler(pwField, "blur", pwField_onblur);
	pwField.setAttribute('usernameInputIndex', previousTextFieldInd);
	pwField.setAttribute('passwordInputIndex', i);
	
	var getLoginLink = menuLink(bmnUri, "Get login from Bug Me Not",
            "Get a login from Bug Me Not",
            getLoginLink_onclick, Style.menuLink, previousTextFieldInd,
            i, menuLink_onmouseover, menuLink_onmouseout);
	var getLoginLinkWrapper = menuEntry(getLoginLink,
            Style.menuLinkWrapper);
	
	var fullFormLink = menuLink(bmnUri, "More options",
            "See more options for getting logins from BugMeNot.com " +
            "(opens a new window)", openMenuLink_onclick,
            Style.menuLink, previousTextFieldInd, i,
            menuLink_onmouseover, menuLink_onmouseout);
	var fullFormLinkWrapper = menuEntry(fullFormLink,
            Style.menuLinkWrapper);

	var visitBmnLink = menuLink(bmnHomeUri, "Visit Bug Me Not",
            "Go to the Bug Me Not home page (opens a new window)",
            openMenuLink_onclick, Style.menuLink, previousTextFieldInd,
            i, menuLink_onmouseover, menuLink_onmouseout);
	var visitBmnLinkWrapper = menuEntry(visitBmnLink,
            Style.menuLinkWrapper);
	
	var bmnWrapper = document.createElement("div");
	bmnWrapper.id = "reify-bugmenot-bmnWrapper" + i;
	bmnWrapper.className = "reify-bugmenot-bmnWrapper";
	bmnWrapper.appendChild(getLoginLinkWrapper);
	bmnWrapper.appendChild(fullFormLinkWrapper);
	bmnWrapper.appendChild(visitBmnLinkWrapper);
	copyProperties(bmnWrapper.style, Style.bmnWrapper);
	
	bmnContainer.appendChild(bmnWrapper);
    }

    if (bmnContainer.hasChildNodes()) {
	bodyEl.appendChild(bmnContainer);
    }
}

function menuEntry(linkEl, styleObj) {
    var p = document.createElement("p");
    copyProperties(p.style, styleObj);
    p.appendChild(linkEl);
    return p;
}

function menuLink(href, text, title, onclick, styleObj,
    usernameInputIndex, passwordInputIndex, onmouseover, onmouseout) {
    var newMenuLink = document.createElement("a");
    newMenuLink.href = href;
    newMenuLink.appendChild(document.createTextNode(text));
    newMenuLink.title = title;
    newMenuLink.setAttribute('usernameInputIndex', usernameInputIndex);
    newMenuLink.setAttribute('passwordInputIndex', passwordInputIndex);

    Utility.addEventHandler(newMenuLink, "click", onclick);
    Utility.addEventHandler(newMenuLink, "mouseover", onmouseover);
    Utility.addEventHandler(newMenuLink, "mouseout", onmouseout);

    copyProperties(newMenuLink.style, styleObj);
    
    return newMenuLink;
}

function menuLink_onmouseover(event) {
    event = event || window.event;
    var target = event.currentTarget || event.srcElement;
    copyProperties(target.style, Style.menuLinkHover);
}

function menuLink_onmouseout(event) {
    event = event || window.event;
    var target = event.currentTarget || event.srcElement;
    copyProperties(target.style, Style.menuLink);
}

function getLoginLink_onclick(event) {
    if((!allInputs[this.getAttribute('passwordInputIndex')].value.length &&
	!allInputs[this.getAttribute('usernameInputIndex')].value.length) ||
       confirm("Overwrite the current login entry?")) {
	getLogin(bmnUri, this.getAttribute('usernameInputIndex'),
		 this.getAttribute('passwordInputIndex'));
    }
    menuLink_onmouseout({currentTarget: this});
    event.preventDefault && event.preventDefault();
    return false;
}

function openMenuLink_onclick(event) {
    if (typeof GM_openInTab != 'undefined') {
	GM_openInTab(this.href);
    } else {
	window.open(this.href);
    }
    menuLink_onmouseout({currentTarget: this});
    event.preventDefault && event.preventDefault();
    return false;
}

function usernameField_onfocus(event) {
    event = event || window.event;
    var target = event.currentTarget || event.srcElement;
    target.setAttribute('hasFocus', true);
    showHideBmnWrapper(target, allInputs[target.getAttribute('passwordInputIndex')], true);
}

function usernameField_onblur(event) {
    event = event || window.event || this;
    var target = event.currentTarget || event.srcElement;
    target.setAttribute('hasFocus', false);
    var fRef = hideIfNoFocus(allInputs[target.getAttribute('usernameInputIndex')],
        allInputs[target.getAttribute('passwordInputIndex')]);
    // race condition: wait for other element's onfocus
    setTimeout(fRef, BLUR_TIMEOUT);
}

function pwField_onfocus(event) {
    event = event || window.event;
    var target = event.currentTarget || event.srcElement;
    target.setAttribute('hasFocus', true);
    showHideBmnWrapper(allInputs[target.getAttribute('usernameInputIndex')],
		       target, true);
}

function pwField_onblur(event) {
    event = event || window.event;
    var target = event.currentTarget || event.srcElement;
    target.setAttribute('hasFocus', false);
    var fRef = hideIfNoFocus(allInputs[target.getAttribute('usernameInputIndex')],
        allInputs[target.getAttribute('passwordInputIndex')]);
    // race condition: wait for other element's onfocus
    setTimeout(fRef, BLUR_TIMEOUT);
}

function hideIfNoFocus(usernameField, pwField) {
    return (function() {
	var bUsernameFocus = usernameField.getAttribute('hasFocus');
	if (typeof bUsernameFocus == 'string') {
	    bUsernameFocus = (bUsernameFocus && bUsernameFocus != 'false');
	}
	var bPasswordFocus = pwField.getAttribute('hasFocus');
	if (typeof bPasswordFocus == 'string') {
	    bPasswordFocus = (bPasswordFocus && bPasswordFocus != 'false');
	}
	if ((!bUsernameFocus) && (!bPasswordFocus)) {
	    GM_log('calling showHideBmnWrapper from hideIfNoFocus');
	    showHideBmnWrapper(usernameField, pwField, false);
	}
    });
}

function showHideBmnWrapper(usernameField, pwField, show) {
    var bmnWrapper = getBmnWrapper(pwField.getAttribute('passwordInputIndex'));

    if (show) {
	bmnWrapper.style.display = "block";
	positionBmnWrapper(bmnWrapper, usernameField, pwField);
    } else {
	GM_log('hiding bugmenot wrapper');
	bmnWrapper.style.display = "none";
	
	// Menu links may not get onmouseout event, so they get
	// stuck with the hover style unless we do this.
	var menuLinks = bmnWrapper.getElementsByTagName("div");
	for (var i = 0; i < menuLinks.length; i++) {
	    copyProperties(menuLinks[i].style, Style.menuLink);
	}
    }
}

function positionBmnWrapper(bmnWrapper, usernameField, pwField) {
    var pwLeft = Utility.elementLeft(pwField);

    if (pwLeft + pwField.offsetWidth + bmnWrapper.offsetWidth +
        Utility.scrollLeft() + 10 < Utility.viewportWidth()) {
	bmnWrapper.style.left = (pwLeft + pwField.offsetWidth + 2) + "px";
	bmnWrapper.style.top = Utility.elementTop(pwField) + "px";
    } else {
	bmnWrapper.style.left = (Utility.elementLeft(usernameField) -
            bmnWrapper.offsetWidth - 2) + "px";
	bmnWrapper.style.top = Utility.elementTop(usernameField) + "px";
    }
}

// We have a uri param rather than assuming it's for the current
// page so this function can be modular and potentially used
// for pages other than the current one.
function getLogin(uri, usernameInputIndex, passwordInputIndex) {
    var usernameField = allInputs[usernameInputIndex];
    var pwField = allInputs[passwordInputIndex];
    waitOrRestoreFields(usernameField, pwField, false);
    
    var hostUri = location.hostname;
    var firstAttempt = retrievals == 0;
    var submitData = "submit=This+login+didn%27t+work&num=" + retrievals +
        "&site=" + encodeURI(location.hostname);
    
    GM_xmlhttpRequest({
        method: firstAttempt ? "get" : "post",
	headers: firstAttempt ? null :
            {"Content-type": "application/x-www-form-urlencoded"},
        data: firstAttempt ? null : submitData,
        url: firstAttempt ? uri : bmnView,
        onload: function(responseDetails) {
            waitOrRestoreFields(usernameField, pwField, true);
            var doc = textToXml(responseDetails.responseText);
	    if (!(doc && doc.documentElement)) {
		return Errors.say(Errors.malformedResponse);
	    }
				    
	    var accountInfo = doc.documentElement.
		getElementsByTagName("dd")[0];
	    if (!(accountInfo && accountInfo.childNodes.length > 2)) {
		return Errors.say(Errors.noLoginAvailable);
	    }
				    
	    usernameField.value = accountInfo.childNodes[0].nodeValue;
	    pwField.value = accountInfo.childNodes[2].nodeValue;
	    retrievals++;
	},
        onerror: function(responseDetails) {
            waitOrRestoreFields(usernameField, pwField, true);
	    Errors.say(Errors.xmlHttpFailure);
	}
    });
}

function waitOrRestoreFields(usernameField, pwField, restore) {
    document.documentElement.style.cursor = restore ? "default" : "progress";
    usernameField.value = restore ? "" : "Loading...";
    usernameField.disabled = !restore;
    pwField.disabled = !restore;
}

function getPreviousTextField(pwFieldIndex) {
    for (var i = pwFieldIndex; i >= 0 && i < allInputs.length; i--)
	if (allInputs[i].type && allInputs[i].type.toLowerCase() == "text")
	    return i;
    
    return -1;
}

function textToXml(t) {
    try {
	if (window.ActiveXObject) {
	    var dp = new ActiveXObject("Microsoft.XMLDOM");
	    dp.async = false;
	    dp.loadXML(t);
	    return dp;
	}
	else if (typeof DOMParser != undefined) {
	    var dp = new DOMParser();
	    return dp.parseFromString(t, "text/xml");
	}
	else {
	    return null;
	}
    }
    catch (e) {
	return null;
    }
}

var Errors = {
    noLoginAvailable: "Sorry, but BugMeNot.com had no login available " +
        "for this site.\nIf you're feeling helpful, you can click \"More " +
        "options\" to provide a login for future visitors.",
    malformedResponse: "Sorry, but I couldn't understand the response " +
        "from BugMeNot.com.\nThe service might be unavailable.",
    xmlHttpFailure: "There was an error in contacting BugMeNot.com.\n" +
        "The server may be unavailable or having internal errors.",
    
    say: function(msg) { alert(msg); return false; }
};


var Utility = {
    elementTop: function(el) {
        return Utility.recursiveOffset(el, "offsetTop");
    },

    elementLeft: function(el) {
        return Utility.recursiveOffset(el, "offsetLeft");
    },
    
    recursiveOffset: function(el, prop) {
	var dist = 0;
	while (el.offsetParent)
	{
	    dist += el[prop];
	    el = el.offsetParent;
	}
	return dist;
    },
    
    viewportWidth: function() {
        return Utility.detectAndUseAppropriateObj("clientWidth");
    },

    viewportHeight: function() {
	return Utility.detectAndUseAppropriateObj("clientHeight");
    },

    scrollLeft: function() {
	return Utility.detectAndUseAppropriateObj("scrollLeft");
    },

    scrollTop: function() {
        return Utility.detectAndUseAppropriateObj("scrollTop");
    },
    
    detectAndUseAppropriateObj: function(prop) {
	if (document.documentElement && document.documentElement[prop]) {
	    return document.documentElement[prop];
	}
	else if (document.body && document.body[prop]) {
	    return document.body[prop];
	} else {
	    return -1;
	}
    },
    
    addEventHandler: function(target, eventName, eventHandler) {
	if (target.addEventListener) {
	    target.addEventListener(eventName, eventHandler, false);
	} else if (target.attachEvent) {
	    target.attachEvent("on" + eventName, eventHandler);
	}
    }
};

main();
