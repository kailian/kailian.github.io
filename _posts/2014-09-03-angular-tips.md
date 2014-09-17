---
layout: post
category : web
title: 'angular问题或技巧'
tagline: ""
tags : [web, angular]
---

* auto-gen TOC:
{:toc}

### 如何使用ng标签中使用html

1、使用$sce和ng-bind-html

	<div ng-bind-html="trustHtml()"></div>
	var app = angular.module('app', []);
	app.controller.("ctrl", function( $scope $sce) {
	    $scope.temHtml = '<p style="color:blue">an html</p>';
	    $scope.trustHtml = function() {
	      return $sce.trustAsHtml($scope.temHtml);
	    };
	});

<!--break-->

2、加入module ngSanitize和使用ng-bind-html

	<div ng-bind-html="temHtml"></div>
	<script src="angular-sanitize.js">
	var app = angular.module('app', ['ngSanitize']);
	app.controller.("ctrl", function( $scope ){
		$scope.temHtml = '<p style="color:blue">an html</p>';
	});
	

通用修改第三方组件支持html

- 引入ngSanitize

- 修改tpl的ng-bind为ng-bind-html

###  ng-class的使用

1、判断isActive选择样式

	<div ng-class="{true: 'active', false: 'inactive'}[isActive]"></div>
	$scope.isActive = true;

2、key-value形式，value成立，使用对应样式		

	<p ng-class="{strike: deleted, bold: important, red: error}">Map Syntax Example</p> 

3、数组，与ng-repeat一起使用
	
	<div ng-class="{true: 'active', false: 'inactive'}[isActive[$index]]"></div>

	$scope.isActive = [];
	$scope.changeClass = function( index ) {
		angular.isUndefined($scope.isActive[index]) ? 
		$scope.isActive[index]  = true :
		$scope.isActive[index] = !$scope.isActive[index];	
	}

### 有ng标签继续执行的时候，用ng-if代替ng-hide或ng-show

ng-if可阻止渲染

### ng前端分页

使用ui.bootstrap.pagination

	<tr ng-repeat="item in items | offset: currentPage*perPage | limitTo: perPage">
		<td ng-bind="$index+1+(currentPage-1)*perPage"></td>
	</tr>

	<pagination boundary-links="true" total-items="totalItems" ng-model="currentPage" class="pagination-sm" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;"></pagination>

	$scope.maxSize = 5;
  	$scope.currentPage = 1;
  	$scope.perPage = 10;
  	$scope.totalItems = 64;//$scope.items.length

### 使用第三方module或者引入ng的其他module

记得在模块依赖加入依赖，尤其是在控制台没报错而代码确认没问题的时候。

	var app = angular.module('app', [
	  'ngCookies',
	  'ngSanitize',
	])

### angular的前端排序问题

ng-repeat当key-value的key不是顺序索引时，会导致排序失效

php数据先用array_merge()重新索引或前端重新索引

### 前端搜索完全匹配

比如：不想1匹配出11、12而只能匹配1

In HTML Template Binding

	{{ filter_expression | filter : expression : comparator}}

In JavaScript

	$filter('filter')(array, expression, comparator)

`comparator`为`true`的时候只有完成匹配才是匹配结构

true: A shorthand for function(actual, expected) { return angular.equals(expected, actual)}. this is essentially strict comparison of expected and actual.

举个栗子：

	lists | filter:search:true

