---
title: 判断元素是否出现在视口
date: 2017-02-20 18:20:21
tags:
 - js
 - dom
---

判断元素是否出现在视口即元素是否在当前窗口内可见，利用这个判定可以做[图片的懒加载](https://mlxiao93.github.io/demos/#/img-lazy-load)等功能

<!-- more -->

## 前置知识
### 得到视口的尺寸
[`window.innerWidth`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerHeight), [`window.innerHeight`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/innerWidth)，兼容性不佳。
`document.documentElement.clinetWidth`, `document.doucmentElement.clientHeight`，IE也支持
``` js
var viewportWidth = window.innerWidth || document.documentElement.clinetWidth;
var viewportHeight = window.innerHeight || document.doucmentElement.clientHeight;
```

### [getBoundingClientRec](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)
该方法返回会一个矩形对象，包含4 个属性：left、top、right 和bottom。这些属性给出了元素在页面中相对于视口的位置。如下图所示：

![getBoundingClientRec](http://o86lf0oxm.bkt.clouddn.com/blog-el-in-viewport-01.png)

## 代码实现

### 是否完整出现在视口
``` js
function isElementInViewPort(el) {
  var viewportWidth = window.innerWidth || document.documentElement.clinetWidth,
      viewportHeight = window.innerHeight || document.doucmentElement.clientHeight,
      rect = el.getBoundingClientRect();
  return rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= viewportHeight &&
    rect.right <= viewportWidth;
};
```

### 是否部分出现在视口
``` js
function isElementInViewPort(el) {
  var viewportWidth = window.innerWidth || document.documentElement.clinetWidth,
      viewportHeight = window.innerHeight || document.doucmentElement.clientHeight,
      rect = el.getBoundingClientRect();
  return rect.bottom > 0 &&
    rect.bottom < viewportHeight + el.offsetHeight &&
    rect.right > 0 &&
    rect.right < viewportWidth + el.offsetWidth;
};
```

## 扩展知识
+ `clientWidth`,`clientHeight`
  元素的客户区大小，指的是元素内容(content)及其内边距(padding)所占据的空间大小

  ![clientWidth, clientHeight](http://o86lf0oxm.bkt.clouddn.com/blog-el-in-viewport-02.png)

+ `offsetWidth`, `offsetHeight` | `offsetLeft`, `offsetTop`
  元素在屏幕上占用的所有可见的空间 | 元素的外边框(margin)至包含元素的内边框(padding)之间的距离

  ![offsetWidth, offsetHeight | offsetLeft, offsetTop](http://o86lf0oxm.bkt.clouddn.com/blog-el-in-viewport-03.png)

+ `scrollWidth`, `scrollHeight` | `scrollLeft`, `scrollTop`
   包含滚动内容的元素的大小 | 被隐藏在内容区域左(上)测的像素数

   ![scrollWidth, scrollHeight | scrollLeft, scrollTop](http://o86lf0oxm.bkt.clouddn.com/blog-el-in-viewport-04.png)
