---
layout: post
category : web
title: 'web-layout'
tagline: ""
tags : [web]
---

## display

- block，块元素，例如：div、p、form、header、footer、section等

- inline，行内元素，例如：span、a等

- none，一些特殊元素的默认 display 值，例如script。用来在不删除元素的情况下隐藏或显示元素。

- 其他display值，例如：list-item、flex[详细列表](https://developer.mozilla.org/en-US/docs/Web/CSS/display)

每个元素都有一个默认的display类型，可以重写。

<!--break-->

## margin

```
#main {
  width: 600px;
  margin: 0 auto; 
}

#main {
  max-width: 600px;
  margin: 0 auto; 
}
```

使用`max-width`替代`width`可以使浏览器更好地处理小窗口的情况。

## 盒模型

CSS 盒模型 (Box Model) 规定了元素框处理元素内容、内边距、边框 和 外边距 的方式

### 标准模式

完整定义DOCTYPE，都会触发标准模式；DOCTYPE缺失，在ie8及其以前版本下将会触发怪异模式（quirks 模式）

```
<!DOCTYPE HTML>
```

![standard_box.png](/images/201701/standard_box.png)

```
.box {
    width: 200px;
    height: 200px;
    border: 20px solid black;
    padding: 50px;
    margin: 50px;
}

total = 200px (width) + 40px (left + right padding) + 100px (left + right border) + 100px (left + right margin) = 440px
```

总宽度/高度=width/height+padding+border+margin

### 怪异模式

![quirks_box.png](/images/201701/quirks_box.png)

```
.box {
    width: 200px;
    height: 200px;
    border: 20px solid black;
    padding: 50px;
    margin: 50px;
}

total = 200px (width) + 100px (left + right margin) = 60 (content) + 40px (left + right padding) + 100px (left + right border) + 100px (left + right margin) = 300px
```

总宽度/高度=width/height + margin = 内容区宽度/高度 + padding + border + margin

## box-sizing

设置一个元素为 box-sizing: border-box; 时，此元素的内边距和边框不再会增加它的宽度。

```
.simple {
  width: 500px;
  margin: 20px auto;
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}
```

## position

static 默认值

```
.static {
  position: static;
}
```

relative 相对定位

```
.relative1 {
  position: relative;
}
.relative2 {
  position: relative;
  top: -20px;
  left: 20px;
  background-color: white;
  width: 500px;
}
```

fixed，固定定位，相对于视窗来定位，页面滚动，还是会停留在相同的位置

```
.fixed {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 200px;
  background-color: white;
}
```

absolute，绝对定位，相对于最近的positioned祖先元素，会随着页面滚动而移动

```
.relative {
  position: relative;
  width: 600px;
  height: 400px;
}
.absolute {
  position: absolute;
  top: 120px;
  right: 0;
  width: 300px;
  height: 200px;
}
```

## float 浮动布局

float

clear

```
.box {
  float: left;
  width: 200px;
  height: 100px;
  margin: 1em;
}
.after-box {
  clear: left;
}
.clearfix {
  overflow: auto;
}
```

简单浮动布局

```
nav {
  float: left;
  width: 200px;
}
section {
  margin-left: 200px;
}
```

## 百分比宽度布局

```
nav {
  float: left;
  width: 25%;
}
section {
  margin-left: 25%;
}
```

## inline-block 布局

```
nav {
  display: inline-block;
  vertical-align: top;
  width: 25%;
}
.column {
  display: inline-block;
  vertical-align: top;
  width: 75%;
}
```

## grid 网格单元布局

### grid概念

Grid Container

一个元素设置了属性值display: grid 或 inline-grid。

```
.container{
  display: grid; /* or inline-grid */
}
```

Grid布局以后，子元素的float、clear和vertical-align属性将失效。

Grid Item

container的子元素，不包括sub-item

```
<div class="container">
  <div class="item"></div> 
  <div class="item">
  	<p class="sub-item"></p>
  </div>
  <div class="item"></div>
</div>
```

网格线（Grid Line）

网格线组成了网格，是网格的水平和垂直的分界线。

![grid-line.png](/images/201701/grid-line.png)

网格轨道（Grid Track）

网格轨道是就是相邻两条网格线之间的空间，就好比表格中行或列。在网格中其分为grid column和grid row。

![grid-track.png](/images/201701/grid-track.png)

网格单元格（Grid Cell）

网格单元格是指四条网格线之间的空间。是最小的单位。

![grid-cell.png](/images/201701/grid-cell.png)

网格区域（Grid Area）

网格区域是由任意四条网格线组成的空间，所以他可能包含一个或多个单元格。

![grid-area.png](/images/201701/grid-area.png)

网格单元格顺序（order）

对网格单父元格进行顺序重排

### 浏览器支持

[http://caniuse.com/#feat=css-grid](http://caniuse.com/#feat=css-grid)

chrome启动支持CSS Grid Layout

chrome://flags/#enable-experimental-web-platform-features

在项目当中使用grid布局方式，则需要安装[css-grid-polyfill](https://github.com/FremyCompany/css-grid-polyfill)

### demo

等分

```
<html>
<head>
    <title></title>
<style type="text/css">
body {
  padding: 50px;
}
.container {
  display: grid;
  grid-template-columns: 100px 10px 100px 10px 100px 10px 100px;
  grid-template-rows: auto 10px auto 10px auto;
}
.grid-item {
  background-color: #000;
  color: #fff;
  padding: 20px;
  text-align: center;
}
.a1 {
  grid-column-start: 1;
  grid-column-end: 2; 
  grid-row-start: 1;
  grid-row-end: 2;
}
.b1 {
  grid-column-start: 3;
  grid-column-end: 4; 
  grid-row-start: 1;
  grid-row-end: 2; 
}
.c1 { 
  grid-column-start: 5;
  grid-column-end: 6; 
  grid-row-start: 1;
  grid-row-end: 2;
}
.d1 { 
  grid-column-start: 7;
  grid-column-end: 8; 
  grid-row-start: 1;
  grid-row-end: 2;
}
.a2 { 
  grid-column: 1 / 2; 
  grid-row: 3 / 4;
}
.b2 { 
  grid-column: 3 / 4; 
  grid-row: 3 / 4;
}
</style>
</head>
<body>
  <div class="container">
    <div class="grid-item a1">A1</div>
    <div class="grid-item b1">B1</div>
    <div class="grid-item c1">C1</div>
    <div class="grid-item d1">D1</div>
    <div class="grid-item a2">A2</div>
    <div class="grid-item b2">B2</div>
  </div>
</body>
</html>
```

垂直居中

```
<div class="vertical-container">
    <div class="content">垂直居中</div>
</div>
```

```
.vertical-container {
  height: 500px;
  width: 500px;
  display: grid;
  display: -webkit-grid;
  align-items: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-justify-content: center;
  background-color: green;
}

.content {
  height: 200px;
  width: 200px;
  line-height: 200px;
  text-align: center;
  background-color: yellow;
}
```

两栏/三栏布局

```
<div class="box box1">
    <div class="left">left</div>
    <div class="main">main</div>
</div>
<div class="box box2">
    <div class="left">left</div>
    <div class="main">main</div>
    <div class="right">right</div>
</div>
```

```
.box {
    display: grid;
    height: 200px;
    width: 100%;
    margin-bottom: 30px;
    grid-template-columns: 200px auto;
}
.box1 {
    grid-template-columns: 200px auto;
}
.box2 {
    grid-template-columns: 200px auto 100px;
}
.left {
    background-color: yellow;
    grid-area: 1/ 1/ 2/ 2;
}
.main {
    background-color: green;
    grid-area: 1/ 2/ 2/ 3;
}
.right {
    background-color: blue;
    grid-area: 1/ 3/ 2/ 4;
}
```

## flexbox 弹性布局

Flex（Flexible Box），弹性布局。

### flex概念

flex container

一个元素设置了属性值display: flex 或 inline-flex。

```
.container {
  display: flex; /* or inline-flex */
}
```

Flex布局以后，子元素的float、clear和vertical-align属性将失效

![flex.png](/images/201701/flex.png)

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做main start，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end。 项目默认沿主轴排列。单个项目占据的主轴空间叫做main size，占据的交叉轴空间叫做cross size。

设置在父级容器属性

```
flex-direction
flex-wrap
flex-flow
justify-content
align-items
align-content
```

flex-direction

![flex-direction.svg](/images/201701/flex-direction.svg)

```
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}

row（默认值）：主轴为水平方向，起点在左端。
row-reverse：主轴为水平方向，起点在右端。
column：主轴为垂直方向，起点在上沿。
column-reverse：主轴为垂直方向，起点在下沿.
```

flex-wrap

![flex-wrap.svg](/images/201701/flex-wrap.svg)

```
.container{
  flex-wrap: nowrap | wrap | wrap-reverse;
}

nowrap (default): single-line 不换行。
wrap: multi-line 换行，第一行在上方。
wrap-reverse: multi-line 换行，第一行在下方。
```

flex-flow

flex-direction 和 flex-wrap的简写，默认值为row nowrap

```
flex-flow: <‘flex-direction’> || <‘flex-wrap’>
```

justify-content

设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式

```
.container {
  justify-content: flex-start|flex-end|center|space-between|space-around|initial|inherit;
}

flex-start（默认值）：左对齐
flex-end：右对齐
center： 居中
space-between：两端对齐，项目之间的间隔都相等。
space-around：每个项目两侧的间隔相等
```

![justify-content.svg](/images/201701/justify-content.svg)

align-items

flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式

![align-items.svg](/images/201701/align-items.svg)

```
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

align-content

在弹性容器内的各项没有占用交叉轴上所有可用的空间时对齐容器内的各项（垂直）

![align-content.svg](/images/201701/align-content.svg)

```
.container {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

flex items

flex容器的子元素

![flex-items.svg](/images/201701/flex-items.svg)

设置在子元素上的属性

```
order
flex-grow
flex-shrink
flex-basis
flex
align-self
```

order

flex items 的排序

```
.item {
  order: <integer>;
}
```

![flex-order.svg](/images/201701/flex-order.svg)

flex-grow

子元素宽的比重

```
.item {
  flex-grow: <number>; /* default 0 */
}
```

flex-shrink

收缩比，比如第二个元素收缩到其他元素的三分之一

```
.item2 {
  flex-shrink: 3;
}
```

flex-basis

用于设置或检索弹性盒伸缩基准值，比如设置第二个弹性盒元素的初始长度为80px。

```
.item2 {
  flex-basis: 80px;
}
```

flex

flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。

```
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

align-self

flex子项单独在侧轴（纵轴）方向上的对齐方式

![align-self.svg](/images/201701/align-self.svg)

```
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

### 浏览器支持

[http://caniuse.com/#feat=flexbox](http://caniuse.com/#feat=flexbox)

### demo

垂直居中布局

```
<div class="vertical-container">
    <div class="content">垂直居中</div>
</div>
```

```
.vertical-container {
  height: 500px;
  width: 500px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  -webkit-align-items: center;
  justify-content: center;
  -webkit-justify-content: center;
  background-color: green;
}

.content {
  height: 200px;
  width: 200px;
  line-height: 200px;
  text-align: center;
  background-color: yellow;
}
```

两栏/三栏布局

```
<div class="box">
  <div class="left">left</div>
  <div class="main">main</div>
</div>
<div class="box">
  <div class="left">left</div>
  <div class="main">main</div>
  <div class="right">right</div>
</div>
```

```
.box {
  display: flex;
  height: 200px;
  margin-bottom: 30px;
}
.left {
  background-color: yellow;
  flex-basis: 200px;
  /* flex-basis定义该项目在分配主轴空间之前提前获得200px的空间 */
  flex-grow: 0;
  /* flex-grow定义该项目不分配剩余空间 */
}
.main {
  background-color: green;
  flex-grow: 1;
  /* flex-grow定义main占满剩余空间 */
}
.right {
  background-color: blue;
  flex-basis: 100px;
  flex-grow: 0;
}
```

## 参考

- [learnlayout](http://learnlayout.com/display.html)、[learnlayout中文版](http://zh.learnlayout.com/)

- [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

- [A Visual Guide to CSS3 Flexbox Properties](https://scotch.io/tutorials/a-visual-guide-to-css3-flexbox-properties)

- [css-grid-flex](http://www.xingbofeng.com/css-grid-flex/)

- [Flex 布局应用](https://gold.xitu.io/post/589965c9128fe1006569cc9d)