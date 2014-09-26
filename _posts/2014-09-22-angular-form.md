---
layout: post
category : web
title: 'angular表单验证'
tagline: ""
tags : [web, angular]
---	

* auto-gen TOC:
{:toc}

浏览器form不可以嵌套，angular form可以嵌套。可以在使用ng-repeat标签的时候嵌套使用。

## CSS classes

- ng-valid is set if the form is valid.校验合法状态

- ng-invalid is set if the form is invalid. 校验非法状态

- ng-pristine is set if the form is pristine.（从未输入过）

- ng-dirty is set if the form is dirty.表单处于脏数据状态（输入过）

定义对应的CSS在根据状态显示

<!--break-->

## Angular对input元素的type进行了扩展，一共提供了以下10种类型

text

number

url

email

radio

checkbox

hidden

button

submit

reset

## 验证项

> 必须保证form元素拥有关联的 name 属性

Required 必填项

为了验证某个表单项是否为空，只需要在表单域上添加一个HTML5标签: required

Minimum length 最小长度

Maximum length 最大长度

Matches a pattern 正则匹配

Email地址

Number 数字

Url地址

自定义验证