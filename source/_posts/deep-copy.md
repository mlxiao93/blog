---
title: js深拷贝
date: 2017-02-19 16:12:06
tags:
 - js
---

深拷贝指的是对象属性所引用的对象全部进行新建对象复制，以保证深复制的对象的引用图不包含任何原有对象或对象图上的任何对象，隔离出两个完全不同的对象。可参考lodash的[cloneDeep](https://lodash.com/docs/4.17.3#cloneDeep)

<!-- more  -->

## 分析
+ 非引用类型比如String, Number, Boolean, Function直接赋值
+ RexExp和Date类型调用各自的构造函数进行复制
+ 其他类型比如Array, Object需对其所有子属性、孙子属性进行单独复制

## 深度优先的实现方式

使用递归处理子孙属性

``` js
function deepCopyDepth(target) {
  let _target;
  if (Array.isArray(target)) {    //数组
    _target = [];
    target.map(item => _target.push(deepCopyDepth(item)))
  } else if (target instanceof Date) {    //Date对象
    _target = new Date(target);
  } else if (target instanceof RegExp) {    //RegExp对象
    _target = new RegExp(target);
  } else if (target && typeof target === 'object') {   //Object，排除null
    _target = {};
    Object.keys(target).map(key => _target[key] = deepCopyDepth(target[key]));
  } else {     //其它情况: String，Boolean，Number等
    _target = target;
  }
  return _target;
}
```

## 广度优先的实现方式

+ 利用队列，目标元素首先执行浅拷贝，然后入队
+ 出队浅拷贝所有子属性，然后子属性入队。循环直到队列为空

``` js
function deepCopyBreadth(target) {

  let lightCopy = item => {     //浅拷贝
    let _item;
    if (Array.isArray(item)) {
      _item = [...item]
    } else if (item instanceof Date) {    //Date对象
      _item = new Date(item);
    } else if (item instanceof RegExp) {    //RegExp对象
      _item = new RegExp(item);
    } else if (item && typeof item === 'object') {
      _item = {...item}
    } else {
      _item = item;
    }
    return _item;
  };

  let queue = [];
  let _target = lightCopy(target);     //入队前对最外层执行浅拷贝
  queue.unshift(_target);      //首次入队

  while (queue.length > 0) {
    let copy = queue.pop();      //出队处理子属性
    if (Array.isArray(copy)) {
      copy.map((item, i) => {
        copy[i] = lightCopy(item);  //浅拷贝子属性
        queue.unshift(copy[i])     //子属性入队
      })
    } else if (copy && typeof copy === 'object' && !(target instanceof RegExp) && !(target instanceof Date) ) {
      Object.keys(copy).map(key => {
        copy[key] = lightCopy(copy[key]);   //浅拷贝子属性
        queue.unshift(copy[key])   //子属性入队
      })
    }
  }
  return _target;
}
```

## 简洁的实现方式
+ 利用JSON.stringify和JSON.parse进行序列化和反序列化
+ 无法对Function和RegExp进行复制
+ 一般需要进行深拷贝的数据不会出现Funtion和RegExp等类型的成员，此法最佳

``` js
function deepCopy(target) {
  return JSON.parse(JSON.stringify(target));
}
```
