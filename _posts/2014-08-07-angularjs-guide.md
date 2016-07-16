---
layout: post
category : web
title: 'angularJS guide'
tagline: ""
tags : [angular, web]
---

### {{Angular.js}}代码更少，乐趣更多

#### 目录

1．简介

2．核心概念与基本用法

3．实战与技巧

4．学习资料

#### 简介

1．简称ng

2．目前最新版本1.3.0

3．放弃兼容IE8

4．Why AngularJS？

<!--break-->	

#### Why AngularJS


1、适合

后台存在大量的表单和数据报表，AngularJS可以很好地用来开发表单/报表类的应用程序

2、 简单，可读性强

声明式而非命令式编程，用声明的方式描述的UI界面可随着应用状态的改变而变化，从DOM操作代码中解脱

3、 强大的后台（Google）

相对靠谱的API文档（需翻墙）

备注：

> Why AngularJS?
> HTML is great for declaring static documents, but it falters when we try to use it for declaring dynamic views in web-applications. AngularJS lets you extend HTML vocabulary for your application. The resulting environment is extraordinarily expressive, readable, and quick to develop.

用angular写同样的功能一般是jquery代码量的一半以下

#### 缺点

1．兼容性
2．性能问题

备注：

1、兼容性，不兼容ie8以下，这个只能鄙视老土浏览器了，开发的时候直接放弃兼容（直接放弃治疗了）

2、一般后台数据量和用户量是不至于存在性能问题的，据说超过2000+个双向数据绑定才会在加载时出现卡的情况

1）后端分页限制数据量，缺点是不能实现纯前端搜索

2）前端分页

3）单向绑定1.3+版本

3、缺少实践方案或者推荐的最佳方案

#### 核心特性

1．MVC或MVVM
2．模块化
3．双向数据绑定
4．过滤器Filter
5．指令系统

备注：

指令就是一些附加在HTML元素上的自定义标记（例如：属性，元素，或css类）
Angular内置了一整套指令，如ngBind, ngModel, 和ngView。 就像你可以创建控制器和服务那样，你也可以创建自己的指令来让Angular使用。 当Angular 启动器引导你的应用程序时， HTML编译器就会遍历整个DOM，以匹配DOM元素里的指令。

<table class="table">
	<thead>
		<th>概念</th>
		<th>说明</th>
	</thead>
	<tbody>
		<tr>
			<td>模板(Template)</td>
			<td>带有Angular扩展标记的HTML</td>
		</tr>
		<tr>
			<td>指令(Directive)</td>
			<td>用于通过自定义属性和元素扩展HTML的行为</td>
		</tr>
		<tr>
			<td>模型(Model)</td>
			<td>用于显示给用户并且与用户互动的数据</td>
		</tr>
		<tr>
			<td>作用域(Scope)</td>
			<td>用来存储模型(Model)的语境(context)</td>
		</tr>
		<tr>
			<td>作用域(Scope)</td>
			<td>用来存储模型(Model)的语境(context)。模型放在这个语境中才能被控制器、指令和表达式等访问到</td>
		</tr>
		<tr>
			<td>表达式(Expression)</td>
			<td>模板中可以通过它来访问作用域（Scope）的变量和函数</td>
		</tr>
		<tr>
			<td>编译器(Compiler)</td>
			<td>用来编译模板(Template)，并且对其中包含的指令(Directive)和表达式(Expression)进行实例化</td>
		</tr>
		<tr>
			<td>过滤器(Filter)</td>
			<td>负责格式化表达式(Expression)的值，以便呈现给用户</td>
		</tr>
		<tr>
			<td>视图(View)</td>
			<td>用户看到的内容（即DOM）</td>
		</tr>
		<tr>
			<td>数据绑定(Data Binding)</td>
			<td>自动同步模型(Model)中的数据和视图(View)表现</td>
		</tr>
		<tr>
			<td>控制器(Controller)</td>
			<td>视图(View)背后的业务逻辑</td>
		</tr>
		<tr>
			<td>依赖注入(Dependency Injection)</td>
			<td>负责创建和自动装载对象或函数</td>
		</tr>
		<tr>
			<td>注入器(Injector)</td>
			<td>用来实现依赖注入(Injection)的容器</td>
		</tr>
		<tr>
			<td>模块(Module)</td>
			<td>用来配置注入器</td>
		</tr>
		<tr>
			<td>服务(Service)</td>
			<td>独立于视图(View)的、可复用的业务逻辑</td>
		</tr>
	</tbody>
</table>

问题：
	
AngularJS同样的示例用jquery如何实现？

- 双向数据绑定
- 过滤器
- 指令系统

#### 实战与技巧

- UI工具
- Angular-bootstrap
- Bootstrap components written in pure AngularJS by the AngularUI Team
- Angular showcase
- 一个基于angular的界面元素范例程序

- 表单示例
- 渲染数据表格
- 分页

Angular的实现

> 依赖数据，依靠声明式的标签实现

#### 注意事项


1、ng-if代替ng-show ng-hide

（ng-if之后的代码不会执行，ng-show会，提高性能）

2、用过滤器处理数据而不是在controller里写方法实现

（可复用）

3、用service获取数据而不是在controller里写方法实现

（理由类似MVC中M和C的分离，数据和业务逻辑分开，可复用）

4、在table要ng-repeat两次

（ ng-repeat-start、ng-repeat-end ）

5、 html

（ ng-bind-html  $sce的trustAsHtml() ）


Angularjs

	|--app.js           // 配置
	|--controllers.js          // 控制器（一般不共用）
	|--directives.js           // 指令文件(指令可共用)
	|--fliters.js               // 过滤器文件(过滤器可共用)
	|--services.js             // 服务文件(一般不共用)

#### 学习资料

1、[开发指南](https://gitcafe.com/Angularjs/Angularjs-Developer-Guide/blob/master/AngularJS%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%9701%EF%BC%9AAngularJS%E7%AE%80%E4%BB%8B.md)

2、[API参考](http://ngnice.com/docs/api)

3、[视频Egghead.io](http://pan.baidu.com/share/link?shareid=421562&uk=724988755&third=15)

4、Stack Overflow

5、[angular-ui](http://angular-ui.github.io/)

#### 备注：

[部署本地API教程](http://ngnice.com/posts/b667dee0150448)
	
或者[ip访问官网](http://182.92.105.242/angular/build/docs)	

一本书《使用AngularJS开发下一代WEB应用》

一个社区：angularjs中文社区 http://angularjs.cn/

一个博客：大漠之秋及大漠的视频、PPT









