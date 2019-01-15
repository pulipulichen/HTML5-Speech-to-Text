/**
 * Javascript Internationalization (i18n)
 * The easy way to perform i18n to your javascript project..
 *
 * @author Essoduke Chang
 * @see https://code.essoduke.org/i18n/
 * @version 1.2
 *
 * Last Modified 2015.07.10.165852
 */
i18n = (function (window, undefined) {

    'use strict';

    /**
     * Check the client timezone to adjust DST
     */
    var DST = function () {
        var rightNow = new Date(),
            temp  = '',
            date1 = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0, 0),
            date2 = new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0, 0),
            date3 = '',
            date4 = '',
            hoursDiffStdTime = 0,
            hoursDiffDaylightTime = 0;
        temp = date1.toGMTString();
        date3 = new Date(temp.substring(0, temp.lastIndexOf(" ") - 1));
        temp = date2.toGMTString();
        date4 = new Date(temp.substring(0, temp.lastIndexOf(" ") - 1));
        hoursDiffStdTime = (date1 - date3) / (1000 * 60 * 60);
        hoursDiffDaylightTime = (date2 - date4) / (1000 * 60 * 60);
        return (hoursDiffDaylightTime !== hoursDiffStdTime) ? true : false;
    },

    //language code
    lang = '',

    // language file's path
    path = '',

    //localize object
    localize = {},

    //default setting
    setting = {
        "UTC"    : -4,
        "format" : "Y-m-d H:i:s",
        "AM"     : "AM",
        "PM"     : "PM"
    },

    //fetch lauguage string in JSON object
    locale = function (langcode) {

        var result   = {},
            xmlhttp  = {},
            url      = [(0 !== path.length ? path.replace(/\/$/, '') + '/' : ''), langcode, '.js'].join(''),
            callback = {};

        // Use jQuery ajax
        if (window.jQuery) {
            jQuery.ajax({
                'url'     : url,
                'async'   : false,
                'cache'   : true,
                'dataType': 'JSON'
            })
            .fail(function (xhr, status, error) {
            })
            .done(function (resp) {
                result = resp;
            });
        } else {
            // XMLHttpRequest callback
            callback = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    try {
                        if ('function' === typeof JSON.parse) {
                            result = JSON.parse(xmlhttp.responseText);
                        }
                    } catch (ignore) {
                        console.warn(ignore.message);
                    }
                }
            };
            // Native XMLHttpRequest
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
                if (xmlhttp.overrideMimeType) {
                    xmlhttp.overrideMimeType('application/json; charset=UTF-8');
                }
            } else if (window.ActiveXObject) {
                var activexName = ['MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'],
                    i = 0;
                for (i = 0; i < activexName.length; i += 1) {
                    try {
                        xmlhttp = new ActiveXObject(activexName[i]);
                        break;
                    } catch (ignore) {
                        console.warn(ignore.message);
                    }
                }
            }
            xmlhttp.onreadystatechange = callback;
            //console.log(url)
            xmlhttp.open('GET', url, false);
            xmlhttp.send(null);
        }
        return result;
    };

    /**
     * _hasOwnProperty for compatibility IE
     * @param {Object} obj Object
     * @param {string} property Property name
     * @return {boolean}
     * @version 2.4.3
     */
    function _hasOwnProperty (obj, property) {
        try {
            return (!window.hasOwnProperty) ?
                   Object.prototype.hasOwnProperty.call(obj, property.toString()) :
                   obj.hasOwnProperty(property.toString());
        } catch (ignore) {
            console.warn(ignore.message);
        }
    }

    /**
     * Datetime format
     */
    Date.prototype.format = function (format) {
        var returnStr = '',
            replace   = Date.replaceChars,
            curChar   = '',
            i = 0;
        replace.reload();
        for (i = 0; i < format.length; i += 1) {
            curChar = format.charAt(i);
            returnStr += (replace[curChar] ? replace[curChar].call(this) : curChar);
        }
        return returnStr;
    };

    /**
     * Datetime function object
     * @see {@link http://jacwright.com/projects/javascript/date_format (unavailable)}
     * @see {@link http://code.google.com/p/omeglelogger/source/browse/trunk/dateformat.js?spec=svn2&r=2}
     */
    Date.replaceChars = {

        reload: function () {
            this.shortMonths = _hasOwnProperty(localize, 'shortMonths') ?
                               localize.shortMonths :
                               ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            this.longMonths  = _hasOwnProperty(localize, 'longMonths') ?
                               localize.longMonths :
                               ['January','February','March','April','May','June','July','August','September','October','November','December'];
            this.shortDays   = _hasOwnProperty(localize, 'shortDays') ?
                               localize.shortDays :
                               ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            this.longDays    = _hasOwnProperty(localize, 'longDays') ?
                               localize.longDays :
                               ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        },
        shortMonths: [],
        longMonths : [],
        shortDays  : [],
        longDays   : [],
        d: function () {
            return (this.getUTCDate() < 10 ? '0' : '') + this.getUTCDate();
        },
        D: function () {
            return Date.replaceChars.shortDays[this.getUTCDay()];
        },
        j: function () {
            return this.getUTCDate();
        },
        l: function () {
            return Date.replaceChars.longDays[this.getUTCDay()];
        },
        N: function () {
            return this.getDay() + 1;
        },
        S: function () {
            return (
                this.getUTCDate() % 10 === 1 && this.getUTCDate() !== 11 ?
                'st' :
                (this.getUTCDate() % 10 === 2 && this.getUTCDate() !== 12 ? 'nd' :
                    (this.getUTCDate() % 10 === 3 && this.getUTCDate() !== 13 ? 'rd' : 'th')
                )
            );
        },
        w: function () {
            return this.getUTCDay();
        },
        z: function () {
            return '';
        },
        W: function () {
            return '';
        },
        F: function () {
            return Date.replaceChars.longMonths[this.getUTCMonth()];
        },
        m: function () {
            return (this.getUTCMonth() < 9 ? '0' : '') + (this.getUTCMonth() + 1);
        },
        M: function () {
            return Date.replaceChars.shortMonths[this.getUTCMonth()];
        },
        n: function () {
            return this.getUTCMonth() + 1;
        },
        t: function () {
            return '';
        },
        L: function () {
            return '';
        },
        o: function () {
            return '';
        },
        Y: function () {
            return this.getUTCFullYear();
        },
        y: function () {
            return ('' + this.getUTCFullYear()).substr(2);
        },
        a: function () {
            var set = _hasOwnProperty(localize, 'setting') ? localize.setting : setting;
            return this.getUTCHours() < 12 ? set.AM : set.PM;
        },
        A: function () {
            var set = _hasOwnProperty(localize, 'setting') ? localize.setting : setting;
            return this.getUTCHours() < 12 ? set.AM : set.PM;
        },
        B: function () {
            return '';
        },
        g: function () {
            return this.getUTCHours() %12 || 12;
        },
        G: function () {
            return this.getUTCHours();
        },
        h: function () {
            return ((this.getUTCHours() % 12 || 12 ) < 10 ? '0' : '' ) +
                    (this.getUTCHours() %12 || 12);
        },
        H: function () {
            return (this.getUTCHours() < 10 ? '0' : '') + this.getUTCHours();
        },
        i: function () {
            return (this.getUTCMinutes() < 10 ? '0' : '') +
            this.getUTCMinutes();
        },
        s: function () {
            return (this.getUTCSeconds() < 10 ? '0' : '') +
            this.getUTCSeconds();
        },
        e: function () {
            return '';
        },
        I: function () {
            return '';
        },
        O: function () {
            return (-this.getTimezoneOffset() < 0 ? '-' : '+') +
            (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') +
            (Math.abs(this.getTimezoneOffset() / 60)) + '00';
        },
        T: function () {
            var m = this.getUTCMonth();
            this.setMonth(0);
            var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1');
            this.setMonth(m);
            return result;
        },
        Z: function () {
            return -this.getTimezoneOffset() * 60;
        },
        c: function () {
            return '';
        },
        r: function () {
            return this.toString();
        },
        U: function () {
            return this.getUTCTime() / 1000;
        }
    };

    /**
     * Similar the ASP Dateadd function
     */
    var DateAdd = function (interval, number, date ) {
        var d;
        number = parseInt(number, 10);
        if ('string' === typeof date) {
            date = date.split(/\D/);
            date[1] -= 1;
            d = new Date(date.join(','));
        }
        d = ('object' === typeof d) ? d : date;
        switch (interval) {
        case 'y':
            d.setFullYear(d.getFullYear() + number);
            break;
        case 'm':
            d.setMonth(d.getMonth() + number);
            break;
        case 'd':
            d.setDate(d.getDate() + number);
            break;
        case 'w':
            d.setDate(d.getDate() + 7 * number);
            break;
        case 'h':
            d.setHours(d.getHours() + number);
            break;
        case 'n':
            d.setMinutes(d.getMinutes() + number);
            break;
        case 's':
            d.setSeconds(d.getSeconds() + number);
            break;
        case 'l':
            d.setMilliseconds(d.getMilliseconds() + number);
            break;
        }
        return d;
    };

    /**
     * Public functions
     */
    return {

        /**
         * i18n setting
         */
        set: function (options) {
            if ('object' === typeof options) {
                lang = _hasOwnProperty(options, 'lang') ? options.lang : null;
                path = _hasOwnProperty(options, 'path') ? options.path : path;
            }
            //console.log(lang)
            //console.log(path)
            localize = locale(lang || (navigator.browserLanguage || navigator.language).toLowerCase());
            //console.log(localize)
        },

        /**
         * Core of the datetime replace
         */
        datetime: function (d) {
            var set = _hasOwnProperty(localize, 'setting') ?
                      localize.setting :
                      setting,
                r   = set.format ?
                      DateAdd('h', set.UTC, d ? new Date(d) : new Date()) :
                      (d ? new Date(d) : new Date());
            return r.format(set.format);
        },
        
        needTransStrAry: [],
        needTransTimer: null,
        
        needTrans: function (str) {
          if (NeedTransDone === true) {
            return
          }
          if (this.needTransStrAry.indexOf(str) > -1) {
            return
          }
          this.needTransStrAry.push(str)
          if (typeof(NeedTransTimer) !== 'undefined') {
            clearTimeout(NeedTransTimer)
          }
          var _this = this
          NeedTransTimer = setTimeout(function () {
            _this.printNeedTrans()
            //clearTimeout(this.needTransTimer)
          }, 3000)
        },
        printNeedTrans: function () {
          //console.log(this.needTransStrAry)
          for (var i = 0; i < this.needTransStrAry.length; i++) {
            var str = this.needTransStrAry[i]
            str = '"' + str + '": "' + str + '"'
            this.needTransStrAry[i] = str
          }
          console.log(this.needTransStrAry.join(',\n'))
          this.needTransStrAry = []
          NeedTransDone = true
        },

        /**
         * Core of the strings replace
         */
        t: function (string, allow_nest) {
            if (allow_nest === undefined) {
                allow_nest = true;
            }
            try {
                string = string.toString() || '';
                var args = arguments,
                    pattern = (args.length > 0) ?
                              new RegExp('%([1-' + args.length.toString() + '])', 'g') :
                              null,
                    str = '';
                    /*
                    array = ~string.indexOf('.') ?
                            string.split(/\./gi) :
                            string;
                    */
                var array = string;
                if (allow_nest === true) {
                    array = ~string.indexOf('.') ?
                            string.split(/\./gi) :
                            string;
                }

                if ('string' === typeof array) {
                  //console.log(localize)
                  //console.log(_hasOwnProperty(localize, array))
                  //console.log(array)
                  if (_hasOwnProperty(localize, array) === false) {
                    this.needTrans(array)
                  }
                  
                    str = _hasOwnProperty(localize, array) ?
                          localize[array] :
                          array;
                } else if (Object.prototype.toString.call(array) === '[object Array]' && 2 === array.length) {
                    str = _hasOwnProperty(localize, array[0]) ?
                          (
                              _hasOwnProperty(localize[array[0]], array[1]) ?
                              localize[array[0]][array[1]] :
                              array.join('.')
                          ) :
                          array.join('.');
                }
                return String(str).replace(pattern, function (match, index) {
                    return args[index];
                });
            } catch (ignore) {
                console.dir(ignore);
                console.log(ignore);
            }
        }
    };
}(window));
//#EOF


NeedTransTimer = null
NeedTransDone = false