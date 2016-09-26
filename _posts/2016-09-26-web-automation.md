---
layout: post
category : web
title: 'web automation 01'
tagline: ""
tags : [web]
---

## setup

[phantomjs](http://phantomjs.org/)

A headless WebKit scriptable with a JavaScript API.

```
brew install phantomjs
```

[nightmarejs](http://www.nightmarejs.org/)

A high-level browser automation library

http://www.nightmarejs.org/

```
npm install nightmare
```

<!--break-->

## example

```
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

nightmare
  .goto('http://yahoo.com')
  .type('form[action*="/search"] [name=p]', 'github nightmare')
  .click('form[action*="/search"] [type=submit]')
  .wait('#main')
  .evaluate(function () {
    return document.querySelector('#main .searchCenterMiddle li a').href
  })
  .end()
  .then(function (result) {
    console.log(result)
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });
```

## run

```
node example.js
```