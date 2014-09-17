---
layout: post
category : web
title: '初步理解angular directives'
tagline: ""
tags : [web, angular]
---

* auto-gen TOC:
{:toc}

[自定义指令](http://www.ngnice.com/docs/guide/directive)

## Injecting（注入）, Compiling（编译）, and Linking functions

当你创建指令，本质上你要定义三个函数层

<!--break-->

	myApp.directive('uiJq', function InjectingFunction(){

	  // === InjectingFunction === //
	  // Logic is executed 0 or 1 times per app (depending on if directive is used).
	  // Useful for bootstrap and global configuration
	  （bootstrap是引导不是前端的框架）
	  return {
	    compile: function CompilingFunction($templateElement, $templateAttributes) {
	      //两个参数，元素element、属性	attr
	      // === CompilingFunction === //
	      // Logic is executed once (1) for every instance of ui-jq in your original UNRENDERED template.
	      // Scope is UNAVAILABLE as the templates are only being cached.
	      // You CAN examine the DOM and cache information about what variables
	      //   or expressions will be used, but you cannot yet figure out their values.
	      // Angular is caching the templates, now is a good time to inject new angular templates 
	      //   as children or future siblings to automatically run..

	      return function LinkingFunction($scope, $linkElement, $linkAttributes) {
	      	//注意参数的顺序不会改变，即使改成($element,$scope,$attr)
	      	//结果依旧$element => $scope...
	        // === LinkingFunction === //
	        // Logic is executed once (1) for every RENDERED instance.
	        // Once for each row in an ng-repeat when the row is created.
	        // Note that ng-if or ng-switch may also affect if this is executed.
	        // Scope IS available because controller logic has finished executing.
	        // All variables and expression values can finally be determined.
	        // Angular is rendering cached templates. It's too late to add templates for angular
	        //  to automatically run. If you MUST inject new templates, you must $compile them manually.

	      };
	    }
	  };
	})

## Pre vs Post Linking Functions

PostLinkingFunction()是默认的
	
	link: function LinkingFunction($scope, $element, $attributes) { ... }
	...
	link: {
	  pre: function PreLinkingFunction($scope, $element, $attributes) { ... },
	  post: function PostLinkingFunction($scope, $element, $attributes) { ... },
	}
	
PreLinkingFunction() 会先作用于父级，然后子级，PostLinkingFunction() 则相反，先作用于子级，再作用于父级。

看还行，翻译就不坑人了。其他的可以看原文：https://github.com/angular/angular.js/wiki/Understanding-Directives#footnotes

## egghead-angularjs例子

还是看例子直观些，感谢egghead-angularjs。

### 自定义参数的directive和使用模板的directive

	angular.module('app.directives', []).
	  directive('appFoo', ['foo', function(foo) {
	    return function(scope, elm, attrs) {
	      elm.text(foo);
	    };
	  }]).
	  directive('topnav', function() {
	    return {
	      restrict: "E",
	      templateUrl: "partials/topnav.html"
	    }
	  });

再次提醒`scope, elm, attrs`参数是固定的

没有使用依赖注入，顺序固定，随便命名都可以

### 给元素绑定事件

	<div enter leave>I'm content</div>

	app.directive("enter", function () {
	  return function (scope, element) {
	    element.bind("mouseenter", function () {
	      console.log("I'm inside of you!");
	    });
	  };
	});

	app.directive("leave", function () {
	  return function (scope, element) {
	    element.bind("mouseleave", function () {
	      console.log("I'm leaving on a jetplane!");
	    });
	  };
	});

### 获取属性的值

	<div enter="panel" leave>I'm content</div>
	app.directive("enter", function () {
	  return function (scope, element, attrs) {
	    element.bind("mouseenter", function () {
	      element.addClass(attrs.enter);
	    });
	  };
	});

	app.directive("leave", function () {
	  return function (scope, element, attrs) {
	    element.bind("mouseleave", function () {
	      element.removeClass(attrs.enter);
	    });
	  };
	});

### 执行属性上的函数

	<div enter="deleteTweets()">Roll over to load more tweets</div>
	
	app.directive("enter", function () {
	  return function (scope, element, attrs) {
	    element.bind("mouseenter", function () {
	      scope.$apply(attrs.enter);
	    });
	  };
	});

	<div ng-app="superApp">
      <superhero flight speed strength>Superman</superhero>
      <superhero speed>The Flash</superhero>
      <superhero strength>The Hulk</superhero>
    </div>

### dirctive里的controller

    var app = angular.module('superApp', []);
	app.directive("superhero", function () {
	  return {
	    restrict: "E",
	    scope: {},

	    controller: function ($scope) {
	      $scope.abilities = [];

	      this.addStrength = function () {
	        $scope.abilities.push("strength");
	      };

	      this.addSpeed = function () {
	        $scope.abilities.push("speed");
	      };

	      this.addFlight = function () {
	        $scope.abilities.push("flight");
	      };
	    },
	    
	    link: function (scope, element) {
	      element.addClass("button");
	      element.bind("mouseenter", function () {
	        console.log(scope.abilities);
	      });
	    }
	  };
	});

	app.directive("strength", function () {
	  return {
	    require: "superhero",
	    link: function (scope, element, attrs, superheroCtrl) {
	      superheroCtrl.addStrength();
	    }
	  };
	});

	app.directive("speed", function () {
	  return {
	    require: "superhero",
	    link: function (scope, element, attrs, superheroCtrl) {
	      superheroCtrl.addSpeed();
	    }
	  };
	});

	app.directive("flight", function () {
	  return {
	    require: "superhero",
	    link: function (scope, element, attrs, superheroCtrl) {
	      superheroCtrl.addFlight();
	    }
	  };
	});

	<div ng-app="choreApp">
      <div ng-controller="ChoreCtrl">
        <kid done="logChore(chore)"></kid>
      </div>
    </div>

### directive模板调用controller方法

    var app = angular.module('choreApp', []);
	app.controller("ChoreCtrl", function($scope) {
	  $scope.logChore = function (chore) {
	    alert(chore + " is done");
	  };
	});

	app.directive("kid", function() {
	  return {
	    restrict: "E",
	    scope: {
	      done:"&"
	    },
	    template: '<input type="text" ng-model="chore"> {{ chore }}' +
	              '<div class="button" ng-click="done({chore:chore})">I\'m done</div>'
	  };
	});

### restrict的含义	

- E 表示该指令是一个`e`lement;

- A 表示该指令是`a`ttribute; 

- C 表示该指令是`c`lass; 

- M 表示该指令是注释co`m`ments


可以组合，如`AE`既匹配属性名又匹配元素名

scope的含义


1. `scope:false`默认的情况下，指令不会创建任务的作用域，不存在原型继承，不过要注意的是，当在指令里创建一个属性的话，有可能跟父级的同名从而破坏它。

2. `scope:true`的时候，指令会创建一个新的子作用域,并且原型继承于父作用域

3. `scope:{...}`的时候，指令会创建一个独立的子作用域，它不会原型继承父作用域，通常这是构建可重用组件的最佳选择。因为它不会意外的去读写父作用域的属性。


不过有些时候，这些独立的作用域也需要访问父作用域的信息，这时候可以在scope的对象属性添加下面三个标识:


- `=`，这个会`双向绑定`子作用域与父作用域的属性

- `@`，这个`只会读取`父作用域里的属性

- `&`，这个会绑定父作用域里的`表达式`

transclude: true的时候,指令将会创建一个名为transcluded的作用域,并且原型继承于父作用域

### 只读父级作用域的属性 scope @	

	<div ng-controller="AppCtrl">
        <input type="text" ng-model="ctrlFlavor">
        <div drink flavor="{{ctrlFlavor}}"></div>
    </div>

    app.controller("AppCtrl", function ($scope) {
	  $scope.ctrlFlavor = "blackberry";
	});

	app.directive("drink", function () {
	  return {
	    scope: {
	      flavor:"@"
	    },
	    template: '<div>{{ flavor }}</div>'
	  };
	});

### 综合示例

	<div ng-controller="AppCtrl">
        <phone number="114-1234" network="network" make-call="leaveVoicemail(number,message)"></phone>
        <phone number="555-3486" network="network" make-call="leaveVoicemail(number,message)"></phone>
        <phone number="876-5234" network="network" make-call="leaveVoicemail(number,message)"></phone>
    </div>

	var app = angular.module("phoneApp", []);

	app.controller("AppCtrl", function ($scope) {
	  $scope.leaveVoicemail = function (number,message) {
	    alert("Number:" + number + " said: " + message);
	  };
	});

	app.directive("phone", function() {
	  return {
	    restrict: "E",
	    scope:{
	      number:"@",
	      network:"=",
	      makeCall:"&"
	    },
	    template: '<div class="panel">Number: {{number}} Network:<select ng-model="network" ng-options="net for net in networks">'+
	              '<input type="text" ng-model="value">' +
	              '<div class="button" ng-click="makeCall({number: number, message:value})">Call home!</div>',
	    link: function (scope) {
	      scope.networks = ["Verizon","AT&T", "Sprint"];
	      scope.network = scope.networks[0];
	    }
	  };
	});

### transclusion 默认为true

[彻底弄懂AngularJS中的transclusion](http://www.html-js.com/article/1869)

反正就是

transclusion: true

transclusion: 'element' 会加上外边的自定义标签

> $templateCache，这个angularstrap和angular-ui都有例子

	<input type="text" ng-model="model.title">
    <input type="text" ng-model="model.content">

    <zippy title="{{model.title}}">
        This is the {{model.content}}
    </zippy>

    app.run(function ($templateCache) {
	  $templateCache.put("zippy.html", '<div><h3 ng-click="toggleContent()">{{title}}</h3><div ng-show="isContentVisible" ng-transclude>Hello world</div></div>');
	  $templateCache.info();
	});

	app.directive("zippy", function($templateCache) {
	  console.log($templateCache.get("zippy.html"));

	  return {
	    restrict: "E",
	    transclude:true,
	    scope:{
	      title:"@"
	    },
	    template: $templateCache.get("zippy.html"),
	    link: function (scope) {
	      scope.isCOntentVisivle = false;
	      scope.toggleContent = function () {
	        scope.isContentVisible = !scope.isContentVisible;
	      };
	    }
	  };
	});




