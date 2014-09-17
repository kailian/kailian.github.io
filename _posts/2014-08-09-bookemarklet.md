---
layout: post
category : 工具
title: 'bookmarklet'
tagline: ""
tags : [工具]
---

* auto-gen TOC:

{:toc}

### bookmarklet简介

小书签（bookmarklet），又叫书签小程序，是一种小型的程序(Applet)，以网址(URL)的形式被存为浏览器中的书签，也可以是网页上的一个链接。

小书签的英文名，Bookmarklet是由Bookmark和Applet组合而来。一般是JavaScript应用程序。

浏览器使用隶属于URI标签来存储书签，例如http:， file:。

当浏览器检查到协议为JavaScript，就将后面的字符串作为JavaScript脚本来执行，并用执行结果产生一个新页面。

<!--break-->

	javascript:(function(){
	/* Statements returning a non-undefined type, e.g. assignments */
	})();

### 安装

小书签一般是通过创建一个新书签并将代码粘贴入URL栏而实现的。也可把链接形式的小书签直接拖拽到书签栏中。

### 编写特点

1. 必须以**"javascript:"**开头

2. 所有代码必须在**同一行**

### MARKDOWN的bookmarklet

用MARKDOWN CSS将html页面显示成html页面

[MARKDOWN CSS下载](https://github.com/mrcoles/markdown-css)

	javascript:$('link[rel=stylesheet]').add('style').remove();$('[style]').attr('style', '');$('head').append('<link rel="stylesheet" href="http://mrcoles.com/media/test/markdown-css/markdown.css" type="text/css" />');$('body').addClass('markdown').css({width: '600px', margin: '2em auto', 'word-wrap': 'break-word'});$('a img').css({'max-height': '1em', 'max-width': '1em'});