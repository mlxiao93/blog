---
title: JS实现继承
date: 2017-02-04 16:15:40
tags:
 - javascript
---

## 原型链继承

子类的原型指向父类的对象

``` js
function Sup() {
  this.foo = {name: 'hello'};
}

function Sub() {};
Sub.prototype = new Sup();

/* ---test--- */
var sub = new Sub();
console.log(sub.foo.name);    //hello
```

<!-- more -->

*缺点: 引用类型的成员会被所有子类的对象共享*
``` js
var a = new Sub();
var b = new Sub();
b.foo.name = "world";
console.log(a.foo.name, b.foo.name);   //world world
```

## 借用构造函数
利用[apply函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)拷贝父类的成员

``` js
function Sup() {
  this.foo = {name: 'hello'};
}

function Sub() {
  Sup.apply(this, arguments);
};

/* ---test--- */
var a = new Sub();
var b = new Sub();
b.foo.name = "world";
console.log(a.foo.name, b.foo.name);   //hello world
```
*缺点：无法继承父类原型上的成员*

## 组合继承
结合[原型链继承](#原型链继承)和[借用构造函数](#借用构造函数)
``` js
function Sup() {
  this.foo = {name: 'hello'};
}

function Sub() {
  Sup.apply(this, arguments);
};
Sub.prototype = new Sup();
```
*缺点：父类的构造函数被调用了两次*

## 寄生组合继承
1. [借用构造函数](#借用构造函数)
2. 创建一个辅助函数使其原型指向父类的原型，新建一个该辅助函数的对象(该对象继承父类原型)
3. 将该对象的constructor属性指向子类
4. 将该对象作为子类的原型

``` js
function Sup() {
  this.foo = {name: 'hello'}
}
function Sub() {
  Sup.apply(this, arguments);   // step 1
}

// step 2
function Temp() {}
Temp.prototype = Sup.prototype;
let temp = new Temp();

temp.constructor = Sub;  // step 3

Sub.prototype = temp;  // step 4
```

## ES6继承
``` js
class Sup {}
class Sub extends Sup {}
```
