// ==UserScript==
// @name          Zoom Textarea
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   add controls to zoom textareas
// @include       *
// ==/UserScript==

function addEvent(oTarget, sEventName, fCallback, bCapture) {
    var bReturn = false;
    if (oTarget.addEventListener) {
	oTarget.addEventListener(sEventName, fCallback, bCapture);
	bReturn = true;
    } else if (oTarget.attachEvent) {
	bReturn = oTarget.attachEvent('on' + sEventName, fCallback);
    }
    return bReturn;
}

function createButton(elmTarget, funcCallback, sTitle, iWidth, iHeight, urlSrc) {
    var elmImage = document.createElement('img');
    elmImage.width = iWidth;
    elmImage.height = iHeight;
    elmImage.style.borderTop = elmImage.style.borderLeft = "1px solid #ccc";
    elmImage.style.borderRight = elmImage.style.borderBottom = "1px solid #888";
    elmImage.style.marginRight = "2px";
    elmImage.src = urlSrc;
    var elmLink = document.createElement('a');
    elmLink.title = sTitle;
    elmLink.href = '#';
    addEvent(elmLink, 'click', funcCallback, true);
    elmLink.appendChild(elmImage);
    return elmLink;
}

var arTextareas = document.getElementsByTagName('textarea');
for (var i = arTextareas.length - 1; i >= 0; i--) {
    var elmTextarea = arTextareas[i];

    function textarea_zoom_in(event) {
	var style = getComputedStyle(elmTextarea, "");
	elmTextarea.style.width = (parseFloat(style.width) * 1.5) + "px";
	elmTextarea.style.height = (parseFloat(style.height) * 1.5) + "px";
	elmTextarea.style.fontSize = (parseFloat(style.fontSize) + 7.0) + 'px';
	event.preventDefault();
    }

    function textarea_zoom_out(event) {
	var style = getComputedStyle(elmTextarea, "");
	elmTextarea.style.width = (parseFloat(style.width) * 2.0 / 3.0) + "px";
	elmTextarea.style.height = (parseFloat(style.height) * 2.0 / 3.0) + "px";
	elmTextarea.style.fontSize = (parseFloat(style.fontSize) - 7.0) + "px";
	event.preventDefault();
    }

    elmTextarea.parentNode.insertBefore(
        createButton(
            elmTextarea,
            textarea_zoom_in,
            'Increase text size',
            20,
            20,
            'data:image/gif;base64,'+
'R0lGODlhFAAUAOYAANPS1tva3uTj52NjY2JiY7KxtPf3%2BLOys6WkpmJiYvDw8fX19vb'+
'296Wlpre3uEZFR%2B%2Fv8aqpq9va3a6tr6Kho%2Bjo6bKytZqZml5eYMLBxNra21JSU3'+
'Jxc3RzdXl4emJhZOvq7KamppGQkr29vba2uGBgYdLR1dLS0lBPUVRTVYB%2Fgvj4%2BYK'+
'Bg6SjptrZ3cPDxb69wG1tbsXFxsrJy29vccDAwfT09VJRU6uqrFlZW6moqo2Mj4yLjLKy'+
's%2Fj4%2BK%2Busu7t783Nz3l4e19fX7u6vaalqNPS1MjHylZVV318ftfW2UhHSG9uccv'+
'KzfHw8qqqrNPS1eXk5tvb3K%2BvsHNydeLi40pKS2JhY2hnalpZWlVVVtDQ0URDRJmZm5'+
'mYm11dXp2cnm9vcFxcXaOjo0pJSsC%2FwuXk6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC'+
'H5BAAAAAAALAAAAAAUABQAAAeagGaCg4SFhoeIiYqKTSQUFwgwi4JlB0pOCkEiRQKKRxM'+
'gKwMGDFEqBYpPRj4GAwwLCkQsijwQBAQJCUNSW1mKSUALNiVVJzIvSIo7GRUaGzUOPTpC'+
'igUeMyNTIWMHGC2KAl5hCBENYDlcWC7gOB1LDzRdWlZMAZOEJl83VPb3ggAfUnDo5w%2F'+
'AFRQxJPj7J4aMhYWCoPyASFFRIAA7'),
        elmTextarea);
    elmTextarea.parentNode.insertBefore(
        createButton(
            elmTextarea,
            textarea_zoom_out,
            'Decrease text size',
            20,
            20,
            'data:image/gif;base64,'+
'R0lGODlhFAAUAOYAANPS1uTj59va3vDw8bKxtGJiYrOys6Wkpvj4%2BPb29%2FX19mJiY'+
'%2Ff3%2BKqqrLe3uLKytURDRFpZWqmoqllZW9va3aOjo6Kho4KBg729vWJhZK%2BuskZF'+
'R4B%2FgsLBxHNydY2Mj%2Ff396amptLS0l9fX9fW2dDQ0W1tbpmZm8DAwfT09fHw8n18f'+
'uLi49LR1V5eYOjo6VBPUa6tr769wEhHSNra20pJStPS1KuqrNPS1ZmYm%2B7t77Kys8rJ'+
'y%2Fj4%2BaSjpm9uca%2BvsMjHyqalqHRzdVJRU8PDxVRTVcvKzc3Nz0pKS9rZ3evq7MC'+
'%2FwsXFxp2cnnl4e1VVVu%2Fv8ba2uM7Oz29vcbu6vZqZmnJxc9vb3PHx8uXk5mhnamJh'+
'Y1xcXZGQklZVV29vcHl4eoyLjKqpq6Wlpl1dXuXk6AAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'+
'AAACH5BAAAAAAALAAAAAAUABQAAAeZgGaCg4SFhoeIiYqKR1IWVgcyi4JMBiQqA0heQgG'+
'KQTFLPQgMCVocBIoNNqMgCQoDVReKYlELCwUFI1glEYorOgopWSwiTUVfih8dLzRTKA47'+
'Ek%2BKBGE8GEAhFQYuPooBOWAHY2ROExBbSt83QzMbVCdQST8Ck4QtZUQe9faCABlGrvD'+
'rB4ALDBMU%2BvnrUuOBQkE4NDycqCgQADs%3D'),
        elmTextarea);
    elmTextarea.parentNode.insertBefore(
        document.createElement('br'),
        elmTextarea);
}
