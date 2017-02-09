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
