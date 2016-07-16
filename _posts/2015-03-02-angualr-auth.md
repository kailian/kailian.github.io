---
layout: post
category : web
title: 'angular权限控制'
tagline: ""
tags : [web, angular]
---

### 结合前后端的权限控制

1. 后端PHP，app，controller和action路由的接口形式

2. 前端angular，单页面应用ng-router页面路由形式

### 权限的配置方式（根据需求选择不同方式，可配置化，可自动化）

例如：配置

	app => array(
	  userController=> array(
	    name=>'用户管理'
	      actions=> array(
	        action=>'userAdd'
	        name=> '添加用户'
	      )
	    )	    
	  )
	)

<!--break-->

（1）登录独立系统或者统一验证的接口，最终得到权限数据。

（2）保存到session或数据库

	app => array(
	  userController=> array(
	    userAdd,
	    userUpdate,
	  )
	)

### 后端的验证方式，单入口统一验证

入口获取`controller`和`action`，然后判断`session`中是否存在对应的唯一值

	function checkAuth( $app, $controller, $action ) {
	  $acls = $_SESSION[$app];
	  return isset($acls[$controller][$action]);
	}

### 前端的验证方式

1.  声明式的权限控制（根据权限，判断页面元素是否显示，是否禁用）

2.  路由处理（判断是否有页面权限，没有跳转到404）

app.js

	//以module的形式加入
	var app = angular.module('app', ['mc.ng.auth']);
	var permissionList;

	//不用ng-app用bootstrap手动初始化，获取权限
	//auth.php对userController处理为user，并将session数据转换为json格式
	angular.element(document).ready(function() {
	  $.getJSON('/auth.php', function(data) {
	    if( data.result == 1 ) {
	      permissionList = data.aclList;
	      angular.bootstrap(document.getElementById("main"), ['app']);
	    } else {
	      //错误处理
	    }
	  }); 
	});

	//先设置权限
	app.run(function($http, permissions) {
	  permissions.setPermissions(permissionList);
	});
 
	//父层controller在路由变化时判断权限
	app.controller('mainAppCtrl', function($scope, $location, $http, permissions) {
	  $scope.$on('$routeChangeStart', function(scope, next, current) {
	    var routerPath = next.$$route.originalPath;
	    routerPath = routerPath.trim();
	    var routerArr = routerPath.split("/");
	    var pageParam = routerArr[1];
	    //获取路由的controller值
	    //如：/index.html#/user/userAdd，则获取到user
	    if(angular.isString(routerPath) && !permissions.hasPermission(pageParam)) {
	      $location.path('/unauthorized');
	    }
	  });
	});

router.js

	app.config(function ($routeProvider) {
	  $routeProvider
	    .when('/user/userAdd', {
	      templateUrl: 'user/userAdd.html',
	      controller: 'userAddCtrl'
	    })
	    .when('/unauthorized', {
	      templateUrl: 'views/unauthorized.html',
	    })
	    .when('/404', {
	      templateUrl: '404/404.html',
	    });
	});

mc.ng.auth.js
 
	angular.module('mc.ng.auth', [])
	.factory('permissions', function ($rootScope,$http) {
	  var permissionList;
	  return {
	    setPermissions: function(permissions) {
	      permissionList = permissions;
	      $rootScope.$broadcast('permissionsChanged');
	    },
	    /**
	     * 判断路由是否有访问权限
	     * @param  {string}  pageParam 路由
	     * @return {Boolean}
	     */
	    hasPermission: function (pageParam) {
	      var isPermission = false;        
	      angular.forEach(permissionList, function(permission, key) {
	        if(pageParam == key) {
	          isPermission = true;
	        }
	      });
	      return isPermission;
	    },

	    /**
	     * 判断页面action是否显示
	     *
	     * true 显示 false 不显示
	     */
	    actionDisplay: function( value ) {
	      var isActionPermission = false;
	      var verifyKey = "";
	      angular.forEach(permissionList, function(permission, controller) {
	        angular.forEach(permission, function(action, k) {
	          verifyKey = controller + action;
	          if(value == verifyKey) { 
	            isActionPermission = true;
	          }
	        });
	      });
	      return isActionPermission;
	    },
	  };
	})

	.directive('actionDisplay', function(permissions) {
	  return {
	    restrict: "EA",
	    link: function(scope, element, attrs) {
	      var value = attrs.actionDisplay.trim();
	      var notPermissionFlag = value[0] === '!';
	      if(notPermissionFlag) {
	        value = value.slice(1).trim();
	      }
	  
	      function toggleVisibilityByPermission() {
	        var hasPermission = permissions.actionDisplay(value);
	    
	        if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
	          element.show();
	        } else {
	          element.hide();
	        }
	      }
	      toggleVisibilityByPermission();
	      scope.$on('permissionsChanged', toggleVisibilityByPermission);
	    }
	  };
	});

页面调用
	
	<button action-display="useruserAdd">添加用户</button>

验证规则可根据具体的需求进行修改

### 参考

[Angular中在前后端分离模式下实现权限控制 ](http://my.oschina.net/blogshi/blog/300595)




