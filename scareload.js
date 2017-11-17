// ==UserScript==
// @name         SCA Reloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @author       You
// @match        http://www.supercheapauto.com.au/*
// @match        https://www.supercheapauto.com.au/*
// @match        http://search.supercheapauto.com.au/*
// @match        https://search.supercheapauto.com.au/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	
	// 300000 5 minutes
	// 60000 1
	// 30000 30 seconds
	// 10000 10 seconds
	setTimeout(function(){
		console.log("click");
		var ww = window.open(window.location, '_self');
	}, 30000);
	//document.getElementById('dlbutton').click();
	//setTimeout(function(){var ww = window.open(window.location, '_self'); ww.close(); }, 2000);
	
	
	//$(".wishlist-box").css('overflow', 'visible');
	
	
	// Your code here...
})();