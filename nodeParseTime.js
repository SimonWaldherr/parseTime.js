var pt = require('./dist/parseTime.js'),
  colors = require('colors'),
  tests = []
  fail = false;

process.env.TZ = 'Europe/Berlin';

tests = [
  {'name': 'yesterday', 'input': 'yesterday', 'mode':'relative', 'output': -86400000},
  {'name': 'birthday', 'input': '06.06.1989', 'mode':'absolute', 'output': 613087200000}];

for(i in tests) {
  if(pt(tests[i].input)[tests[i].mode] === tests[i].output) {
    console.log(tests[i].name.green);
  } else {
    console.log(tests[i].name.red + " should be: " + tests[i].output + " but is: " + pt(tests[i].input)[tests[i].mode]);
    fail = true
  }
}

if(fail == true) {
  process.exit(1);
}
