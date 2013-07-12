/* * * * * * * * * *
 *  parseTime .js  *
 *  Version 0.1.2  *
 *  License:  MIT  *
 * Simon  Waldherr *
 * * * * * * * * * */

/*jslint browser: true, indent: 2 */

var parseTime = function (string) {
  "use strict";
  var re,
    lang,
    encoded,
    timedif,
    integer,
    unit,
    regex = {},
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
          'day' : 8640000,
          'week' : 604800000,
          'month' : 2592000000,
          'quarter' : 7776000000,
          'year' : 31536000000,
          'decade' : 315360000000
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
      regex[lang] += ')?';
      regex[lang] += adWordsToRegex('fillfoo', false);
      regex[lang] += ')*(';
      regex[lang] += adWordsToRegex('fillwords', true);
      regex[lang] += ')*(';
      regex[lang] += adWordsToRegex('fillfoo', true);
      regex[lang] += ')+)';
    }
  }

  for (lang in regex) {
    if (regex[lang] !== undefined) {
      re = new RegExp(regex[lang], "i");
      encoded = re.exec(string);
      timedif = 0;
      if (encoded !== null) {
        if (encoded[8] !== undefined) {
          integer = (isNaN(parseInt(encoded[5], 10))) ? words[lang].numbers[encoded[5]] : parseInt(encoded[5], 10);
          unit = words[lang].unit[encoded[8].toLowerCase()];
          timedif = integer * unit;
          if (encoded.indexOf(words[lang].fillwords[0]) !== -1) {
            timedif = (0 - timedif);
          }
          return JSON.stringify([encoded, timedif]);
        }
      }
    }
  }
};
