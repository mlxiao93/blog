---
title: 为nodejs配置babel
date: 2017-02-09 09:00:45
tags:
 - node
 - js
 - babel
---

虽然新版本的nodejs支持了很多ES6新特性，但是想使用所有的新特性，就得使用[babel](https://babeljs.io/)编译一下

<!-- more -->

`package.json`
``` json
{
  "name": "node-demo",
  "version": "1.0.0",
  "scripts": {
    "babel-node": "babel-node",
    "start": "nodemon --exec npm run babel-node -- ./index"
  },
  "dependencies": {
    "babel-cli": "^6.22.2",
    "babel-core": "^6.21.1",
    "babel-preset-latest": "^6.22.0",
    "babel-preset-stage-2": "^6.22.0",
    "nodemon": "^1.11.0"
  }
}
```

`.babelrc`
``` json
{
  "presets": ["latest", "stage-2"]
}
```
---

`index.js`
``` js
let foo = async () => {
  let promise = new Promise(reslove => {
    setTimeout(() => {
      reslove('haha');
    }, 2000)
  })
  let res = await promise;
  return Promise.resolve(res);
};

foo().then(res => console.log(res));
```

测试： `npm start`
