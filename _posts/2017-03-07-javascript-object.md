---
layout: post
category : web
title: 'javascript-object'
tagline: ""
tags : [web,javascript]
---

完整内容请查看[You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch3.md)，仅作为笔记参考。

## 对象定义

object的两种定义形式：声明形式和构造形式

```
//声明
var myObj = {
    key: value
    // ...
};

//构造
var myObj = new Object();
myObj.key = value;
```

JavaScript 引擎在初始化时，会构建一个全局对象，在客户端环境中，这个全局对象即为window。

内置对象，在JavaScript中，实际上只是一些内置函数，可用当作构造函数（由new调用函数），构造一个对应子类型的新对象。

- String

- Number

- Boolean

- Object

- Function

- Array

- Date

- RegExp

- Error

```
var strPrimitive = "I am a string";
typeof strPrimitive;                            // "string"
strPrimitive instanceof String;                 // false

var strObject = new String( "I am a string" );
typeof strObject;                               // "object"
strObject instanceof String;                    // true

// inspect the object sub-type
Object.prototype.toString.call( strObject );    // [object String]
```

在必要时语言会自动把字符串字面量转换成一个String 对象，不需要显式创建一个对象

