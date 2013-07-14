/*jslint browser: true, indent: 2 */
/*global parseTime */

window.onload = function () {
  "use strict";
  var i, retvalue, eles = document.getElementsByTagName('p'), now = new Date().getTime();
  for (i = 0; i < eles.length; i += 1) {
    retvalue = parseTime(eles[i].textContent, now);
    if ((retvalue !== undefined) && (retvalue.absolute !== false)) {
      eles[i].innerHTML += '<br/> ' + JSON.stringify(retvalue, null, '  ');
      eles[i].innerHTML += '<br/> ' + new Date(retvalue.absolute).toUTCString();
    } else {
      eles[i].style.color = 'red';
      eles[i].innerHTML += '<br/> not parsable';
    }
  }
};
function demo() {
  "use strict";
  var ret = '',
    ele = document.getElementById('ret'),
    inp = document.getElementById('inp').value,
    now = new Date().getTime(),
    retvalue = parseTime(inp, now);
  if ((retvalue !== undefined) && (retvalue.absolute !== false)) {
    ret += JSON.stringify(retvalue);
    ret += '<br/> ' + new Date(retvalue.absolute).toUTCString();
    ele.style.color = 'black';
  } else {
    ret += 'not parsable';
    ele.style.color = 'red';
  }
  ele.innerHTML = ret;
}
