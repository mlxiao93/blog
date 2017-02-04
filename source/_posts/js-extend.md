---
title: javascript实现继承
date: 2017-02-04 16:15:40
tags:
 - javascript
---

## 原型链继承
子类的原型指向父类的实例

``` js
  function Sup() {

  }

  function Sub() {

  }
  Sub.protoptype = new Sup();
```

## 借用构造函数
<!-- more -->
