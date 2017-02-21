---
layout: post
category : web
title: 'css权重'
tagline: ""
tags : [web,css]
---

## 什么是CSS权重？

当很多的规则被应用到某一个元素上时，com权重决定了哪一条规则会被浏览器应用在元素上。

两个选择器权重值相同，则最后定义的规则被计算到权重中，后面的取代前面的。引入的样式表( @import )中的规则被认为出现在样式表本身的所有规则之前。

两个选择器权重值不同，则权重大的规则被计算到权重中。

内联样式表含有比别的规则更高的权重。

> 通用选择器（*） < 元素(类型)选择器 < 类选择器 < 属性选择器 < 伪类 < ID 选择器 < 内联样式

!important允许强制应用某样式，会覆盖所有样式规则，用法是写在该样式的某属性值后，结束分号前，以便强制应用该样式。

!important没有上下文可言，避免使用。

<!--break-->

## CSS权重等级

- 内联样式，如: style=''，权值为1000

- ID选择器，如：#content，权值为100

- 类，伪类和属性选择器，如.content，权值为10

- 类型选择器和伪元素选择器，如div p，权值为1

- 通配符的权重可以认为是0

![priority_rules_1.jpg](/images/201702/priority_rules_1.jpg)

![priority_rules_2.jpg](/images/201702/priority_rules_2.jpg)

CSS权重计算

```
*{}                         // 0
li{}                        // 1(一个元素)
li:first-line{}             // 2(一个元素，一个伪元素)
ul li {}                    // 2（两个元素）
ul ol+li{}                  // 3（三个元素）
h1+ *[rel=up] {}            // 11（一个属性选择器，一个元素）
ul ol li.red{}              // 13（一个类，三个元素）
li.red.level{}              // 21（两个类，一个元素）
style=""                    // 1000(一个行内样式)
p {}                        // 1（一个元素）
div p {}                    // 2（两个元素）
.sith {}                    // 10（一个类）
div p.sith{}                // 12（一个类，两个元素）
#sith{}                     // 100（一个ID选择器）
body #darkside .sith p {}   // 112(1+100+10+1,一个Id选择器，一个类，两个元素)
```

大鱼吃小鱼，小鱼吃小虾与CSS权重图

![specifishity1-1.png](/images/201702/specifishity1-1.png)

## 其他

IE6-10，Firefox，Webkit 中，256个Class权重比ID高（Chrome 24修复）

Opera 采用16位存储，所以超过65536个也会撑大。

## 参考

[css](https://www.w3.org/TR/CSS/#css)

[Selectors Level 3](https://www.w3.org/TR/selectors/#specificity)

[CSS选择器的权重与优先规则](http://www.nowamagic.net/csszone/css_SeletorPriorityRules.php)

[a:link/a:visited 为什么优先级比class高？](https://www.zhihu.com/question/21777264)

[有趣：256个class选择器可以干掉1个id选择器](http://www.zhangxinxu.com/wordpress/2012/08/256-class-selector-beat-id-selector/)

[你应该知道的一些事情——CSS权重](http://www.w3cplus.com/css/css-specificity-things-you-should-know.html)