---
title: callback、promise、async/await的使用
date: 2017-02-09 11:49:48
tags:
 - js
---

以微信授权后的获取用户信息作为案例，分别用这三种方式实现

<!-- more -->

## 主要流程
*code已知*

1. 通过code换取accessToken，得到openId
2. 通过openId拉取用户信息
3. 打印拉取到的用户信息

**此文只做简单的流程抽象，实际情况请参阅[微信网页授权文档](http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html)**

下文所有的http请求均使用[node-fetch](https://github.com/bitinn/node-fetch)发起

## callback方式
``` js
import fetch from 'node-fetch';

const code = "your code";
const accessTokenApi = "accessTokenApi";
const userInfoApi = "userInfoApi";

function getAccessToken(code, callback = () => {}) {
  fetch(accessTokenApi + `?code=${code}`).then(res => res.json()).then(body => {
    callback(false, body.accessToken);
  }).catch(error => callback(error));
}

function getUserInfo(accessToken, callback = () => {}) {
  fetch(userInfoApi + `?accessToken=${accessToken}`).then(res => res.json()).then(body => {
    callback(false, body.userInfo);
  }).catch(error => callback(error));
}

//调用
(code => {
  getAccessToken(code, (error, accessToken) => {
    if (error) return console.log(error);
    getUserInfo(accessToken, (eror, userInfo) => {
      if (error) return console.log(error);
      console.log(userInfo);
    })
  })
})(code)


```

## promise方式
``` js
import fetch from 'node-fetch';

const code = "your code";
const accessTokenApi = "accessTokenApi";
const userInfoApi = "userInfoApi";

function getAccessToken(code) {
  return new Promise((resolve, reject) => {
    fetch(accessTokenApi + `?code=${code}`).then(res => res.json())
      .then(body => resolve(body.accessToken))
      .catch(error => reject(error));
  });
}

function getUserInfo(accessToken) {
  return new Promise((resolve, reject) => {
    fetch(userInfoApi + `?accessToken=${accessToken}`).then(res => res.json())
      .then(body => resolve(body.userInfo))
      .catch(error => reject(error));
  });
}

//调用
(code => {
  getAccessToken(code).then(accessToken => {
    getUserInfo(accessToken).then(userInfo => {
      console.log(userInfo)
    }, error => console.log(error))
  }, error => console.log(eror))
})(code)

```

## async/await方式
``` js
import fetch from 'node-fetch';

const code = "your code";
const accessTokenApi = "accessTokenApi";
const userInfoApi = "userInfoApi";

async function getAccessToken(code) {
  let body = await fetch(accessTokenApi + `?code=${code}`).then(res => res.json())
  return Promise.resolve(body.accessToken);  
}

async function getUserInfo(accessToken) {
  let body = await fetch(userInfoApi + `?accessToken=${accessToken}`).then(res => res.json());
  return Promise.resolve(body.userInfo);
}

//调用
(async code => {
  let accessToken = await getAccessToken(code);
  let userInfo = await getUserInfo(accessToken);
  return Promise.reslove(userInfo);
})(code)
  .then(userInfo => console.log(userInfo))
  .catch(error => console.log(error))
```
