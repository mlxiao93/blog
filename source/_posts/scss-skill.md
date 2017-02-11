---
title: scss实用技巧
date: 2017-02-10 22:23:09
tags:
 - css
 - scss
 - BEM
---

记录scss在开发中的一些运用

<!-- more -->

## media query的封装
``` scss
@mixin for-phone-only {
  @media (max-width: 599px) { @content; }
}
@mixin for-tablet-portrait-up {
  @media (min-width: 600px) { @content; }
}
@mixin for-tablet-landscape-up {
  @media (min-width: 900px) { @content; }
}
@mixin for-desktop-up {
  @media (min-width: 1200px) { @content; }
}
@mixin for-big-desktop-up {
  @media (min-width: 1800px) { @content; }
}
```
用法：
``` scss
@include for-phone-only {
  //style for phone only
}
```

## 画特定列数的网格
<p data-height="265" data-theme-id="0" data-slug-hash="vgQMxO" data-default-tab="css,result" data-user="mlxiao93" data-embed-version="2" data-pen-title="vgQMxO" class="codepen">See the Pen <a href="http://codepen.io/mlxiao93/pen/vgQMxO/">vgQMxO</a> by mlxiao93 (<a href="http://codepen.io/mlxiao93">@mlxiao93</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
+ drawItem接收列数作为参数
+ scss变量参与计算: `width: (100% / $count);`
+ scss变量参与组装语句: `&:nth-child(#{$count}n + 1) {}`

## 配合[BEM](http://getbem.com/)
``` html
<div class="login">
  <form class="login__form">
    <input class="login__input login__input--username" type="text">
    <input class="login__input login__input--password" type="password">
    <button class="login__btn">submit</button>
  </form>
</div>
```
``` scss
.login {
  &__form {
  }
  &__input {
    &--username {
    }
    &--password {
    }
  }
  &__btn {
  }
}
```
