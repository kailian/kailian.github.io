---
layout: post
category : web
title: '【web】node配置域名'
tagline: ""
tags : [node, web]
---

### 使用nginx配置域名访问node服务端口，以8000端口为例

使用nginx进行反向代理

	server
    {
        listen 80;
        server_name node8000.kl.com;
        index index.html index.htm index.php default.html default.htm default.php;

        expires off;

        charset utf-8;
	    location / {
	    proxy_set_header X-Real-IP $remote_addr;
	    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	    proxy_set_header Host $http_host;
	    proxy_set_header X-NginX-Proxy true;
	    proxy_pass http://127.0.0.1:8000;
	    proxy_redirect off;
	    }
    }

<!--break-->

### node服务代码示例

	var http=require('http');
	http.createServer(function (req, res){
	    res.writeHead(200,{'Content-Type': 'text/plain'});
	        res.end('Hello World\n');
	    }).listen(8000,'127.0.0.1');
	console.log('Server runing at http://127.0.0.1:8000/');
