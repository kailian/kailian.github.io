---
layout: post
category : web
title: 'web性能优化'
tagline: ""
tags : [web]
---

## 网页的性能指标

首屏加载时长

DOM加载时长

页面白屏时长

关键性的数据指标 RAIL模型

![rail.png](/images/201702/rail.png)

- Respond：0 - 100ms，视窗一般需要在这个时间段响应用户，超过这个时间段，用户就会感觉到延时。

- Animation：0~16ms，屏幕每秒刷新60次，16ms 代表的是每一帧的时间。用户是非常关注动画的，当动画失帧很容易引起用户察觉。所以动画一般要控制在60FPS。

- Idle：最大化主进程的空闲时间，这样可以及时响应用户输入。

- Load：内容需要在1000ms 内加载出来，超过1000ms 会觉得加载缓慢。

<!--break-->

Navigation Timing API

浏览器发出一系列可捕获的事件，捕获关键呈现路径的不同阶段，Navigation Timing 为评估关键呈现路径提供了细粒度的时间戳

![dom-navtiming.png](/images/201702/dom-navtiming.png)

- domLoading：这是整个过程开始的时间戳，浏览器开始解析 HTML 文档第一批收到的字节 document。

- domInteractive：标记浏览器完成解析并且所有 HTML 和 `DOM 构建完毕`的时间点。

- domContentLoaded：标记 DOM 准备就绪并且没有样式表阻碍 JavaScript 执行的时间点，可以开始构建呈现树。很多 JavaScript 框架等待此事件发生后，才开始执行它们自己的逻辑。因此，浏览器会通过捕获 EventStart 和 EventEnd 时间戳，跟踪执行逻辑所需的时间。

- domComplete： 顾名思义，所有的处理完成，网页上所有资源（图片等） 下载完成 - 即加载旋转图标停止旋转。

- loadEvent：作为每个网页加载的最后一步，浏览器会触发onLoad事件，以便触发附加的应用逻辑。

```
<html>
  <head>
    <title>Critical Path: Measure</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link href="style.css" rel="stylesheet">
    <script>
      function measureCRP() {
        var t = window.performance.timing,
          interactive = t.domInteractive - t.domLoading,
          dcl = t.domContentLoadedEventStart - t.domLoading,
          complete = t.domComplete - t.domLoading;
        var stats = document.createElement('p');
        stats.textContent = 'interactive: ' + interactive + 'ms, ' +
            'dcl: ' + dcl + 'ms, complete: ' + complete + 'ms';
        document.body.appendChild(stats);
      }
    </script>
  </head>
  <body onload="measureCRP()">
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg"></div>
  </body>
</html>
```

## 渲染引擎

渲染引擎主要是将 WEB 资源如 HTML、CSS、图片、JavaScript等经过一系列加工，最终呈现出展示的图像。渲染引擎主要包含了对这些资源解析的处理器，如 HTML 解释器、CSS 解释器、布局计算+绘图工具、JavaScript 引擎等。为了更好地呈现渲染效果，渲染引擎还会依赖网络栈、缓存机制、绘图工具、硬件加速机制等。

浏览器的渲染过程包括：

1. 网页资源加载过程

2. 渲染过程

![full_path.png](/images/201702/full_path.png)

## 关键呈现路径

目标是优先显示与用户要在网页上执行的主要操作有关的内容

浏览器究竟是如何使用我们的 HTML、CSS 和 JavaScript 在屏幕上呈现像素呢？

浏览器要在屏幕上渲染内容，需要先构建 DOM 与 CSSOM 树

![critical-rendering-path.png](/images/201702/critical-rendering-path.png)

### DOM构建

![full-process.png](/images/201702/full-process.png)

1. 转换：浏览器从磁盘或网络读取 HTML原始字节，然后根据指定的文件编码格式（例如 UTF-8）将其转换为相应字符。

2. 符号化：浏览器将字符串转换为 W3C HTML5 标准 指定的各种符号。及其他「尖括号」内的字符串。每个符号都有特殊含义并一套规则。

3. 词法分析：发射的符号转换为「对象」，定义它们的属性与规则。

4. DOM 构建：最后，因为 HTML 标记定义不同标签间的相互关系（某些标签嵌套在其他标签中），所以创建的对象在树状数据结构中互相链接，树状数据结构还捕获原始标记中定义的父子关系：比如 HTML 对象是 body 对象的父对象，body 是 paragraph 对象的父对象等等。

最终输出是文档对象模型，即这个简单网页的 "DOM"。

### CSSOM构建

CSS 字节会转换为字符，然后转换为符号和节点，最后链接进树状结构上，即所谓「CSS 对象模型」，缩写为 CSSOM

![cssom-construction.png](/images/201702/cssom-construction.png)

![cssom-tree.png](/images/201702/cssom-tree.png)

### 渲染树构建

CSSOM 树与 DOM 树融合成一棵渲染树，随后计算每个可见元素的布局，并输出给绘制过程，在屏幕上渲染像素。

![render-tree-construction.png](/images/201702/render-tree-construction.png)

- DOM 树与 CSSOM 树融合成渲染树。

- 渲染树只包括渲染页面需要的节点。

- 布局计算每个对象的精确位置及尺寸。

- 最后一步的绘制，输入确定的渲染树，在屏幕上渲染像素。

为了构建渲染树，浏览器大致做了如下：

- 从 DOM 树的根节点开始，遍历每个可见的节点。

- 某些节点完全不可见（例如 script 标签、meta 标签等），因为它们不会在渲染结果中反映，所以会被忽略。

- 某些节点通过 CSS 隐藏，因此在渲染树中也会被忽略。比方说，上面例子中的 span 节点，因为该节点有一条显式规则设置了 display:none 属性，所以不会出现在渲染树中。

- 给每个可见节点找到相应匹配的 CSSOM 规则，并应用这些规则，连带其内容及计算的样式。

注意： visibility: hidden 与 display: none 是不一样的。前者隐藏元素，但该元素在布局中仍占据空间（即被渲染成一个空盒子），而后者 (display: none) 是直接从渲染树中整个地移除元素，该元素既不可见，也不属于布局。

### 布局

布局过程输出一个「盒模型」，它精确捕获每个元素在视口中的准确位置及尺寸：所有相对度量单位都被转换为屏幕上的绝对像素位置，等等。

### 绘制

把渲染树中的每个节点转换为屏幕上的实际像素，绘制元素样式，颜色、背景、大小、边框等。

![full-render.png](/images/201702/full-render.png)

## 优化关键呈现路径

- 尽量减少关键资源数量。

- 尽量减少关键字节数。

- 尽量缩短关键路径的长度。

优化关键呈现路径常规步骤：

- 分析和描述关键路径：资源数量、字节数、长度。

- 尽量减少关键资源数量：删除相应资源、延迟下载、标记为异步资源等等。

- 优化剩余关键资源的加载顺序：您需要尽早下载所有关键资源，以缩短关键路径长度。

- 尽量减少关键字节数，以缩短下载时间（往返次数）

## yahoo rules

[yahoo-rules](https://developer.yahoo.com/performance/rules.html)

网页内容

- 减少http请求次数

- 减少DNS查询次数

- 避免页面跳转

- 缓存ajax

- 延迟加载

- 提前加载

- 减少DOM元素数量

- 根据域名划分内容

- 减少iframe数量

- 避免404

服务器

- 使用CDN

- 添加Expires或Cache-Control报文头

- Gzip压缩传输文件

- 配置ETags

- 尽早flush输出

- 使用GET ajax请求

- 避免空的图片src

Cookie

- 减少Cookie大小

- 页面内容使用无cookie域名

CSS

- 将样式表置顶

- 避免CSS表达式

- 用<link>替代@import

JavaScript

- 将脚本置底

- 使用外部JavaScript和CSS文件

- 精简JavaScript和CSS文件

- 去除重复脚本

- 减少DOM访问

- 使用智能事件处理

图片

- 优化图像

- 优化CSS Sprite

- 不要在html中缩放图片

- 使用小且可缓存的favicon.ico

移动客户端

- 保持单个内容小于25KB

- 打包组件成Multipart文档

## 阻塞渲染的 CSS

默认情况下，CSS 被视为阻塞渲染的资源，这意味着在 CSSOM 构建完成前，浏览器会暂停渲染任何已处理的内容。确保精减你的 CSS，尽快传送它，并使用媒体类型与媒体查询来解除阻塞。

一些 CSS 样式只在特定条件下使用，比如，页面打印

CSS 「媒体类型」和「媒体查询」允许我们解决这类情况

```
<link href="style.css" rel="stylesheet">
<link href="print.css" rel="stylesheet" media="print">
<link href="other.css" rel="stylesheet" media="(min-width: 40em)">
```

媒体查询由媒体类型以及零个或多个检查特定媒体特征的表达式组成。

「阻塞渲染」仅是指该资源是否会暂停浏览器的首次页面渲染。无论 CSS 是否阻塞渲染，CSS 资源都会被下载，只是说非阻塞性资源的优先级比较低而已。

## 优化JavaScript的执行

HTML 解析器遇到一个 script 标签，它会暂停构建 DOM，并移交控制权给 JavaScript 引擎；等 JavaScript 引擎执行完毕，浏览器从中断的地方恢复 DOM 构建。

执行内联脚本会阻塞 DOM 构建，也就延缓了首次渲染。

- 脚本在文档中的位置很重要

- JavaScript 可以查询、修改 DOM 与 CSSOM。

- JavaScript 的执行因 CSSOM 而阻塞。

- 除非明确声明 DOM 构建为异步，否则 JavaScript 会阻塞这一流程

避免运行时间长的 JavaScript

当 JS 处理事件过长时，输入事件的响应会一直处于阻塞状态，直到 JS 处理完成。页面里的动画效果大多是通过JavaScript触发的。有些是直接修改DOM元素样式属性而产生的，有些则是由数据计算而产生的，比如搜索或排序。错误的执行时机和太长的时间消耗，是常见的导致JavaScript性能低下的原因。

- 避免长时间的 JS 执行。

- 避免在处理中改变样式。因为样式改变会引起后面布局、绘制、合成等操作。

- 对用户输入进行消抖

- 对于动画效果的实现，避免使用setTimeout或setInterval，请使用requestAnimationFrame。

- 把耗时长的JavaScript代码放到Web Workers中去做。

- 把DOM元素的更新划分为多个小任务，分别在多个frame中去完成。

JavaScript代码是运行在浏览器的主线程上的。与此同时，浏览器的主线程还负责样式计算、布局，甚至绘制（多数情况下）的工作。可以想象，如果JavaScript代码运行时间过长，就会阻塞主线程上其他的渲染工作，很可能就会导致帧丢失。

可以把纯计算工作放到Web Workers中做（如果这些计算工作不会涉及DOM元素的存取）。

```
var dataSortWorker = new Worker("sort-worker.js");
dataSortWorker.postMesssage(dataToSort);

// The main thread is now free to continue working on other things...

dataSortWorker.addEventListener('message', function(evt) {
   var sortedData = e.data;
   // Update data on screen...
});
```

使用异步 JavaScript

默认情况下，所有 JavaScript 均会阻塞解析器，因为浏览器不知道脚本想在页面上做什么，因此它必须假定最糟的状况并阻塞解析器。

将 async 关键字添加到 script 标签，告诉浏览器，在它等脚本准备就绪前不应阻塞 DOM 构建。

```
<script src="app.js" async></script>
```

延迟解析 JavaScript

任何非必需的标记（即对构建首次呈现的内容无关紧要的标记）都应予以延迟，从而尽量降低浏览器呈现网页时所需的工作量。

## 避免大规模、复杂的布局

尽可能避免触发布局

使用flexbox替代老的布局模型

避免强制同步布局事件的发生

避免快速连续的布局

## 资源加载

消除不必要的下载，通过各种压缩技术来优化资源的传输编码，并利用缓存来消除多余的下载

1. 最快和最好的优化资源是不需要下载的资源，抓住一切机会删除应用中不必要的资源

2. 压缩JavaScript和CSS，减少资源大小，移除注释、空格、重复css和脚本，模块化管理工具

3. 接口只返回必须的数据

4. 按需加载，模块化管理，只加载模块需要的资源

5. 在ajax请求中优先使用GET方法，POST方法在浏览器中分两步执行：先发送头部，然后发送数据

6. 使用 GZIP 进行文本压缩，gzip on

## 优化图片

1. CSS Sprites是减少图片请求，使用CSS+文字替代图片，使用font图标替代图片图标

2. Image maps把多张图片组合成为一张图片

3. 优化矢量图，通过运行 svgo 之类的工具缩减 SVG 文件，采用 GZIP 压缩

## 资源缓存

1. 浏览器使用缓存以减少HTTP请求的数量和大小（更新使用不用版本资源），被缓存资源的请求服务器是 304响应，只有 Header没有Body ，可以节省带宽

2. ajax请求数据缓存到本地，对比更新时间是否从缓存中获取

3. 服务端使用memcached缓存，减少接口请求等待

## 链接重用

1. 使用keepalive重用链接，减少资源消耗，缩短响应时间

## 并发请求

1. 启用和主站不同的域名来放置静态资源，使用CDN或独立静态资源域名

2. cookie free，请求静态资源用不用域名避免带上多余的cookie

## 异步处理

1. 使用异步请求数据实现页面局部刷新，不用刷新整个页面

2. 接口使用异步处理，比如操作完成后先返回数据再异步处理rtx弹窗

## 更新http版本

1. 升级http2

## 利用工具

避免重复性工作

简化繁琐的工作流程

前端工具：gulp、webpack

## 参考

[critical-rendering-path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)

[渲染性能](https://github.com/sundway/blog/issues/2)