---
layout: post
category : web
title: 'angular directive 03'
tagline: ""
tags : [web, angular]
--- 

* auto-gen TOC:
{:toc}

### web组件化

目的：使用angular的directive构建web组件

<!--break-->

### index.html

	<!DOCTYPE html>
	<html lang="zh-CN" xmlns:ng="http://angularjs.org">
	<head>
	  <meta charset="utf-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	  <meta authour="linkailian">
	  <title></title>
	  <link href="css/bootstrap.min.css" rel="stylesheet">
	  <link href="css/style.css" rel="stylesheet">
	</head>
	<body>
	  <div class="container" ng-app="app">
	    <div ng-controller="appController">
	      <div mc-input-text input-model="model"></div>
	      <label ng-bind="model"></label>
	    </div>
	  </div>    
	  <script src="js/jquery.js"></script>
	  <script src="js/bootstrap.min.js"></script>
	  <script type="text/javascript" src="js/angular/angular.min.js"></script>
	  <script type="text/javascript" src="mc.directive.js"></script>
	  <script type="text/javascript" src="controller.js"></script>
	</body>
	</html>

### controller.js

	var appModule = angular.module('app', [
	  'mc.widget'
	]);

	appModule.controller('appController', function( $scope ){
	  $scope.model="appController";
	});

### mc.directive.js

	angular.module("mc.widget", [
	  "mc.widget.tpls",
	  "mc.widget.mcInputText"
	]);

	angular.module("mc.widget.tpls", [
	  "template/mcInputText.html",
	]);

	angular.module('mc.widget.mcInputText', [])

	.directive("mcInputText", function() {
	  return {
	    restrict: "EA",
	    scope: {
	      inputModel: "=",
	    },
	    templateUrl: 'template/mcInputText.html',
	    link: function (scope) {
	      scope.inputModel="model";
	    }
	  };
	});

	angular.module("template/mcInputText.html", []).run(["$templateCache", function($templateCache) {
	  $templateCache.put("template/mcInputText.html",
	    '<input type="text" class="form-control" ng-model="inputModel" required/>'
	  );
	}]);