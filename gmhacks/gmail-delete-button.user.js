// ==UserScript==
// @name          Gmail Delete Button
// @namespace     http://www.arantius.com/
// @description   Add a "Delete" button to Gmail's interface
// @include       http*://mail.google.com/*mail*?*
// ==/UserScript==

// based on code by Anthony Lieuallen
// and included here with his gracious permission
// http://www.arantius.com/article/arantius/gmail+delete+button/

function _gd_element(id) {
    try {
        var el=document.getElementById(id);
    } catch (e) {
        GM_log(
            "GMail Delete Button:\nThere was an error!\n\n"+
            "Line: "+e.lineNumber+"\n"+
            e.name+": "+e.message+"\n"
        );
        return false;
    }
    if (el) return el;
    return false;
}

function _gd_gmail_delete(delete_button) {
    //find the command box
    var command_box = delete_button.parentNode.getElementsByTagName('select')[0];
    var real_command_box = command_box.wrappedJSObject || command_box;
    real_command_box.onfocus();

    //find the command index for 'move to trash'
    var delete_index=-1;
    for (var i=0; i<command_box.options.length; i++) {
        if ('tr'==command_box.options[i].value &&
            !command_box.options[i].disabled ) {
            delete_index=i;
            break;
        }
    }
    //don't try to continue if we can't move to trash now
    if (-1==delete_index) {
        var box=_gd_element('nt1'); if (box) {
            try {
            //if we find the box put an error message in it
            box.firstChild.style.visibility='visible';
            box.getElementsByTagName('td')[1].innerHTML= '' +
                'Could not delete. Make sure at least one ' +
                'conversation is selected.';
            } catch (e) {}
        }
        return;
    }

    //set the command index and fire the change event
    command_box.selectedIndex=delete_index;
    real_command_box = command_box.wrappedJSObject || command_box;
    real_command_box.onchange();
}

function _gd_make_dom_button(id) {
    var delete_button= document.createElement('button');
    delete_button.setAttribute('class', 'ab');
    delete_button.setAttribute('id', '_gd_delete_button'+id);
    delete_button.addEventListener('click', function() {
	_gd_gmail_delete(delete_button);
    }, true);
    
    //this is a little hack-y, but we can find the language code here
    var lang='';
    try {
        var urlToTest=window.top.document.getElementsByTagName('frame')[1].src;
        lang=urlToTest.match(/html\/([^\/]*)\/loading.html$/)[1];
    } catch (e) {}
    //now check that language, and set the button text
    var buttonText='Delete';
    switch (lang) {
    case 'it': buttonText='Elimina'; break;
    case 'es': buttonText='Borrar'; break;
    case 'fr': buttonText='Supprimer'; break;
    case 'pt-BR': buttonText='Supress&atilde;o'; break;
    case 'de': buttonText='L&ouml;schen'; break;
    }
    
    delete_button.innerHTML='<b>'+buttonText+'</b>';
    return delete_button;
}

function _gd_insert_button(insert_container, id) {
    if (!insert_container) return false;
    if (_gd_element('_gd_delete_button'+id)) {
        return false;
    }

    //get the elements
    var spacer, delete_button;
    delete_button=_gd_make_dom_button(id);
    spacer=insert_container.firstChild.nextSibling.cloneNode(false);

    //pick the right place to put them, depending on which page we're on
    var insert_point=insert_container.firstChild;
    if (2==id || 3==id) {
        // 2 and 3 are inside the message and go at a different place
        insert_point=insert_point.nextSibling.nextSibling;
    }
    if (document.location.search.match(/search=query/)) {
        //inside the search page the button goes in a different place
        if (0==id) {
            spacer=insert_container.firstChild.nextSibling.nextSibling.cloneNode(false);
            insert_point=insert_container.firstChild.nextSibling.nextSibling.nextSibling;
        }
        if (1==id) spacer=document.createElement('span');
    } else if (document.location.search.match(/search=sent/)) {
        //inside the sent page the button goes in yet another place
        if (0==id) {
            spacer=document.createTextNode(' ');
            insert_point=insert_container.firstChild.nextSibling.nextSibling;
        }
        if (1==id) spacer=document.createElement('span');
    }

    insert_container.insertBefore(spacer, insert_point);
    insert_container.insertBefore(delete_button, spacer);
}

function _gd_place_delete_buttons() {
    if (!window || ! document || ! document.body) return;
    var top_menu=_gd_element('tamu');
    if (top_menu) _gd_insert_button(top_menu.parentNode, 0);
    var bot_menu=_gd_element('bamu');
    if (bot_menu) _gd_insert_button(bot_menu.parentNode, 1);
    var mtp_menu=_gd_element('ctamu');
    if (mtp_menu) _gd_insert_button(mtp_menu.parentNode, 2);
    var mbt_menu=_gd_element('cbamu');
    if (mbt_menu) _gd_insert_button(mbt_menu.parentNode, 3);
}

if (document.location.search) {
    var s=document.location.search;
    if (s.match(/\bsearch=(inbox|query|cat|all|starred|sent)\b/) ||
        ( s.match(/view=cv/) && !s.match(/search=(trash|spam)/) )
    ) {
        // Insert the main button
        try {
            _gd_place_delete_buttons();
        } catch (e) {
            GM_log(e.message);
        }

        // Set events to try adding buttons after user actions
        var buttonsInAMoment = function() {
            try {
                _gd_place_delete_buttons();
            }
            catch (e) {
                GM_log(e.message);
            }
        };
        window.addEventListener('mouseup', buttonsInAMoment, false);
        window.addEventListener('keyup', buttonsInAMoment, false);
    }
}
