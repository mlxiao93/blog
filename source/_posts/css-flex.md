---
title: css3 flex
date: 2017-02-07 20:05:11
tags:
 - css
---

flex作为css3引入的一种布局方式，简化了前端开发。现阶段移动端已经可以放心使用了，pc端不考虑老旧IE的话也是个最好的选择

<!-- more -->

## 兼容性
[can i use](http://caniuse.com/)
![compatibility](http://o86lf0oxm.bkt.clouddn.com/blog-css-flex-01.png)

实际上可以通过特定语法-ms-flexbox，使IE10及以上兼容

## 基础概念
任何一个元素都能通过:`display: flex`指定为flex box，flex box的直接子元素则变成flex item
### flex box 属性
+ `flex-direction: row | row-reverse | column | column-reverse;`
  指定flex item的排列方向

+ `flex-wrap: nowrap | wrap | wrap-reverse;`
  flex item是否换行以及换行的方式

+ `flex-flow: {flex-direction} {flex-wrap};`
  flex-direction和flex-wrap的合并写法，例如：`flex-flow: row nowrap`

+ `justify-content: flex-start | flex-end | center | space-between | space-around;`
  指定flex item在flex-direction方向上的对齐方式

+ `align-items: flex-start | flex-end | center | baseline | stretch;`
  指定flex item在垂直于flex-direction方向上的对齐方式

+ `align-content: align-content: flex-start | flex-end | center | space-between | space-around | stretch;`
  如果flex item发生换行，该属性可以指定各行之间的对齐方式

### flex item 属性
+ `order: {number=0}`
  指定flex item的排列权值，值越小，排列越靠前

+ `flex-grow: {number=0}`
  flex box在flex-direction方向上有剩余空间时，指定flex item的放大权值

+ `flex-shrink: {number=1};`
  flex box在flex-direction方向上空间不足时，指定flex item的缩小权值

+ `flex-basis: {length=auto}  /* length和width或height类似 */`  
  flex box在flex-direction方向上有剩余空间时，指定flex item占据的固定空间

+ `flex: {flex-grow} {flex-shrink} {flex-basis}`
  flex-grow、flex-shrink、flex-basis的合并写法，该属性有两个快捷值：auto(1 1 auto)和none(0 0 auto)

+ `align-self: auto | flex-start | flex-end | center | baseline | stretch;`
  可覆盖flex box的align-items属性，效果也一样，只不过只作用于当前flex item

## 案例
### 居中对齐
<p data-height="265" data-theme-id="0" data-slug-hash="rjrbQe" data-default-tab="css,result" data-user="mlxiao93" data-embed-version="2" data-pen-title="h-v-center" class="codepen">See the Pen <a href="http://codepen.io/mlxiao93/pen/rjrbQe/">h-v-center</a> by mlxiao93 (<a href="http://codepen.io/mlxiao93">@mlxiao93</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### 经典三栏布局
两侧定宽，中间自适应
<p data-height="265" data-theme-id="0" data-slug-hash="LxBoWm" data-default-tab="css,result" data-user="mlxiao93" data-embed-version="2" data-pen-title="LxBoWm" class="codepen">See the Pen <a href="http://codepen.io/mlxiao93/pen/LxBoWm/">LxBoWm</a> by mlxiao93 (<a href="http://codepen.io/mlxiao93">@mlxiao93</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### 骰子
<p data-height="316" data-theme-id="0" data-slug-hash="ggdRym" data-default-tab="html,result" data-user="mlxiao93" data-embed-version="2" data-pen-title="ggdRym" class="codepen">See the Pen <a href="http://codepen.io/mlxiao93/pen/ggdRym/">ggdRym</a> by mlxiao93 (<a href="http://codepen.io/mlxiao93">@mlxiao93</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
