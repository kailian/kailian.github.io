---
layout: post
category : web
title: 'laravel5.3自定义报错页面'
tagline: ""
tags : [web,php,laravel]
---

## 自定义错误页面

开发环境，当 `APP_DEBUG = true` 时，使用默认错误页面；

生产环境，当 `APP_DEBUG = false` 时，使用自定义错误页面，异步请求返回json异常信息

<!--break-->

修改`app/Exceptions/Handler.php`

```
use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;
 
class Handler extends ExceptionHandler
{
    public function render($request, Exception $exception)
    {
        $debug = config('app.debug', false);
        if($debug) {
            return parent::render($request, $exception);
        }
        if ($exception instanceof HttpException) {
            $code = $exception->getStatusCode();
            $message  = $exception->getMessage();
            if ($request->expectsJson()) {
                return response()->json(['error' => $message], $code);
            }
            if (view()->exists('errors.custom' . $code)) {
                return response()->view('errors.custom' . $code, ['message'=>$message], $code);
            }
        }
        return parent::render($request, $exception);
    }
}
```

新建自定义错误页面

```
resources/views/errors/custom404.blade.php
```

修改默认的404页面

```
resources/views/errors/404.blade.php
```