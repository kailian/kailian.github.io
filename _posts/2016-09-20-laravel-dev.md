---
layout: post
category : web
title: 'laravel'
tagline: ""
tags : [web,php,laravel]
---

## laravel常用操作

```
php artisan make:migration create_infos_table --create=infos
php artisan make:model Models/Infos
php artisan migrate
```

## 开发相关工具

1. [PhpStorm-IDE-工具](https://confluence.jetbrains.com/display/PhpStorm/Laravel+Development+using+PhpStorm)

2. [记录执行的sql](http://laravel.so/tricks/2c090cce97ad374e3e1bad784a128695)

3. [laravel-debugbar](https://github.com/barryvdh/laravel-debugbar)

4. [laravel-ide-helper](http://laravel.so/tricks/ec6ad6d56c56deb494098781438c5192)

## laravel性能优化配置

（1）APP_DEBUG设置为false

（2）优化 Laravel 内置方法

```
php artisan optimize
php artisan route:cache  
php artisan config:cache
``` 

（3）composer 优化自动加载

```
composer dump-autoload --optimize
```

（4）sesssion和cache使用memcached

```
修改.env
CACHE_DRIVER=memcached
SESSION_DRIVER=memcached
```

（5）php开启OpCache