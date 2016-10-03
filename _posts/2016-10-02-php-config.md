---
layout: post
category : web
title: 'php常用配置'
tagline: ""
tags : [web,php]
---

> php常用配置，php版本5.6以上

## php查看配置

```
php -v //版本
php -i //phpinfo
php -m //模块
```

```
<?php
    phpinfo();
?>
```

<!--break-->

## php.ini

### PHP的基本安全设置

```
# 关闭注册全局变量
register_globals = Off

# 关闭PHP版本信息在http头中的泄漏
expose_php = Off

# 禁用特定的函数。
disable_functions = phpinfo,system,exec,shell_exec,passthru,popen,dl,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source

# 不在页面上显示错误信息，记录错误日志到文件
display_errors = Off
error_reporting = E_WARNING & E_ERROR
log_errors = On
error_log = /var/logs/php_error.log

# 是否允许打开远程文件
allow_url_fopen = Off

# 打开magic_quotes_gpc来防止SQL注入
magic_quotes_gpc = on 
```

### 设置上传文件大小

```
file_uploads = on
upload_max_filesize = 8M
post_max_size = 8M
```

### 设置时区 

```
date.timezone = UTC
```

### [opcache](http://php.net/manual/zh/opcache.installation.php)

```
zend_extension=opcache.so
; 开关打开
opcache.enable=1

; 开启CLI
opcache.enable_cli=1

; 可用内存, 酌情而定, 单位为：Mb
opcache.memory_consumption=128

; Zend Optimizer + 暂存池中字符串的占内存总量.(单位:MB)
opcache.interned_strings_buffer=8

; 对多缓存文件限制, 命中率不到 100% 的话, 可以试着提高这个值
opcache.max_accelerated_files=4000

; Opcache 会在一定时间内去检查文件的修改时间, 这里设置检查的时间周期, 默认为 2, 定位为秒
opcache.revalidate_freq=60

; 打开快速关闭, 打开这个在PHP Request Shutdown的时候回收内存的速度会提高
opcache.fast_shutdown=1
```

## php-fpm配置

### 进程配置

``` 
# 进程的发起用户和用户组，用户user是必须设置，group不是
user = www
group = www
# 监听ip和端口
listen = 127.0.0.1:9000
```

### 子进程

static：表示在 `php-fpm` 运行时直接 `fork` 出 `pm.max_chindren` 个子进程，只有`pm.max_chindren`有效；

dynamic：表示，运行时 `fork` 出 `start_servers` 个进程，随着负载的情况动态调整，最多不超过 `max_children` 个进程。

pm.max_children：静态方式下开启的php-fpm进程数量；

pm.start_servers：动态方式下的起始php-fpm进程数量；

pm.min_spare_servers：动态方式下的最小php-fpm进程数量；

pm.max_spare_servers：动态方式下的最大php-fpm进程数量。

```
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
```

### php慢日志

```
; - 'slowlog'
; The log file for slow requests
; Note: slowlog is mandatory if request_slowlog_timeout is set
slowlog = log/$pool.log.slow
; dumped to the 'slowlog' file. A value of '0s' means 'off'.
request_slowlog_timeout = 1
```