---
title: 实现一个Promise
date: 2017-02-09 16:57:54
tags:
 - js
 - es6
---

使用es6语法做一个简单的实现

<!-- more -->

## 功能描述
[Promise定义](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
此处只实现一个包含构造函数，resolve方法和reject方法的简化版本

## 实现思路
+ 需要有一个对象(defer)保存resolve callback和reject callback，一个工厂函数(Promise)返回这个对象
+ defer对象需要有个then方法用来注册resolve callback和reject callback
+ defer对象需要一个resolve方法执行resolve callback，一个reject方法执行reject callback
+ 工厂函数(Promise)的构造函数接收一个函数作为参数，返回defer对象
+ 工厂函数(Promise)需要两个静态方法: resolve，reject，均返回defer对象
+ 使用setTimeout保证callback的注册先于resolve或reject方法的执行(见代码22行、30行、39行)

## 实现代码

``` js
class Defer {
  resolveCallback = () => {};
  rejectCallback = () => {};

  then(resolveCallback = () => {}, rejectCallback = () => {}) {
    this.resolveCallback = resolveCallback;
    this.rejectCallback = rejectCallback;
  }

  resolve(data) {
    this.resolveCallback(data);
  }

  reject(data) {
    this.rejectCallback(data);
  }
}

export default class Promise {
  static resolve = function(data) {
    let defer = new Defer();
    setTimeout(() => {
      defer.resolve(data);
    })
    return defer;
  }

  static reject = function(data) {
    let defer = new Defer();
    setTimeout(() => {
      defer.reject(data);
    })
    return defer;
  }

  defer = new Defer();

  constructor(fn = () => {}) {
    setTimeout(() => {
      fn.call(null, data => {
        this.defer.resolve(data);
      }, data => {
        this.defer.reject(data);
      });
    });
    return this.defer;
  }
}

```
调用测试：
``` js
import Promise from './promise'

Promise.resolve('hello').then(data => console.log(data));  //立即输出"hello"

new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('world');
  }, 2000);
}).then(data => console.log(data));   //两秒后输出"world"
```
