---
title: 移动端适配方案
date: 2017-04-06 13:54:48
tags:
 - css
 - html
---
移动端适配就是使页面在不同尺寸和分辨率的移动设备上的展现效果一致，还原设计图。

<!-- more -->

## 基础概念
+ 物理像素(physical pixel)
  显示器上一个个的点, 即分辨率

+ 独立像素（density-independent pixel)
  也叫密度无关像素，屏幕的尺寸(?个人理解，不确定)

+ dpr (device pixel ratio)
  设备像素比，物理像素和设备独立像素的关系
  `dpr = 物理像素 / 独立像素`

+ css像素
  即css语句里的px。pc端，css像素等于独立像素

+ rem
  相对于html元素的字体大小的一个单位。例如html元素的font-size为16px，那么1rem=16px

+ [meta viewport](https://developer.mozilla.org/en/docs/Mozilla/Mobile/Viewport_meta_tag)
  `<meta name="viewport" content="width=device-width, initial-scale=1">`
  只在移动端起作用
  `width`代表默认css像素， `device-width`代表独立像素，`initial-scale`代表初始缩放比例
  `width`和`initial-scale`共同决定最终的css像素

## 适配思路
前提：
+ 假定设计师给了一份宽400px的设计图(暂不考虑高，以宽做类比), 其中有一个宽40px，字体大小为16px的div元素
+ 现在有两个设备，设备D1宽200px，设备D2宽800px，需要做适配
+ 文字

方案1：
计算出元素相对于设计图的百分比，css中使用百分比单位


## 问题
+ 设计师以某个像素为基准，出一份设计图。假设设计图尺寸为宽400px(不考虑高，以宽为基准)
+ 各不同css像素的设备需要根据基准尺寸得出缩放比例(r)，写css时需要除以该缩放比例
  + 若设备css像素宽为200，则r为0.5，若宽为800，则r为2
+ 写css时，需要一个相对单位

## 图示&参考
+ 独立像素&css像素
  ![独立像素&css像素](http://o86lf0oxm.bkt.clouddn.com/blog-mobile-adaptation-01.png)

+ 物理像素&独立像素&dpr
  ![物理像素&独立像素&dpr](http://o86lf0oxm.bkt.clouddn.com/blog-mobile-adaptation-02.png)
+ [各设备的详细数据](https://material.io/devices/)
+ [手淘flexible方案](https://github.com/amfe/lib-flexible)
