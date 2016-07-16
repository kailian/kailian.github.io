---
layout: post
category : web
title: '前端组件化'
tagline: ""
tags : [web]
---

2014-10-14的一次分享，记录一下

##目录

- 需求

- 模块化开发

- 组件化开发

- 参考资料

<!--break-->

##存在的问题

1、静态资源内嵌

即写在script和style内，重复写代码。不利于CSS、js静态化资源通过CDN分发。

2、代码复制

ctrl+c/ctrl+v，暂时解决问题，但是改动需要遍历所以代码，挨个修改

3、前后端高度耦合

缺少数据模拟，前端需等待后端数据接口（前后端分离的情况下）

举个例子：分页插件，有一天需要加一个现实数据条数的功能，结果需要每个地方都唉个去加
组件化后，则需要在模板上添加就可以实现全部用到的地方都使用，甚至可配置（即选择加或不加）

##需求

- 不是从零开始，可复用

- 模块化开发

- 组件化开发，搭积木一样组装

- 资源压缩，性能要好

- 文件监听，自动刷新

- ……

##开发体系

- Seajs （支付宝团队）

- fis-plus （百度前端）

- Modjs （腾讯AlloyTeam ）

- Yeoman （谷歌）

- Scrat （ UC 基于fis）

##模块化

- seaJS

- requireJS

RequireJS 和 SeaJS 则是模块加载器
核心是 LAB（Loading and Blocking）：Loading 指异步并行加载，Blocking 是指同步等待执行。

注：AngularAMD，ng使用requireJS

##为什么用seaJS

- 命名冲突

- 文件依赖，按需加载

- 请求合并，解决需要引入一堆js

- 前端性能优化（异步加载模块）

- 提高可维护性

##命名冲突

`util.js`有一个`function print()`

你这个函数为啥叫`print`啊！正好我也刚写了个函数叫`print`啊！要不我改名叫`print2`！

我引入了个开源的模块，里面也有个函数叫 `print` 啊！改人家的怕有问题，要不改你的吧！

##架构的变更

后端MVC`=>`前端MVC、MVP、MVVM

后端MVC

##什么是SPA

Web程序在往`SPA`（单页面程序，Single Page Application）的方向发展。

- 前端交互逻辑增加，体验较好

- 分离前后端关注点，后端负责数据接口

- 高效，异步加载数据，服务器压力小，对于内容的改动不需要加载整个页面

用iframe的方式引入，但每个iframe要独立引入一些公共文件，服务器文件传输的压力较大，还要初始化自己的一套内存环境，比较浪费
iframe互相之间也不太方便通信

##组件化

组件化：界面的片段化和模板化

就写界面来说，`声明式`的代码编写效率远高于`命令式`

	<Panel title="Test">
	  <Button label="Click me"/>
	</Panel>

	Panel p = new Panel();
	p.title = "Test";
	Button b = new Button();
	b.label = "Click me";
	p.add(b);

##如何做组件化
   
`AngularJS`可以用`Service`和`Directive`降低开发复杂性。适合用于分离代码，创建可测试组件，可重用组件。

`Directive`是一组独立的JavaScript、HTML。封装了一个特定的行为。

##第三方组件

UI-bootstrap

Angular-strap

##参考资料

- [前端开发体系建设日记](https://github.com/fouber/blog/blob/0f209ae98263a4d40c4724311cc09d57ea77fa09/201404/01.md)

- [Scrat项目](http://scrat-team.github.io/)

- [手机百度前端工程化之路](http://mweb.baidu.com/p/baidusearch-front-end-road.html)

- [基于公共组件开发心得](http://www.imooc.com/video/3991)

- [Web应用的组件化开发](https://github.com/xufei/blog/blob/master/posts/2013-11-20-Web%E5%BA%94%E7%94%A8%E7%9A%84%E7%BB%84%E4%BB%B6%E5%8C%96%E5%BC%80%E5%8F%91%EF%BC%88%E4%B8%80%EF%BC%89.md)







