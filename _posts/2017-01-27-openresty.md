---
layout: post
category : web
title: 'OpenResty'
tagline: ""
tags : [web]
---

## OpenResty

> OpenResty - Turning Nginx into a Full-Fledged Scriptable Web Platform. OpenResty is a full-fledged web application server by bundling the standard nginx core, lots of 3rd-party nginx modules, as well as most of their external dependencies.

<!--break-->

## install

mac 安装

```
brew install homebrew/nginx/openresty
```

## command

```
openresty
openresty -v
openresty -h
openresty -t
openresty -s reload
```

## nginx conf

### content_by_lua

```
server {
    listen 8082;
    location / {
        set $test "hello, world";
        content_by_lua '
            ngx.header.content_type = "text/plain";
            ngx.say(ngx.var.test);
        ';
    }
}
```

### content_by_lua_file

```
server {
    listen 8082;
    #lua_code_cache off;
    location / {
        default_type text/html;
        content_by_lua_file /data/openresty-lua/hello_world.lua;
    }
}
```

hello_world.lua

```
ngx.say("<p>hello, world</p>")
```

调试lua脚本，修改lua脚本之后，不需要 reload nginx

```
lua_code_cache off;
```

## lua-nginx-module

指令是nginx访问lua的入口，API是lua调用nginx的函数

[directives](https://www.nginx.com/resources/wiki/modules/lua/#directives)

[nginx-api-for-lua](https://www.nginx.com/resources/wiki/modules/lua/#nginx-api-for-lua)

## openresty 执行阶段

![openresty_run.png](/images/201701/openresty_run.png)

```
location /mixed {
    set_by_lua $a 'ngx.log(ngx.ERR, "set_by_lua")';
    rewrite_by_lua 'ngx.log(ngx.ERR, "rewrite_by_lua")';
    access_by_lua 'ngx.log(ngx.ERR, "access_by_lua")';
    header_filter_by_lua 'ngx.log(ngx.ERR, "header_filter_by_lua")';
    body_filter_by_lua 'ngx.log(ngx.ERR, "body_filter_by_lua")';
    log_by_lua 'ngx.log(ngx.ERR, "log_by_lua")';
    content_by_lua 'ngx.log(ngx.ERR, "content_by_lua")';
}
```

7个阶段的执行顺序如下：

set_by_lua: 流程分支判断，判断变量初始

rewrite_by_lua: 用lua脚本实现nginx rewrite，转发、重定向、缓存等功能

access_by_lua: ip准入、接口权限等情况集中处理，是否能合法性访问，防火墙

content_by_lua: 内容生成

header_filter_by_lua：应答HTTP过滤处理(例如添加头部信息、过滤http头信息)

body_filter_by_lua: 应答BODY过滤处理(例如完成应答内容统一成大写)

log_by_lua: 本地/远程记录日志

## 资料

- [OpenResty中文](http://openresty.org/cn/)

- [openresty](https://github.com/openresty/openresty)

- [Programming OpenResty](https://openresty.gitbooks.io/programming-openresty/content/)

- [OpenResty(nginx+lua) 入门](http://www.cnblogs.com/digdeep/p/4859575.html)

- [lua文档](http://www.lua.org/manual/5.3/manual.html)

- [OpenResty最佳实践](http://www.kancloud.cn/allanyu/openresty-best-practices/82569)