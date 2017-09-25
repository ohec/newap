// ==UserScript==
// @name Zoom Image
// @namespace http://www.smartmenus.org/
// @description Displays an zoom toolbar over images
// ==/UserScript==

// based on code by Vasil Dinkov
// and included here with his gracious permission

// === User Configuration ===
const kZoomFactor = 1.7; // amount to zoom image on each click
const kMenuShowTimeOut = 1.2; // seconds before auto-hiding menu
const kMinimumImageWidth = 100; // minimal width of the menu-enabled images
const kMinimumImageHeight = 50; // minimal height of the menu-enabled images

// === Code ===
var gTimeoutID = gPixelLeft = gPixelTop = 0;
var gMenuBuilt = false;
var gElmToolbar = gCurrentImage = null;

function image_mouseover(o) {
    if ((o.clientWidth<kMinimumImageWidth ||
	 o.clientHeight<kMinimumImageHeight) && 
	!o.zoomed || 
	gMenuBuilt &&
	gElmToolbar.style.visibility == "visible") {
	return;
    }
    gCurrentImage = o;
    if (!gCurrentImage.original_width) {
	gCurrentImage.original_width = o.clientWidth;
	gCurrentImage.original_height = o.clientHeight;
    }
    gPixelLeft = o.offsetLeft;
    gPixelTop = o.offsetTop;
    var oParent = o.offsetParent;
    while (oParent) {
	gPixelLeft += oParent.offsetLeft;
	gPixelTop += oParent.offsetTop;
	oParent = oParent.offsetParent;
    }
    gTimeoutID = setTimeout(show_toolbar, kMenuShowTimeOut*1000);
}

function show_toolbar() {
    if (!build_menu()) { return; }
    gElmToolbar.style.top = gPixelTop+"px";
    gElmToolbar.style.left = gPixelLeft+"px";
    gElmToolbar.style.visibility = "visible";
}

function hide_toolbar(e) {
    if (gTimeoutID) {
	clearTimeout(gTimeoutID);
	gTimeoutID = 0;
    }
    if (!build_menu()) { return; }
    var relatedTarget = e?e.relatedTarget:0;
    if (relatedTarget && 
	(gElmToolbar==relatedTarget ||
	 gElmToolbar==relatedTarget.parentNode)) {
	return;
    }
    gElmToolbar.style.visibility = "hidden";
    gCurrentImage = null;
}

function toolbar_mouseout(e) {
    var relatedTarget = e.relatedTarget;
    if (relatedTarget && relatedTarget != gCurrentImage) {
	hide_toolbar(e);
    }
}

function create_button(sCaption, sTitle, fOnClick) {
    var elmButton = document.createElement("a");
    elmButton.href = '#';
    elmButton.className = "zoomtoolbarbutton";
    elmButton.title = sTitle;
    elmButton.appendChild(document.createTextNode(sCaption));
    elmButton.addEventListener("mouseover", function() {
	this.style.borderColor = "#4d4c76";
    }, false);
    elmButton.addEventListener("mousedown", function() {
	this.style.borderColor = "#000";
	this.style.background = "#eee4a5";
    }, false);
    elmButton.addEventListener("mouseup", function() {
	this.style.borderColor = "#4d4c76";
	this.style.background = "transparent";
    }, false);
    elmButton.addEventListener("mouseout", function() {
	this.style.borderColor = "#ffffdd #C1B683 #C1B683 #ffffdd";
	this.style.background = "transparent";
    }, false);
    elmButton.addEventListener("click", fOnClick, false);
    return elmButton;
}

function build_menu() {
    if (gMenuBuilt) { return true; }
    gElmToolbar = document.createElement("div");
    with (gElmToolbar.style) {
	position = "absolute";
	border = "1px solid";
	borderColor = "#ffffdd #857A4A #857A4A #ffffdd";
	backgroundColor = "#F5EBBC";
	margin = 0;
	padding = "2px";
	zIndex = 10000000;
    }
    gElmToolbar.appendChild(create_button("+", "Zoom in", function(e) {
	var width, height;
	width = gCurrentImage.clientWidth;
	height = gCurrentImage.clientHeight;
	gCurrentImage.style.width = width*kZoomFactor+"px";
	gCurrentImage.style.height = height*kZoomFactor+"px";
	gCurrentImage.zoomed = 1;
	e.preventDefault();
    }));
    gElmToolbar.appendChild(create_button("-", "Zoom out", function(e) {
	var width, height;
	width = gCurrentImage.clientWidth;
	height = gCurrentImage.clientHeight;
	gCurrentImage.style.width = width / kZoomFactor + "px";
	gCurrentImage.style.height = height / kZoomFactor + "px";
	gCurrentImage.zoomed = 1;
	e.preventDefault();
    }));
    gElmToolbar.appendChild(create_button("\u21B2", "Restore", function(e) {
	gCurrentImage.style.width = gCurrentImage.original_width + "px";
	gCurrentImage.style.height = gCurrentImage.original_height + "px";
	gCurrentImage.zoomed = 0;
	e.preventDefault();
    }));
    document.body.appendChild(gElmToolbar);
    gElmToolbar.addEventListener("mouseout", toolbar_mouseout, false);
    gMenuBuilt = true;
    return true;
}

function addGlobalStyle(css) {
    var head, styleLink;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    styleLink = document.createElement('link');
    styleLink.setAttribute('rel', 'stylesheet');
    styleLink.setAttribute('type', 'text/css');
    styleLink.setAttribute('href', 'data:text/css,' + escape(css));
    head.appendChild(styleLink);
}

for (var i = 0; i < document.images.length; i++) {
    var elmImage = document.images[i];
    elmImage.addEventListener("mouseover", function() {
	image_mouseover(this);
    }, false);
    elmImage.addEventListener("mouseout", hide_toolbar, false);
}

addGlobalStyle('' +
'a.zoomtoolbarbutton {' +
'  position: relative;' +
'  top: 0px;' +
'  font: 14px monospace;' +
'  border: 1px solid;' +
'  border-color: #ffffdd #c1b683 #c1b683 #ffffdd;' +
'  padding: 0 2px 0 2px;' +
'  margin: 0 2px 2px 2px;' +
'  text-decoration: none;' +
'  background-color: transparent;' +
'  color: black;' +
'}');
