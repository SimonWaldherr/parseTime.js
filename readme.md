# parseTime.js

convert strings like "five days ago" to an integer (with time in milliseconds (as relative value from now and as UNIX Timestamp)) in three languages (en, de, pt)  
*coders who like parseTime.js maybe also like [disTime.js](https://github.com/SimonWaldherr/disTime.js)*  

## about

License:   MIT  
Version: 0.2.9  
Date:  10.2015  

[![Build Status](https://travis-ci.org/SimonWaldherr/parseTime.js.svg?branch=master)](https://travis-ci.org/SimonWaldherr/parseTime.js)  

## install

```sh
npm install parsetime
```

## example

Node

```js
var parseTime = require('./dist/parseTime.js');
var timestamp = parseTime('06.06.89')['absolute'];
console.log(timestamp); // returns 613087200000
```

Browser

```html
<script src="//simonwaldherr.github.io/parseTime.js/dist/parseTime.min.js"></script>
<script>
var timestamp = parseTime('06.06.89');
console.log(timestamp['absolute']); // returns 613087200000
</script>
```

## demo

Test this code on the associated github page [simonwaldherr.github.com/parseTime.js/](http://simonwaldherr.github.com/parseTime.js/).  

## version

* 0.2.9) auto deploy to npm via travis and add example to readme
* 0.2.8) make it node compatible and add CI tests
* 0.2.7) language changes
* 0.2.6) bugfixes and minor improvements
* 0.2.5) added french (thanks to [@fdev31](https://github.com/fdev31))
* 0.2.4) added portuguese (thanks to [@tarciozemel](https://github.com/tarciozemel))
* 0.2.3) parse tomorrow morning and yesterday evening
* 0.2.2) build via grunt and lang in seperate files
* 0.2.1) parse non strict DIN1355-1 and other
* 0.2.0) should now work in fucking firefox
* 0.1.9) RFC2822 and ISO8601 fix (year and day)
* 0.1.8) parse "morning" and "evening"
* 0.1.7) regex fix and return false if not parsable
* 0.1.6) better DIN1355-1 handling and bugfixes
* 0.1.5) parse DIN1355-1 and strings like "tomorrow"
* 0.1.4) unit indexOf fix
* 0.1.3) parse RFC2822 and ISO8601
* 0.1.2) smaller valid code
* 0.1.1) beautified
* 0.1.0) Init Commit

## feature request

you can [request more features and date format types with the github issue tracker](https://github.com/SimonWaldherr/parseTime.js/issues).  

## contact

Feel free to contact me via [eMail](mailto:contact@simonwaldherr.de), on [App.net](https://alpha.app.net/simonwaldherr) or on [Twitter](http://twitter.com/simonwaldherr). This software will be continually developed. Suggestions and tips are always welcome.  
