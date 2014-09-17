---
layout: post
category : web
title: '初步理解angular directives(二)'
tagline: ""
tags : [web, angular]
---

* auto-gen TOC:
{:toc}

### directive是什么？

> 一个指令用来引入新的HTML语法。指令是DOM元素上的标记，使元素拥有特定的行为。就是一些附加在HTML元素上的自定义标记（例如：属性，元素，或css类）

比如`ng-mode`，`ng-repeat`，`ng-show`等。

这些指令都赋予DOM元素特定的行为。例如，`ng-repeat`重复特定的元素，`ng-show` 有条件地显示一个元素。

<!--break-->

通过对元素绑定事件监听或者改变DOM而使HTML拥有真实的交互性。

### 指令是如何被编译的

当Angular启动器引导你的应用程序时，HTML编译器$compile 服务就会遍历整个DOM，以匹配DOM元素里的指令。执行compile方法返回一个 link函数。

### 自定义指令

一个Angular指令可以有以下的四种表现形式：

1、一个新的HTML元素

	<data-picker></data-picker> 

2、元素的属性

	<input type="text" data-picker/> 

3、 CSS class

	<input type="text" class="data-picker"/>

4、注释

	<!–directive:data-picker –>

> 最佳实践: 最好通过标签名和属性来使用指令而不要通过注释和类名。

注意： 在匹配指令的时候，Angular会在元素或者属性的名字中剔除 x- 或者 data- 前缀。 然后将 – 或者 : 连接的字符串转换成驼峰(camelCase)表现形式，然后再与注册过的指令进行匹配。这是为什么，我们在HTML中以 hello-world 的方式使用 helloWorld 指令。

	<span ng-bind="name"></span>
	<span ng:bind="name"></span>
	<span ng_bind="name"></span>
	<span data-ng-bind="name"></span>
	<span x-ng-bind="name"></span>

和控制器一样，指令也是注册在模块上的。 要注册一个指令，你可以用 module.directive API

注意: 创建指令的时候，默认仅使用属性的方式。为了创建一个能由元素名字触发的指令，你需要用到restrict选项。

> restrict

选项restrict可以设置成以下方式：

- `A` 仅匹配属性名

- `E` 仅匹配元素名

- `AE` 既匹配属性名又匹配元素名

如果要允许指令被当作class来使用，将 restrict 设置成 `AEC`。

什么情况下该用元素名，什么情况下该用属性名？ 

当创建一个含有自己模板的`组件`的时候，建议使用`元素名`，常见情况是，当你想为你的模板创建一个DSL（特定领域语言）的时候。如果仅仅想为已有的元素`添加功能`，建议使用`属性名`。

> template

	template: '<p style="background-color:{{color}}">Hello World',

大多数将模板放到一个特定的HTML文件中，然后将 templateUrl 属性指向它

> replace 默认false

true 指明生成的HTML内容会替换掉定义此指令的HTML元素

false 生成的模板会被插入到定义指令的元素中

> scope 默认false

默认情况下，指令获取它父节点的controller的scope，并不会创建新的子scope。

指令的独立作用域

隔离了除你添加到scope: {} 对象中的数据模型之外的一切东西。这对于你要建立一个可复用的组件来说是非常有用的， 因为它可以阻止除你传入的数据模型之外的一切东西改变你内部数据模型的状态。

	app.directive('helloWorld', function() {
	  return {
	    scope: {},  // use a new isolated scope
	    restrict: 'AE',
	    replace: 'true',
	    template: '<h3>Hello World!!</h3>'
	  };
	});

> link

link函数主要用来为DOM元素添加事件监听、监视模型属性变化、以及更新DOM。

	link: function(scope, elem, attrs) {
		//do something
	}

> compile

compile 函数在 link 函数被执行之前用来做一些DOM改造。

compile 函数不能访问 scope，并且必须返回一个 link 函数。不能用link，link函数由compile返回。

	app.directive('test', function() {
	  return {
	    compile: function(tElem,attrs) {
	      //do optional DOM transformation here
	      return function(scope,elem,attrs) {
	        //linking function here
	      };
	    }
	  };
	});


> 最佳实践: 指令应该自己管理自身分配的内存。当指令被移除时， 你可以使用element.on('$destroy', ...) 或 scope.$on('$destroy', ...)来执行一个清理的工作。

创建包含其他元素的指令

`transclude`使带有这个选项的指令，所包裹的内容能够访问指令外部的作用域。

> 最佳实践: 仅当你要创建一个包裹任意内容的指令的时候使用transclude: true

	app.directive('outputText', function() {
	  return {
	    transclude: true,
	    scope: {},
	    template: '<div ng-transclude></div>'
	  };
	});

	<div output-text>
	  <p>Hello {{name}}</p>
	</div>

DOM内容 `<p>Hello {{name}}</p>` 被提取和放置到 `<div ng-transclude></div>` 内部。


> 最佳实践: 当你想暴露一个API给其它的指令调用那就用controller,否则用link。

