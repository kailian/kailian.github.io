---
layout: post
category : web
title: 'HTML DOM'
tagline: ""
tags : [web]
---

## 什么是DOM？

> The Document Object Model is a platform- and language-neutral interface that will allow programs and scripts to dynamically access and update the content, structure and style of documents.

文档对象模型 (DOM) 是针对HTML文档、XML等文档的一套API。DOM提供了对文档的结构化的表述，允许程序和脚本动态地访问和更新文档的内容、结构和样式，将web页面和脚本或程序语言连接起来。DOM 将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合。

一个web页面是一个文档。这个文档可以在浏览器窗口或作为HTML源码显示出来。但上述两个情况中都是同一份文档。DOM提供了对同一份文档的另一种表现，存储和操作的方式。

<!--break--> 

DOM的分类

- 核心 DOM - 针对任何结构化文档的标准模型

- XML DOM - 针对 XML 文档的标准模型

- HTML DOM - 针对 HTML 文档的标准模型

XML DOM 定义了所有 XML 元素的对象和属性，以及访问它们的方法。

HTML DOM 定义了所有 HTML 元素的对象和属性，以及访问它们的方法。是关于如何获取、修改、添加或删除 HTML 元素的标准。

W3C DOM 中指定下面代码中的getElementsByTagName方法必须要返回所有`<P>` 元素的列表

```
<html>
<head>
    <title></title>
</head>
<body>
<p>first</p>
<p>second</p>
<script type="text/javascript">
paragraphs = document.getElementsByTagName("P");
// paragraphs[0] is the first <p> element
// paragraphs[1] is the second <p> element, etc.
console.log(paragraphs);
</script>
</body>
</html>
```

![pic_htmltree.gif](/images/201702/pic_htmltree.gif)

JavaScript可以修改元素对象、元素属性、元素样式、添加/移除元素或属性、创建html事件

## 如何访问DOM?

使用 document 或 window 元素的API来操作文档本身或获取文档的子类（web页面中的各种元素）。所有操作和创建web页面的属性，方法和事件都会被组织成对象的形式（例如， document 对象表示文档本身， table 对象实现了特定的 HTMLTableElement DOM 接口来访问HTML 表格等）。

- document

- element，element 是指由 DOM API 中成员返回的类型为 element 的一个元素或节点。

- nodeList，nodeList 是一个元素的数组，如从 document.getElementsByTagName()方法返回的就是这种类型。

- attribute，当 attribute 通过成员函数 (例如，通过 createAttribute()方法) 返回时，它是一个为属性暴露出专门接口的对象引用。

- namedNodeMap，namedNodeMap 和数组类似，但是条目是由name或index访问的，namedNodeMap 有一个 item() 方法

## DOM 接口

查找HTML Elements

- document.getElementById(id)

- document.getElementsByTagName(name)

- document.getElementsByClassName(name)

修改HTML Elements

- element.innerHTML =  new html content

- element.attribute = new value

- element.setAttribute(attribute, value)

- element.style.property = new style

添加/删除HTML Elements

- document.createElement(element)

- document.removeChild(element)

- document.appendChild(element)

- document.replaceChild(element)

- document.write(text)

添加Events Handlers

- document.getElementById(id).onclick = function(){code}

## 参考

[w3 DOM](https://www.w3.org/DOM/)

[htmldom](http://www.w3schools.com/js/js_htmldom.asp)

[DOM接口](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model)