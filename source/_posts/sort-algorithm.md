---
title: 排序算法
date: 2017-02-09 18:02:50
tags:
 - algorithm
 - js
---

使用js实现一些基础排序算法

<!-- more -->

>交换函数
``` js
function swap(arr, i, j) {
  var tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
```

## 插入排序
+ 将元素插入有序数组
+ 稳定排序
+ 时间复杂度：O(n^2)

``` js
function insertionSort(arr) {
  var len = arr.length;
  for (var i = 1; i < len; i++) {
    //将arr[i] 插入到 arr[i - 1]、arr[i - 2]、arr[i - 3]...之中
    for (var j = i; j > 0; j--) {  
      if (arr[j] < arr[j - 1]) {
        swap(arr, j, j - 1);
      }
    }
  }
  return arr;
}
```

## 选择排序
+ 每次选出最小的元素
+ 不稳定排序(比如 [5, 5, 2], 第一次交换就会把第一个5放到第二个5后面)
+ 时间复杂度：O(n^2)

``` js
function selectionSort(arr) {
  var len = arr.length;
  for (var i = 0; i < len; i++) {
   var min = i;     //最小元素的索引
   for (var j = i + 1; j < len; j++) {
     if (arr[j] < arr[min]) min = j;
   }
   swap(arr, i, min);
  }
  return arr;
}
```

## 冒泡排序
+ 相邻两个元素作比较，每次冒出一个极值
+ 稳定排序
+ 时间复杂度：O(n^2)

``` js
function bubbleSort(arr) {
  var len = arr.length;
  for (var i = 0; i < len - 1; i++) {
    for (var j = 0; j < len - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1)
      }
    }
  }
  return arr;
}
```

## 希尔排序
+ 基于插入排序
+ 不稳定排序
+ 选择一个间隔h作为步长，将间隔为h的元素进行插入排序，递减h至1
+ 时间复杂度：最好情况是O(n)，最坏情况视步长而定([参考](http://vickyqi.com/2015/08/13/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95%E7%B3%BB%E5%88%97%E2%80%94%E2%80%94%E5%B8%8C%E5%B0%94%E6%8E%92%E5%BA%8F/))

``` js
function shellSort(arr) {
  var len = arr.length;
  var h = Math.ceil(len / 3);
  while(h > 0) {
    //对间隔为h的元素进行插入排序
    for (var i = h; i < len; i++) {
      for (var j = i; j > 0; j -= h) {
        if (arr[j] < arr[j - h]) {
          swap(arr, j, j - h);
        }
      }
    }
    h = Math.floor(h / 3);
  }
  return arr;
}
```
