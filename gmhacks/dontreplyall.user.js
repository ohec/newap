// ==UserScript==
// @name          Don't Reply-All
// @namespace     http://www.oreilly.com/catalog/greasemonkeyhks/
// @description   Warn before replying to multiple recipients in Gmail
// @include       http*://mail.google.com/mail/?*&view=cv*
// ==/UserScript==

// based on code by Aaron Boodman
// and included here with his gracious permission

var recipient_separator = /\s*\,\s*/g;

document.addEventListener("click", function(e) {
  if (e.target.id == "send") {
    var form = document.getElementById("compose_form");
    var to = removeEmptyItems(
        form.elements.namedItem('to').value.split(recipient_separator));
    var cc = removeEmptyItems(
        form.elements.namedItem('cc').value.split(recipient_separator));
    var bcc = removeEmptyItems(
        form.elements.namedItem('bcc').value.split(recipient_separator));

    if ((to.length + cc.length + bcc.length) > 1) {
      if (!confirm("WARNING!\n" + 
                   "Do you really want to reply to all these people?\n\n" +
                   "To: " + to.join(", ") + "\n" +
                   "CC: " + cc.join(", ") + "\n" +
                   "BCC: " + bcc.join(", "))) {
        e.stopPropagation();
      }
    }    
  }
}, true);

function removeEmptyItems(arr) {
  var result = [];
  for (var i = 0, item; item = arr[i]; i++) {
    if (/\S/.test(item)) {
      result.push(item);
    }
  }
  
  return result;
}
