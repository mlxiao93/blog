---
title: dom事件代理函数
date: 2017-02-16 10:16:12
tags:
 - js
 - dom
---

使用原生js实现一个事件代理，兼容IE

<!-- more -->

## 要点
+ 利用事件冒泡，在父元素的事件响应函数里处理目标元素
+ IE使用attachEvent添加事件响应函数
+ IE的event对象需要使用window.event, event.target使用event.srcElement

## 代码
``` js
function matchSelector(ele, selector) {
  if (/^#/.test(selector)) {     //匹配id
    return '#' + ele.id === selector
  }
  if (/^\./.test(selector)) {    //匹配classname
    return ele.classList.contains(selector.substr(1))   //classList不兼容IE，此处不是重点
  }
  return ele.tagName.toLocaleLowerCase() === selector;    //匹配tagname
}

/**
 * @param ele 父元素
 * @param selector 目标选择器
 * @param type 事件类型
 * @param fn 事件响应函数
 */
function delegateEvent(ele, selector, type, fn) {
  function handle (e) {
    e = e || window.event;
    let target = e.target || e.srcElement;
    if (matchSelector(target, selector)) {
      fn.call(target, e);
    }
  }
  if (ele.addEventListener) {
    ele.addEventListener(type, handle)
  } else {
    ele.attachEvent(type, handle)
  }
}
```

调用示例
``` js
delegateEvent(document.querySelector('ul'), '.foo', 'click', function(e) {
  console.dir('class');
});

delegateEvent(document.querySelector('ul'), '#a', 'click', function(e) {
  console.log('id');
});

delegateEvent(document.querySelector('ul'), 'li', 'click', funcion(e) {
  console.log('tag name');
});
```
