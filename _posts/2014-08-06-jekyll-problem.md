---
layout: post
category : jekyll
title: '搭建博客遇到的问题'
tagline: ""
tags : [问题, 博客, jekyll]
---

<div class="alert alert-danger alert-margin" role="alert">
	更具体的问题可以参考
	<a href="http://jekyllrb.com/">官方文档</a>
</div>

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

	\{\{ post.content | split:'<!--break-->' | first }}

## 关于搜索

需要加入的文件

	jquery.js
	jquery-ui.js
	jquery-ui.css

在根目录下新建一个search.xml

	\---
	layout: none
	\---
	<\?xml version="1.0" encoding="UTF-8" \?>
	<articles>
	    {\% for post in site.posts %\}
	    <article>
	        <title>{\{ post.title }\}</title>
	        <url>{\{ site.url }\}{\{ post.url }\}</url>
	        <date>{\{ post.date | date_to_utc | date: '%Y-%m-%d'}\}</date>
	    </article>
	    {\% endfor %\}
	</articles>

注意去掉\

导航加上搜索框

	<div class="navbar-form navbar-right">       
		<input class="form-control" type="text"  id="blog-search" size="30" placeholder="Search" required />
	</div>

新建search.js

	$(function() {
	  $.ajax({
	    url: "/search.xml",
	    dataType: "xml",
	    success: function( xmlResponse ) {
	     var data = $( "article", xmlResponse ).map(function() {
	        return {
	          value: $( "title", this ).text() + ", " +
	              ( $.trim( $( "date", this ).text() ) ),
	          url: $("url", this).text()
	        };
	      }).get();

	      $( "#blog-search" ).autocomplete({
	        source: data,
	        minLength: 0,
	        select: function( event, ui ) {
	          window.location.href = ui.item.url;
	        }
	      });
	    }
	  });
	});

搜索实现完毕

## 关于分页

[相关代码](http://jekyllrb.com/docs/pagination/)

## 代码高亮有两种

> 使用google-code-prettify

https://code.google.com/p/google-code-prettify/downloads/list

[下载](https://code.google.com/p/google-code-prettify/downloads/list) `google-code-prettify`

博客中使用的样式是 `desert.css`

```html
<link href="{{ ASSET_PATH }}/google-code-prettify/desert.css" rel="stylesheet">
<script src="{{ ASSET_PATH }}/google-code-prettify/prettify.js"></script>
```

```javascript
$('pre').addClass('prettyprint linenums').attr('style', 'overflow:auto');
window.prettyPrint && prettyPrint();
```

修改为全部显示行号

```css
li.L0, li.L1, li.L2, li.L3,li.L5, li.L6, li.L7, li.L8{ list-style-type: decimal !important }
```

> 使用Pygment 

[参考](http://pygments.org/docs/cmdline/)










