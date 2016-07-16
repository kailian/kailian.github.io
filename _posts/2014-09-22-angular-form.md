---
layout: post
category : web
title: 'angular表单验证'
tagline: ""
tags : [web, angular]
---	

客户端的验证能让用户知道输入是否合法，提高用户体验。同时服务端的验证是必须的。

浏览器form自带表单验证，使用`novalidate`屏蔽浏览器本身的验证功能。

	<form novalidate>

浏览器form不可以嵌套，angular form可以嵌套。可以在使用ng-repeat标签的时候嵌套使用。

<!--break-->

## CSS classes

4种CSS样式，**根据校验状态会在表单元素上加上对应的class**，根据需要自定义CSS。

- ng-valid is set if the form is valid.校验合法状态

- ng-invalid is set if the form is invalid. 校验非法状态

- ng-pristine is set if the form is pristine.（从未输入过）

- ng-dirty is set if the form is dirty.表单处于脏数据状态（输入过）

示例，验证通过显示绿色，不通过显示红色。输入时才有交互效果。

	input.ng-valid.ng-dirty {
	  border-color: #3c763d;
	}

	input.ng-invalid.ng-dirty {
	  border-color: #a94442;	
	}


## 验证类型

> Angular对input元素的type进行了扩展，一共提供了以下10种类型

`text`、`number`、`url`、`email`、`radio`、`checkbox`、`hidden`、`button`、`submit`、`reset`

## 验证项

- Required 必填项（为了验证某个表单项是否为空）

- Minimum length 最小长度

- Maximum length 最大长度

- Matches a pattern 正则匹配

- Email地址

- Number 数字

- Url地址

- 自定义验证

## 元素绑定

必须保证form元素拥有关联的`name`属性。视图能通过绑定的基本功能获取表单或者表单控件的状态。

属性是通过如下格式获取的：

	formName.inputFieldName.property

	//修改过的表单
	formName.inputFieldName.$dirty
	//合法表单
	formName.inputFieldName.$valid
	//非法表单
	formName.inputFieldName.$invalid
	//Errors 错误
	formName.inputFieldName.$error

	basic_form.user_email.$dirty && basic_form.user_email.$invalid

代码示例：
	
	<form id="basic_form" name="basic_form" novalidate>
	  <input 
	    type="email" 
	    name="user_email" 
	    ng-model="user.email" 
	    required 
	    placeholder="邮箱" />
	  <input 
	    type="password" 
	    name="user_password" 
	    ng-model="user.password" 
	    required
	    ng-maxlength="20" 
	    ng-minlength="6" 
	    placeholder="6-20个字符" />
	  <input 
	    type="text" 
	    required
	    ng-pattern="/^[A-Za-z]{1}[0-9A-Za-z_]{2,29}$/" 
	    name="user_name"
	    ng-model="user.name"
	    placeholder="由字母、数字、下划线组成，以字母开头，3-30个字符" />
	</form>

	<ul>
	  <li ng-if="basic_form.user_email.$dirty">
	    <span ng-if="basic_form.user_email.$error.required">
	      邮箱地址不能为空！
	    </span>
	    <span basic_form.user_email.$error.email">
	      邮箱地址格式不正确！
	    </span>
	  </li>
	  <li ng-if="basic_form.user_password.$dirty && basic_form.user_password.$error.required">密码不能为空！</li>
	  <li ng-if="basic_form.user_password.$dirty && basic_form.user_password.$error.maxlength">密码长度不能大于20个字符！</li>
	  <li ng-if="basic_form.user_password.$dirty && basic_form.user_password.$error.minlength">密码长度不能小于6个字符！</li>
	  <li ng-if="basic_form.user_name.$dirty && basic_form.user_name.$error.required">用户名不能为空！</li>
	  <li ng-if="basic_form.user_name.$dirty && basic_form.user_name.$error.pattern">用户名格式不正确！</li>
	</ul>

[自定义验证参考](http://www.angularjs.cn/A00t)

## 1.3版本

[Taming Forms in AngularJS 1.3](http://www.yearofmoo.com/2014/09/taming-forms-in-angularjs-1-3.html)

- 提供了创建自定义验证器的新方法, 去除了对使用转换和格式化装置的需求

- 所有的 HTML5 验证属性都被绑定到`ngModel`，它们的错误消息都注册到了`ngModel.$error`

- 用于错误消息重用的`ngMessages`模块

### HTML5 Validators & Parse Errors

HTML5 Attribute       | ng Attribut              |  Registered Error
----------------------|--------------------------|------------------------
required="bool"       | ng-required="..."        |  ngModel.$error.required
minlength="number"    | ng-minlength="number"    |  ngModel.$error.minlength
maxlength="number"    | ng-maxlength="number"    |  ngModel.$error.maxlength
min="number"          | ng-min="number"          |  ngModel.$error.min
max="number"          | ng-max="number"          |  ngModel.$error.max
pattern="patternValue"| ng-pattern="patternValue"|  ngModel.$error.pattern

input types

input type="..."       |    Registered Error
-----------------------|------------------------
type="email"           |    ngModel.$error.email
type="url"             |    ngModel.$error.url
type="number"          |    ngModel.$error.number
type="date"            |    ngModel.$error.date
type="time"            |    ngModel.$error.time
type="datetime-local"  |    ngModel.$error.datetimelocal
type="week"            |    ngModel.$error.week
type="month"           |    ngModel.$error.month

### 自定义验证

	ngModule.directive('validatePasswordCharacters', function() {

	  var REQUIRED_PATTERNS = [
	    /\d+/,    //numeric values
	    /[a-z]+/, //lowercase values
	    /[A-Z]+/, //uppercase values
	    /\W+/,    //special characters
	    /^\S+$/   //no whitespace allowed
	  ];

	  return {
	    require : 'ngModel',
	    link : function($scope, element, attrs, ngModel) {
	      ngModel.$validators.passwordCharacters = function(value) {
	        var status = true;
	        angular.forEach(REQUIRED_PATTERNS, function(pattern) {
	          status = status && pattern.test(value);
	        });
	        return status;
	      }; 
	    }
	  }
	});

	<form name="myForm">
	  <div class="label">
	    <input name="myPassword" type="password" ng-model="data.password" validate-password-characters required />
	    <div ng-if="myForm.myPassword.$error.required">
	      You did not enter a password
	    </div>
	    <div ng-if="myForm.myPassword.$error.passwordCharacters">
	      Your password must contain a numeric, uppercase and lowercase as well as special characters
	    </div>
	  </div>
	</form>

### 异步验证

$asyncValidators

	ngModule.directive('usernameAvailableValidator', ['$http', function($http) {
	  return {
	    require : 'ngModel',
	    link : function($scope, element, attrs, ngModel) {
	      ngModel.$asyncValidators.usernameAvailable = function(username) {
	        return $http.get('/api/username-exists?u='+ username);
	      };
	    }
	  }
	}])

	<input type="text"
       class="input"
       name="username"
       minlength="4"
       maxlength="15"
       ng-model="form.data.username"
       pattern="^[-\w]+$"
       username-available-validator
       placeholder="Choose a username for yourself"
       required />	

### 嵌套Forms和Repeatable Forms

	<div class="field" ng-if="data.allowNotifications" ng-form="notificationEmails">
	  <div ng-form="emailForm" ng-repeat="email in notifcationEmails"> 
	    <label>Email :</label>
	    <input type="email" ng-model="email" name="notificationEmail" />
	    <div ng-if="emailForm.notificationEmail.$error.email">
	      You did not enter a valid email address
	    </div>
	  </div>
	  
	  <div ng-if="notificationEmails.$error.email" class="error">
	    One or more emails have been incorrectly entered.
	  </div>
	  <button ng-click="addAnotherEmail()">Add another email</button>
	</div>

### 显示错误信息

> 使用ngIf或者ngShow，新方式ngMessage

	<form name="myForm">
	  <input type="text" name="colorCode" ng-model="data.colorCode" minlength="6" required />
	  <div ng-messages="myForm.colorCode.$error" ng-if="myForm.$submitted || myForm.colorCode.$touched">
	    <div ng-message="required">...</div>
	    <div ng-message="minlength">...</div>
	    <div ng-message="pattern">...</div>
	  </div>
	  <nav class="actions">
	    <input type="submit" />
	  </nav>
	</form>