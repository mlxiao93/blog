---
title: js链式累加函数
date: 2017-02-19 12:17:34
tags:
 - js
---
实现`sum(1, 2)(3)(4)`使输出结果为10，即`1 + 2 + 3 + 4 = 10`

<!-- more -->

## 要点
+ sum需要返回一个函数
+ 被返回函数的toString方法需要重写
+ 将arguments转为Array，调用reduce方法

## 代码

先做一个`sum(1)(2)(3)`的版本：

```js
function sum (x) {
  var foo = function (y) {
    return sum(x + y);
  };
  foo.toString = function () {
    return x;
  };
  return foo;
}
```

完整实现：
``` js
function sum () {
  var x = Array.prototype.slice.call(arguments).reduce(function (a, b) {
    return a + b;
  });
  var foo = function () {
    var y = Array.prototype.slice.call(arguments).reduce(function (a, b) {
      return a + b;
    });
    return sum(x + y);
  };
  foo.toString = function () {
    return x;
  };
  return foo;
}
```
