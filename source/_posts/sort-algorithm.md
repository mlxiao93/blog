---
title: 排序算法
date: 2017-02-04 12:02:50
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

## 选择排序
+ 每次选出最小的元素
+ 不稳定排序(比如 [5, 5, 2], 第一次交换就会把第一个5放到第二个5后面)
+ 时间复杂度：O(n^2)

``` js
function selectionSort(arr) {
  var len = arr.length;
  for (var i = 0; i < len - 1; i++) {     //依次选出 n-1 个小的，第 n 个就是最大的
    for (var j = i + 1; j < len; j++) {
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) swap(arr, i, min);
  }
  return arr;
}
```

## 插入排序
+ 将元素插入有序数组
+ 稳定排序
+ 时间复杂度：O(n) ~ O(n^2)

``` js
function insertionSort(arr) {
  var len = arr.length;
  for (var i = 1; i < len; i++) {
    //将arr[i] 插入到 arr[i - 1]、arr[i - 2]、arr[i - 3]...之中
    for (var j = i; j > 0; j--) {  
      if (arr[j] < arr[j - 1]) swap(arr, j, j - 1);
    }
  }
  return arr;
}
```

## 冒泡排序
+ 相邻两个元素作比较，每次冒出一个极值
+ 稳定排序
+ 时间复杂度：O(n) ~ O(n^2)

``` js
function bubbleSort(arr) {
  var len = arr.length;
  for(var i = 0; i < len - 1; i++) {
    for(var j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) swap(arr, j, j + 1);
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
  var len = arr.length,
      step = Math.floor(len / 3);
  while(step > 0) { //对间隔为 step 的元素进行插入排序
    for(var i = step; i < len; i++) {
      for(var j = i; j >= step; j--) {
        if (arr[j] < arr[j - step]) swap(arr, j, j - step);
      }
    }
    step = Math.floor(step / 3);
  }
  return arr;
}
```

## 归并排序
+ 递归地将数组分成两半分别排序，然后将结果归并起来
+ 稳定排序
+ 时间复杂度：O(nlogn)

``` js
//原地归并方法
function merge(arr, low, mid, high) {
  var aux = [];
  for (var i = low; i <= high; i++) aux[i] = arr[i];  //复制arr到aux

  var left = low,
      right = mid + 1;

  for (var i = low; i <= high; i++) {   //归并aux到arr
    if (left > mid) {       //左边归并完成
      arr[i] = aux[right++];
    } else if (right > high) {    //右边归并完成
      arr[i] = aux[left++];
    } else if (aux[left] < aux[right]) {  //左边小于右边
      arr[i] = aux[left++];
    } else {          //右边小于左边
      arr[i] = aux[right++];
    }
  }
}

function mergeSort(arr, low, high) {
  if (low === undefined) low = 0;
  if (high === undefined) high = arr.length - 1;
  if (low >= high) return;
  var mid = Math.floor((low + high) / 2);
  mergeSort(arr, low, mid);
  mergeSort(arr, mid + 1, high);
  merge(arr, low, mid, high);
  return arr;
}
```

## 快速排序
+ 以升序为例，选择一个元素，所有比该元素小的放左边，大的放右边，再对两边分别递归调用
+ 不稳定排序
+ 时间复杂度：O(nlogn)

``` js
//选择一个元素（哨兵）对数组切分，小的放前面，大的放后面（升序）
//返回切分后哨兵的索引
function splition(arr, low, high) {
  var left = low,
      right = high,
      midVal = arr[left];  //哨兵
  while (true) {   //扫描左右，检查扫描是否结束
    while (true) {  //从左边开始扫描，找出比哨兵大的
      if (left > right || arr[left] > midVal) break;
      left++;
    }
    while (true) {  //从右边开始扫描，找出比哨兵小的
      if (right < left || arr[right] < midVal) break;
      right--;
    }
    if (left >= right) break;   //左边没找到比哨兵小的或者右边没找到比哨兵大的
    swap(arr, left, right)   //交换左右找到的元素
  }
  left--;    //切分后哨兵的索引
  swap(arr, low, left);
  return left;
}

function quickSort(arr, low, high) {
  if (low === undefined) low = 0;
  if (high === undefined) high = arr.length - 1;
  if (low >= high) return;
  var split = splition(arr, low, high);
  quickSort(arr, low, split - 1);
  quickSort(arr, split + 1, high);
  return arr
}
```

## 堆排序
+ 构造一个最大堆，交换堆顶和堆末元素, 堆大小依次减1，循坏至堆大小为1
+ 不稳定排序
+ 时间复杂度：O(nlogn)

``` js
function maxHeapify(arr, top, last) {
  var lChild = top * 2 + 1,
      rChild = top * 2 + 2;

  if (lChild > last || rChild > last) return

  maxHeapify(arr, lChild, last);
  maxHeapify(arr, rChild, last);
  var max = top;
  if (arr[lChild] > arr[max]) max = lChild;
  if (arr[rChild] > arr[max]) max = rChild;
  if (max !== top) swap(arr, top, max);
}

function heapSort(arr) {
  for (var last = arr.length - 1; last > 0; last--) {
    maxHeapify(arr, 0, last);
    swap(arr, 0, last)
  }
  return arr;
}
```
