---
title: css之BFC
date: 2017-02-07 16:10:33
tags:
 - css
---

BFC是什么，block formatting context，翻译下来就是块级格式化上下文，那么它到底是什么?
新建一个html，在body下写一个div，div里写一个p标签，p标签内写上大名鼎鼎的"Hello world"，然后给div加上一个背景色，然后神奇的事情发生了：
![demo](http://o86lf0oxm.bkt.clouddn.com/blog-css-bfc-01.png)
去掉body的默认margin后，背景色居然没有从顶部开始，其实这个问题就可以用BFC来解决

<!-- more -->

## 官方解释：[BFC](https://www.w3.org/TR/CSS2/visuren.html#block-formatting)
个人理解：（参考[这篇博文](http://www.html-js.com/article/1866)）
1 在一个BFC中，盒子从包含块的顶端开始垂直地一个接一个地排列，两个盒子之间的垂直的间隙是由他们的margin 值所决定的。两个相邻的块级盒子的垂直外边距会发生重叠。
2 在BFC中，每一个盒子的margin会触碰到容器的border
<small>*注：盒子可以理解为一个块级元素*</small>


## [BFC创建条件](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)
<small>*摘抄自MDN：*</small>
> 块格式化上下文（block formatting context） 是Web页面的可视CSS渲染的一部分。它是块盒子的布局发生及浮动体彼此交互的区域。
> 块格式化上下文由以下之一创建：
> + 根元素或其它包含它的元素
> + 浮动 (元素的 float 不是 none)
> + 绝对定位的元素 (元素具有 position 为 absolute 或 fixed)
> + 内联块 inline-blocks (元素具有 display: inline-block)
> + 表格单元格 (元素具有 display: table-cell，HTML表格单元格默认属性)
> + 表格标题 (元素具有 display: table-caption, HTML表格标题默认属性)
> + 块元素 元素具有overflow 值不是 visible
> + 弹性盒子 flex boxes (元素具有display: flex 或 inline-flex)
> + display: flow-root


## [margin重叠问题](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)
块级父元素的margin会和第一(最后)一个块级子元素的margin发生重叠

这个问题其实就是本文开头提出的问题：p标签默认有一个margin值，和包裹p标签的div标签的margin发生重叠，使div也有了一个margin值。解决这个问题的办法就是使用上述[BFC创建条件](#BFC创建条件)中的任意一种方法使div形成一个BFC就行了。(可以给div设一个"overflow: auto")
