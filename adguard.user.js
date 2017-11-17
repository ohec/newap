// ==UserScript==
// @name Adguard Popup Blocker Beta
// @name:ru	Блокировщик всплывающей рекламы Adguard Beta
// @name:uk Блокувальник спливаючої реклами Adguard Beta
// @name:de	Adguard Popup-Blocker Beta
// @name:sr	Koristi Adguard-ov blokator iskačućih prozora Beta
// @name:pl	Bloker wyskakujących okienek Beta
// @name:zh	使用 Adguard 弹窗拦截器 Beta
// @name:zh-TW	Adguard 彈出視窗阻擋器 Beta
// @name:sk	Adguard blokovač vyskakovacích okien Beta
// @name:fr	Bloqueur de popup de Adguard Beta
// @name:it	Blocco Pop-Up di Adguard Beta
// @name:es	Bloqueador Popup de Adguard Beta
// @namespace Adguard
// @description	Blocks popup ads on web pages
// @description:ru	Блокирует всплывающую рекламу на страницах
// @description:uk  Блокує спливаючу рекламу на веб-сторінках
// @description:de	Blockiert Anzeige-Popups auf Webseiten
// @description:tr	Web sayfalarında açılan pencere reklamları engeller
// @description:ko	웹 페이지의 팝업 광고를 차단 합니다.
// @description:sr	Blokira iskačuće reklame na veb stranicama
// @description:pl	Blokuje wyskakujące okienka z reklamami na stronach internetowych
// @description:zh	拦截网页弹窗广告
// @description:zh-TW	阻擋網頁彈窗廣告
// @description:sk	Blokuje vyskakovacie reklamy na webových stránkach
// @description:fr	Bloque les publicités intrusives sur les pages web
// @description:it	Blocca gli annunci di popup nelle pagine internet
// @description:vi	Chặn quảng cáo popup trên các trang web
// @description:es	Bloquea popups de anuncios en sitios web
// @version 2.1.9
// @license LGPL-3.0; https://github.com/AdguardTeam/PopupBlocker/blob/master/LICENSE
// @downloadURL https://cdn.adguard.com/public/Userscripts/Beta/AdguardPopupBlocker/2.1/popupblocker.user.js
// @updateURL https://cdn.adguard.com/public/Userscripts/Beta/AdguardPopupBlocker/2.1/popupblocker.meta.js
// @supportURL https://github.com/AdguardTeam/PopupBlocker/issues
// @homepageURL https://github.com/AdguardTeam/PopupBlocker
// @match http://*/*
// @match https://*/*
// @grant GM_getValue
// @grant GM_setValue
// @grant unsafeWindow
// @run-at document-start
// ==/UserScript==
var p = '__PB' + (1E9 * Math.random() >>> 0) + '__';
var q = 'function' === typeof cloneInto ? cloneInto : function (a) {return a;}, ja = 'function' === typeof createObjectIn ? createObjectIn : function (a, b) {
	var d = {};
	return a[b.defineAs] = d;
}, t  = 'function' === typeof exportFunction ? function (a, b, d) {exportFunction(function () {return q(a.apply(this, arguments), unsafeWindow);}, b, d);} : function (a, b, d) {b[d.defineAs] = a;};
var x = {
	en: {popup_text_full: 'Blocked an attempt to open a {{0_url}} pop-up window', popup_allow_dest: 'Always allow ${domain}', popup_allow_dest_conf: 'Allow all pop-ups leading to ${domain}?', popup_allow_origin: 'Allow all pop-ups on this website', popup_allow_origin_conf: 'Allow all pop-ups originating from ${parent}?', popup_text_min: 'Blocked', popup_expand_min: 'pop-up', on_navigation_by_popunder: 'This transition to the new page is likely to be caused by a pop-under. Do you wish to continue?', aborted_popunder_execution: 'PopupBlocker aborted a script exectution to prevent background redirect'}, ru: {
		popup_text_full: '\u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u0430 \u043f\u043e\u043f\u044b\u0442\u043a\u0430 \u043e\u0442\u043a\u0440\u044b\u0442\u0438\u044f \u0432\u0441\u043f\u043b\u044b\u0432\u0430\u044e\u0449\u0435\u0433\u043e \u043e\u043a\u043d\u0430 {{0_url}}', popup_allow_dest: '\u0412\u0441\u0435\u0433\u0434\u0430 \u0440\u0430\u0437\u0440\u0435\u0448\u0430\u0442\u044c ${domain}', popup_allow_dest_conf: '\u0412\u0441\u0435\u0433\u0434\u0430 \u0440\u0430\u0437\u0440\u0435\u0448\u0430\u0442\u044c \u0432\u0441\u043f\u043b\u044b\u0432\u0430\u044e\u0449\u0438\u0435 \u043e\u043a\u043d\u0430, \u0432\u0435\u0434\u0443\u0449\u0438\u0435 \u043d\u0430 ${domain}?', popup_allow_origin: '\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044c \u0432\u0441\u0435 \u043f\u043e\u043f-\u0430\u043f\u044b \u043d\u0430 \u044d\u0442\u043e\u043c \u0441\u0430\u0439\u0442\u0435', popup_allow_origin_conf: '\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044c \u0432\u0441\u0435 \u043f\u043e\u043f-\u0430\u043f\u044b, \u0438\u0441\u0445\u043e\u0434\u044f\u0449\u0438\u0435 \u043e\u0442 ${parent}?', popup_text_min: '\u0417\u0430\u0431\u043b\u043e\u043a\u0438\u0440\u043e\u0432\u0430\u043d\u043e', popup_expand_min: '\u043f\u043e\u043f-\u0430\u043f', on_navigation_by_popunder: '\u042d\u0442\u043e\u0442 \u043f\u0435\u0440\u0435\u0445\u043e\u0434 \u043d\u0430 \u043d\u043e\u0432\u0443\u044e \u0441\u0442\u0440\u0430\u043d\u0438\u0446\u0443 \u0441\u043a\u043e\u0440\u0435\u0435 \u0432\u0441\u0435\u0433\u043e \u0432\u044b\u0437\u0432\u0430\u043d \u043f\u043e\u043f-\u0430\u043d\u0434\u0435\u0440\u043e\u043c. \u0412\u0441\u0451 \u0440\u0430\u0432\u043d\u043e \u043f\u0440\u043e\u0434\u043e\u043b\u0436\u0438\u0442\u044c?', aborted_popunder_execution: 'PopupBlocker \u043f\u0440\u0435\u0440\u0432\u0430\u043b \u0438\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435 \u0441\u043a\u0440\u0438\u043f\u0442\u0430, \u0447\u0442\u043e\u0431\u044b \u043f\u0440\u0435\u0434\u043e\u0442\u0432\u0440\u0430\u0442\u0438\u0442\u044c \u0444\u043e\u043d\u043e\u0432\u044b\u0439 \u0440\u0435\u0434\u0438\u0440\u0435\u043a\u0442',
	}, de: {
		popup_text_full: 'Es wurde ein Versuch blockiert ein {{0_url}} Pop-up-Fenster zu \u00f6ffnen.', popup_allow_dest: '${domain} immer zulassen', popup_allow_dest_conf: 'Alle Pop-ups zulassen, die zu ${domain} f\u00fchren?', popup_allow_origin: 'Alle Pop-ups auf dieser Webseite erlauben', popup_allow_origin_conf: 'Alle Pop-ups aus der aktuellen Domain zulassen \u2014 ${parent}?', popup_text_min: 'Blockiert', popup_expand_min: 'Pop-up', on_navigation_by_popunder: 'Diese Seiten-Navigation wird wahrscheinlich durch ein Pop-under verursacht. M\u00f6chten Sie fortfahren?', aborted_popunder_execution: 'PopupBlocker hat eine Skript-Ausf\u00fchrung abgebrochen, um eine Hintergrundumleitung zu verhindern',
	}, tr: {
		popup_text_full: '{{0_url}} sitesinin a\u00e7\u0131l\u0131r pencere a\u00e7ma iste\u011fi engellendi', popup_allow_dest: '${domain} alan ad\u0131na her zaman izin ver', popup_allow_dest_conf: '${domain} sitesine y\u00f6nlendiren t\u00fcm a\u00e7\u0131l\u0131r pencerelere izin verilsin mi?', popup_allow_origin: 'Bu web sitesinde t\u00fcm a\u00e7\u0131l\u0131r pencerelere izin ver', popup_allow_origin_conf: '${parent} kaynakl\u0131 t\u00fcm a\u00e7\u0131l\u0131r pencerelere izin verilsin mi?', popup_text_min: 'Engellendi', popup_expand_min: 'a\u00e7\u0131l\u0131r pencere', on_navigation_by_popunder: 'Yeni sayfaya ge\u00e7i\u015f, bir gizli pencere nedeniyle meydana gelmi\u015f olabilir. Devam etmek istiyor musunuz?', aborted_popunder_execution: 'Arka plan y\u00f6nlendirmesini \u00f6nlemek i\u00e7in A\u00e7\u0131l\u0131r Pencere Engelleyicisi bir komut dosyas\u0131n\u0131n \u00e7al\u0131\u015fmas\u0131n\u0131 engelledi',
	}, pt_BR: {
		popup_text_full: 'Bloqueou uma tentativa de abrir uma janela pop-up de {{0_url}}', popup_allow_dest: 'Sempre permitir ${domain}', popup_allow_dest_conf: 'Permitir que todos os pop-ups que levam ${domain}?', popup_allow_origin: 'Permitir todos os pop-ups neste site', popup_allow_origin_conf: 'Permitir todos os pop-ups provenientes de ${parent}?', popup_text_min: 'Bloqueado', popup_expand_min: 'pop-up', on_navigation_by_popunder: 'Essa transi\u00e7\u00e3o para a nova p\u00e1gina provavelmente ser\u00e1 causada por um pop-under. Voc\u00ea deseja continuar?', aborted_popunder_execution: 'O bloqueador de pop-ups interrompeu uma execu\u00e7\u00e3o de script para evitar um redirecionamento em plano de fundo',
	}, ko: {
		popup_text_full: '{{0_url}} \ud31d\uc5c5\uc744 \ucc28\ub2e8\ud588\uc2b5\ub2c8\ub2e4', popup_allow_dest: '\ud56d\uc0c1 ${domain} \ud5c8\uc6a9', popup_allow_dest_conf: '\ud398\uc774\uc9c0 ${domain} \ub85c\uc758 \ud31d\uc5c5\uc744 \ud56d\uc0c1 \ud5c8\uc6a9\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?', popup_allow_origin: '\uc774 \uc6f9\uc0ac\uc774\ud2b8\uc758 \ud31d\uc5c5\uc744 \ud56d\uc0c1 \ud5c8\uc6a9', popup_allow_origin_conf: '\ud604\uc7ac \ud398\uc774\uc9c0 ${parent} \uc5d0\uc11c \ud31d\uc5c5\uc744 \ud56d\uc0c1 \ud5c8\uc6a9\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?', popup_text_min: '\ucc28\ub2e8\ub428', popup_expand_min: '\ud31d\uc5c5', on_navigation_by_popunder: '\uc774 \ud398\uc774\uc9c0 \uc804\ud658\uc740 \ud31d\uc5c5 \uc2a4\ud06c\ub9bd\ud2b8\uac00 \uc720\ubc1c\ud588\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4. \uacc4\uc18d\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?', aborted_popunder_execution: '\ud398\uc774\uc9c0 \uc804\ud658\uc774 \uc77c\uc5b4\ub098\uc9c0 \uc54a\ub3c4\ub85d \ud31d\uc5c5 \ucc28\ub2e8\uae30\uac00 \uc2a4\ud06c\ub9bd\ud2b8 \uc2e4\ud589\uc744 \uc911\ub2e8\uc2dc\ucf30\uc2b5\ub2c8\ub2e4',
	}, zh_CN: {
		popup_text_full: '\u5df2\u62e6\u622a\u6253\u5f00 {{0_url}} \u5f39\u7a97\u7684\u5c1d\u8bd5', popup_allow_dest: '\u59cb\u7ec8\u5141\u8bb8 ${domain}', popup_allow_dest_conf: 'Allow all pop-ups leading to ${domain}?', popup_allow_origin: '\u5141\u8bb8\u6b64\u7f51\u7ad9\u7684\u6240\u6709\u5f39\u51fa', popup_allow_origin_conf: 'Allow all pop-ups originating from ${parent}?', popup_text_min: '\u5df2\u62e6\u622a', popup_expand_min: '\u5f39\u51fa', on_navigation_by_popunder: '\u6b64\u7f51\u9875\u5bfc\u822a\u53ef\u80fd\u5bfc\u81f4\u5f39\u7a97\u3002\u60a8\u8981\u7ee7\u7eed\uff1f', aborted_popunder_execution: 'PopupBlocker \u5df2\u4e2d\u6b62\u811a\u672c\u6267\u884c\u4ee5\u9632\u6b62\u540e\u53f0\u91cd\u65b0\u5b9a\u5411',
	}, fr: {
		popup_text_full: 'Blocked an attempt to open a {{0_url}} pop-up window', popup_allow_dest: 'Toujours autoriser ${domain}', popup_allow_dest_conf: 'Allow all pop-ups leading to ${domain}?', popup_allow_origin: 'Allow all pop-ups on this website', popup_allow_origin_conf: 'Allow all pop-ups originating from ${parent}?', popup_text_min: 'Bloqu\u00e9', popup_expand_min: 'pop-up', on_navigation_by_popunder: 'This transition to the new page is likely to be caused by a pop-under. Do you wish to continue?', aborted_popunder_execution: 'PopupBlocker aborted a script exectution to prevent background redirect',
	}, sk: {
		popup_text_full: 'Bol zablokovan\u00fd pokus otvori\u0165 vyskakovacie okno {{0_url}}', popup_allow_dest: 'V\u017edy povoli\u0165 ${domain}', popup_allow_dest_conf: 'Povoli\u0165 v\u0161etky vyskakovacie okn\u00e1 ved\u00face na ${domain}?', popup_allow_origin: 'Povoli\u0165 v\u0161etky vyskakovacie okn\u00e1 na str\u00e1nke', popup_allow_origin_conf: 'Povoli\u0165 v\u0161etky vyskakovacie okn\u00e1 poch\u00e1dzaj\u00face z ${parent}?', popup_text_min: 'Zablokovan\u00e9', popup_expand_min: 'vyskakovacie okno', on_navigation_by_popunder: 'Tento prechod na nov\u00fa str\u00e1nku je pravdepodobne sp\u00f4soben\u00fd pop-under. Chcete pokra\u010dova\u0165?', aborted_popunder_execution: 'PopupBlocker preru\u0161il vykonanie skriptu, aby zabr\u00e1nil presmerovaniu na pozad\u00ed',
	}, es_419: {
		popup_text_full: 'Bloqueado intento de abrir una ventana pop-up {{0_url}} ', popup_allow_dest: 'Permitir siempre ${domain}', popup_allow_dest_conf: '\u00bfPermitir todos los pup-ups que conducen a ${domain}?', popup_allow_origin: 'Permitir todos los pop-ups en este sitio web', popup_allow_origin_conf: '\u00bfPermitir todos los pop-ups originados en ${parent}?', popup_text_min: 'Bloqueado', popup_expand_min: 'Ventana', on_navigation_by_popunder: 'Esta transici\u00f3n a la nueva p\u00e1gina parece estar causada por un pop-under (que aparece detr\u00e1s de la ventada actual). \u00bfDesea continuar?', aborted_popunder_execution: 'PopupBlocker abort\u00f3 la ejecuci\u00f3n de un script para prevenir un redireccionamiento en segundo plano.',
	}, it: {
		popup_text_full: 'Blocked an attempt to open a {{0_url}} pop-up window', popup_allow_dest: 'Always allow ${domain}', popup_allow_dest_conf: 'Allow all pop-ups leading to ${domain}?', popup_allow_origin: 'Permetti tutti i pop-up su questo sito', popup_allow_origin_conf: 'Allow all pop-ups originating from ${parent}?', popup_text_min: 'Bloccato', popup_expand_min: 'pop-up', on_navigation_by_popunder: 'This transition to the new page is likely to be caused by a pop-under. Do you wish to continue?', aborted_popunder_execution: 'PopupBlocker ha interrotto l\'esecuzione di uno script per impedire il reindirizzamento in background',
	}, zh_TW: {
		popup_text_full: 'Blocked an attempt to open a {{0_url}} pop-up window', popup_allow_dest: '\u6c38\u9060\u5141\u8a31 ${domain}', popup_allow_dest_conf: 'Allow all pop-ups leading to ${domain}?', popup_allow_origin: '\u5141\u8a31\u6b64\u7db2\u7ad9\u7684\u6240\u6709\u5f48\u51fa\u5f0f\u8996\u7a97', popup_allow_origin_conf: 'Allow all pop-ups originating from ${parent}?', popup_text_min: '\u5df2\u963b\u64cb', popup_expand_min: '\u5f48\u51fa\u5f0f\u8996\u7a97', on_navigation_by_popunder: 'This transition to the new page is likely to be caused by a pop-under. Do you wish to continue?', aborted_popunder_execution: 'PopupBlocker aborted a script exectution to prevent background redirect',
	},
}, y  = null;
if ('undefined' !== typeof AdguardSettings) {
	var ka = AdguardSettings.locale;
	x[ka] && (y = ka);
}
if (!y || !x[y]) {
	var B = navigator.language;
	if (!x[B]) {
		var la = B.indexOf('-');
		-1 !== la && (B = B.slice(0, la));
	}
	y = B;
}
y && x[y] || (y = 'en');

function D(a) {
	var b = x[y][a];
	b || (b = x.en[a]);
	return b;
}

var ma = /(?:\${|{{)/;

function na(a, b) {
	for (var d = [], e = '', g, h; a;) if (g = ma.exec(a)) h = g.index, e += a.substr(0, h), h += 2, 36 === g[0].charCodeAt(0) ? (g = a.indexOf('}', h), (h = b[a.slice(h, g)]) && (e += h), a = a.slice(g + 1)) : (g = a.indexOf('}}', h), e && d.push(e), e = '', d.push(a.charCodeAt(h) - 48), a = a.slice(g + 2)); else return (e += a) && d.push(e), d;
	e && d.push(e);
	return d;
}

var oa = {'&': 'amp;', '<': 'lt;', '>': 'gt;', '"': 'quot;', '\'': '#39;', '/': '#x2F;', '`': '#x60;', '=': '#x3D;'};

function pa(a) {return a.replace(/[&<>"'`=\/]/g, function (a) {return '&' + oa[a];});}

function Pa(a, b, d) {
	for (var e in b) {
		var g = b[e];
		d && (g = pa(g));
		a = a.replace(new RegExp('\\$\\{' + e + '\\}'), g);
	}
	return a;
}

var Qa = /^i18n:/;

function Ra(a, b) {
	var d = document.createNodeIterator(a, 128, null, !1), e;
	for (a = []; e = d.nextNode();) {
		var g = e.nodeValue;
		Qa.test(g) && (g = g.slice(5), g = na(D(g), b), a.push(new Sa(e.parentNode, e, g.map(function (a) {
			if ('number' == typeof a) {
				for (var b = e; 0 <= a;) b = b.nextSibling, b.nodeType === Node.ELEMENT_NODE && a--;
				a = b;
			} else {
				a = document.createTextNode(a);
			}
			return a;
		}))));
	}
	b = 0;
	for (d = a.length; b < d; b++) Ta(a[b])
}

function Sa(a, b, d) {
	this.c = a;
	this.a = b;
	this.f = d;
}

function Ta(a) {
	for (var b = 0, d = a.f.length; b < d; b++) a.c.insertBefore(a.f[b], a.a);
	a.c.removeChild(a.a);
};var Ua = /^http/;

function M(a) {
	var b = a;
	'string' !== typeof b && (b = b instanceof Object ? String(b) : '');
	a = b;
	b = document.createElement('a');
	b.href = a;
	'' == b.host && (b.href = b.href);
	var d = b.protocol;
	if (Ua.test(d)) {
		d = b.href.slice(d.length + 2), a = b.hostname;
	} else {
		d = a;
		var e = a.indexOf(',');
		a = -1 === e ? a : a.slice(0, e);
	}
	return [d, a, b.href];
};var N = ja(unsafeWindow, {defineAs: p});
N.domain = M(location.href)[1];
t(D, N, {defineAs: 'getMessage'});
t(M, N, {defineAs: 'url'});
var Va = JSON.stringify({whitelisted: !1, use_strict: !1}), Wa = JSON.parse(GM_getValue(location.host, Va)), O;
var Xa = GM_getValue('whitelist');
'undefined' === typeof Xa ? (GM_setValue('whitelist', ''), O = '') : O = Xa;
var Ya = O.split(',').filter(function (a) {return a.length;});
var Za = {position: 'fixed', right: '10px', top: '10px', border: 'none', opacity: '0', 'z-index': '2147483647', transform: 'translate3d(0,0,0)', transition: 'opacity 200ms,top 200ms', transitionTimingFunction: 'cubic-bezier(0.86,0,0.07,1),cubic-bezier(0.645,0.045,0.355,1)'};

function P(a, b) {for (var d = a.length; 0 < d--;) a[d].addEventListener('click', b)}

function $a(a, b) {
	b = Pa(D(a), b);
	a = Date.now();
	b = window.confirm(b);
	return 100 > Date.now() - a ? !0 : b;
}

function ab(a, b, d) {
	var e = document.createElement('iframe'), g = !1, h = M(b), k = Object.create(null);
	k.displayUrl = h[0];
	k.domain = h[1];
	k.href = b;
	k.parent = a;
	var C = Pa('<!DOCTYPE html><html lang="en"><meta charset="UTF-8"><style>body{font-family:"Gotham Pro","Helvetica Neue",Helvetica,Arial,sans-serif;margin:0}.popup{position:fixed;top:0;right:0;padding:15px 35px 15px 20px;font-size:13px;white-space:nowrap;background-color:#FFFFFF;border:1px solid #D6D6D6;box-shadow:0 2px 5px 0 rgba(0,0,0,.2)}.popup--min{padding:8px 38px 8px 14px}.popup--min .popup__text-min{display:block}.popup--min .popup__text-full{display:none}.popup--min .popup__logo{width:24px;height:24px;margin-right:9px}.popup--min .popup__text{font-size:11px;line-height:1.2}.popup--min .popup__close{top:50%;transform:translateY(-50%)}.popup__logo{display:inline-block;vertical-align:middle;width:30px;height:30px;margin-right:12px;background-repeat:no-repeat;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNS4zIDI1LjkiPjxwYXRoIGZpbGw9IiM2OGJjNzEiIGQ9Ik0xMi43IDBDOC43IDAgMy45LjkgMCAzYzAgNC40LS4xIDE1LjQgMTIuNyAyM0MyNS40IDE4LjQgMjUuMyA3LjQgMjUuMyAzIDIxLjQuOSAxNi42IDAgMTIuNyAweiIvPjxwYXRoIGZpbGw9IiM2N2IyNzkiIGQ9Ik0xMi42IDI1LjlDLS4xIDE4LjQgMCA3LjQgMCAzYzMuOS0yIDguNy0zIDEyLjYtM3YyNS45eiIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xMi4yIDE3LjNMMTkuOCA3YS45OS45OSAwIDAgMC0xLjMuMWwtNi40IDYuNi0yLjQtMi45Yy0xLjEtMS4zLTIuNy0uMy0zLjEgMGw1LjYgNi41Ii8+PC9zdmc+)}.popup__text{display:inline-block;vertical-align:middle;font-size:13px;line-height:1.6}.popup__text-min{display:none}.popup__text-blocked{max-width:150px;overflow:hidden;text-overflow:ellipsis}.popup__link{display:inline-block;vertical-align:middle;color:#66B574;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.popup__link--url{max-width:130px;vertical-align:bottom}.popup__link--allow{max-width:215px;margin-right:5px}.popup__close{position:absolute;top:10px;right:10px;width:15px;height:15px;border:0;background-color:#FFFFFF;background-repeat:no-repeat;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMC41IDIwLjUiPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMS4zIDEwLjNsOS05Yy4zLS4zLjMtLjggMC0xLjFzLS44LS4zLTEuMSAwbC05IDktOS05QzEtLjEuNS0uMS4yLjJzLS4zLjggMCAxLjFsOSA5LTkgOWMtLjMuMy0uMy44IDAgMS4xLjEuMS4zLjIuNS4ycy40LS4xLjUtLjJsOS05IDkgOWMuMS4xLjMuMi41LjJzLjQtLjEuNS0uMmMuMy0uMy4zLS44IDAtMS4xbC04LjktOXoiLz48L3N2Zz4=);-webkit-appearance:none;appearance:none;cursor:pointer;opacity:.3}</style><div class="popup"><div class="popup__logo"></div><div class="popup__text"><div class="popup__text-full">\x3c!--i18n:popup_text_full--\x3e <a href="${href}" target="_blank" class="popup__link popup__link--url">${displayUrl}</a><div class="popup__actions"><a href="javascript:void(0)" class="popup__link popup__link--allow">\x3c!--i18n:popup_allow_dest--\x3e </a><a href="javascript:void(0)" class="popup__link popup__link--all">\x3c!--i18n:popup_allow_origin--\x3e</a></div></div><div class="popup__text-min"><div class="popup__text-blocked">\x3c!--i18n:popup_text_min--\x3e</div><div class="popup__actions"><a href="javascript:void(0)" class="popup__link popup__link--expand">\x3c!--i18n:popup_expand_min--\x3e</a></div></div></div><button class="popup__close"></button></div>', k, !0);
	e.addEventListener('load', function () {
		if (!g) {
			g = !0;
			var b = e.contentDocument;
			b.documentElement.innerHTML = C;
			Ra(b.body, {domain: h[1]});
			d && b.getElementsByClassName('popup')[0].classList.add('popup--min');
			P(b.getElementsByClassName('popup__link--allow'), function () {
				if ($a('popup_allow_dest_conf', k)) {
					var a = N.whitelistedDestinations;
					a.push(h[1]);
					GM_setValue('whitelist', a.join(','));
				}
			});
			P(b.getElementsByClassName('popup__link--all'), function () {
				if ($a('popup_allow_origin_conf', k)) {
					var b = N.domainOption;
					b.whitelisted = !0;
					GM_setValue(a, JSON.stringify(b));
				}
			});
			requestAnimationFrame(function () {e.style.opacity = '1';});
			b.body.setAttribute('style', 'background-color:transparent;');
		}
	});
	e.setAttribute('allowTransparency', 'true');
	for (var u in Za) e.style[u] = Za[u];
	b = this.f = d ? 48 : 76;
	e.style.height = b + 'px';
	e.style.width = (d ? 180 : 574) + 'px';
	this.a = e;
	this.c = d;
	this.u = 10;
	this.i = (new Date).getTime();
}

function bb(a) {
	var b = a.c = !a.c;
	a.a.style.height = (a.f = b ? 48 : 76) + 'px';
	a.a.style.width = (b ? 180 : 574) + 'px';
	a.a.contentDocument.getElementsByClassName('popup')[0].classList.toggle('popup--min');
	a.i = (new Date).getTime();
}

function cb(a, b, d) {
	var e = db, g = new ab(a, b, d);
	a = e.a.length;
	Q(e, a, 10 + g.f);
	g.a.addEventListener('load', function () {
		var a = g.a.contentDocument;
		P(a.getElementsByClassName('popup__close'), function () {R(e, g);});
		P(a.getElementsByClassName('popup__link--expand'), function () {T(e, g);});
	});
	g.a.addEventListener('mouseover', function () {eb(e);});
	g.a.addEventListener('mouseout', function () {fb(e);});
	document.body.appendChild(g.a);
	g.j = d ? setTimeout(function () {R(e, g);}, 5E3) : setTimeout(function () {T(e, g);}, 2E3);
	if (4 < (a = e.a.push(g))) for (a -= 4; 0 < a--;) R(e, e.a[a])
}

function Q(a, b, d) {
	for (; 0 < b--;) {
		var e = a.a[b], g = e.u + d;
		e.a.style.top = g + 'px';
		e.u = g;
	}
}

function T(a, b) {
	var d = b.f;
	bb(b);
	Q(a, a.a.indexOf(b), b.f - d);
	clearTimeout(b.j);
	a.c || (b.j = b.c ? setTimeout(function () {R(a, b);}, 5E3) : setTimeout(function () {T(a, b);}, 2E3));
}

function R(a, b) {
	clearTimeout(b.j);
	var d = b.a.parentNode;
	d && d.removeChild(b.a);
	d = a.a.indexOf(b);
	Q(a, d, -(b.f + 10));
	a.a.splice(d, 1);
}

function eb(a) {
	a.c = !0;
	a.a.forEach(function (a) {clearTimeout(a.j);});
}

function fb(a) {
	a.c = !1;
	var b = (new Date).getTime(), d = gb(a), e = b > d ? b - d : 0;
	a.a.forEach(function (d) {d.j = d.c ? setTimeout(function () {R(a, d);}, d.i + 5E3 - b + e) : setTimeout(function () {T(a, d);}, d.i + 2E3 - b + e);});
}

function gb(a) {
	a = a.a;
	for (var b = 0, d = a.length; b < d; b++) {
		if (a[b].c) {
			if (!e) {
				var e = a[b].i + 5E3;
				if (g) break;
			}
		} else if (!g) {
			var g = a[b].i + 2E3;
			if (e) break;
		}
	}
	return e > g ? g : e;
}

var db = new function () {this.a = [];};
N.domainOption = q(Wa, N);
N.whitelistedDestinations = q(Ya, N);
t(function (a, b, d) {cb(a, b, d);}, N, {defineAs: 'showAlert'});

function U(a, b, d) {
	function e() {
		for (var c = a; c && E.test(c.location.href);) c = (c = jb.call(c)) ? c.ownerDocument.defaultView : null;
		return c ? c : null;
	}

	function g(c) {
		c = c.data;
		switch (c.h) {
			case 0:
				ra(c.B, c.C, c.A);
				break;
			case 1:
				C(c.H);
		}
	}

	function h(c) {
		if ('pb_handshake' === c.data && 'undefined' !== typeof c.source && !V.has(c.source)) {
			var f = c.ports[0];
			f.onmessage = g;
			V.set(c.source, f);
			c.stopImmediatePropagation();
			kb.call(c);
		}
	}

	function k(c, f) {(f = V.get(f)) && f.postMessage({h: 1, H: c});}

	function C(c, f) {
		var a = c[7], b = c[8];
		f = f || document.elementFromPoint(a, b);
		'IFRAME' === f.nodeName.toUpperCase() ? (a = f.getBoundingClientRect(), c[7] -= a.left, c[8] -= a.top, c[3] = null, k(c, f.contentWindow)) : W || (W = !0, setTimeout(function () {W = !1;}, 100), f.click());
	}

	function u() {
		sa = Math.random().toString(36).substr(7);
		console.warn(m.getMessage('aborted_popunder_execution'));
		throw sa;
	}

	function qa(c) {
		c = c.type;
		return 'click' === c || 'mousedown' === c || 'mouseup' === c;
	}

	function S(c, f, a) {
		this.h = c;
		this.m = f;
		this.l = a;
		this.b = v();
	}

	function F() {
		this.b = [[]];
		this.s(new S(0, void 0, void 0), 0);
	}

	function ta(c, f, a) {
		var n = X.get(f);
		'undefined' == typeof n && (n = f);
		return c.apply(n, a);
	}

	function lb(c, f, a) {return c.apply(f, a);}

	function ua(c, f) {
		var a;
		if (a = Y.get(c)) return a;
		a = function () {return f(c, this, arguments);};
		va(c, a, 'name');
		va(c, a, 'length');
		X.set(a, c);
		Y.set(c, a);
		return a;
	}

	function va(c, a, n) {
		var f = Object.getOwnPropertyDescriptor(c, n);
		f && f.configurable && (f.value = c[n], Object.defineProperty(a, n, f));
	}

	function Z(c, a, n, b, d) {
		b = b || lb;
		return !1 === d ? ua(c, b) : ua(c, function (c, f, z) {
			var e = {};
			('undefined' == typeof d || d(c, f, z)) && G.s(new S(a, n, {w: f, arguments: z, context: e}), wa);
			return b(c, f, z, e);
		});
	}

	function r(c, a, b, z) {c.hasOwnProperty(a) && (c[a] = Z(c[a], 1, a, b, z));}

	function A(c, a, b) {
		var f = Object.getOwnPropertyDescriptor(c, a);
		if (f && f.get && f.configurable) {
			b = Z(f.get, 2, a, b, void 0);
			var n;
			f.set && (n = Z(f.set, 3, a, void 0, void 0));
			Object.defineProperty(c, a, {get: b, set: n, configurable: !0, enumerable: f.enumerable});
		}
	}

	function nb() {
		function c(c, a) {return c ? a ? a.timeStamp - c.timeStamp : -1 : 1;}

		function f(c) {
			for (var a = c.length, f; !f || !f.currentTarget;) {
				if (0 === a) return;
				f = c[--a];
			}
			return f;
		}

		function b(c) {
			return function (a) {
				c.push(a);
				setTimeout(d.bind(null, c, a));
			};
		}

		function d(c, a) {
			a = c.indexOf(a);
			-1 != a && c.splice(a, 1);
		}

		var e = [], g = [], h = [];
		a.addEventListener('mousedown', b(e), !0);
		a.addEventListener('mouseup', b(g), !0);
		a.addEventListener('click', b(h), !0);
		this.b = function () {return [f(h), f(e), f(g)].sort(c)[0];};
	}

	function xa(c) {
		var a = c.nodeName.toUpperCase();
		return 'IFRAME' == a || 'INPUT' == a || 'A' == a || 'BUTTON' == a || c.hasAttribute('onclick') || c.hasAttribute('onmousedown') || c.hasAttribute('onmouseup') ? !0 : !1;
	}

	function ya(c) {return '[object Window]' === aa.call(c) || 'nodeName' in c && (c = c.nodeName.toUpperCase(), '#DOCUMENT' === c || 'HTML' === c || 'BODY' === c) ? !0 : !1;}

	function ba(c) {
		var a = getComputedStyle(c);
		c = a.getPropertyValue('position');
		a = a.getPropertyValue('z-index');
		return 'static' !== c && 1E3 < parseInt(a, 10) ? !0 : !1;
	}

	function za(c) {
		var a = c.textContent;
		return a && a.trim().length ? !1 : 0 === c.getElementsByTagName('img').length;
	}

	function ca(c) {
		if (!('style' in c)) return !1;
		var f = a.innerWidth, b = a.innerHeight;
		return c.offsetLeft << 4 < f && f - c.offsetWidth << 3 < f && c.offsetTop << 4 < b && b - c.offsetHeight << 3 < f ? ba(c) : !1;
	}

	function ob(c, f) {
		if (!pb.test(f) || 3 !== c.eventPhase) return !1;
		c = document.querySelectorAll('script[src*="googletagmanager.com/gtm.js"]');
		f = c.length;
		if (0 === f) return !1;
		for (; f--;) {
			var b = 'dataLayer', d = qb.exec(c[f].src);
			d && (b = d[1]);
			if ((b = a[b]) && (b = b[b.length - 1]) && 'gtm.linkClick' == b.event) return !0;
		}
		return !1;
	}

	function da() {
		var c = a, f;
		if (Aa) {
			for (f = c.event; !f;) {
				var b = c.parent;
				if (b === c) break;
				c = b;
				try {f = c.event;} catch (mb) {break;}
			}
		} else {
			f = Ba();
		}
		if (!f) {
			try {
				for (var d = arguments.callee, e = new w; d.caller;) {
					d = d.caller;
					if (e.has(d)) throw null;
					e.set(d, !0);
				}
				d.arguments && d.arguments[0] && 'target' in d.arguments[0] && (f = d.arguments[0]);
			} catch (mb) {}
		}
		return f;
	}

	function ea(c) {
		if (c) {
			if (!('clientX' in c && qa(c) || 'touches' in c)) return !0;
			var f = c.currentTarget;
			if (f) {
				if (ya(f)) {
					var b = c.eventPhase;
					a:{
						var d = c.target;
						if ('id' in d) {
							var e = c.type;
							if ((d = rb(d, '[jsaction*="' + e + ':"]')) && d.hasOwnProperty('__jsaction') && d.__jsaction.hasOwnProperty(e)) {
								e = d;
								break a;
							}
						}
						e = void 0;
					}
					if (e) return ya(e) ? !1 : !0;
					if (1 === b || 2 === b) return !1;
					a:{
						if ((e = a.jQuery || a.$) && e._data && (b = c.type, e = e._data(c.currentTarget, 'events')) && (b = e[b])) {
							d = 0;
							for (var g = b.length; d < g; d++) {
								if (e = b[d]) {
									var h = e.handler;
									try {
										var m = h.arguments;
										if (null !== m && m[0] && m[0].originalEvent === c) {
											var k = e.selector;
											break a;
										}
									} catch (l) {}
								}
							}
						}
						k = void 0;
					}
					if (k) {if (fa.call(document.documentElement, k) || fa.call(document.body, k)) return !1;} else if (!document.querySelector('[data-reactroot]') && !document.querySelector('[data-reactid]') || 'nodeName' in f && '#DOCUMENT' !== f.nodeName.toUpperCase()) return !1;
				} else if ('id' in f && ca(f)) return !1;
			}
		}
		return !0;
	}

	function H(c, a) {
		a = a || {};
		for (var f in c) {
			var b = Object.getOwnPropertyDescriptor(c, f);
			if (b) {
				switch (typeof b.value) {
					case 'undefined':
						break;
					case 'object':
						a[f] = {};
						break;
					case 'function':
						a[f] = function () {return !0;};
						break;
					default:
						a[f] = c[f];
				}
			}
		}
		return a;
	}

	function sb(c, f) {
		var b = H(a);
		H(Window.prototype, b);
		var d = H(document);
		H(Document.prototype, d);
		b.opener = a;
		b.closed = !1;
		b.name = f;
		b.document = d;
		d.open = function () {return this;};
		d.write = function () {};
		d.writeln = function () {};
		d.close = function () {};
		var e = tb(c);
		c = {get: function () {return e;}, set: function () {}};
		Object.defineProperty(b, I, c);
		Object.defineProperty(d, I, c);
		A(b, I);
		A(d, I);
		return b;
	}

	function tb(c) {
		var a = document.createElement('a');
		a.href = c;
		'' == a.host && (a.href = a.href);
		a[Ca] = a[Da] = Ea.set;
		Object.defineProperty(a, Fa, Ea);
		r(a, Ca);
		r(a, Da);
		A(a, Fa);
		return a;
	}

	function ub() {
		var c = vb;
		if (c.g && 0 === c.b) {
			var a = e();
			a && (c.g.observe(a.document.documentElement, wb), v(), c.b = v());
		}
		setTimeout(function () {c.g && 0 !== c.b && (c.g.disconnect(), c.b = 0);}, xb);
	}

	function Ga(c) {
		return c.returnValue = yb;
	}

	function zb() {a === a.top && (a.addEventListener('beforeunload', Ga), setTimeout(function () {a.removeEventListener('beforeunload', Ga);}, 1E3));}

	function J(c) {'style' in c && (c.style.setProperty('display', 'none', Ha), c.style.setProperty('pointer-events', 'none', Ha));}

	function Ab(c, a) {
		if (c.isTrusted) {
			if ('clientX' in c) {
				var b = c.target, f = c.clientX, d = c.clientY;
			} else if ('touches' in c) {
				b = c.target;
				d = c.changedTouches[0];
				if (!d) return;
				f = d.clientX;
				d = d.clientY;
			}
			if (b && 'id' in b) {
				if (document.elementsFromPoint) d = document.elementsFromPoint(f, d); else if (document.msElementsFromPoint) d = document.msElementsFromPoint(f, d); else return;
				var e;
				'path' in c ? e = c.path : 'composedPath' in c && (e = c.composedPath());
				var g = 0, h = 0, m = d.length, l, k = !1;
				d[0] !== b && (g = -1);
				for (f = l = b; l;) {
					if (xa(l)) {
						k = !0;
						break;
					}
					if (ba(l)) break;
					e ? 'id' in e[++h] ? l = e[h] : l = null : l = l.parentElement;
				}
				if (k) if (l && 'A' === l.nodeName.toUpperCase()) l.href === a && u(), ca(l) && (k = !1, J(l)); else return;
				location.href === a && u();
				if (l && za(f)) {
					if (!k) {
						a:for (; g < m - 1;) {
							if (f.parentElement !== (f = d[++g])) {
								for (l = f; l;) {
									if (xa(l)) {
										k = !0;
										break a;
									}
									if (ba(l)) break;
									l = l.parentElement;
								}
								if (!za(f)) break;
							}
						}
					}
					if (k) {
						for (J(b); 0 < g--;) J(d[g]);
						a = Bb.map(function (a) {return c[a];});
						C(a, f);
					}
				} else {
					zb();
				}
			}
		}
	}

	function ha(a, b) {
		ra(m.domain, a, !1);
		ub();
		b && Ab(b, a);
	}

	function Ia(a, b, d, e) {
		var c = m.url(d[0]);
		if (-1 !== m.whitelistedDestinations.indexOf(c[1])) return a.apply(b, d);
		var f = da();
		if ((ea(f) || ob(f, d[1])) && G.D(wa)) return a.apply(b, d);
		ha(c[2], f);
		a = sb(d[0], d[1]);
		e.G = !0;
		return a;
	}

	function Ja(c, b) {
		if (!Ka.has(b)) {
			var f = Math.random().toString(36).substr(7), d = Cb.call(b);
			try {
				E.test(d.location.href) && (a[f] = [X, Y, G, m], d.eval('(' + U.toString() + ')(window,"' + f + '");'), delete a[f]);
			} catch (Hb) {} finally {Ka.set(b, !0);}
		}
		return c.call(b);
	}

	function Db() {
		var c = this;
		this.o = 0;
		this.b = -1;
		this.v = function () {
			c.o = v();
			c.b = -1;
			var b = document.elementFromPoint(a.innerWidth >> 1, a.innerHeight >> 1);
			b && 'A' == b.nodeName.toUpperCase() && ca(b) && J(b);
		};
		this.g = !1;
		this.K = function () {
			var a = v() - c.o;
			c.g && -1 === c.b && (50 < a ? c.v() : c.b = setTimeout(function () {c.v();}, 50 - a));
		};
		a.addEventListener('mousedown', function (a) {
			a.isTrusted && (c.g = !0, clearTimeout(c.I), c.I = setTimeout(function () {c.g = !1;}, 200));
		}, !0);
		K && (this.J = new K(this.K), this.J.observe(document.documentElement, Eb));
	}

	var fa = Element.prototype.matches || Element.prototype.msMatchesSelector, rb = 'closest' in Element.prototype ? function (a, b) {return a.closest(b);} : function (a, b) {for (var c = a; c; c = c.parentElement) if (fa.call(a, b)) return a;}, E = /^about:/, jb = (Object.getOwnPropertyDescriptor(a, 'frameElement') || Object.getOwnPropertyDescriptor(Window.prototype, 'frameElement')).get;
	m;
	if ('undefined' !== typeof d) {
		var m = a[d];
		delete a[d];
	} else {
		m = a.parent[b][3];
	}
	var kb = a.Event.prototype.preventDefault;
	d = 'function' === typeof WeakMap;
	var La = a.parent, L = La === a, Ma = E.test(location.href), V = d ? new WeakMap : null, ia = !L && d ? new MessageChannel : null;
	d && (a.addEventListener('message', h), L || (La.postMessage('pb_handshake', '*', [ia.port1]), ia.port2.onmessage = g));
	var ra = !d || L || Ma ? L || Ma ? function (a, b, d) {e().setTimeout(m.showAlert, 0, a, b, d);} : function () {} : function (a, b, d) {ia.port2.postMessage({h: 0, B: a, C: b, A: d});}, W = !1, Bb = 'type canBubble cancelable view detail screenX screenY clientX clientY ctrlKey altKey shiftKey metaKey button relatedTarget'.split(' '), v = 'now' in performance ? function () {return performance.timing.navigationStart + performance.now();} : Date.now, sa, aa = Object.prototype.toString;
	w;
	if ('function' == typeof WeakMap) {
		var w = WeakMap;
	} else {
		var Fb = Date.now() % 1E9, Gb = Object.defineProperty;
		d = function () {this.name = '__st' + (1E9 * Math.random() >>> 0) + (Fb++ + '__');};
		d.prototype.set = function (a, b) {
			var c = a[this.name];
			c && c[0] === a ? c[1] = b : Gb(a, this.name, {value: [a, b], writable: !0});
			return this;
		};
		d.prototype.get = function (a) {
			var c;
			return (c = a[this.name]) && c[0] === a ? c[1] : void 0;
		};
		d.prototype.has = function (a) {
			var c = a[this.name];
			return c ? c[0] === a : !1;
		};
		w = d;
	}
	var Na = [
		function (a, b) {
			a = b[a][0];
			return 0 == a.h && 200 > v() - a.b ? !1 : !0;
		}, function (a, b) {
			var c = b[a][b[a].length - 1];
			a = c.b;
			var d;
			if (d = 1 === c.h && 'open' === c.m) c = c.l.arguments[0], 'string' !== typeof c && (c = c instanceof Object ? String(c) : ''), d = E.test(c);
			if (d) {
				for (c = b.length; 0 < c--;) {
					d = b[c];
					for (var f = d.length; 0 < f--;) {
						var e = d[f];
						if (200 < a - e.b) break;
						if ('open' === e.m && 1 === e.h && e.l.context.G) return !1;
					}
				}
			}
			return !0;
		},
	], Oa  = [
		function (a, b, d) {
			a = d.h;
			b = d.m;
			('assign' !== b && 'replace' !== b || 1 !== a) && ('location' !== b && 'href' !== b || 3 !== a) || String(d.l.arguments[0]) !== location.href || ('location' !== d.m || '[object Window]' === aa.call(d.l.w)) && '[object Location]' === aa.call(d.l.w) || u();
			return !0;
		},
	];
	F.prototype.s = function (a, b) {
		for (var c = Oa.length; c--;) Oa[c](b, this.b, a);
		var d = this.b[b];
		d.push(a);
		setTimeout(function () {d.splice(d.indexOf(a), 1);}, 5E3);
	};
	F.prototype.D = function (a) {
		for (var c = Na.length; c--;) if (!Na[c](a, this.b)) return !1;
		return !0;
	};
	F.prototype.F = function () {
		var a = this.b.push([]) - 1;
		this.s(new S(0, void 0, void 0), a);
		return a;
	};
	var G = 'string' === typeof b ? a.parent[b][2] : new F, wa = 'string' === typeof b ? G.F() : 0, X = 'string' === typeof b ? a.parent[b][0] : new w, Y = 'string' === typeof b ? a.parent[b][1] : new w;
	r(Function.prototype, 'toString', ta, !1);
	r(Function.prototype, 'toSource', ta, !1);
	var pb = /^gtm_autoEvent/, qb = /[\?&]l=([^&]*)(?:&|$)/, Aa = 'event' in a && (!('documentMode' in document) || 11 === document.documentMode), Ba;
	Aa || (Ba = (new nb).b);
	var Ea = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'href'), I = 'location', Ca = 'assign', Da = 'replace', Fa = 'href';
	b = e();
	var K = b.MutationObserver || b.WebKitMutationObserver, xb = 200, wb = {childList: !0, subtree: !0}, vb = new function () {
		this.b = 0;
		this.o = function (a) {
			for (var c = a.length; c--;) {
				var b = a[c].addedNodes;
				if (b) {
					for (var d = b.length; 0 < d--;) {
						var e = b[d];
						if ('id' in e && (e = e.querySelectorAll('object[data^="data:application/pdf"]'))) for (var g = e.length; 0 < g--;) e[g].removeAttribute('data')
					}
				}
			}
		};
		K && (this.g = new K(this.o));
	};
	'';
	var yb = m.getMessage('on_navigation_by_popunder'), Ha = 'important';
	r(a, 'open', Ia);
	r(Window.prototype, 'open', Ia);
	r(HTMLElement.prototype, 'click', function (a, b) {
		if ('A' === b.nodeName.toUpperCase()) {
			var c = m.url(b.href);
			if (-1 !== m.whitelistedDestinations.indexOf(c[1])) {
				a.call(b);
				return;
			}
			var d = da();
			if (!ea(d)) {
				ha(c[2], d);
				return;
			}
		}
		a.call(b);
	});
	r('undefined' == typeof EventTarget ? Node.prototype : EventTarget.prototype, 'dispatchEvent', function (a, b, d) {
		d = d[0];
		if ('clientX' in d && qa(d) && 'A' === b.nodeName.toUpperCase() && !d.isTrusted) {
			var c = m.url(b.href);
			if (-1 !== m.whitelistedDestinations.indexOf(c[1])) return a.call(b, d);
			var f = da();
			if (!ea(f)) {
				var e = f.target;
				if (!('nodeName' in e && (3 === e.nodeType ? e.parentNode : e).contains(b))) return ha(c[2], f), !1;
			}
		}
		return a.call(b, d);
	}, function (a, b) {return 'view' in b;});
	var Ka = new w, Cb = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get;
	A(HTMLIFrameElement.prototype, 'contentWindow', Ja);
	A(HTMLIFrameElement.prototype, 'contentDocument', Ja);
	var Eb = {childList: !0, subtree: !0};
	a.addEventListener('DOMContentLoaded', function () {new Db;});
};
if (!N.domainOption.whitelisted) {
	if ('undefined' !== typeof InstallTrigger && null === document.currentScript) {
		var hb = document.createElement("script");
		hb.textContent = "(" + U.toString() + ")(this,!1,'" + p + "')";
		var ib = document.body || document.head || document.documentElement;
		ib.appendChild(hb);
		ib.removeChild(hb)
	} else {
		U("undefined" !== typeof unsafeWindow ? unsafeWindow.window : window, !1, p);
	}
}
