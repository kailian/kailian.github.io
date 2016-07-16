---
layout: post
category : web
title: '翻译：ng-repeat过滤技巧'
tagline: ""
tags : [web, angular]
---

> 原文：[Tip: Accessing Filtered Array Outside Ng-repeat](http://angular-tips.com/blog/2014/08/tip-accessing-filtered-array-outside-ng-repeat/)

场景：将数组`peple`在`ng-repeat`中过滤`filter`，然后使用处理过滤后的结果。

问题：

- 根据匹配项的数量重新计算分页

- 基于结果的数目改变模板

- 获取不到结果时显示一条信息

- 显示符合搜索返回项的数量

<!--break-->

controller

	app.controller('MainCtrl', function($scope) {
	  $scope.people = ['fox', 'rosi', 'err3', 'rob', 'cesar', 'geoff'];
	});

html

	<body ng-controller="MainCtrl">
	  <h2>List of people</h2>
	  Search: <input type="text" ng-model="search">
	  <ul>
	    <li ng-repeat="person in people | filter:search" ng-bind="person">
	    </li>
	  </ul>
	  Number of filtered people: <span ng-bind="people.length"></span>
	</body>

悲剧的是过滤的people数目并没有更新。同时，如果没有匹配结果，我想看到一些信息，至少知道我是获取不到结果而不是发生了错误。

如何实现？

我们不能计算原始数组的`length`长度，它不会改变。如果新建一个仅仅包含过滤后的people数据会如何？我们可以在controller中创建一些方法在`ng-repeat`时进行过滤然后遍历它。

这挺不错的但违背了我们没有因过滤在我们漂亮的html产生多余代码的目的。

更好的方式？

	<body ng-controller="MainCtrl">
	  <h2>List of people</h2>
	  Search: <input type="text" ng-model="search">
	  <ul>
	    <li ng-repeat="person in filteredPeople = (people | filter:search)" ng-bind="person">
	    </li>
	  </ul>
	  <p ng-hide="filteredPeople.length">There is no result</p>
	  Number of filtered people: <span ng-bind="people.length"></span>
	</body>

我们在`html`中直接创建了一个新数组。

过滤数组`people`,保存结果到新数组`filteredPeople`，最后遍历它

好处:

在`html`和`controller`中得到我们需要的`filteredPeople`

我们可以得到正确的length在得不到结果的时候去显示一个信息和计算过滤后数组的数目

坏处：

But what are the disadvantage? filteredPeople is going to be evaluated in every $digest and on a big big list it can be problematic and then is when we should consider doing the filtering on the controller.

在每个`$digest`中`filteredPeople`将会被重新评估，在大列表中可能成为问题。这也是我们在`controller`中过滤时需要思考的。

题外话。

angular前端分页不得不提的问题：

- 数据量大

- 性能问题



