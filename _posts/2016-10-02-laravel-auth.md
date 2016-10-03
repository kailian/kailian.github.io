---
layout: post
category : web
title: 'laravel自定义权限控制'
tagline: ""
tags : [web,php,laravel]
---

## 权限配置

1. 以controller-method的方式给用户配置权限；

2. 用户登录，将用户权限赋值到session中；

3. 增加权限中间件判断用户是否有controller-method的操作权限

## 配置中间件

```
php artisan make:middleware AdminAuth
```

```
<?php

namespace App\Http\Middleware;
use Closure;

class BeforeMiddleware
{
    public function handle($request, Closure $next)
    {
        //1.是否登录
        if(!Auth::login()) {
            return returnError('未登录', 400);
        }

        //2.按路由获取到controller和method
        $actions = $request->route()->getAction();
        $actionName = isset($actions['controller']) ? $actions['controller'] : '';
        $actionArr = explode('@', $actionName);
        $controllerArr = explode('\\', $actionArr[0]);
        $controller = array_pop($controllerArr);
        $controller = strtolower(str_replace('Controller', '', $controller));
        $method = $actionArr[1];

        //3.判断对应的controller和method是否有权限
        if( $this->checkAuth($controller, $method) ) {
            return $next($request);
        } else {
            return returnError('未授权', 401);
        }
    }
}
```

## 注册中间件

```
app/Http/Kernel.php

protected $routeMiddleware = [
	...
    'admin.auth' => \App\Http\Middleware\AdminAuthMiddleware::class,
];
```

## 添加需要验证权限的路由到路由分支

```
Route::group(['middleware' => ['admin.auth']], function () {
    Route::get('/', 'IndexController@index');
    Route::resource('user', 'UserController');
});
```