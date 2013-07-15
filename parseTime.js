/* * * * * * * * * *
 *  parseTime .js  *
 *  Version 0.2.1  *
 *  License:  MIT  *
 * Simon  Waldherr *
 * * * * * * * * * */

/*jslint browser: true, indent: 2 */
/*exported parseTime */

var parseTime = function (string, now) {
  "use strict";
  var re,
    lang,
    encoded,
    timedif,
    integer,
    pbint,
    unit,
    word,
    words,
    hhmmss,
    tzoffset,
    ddmmyyyy = {},
    dateO = {},
    regex = {},
    adWordsToRegex = function (fillfoo, first) {
      var returnval = '', i;
      for (i in words[lang][fillfoo]) {
        if (words[lang][fillfoo][i] !== undefined) {
          if (first === false) {
            returnval += '|';
          } else {
            first = false;
          }
          returnval += i;
        }
      }
      return returnval;
    };

  if (now === undefined) {
    now = new Date().getTime();
  } else if (typeof now === 'object') {
    now = now.getTime();
  }
  string = string.toLowerCase().replace(/["'<>\(\)]/gm, '').replace(/(\d)([A-Za-z])/, "$1 $2", "gm");
  now = parseInt(now, 10);
  if (string === 'now' || string === 'jetzt') {
    return {
      'absolute': Date.now(),
      'relative': 0,
      'mode': 'now',
      'pb': 1
    };
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
  regex = {};
  words = {
    de: {
      numbers: {
        'null' : 0,
        'ein' : 1,
        'zwei' : 2,
        'drei' : 3,
        'ein paar' : 3.5,
        'vier' : 4,
        'fünf' : 5,
        'sechs' : 6,
        'sieben' : 7,
        'acht' : 8,
        'neun' : 9,
        'zehn' : 10,
        'elf' : 11,
        'zwölf' : 12,
        'dreizehn' : 13,
        'vierzehn' : 14,
        'fünfzehn' : 15,
        'sechzehn' : 16,
        'siebzehn' : 17,
        'achzehn' : 18,
        'neinzehn' : 19,
        'zwanzig' : 20,
        'dreißig' : 30,
        'vierzig' : 40,
        'fünfzig' : 50,
        'sechzig' : 60,
        'siebzig' : 70,
        'achtzig' : 80,
        'neunzig' : 90,
        'hundert' : 100,
        'tausend' : 1000,
        'million' : 1000000
      },
      countable: {
        'vorgestern' : -172800000,
        'gestern' : -86400000,
        'heute' : 1,
        'übermorgen' : 172800000,
        'morgen' : 86400000
      },
      daytime: {
        'morgendämmerung': '04:00',
        'tagesanbruch': '04:00',
        'morgen': '06:00',
        'nachmittag': '15:00',
        'mittag': '12:00',
        'präabend': '17:00',
        'abend': '19:00',
        'dämmerung': '20:00',
        'mitternacht': '24:00',
        'nacht': '22:00'
      },
      unit: {
        'millisekunde' : 1,
        'sekunde' : 1000,
        'minute' : 60000,
        'stunde' : 3600000,
        'tag' : 8640000,
        'woche' : 604800000,
        'monat' : 2592000000,
        'quartal' : 7776000000,
        'jahr' : 31536000000,
        'dekade' : 315360000000
      },
      fillwords: {
        'vor' : '-',
        'in' : '+'
      },
      fillfoo: {
        '\\-' : '',
        '\\ ' : '',
        'e' : '',
        'en' : '',
        'er' : '',
        'n' : ''
      }
    },
    en: {
      numbers: {
        'zero' : 0,
        'one' : 1,
        'two' : 2,
        'three' : 3,
        'a few' : 3.5,
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
        'before yesterday' : -172800000,
        'yesterday' : -86400000,
        'today' : 1,
        'day after tomorrow' : 172800000,
        'tomorrow' : 86400000
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
  };
  hhmmss = /((\d\d)\.(\d\d)\.(\d\d\d\d) (\d\d):(\d\d):(\d\d))/.exec(string);
  // [0]  : full
  // [1]  : full
  // [2]  : day
  // [3]  : month
  // [4]  : year
  // [5]  : hour
  // [6]  : minute
  // [7]  : second
  if (hhmmss !== null) {
    dateO.day = hhmmss[2].length === 1 ? '0' + hhmmss[2] : hhmmss[2];
    dateO.month = hhmmss[3].length === 1 ? '0' + hhmmss[3] : hhmmss[3];
    dateO.year = hhmmss[4].length === 2 ? '20' + hhmmss[4] : hhmmss[4];
    dateO.hour = hhmmss[5].length === 1 ? '0' + hhmmss[5] : hhmmss[5];
    dateO.minute = hhmmss[6].length === 1 ? '0' + hhmmss[6] : hhmmss[6];
    dateO.second = hhmmss[7].length === 1 ? '0' + hhmmss[7] : hhmmss[7];
    pbint = 3;
  } else {
    hhmmss = /((\S+\s){0,4}(\d{1,2})((:(\d{1,2})(:(\d{1,2})(\.(\d{1,4}))?)?)|( uhr| oclock)))/.exec(string);
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
  if (dateO.hour !== undefined) {
    for (lang in words) {
      if (words[lang] !== undefined) {
        for (word in words[lang].countable) {
          if (words[lang].countable[word] !== undefined) {
            if (dateO.countable !== undefined) {
              if (dateO.countable.indexOf(word) !== -1 && dateO.countableint === undefined) {
                dateO.countableint = words[lang].countable[word];
              }
            }
          }
        }
      }
    }
  } else {
    for (lang in words) {
      if (words[lang] !== undefined) {
        for (word in words[lang].daytime) {
          if (words[lang].daytime[word] !== undefined) {
            if (dateO.countable !== undefined) {
              dateO.countable = dateO.countable.trim();
              if ((dateO.countable.indexOf(word) !== -1) && (dateO.countableint === undefined)) {
                dateO.countableint = 0;
                dateO.hour = words[lang].daytime[word].split(':')[0];
                dateO.minute = words[lang].daytime[word].split(':')[1];
                dateO.second = '00';
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

  string = ' ' + string + ' ';
  for (lang in words) {
    if (words[lang] !== undefined) {
      regex[lang] = '((';
      regex[lang] += adWordsToRegex('fillfoo', true);
      regex[lang] += ')+(';
      regex[lang] += adWordsToRegex('fillwords', true);
      regex[lang] += ')*(';
      regex[lang] += adWordsToRegex('fillfoo', true);
      regex[lang] += ')*(\\d+';
      regex[lang] += adWordsToRegex('numbers', false);
      regex[lang] += ')+(';
      regex[lang] += adWordsToRegex('fillfoo', true);
      regex[lang] += ')*((';
      regex[lang] += adWordsToRegex('unit', true);
      regex[lang] += ')(';
      regex[lang] += adWordsToRegex('fillfoo', true);
      regex[lang] += ')*';
      regex[lang] += adWordsToRegex('fillfoo', false);
      regex[lang] += ')*(';
      regex[lang] += adWordsToRegex('fillwords', true);
      regex[lang] += ')*(';
      regex[lang] += adWordsToRegex('fillfoo', true);
      regex[lang] += ')+)';
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

  for (lang in regex) {
    // if regex is builded
    if (regex[lang] !== undefined) {
      re = new RegExp(regex[lang]);
      encoded = re.exec(string);
      timedif = 0;
      // if regex matches
      if (encoded !== null) {
        // if unit matches
        if (encoded[8] !== undefined) {
          integer = (isNaN(parseInt(encoded[5], 10))) ? words[lang].numbers[encoded[5]] : parseInt(encoded[5], 10);
          unit = words[lang].unit[encoded[8].toLowerCase()];
          timedif = integer * unit;
          // if fillwords can be found in match-array
          if (encoded.indexOf(Object.keys(words[lang].fillwords)[0]) !== -1) {
            dateO.parsed = -timedif;
            return {
              'absolute': (now - timedif),
              'relative': dateO.parsed,
              'mode': 'relative',
              'pb': 6
            };
          }
          return {
            'absolute': (now + timedif),
            'relative': timedif,
            'mode': 'relative',
            'pb': 7
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
    pbint = 8;
  } else {
    ddmmyyyy.match = /(\d\d(\d\d)?)[\/\-](\d\d?)[\/\-](\d\d?)/.exec(string);
    if (ddmmyyyy.match !== null) {
      ddmmyyyy.day = ddmmyyyy.match[4];
      ddmmyyyy.month = ddmmyyyy.match[3];
      ddmmyyyy.year = ddmmyyyy.match[1];
      pbint = 9;
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
