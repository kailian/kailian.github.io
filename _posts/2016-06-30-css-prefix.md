---
layout: post
category : web
title: 'css属性前缀'
tagline: ""
tags : [web,css]
---

## 浏览器前缀

浏览器前缀，是指每个浏览器都可以实现实验性的（或甚至是私有的、非标准的）特性，但要在名称前面加上自己特有的前缀。

网页开发者们可以自由地尝试这些加了前缀的特性，并把试用结果反馈给工作组，而工作组随后会将这些反馈吸收到规范之中，并且逐渐完善该项特性的设计。由于最终标准化的版本会有一个不同的名称（没有前缀），它在实际应用中就不会跟加前缀版本相冲突了。

<!--break-->

主要流行的浏览器内核主要有：

- Trident内核：主要代表为IE浏览器，前缀为`-ms`

- Gecko内核：主要代表为Firefox，前缀为`-moz`

- Presto内核：主要代表为Opera，前缀为`-o`

- Webkit内核：产要代表为Chrome和Safari，前缀为`-webkit`

写一个圆角border-radius

```
.box {
    -moz-border-radius: 10px;
    -ms-border-radius: 10px;
    -o-border-radius: 10px;
    -webkit-border-radius: 10px;
    border-radius: 10px;
}
```

这里面有两条声明是完全多余的：`-ms-border-radius` 和 `-o-border-radius` 这两个属性从来没有在任何浏览器中出现过，因为 IE 和 Opera 从一开始就是直接实现 border-radius 这个无前缀版本的。

## 关于处理css前缀的工具

显然，把每个声明都重复五遍是相当枯燥的，而且很难维护。

- `-prefix-free`脚本

- 编辑器插件，sublime text的Autoprefix CSS

- 预处理工具Sass、LESS、Stylus

- 自动化构建工具，Grunt中配置Autoprefixer，Gulp中配置Autoprefixer

最近以来，浏览器厂商已经很少以前缀的方式来实验性地实现新特性了。取而代之的是，这些实验性特性需要通过配置开关来启用，这可以有效防止开发者们在生产环境使用它们，因为你不能要求你的用户为了正确地浏览你的网站而去修改他们的浏览器设置。

## 参考

[如何处理CSS3属性前缀](http://www.w3cplus.com/css3/autoprefixer-css-vender-prefixes.html)

[css揭秘](https://github.com/cssmagic/CSS-Secrets/issues/7)