---
layout: post
category : web
title: 'bootstrap栅格系统'
tagline: ""
tags : [web]
---

## Container

这个容器class为.container类有2个目的
1、在响应式宽度上提供宽度约束。响应式尺寸的改变其实改变的是container，行(rows)和列(columns)都是基于百分比的所以它们不需要做任何改变；
2、提供padding以至于不内容不紧贴于浏览器边缘，两边都是15px；

<!--break-->

## Row

Class为`.row`的容器
row为col提供了空间，一行上分了12col，当所有col都向左浮时row也就扮演了容器角色，另外当浮动有问题时row也不会重叠

Rows的两侧都拥有独特的负15pxmargin值,如下图中蓝色部分.被当作为row的div被约束在container内边界与粉色区域重叠，但没超过。这负的15pxmargin值把row的推出了container的15pxpadding，并与之重叠，本质上讲就是负出去。为什么这么做呢？原因得看列(col)的工作原理，下面我们会看到

注：不要在container外用row，row在container外面使用是无效的

## Column

列(col)现在有15px的padding了，如下图中黄颜色部分。Container的正padding值造成了15px的留空，row用负margin值反的延伸回去，

所以现在col的padding值与container的padding重叠了

不要在row外使用col，在row外使用col是无效的

## Content Within a Column

列(col)的padding给内容提供了空白，使内容不会紧贴在浏览器边界上，列之间有padding不会互相紧贴在一起。

`container/row/column`最终要达到的结果就是为了col的补白

## Nesting嵌套

可以在column内再创建新的栅格系统。你在右侧的列(col)内添加新的行(row)时不需再嵌container

列(col)扮演了container一样的角色，列也有15px的padding值

列也可以嵌套到行内

## Offsets 偏移

偏移的实现是在列(col)的左侧加上了margin值

## pull and push

基于响应式布局，对布局进行翻转，尤其是对移动设备上对列进行重新排列

push pull 的实现是通过添加 position，push 添加的是 left 值， pull 添加的是 right 值

## 相关

- [bootstrap3 grid](http://www.helloerik.com/the-subtle-magic-behind-why-the-bootstrap-3-grid-works)

- [百科-网页栅格系统](http://www.baike.com/wiki/%E7%BD%91%E9%A1%B5%E6%A0%85%E6%A0%BC%E7%B3%BB%E7%BB%9F)