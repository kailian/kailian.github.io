---
layout: post
category : jekyll
title: '【jekyll】搭建博客遇到的问题'
tagline: ""
tags : [问题, 博客, jekyll]
---

## 关于中文目录

使用UTF-8编码时当category为中文时，在通过url进入文章时报错

	"\xAE\xBE" from GBK to UTF-8

修改_config.yml文件将

	permalink: /:categories/:year/:month/:day/:title

修改为

	permalink: /:year/:month/:day/:title

## 关于内容摘要

想要输出摘要的截至地方，打上标签

	<!--break-->

<!--break-->

然后使用（记得将\去掉）

	\{\{ post.content  | | split:'<!--break-->' | first }}




