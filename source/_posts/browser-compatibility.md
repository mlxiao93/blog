---
title: 浏览器兼容性问题
date: 2017-02-04 8:30:22
tags:
 - html
 - css
 - js
---

兼容性问题大多针对IE系列，此文收集各种网上和身边遇到的兼容性问题及其解决方案，长期更新

<!-- more -->
**IE6不支持png背景透明**
*解决方案：*[@张鑫旭博客](http://www.zhangxinxu.com/wordpress/2009/08/ie6%E4%B8%8Bpng%E8%83%8C%E6%99%AF%E4%B8%8D%E9%80%8F%E6%98%8E%E9%97%AE%E9%A2%98%E7%9A%84%E7%BB%BC%E5%90%88%E6%8B%93%E5%B1%95/)

+ 使用滤镜
  ``` css
  .target {background:url(path/to/image);}
  *html .target {background:none; filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='path/to/image');}
  ```
+ 使用jquery插件[jquery.pngFix.pack.js](https://github.com/johnantoni/jquery.pngfix)

---

**IE6双边距**
在IE6下，如果对元素设置了浮动，同时又设置了margin-left或margin-right，margin值会加倍。
*解决方案：*在float的标签样式控制中加入 \_display:inline; 将其转化为行内属性。( _ 这个符号只有ie6会识别)

---

**渐进识别的方式，从总体中逐渐排除局部**
首先，巧妙的使用“\9”这一标记，将IE游览器从所有情况中分离出来。
接着，再次使用 "+" 将IE8和IE7、IE6分离开来，这样IE8已经独立识别。
``` css
.target {
  background-color:#f1ee18; /*所有识别*/
  .background-color:#00deff\9; /*IE6、7、8识别*/
  +background-color:#a200ff; /*IE6、7识别*/
  _background-color:#1e0bd1; /*IE6识别*/
}
```

---

**Chrome 中文界面下默认会将小于 12px 的文本强制按照 12px 显示**
*解决方案：* `-webkit-text-size-adjust: none;`
