/*jslint browser: true, indent: 2 */
/*global parseTime, disTime, languages */

var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  language = navigator.language || navigator.languageuage,
  config = {'lang' : language, 'time' : '60*60*24', 'detail' : 1},
  now = new Date().getTime();

if (languages[language] === undefined) {
  if (languages[language.split('-')[0]] !== undefined) {
    language = language.split('-')[0];
  } else {
    language = 'en';
  }
}

function random(min, max) {
  "use strict";
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function demo() {
  "use strict";
  var ret = '',
    ldate,
    ltime,
    lday,
    ele = document.getElementById('ret'),
    inp = document.getElementById('inp').value,
    retvalue = parseTime(inp);
  now = new Date().getTime();
  now = parseInt(now, 10) * 1000;

  if ((retvalue !== undefined) && (retvalue.absolute !== false)) {
    ldate = new Date(retvalue.absolute).toLocaleDateString();
    ltime = new Date(retvalue.absolute).toLocaleTimeString();
    lday = weekdays[new Date(retvalue.absolute).getDay()];
    ret += JSON.stringify(retvalue);
    ret += '<br/> ' + lday + ' ' + ldate + ' ' + ltime;
    ret += '<div class="distime" data-time="' + retvalue.absolute / 1000 + '"></div>';
    ele.style.color = 'black';
  } else {
    ret += 'not parsable';
    ele.style.color = 'red';
  }
  ele.innerHTML = ret;
}

window.onload = function () {
  "use strict";
  var i,
    retvalue,
    ldate,
    ltime,
    lday,
    eles = document.getElementsByTagName('p');

  for (i = 0; i < eles.length; i += 1) {
    retvalue = parseTime(eles[i].textContent);
    eles[i].innerHTML = '<i></i>' + eles[i].innerHTML;
    if ((retvalue !== undefined) && (retvalue.absolute !== false)) {
      ldate = new Date(retvalue.absolute).toLocaleDateString();
      ltime = new Date(retvalue.absolute).toLocaleTimeString();
      lday = weekdays[new Date(retvalue.absolute).getDay()];
      eles[i].innerHTML += '<br/> ' + JSON.stringify(retvalue, null, '  ');
      eles[i].innerHTML += '<br/> ' + lday + ' ' + ldate + ' ' + ltime;
      eles[i].innerHTML += '<div class="distime" data-time="' + retvalue.absolute / 1000 + '"></div>';
    } else {
      eles[i].style.color = 'red';
      eles[i].innerHTML += '<br/> not parsable';
    }
  }
  demo();
  disTime(0, language, 1);
};
