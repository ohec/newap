// ==UserScript==
// @name          Magic hCalendar Microformatter
// @namespace     http://www.decafbad.com/
// @description   Enhances text areas with hCalendar microformat tools
// @include       *
// ==/UserScript==

// based on code by Les Orchard
// and included here with his gracious permission

function HCalendarCreator(editor_id, callback) {
    this.editor_id = editor_id;
    this.callback  = callback;
}

HCalendarCreator.prototype = {
    init: function() {
        // Get the editor and the form.
        this.editor = document.getElementById(this.editor_id);
        this.frm    = this.editor.getElementsByTagName("form")[0];

        // Wire up the build & insert button with the callback.
        var _this   = this;
        this.frm.elements.namedItem('build').addEventListener(
            'click', function(event) { 
            var resultstr = _this.buildContent();
            
            if (_this.frm.elements.namedItem('compact').checked) {
                var regex = /\n/gi;
                var temp = resultstr.replace(regex,' ');
                resultstr = temp.replace(/\s{2,}/gi,' ');
            }
            
            _this.callback(resultstr);
            _this.reset();
            
	    event.preventDefault();
            return false;
        }, true);
        //this.wireUpEvents();
    },

    valueOf: function(name) {
	return this.frm.elements.namedItem(name).value;
    },

    // Currently un-used, but kept around in case I want to 
    // re-enable live preview.
    wireUpEvents: function() {

        var output_div = this.getByClass(this.editor, "output")[0];
        var p_block_div = this.getByClass(this.editor, "previewblock")[0];
        
        this.sample_field = this.getByClass(output_div, "samplecode")[0];
        this.compact_field = this.getByClass(output_div, "compactcode")[0];
        this.preview_div = this.getByClass(p_block_div, "preview")[0];
        
        // Build some closure functions for GUI events.
        var _this = this;
	var doReset = function(event) {
	    _this.reset();
	    event.preventDefault();
	};
	var doUpdateContent = function(event) {
	    _this.updateContent();
	    event.preventDefault();
	};
        var doUpdate = function(event) {
	    _this.update();
	    event.preventDefault();
	};
        var doUpdateEndTime = function(event) {
	    _this.update_endtime();
	    event.preventDefault();
	};

        this.frm.addEventListener('reset', doReset, true);
        this.frm.addEventListener('submit', doUpdateContent, true);
        
        var inputs = this.editor.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {        
            inputs[i].addEventListener('click', doUpdateContent, true);
	    inputs[i].addEventListener('keyup', doUpdateContent, true);
        }

        var selects = this.editor.getElementsByTagName('select');

        for (var i = 0; i < selects.length; i++) {        
            selects[i].addEventListener('click', doUpdateContent, true);
	    selects[i].addEventListener('keyup', doUpdateContent, true);
	}
	this.frm.elements.namedItem('description').addEventListener(
            'keyup', doUpdateContent, true);
	this.frm.elements.namedItem('startYear').addEventListener(
            'change', doUpdate, true);
	this.frm.elements.namedItem('startMonth').addEventListener(
            'change', doUpdate, true);
	this.frm.elements.namedItem('startDay').addEventListener(
            'change', doUpdate, true);
	this.frm.elements.namedItem('endHour').addEventListener(
            'change', doUpdateEndTime, true);
	this.frm.elements.namedItem('endMinute').addEventListener(
            'change', doUpdateEndTime, true);

        this.reset();
    },

    getByClass: function(parent, cls) {
        var i, c;
        var cs = parent.childNodes;
        var rv = [];
        for (i=0; i<cs.length; i++)
            if (cs[i].className && cs[i].className == cls) 
                rv[rv.length] = cs[i];
        return rv;
    },

    getSelectedValue: function(name) {
	var elmSelect = this.valueOf(name);
        return elmSelect.options[elmSelect.selectedIndex].text;
    },
    
    buildContent: function() {
        // Enforce proper values for the start/end times.
        if (this.valueOf('startHour') > 23) {
	    this.frm.elements.namedItem('startHour').value = 23;
	}
        if (this.valueOf('startHour') < 0) {
	    this.frm.elements.namedItem('startHour').value = 0;
	}
        if (this.valueOf('endHour') > 23) {
	    this.frm.elements.namedItem('endHour').value = 23;
	}
        if (this.valueOf('startHour') < 0) {
	    this.frm.elements.namedItem('startHour').value = 0;
	}
        if (this.valueOf('startMinute') > 59) {
	    this.frm.elements.namedItem('startMinute').value=59;
	}
        if (this.valueOf('startHour') < 0) {
	    this.frm.elements.namedItem('startHour').value = 0;
	}
        if (this.valueOf('endMinute') > 59 ) {
	    this.frm.elements.namedItem('endMinute').value = 59;
	}
        if (this.valueOf('startHour') < 0) {
	    this.frm.elements.namedItem('startHour').value = 0;
	}

        /* get values of text fields */
        var summary        = this.valueOf('summary');
        var url            = this.valueOf('url');

        var startYear      = this.valueOf('startYear');
        var startMonth     = this.valueOf('startMonth');
        var startDay       = this.valueOf('startDay');

        var startHour      = this.valueOf('startHour');
        var startMinute    = this.valueOf('startMinute');

        var endHour        = this.valueOf('endHour');
        var endMinute      = this.valueOf('endMinute');

        var endYear        = this.valueOf('endYear');
        var endMonth       = this.valueOf('endMonth');
        var endDay         = this.valueOf('endDay');

        var startMonthText = this.getSelectedValue('startMonth');
        var startDayText   = this.getSelectedValue('startDay');
        var endDayText     = this.getSelectedValue('endDay');
        var endMonthText   = this.getSelectedValue('endMonth');

        var timezone       = this.valueOf('timezone');
        var description    = this.valueOf('description');

        if(!timezone) timezone = '';

        if(timezone > 0) timezone = '+' + timezone;

        if (this.late_night()) { var late = true; }

        if (startMinute) startMinute = this.pad(startMinute);
        if (startHour)   startHour   = this.pad(startHour);
        if (endMinute)   endMinute   = this.pad(endMinute);
        if (endHour)     endHour     = this.pad(endHour);

        var dtstart = startYear + startMonth + startDay;

        if (startHour) {
            if(!startMinute) startMinute= '00';
            dtstart += 'T' + startHour + startMinute + timezone;
        }

        var dtend = endYear + endMonth + endDay;

        if (endHour) {
            if(endHour.length < 2) {
                endHour = '0' + endHour;
            }
            if (!endMinute) endMinute = '00';
            dtend += 'T' + endHour + endMinute + timezone;
        }
        var startOut = startMonthText + ' ' + startDayText;

        if (startYear != endYear) {
            startOut += ', ' + startYear;
        }

        var endOut = '';
        if(!late) {
            if(startMonth != endMonth || startYear != endYear) {
                endOut += endMonthText + ' ';
            }

            if(!(startMonth == endMonth && startYear == endYear &&
                    startDay == endDay)) {
                endOut += endDay;
            } else {
                startOut += ', ' + startYear;
            }
        }
        if(startHour && startMinute) {
            startOut += ' - ' + startHour + ':' + startMinute;
            if (endOut) {
                var collapse = true;
            }
        }

        if (endHour && endMinute) {
            if (collapse) {
                endOut += ' - '
            }
            endOut += endHour + ':' + endMinute
        }

        if(!(startMonth == endMonth && startYear == endYear &&
                startDay == endDay)) {
            endOut += ', ' + endYear;
        }

        var location = this.valueOf('location');

        /* set results field */
        var resultstr = '<div class="vevent">\n';
        if (url) {
            resultstr += ' <a class="url" href="' + url + '">\n';
        }
        resultstr += '  <abbr class="dtstart" title="' + dtstart +
            '">\n    ' + startOut + '\n  <\/abbr> - \n';

        if (!((startYear+startMonth+startDay==endYear+endMonth+endDay) &&
                    !endHour)) {
            resultstr += '  <abbr class="dtend" title="' + dtend + '">';
            if (endOut) resultstr += '\n    ' + endOut + '\n    ';
            resultstr += '<\/abbr>\n';
        }
        if (endHour && endMinute) resultstr += ' - ';
        resultstr += '  <span class="summary">\n     ' + 
            this.escape_output(summary) + '\n   </span> ';
        if (location) resultstr += '- at\n  <span class="location">\n     '+
            this.escape_output(location) + '\n   ' +
            '<\/span>';
        if (url) {
            resultstr += '\n </a>\n';
        }

        if(description) resultstr+='\n   <div class="description">\n      '+
            this.escape_output(description) + '\n    </div>\n';

        resultstr += '\n<\/div>';

        return resultstr;
    },

    updateContent: function() {
        var resultstr = this.buildContent();

        this.sample_field.value = resultstr;
        this.preview_div.innerHTML = resultstr;

        var regex = /\n/gi;
        var temp = resultstr.replace(regex,' ');
        temp = temp.replace(/\s{2,}/gi,' ');
        this.compact_field.value = temp;

    },

    update: function() {
        var startYear  = this.valueOf('startYear');
        var startMonth = this.valueOf('startMonth');
        var startDay   = this.valueOf('startDay');

        var endYear    = this.valueOf('endYear');
        var endMonth   = this.valueOf('endMonth');
        var endDay     = this.valueOf('endDay');

        this.frm.elements.namedItem('endYear').value  = 
	    this.valueOf('startYear');
        this.frm.elements.namedItem('endMonth').value = 
            this.valueOf('startMonth');
        this.frm.elements.namedItem('endDay').value   = 
            this.valueOf('startDay');
    },

    update_endtime: function() {
        var startYear   = this.valueOf('startYear');
        var startMonth  = this.valueOf('startMonth');
        var startDay    = this.valueOf('startDay');
        var endYear     = this.valueOf('endYear');
        var endMonth    = this.valueOf('endMonth');
        var endDay      = this.valueOf('endDay');
        var endHour     = this.valueOf('endHour');
        var endMinute   = this.valueOf('endMinute');
        var startHour   = this.valueOf('startHour');
        var startMinute = this.valueOf('startMinute');

        if (endHour && endMinute && startHour && startMinute && 
                startYear == endYear && startMonth == endMonth && 
                startDay == endDay) {
            var startTime = startHour + startMinute;
            var endTime = endHour + endMinute;

            if(startTime.length == 3) startTime = '0' + startTime;
            if (endTime.length == 3) endTime = '0' + endTime;

            if(endTime < startTime){
                this.increment_end_date();
            }
        }

    },

    increment_end_date: function() {
        var endYear  = this.valueOf('endYear');
        var endMonth = this.valueOf('endMonth');
        var endDay   = this.valueOf('endDay');

        var d = new Date(endYear, parseInt(endMonth) - 1, parseInt(endDay));

        d.setDate(++endDay);

        this.frm.elements.namedItem('endYear').value =
            d.getFullYear();
        this.frm.elements.namedItem('endMonth').selectedIndex =
            d.getMonth();
        this.frm.elements.namedItem('endDay').selectedIndex   =
            d.getDate() - 1;
    },

    late_night: function() {
        //convert to date objects
        if(parseInt(this.valueOf('endHour')) < 6) {

            var endDate = new Date(this.valueOf('endYear'), 
                    this.frm.elements.namedItem('endMonth').selectedIndex,
                    parseInt(this.valueOf('endDay')));

            var startDate = new Date(this.valueOf('startYear'), 
                    this.frm.elements.namedItem('startMonth').selectedIndex,
                    parseInt(this.valueOf('startDay')));
            //increment and test

            startDate.setDate(startDate.getDate() + 1);

            if(startDate.getYear() == endDate.getYear() && 
                    startDate.getMonth() == endDate.getMonth() && 
                    startDate.getDay() == endDate.getDay()) {
                return true;
            }
        }

        return false;

    },

    escape_output: function(input){
        // this is not the most robust solution,
        // but it should cover most cases
        var amp = /\s&\s/gi;
        var lt = /\s\<\s/gi;
        var gt = /\s>\s/gi;
 
        var temp = input.replace(amp,' &amp; ');
        temp = temp.replace(lt,' &lt; ');
        var output = temp.replace(gt,' &gt; ');
        return output;
    },

    reset: function() {
        var d = new Date();
        this.frm.elements.namedItem('startYear').value = d.getFullYear();
        this.frm.elements.namedItem('startMonth').selectedIndex = d.getMonth();
        this.frm.elements.namedItem('startDay').value = d.getDate();

        this.frm.elements.namedItem('endYear').value = d.getFullYear();
        this.frm.elements.namedItem('endMonth').selectedIndex = d.getMonth();
        this.frm.elements.namedItem('endDay').value = d.getDate();

        var timezone = d.getTimezoneOffset();

        timezone = -timezone / 60;
        timezone = timezone + "00";
        if(timezone.length == 4)
            timezone = timezone.charAt(0) + "0" + timezone.substring(1);

        if (parseInt(timezone) > 0) {
            timezone = "+" + timezone;
        }

        this.frm.elements.namedItem('timezone').value = timezone;
        this.updateContent();
    },

    pad: function(input) {
        if (input.length < 2) input = '0' + input.toString();
        return input;
    },

    GLOBAL_CSS: '\
        .hCalEditor .inputs { \
            float:left; margin-right:2em \
        } \
        .hCalEditor label {  \
            float:left;  \
            clear:left;  \
            text-align:right;  \
            width:5em;  \
            padding-right:1em;  \
            font-weight:bold;  \
            line-height:1.9em  \
        } \
        .hCalEditor .field  \
            { margin-bottom:.7em; font-size:smaller } \
        .hCalEditor .field input  \
            { width: 16em; line-height:2em } \
        .hCalEditor .submit  \
            { margin:1em 0 1em 7em } \
        .hCalEditor .submit button, .hCalEditor .submit input \
            { margin-left:1em } \
        .hCalEditor form, .hCalEditor fieldset  \
            { margin:0 } \
        .hCalEditor h2  \
            { margin:.3em 0 .1em 0; font-size:1em } \
        .hCalEditor .output  \
            { float:left } \
        .hCalEditor .previewblock  \
            {clear:left} \
        .hCalEditor .preview {  \
            padding:.5em; background:#ccc;  \
            border:1px solid black; margin-right:2em  \
        } \
        .hCalEditor .field .startHour  \
            { width: 41px; }  \
        .hCalEditor .field .summary,  \
        .hCalEditor .field .location,  \
        .hCalEditor .field .url  \
            { width:21em } \
        .hCalEditor .field .startHour, \
        .hCalEditor .field .startMinute, \
        .hCalEditor .field .endHour, \
        .hCalEditor .field .endMinute  \
            {width:2em} \
        .hCalEditor .field .timezone  \
            {width:10em} \
    ',
    
    EDITOR_HTML: '\
      <div id="\0editor_id\f" class="hCalEditor"> \
      <div class="inputs"> \
      <form action="" onreset="doreset();"> \
      <fieldset> \
      <legend><a href="http://microformats.org/wiki/hcalendar"\
          >hCalendar</a>-o-matic</legend> \
      <!-- url, summary, dtstart, dtend, location --> \
      <div class="field"> \
      <label for="summary">summary</label> \
      <input type="text" class="summary" name="summary" \
          value="event title" /> \
      </div> \
      <div class="field"> \
      <label for="location">location</label> \
      <input type="text" class="location" name="location" /> \
      </div> \
      <div class="field"> \
      <label for="url">url</label> \
      <input type="text" class="url" name="url" />  \
      </div> \
      <div class="field"> \
      <label for="startMonth">start</label> \
      <select class="startMonth" name="startMonth" > \
      <option value="01">January</option> \
      <option value="02">February</option> \
      <option value="03">March</option> \
      <option value="04">April</option> \
      <option value="05">May</option> \
      <option value="06">June</option> \
      <option value="07">July</option> \
      <option value="08">August</option> \
      <option value="09">September</option> \
      <option value="10">October</option> \
      <option value="11">November</option> \
      <option value="12">December</option> \
      </select> \
      <select class="startDay" name="startDay" > \
      <option value="01">1</option> <option value="02">2</option> \
      <option value="03">3</option> <option value="04">4</option> \
      <option value="05">5</option> <option value="06">6</option> \
      <option value="07">7</option> <option value="08">8</option> \
      <option value="09">9</option> <option value="10">10</option> \
      <option value="11">11</option><option value="12">12</option> \
      <option value="13">13</option><option value="14">14</option> \
      <option value="15">15</option><option value="16">16</option> \
      <option value="17">17</option><option value="18">18</option> \
      <option value="19">19</option><option value="20">20</option> \
      <option value="21">21</option><option value="22">22</option> \
      <option value="23">23</option><option value="24">24</option> \
      <option value="25">25</option><option value="26">26</option> \
      <option value="27">27</option><option value="28">28</option> \
      <option value="29">29</option><option value="30">30</option> \
      <option value="31">31</option> \
      </select> \
      <select class="startYear" name="startYear" > \
      <option value="2004">2004</option> \
      <option value="2005">2005</option> \
      <option value="2006">2006</option> \
      <option value="2007">2007</option> \
      <option value="2008">2008</option> \
      </select> \
      <input type="text" class="startHour" class="startHour" \
          name="startHour" maxlength="2" /> : \
      <input type="text" class="startMinute" name="startMinute" \
          maxlength="2" /> \
      </div> \
      <div class="field"> \
      <label for="endMonth">end</label> \
      <select class="endMonth" name="endMonth" > \
      <option value="01">January</option> \
      <option value="02">February</option> \
      <option value="03">March</option> \
      <option value="04">April</option> \
      <option value="05">May</option> \
      <option value="06">June</option> \
      <option value="07">July</option> \
      <option value="08">August</option> \
      <option value="09">September</option> \
      <option value="10">October</option> \
      <option value="11">November</option> \
      <option value="12">December</option> \
      </select> \
      <select class="endDay" name="endDay" > \
      <option value="01">1</option> <option value="02">2</option> \
      <option value="03">3</option> <option value="04">4</option> \
      <option value="05">5</option> <option value="06">6</option> \
      <option value="07">7</option> <option value="08">8</option> \
      <option value="09">9</option> <option value="10">10</option> \
      <option value="11">11</option><option value="12">12</option> \
      <option value="13">13</option><option value="14">14</option> \
      <option value="15">15</option><option value="16">16</option> \
      <option value="17">17</option><option value="18">18</option> \
      <option value="19">19</option><option value="20">20</option> \
      <option value="21">21</option><option value="22">22</option> \
      <option value="23">23</option><option value="24">24</option> \
      <option value="25">25</option><option value="26">26</option> \
      <option value="27">27</option><option value="28">28</option> \
      <option value="29">29</option><option value="30">30</option> \
      <option value="31">31</option> \
      </select> \
      <select class="endYear" name="endYear" > \
      <option value="2004">2004</option> \
      <option value="2005">2005</option> \
      <option value="2006">2006</option> \
      <option value="2007">2007</option> \
      <option value="2008">2008</option> \
      </select> \
      <input type="text" class="endHour" name="endHour" \
          maxlength="2" /> : \
      <input type="text" class="endMinute" name="endMinute" maxlength="2" /> \
      </div> \
      <div class="field"> \
      <label for="timezone">TZ</label> \
      <select class="timezone" name="timezone"> \
      <option value="">none</option> \
      <option value="-1200">-12 (IDLW)</option> \
      <option value="-1100">-11 (NT)</option> \
      <option value="-1000">-10 (HST)</option> \
      <option value="-900">-9 (AKST)</option> \
      <option value="-0800">-8 (PST/AKDT)</option> \
      <option value="-0700">-7 (MST/PDT)</option> \
      <option value="-0600">-6 (CST/MDT)</option> \
      <option value="-0500">-5 (EST/CDT)</option> \
      <option value="-0400">-4 (AST/EDT)</option> \
      <option value="-0345">-3:45</option> \
      <option value="-0330">-3:30</option> \
      <option value="-0300">-3 (ADT)</option> \
      <option value="-0200">-2 (AT)</option> \
      <option value="-0100">-1 (WAT)</option> \
      <option value="Z">+0 (GMT/UTC)</option> \
      <option value="+0100">+1 (CET/BST/IST/WEST)</option> \
      <option value="+0200">+2 (EET/CEST)</option> \
      <option value="+0300">+3 (MSK/EEST)</option> \
      <option value="+0330">+3:30 (Iran)</option> \
      <option value="+0400">+4 (ZP4/MSD)</option> \
      <option value="+0430">+4:30 (Afghanistan)</option> \
      <option value="+0500">+5 (ZP5)</option> \
      <option value="+0530">+5:30 (India)</option> \
      <option value="+0600">+6 (ZP6)</option> \
      <option value="+0630">+6:30 (Burma)</option> \
      <option value="+0700">+7 (WAST)</option> \
      <option value="+0800">+8 (WST)</option> \
      <option value="+0900">+9 (JST)</option> \
      <option value="+0930">+9:30 (Central Australia)</option> \
      <option value="+1000">+10 (AEST)</option> \
      <option value="+1100">+11 (AEST(summer))</option> \
      <option value="+1200">+12 (NZST/IDLE)</option> \
      </select> \
      hour(s) from <abbr title="Greenwich Mean time">GMT</abbr> \
      </div> \
      <div class="field"> \
      <label for="description">description</label> \
      <textarea class="description" name="description" cols="33" \
          rows="5"></textarea> \
      </div> \
      <div class="submit"> \
      <input type="checkbox" name="compact" value="compact" /> \
          Compact? \
      <input type="button" name="build" value="Build and Insert" /> \
      <input type="reset" class="reset" name="reset" /> \
      </div> \
      </fieldset> \
      </form> \
      </div> \
      </div> \
    ',
};

var MagicMF = {
    
    init: function() {
        var textareas, textarea;
        
        DBUtils.addGlobalStyle(MagicMF.GLOBAL_CSS);
        DBUtils.addGlobalStyle(HCalendarCreator.prototype.GLOBAL_CSS);

        textareas = document.getElementsByTagName('textarea');
        if (!textareas.length) { return; }

        for (var i = 0; i < textareas.length; i++) {
            textarea = textareas[i];

            button = MagicMF.createButton
                (i, textarea, MagicMF.handleMagicButton,
                 "Build event here", 0, 0, '');
            
            textarea.parentNode.insertBefore(button, textarea);
            textarea.parentNode.insertBefore(
                document.createElement('br'), textarea);
        }
    },
    
    insertText: function(ele, ins_val) {
        // Find the start/end of the selection, and the total length
        var start  = ele.selectionStart;
        var end    = ele.selectionEnd;
        var length = ele.textLength;
        var val    = ele.value;
        
        // If nothing selected, jump to the end.
        if (end == 1 || end == 2) end = length;

        // Replace the selection with the incoming value.
        ele.value = val.substring(0, start) + ins_val + 
                    val.substr(end, length);

        // Place the cursor at the end of the inserted text & refocus the
        // textarea
        //e.selectionStart = start;
        ele.selectionStart = start + ins_val.length;
        ele.selectionEnd   = start + ins_val.length;
        ele.focus();
    },

    handleMagicButton: function(event, textarea) {
        var link, textarea, s;
        link      = event.currentTarget;
        button_id = link.id;
        
        var panel_id  = button_id + "_panel";
        var panel    = document.getElementById(panel_id);
        if (!panel) 
            panel = MagicMF.createPanel(button_id, panel_id, textarea);
        
        panel._start = textarea.selectionStart;
        panel._end   = textarea.selectionEnd;
        
        DBUtils.toggle(panel_id);
    },

    createPanel: function(button_id, panel_id, textarea) {
        
        var taX = DBUtils.findElementX(textarea);
        var taY = DBUtils.findElementY(textarea);
        var taW = textarea.offsetWidth;
        var taH = textarea.offsetHeight;
        
        var txt_id    = panel_id + "_txt";
        var editor_id = panel_id + "_editor";

        var css = DBUtils.format(MagicMF.PANEL_CSS, {
            id:     panel_id,
            txt_id: txt_id,
            left:   taX,
            top:    taY,
            width:  taW - 24,
            height: taH - 24,
        });
        DBUtils.addGlobalStyle(css);
        
        var _this  = this;
        var panel  = document.createElement("div");
        var cb     = function(val) { 
            _this.panelCallback(panel, val, textarea); 
        }
        var editor = new HCalendarCreator(editor_id, cb);
        var editor_html = DBUtils.format(editor.EDITOR_HTML, { 
            editor_id: editor_id 
        });
        
        panel.id        = panel_id;
        panel.innerHTML = DBUtils.format(MagicMF.PANEL_HTML, {
            id:          panel_id,
            txt_id:      txt_id,
            editor_html: editor_html
        });
        document.body.appendChild(panel);

        editor.init();
        
        return panel;
    },
    
    panelCallback: function(panel, val, textarea) {
        MagicMF.insertText(textarea, val);
        DBUtils.hide(panel.id);
    },

    createButton: function(sub_id, target, func, title, width, height,
        src) {
        var img, button;
        
        img = document.createTextNode("[ hCal ]");
        
        button         = document.createElement('a');
        button.id      = 'mf_'+sub_id;
        button.title   = title;
        button.href = '#';
        button.addEventListener('click', function(event) {
	    func(event, target);
	    event.preventDefault();
	}, true);
        var spot = document.createElement('a');
        spot.name = button.id;
        
        button.appendChild(spot);
        button.appendChild(img);
        return button;

    },
    
    GLOBAL_CSS: '\
        .mf_editor_close { \
            float: right \
        } \
    ',
    
    PANEL_CSS: ' \
        #\0id\f { \
            position: absolute; \
            display:  none; \
            overflow: auto; \
            margin:   2px; \
            padding:  10px; \
            left:     \0left\fpx; \
            top:      \0top\fpx; \
            width:    \0width\fpx; \
            height:   \0height\fpx; \
            color:    #000000; \
            z-index:  999; \
            background-color: #eeeeee; \
        } \
    ',

    PANEL_HTML: '\
      <a class="mf_editor_close" \
         onClick="DBUtils.hide(\'\0id\f\')">[ X ]</a> \
      \0editor_html\f \
    ',

};

var DBUtils = {
    
    /*
        format(template string, template map):
            Populates a template string using map lookups via 
            named slots delimited by \0 and \f.
    */
    format: function(tmpl, tmpl_map) {
        var parts = tmpl.split(/(\0.*?\f)/);
        var i, p, m, out="";
        for (i=0; i<parts.length; i++) {
            p = parts[i];
            m = p.match(/^\0(.*?)\f$/);
            out += (!m) ? p : tmpl_map[m[1]];
        }
        return out;
    },

    hide: function(id) {
        var that = document.getElementById(id);
        if (that) that.style.display = 'none';
    },

    show: function(id) {
        var that = document.getElementById(id);
        if (that) that.style.display = 'block';
    },

    toggle: function(id) {
        var that = document.getElementById(id);
        if (!that) return;
        that.style.display = 
            (that.style.display == 'block') ?  'none' : 'block';
    },
   
    // from http://www.quirksmode.org/js/findpos.html
    findElementX: function(obj) {
        var curleft = 0;
        if (obj.offsetParent) {
            while (obj.offsetParent) {
                curleft += obj.offsetLeft;
                obj = obj.offsetParent;
            }
        }
        else if (obj.x)
            curleft += obj.x;
        return curleft;
    },

    findElementY: function(obj) {
        var curtop = 0;
        if (obj.offsetParent) {
            while (obj.offsetParent) {
                curtop += obj.offsetTop;
                obj = obj.offsetParent;
            }
        }
        else if (obj.y)
            curtop += obj.y;
        return curtop;
    },

    addGlobalStyle: function(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    },
    
};

// Now that everything's defined, fire it up.
MagicMF.init();
