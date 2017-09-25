// ==UserScript==
// @name          Book Burro - Remixing the bookstore
// @namespace     http://overstimulate.com/userscripts/
// @description   Find the cheapest books
// @include       http://amazon.com/*
// @include       http://www.amazon.com/*
// @include       http://www.powells.com/*
// @include       http://half.ebay.com/*
// @include       http://buy.com/*
// @include       http://www.buy.com/*
// @include       http://search.barnesandnoble.com/*
// @include       http://barnesandnoble.com/*
// @include       http://www.barnesandnoble.com/*
// @exclude       
// ==/UserScript==

// based on code by Jesse Andrews and Britt Selvitelle
// and included here with their gracious permission

// Change these as desired
var amazon_associate_code = 'anotherjesse-20';
var amazon_dev_key = '0XYJJ825QSB9Q7F2XN02';
var bn_associate_code = '41456445';
var half_associate_code = '1698206-1932276';

function checkISBN( isbn ) {
    try {
	isbn=isbn.toLowerCase().replace(/-/g,'').replace(/ /g,'');
	if (isbn.length != 10) return false;
	var checksum = 0;
	for (var i=0; i<9; i++) {
	    if (isbn[i] == 'x') {
		checksum += 10 * (i+1);
	    } else {
		checksum += isbn[i] * (i+1);
	    }
	}
	checksum = checksum % 11;
	if (checksum == 10) checksum = 'x';
	if (isbn[9] == checksum)
	    return isbn;
	else
	    return false;
    } catch (e) { return false; }
}

function dom_createLink(url, txt, title) {
    var a  = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("style", "color: #00a; text-decoration: none; " +
        "font-weight: bold");
    if (title) a.setAttribute("title", title);
    a.appendChild(document.createTextNode(txt));
    return a;
}

function add_site(url, title, loc_id ) {
    var a  = dom_createLink( url, title, title + ' Search');
    var b  = document.createElement("b");
    b.innerHTML = 'fetching';
    b.setAttribute("id", loc_id);
    
    var tr = document.createElement("tr");
    var td_left = document.createElement("td");
    var td_right = document.createElement("td");
    td_left.appendChild(a);
    td_right.appendChild(b);
    td_right.setAttribute("align", "right");
    tr.appendChild(td_left);
    tr.appendChild(td_right);
    return tr;
}

function str2xml(strXML) {
    //create a DOMParser
    var objDOMParser = new DOMParser();
    //create new document from string
    var objDoc = objDOMParser.parseFromString(strXML, "text/xml");
    return objDoc; 
} 

function int2money( cents )  {
    var money = "$"
	if (cents< 100) {
	    money = money + '0.';
	} else {
	    money = money + Math.floor(cents/100) + '.';
	}
    cents = cents % 100;
    if (cents < 10)
	money = money + '0';
    money = money + cents;
    return money;
}

function run_queries(isbn) {
    var errmsg = 'Either there are no books available,\\' +
	'or there is a parsing error because of\\n' +
        'some change to their website.\\n\\n' +
        'Not everyone has a nice webservice like Amazon'; 

    ////// AJAX for BN.com /////

    GM_xmlhttpRequest({method:"POST",
        url:'http://search.barnesandnoble.com/booksearch/isbninquiry.asp?' +
            'isbn='+isbn,
        data:"",
        onload:function(result) {
	    try {
		document.getElementById('burro_bn').innerHTML = 
                    result.responseText.match(
                        'priceRightBNPrice[^>]*>\([^<]*\)</')[1];
	    } catch (e) {
		document.getElementById('burro_bn').parentNode.innerHTML = 
                    '<a href="javascript: alert(\''+errmsg+'\');">none</a>';
	    }
        }
    });

    ////// AJAX for Buy.com /////

    GM_xmlhttpRequest({method:"POST",
        url:'http://www.buy.com/retail/GlobalSearchAction.asp?qu='+
            isbn, data:"",
        onload:function(result) {
            try {
		document.getElementById('burro_buy').innerHTML =
                    result.responseText.match(
                        'productPrice[^>]*>\([^<]*\)</')[1]; 
	    } catch (e) {
		document.getElementById('burro_buy').parentNode.innerHTML = 
                    '<a href="javascript: alert(\''+errmsg+'\');">none</a>';
	    }
        }
    });

    ////// AJAX for half.com /////
    GM_xmlhttpRequest({method:"POST",
        url:'http://half.ebay.com/search/search.jsp?' +
            'product=books:isbn&query='+isbn, data:"",
        onload:function(result) {
            try {
		document.getElementById('burro_half').innerHTML =
                    result.responseText.match(
                        'Best[^P]*Price[^\$]*\([^<]*\)<')[1];
	    } catch (e) {
		document.getElementById('burro_half').parentNode.innerHTML =
                    '<a href="javascript: alert(\''+errmsg+'\');">none</a>';
	    }
        }
    });

    ////// AJAX for amazon.com /////
    GM_xmlhttpRequest({method:"POST",
         url:'http://xml.amazon.com/onca/xml3?t=' + amazon_associate_code + 
             '&dev-t=' + amazon_dev_key +
             '&type=lite&f=xml&mode=books&AsinSearch='+isbn, data:"",
         onload:function(result) {
             var x = str2xml( result.responseText );
	     var ourprices = x.getElementsByTagName('OurPrice');
	     if (ourprices.length == 0) {
		 document.getElementById('burro_amazon').parentNode.innerHTML =
                     '<a href="javascript: alert(\''+errmsg+'\');">none</a>';
	     } else {
		 document.getElementById('burro_amazon').innerHTML =
                     ourprices[0].childNodes[0].nodeValue;
	     }
	     var usedprices = x.getElementsByTagName('UsedPrice');
	     if (usedprices.length == 0) {
		 var elmMarket = document.getElementById('burro_amazonmarket');
		 elmMarket.parentNode.innerHTML =
                     '<a href="javascript: alert(\''+errmsg+'\');">none</a>';
	     } else {
		 document.getElementById('burro_amazonmarket').innerHTML =
                     usedprices[0].childNodes[0].nodeValue;
	     }
        }
    });
    var msg = 'We want to check with them regarding the traffic of querying '+
        'for prices from their site on every click...';
    document.getElementById('burro_powell').parentNode.innerHTML =
        '<a href="javascript: alert(\''+msg+'\');">(info)</a>';
}


function burro( location, isbn ) {
    var elmWrapper = document.createElement("div");
    elmWrapper.setAttribute("title","Click triangle to expand/collapse");
    elmWrapper.setAttribute("style",'position:fixed;z-index:99;top:15px;' +
        'left:15px;background-color:#ffc;border:1px solid orange;' +
        'padding:4px;text-align:left;opacity:.85;font:8pt sans-serif;' +
        'overflow:hidden;width:200px;height:15px;margin-bottom:15px;');
    var elmCaret = document.createElement("img");
    elmCaret.setAttribute("style", "top:-10px");
    elmCaret.setAttribute("src", 'data:image/png;base64,iVBORw0KGgoAAA' +
        'ANSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gvaeTAAAAC' +
        'XBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QQYCR020Q08hgAAAB10RVh0' +
        'Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJTVDvZCVuAAAAiklEQVQY07X' +
        'PIQoCURSF4e8NAzYxGicNuAa1WlyCO3AlZnfiNgwahQFxikkcBIsGfaZpzg' +
        'ODJ/4c/nMvPyR8g7EsephgH6q6aXnWIelhjkUsi0EL88TqFUfMYlnscMoS5' +
        'wUccMYS4yxhfuGNPho88oQ5xxQjrHHpKkcMccMqVPU99eATG2zb4n/zAS4O' +
        'HrV1hIB/AAAAAElFTkSuQmCC');
    elmCaret.setAttribute("id", "hide_show_elmCaret");
    elmWrapper.appendChild( elmCaret );
    var elmTitle = document.createElement("img");
    elmTitle.setAttribute("style", "padding-left:6px");
    elmTitle.setAttribute("src", 'data:image/gif;base64,R0lGODlheAAO' +
        'AOYAAAAAAOmUUUOGfx1eVj8/M1ijnqBhLrmFVv//zNi6oCUIAO/vwJqEbGk' +
        '4EL+/mm9vWZmZmVpaWvfAl7ydiC8vJo+PcwAPCaJtSylNS////4tCC9/fs0' +
        'MeAa+vjefy9LR1QpnMzH9/Zny3s7WIazttbG5MMVyVj09PQJ+fgMvO11UwE' +
        'wMWGq10R5K6ugg2Nh8fGdiecOaxhdiKTAAACZlqPnWtqu/dxTxlYXNeS1o6' +
        'IU8rEZqytlp2d4p4bDZ/dn+Eh4pWL2JNOFKLhf/frtusjtGFS750N8ulfo1' +
        'qVM/Ppm2HhsSQa615UvSlYy5HS9rb1hAEDqdvPjgpJg8PDP/vx4S2s6toMz' +
        'RERKmlmrS8vkFfXwAhHnI7Ek06K+3x8D92c6/M0DNmZk5nb4xNGr+8s9uNT' +
        '8x9OysRAtSniJWOlq6GYwAICZGtsP+4dGVCLkaVj4GpqF9fTMuLW8q/ra1r' +
        'OV1UTXpKJmaZmb+SabGzstWXZEtMTmg9G4RZN4rFwVZeYSH5BAUUAAgALAA' +
        'AAAB4AA4AAAf/gAiCg4MzM4SIgyo5hGcKj1JTiZOUlZaXmJmagmtrPEprlR' +
        'N9TA0ICjpIaiMjSEhdm7Gys7SInXd3JiQ3oZN8Bx9jXGpoaEtLFzRumkkEK' +
        'LTNz4nRtbWGbHBVJttCJBaTDQYaYzASSzAHQCxEmw4AIbTu8Iny1bMzWTtw' +
        'cH4Fbz4DBHhLZGfMmCJy5NCwY0qWuwdxCHQYVIHAiYmCkkR8sABBvQ4hkgx' +
        '6GBFjCGknPYYkUCGEgwcnNix4QCCOyEsrVoBpUUOEvwIAw4T5RkjFmA8faP' +
        'DhU8sdgAcUADhA8ODpCQATN0yhEGKrx3coAMQh5BSqVAQACAhKiyAEgCnv/' +
        '94CAICAwpQQdjdcmiFmRQuf/nwICDMAA4ZeCLrouBClMR8VJUrMcjd2A4CY' +
        'lwVNeYEgDgCRFQCgcHdVLVmxCCyfQGuardvVaD8jCFsBQRLUllY40eICRA0' +
        'BwL8I7ZRhUA8VNAx8sIOGSoISy2LVYz2dAF3rguQ5xT3y3Vq1bFm3PSt+/N' +
        'TyliyIwbAFhB+BJIinKC5oAh8WBqzAoEKFA5ISONTxRwqZPITAApfdNhYCL' +
        '0hylV60uUNBVedl99SBmYXnGnnhhfaMapmsgYEY7bWwxRoZZJBCGlAMMgEQ' +
        'dMhghR5DxKAADWokYMMTWeyBiTtTdODZM3Z1EBo8HYjlgL9dC8izwBSmWRj' +
        'kkAhMMeWG54WnFQUOeFbhJWtoocWJHqj4gyGE6MBCGQHIUIQZetBwAB5qBE' +
        'GGF3n8KNYLFx541RQPDIICnxSIVE9Y0nwVB5+BzgbXCRSo5VaWUSYR1QuJh' +
        'niFBRlkAQEAiA1yBgtFtNGEEUbQYUAUeKDBABYZPBGBPbTWWs1cP4BKyRk0' +
        '6NFEAKdawUIUTBBhgxfI+mjrssxiMpclXdhBRxlmmJEUDTQckcAcXnjwRKP' +
        'NhltrIAA7');
    elmWrapper.appendChild( elmTitle );
    var elmCloseBox = document.createElement("img");
    elmCloseBox.setAttribute("src", 'data:image/png;base64,iVBORw0KG' +
        'goAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABmJLR0QA/wD/AP+gvaeT' +
        'AAAACXBIWXMAAAuJAAALiQE3ycutAAAAB3RJTUUH1QQYCDcSg6d+SAAAAPB' +
        'JREFUKM+Fkr1qAkEURs9dnWBrJT5IHkEw4gtEsBQs/AlpkiKlJGnEJlqIjR' +
        'brPoAQYhPio1hGsPAHFoW5KSIxo7J7qvlgDty534j6Rolgt987OQnA7XuEs' +
        'TuegwIeMYiIkx2hVnsjCL7+su9/0mz2Lox0oNOpUiw+kc2mUVWGww8mkxYi' +
        'YK09F4xJMho9kMs9IiJMpy8Y83vFWkUTCVcAWCxWLJcrRIT1OiSTOczuCXi' +
        'eK2y3IeXyK4PBPZtNSKn0zGzWJpW6uvyGer1LpVIgn78GYD7/ptHo0e/fHb' +
        'emvtHIHv4zvonv4ayXuK9xyg8qt0tfe9qKPAAAAABJRU5ErkJggg==');
    elmCloseBox.setAttribute("style", 'position:absolute;left:190px;' +
        'top:3px;margin:2px;width:12px;height:12px;background-color:' +
        '#ffb;border:none;line-height:8px;text-align:center;');
    elmCloseBox.setAttribute("title","Click To Remove");
    elmCloseBox.addEventListener('click', function() {
        this.parentNode.style.display = "none";
    }, true);
    elmWrapper.appendChild(elmCloseBox);
    var elmAbout = document.createElement("a");
    var elmAboutImg = document.createElement("img");
    elmAboutImg.setAttribute("border", "0");
    elmAboutImg.setAttribute("src", 'data:image/png;base64,iVBORw0KG' +
        'goAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAABmJLR0QA/wD/AP+gvaeT' +
        'AAAACXBIWXMAAAuJAAALiQE3ycutAAAAB3RJTUUH1QQYCDkprC+64gAAAOd' +
        'JREFUKM+FkrFOAkEURc9ddrJZCgsqCwtCIiUFJa2df2CwNXRS8AmGisLEaG' +
        'Gs3VhTYDUtxZaED/AriGHjPhuEDC5wq3l5czL3vjeyzBlHtC6KoI4BuPk8Q' +
        'qx3549rov3+YPBIp3NHq3VLlnkkBf0AWK2+6fevWCze8H7CaPRKUfzgnKsG' +
        '0jSh272kLEuWyy/a7QvSNKnIsJEk6vWE2SxnPH5nOn3YWopjh9VqIbDBGA5' +
        'fyPNnGo2znZVIEEWhJTNDgmbzfHvZzA6H/pP3k3/TqQQkIYle7z6oT74wnz' +
        '8d3KNOfY19/QKFiTrWqbiPtAAAAABJRU5ErkJggg==');
    elmAbout.appendChild(elmAboutImg);
    elmAbout.setAttribute("style", 'position:absolute;left:175px;top' +
        ':3px;margin:2px;width:12px;height:12px;background-color:#ff' +
        'b;border:none;line-height:12px;text-align:center;text-decor' +
        'ation:none;');
    elmAbout.setAttribute("title","OverStimulate");
    elmAbout.setAttribute("href", 'http://overstimulate.com/articles' +
        '/2005/04/24/greasemonkey-book-burro-find-cheap-books');
    elmWrapper.appendChild(elmAbout);
    var elmContent = document.createElement("table");
    elmContent.setAttribute("style", 'padding:0 5px;width:100%;font:' +
        '10pt sans-serif;');
    elmContent.appendChild( add_site('http://www.amazon.com/exec/obi' +
        'dos/ASIN/' + isbn + "/" + amazon_associate_code, "Amazon", 
        "burro_amazon" ));
    elmContent.appendChild( add_site("http://www.amazon.com/exec/obi" +
        "dos/redirect?tag="+amazon_associate_code+
        "&path=tg/stores/offering/list/-/"+isbn+"/all/", 
        "Amazon (used)", "burro_amazonmarket" ));
    elmContent.appendChild( add_site( 'http://service.bfast.com/bfas' +
        't/click?bfmid=2181&sourceid=' + bn_associate_code +'&bfpid=' +
        isbn + '&bfmtype=book', "Barnes & Noble", "burro_bn"));
    elmContent.appendChild( add_site("http://www.buy.com/retail/Glob" +
        "alSearchAction.asp?qu=" + isbn, "Buy.com", "burro_buy"));
    elmContent.appendChild( add_site( 'http://www.tkqlhce.com/click-' +
        half_associate_code+'?ISBN=' + isbn, 'Half.com', 'burro_half' ));
    elmContent.appendChild( add_site('http://www.powells.com/cgi-bin' +
        '/biblio?isbn=' + isbn, "Powell's Books", "burro_powell"));
    elmWrapper.appendChild(elmContent);
    elmWrapper.addEventListener('click', function() { 
	var elmCaret = document.getElementById('hide_show_elmCaret');
	if (this.style.height != "auto") {
	    if (this.style.height == "15px") {
		run_queries( isbn );
	    }
	    this.style.height = "auto";
	    elmCaret["src"] = 'data:image/png;base64,iVBORw0KGgoAAAA' +
		'NSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gva' +
		'eTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QQYCRoeq' +
		'/kCuwAAAB10RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJ' +
		'TVDvZCVuAAAAmElEQVQY083QMUoDARSE4W92U2xhkxSpAgY0AXM' +
		'Q29zCM3iSXEXQTrCws44Im85CkO1jnq2KKQWnGxiY+Yd/oXw1tT' +
		'rr7D86CYdD5Xk3HA8vTi8la7xW1T5Jg8IEN6PvPXnEAkOa5l5Vi' +
		'wuc4yk/d9VyfoLrqnpIMmCGu2z79/wGUsv5FFcYY5Nt/wKjI+Bv' +
		'uEWnbfu///kTargo75QVC5oAAAAASUVORK5CYII=';
	} else {
	    elmCaret["src"] = 'data:image/png;base64,iVBORw0KGgoAAAA' +
	        'NSUhEUgAAAAsAAAALCAYAAACprHcmAAAABmJLR0QA/wD/AP+gva' +
	        'eTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH1QQYCR020' +
	        'Q08hgAAAB10RVh0Q29tbWVudABDcmVhdGVkIHdpdGggVGhlIEdJ' +
	        'TVDvZCVuAAAAiklEQVQY07XPIQoCURSF4e8NAzYxGicNuAa1Wly' +
	        'CO3AlZnfiNgwahQFxikkcBIsGfaZpzgODJ/4c/nMvPyR8g7Esep' +
	        'hgH6q6aXnWIelhjkUsi0EL88TqFUfMYlnscMoS5wUccMYS4yxhf' +
	        'uGNPho88oQ5xxQjrHHpKkcMccMqVPU99eATG2zb4n/zAS4OHrV1' +
	        'hIB/AAAAAElFTkSuQmCC';
	    this.style.height = "14px";
	}
    }, true);
    document.getElementsByTagName("body")[0].appendChild(elmWrapper);
}

if (document.location.href.match('amazon.com') && 
    !document.location.href.match('rate-this')) {
    isbn = checkISBN(
        document.location.href.match(/\/([0-9X]{10})(\/|\?|$)/)[1]);
    if (isbn) burro( 'amazon', isbn );
}

if (document.location.href.match('barnesandnoble.com')) {
    isbn = checkISBN( document.location.href.match(
        /[iI][sS][Bb][Nn]=([0-9X]{10})(\&|\?|$)/)[1] );
    if (isbn) burro( 'bn', isbn );
}

if (document.location.href.match('buy.com')) {
    var isbn = checkISBN(
        document.title.match(/ISBN ([0-9X]{10})/)[1] );
    if (isbn) burro( 'buy', isbn );
}

if (document.location.href.match('powells.com')) {
    var arBold = document.getElementsByTagName('b');
    for (var i=0; i<arBold.length; i++) {
	if (arBold[i].innerHTML.match('ISBN:')) {
	    isbn = checkISBN(arBold[i].nextSibling.nextSibling.text);
	    if (isbn) burro( 'powells', isbn );
	}
    }
}

if (document.location.href.match('half.ebay.com')) {
    var arBold = document.getElementsByTagName('b');
    for (var i=0; i<arBold.length; i++) {
	if (arBold[i].innerHTML.match('ISBN:')) {
	    isbn = checkISBN(arBold[i].nextSibling.text);
	    if (isbn) burro( 'half', isbn );
	}
    }
}
