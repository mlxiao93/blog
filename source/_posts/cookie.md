---
title: http cookie
date: 2017-06-01 16:19:33
tags:
 - css
---
cookie用于客户端存储会话信息。服务端对任意http请求发送 Set-Cookie 响应头，其中包含会话信息，浏览器接到响应后会存储会话信息，并在这之后，通过为每个请求添加 cookie 请求头将信息发送回服务器。

<!-- more -->

## cookie的构成
> `name=value; domain=demo.com; path=/; expires=1496307358157; secure`

+ 名称：cookie的名称。需被url编码
+ 值：cookie得值。需被url编码
+ 域(domain)：cookie作用的域。可以不包含子域(如.demo.com，则对于 demo.com的所有子域都有效)。如果没有指定，默认为设置 cookie 的那个域
+ 路径(path)：对于指定的域，cookie作用的路径。默认为"/"，即该域下所有路径
+ 失效时间(expires)：表示cookie被删除的时间戳。默认浏览器会话结束就删除
+ 安全标志(secure)：指定后，cookie 只有在使用 SSL 连接的时候才发送到服务器，例如https

## 客户端设置cookie
利用[document.cookie](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie)，不过由于其简陋的接口与兼容性问题，推荐使用第三方库：[js-cookie](https://github.com/js-cookie/js-cookie)


## 服务端设置cookie
通过返回Set-Cookie响应头设置，以express为例:
``` js
app.get('/', function (req, res) {
    res.cookie('foo', '123', {path: '/'});
    res.json('ok');
})
```

## 向服务端发送cookie
### 同源
同源自动添加cookie至请求头

### 跨域
+ 客户端设置`with-credentials=true`
+ 服务端添加响应头：
  ```js
  res.header('Access-Control-Allow-Origin', req.headers.origin);   //注：'with-credentials=true'的情况下不能用通配符
  res.header('Access-Control-Allow-Credentials', 'true');
  ```
+ 最后发送的是服务端域下的cookie。比如a.com（前端）请求b.com(接口），发送的是b.com域下的cookie
