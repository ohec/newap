'use strict';

(function (e) {
	e.rea = {
		globals: window, extend: function (a) {
			var d = function (a, c) {
				for (var b in a) {
					if (a.hasOwnProperty(b)) {
						if (Object.getOwnPropertyDescriptor(a, b).get) {
							c.__defineGetter__(b, a.__lookupGetter__(b));
						} else {
							var f = a[b], g = typeof f;
							'undefined' != g && (null === f ? c[b] = f : 'object' == g ? (c[b] = c[b] || {}, d(f, c[b])) : 'array' == g ? (c[b] = c[b] || [], d(f, c[b])) : c[b] = f);
						}
					}
				}
			};
			d(a, e.rea);
		},
	};
	e.rea.extend({
		page: {
			reload: function () {
				window.location.reload();
			},
		}, content: {
			onReady: function (a) {
				var d = function () {
					'prerender' !== document.webkitVisibilityState && (document.removeEventListener('webkitvisibilitychange', d, !1), a());
				};
				'prerender' !== document.webkitVisibilityState ? a() : document.addEventListener('webkitvisibilitychange', d, !1);
			},
		}, runtime: function () {
			var a = {};
			a.__defineGetter__('lastError', function () {
				return chrome.runtime.lastError;
			});
			a.__defineGetter__('id', function () {
				return chrome.runtime.id;
			});
			a.__defineGetter__('short_id', function () {
				return a.id.replace(/[^0-9a-zA-Z]/g, '').substr(0, 4);
			});
			return a;
		}(), extension: {
			getURL: function (a) {
				return chrome.runtime.getURL(a);
			}, sendMessage: function (a, d) {
				return chrome.runtime.sendMessage(a, d);
			}, onMessage: {
				addListener: function (a) {
					return chrome.runtime.onMessage.addListener(a);
				},
			}, connect: function (a) {
				return chrome.runtime.connect({name: a});
			},
		},
	});
	e.rea.extend(function () {
		var a = 20, d = '537.33', e = !1, c = !1;
		try {
			e = -1 != navigator.userAgent.search('OPR/'), c = -1 != navigator.userAgent.search('Mac OS X');
		} catch (f) {
		}
		try {
			d = parseInt(navigator.userAgent.match(/AppleWebKit\/([0-9]+\.[0-9]+)/)[1]);
		} catch (f) {
		}
		try {
			a = parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
		} catch (f) {
		}
		var b = {
			CONSTANTS: {
				STORAGE: {
					SCHEMA: '#schema', TYPE: '#storage', CONFIG: '#config', VERSION: '#version', LEGACY_VERSION: 'TM_version', LAST_START: '#laststart', UPDATE: '#update', BEGGING: '#begging',
				}, PREFIX: {
					SCRIPT_UID: '@uid#', COND: '@re#', STORE: '@st#', SCRIPT: '@source#', EXTERNAL: '@ext#', META: '@meta#',
				},
			}, RUNTIME: {
				BROWSER: e ? 'opera' : 'chrome', CHROME: !e, OPERA: e, BROWSER_VERSION: a, WEBKIT_VERSION: d, FAST_EXEC_SUPPORT: !0, DETECT_CONSTRUCTORS_BY_KEYS: 60 <= a, ALLOWS_FILE_SCHEME_ACCESS: null, MAX_SCRIPTS: 1E3, WEBREQUEST_XHR_SUPPORT: !0, WEBREQUETS_WEBSOCKET: 58 <= a, CAN_SAVEAS_ZIP: !0, CONTEXT_MENU: !0, INCOGNITO_MODE: !0,
			}, ACTIONMENU: {COLUMNS: 3, CLOSE_ALLOWED: !0, MIN_DELAY: c ? 150 : 0}, OPTIONPAGE: {CLOSE_ALLOWED: !1}, DB: {USE: null, DEFAULT: 'chromeStorage'}, XMLHTTPREQUEST: {RETRIES: 0, PARTIAL_SIZE: 16777216, COOKIE_PASSTHROUGH: !1}, SCRIPT_DOWNLOAD: {TIMEOUT: 15}, PINGPONG: {RETRIES: 10}, MISC: {TIMEOUT: 1, IDLE_TIMEOUT: 30, DISTURBANCE_ALLOWED: 60}, HTML5: {LOCALSTORAGE: null}, REQUESTS: {
				HAS_SENDER_ID: !0, INTERNAL_PAGE_PROTOCOL: 'chrome-extension:', SENDS_ORIGIN: !0, GET_INTERNAL_PATH_REGEXP: function (a, c) {
					var d = /(\/|\.|\+|\?|\||\(|\)|\[|\]|\{|\}|\\)/g;
					return new RegExp((b.REQUESTS.INTERNAL_PAGE_PROTOCOL + '//' + rea.runtime.id + '/').replace(d, '\\$1') + '([a-zA-Z' + (a ? '\\/' : '') + ']*)' + (c || '').replace(d, '\\$1'));
				}, GET_INTERNAL_PAGE_REGEXP: function () {
					return b.REQUESTS.GET_INTERNAL_PATH_REGEXP(!1, '.html');
				},
			}, OPTIONS: {HAS_CSP: !0, NATIVE_SCRIPT_IMPORT: !0, CAN_DOWNLOAD: !0},
		};
		return {FEATURES: b};
	}());
	
	e.rea = {
		globals: window, extend: function (a) {
			var d = function (a, c) {
				for (var b in a) {
					if (a.hasOwnProperty(b)) {
						if (Object.getOwnPropertyDescriptor(a, b).get) {
							c.__defineGetter__(b, a.__lookupGetter__(b));
						} else {
							var f = a[b], g = typeof f;
							'undefined' != g && (null === f ? c[b] = f : 'object' == g ? (c[b] = c[b] || {}, d(f, c[b])) : 'array' == g ? (c[b] = c[b] || [], d(f, c[b])) : c[b] = f);
						}
					}
				}
			};
			d(a, e.rea);
		},
	};
	e.rea.extend({
		page: {
			reload: function () {
				window.location.reload();
			},
		}, content: {
			onReady: function (a) {
				var d = function () {
					'prerender' !== document.webkitVisibilityState && (document.removeEventListener('webkitvisibilitychange', d, !1), a());
				};
				'prerender' !== document.webkitVisibilityState ? a() : document.addEventListener('webkitvisibilitychange', d, !1);
			},
		}, runtime: function () {
			var a = {};
			a.__defineGetter__('lastError', function () {
				return chrome.runtime.lastError;
			});
			a.__defineGetter__('id', function () {
				return chrome.runtime.id;
			});
			a.__defineGetter__('short_id', function () {
				return a.id.replace(/[^0-9a-zA-Z]/g, '').substr(0, 4);
			});
			return a;
		}(), extension: {
			getURL: function (a) {
				return chrome.runtime.getURL(a);
			}, sendMessage: function (a, d) {
				return chrome.runtime.sendMessage(a, d);
			}, onMessage: {
				addListener: function (a) {
					return chrome.runtime.onMessage.addListener(a);
				},
			}, connect: function (a) {
				return chrome.runtime.connect({name: a});
			},
		},
	});
	e.rea.extend(function () {
		var a = 20, d = '537.33', e = !1, c = !1;
		try {
			e = -1 != navigator.userAgent.search('OPR/'), c = -1 != navigator.userAgent.search('Mac OS X');
		} catch (f) {
		}
		try {
			d = parseInt(navigator.userAgent.match(/AppleWebKit\/([0-9]+\.[0-9]+)/)[1]);
		} catch (f) {
		}
		try {
			a = parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
		} catch (f) {
		}
		var b = {
			CONSTANTS: {
				STORAGE: {
					SCHEMA: '#schema', TYPE: '#storage', CONFIG: '#config', VERSION: '#version', LEGACY_VERSION: 'TM_version', LAST_START: '#laststart', UPDATE: '#update', BEGGING: '#begging',
				}, PREFIX: {
					SCRIPT_UID: '@uid#', COND: '@re#', STORE: '@st#', SCRIPT: '@source#', EXTERNAL: '@ext#', META: '@meta#',
				},
			}, RUNTIME: {
				BROWSER: e ? 'opera' : 'chrome', CHROME: !e, OPERA: e, BROWSER_VERSION: a, WEBKIT_VERSION: d, FAST_EXEC_SUPPORT: !0, DETECT_CONSTRUCTORS_BY_KEYS: 60 <= a, ALLOWS_FILE_SCHEME_ACCESS: null, MAX_SCRIPTS: 1E3, WEBREQUEST_XHR_SUPPORT: !0, WEBREQUETS_WEBSOCKET: 58 <= a, CAN_SAVEAS_ZIP: !0, CONTEXT_MENU: !0, INCOGNITO_MODE: !0,
			}, ACTIONMENU: {COLUMNS: 3, CLOSE_ALLOWED: !0, MIN_DELAY: c ? 150 : 0}, OPTIONPAGE: {CLOSE_ALLOWED: !1}, DB: {USE: null, DEFAULT: 'chromeStorage'}, XMLHTTPREQUEST: {RETRIES: 0, PARTIAL_SIZE: 16777216, COOKIE_PASSTHROUGH: !1}, SCRIPT_DOWNLOAD: {TIMEOUT: 15}, PINGPONG: {RETRIES: 10}, MISC: {TIMEOUT: 1, IDLE_TIMEOUT: 30, DISTURBANCE_ALLOWED: 60}, HTML5: {LOCALSTORAGE: null}, REQUESTS: {
				HAS_SENDER_ID: !0, INTERNAL_PAGE_PROTOCOL: 'chrome-extension:', SENDS_ORIGIN: !0, GET_INTERNAL_PATH_REGEXP: function (a, c) {
					var d = /(\/|\.|\+|\?|\||\(|\)|\[|\]|\{|\}|\\)/g;
					return new RegExp((b.REQUESTS.INTERNAL_PAGE_PROTOCOL + '//' + rea.runtime.id + '/').replace(d, '\\$1') + '([a-zA-Z' + (a ? '\\/' : '') + ']*)' + (c || '').replace(d, '\\$1'));
				}, GET_INTERNAL_PAGE_REGEXP: function () {
					return b.REQUESTS.GET_INTERNAL_PATH_REGEXP(!1, '.html');
				},
			}, OPTIONS: {HAS_CSP: !0, NATIVE_SCRIPT_IMPORT: !0, CAN_DOWNLOAD: !0},
		};
		return {FEATURES: b};
	}());
})(window);

(function (t) {
	if (void 0 !== rea.globals._content) {
		console.warn('content: Stop here, cause a second Tampermonkey instance was detected!\nThis can be caused by using "document.write" at Userscripts.\nSee https://code.google.com/p/chromium/issues/detail?id=253388 for more information');
	} else {
		rea.globals._content = !0;
		var l;
		t.Registry = function () {
			var c = {}, e = [], a = function () {
				e = e.filter(function (a) {
					var d = !1;
					a.r.forEach(function (a) {
						c[a] || (d = !0);
					});
					if (d) return !0;
					a.fn();
				});
			}, b  = function (d, b, m) {
				c[d] = m;
				a();
			}, d  = function (a) {
				a = c[a];
				return a instanceof Function ? a() : a;
			};
			return {
				register: b, registerRaw: b, get: d, getRaw: d, require: function (d, b) {
					e.push({
						r: d, fn: b,
					});
					a();
				},
			};
		}();
		var r                                                                   = function () {
			    var c = function (a) {
				    return ({}.toString.apply(a).match(/\s([a-z|A-Z]+)/) || [null, a && 'INPUT' === a.nodeName ? 'HTMLInputElement' : 'Object'])[1];
			    }, e  = function (a) {
				    if ('Object' == c(a)) {
					    var b = [], d;
					    for (d in a) a.hasOwnProperty(d) && b.push(d + ':' + e(a[d]));
					    return '{' + b.join(',') + '}';
				    }
				    if ('Array' == c(a)) {
					    var k = [];
					    a.forEach(function (a) {
						    k.push(e(a));
					    });
					    return '[' + k.join(',') + ']';
				    }
				    return void 0 === a ? 'undefined' : null === a ? 'null' : 'Function' == c(a) ? a.toString() : '"' + a.toString() + '"';
			    };
			    return {
				    createUUID: function () {
					    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (a) {
						    var b = 16 * Math.random() | 0;
						    return ('x' == a ? b : b & 3 | 8).toString(16);
					    });
				    }, processQueue: function (a) {
					    for (var b; b = a.shift();) b()
				    }, serialize: e, toType: c,
			    };
		    }(), z                                                              = function () {
			    var c = {
				    _content: !0, JSHINT: !0,
			    }, e  = /(webkitStorageInfo|webkitIDB.*|webkitIndexedDB|webkitOfflineAudioContext|webkitAudioContext|webkitURL|webkitSpeech.*|Bluetooth.*|MIDI.*|StorageManager)/;
			    return function () {
				    var a = {}, b, d, k = Object.getOwnPropertyNames(window), g = function (a, d) {
					    for (; (a = Object.getPrototypeOf(a)) && a !== Object.prototype;) d = d.concat(Object.getOwnPropertyNames(a));
					    return d;
				    }(window, []);
				    b = 0;
				    for (d = null; d = g[b]; b++) {
					    c[d] || e.exec(d) || (2 < d.length && 'on' === d.substr(0, 2) ? a[d] = {
						    proto: !0, event: !0,
					    } : a[d] = {
						    proto: !0,
					    });
				    }
				    b = 0;
				    for (d = null; d = k[b]; b++) {
					    c[d] || a[d] || e.exec(d) || (2 < d.length && 'on' === d.substr(0, 2) ? a[d] = {
						    window: !0, event: !0,
					    } : a[d] = {
						    window: !0,
					    });
				    }
				    var m = {
					    addEventListener: {
						    window: 1,
					    }, alert: {
						    window: 1,
					    }, atob: {
						    window: 1,
					    }, blur: {
						    window: 1,
					    }, btoa: {
						    window: 1,
					    }, clearInterval: {
						    window: 1,
					    }, clearTimeout: {
						    window: 1,
					    }, close: {
						    window: 1,
					    }, confirm: {
						    window: 1,
					    }, decodeURI: {
						    window: 1,
					    }, decodeURIComponent: {
						    window: 1,
					    }, dispatchEvent: {
						    window: 1,
					    }, encodeURI: {
						    window: 1,
					    }, encodeURIComponent: {
						    window: 1,
					    }, eval: {
						    window: 1,
					    }, find: {
						    window: 1,
					    }, focus: {
						    window: 1,
					    }, getComputedStyle: {
						    window: 1,
					    }, getSelection: {
						    window: 1,
					    }, isFinite: {
						    window: 1,
					    }, isNaN: {
						    window: 1,
					    }, location: {
						    window: 1,
					    }, open: {
						    window: 1,
					    }, openDialog: {
						    window: 1,
					    }, parseFloat: {
						    window: 1,
					    }, parseInt: {
						    window: 1,
					    }, postMessage: {
						    window: 1,
					    }, print: {
						    window: 1,
					    }, prompt: {
						    window: 1,
					    }, removeEventListener: {
						    window: 1,
					    }, resizeBy: {
						    window: 1,
					    }, resizeTo: {
						    window: 1,
					    }, scroll: {
						    window: 1,
					    }, scrollBy: {
						    window: 1,
					    }, scrollByLines: {
						    window: 1,
					    }, scrollByPages: {
						    window: 1,
					    }, scrollTo: {
						    window: 1,
					    }, setInterval: {
						    window: 1,
					    }, setTimeout: {
						    window: 1,
					    }, stop: {
						    window: 1,
					    },
				    };
				    Object.keys(m).forEach(function (d) {
					    a[d] || (a[d] = m[d]);
				    });
				    return a;
			    };
		    }(), f = r.createUUID(), u = window.self == window.top, x = 0, q, h = function (c) {
			    var e                   = function () {
				    return c.dispatchEvent.apply(c, arguments);
			    }, a                    = function () {
				    return c.addEventListener.apply(c, arguments);
			    }, b                    = function () {
				    return c.removeEventListener.apply(c, arguments);
			    }, d                    = function (a, d) {
				    var b = c.createEvent('MutationEvent');
				    b.initMutationEvent(a, !1, !1, null, null, null, JSON.stringify(d), b.ADDITION);
				    return b;
			    }, k                    = function (a, d) {
				    var b;
				    a && (b = h[a]) && (b(d), delete h[a]);
			    }, g, m, w, f, l = 1, h = {};
			    return {
				    init: function (b) {
					    f || (f = b);
					    w = '2P_' + f;
					    m = '2C_' + f;
					    a(m, function (a) {
						    var b = JSON.parse(a.attrName);
						    'message.response' == b.m ? k(b.r, b.a) : g && g(b, b.r ? function (a) {
							    a = d(w, {
								    m: 'message.response', a: a, r: b.r,
							    });
							    e(a);
						    } : function () {
						    });
					    }, !1);
				    }, send: function (a, b, c) {
					    if (c) {
						    var g = ++l;
						    h[l] = c;
						    c = g;
					    } else {
						    c = null;
					    }
					    a = d(w, {
						    m: a, a: b, r: c,
					    });
					    e(a);
				    }, onMessage: {
					    addListener: function (a) {
						    g = a;
					    },
				    }, cleanup: function () {
					    b(m, g, !1);
				    },
			    };
		    }(document), y                                                      = function () {
			    var c = {}, e, a = function (a) {
				    var d = [], k = [], g = function () {
					    m = k = d = null;
					    delete c[a];
				    }, m                  = {
					    postMessage: function (d) {
						    h.send('port.message', {
							    response_id: a, value: d,
						    });
					    }, onMessage: {
						    addListener: function (a) {
							    d.push(a);
						    },
					    }, onDisconnect: {
						    addListener: function (a) {
							    k.push(a);
						    },
					    }, disconnect: function () {
						    h.send('port.message', {
							    response_id: a, disconnect: !0,
						    });
						    g();
					    },
				    };
				    c[a] = {
					    message: function (a) {
						    d && d.forEach(function (d) {
							    d(a);
						    });
					    }, disconnect: function (a) {
						    k && k.forEach(function (d) {
							    d(a);
						    });
						    g();
					    },
				    };
				    return m;
			    };
			    return {
				    message: function (b) {
					    var d;
					    b.connect ? e && e(b.destination, a(b.response_id)) : (d = c[b.response_id]) ? b.disconnect ? d.disconnect() : d.message(b.value) : l && console.warn('ports: unkown id', b.response_id, b);
				    }, connect: function (b) {
					    var d = r.createUUID();
					    h.send('port.message', {
						    response_id: d, connect: !0, destination: b,
					    });
					    return a(d);
				    }, onConnect: {
					    addListener: function (a) {
						    e = a;
					    },
				    },
			    };
		    }(), n                                                              = function () {
			    var c, e, a = [], b = [], dom = function () {
				    l && console.log('content: detected DOMContentLoaded ' + f);
				    e = !0;
				    window.removeEventListener('DOMContentLoaded', dom, !1);
				    dom = null;
				    r.processQueue(a);
			    }, loadEventListenerFunction  = function () {
				    l && console.log('content: detected load ' + f);
				    c = e = !0;
				    g.cleanup();
				    r.processQueue(b);
			    };
			    window.addEventListener('DOMContentLoaded', dom, !1);
			    window.addEventListener('load', loadEventListenerFunction, !1);
			    var g = {
				    registerDomListener: function (d) {
					    e || c ? d() : a.push(d);
				    }, registerPageListener: function (a) {
					    c ? a() : b.push(a);
				    }, forcedLoad: function () {
					    c || e || !loadEventListenerFunction || (l && console.log('content: use forced load ' + f), loadEventListenerFunction(!0));
				    }, seen: function () {
					    var a = {};
					    a.__defineGetter__('load', function () {
						    return c;
					    });
					    a.__defineGetter__('DOMContentLoaded', function () {
						    return e;
					    });
					    return a;
				    }(), cleanup: function () {
					    dom && (window.removeEventListener('DOMContentLoaded', dom, !1), dom = null);
					    loadEventListenerFunction && (window.removeEventListener('load', loadEventListenerFunction, !1), loadEventListenerFunction = null);
				    },
			    };
			    return g;
		    }(), p                                                              = function () {
			    return {
				    init: function (c) {
					    q.inject('(' + q.backup + ')(window, document,"' + c + '",' + l + ');\n');
				    }, cleanup: function () {
					    h.send('cleanup');
				    }, next: function (c, e, a) {
					    var b = {
						    short_id: rea.runtime.short_id,
					    };
					    'inIncognitoContext downloadMode enforce_strict_mode measure_scripts version external_connect statistics'.split(' ').forEach(function (a) {
						    b[a] = c[a];
					    });
					    b.sandbox_allow_getters = !0;
					    b.detect_constructors_by_keys = rea.FEATURES.RUNTIME.DETECT_CONSTRUCTORS_BY_KEYS;
					    l && (n.seen.load ? console.log('content: Start ENV with page loaded ' + f) : n.seen.DOMContentLoaded ? console.log('content: Start ENV with DOMContentLoaded ' + f) : console.log('content: Start ENV normally ' + f));
					    var d = c.scripts.map(function (a) {
						    return {
							    header: a.header, storage: a.storage, script: a.script, requires: a.requires, code: a.code,
						    };
					    });
					    e = q.next(f, JSON.stringify(d), r.serialize(e), JSON.stringify(a), JSON.stringify(b), JSON.stringify({}), x, void 0, void 0, void 0, void 0, l, n.seen.load, n.seen.DOMContentLoaded, q.environment);
					    h.send('next', {
						    src: e,
					    });
				    },
			    };
		    }(),
		
		    v                                                                   = function () {
			    var c = {
				    registerMenuCommand: function (a) {
					    var b = rea.extension.connect('registerMenuCommand');
					    b.onMessage.addListener(function (d) {
						    d.run && null !== b && a.postMessage('run');
					    });
					    b.onDisconnect.addListener(function () {
						    a.disconnect();
					    });
					    a.onMessage.addListener(function (a) {
						    if ('register' === a.method) {
							    var c = a.name;
							    b.postMessage({
								    method: 'registerMenuCommand', name: c, id: f, menuId: f + '#' + c, accessKey: a.accessKey,
							    });
						    }
					    });
					    a.onDisconnect.addListener(function () {
						    b.disconnect();
					    });
				    }, openInTab: function (a) {
					    var b = rea.extension.connect('openInTab');
					    b.onMessage.addListener(function (d) {
						    a.postMessage(d);
					    });
					    b.onDisconnect.addListener(function () {
						    a.disconnect();
					    });
					    a.onMessage.addListener(function (a) {
						    if ('openTab' == a.method) {
							    var c = a.url, g = a.options;
							    if ('boolean' === typeof g || void 0 === g) {
								    g = {
									    loadInBackground: g,
								    };
							    }
							    a = void 0 === g.active ? void 0 === g.loadInBackground ? !1 : !g.loadInBackground : g.active;
							    g = void 0 === g.insert ? !0 : g.insert;
							    c && 0 === c.search(/^\/\//) && (c = location.protocol + c);
							    b.postMessage({
								    method: 'openInTab', details: {
									    url: c, options: {
										    active: !!a, insert: !!g,
									    },
								    },
							    });
						    } else {
							    'nameTab' == a.method ? b.postMessage({
								    method: 'nameTab', name: a.name,
							    }) : 'closeTab' == a.method && b.postMessage({
								    method: 'closeTab',
							    });
						    }
					    });
					    a.onDisconnect.addListener(function () {
						    b.disconnect();
					    });
				    }, download: function (a) {
					    var b = rea.extension.connect('download');
					    b.onMessage.addListener(function (d) {
						    a.postMessage(d);
					    });
					    b.onDisconnect.addListener(function () {
						    a.disconnect();
					    });
					    a.onMessage.addListener(function (a) {
						    a = a.details;
						    a.url && '/' === a.url[0] && (a.url = location.origin + a.url);
						    b.postMessage({
							    method: 'download', details: a, id: f,
						    });
					    });
					    a.onDisconnect.addListener(function () {
						    b.disconnect();
					    });
				    }, webRequest: function (a) {
					    var b = rea.extension.connect('webRequest');
					    b.onMessage.addListener(function (b) {
						    a.postMessage(b);
					    });
					    b.onDisconnect.addListener(function () {
						    a.disconnect();
					    });
					    a.onMessage.addListener(function (a) {
						    b.postMessage({
							    method: 'webRequest', rules: a.rules, uuid: a.uuid,
						    });
					    });
					    a.onDisconnect.addListener(function () {
						    b.disconnect();
					    });
				    }, xhr: function (a) {
					    var b = rea.extension.connect('xhr');
					    b.onMessage.addListener(function (b) {
						    a.postMessage(b);
					    });
					    b.onDisconnect.addListener(function () {
						    a.disconnect();
					    });
					    a.onMessage.addListener(function (a) {
						    b.postMessage(a);
					    });
					    a.onDisconnect.addListener(function () {
						    b.disconnect();
					    });
				    }, values: function (a) {
					    var b = rea.extension.connect('values');
					    b.onMessage.addListener(function (b) {
						    a.postMessage(b);
					    });
					    b.onDisconnect.addListener(function () {
						    a.disconnect();
					    });
					    a.onMessage.addListener(function (a) {
						    b.postMessage(a);
					    });
					    a.onDisconnect.addListener(function () {
						    b.disconnect();
					    });
				    },
			    }, e  = {
				    setClipboard: function (a, b) {
					    var d = a.content, c = a.info, g = typeof c, e, f;
					    'object' === g ? (c.type && (e = c.type), c.mimetype && (f = c.mimetype)) : 'string' === g && (e = c);
					    var h = function (a) {
						    document.removeEventListener('copy', h, !0);
						    a.stopImmediatePropagation();
						    a.preventDefault();
						    a.clipboardData.setData(f || ('html' == e ? 'text/html' : 'text/plain'), d);
					    };
					    document.addEventListener('copy', h, !0);
					    document.execCommand('copy');
					    b();
				    }, notification: function (a, b) {
					    a.method = 'notification';
					    rea.extension.sendMessage(a, b);
				    }, syntaxCheck: function (a, b) {
					    a.method = 'syntaxCheck';
					    rea.extension.sendMessage(a, b);
				    }, closeTab: function (a, b) {
					    rea.extension.sendMessage({
						    method: 'closeTab', id: f,
					    }, function (a) {
						    a.error && console.warn(a.error);
						    b();
					    });
				    }, focusTab: function (a, b) {
					    rea.extension.sendMessage({
						    method: 'focusTab', id: f,
					    }, function (a) {
						    a.error && console.warn(a.error);
						    b();
					    });
				    }, addStyle: function (a, b) {
					    try {
						    var d = document.createElement('style');
						    d.textContent = a.css || '';
						    a.id && d.setAttribute('id', a.id);
						    (document.head || document.body || document.documentElement || document).appendChild(d);
						    b();
					    } catch (c) {
						    console.warn('content: error adding style', c);
					    }
				    }, tabsSet: function (a, b) {
					    a.method = 'setTab';
					    rea.extension.sendMessage(a, function () {
						    b();
					    });
				    }, tabsGet: function (a, b) {
					    a.method = 'getTab';
					    rea.extension.sendMessage(a, function (a) {
						    b(a.data);
					    });
				    }, tabsGetAll: function (a, b) {
					    a.method = 'getTabs';
					    rea.extension.sendMessage(a, function (a) {
						    b(a.data);
					    });
				    }, api: function (a) {
					    a.method = 'api';
					    rea.extension.sendMessage(a, function () {
					    });
				    },
			    };
			    return {
				    init: function () {
				    }, getApi: function () {
					    var a = {};
					    [e, c].forEach(function (b) {
						    Object.keys(b).map(function (c) {
							    a['GM_' + c] = b[c];
						    });
					    });
					    return a;
				    }, processMessage: function (a, b, c) {
					    if (a = e[a]) return a(b, c);
					    c();
				    }, processConnect: function (a, b) {
					    var d;
					    if (d = c[a]) return d(b);
				    },
			    };
		    }();
		rea.extension.onMessage.addListener(function (c, e, a) {
			c.id && c.id != f ? console.warn('content: Not for me! ' + f.substr(0, 10) + '!=' + c.id) : 'executeScript' == c.method ? c.url && 0 !== window.location.href.search(c.url) ? l && console.log('exec: URL doesn\'t match', window.location, c) : c.topframe && !u ? l && console.log('exec: topframe doesn\'t match', window.self, c) : h.send('executeScript', c) : 'onLoad' == c.method ? (document.readyState && 'complete' !== document.readyState || n.forcedLoad(), a({})) : u && ('loadUrl' == c.method ? (window.location = c.url, a({})) : 'reload' == c.method ? (window.location.reload(), a({})) : 'confirm' == c.method ? window.setTimeout(function () {
				var b = window.confirm(c.msg);
				a({
					confirm: b,
				});
			}, 100) : 'showMsg' == c.method ? window.setTimeout(function () {
				window.setTimeout(function () {
					window.alert(c.msg);
				}, 1);
				a({});
			}, 100) : 'setForeignAttr' == c.method ? (h.send(c.method, c), a({})) : window.console.log('content: unknown method ' + c.method));
		});
		y.onConnect.addListener(function (c, e) {
			v.processConnect(c, e);
		});
		h.onMessage.addListener(function (c, e) {
			if ('document.write' == c.m) {
				var a = document.documentElement;
				window.setTimeout(function () {
					a !== document.documentElement && h.init();
				}, 0);
			} else {
				'port.message' == c.m ? y.message(c.a) : 'csp' == c.m ? q.inject('window["' + c.a.id + '"] = function() { ' + c.a.src + ' };\n') : 'external.message' == c.m ? rea.extension.sendMessage({
					method: 'externalMessage', request: c.a,
				}, function (a) {
					e(a);
				}) : v.processMessage(c.m, c.a, e);
			}
		});
		Registry.require(['page.js'], function () {
			q = Registry.getRaw('page.js');
			var c = !1, e = function (a, b, d) {
				var e = 1, h = function () {
					l && console.debug('content: send "prepare" message');
					rea.extension.sendMessage({
						method: 'prepare', id: f, topframe: u, url: window.location.href,
					}, function (f) {
						c || (f ? (c = !0, f.contexters || f.scripts && f.scripts.length || f.external_connect ? (d && d(), b(f)) : (p.cleanup(), a())) : (l && console.debug('content: _early_ execution, connection to bg failed -> retry!'), window.setTimeout(h, e), e *= 2));
					});
				};
				rea.content.onReady(h);
			}, a  = location.pathname + location.search, b = 'TM_' + rea.runtime.short_id + window.btoa(a.length + a).substr(0, 255).replace(/[#=\/]/g, '_'), d = function () {
				var a, c, d, e = document.cookie.split(';');
				for (a = 0; a < e.length; a++) {
					if (c = e[a].substr(0, e[a].indexOf('=')), d = e[a].substr(e[a].indexOf('=') + 1), c = c.replace(/^\s+|\s+$/g, ''), 0 === c.indexOf(b) && (document.cookie = c + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;', c = window.decodeURIComponent(d), 0 === c.indexOf('blob:') && (d = new XMLHttpRequest, d.open('GET', c, !1), d.send(null), 200 === d.status || 0 === d.status))) {
						try {
							return JSON.parse(d.responseText);
						} catch (f) {
							console.warn('content: unable to decode' + d.responseText);
						}
					}
				}
			}, k  = 'text/xml' == document.contentType;
			(function (a, b, c) {
				k ? window.setTimeout(function () {
					a(b, c);
				}, 1) : a(b, c);
			})(function (a, b) {
				l && console.log('content: Started (' + f + ', ' + window.location.origin + window.location.pathname + ')', t.tm_info);
				var c;
				rea.FEATURES.RUNTIME.FAST_EXEC_SUPPORT && (c = d()) || (c = t.tm_info) ? (delete t.tm_info, c.contexters || c.scripts && c.scripts.length || c.external_connect ? (p.init(f), h.init(f), b(c, 'sync')) : a(), rea.FEATURES.RUNTIME.FAST_EXEC_SUPPORT && rea.extension.sendMessage({
					method: 'prepare', url: window.location.href, cleanup: !0,
				}, function () {
				})) : k ? e(a, b, function () {
					p.init(f);
					h.init(f);
				}) : (p.init(f), h.init(f), e(a, b));
			}, function () {
				l && console.log('content: disable event processing for ' + f);
				n.cleanup();
				p.cleanup();
				h.cleanup();
			}, function (a, b) {
				x = a.logLevel;
				l |= 60 <= x;
				n.registerDomListener(function () {
					h.send('DOMContentLoaded');
				});
				n.registerPageListener(function () {
					h.send('load');
				});
				l && console.log('content: ' + (b || 'normal') + ' start event processing for ' + f + ' (' + a.scripts.length + ' to run)');
				v.init(a.scripts);
				p.next(a, v.getApi(), z());
				u || window.addEventListener('unload', function () {
					rea.extension.sendMessage({
						method: 'unLoad', id: f, topframe: !1, url: window.location.href,
					}, function () {
					});
					n.cleanup();
					p.cleanup();
					h.cleanup();
				}, !1);
			});
		});
	}
})(window);
