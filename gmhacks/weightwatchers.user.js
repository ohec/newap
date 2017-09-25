// ==UserScript==
// @name            WeightWatchers SiteRequirements Bypass
// @namespace       http://docs.g-blog.net/code/greasemonkey
// @description     Move past Weight Watchers' ridiculous browser check
// @include         http://weightwatchers.com/*
// @include         http://www.weightwatchers.com/*
// ==/UserScript==

// based on code by Carlo Zottmann
// and included here with his gracious permission

if (window.location.href.match(/siteRequirements/i)) {
    window.location.replace(
        location.href.match(/^(https?:\/\/[^\/]+)\//i)[1]+"/index.aspx");
}
