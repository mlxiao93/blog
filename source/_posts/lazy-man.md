---
title: 实现LazyMan
date: 2017-02-05 17:42:48
tags:
 - js
---

LazyMan是一道经典的javascript流程控制问题

## 问题描述
```
LazyMan('Hank')
//log：Hi, this is Hank
```
```
LazyMan('Hank').eat('super').eat('dinner')
//log: Hi, this is Hank
//log: Eat super
//log: Eat dinner
```

<!-- more -->
```
LazyMan('Hank').sleep(5).eat('dinner')
//log: Hi! This is Hank
//等待3秒..
//log: Wake up after 5 seconds
//log: Eat dinner
```

```
LazyMan('Hank').sleepFirst(5).eat('dinner')
//等待3秒
//log: Wake up after 5 seconds
//log: Hi, this is Hank
//log: Eat dinner
```

## 实现思路
+ 根据调用形式，LazyMan是一个工厂函数，返回用于实现逻辑的类的对象
+ sleep/sleepFirst会阻塞链式调用，所以所有的方法执行语句(任务)都应该先保存起来，在某个时机统一依次执行
+ 使用一个队列（用数组模拟）保存任务，并提供一个execNextJob方法，当一个任务执行完后调用execNextJob可以执行下一个任务
+ sleepFisrt会首先执行，所以sleepFisrt的任务需要保存在队列的最前
+ 任务的开始(首次调用execNextJob)在构造函数内，同时要保证任务开始前，所有任务都已经存入队列，所以首次调用next需要放在setTimeout函数内(此处需要理解[setTimeout的执行机制](http://www.alloyteam.com/2015/10/turning-to-javascript-series-from-settimeout-said-the-event-loop-model/))

## 实现代码
``` js
function _LazyMan (name) {
  this.jobQueue = [];
  var self = this;
  this.jobQueue.unshift(function () {
    console.log('Hi, this is ' + name);
    self.execNextJob();
  })
  setTimeout(function () {
    self.execNextJob()
  });
}

_LazyMan.prototype.execNextJob = function () {
  var job = this.jobQueue.pop();
  job && job();
}

_LazyMan.prototype.eat = function (food) {
  var self = this;
  this.jobQueue.unshift(function () {
    console.log('Eat ' + food)
    self.execNextJob();
  });
  return this;
}

_LazyMan.prototype.sleep = function (seconds) {
  var self = this;
  this.jobQueue.unshift(function () {
    setTimeout(function () {
      console.log('Wake up after ' + seconds + ' seconds');
      self.execNextJob();
    }, seconds * 1000);
  });
  return this;
}

_LazyMan.prototype.sleepFirst = function (seconds) {
  var self = this;
  this.jobQueue.push(function () {     //插队
    setTimeout(function () {
      console.log('Wake up after ' + seconds + ' seconds');
      self.execNextJob();
    }, seconds * 1000);
  })
  return this;
}

function LazyMan (name) {
  return new _LazyMan(name)
}
```
