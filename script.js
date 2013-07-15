/*jslint browser: true, indent: 2 */
/*global parseTime */

var now = new Date().getTime(),
  weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

window.onload = function () {
  "use strict";
  var i,
    retvalue,
    ldate,
    ltime,
    lday,
    eles = document.getElementsByTagName('p');

  for (i = 0; i < eles.length; i += 1) {
    retvalue = parseTime(eles[i].textContent, now);
    if ((retvalue !== undefined) && (retvalue.absolute !== false)) {
      ldate = new Date(retvalue.absolute).toLocaleDateString();
      ltime = new Date(retvalue.absolute).toLocaleTimeString();
      lday = weekdays[new Date(retvalue.absolute).getDay()];
      eles[i].innerHTML += '<br/> ' + JSON.stringify(retvalue, null, '  ');
      eles[i].innerHTML += '<br/> ' + lday + ' ' + ldate + ' ' + ltime;
    } else {
      eles[i].style.color = 'red';
      eles[i].innerHTML += '<br/> not parsable';
    }
  }
  demo();
};
function demo() {
  "use strict";
  var ret = '',
    ldate,
    ltime,
    lday,
    ele = document.getElementById('ret'),
    inp = document.getElementById('inp').value,
    retvalue = parseTime(inp, now);

  if ((retvalue !== undefined) && (retvalue.absolute !== false)) {
    ldate = new Date(retvalue.absolute).toLocaleDateString();
    ltime = new Date(retvalue.absolute).toLocaleTimeString();
    lday = weekdays[new Date(retvalue.absolute).getDay()];
    ret += JSON.stringify(retvalue);
    ret += '<br/> ' + lday + ' ' + ldate + ' ' + ltime;
    ele.style.color = 'black';
  } else {
    ret += 'not parsable';
    ele.style.color = 'red';
  }
  ele.innerHTML = ret;
}
