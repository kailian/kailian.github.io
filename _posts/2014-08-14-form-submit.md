---
layout: post
category : 工具
title: 'bookmarklet自动填充表单'
tagline: ""
tags : [工具]
---

> 看了[用chrome浏览器实现手动“自动填充表单”](http://blog.sae.sina.com.cn/archives/5198)这篇文章，突然觉得用bookmarklet，不是更加快捷

顺便贴下bookmarklet

	javascript:document.getElementById("name").value = "localpc";document.getElementById("host").value = "127.0.0.1";document.getElementById("port").value = "22";document.getElementById("username").value = "root";document.getElementById("password").value = "root";

	javascript:$('[name=name]').val('localpc');$('[name=email]').val('localpc@admin.com');$('[name=username]').val('root');$('[name=password]').val('root');

