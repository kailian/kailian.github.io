---
layout: post
category : web
title: 'js复制到黏贴板'
tagline: ""
tags : [web]
---	

## 官网

[zeroclipboard](https://github.com/zeroclipboard/zeroclipboard)

跨浏览器的库类 Zero Clipboard。

<!--break-->

## 代码示例

代码要放到服务端测试才有效

	<html>
		<body>
		  <button class="copy-button" class="clip_button" data-clipboard-text="Copy Me!">
		  	text
		  </button>
		  <button class="copy-button" data-clipboard-target="clipboard_textarea">textarea
		  </button>
		  <textarea id="clipboard_textarea">复制textarea</textarea>
		  <script type="text/javascript" src="ZeroClipboard.js"></script>
		  <script type="text/javascript" src="jquery.min.js"></script>   
		  <script type="text/javascript">
		    var client = new ZeroClipboard($(".copy-button"));
		     client.on( 'aftercopy', function(event) {
		        alert("复制");
		     } );
		  </script>
		</body>
	</html>
