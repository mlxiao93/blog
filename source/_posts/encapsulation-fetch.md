---
title: 封装fetch api
date: 2017-02-11 23:23:09
tags:
 - javascript
 - es6
 - fetch
---

[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)是es6新增的一个方法，可以用来替代XMLHttpRequest和jquery.ajax。fetch目前尚处于实验性阶段，浏览器兼容性不容乐观，好在有[polyfill](https://github.com/github/fetch)可用。

<!-- more -->

## 动机
+ 原生fetch的对于get请求的params是拼接到url后，比如`fetch('http://yourapi.com?foo=1')`，把它封装成`$fetch(['http://yourapi.com', {foo: 1}])`
+ 个人习惯把api的url统一写到一个清单文件里，所以需要支持pathParam占位符：`$fetch['http://youapi.com/users/{uid}/articles/{aid}', {uid: 1, aid: 2}]`,
+ 由于使用[JWT认证](https://jwt.io/)，需要缓存和发送token，也可以在此统一处理。
+ 将post的body自动做stringify处理
+ 添加`beforeEach`和`afterEach`
+ 只对fetch做扩展，可以和使用fetch一样使用$fetch

*以下代码均需要babel环境，配置可参考另一篇博客[使用webpack构建项目 - ES6+支持](http://localhost:4000/2017/02/08/webpack/#ES6-支持)*

## 实现代码
``` js
import "babel-polyfill";
import 'whatwg-fetch'

const CONFIG = {
  tokenKey: 'JWT_TOKEN',
  beforeEach: null,
  afterEach: null
};

function convertUrl(url) {
  if (!Array.isArray(url)) return url;

  let params = JSON.parse(JSON.stringify(url[1])) || {};
  url = url[0];

  if (/{.*}/.test(url)) {    //有pathParam, 先填充pathParam
    let placeholders = url.match(/{.*?}/g);    //利用match匹配出所有占位符
    placeholders && placeholders.map(placeholder => {
      let key = (/{(.*?)}/.exec(placeholder) || [])[1];  //利用exec匹配出param key
      let value = params[key];
      if (value !== undefined) {
        url = url.replace(placeholder, value);
        delete params[key];
      }
    })
  }

  let paramsStr = Object.keys(params).map(key => {     //请求参数字符串
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
  return paramsStr ? url + '?' + paramsStr : url;

}

function setToken(token) {
  localStorage.setItem(CONFIG.tokenKey, token);   //将token保存在localStorage
}
function getToken() {
  return localStorage.getItem(CONFIG.tokenKey);
}

/***
 * @param url 支持以数组的形式包含query params和path params
 * @param init 原生feth的第二个参数
 * @param needToken 是否需要发送token
 * @return {Promise.<Promise.<TResult>|*>}
 */
let $fetch = async (url, init = {}, needToken = false) => {
  let _url = convertUrl(url);
  init.headers = init.headers || {};
  if (needToken) {
    init.headers[CONFIG.tokenKey] = getToken();
  }
  if (typeof init.body === 'object' && !(a instanceof FormData)) {
    init.body = JSON.stringify(init.body);     //将非FormData的Object body做stringify处理
  }

  CONFIG.beforeEach && CONFIG.beforeEach();
  let res = await fetch(_url, init).then(res => {    //调用原生fetch
    let token = res.headers.get(CONFIG.tokenKey);
    if (token) setToken(token);     //保存jwt token
    return res;
  });
  CONFIG.afterEach && CONFIG.afterEach();
  return res;
};

$fetch.init = ({tokenKey = 'JWT_TOKEN', beforeEach, afterEach} = {}) => {
  CONFIG.tokenKey = tokenKey;
  if (typeof beforeEach === 'function') CONFIG.beforeEach = beforeEach;
  if (typeof afterEach === 'function') CONFIG.afterEach = afterEach;
};

export default $fetch;
```

## 调用
``` js
import $fetch from 'fetch';

$fetch.init({
  beforeEach: () => console.log('before each'),
  afterEach: () => console.log('after each')
});

$fetch('http://yourapi.com?foo=1')     //get http://yourapi.com?foo=1
  .then(res => res.json()).then(resBody => console.log(resBody));

$fetch(['http://yourapi.com', {foo: 1}])  //get http://yourapi.com?foo=1
  .then(res => res.json()).then(resBody => console.log(resBody));

$fetch(['http://yourapi.com/users/{id}', {id: 1 ,foo: 1}])  //get http://yourapi.com/users/1?foo=1
  .then(res => res.json()).then(resBody => console.log(resBody));
```
