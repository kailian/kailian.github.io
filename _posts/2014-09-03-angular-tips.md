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

    app.filter('offset', function() { 
	  return function(input, start) {
	    if( angular.isObject(input) ) {
	      return input.slice(start)
	    } else {
	      return false;
	    }
	  };
	});

### 使用第三方module或者引入ng的其他module

记得在模块依赖加入依赖，尤其是在控制台没报错而代码确认没问题的时候。

	var app = angular.module('app', [
	  'ngCookies',
	  'ngSanitize',
	])

### angular的前端排序问题

ng-repeat当key-value的key不是顺序索引时，会导致排序失效

php数据先用array_merge()重新索引或前端重新索引

同理：使用ng-class也会出现类似问题

### angular排序、过滤操作无效

检查数据是否为array，如果为其他如obj则会直接返回原来的数据，操作无效

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

### 前端时间过滤

可用于大小比较的数据过滤

	logControllers.filter('filterByRange',function() {
	  return function(input, start_time, end_time) {
	    if( angular.isUndefined(input) ) {
	      return input;
	    }
	    var retInputs = [];
	    var lowRange = angular.isDefined( start_time ) ? getTime( start_time ) : 0;
	    var highRange = angular.isDefined( end_time ) ? getTime( end_time ) : 2288323623006;
	    for(var i = 0, len = input.length; i < len; ++i) {
	      var singleInput = input[i];
	      smtime = getTime( singleInput.mtime );
	      if(smtime >= lowRange && smtime <= highRange) {
	        retInputs.push(singleInput);
	      }
	    }
	    return retInputs;
	  }
	})

	function getTime( dateTime ) {
	  var date = new Date(dateTime);
	  var time = date.getTime();
	  return time;
	}

### 使用数组处理函数报错

You are running into dirty checking when the value is not defined yet. Simply check to make sure the value is not undefined before you run your function.

	App.controller('validationController', ['$scope',function ($scope) {
	    $scope.isInvalidDate = function () {
	      if($scope.checkindate === undefined || $scope.checkoutdate === undefined) {
	        return false;
	      }
	      var checkin = $scope.checkindate.split('-');
	      var checkout = $scope.checkoutdate.split('-');

	      if ($scope.checkin[0] > $scope.checkout[0] || $scope.checkin[1] > $scope.checkout[1]) {
	        return true;
	      }
	    }
	}]);

注意，angular很多数据处理前为undefined，需要先判断

