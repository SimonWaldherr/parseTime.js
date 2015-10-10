/* * * * * * * * * *
 *  parseTime .js  *
 *  Version 0.2.9  *
 *  License:  MIT  *
 * Simon  Waldherr *
 * * * * * * * * * */

/*jslint browser: true, indent: 2, forin: true */
/*exported parseTime              */

var parseTimeObject = {
  words: {
    en: {
      currently: ['now'],
      clockwords: [
        'oclock',
        'o\'clock'
      ],
      numbers: {
        'zero' : 0,
        'one' : 1,
        'two' : 2,
        'three' : 3,
        'a few' : 3.5,
        'some' : 3.5,
        'four' : 4,
        'five' : 5,
        'six' : 6,
        'seven' : 7,
        'eight' : 8,
        'nine' : 9,
        'ten' : 10,
        'eleven' : 11,
        'twelve' : 12,
        'thirteen' : 13,
        'fourteen' : 14,
        'fifteen' : 15,
        'sixteen' : 16,
        'seventeen' : 17,
        'eighteen' : 18,
        'nineteen' : 19,
        'twenty' : 20,
        'thirty' : 30,
        'forty' : 40,
        'fifty' : 50,
        'sixty' : 60,
        'seventy' : 70,
        'eighty' : 80,
        'ninety' : 90,
        'hundred' : 100,
        'thousend' : 1000,
        'million' : 1000000
      },
      unit: {
        'millisecond' : 1,
        'second' : 1000,
        'minute' : 60000,
        'hour' : 3600000,
        'day' : 86400000,
        'week' : 604800000,
        'month' : 2592000000,
        'quarter' : 7776000000,
        'year' : 31536000000,
        'decade' : 315360000000
      },
      countable: {
        'before yesterday' : -17280000,
        'yesterday' : -8640000,
        'today' : 1,
        'day after tomorrow' : 17280000,
        'tomorrow' : 8640000,
        'in a week' : 60480000,
        'last week' : -60480000
      },
      month: {
        'jan' : '01',
        'feb' : '02',
        'mar' : '03',
        'apr' : '04',
        'may' : '05',
        'jun' : '06',
        'jul' : '07',
        'aug' : '08',
        'sep' : '09',
        'oct' : '10',
        'nov' : '11',
        'dec' : '12'
      },
      daytime: {
        'dawn': '04:00',
        'morning': '06:00',
        'afternoon': '15:00',
        'noon': '12:00',
        'midday': '12:00',
        'pre-evening': '17:00',
        'preevening': '17:00',
        'evening': '19:00',
        'dusk': '20:00',
        'midnight': '24:00',
        'night': '22:00'
      },
      fillwords: {
        'ago' : '-',
        'in' : '+'
      },
      fillfoo: {
        's' : '',
        '\\-' : '',
        '\\ ' : '',
        '\\.' : ''
      }
    }
  },
  regexes: {}
}, parseTime = function (string, now) {
  "use strict";
  var re,
    lang,
    encoded,
    timedif,
    integer,
    pbint,
    unit,
    word,
    val,
    hhmmss,
    hhmmss2,
    tzoffset,
    timeregex,
    word_for_now,
    cur_lang,
    implicit_date,
    clockwords = '',
    ddmmyyyy = {},
    dateO = {},
    adWordsToRegex = function (fillfoo, first) {
      var returnval = '',
        i;

      for (i in parseTimeObject.words[lang][fillfoo]) {
        if (parseTimeObject.words[lang][fillfoo][i] !== undefined) {
          if (first === false) {
            returnval += '|';
          } else {
            first = false;
          }
          returnval += i;
        }
      }
      return returnval;
    },
    objectKeyInString = function (obj, str) {
      var i,
        ret = {},
        retbool,
        keys = Object.keys(obj);

      for (i = 0; i < keys.length; i += 1) {
        if (str.indexOf(keys[i]) !== -1) {
          ret[keys[i]] = str.indexOf(keys[i]);
          retbool = true;
        }
      }
      if (retbool) {
        return ret;
      }
      return false;
    };

  if (now === undefined) {
    now = new Date().getTime();
  } else if (typeof now === 'object') {
    now = now.getTime();
  }
  string = string.toLowerCase().replace(/["'<>\(\)]/gm, '').replace(/(\d)([A-Za-z])/, "$1 $2", "gm");
  string = string.replace(/([^\x00-\x7F])/gm, encodeURIComponent);

  now = parseInt(now, 10);

  for (lang in parseTimeObject.words) {
    if (parseTimeObject.words.length !== 0) {
      cur_lang = parseTimeObject.words[lang];
      for (implicit_date in cur_lang.countable) {
        if (string === implicit_date) {
          val = cur_lang.countable[implicit_date];
          if (val > 0) {
            string = 'in ' + (val / 100) + ' seconds';
          } else {
            string = (val / 100) + ' seconds ago';
          }
        }
      }
      for (word_for_now in cur_lang.currently) {
        if (string === cur_lang.currently[word_for_now]) {
          return {
            'absolute': Date.now(),
            'relative': 0,
            'mode': 'now',
            'pb': 1
          };
        }
      }
    }
  }
  dateO.parsed = new Date();
  dateO.parsed = new Date(Date.parse(string.replace(/((\d{1,2})(th |rd |ter ))/, "$2 ", "gm")));
  if (!isNaN(dateO.parsed)) {
    if (string.indexOf(dateO.parsed.getFullYear()) === -1) {
      dateO.now = new Date();
      dateO.now = Date.parse(now);
      if (!isNaN(dateO.now)) {
        dateO.parsed.setFullYear(dateO.now.getFullYear());
        dateO.parsed.setTime(dateO.parsed.getTime() + 86400000);
      }
    }
    dateO.parsed = dateO.parsed.getTime();
    return {
      'absolute': dateO.parsed,
      'relative': (dateO.parsed - now),
      'mode': 'absolute',
      'pb': 2
    };
  }

  for (lang in parseTimeObject.words) {
    if (clockwords !== '') {
      clockwords += '|';
    }
    clockwords += ' ' + parseTimeObject.words[lang].clockwords.join('| ');
  }

  timeregex = new RegExp('((\\S+\\s){0,4}(\\d{1,2})((:(\\d{1,2})(:(\\d{1,2})(\\.(\\d{1,4}))?)?)|(' + clockwords + ')))');

  hhmmss = /((\d\d)\.(\d\d)\.(\d\d\d\d)[ \D]+(\d\d(:\d\d(:\d\d)?)?(\s\S+)?))/.exec(string);
  // [0]  : full
  // [1]  : full
  // [2]  : day
  // [3]  : month
  // [4]  : year
  // [5]  : hour
  // [6]  : minute
  // [7]  : second
  if (hhmmss !== null) {
    hhmmss2 =  timeregex.exec(hhmmss[5]) || hhmmss;
    dateO.day = hhmmss[2].length === 1 ? '0' + hhmmss[2] : hhmmss[2];
    dateO.month = hhmmss[3].length === 1 ? '0' + hhmmss[3] : hhmmss[3];
    dateO.year = hhmmss[4].length === 2 ? '20' + hhmmss[4] : hhmmss[4];
    dateO.hour = hhmmss2[3] === undefined ? '12' : hhmmss2[3].length === 1 ? '0' + hhmmss2[3] : hhmmss2[3];
    dateO.minute = hhmmss2[6] === undefined ? '00' : hhmmss2[6].length === 1 ? '0' + hhmmss2[6] : hhmmss2[6];
    dateO.second = hhmmss2[7] === undefined ? '00' : hhmmss2[7].length === 1 ? '0' + hhmmss2[7] : hhmmss2[7];
    dateO.second = dateO.second.replace(':', '');
    pbint = 3;
  } else {
    hhmmss = timeregex.exec(string);
    // [0]  : full
    // [1]  : full
    // [2]  : countable (yesterday)
    // [3]  : hour
    // [4]  : o'clock | :min:sec
    // [5]  : :min:sec
    // [6]  : minute
    // [7]  : :second
    // [8]  : second
    if (hhmmss !== null) {
      dateO.countable = hhmmss[0];
      dateO.hour = hhmmss[3] === undefined ? '12' : hhmmss[3].length === 1 ? '0' + hhmmss[3] : hhmmss[3];
      dateO.minute = hhmmss[6] === undefined ? '00' : hhmmss[6].length === 1 ? '0' + hhmmss[6] : hhmmss[6];
      dateO.second = hhmmss[7] === undefined ? '00' : hhmmss[7].length === 1 ? '0' + hhmmss[7] : hhmmss[7];
      dateO.second = dateO.second.replace(':', '');
      pbint = 4;
    } else {
      hhmmss = /((\d\d)[\.:,\/](\d\d)[\.:,\/](\d\d\d\d)(\s\S+){0,4})/.exec(string);
      // [0]  : full
      // [1]  : full
      // [2]  : day
      // [3]  : month
      // [4]  : year
      // [5]  : daytime (evening)
      if (hhmmss !== null) {
        dateO.day = hhmmss[2].length === 1 ? '0' + hhmmss[2] : hhmmss[2];
        dateO.month = hhmmss[3].length === 1 ? '0' + hhmmss[3] : hhmmss[3];
        dateO.year = hhmmss[4].length === 2 ? '20' + hhmmss[4] : hhmmss[4];
        dateO.countable = hhmmss[5];
        pbint = 5;
      }
    }
  }

  string = ' ' + string + ' ';

  if (dateO.hour !== undefined) {
    for (lang in parseTimeObject.words) {
      if (parseTimeObject.words[lang] !== undefined) {
        for (word in parseTimeObject.words[lang].countable) {
          if (parseTimeObject.words[lang].countable[word] !== undefined) {
            if (dateO.countable !== undefined) {
              if (dateO.countable.indexOf(word) !== -1 && dateO.countableint === undefined) {
                dateO.countableint = parseTimeObject.words[lang].countable[word];
              }
            }
          }
        }
      }
    }
  } else {
    for (lang in parseTimeObject.words) {
      if (parseTimeObject.words[lang] !== undefined) {
        for (word in parseTimeObject.words[lang].daytime) {
          if (parseTimeObject.words[lang].daytime[word] !== undefined) {
            if (dateO.countable !== undefined) {
              dateO.countable = dateO.countable.trim();
              if ((dateO.countable.indexOf(word) !== -1) && (dateO.countableint === undefined)) {
                dateO.countableint = 0;
                dateO.hour = parseTimeObject.words[lang].daytime[word].split(':')[0];
                dateO.minute = parseTimeObject.words[lang].daytime[word].split(':')[1];
                dateO.second = '00';
                pbint = 6;
              }
            } else if ((string.indexOf(word) !== -1) && (objectKeyInString(parseTimeObject.words[lang].countable, string) !== false)) {
              hhmmss = word;
              word = objectKeyInString(parseTimeObject.words[lang].countable, string);
              word = Object.keys(word)[0];
              if (word !== undefined) {
                if (word !== hhmmss) {
                  dateO.countable = word;
                  dateO.countableint = parseTimeObject.words[lang].countable[word];
                  hhmmss = parseTimeObject.words[lang].daytime[hhmmss];
                  dateO.hour = hhmmss.split(':')[0];
                  dateO.minute = hhmmss.split(':')[1];
                  dateO.second = '00';
                  pbint = 7;
                }
              }
            }
          }
        }
      }
    }
  }
  if (dateO.countableint !== undefined) {
    dateO.now = new Date(now + dateO.countableint).getTime();
  } else {
    dateO.now = new Date(now).getTime();
  }
  if (dateO.year === undefined) {
    dateO.parsed = new Date();
    dateO.parsed.setTime(dateO.now);
    dateO.day = dateO.parsed.getDate().toString();
    dateO.month = (dateO.parsed.getMonth() + 1).toString();
    dateO.year = (dateO.parsed.getFullYear()).toString();
    dateO.day = dateO.day.length === 1 ? '0' + dateO.day : dateO.day;
    dateO.month = dateO.month.length === 1 ? '0' + dateO.month : dateO.month;
    dateO.today = dateO.year + '-' + dateO.month + '-' + dateO.day;
  } else {
    dateO.today = dateO.year + '-' + dateO.month + '-' + dateO.day;
  }
  if (dateO.hour !== undefined) {
    dateO.string = dateO.today + 'T' + dateO.hour + ':' + dateO.minute + ':' + dateO.second + '+00:00';
    dateO.parsed = new Date();
    dateO.parsed = Date.parse(dateO.string);
  } else if ((dateO.day !== undefined) && (dateO.today !== undefined)) {
    dateO.string = dateO.today + 'T12:00:00+00:00';
    dateO.parsed = new Date();
    dateO.parsed = Date.parse(dateO.string);
  }

  if ((typeof dateO.parsed === 'number') && (pbint !== undefined)) {
    if (!isNaN(dateO.parsed)) {
      tzoffset = new Date().getTimezoneOffset() * -30000;
      if ((pbint === 3) || (pbint === 5)) {
        dateO.parsed = dateO.parsed - tzoffset;
      } else if (pbint === 4) {
        dateO.parsed = dateO.parsed - tzoffset * 2;
      }
      return {
        'absolute': dateO.parsed,
        'relative': dateO.parsed - now,
        'mode': 'absolute',
        'pb': pbint
      };
    }
  }

  for (lang in parseTimeObject.words) {
    if (parseTimeObject.words[lang] !== undefined) {
      parseTimeObject.regexes[lang] = '((';
      parseTimeObject.regexes[lang] += adWordsToRegex('fillfoo', true);
      parseTimeObject.regexes[lang] += ')+(';
      parseTimeObject.regexes[lang] += adWordsToRegex('fillwords', true);
      parseTimeObject.regexes[lang] += ')*(';
      parseTimeObject.regexes[lang] += adWordsToRegex('fillfoo', true);
      parseTimeObject.regexes[lang] += ')*(\\d+';
      parseTimeObject.regexes[lang] += adWordsToRegex('numbers', false);
      parseTimeObject.regexes[lang] += ')+(';
      parseTimeObject.regexes[lang] += adWordsToRegex('fillfoo', true);
      parseTimeObject.regexes[lang] += ')*((';
      parseTimeObject.regexes[lang] += adWordsToRegex('unit', true);
      parseTimeObject.regexes[lang] += ')(';
      parseTimeObject.regexes[lang] += adWordsToRegex('fillfoo', true);
      parseTimeObject.regexes[lang] += ')*';
      parseTimeObject.regexes[lang] += adWordsToRegex('fillfoo', false);
      parseTimeObject.regexes[lang] += ')*(';
      parseTimeObject.regexes[lang] += adWordsToRegex('fillwords', true);
      parseTimeObject.regexes[lang] += ')*(';
      parseTimeObject.regexes[lang] += adWordsToRegex('fillfoo', true);
      parseTimeObject.regexes[lang] += ')+)';
    }
  }
  // [0]  : unimportant
  // [1]  : unimportant
  // [2]  : unimportant
  // [3]  : fillwords (mostly future)
  // [4]  : unimportant
  // [5]  : numbers (string or int)
  // [6]  : unimportant
  // [7]  : unit (multiple)
  // [8]  : unit
  // [9]  : fillwords (mostly past)
  // [10] : unimportant

  for (lang in parseTimeObject.regexes) {
    // if regexes is builded
    if (parseTimeObject.regexes[lang] !== undefined) {
      re = new RegExp(parseTimeObject.regexes[lang]);
      encoded = re.exec(string);
      timedif = 0;
      // if regex matches
      if (encoded !== null) {
        // if unit matches
        if (encoded[8] !== undefined) {
          integer = (isNaN(parseInt(encoded[5], 10))) ? parseTimeObject.words[lang].numbers[encoded[5]] : parseInt(encoded[5], 10);
          unit = parseTimeObject.words[lang].unit[encoded[8].toLowerCase()];
          timedif = integer * unit;
          // if fillwords can be found in match-array
          if (encoded.indexOf(Object.keys(parseTimeObject.words[lang].fillwords)[0]) !== -1) {
            dateO.parsed = -timedif;
            return {
              'absolute': (now - timedif),
              'relative': dateO.parsed,
              'mode': 'relative',
              'pb': 8
            };
          }
          return {
            'absolute': (now + timedif),
            'relative': timedif,
            'mode': 'relative',
            'pb': 9
          };
        }
      }
    }
  }
  ddmmyyyy.match = /(\d\d?)[,\.](\d\d?)[,\.](\d\d(\d\d)?)/.exec(string);
  if (ddmmyyyy.match !== null) {
    ddmmyyyy.day = ddmmyyyy.match[1];
    ddmmyyyy.month = ddmmyyyy.match[2];
    ddmmyyyy.year = ddmmyyyy.match[3];
    pbint = 10;
  } else {
    ddmmyyyy.match = /(\d\d(\d\d)?)[\/\-](\d\d?)[\/\-](\d\d?)/.exec(string);
    if (ddmmyyyy.match !== null) {
      ddmmyyyy.day = ddmmyyyy.match[4];
      ddmmyyyy.month = ddmmyyyy.match[3];
      ddmmyyyy.year = ddmmyyyy.match[1];
      pbint = 11;
    }
  }
  if (ddmmyyyy.day !== undefined) {
    ddmmyyyy.day = ddmmyyyy.day.length === 1 ? '0' + ddmmyyyy.day : ddmmyyyy.day;
    ddmmyyyy.month = ddmmyyyy.month.length === 1 ? '0' + ddmmyyyy.month : ddmmyyyy.month;
    ddmmyyyy.year = ddmmyyyy.year.length === 2 ? parseInt(ddmmyyyy.year, 10) > 70 ? '19' + ddmmyyyy.year : '20' + ddmmyyyy.year : ddmmyyyy.year;
    dateO.today = ddmmyyyy.year + '-' + ddmmyyyy.month + '-' + ddmmyyyy.day;
    dateO.string = dateO.today + 'T12:00:00+00:00';
    dateO.parsed = new Date();
    dateO.parsed = Date.parse(dateO.string);
    return {
      'absolute': dateO.parsed,
      'relative': dateO.parsed - now,
      'mode': 'absolute',
      'pb': pbint
    };
  }

  return {
    'absolute': false,
    'relative': false,
    'mode': 'error',
    'pb': false
  };
};

(function (root, factory) {
  "use strict";
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
}(this, function () {
  'use strict';
  return parseTime;
}));
