---
layout: post
category : 算法
title: '排序算法'
tagline: ""
tags : [算法]
---

## 排序算法

排序算法（Sorting algorithm）是一种能将一串数据依照特定排序方式进行排列的一种算法。

![sort_wiki.png](/images/201701/sort_wiki.png)

![sort.png](/images/201701/sort.png)

<!--break-->

### 关于时间复杂度

- 平方阶 (O(n2)) 排序 各类简单排序:直接插入、直接选择和冒泡排序；

- 线性对数阶 (O(nlog2n)) 排序 快速排序、堆排序和归并排序；

- O(nlogn)) 排序，n 是介于 0 和 1 之间的常数。 希尔排序；

- 线性阶 (O(n)) 排序 基数排序，此外还有桶、箱排序。

### 关于稳定性

- 稳定的排序算法：冒泡排序、插入排序、归并排序和基数排序。

- 不是稳定的排序算法：选择排序、快速排序、希尔排序、堆排序。

### 名词解释

- n：数据规模

- k：“桶”的个数

- In-place：占用常数内存，不占用额外内存

- Out-place：占用额外内存

- 稳定性：排序后 2 个相等键值的顺序和排序之前它们的顺序相同

## 冒泡排序（Bubble Sort）

冒泡排序，也称为鸡尾酒排序，属于稳定排序算法。

算法步骤

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。

2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。

3. 针对所有的元素重复以上的步骤，除了最后一个。

4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

```
Array.prototype.bubble_sort = function() {
    var i, j, temp;
    for (i = 0; i < this.length - 1; i++)
        for (j = 0; j < this.length - 1 - i; j++)
            if (this[j] > this[j + 1]) {
                temp = this[j];
                this[j] = this[j + 1];
                this[j + 1] = temp;
            }
    return this;
};
var num = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
num.bubble_sort();
for (var i = 0; i < num.length; i++)
    document.body.innerHTML += num[i] + " ";
```

![bubbleSort.gif](/images/201701/bubbleSort.gif)

## 选择排序（Select Sort）

算法步骤

1. 在未排序序列中找到最小（大）元素，存放到排序序列的起始位置。

2. 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。

3. 以此类推，直到所有元素均排序完毕。

选择排序的主要优点与数据移动有关。如果某个元素位于正确的最终位置上，则它不会被移动。选择排序每次交换一对元素，它们当中至少有一个将被移到其最终位置上，因此对n个元素的表进行排序总共进行至多n-1次交换。在所有的完全依靠交换去移动元素的排序方法中，选择排序属于非常好的一种。

```
Array.prototype.selection_sort = function() {
    var i, j, min;
    var temp;
    for (i = 0; i < this.length - 1; i++) {
        min = i;
        for (j = i + 1; j < this.length; j++)
            if (this[min] > this[j])
                min = j;
        temp = this[min];
        this[min] = this[i];
        this[i] = temp;
    }
};
```

![selectionSort.gif](/images/201701/selectionSort.gif)

## 插入排序（Insertion Sort）

工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。插入排序在实现上，通常采用in-place排序（即只需用到O(1)的额外空间的排序），因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间。

算法步骤

1. 从第一个元素开始，该元素可以认为已经被排序

2. 取出下一个元素，在已经排序的元素序列中从后向前扫描

3. 如果该元素（已排序）大于新元素，将该元素移到下一位置

4. 重复步骤3，直到找到已排序的元素小于或者等于新元素的位置

5. 将新元素插入到该位置后

6. 重复步骤2~5

可以采用二分查找法来减少比较操作的数目。该算法可以认为是插入排序的一个变种，称为二分查找插入排序

![insertionSort.gif](/images/201701/insertionSort.gif)

```
Array.prototype.insertion_sort = function() {
    var i, j;
    var temp;
    for (i = 1; i < this.length; i++) {
        temp = this[i];
        j = i - 1;  // 如果将赋值放到下一行的for循环内, 会导致在第10行出现j未声明的错误
        for (; j >= 0 && this[j] > temp; j--)
            this[j + 1] = this[j];
        this[j + 1] = temp;
    }
    return this;
};
```

## 希尔排序（Shell Sort）

希尔排序，也称递减增量排序算法，是插入排序的一种更高效的改进版本，分组插入排序。希尔排序是非稳定排序算法。

基于插入排序的以下两点性质而提出改进方法的

- 插入排序在对几乎已经排好序的数据操作时，效率高，即可以达到线性排序的效率

- 但插入排序一般来说是低效的，因为插入排序每次只能将数据移动一位

基本思想是：把记录按步长 gap 分组，对每组记录采用直接插入排序方法进行排序。
随着步长逐渐减小，所分成的组包含的记录越来越多，当步长的值减小到 1 时，整个数据合成为一组，构成一组有序记录，则完成排序。

算法步骤

1. 选择一个增量序列 t1，t2，…，tk，其中 ti > tj，tk=1；

2. 按增量序列个数 k，对序列进行 k 趟排序；

3. 每趟排序，根据对应的增量 ti，将待排序列分割成若干长度为 m 的子序列，分别对各子表进行直接插入排序。仅增量因子为 1 时，整个序列作为一个表来处理，表长度即为整个序列的长度。

假设有这样一组数[ 13 14 94 33 82 25 59 94 65 23 45 27 73 25 39 10 ]，如果我们以步长为5开始进行排序

```
13 14 94 33 82
25 59 94 65 23
45 27 73 25 39
10
```

然后我们对每列进行排序

```
10 14 73 25 23
13 27 94 33 39
25 59 94 65 82
45
```

然后再以3为步长进行排序

```
10 14 73
25 23 13
27 94 33
39 25 59
94 65 82
45
```

最后以1步长进行排序。

步长的选择是希尔排序的重要部分。只要最终步长为1任何步长序列都可以工作。算法最开始以一定的步长进行排序。然后会继续以一定步长进行排序，最终算法以步长为1进行排序。当步长为1时，算法变为插入排序，这就保证了数据一定会被排序。

```
Array.prototype.shell_sort = function() {
    var gap, i, j;
    var temp;
    for (gap = this.length >> 1; gap > 0; gap >>= 1)
        for (i = gap; i < this.length; i++) {
            temp = this[i];
            for (j = i - gap; j >= 0 && this[j] > temp; j -= gap)
                this[j + gap] = this[j];
            this[j + gap] = temp;
        }
};
```

## 归并排序（Merge Sort）

归并排序，是创建在归并操作上的一种有效的排序算法，效率为O(n log n)。1945年由约翰·冯·诺伊曼首次提出。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用，且各层分治递归可以同时进行。也叫归并算法，指的是将两个已经排序的序列合并成一个序列的操作。归并排序算法依赖归并操作。

实现方法

- 自上而下的递归

- 自下而上的迭代

迭代法

1. 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列

2. 设定两个指针，最初位置分别为两个已经排序序列的起始位置

3. 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置

4. 重复步骤3直到某一指针到达序列尾

5. 将另一序列剩下的所有元素直接复制到合并序列尾

递归法

原理如下（假设序列共有n个元素）

1. 将序列每相邻两个数字进行归并操作，形成 floor(n/2)个序列，排序后每个序列包含两个元素

2. 将上述序列再次归并，形成floor(n/4)个序列，每个序列包含四个元素

3. 重复步骤2，直到所有元素排序完毕

![mergeSort.gif](/images/201701/mergeSort.gif)

```
Array.prototype.merge_sort = function() {
    var merge = function(left, right) {
        var final = [];
        while (left.length && right.length)
            final.push(left[0] <= right[0] ? left.shift() : right.shift());
        return final.concat(left.concat(right));
    };
    var len = this.length;
    if (len < 2) return this;
    var mid = len / 2;
    return merge(this.slice(0, parseInt(mid)).merge_sort(), this.slice(parseInt(mid)).merge_sort());
};
```

## 快速排序（Quick Sort）

快速排序，又称划分交换排序（partition-exchange sort），使用分治法（Divide and conquer）策略来把一个序列（list）分为两个子序列（sub-lists）。

算法步骤

1. 从数列中挑出一个元素，称为"基准"（pivot），

2. 重新排序数列，所有元素比基准值小的摆放在基准前面，所有元素比基准值大的摆在基准的后面（相同的数可以到任一边）。在这个分区结束之后，该基准就处于数列的中间位置。这个称为分区（partition）操作。

3. 递归地（recursive）把小于基准值元素的子数列和大于基准值元素的子数列排序。

![quickSort.gif](/images/201701/quickSort.gif)

```
Array.prototype.quick_sort = function() {
    var len = this.length;
    if (len <= 1)
        return this.slice(0);
    var left = [];
    var right = [];
    var mid = [this[0]];
    for (var i = 1; i < len; i++)
        if (this[i] < mid[0])
            left.push(this[i]);
        else
            right.push(this[i]);
    return left.quick_sort().concat(mid.concat(right.quick_sort()));
};
```

## 堆排序（Heap Sort）

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。

最大堆：每个节点的值都大于或等于其子节点的值，在堆排序算法中用于升序排列；
最小堆：每个节点的值都小于或等于其子节点的值，在堆排序算法中用于降序排列；

堆排序的平均时间复杂度为 Ο(nlogn)

算法步骤

1. 创建一个堆 H[0..n-1]。

2. 把堆首（最大值）和堆尾互换。

3. 把堆的尺寸缩小 1，并调用 shift_down(0)，目的是把新的数组顶端数据调整到相应位置。

4. 重复步骤 2，直到堆的尺寸为 1。

```
Array.prototype.heap_sort = function() {
    var arr = this.slice(0);
    function swap(i, j) {
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }

    function max_heapify(start, end) {
        //建立父节点和子节点
        var dad = start;
        var son = dad * 2 + 1;
        if (son >= end)//若子节点超过范围直接跳出函数
            return;
        if (son + 1 < end && arr[son] < arr[son + 1])//先比较两个子节点大小，选择最大的
            son++;
        if (arr[dad] <= arr[son]) {//如果父节点小于子节点时，交换父子內容再继续子节点和孙节点比较
            swap(dad, son);
            max_heapify(son, end);
        }
    }

    var len = arr.length;
    //初始化，i从最后一个父节点开始调整
    for (var i = Math.floor(len / 2) - 1; i >= 0; i--)
        max_heapify(i, len);
    //先將第一个元素和已排好元素前一位做交换，再从新跳转，直到排序完毕
    for (var i = len - 1; i > 0; i--) {
        swap(0, i);
        max_heapify(0, i);
    }

    return arr;
};
var num = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
console.log(num.heap_sort());
```

![heapSort.gif](/images/201701/heapSort.gif)

## 计数排序（Counting Sort）

计数排序是一种稳定的线性时间排序算法。计数排序使用一个额外的数组C，其中第i个元素是待排序数组A中值等于i的元素的个数。然后根据数组C来将A中的元素排到正确的位置。

算法步骤

1. 找出待排序的数组中最大和最小的元素。

2. 统计数组中每个值为i的元素出现的次数，存入数组 C 的第 i 项。

3. 对所有的计数累加（从C中的第一个元素开始，每一项和前一项相加）。

4. 反向填充目标数组：将每个元素i放在新数组的第C(i)项，每放一个元素就将C(i)减去1。

![countingSort.gif](/images/201701/countingSort.gif)

```
function countingSort(arr, maxValue) {
    var bucket = new Array(maxValue+1),
        sortedIndex = 0;
        arrLen = arr.length,
        bucketLen = maxValue + 1;

    for (var i = 0; i < arrLen; i++) {
        if (!bucket[arr[i]]) {
            bucket[arr[i]] = 0;
        }
        bucket[arr[i]]++;
    }

    for (var j = 0; j < bucketLen; j++) {
        while(bucket[j] > 0) {
            arr[sortedIndex++] = j;
            bucket[j]--;
        }
    }

    return arr;
}
```

## 桶排序（Bucket Sort）

桶排序，也叫箱排序，工作原理是将数组分到有限数量的桶里。每个桶再个别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排序）。桶排序是鸽巢排序的一种归纳结果。

算法步骤

1. 设置一个定量的数组当作空桶子。

2. 寻访序列，并且把项目一个一个放到对应的桶子去。

3. 对每个不是空的桶子进行排序。

4. 从不是空的桶子里把项目再放回原来的序列中。

```
function bucketSort(arr, bucketSize) {
    if (arr.length === 0) {
      return arr;
    }

    var i;
    var minValue = arr[0];
    var maxValue = arr[0];
    for (i = 1; i < arr.length; i++) {
      if (arr[i] < minValue) {
          minValue = arr[i];                // 输入数据的最小值
      } else if (arr[i] > maxValue) {
          maxValue = arr[i];                // 输入数据的最大值
      }
    }

    //桶的初始化
    var DEFAULT_BUCKET_SIZE = 5;            // 设置桶的默认数量为5
    bucketSize = bucketSize || DEFAULT_BUCKET_SIZE;
    var bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;   
    var buckets = new Array(bucketCount);
    for (i = 0; i < buckets.length; i++) {
        buckets[i] = [];
    }

    //利用映射函数将数据分配到各个桶中
    for (i = 0; i < arr.length; i++) {
        buckets[Math.floor((arr[i] - minValue) / bucketSize)].push(arr[i]);
    }

    arr.length = 0;
    for (i = 0; i < buckets.length; i++) {
        insertionSort(buckets[i]);                      // 对每个桶进行排序，这里使用了插入排序
        for (var j = 0; j < buckets[i].length; j++) {
            arr.push(buckets[i][j]);                      
        }
    }

    return arr;
}
```

## 基数排序（Radix Sort）

基数排序是一种非比较型整数排序算法，其原理是将整数按位数切割成不同的数字，然后按每个位数分别比较。将所有待比较数值（正整数）统一为同样的数位长度，数位较短的数前面补零。然后，从最低位开始，依次进行一次排序。这样从最低位排序一直到最高位排序完成以后，数列就变成一个有序序列。

基数排序的方式可以采用LSD（Least significant digital）或MSD（Most significant digital），LSD的排序方式由键值的最右边开始，而MSD则相反，由键值的最左边开始。

- 计数排序：每个桶只存储单一键值

- 桶排序：每个桶存储一定范围的数值

- 基数排序：根据键值的每位数字来分配桶

![radixSort.gif](/images/201701/radixSort.gif)

```
var counter = [];
function radixSort(arr, maxDigit) {
    var mod = 10;
    var dev = 1;
    for (var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
        for(var j = 0; j < arr.length; j++) {
            var bucket = parseInt((arr[j] % mod) / dev);
            if(counter[bucket]==null) {
                counter[bucket] = [];
            }
            counter[bucket].push(arr[j]);
        }
        var pos = 0;
        for(var j = 0; j < counter.length; j++) {
            var value = null;
            if(counter[j]!=null) {
                while ((value = counter[j].shift()) != null) {
                      arr[pos++] = value;
                }
          }
        }
    }
    return arr;
}
```

## 参考

- [排序算法](https://zh.wikipedia.org/wiki/%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95)

- [常用排序算法总结](http://www.cnblogs.com/eniac12/p/5329396.html)

- [十大经典排序算法](https://github.com/hustcc/JS-Sorting-Algorithm)
