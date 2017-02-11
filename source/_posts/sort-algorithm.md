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
+ 时间复杂度：O(n) ~ O(n^2)

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

## 归并排序
+ 递归地将数组分成两半分别排序，然后将结果归并起来
+ 稳定排序
+ 时间复杂度：O(nlogn)

``` js
var aux = []    //归并所需的辅助数组

//原地归并方法
//arr是一个low到mid和mid+1到high各自有序的数组，借助aux原地merge这个数组
function merge(arr, low, mid, high) {
  aux = [];
  var m = low,
      n = mid + 1;

  for (var k = low; k <= high; k++) {    //复制arr到aux
    aux[k] = arr[k];
  }

  for (var i = low; i <= high; i++) {    //归并aux到arr
    if (m > mid) {    //左边归并完成
      arr[i] = aux[n++];
    } else if (n > high) {  //右边归并完成
      arr[i] = aux[m++];
    } else if (aux[m] > aux[n]) {   //左边大于右边
      arr[i] = aux[n++];
    } else {       //右边大于左边
      arr[i] = aux[m++];
    }
  }
}

function mergeSort(arr, low, high) {
  if (low === undefined) low = 0;
  if (high === undefined) high = arr.length - 1;
  if (low >= high) return arr;
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
function partion(arr, low, high) {
  var i = low,
      j = high,
      m = low,    //哨兵的索引
      ele = arr[m];

  while(true) {   //扫描左右，检查扫描是否结束
    while(true) {    //从左边开始扫描，找出比ele大的
      if(i > j) break;
      if (arr[i] > ele) break;
      i++;
    }
    while(true) {     //从右边开始扫描，找出比ele小的
      if(j < i) break;
      if (arr[j] < ele) break;
      j--;
    }
    if (i >= j) break;   //左边没找到比哨兵小的或者右边没找到比哨兵大的
    swap(arr, i, j); //交换左右找到的元素
  }
  var n = i - 1  //切分后哨兵的索引
  swap(arr, m, n);
  return n;
}

function quickSort(arr, low, high) {
  if (low === undefined) low = 0;
  if (high === undefined) high = arr.length - 1;

  if (low >= high) return arr;

  var mid =partion(arr, low, high);
  quickSort(arr, low, mid - 1);
  quickSort(arr, mid + 1, high);

  return arr;
}
```

## 堆排序
+ 构造一个最大堆，交换堆顶和堆末元素, 堆大小依次减1，循坏至堆大小为1
+ 不稳定排序
+ 时间复杂度：O(nlogn)

``` js
function maxHeapify(arr, last, top) {
  if (last === undefined) last = arr.length - 1;
  if (top === undefined) top = 0;
  if (top > last) return;
  var lchild = (top * 2) + 1,
      rchild = (top * 2) + 2,
      max = top;

  maxHeapify(arr, last, lchild);
  maxHeapify(arr, last, rchild);

  if (lchild <= last && arr[lchild] > arr[max]) max = lchild;
  if (rchild <= last && arr[rchild] > arr[max]) max = rchild;

  swap(arr, top, max);
}

function heapSort(arr) {
  var len = arr.length;
  for (var last = len - 1; last > 0; last--) {
    maxHeapify(arr, last);
    swap(arr, 0, last);
  }
  return arr;
}
```
