---
layout: post
category : web
title: 'web常见安全问题'
tagline: ""
tags : [web]
---

## SQL脚本注入

SQL脚本注入，把SQL命令插入到Web表单的输入域或页面请求的查询字符串，然后导致DAL中的语句+注入的SQL语句连接上DB进行SQL语句的执行，欺骗服务器执行恶意的SQL命令。

攻击：泄露重要数据，数据被恶意编辑，删除，或者表被删除

<!--break-->

如何防范 SQL 注入？

1. 永远不要信任用户的输入。对用户的输入进行校验、转义、过滤；

2. 不要动态拼接SQL，使用参数化的SQL

3. 每个应用使用单独权限的数据库连接

4. 加密敏感信息

5. 禁用异常输出到页面，写到错误日志

## 跨站攻击

### CSRF

CSRF(XSRF)（Cross-site request forgery，跨站请求伪造）

伪造请求，冒充用户在站内的正常操作；就是当A站用户未退出的情况下，通过其他非法B站发起非法请求来触发A站的请求操作；用户在不知情的请求下被诱导操作。

攻击：以你名义发送邮件，发消息，盗取你的账号，甚至于购买商品，虚拟货币转账，个人隐私泄露以及财产安全

如何防范 CSRF 攻击？

1. 关键操作只接受POST请求

2. 验证码（影响用户体验，一般只在注册、登录、充值等操作）

3. 检测Referer

4. Token校验（比如lavavel的 csrf-token）

### XSS 

XSS（Cross Site Scripting，跨站脚本攻击），是注入攻击的一种，特点是不对服务器端造成任何伤害。就是在请求URL参数中，或者form提交的内容中注入JavaScript脚本；通过 XSS 来实现的 CSRF 称为 XSRF。

攻击：轻则用户体验异常弹窗，重则用户cookie数据被盗取，引导用户到非法地址；

```
http://www.xx.com/userinfo/?username=xx&description=xx<script type="text/javascript">alert('xxs')</script>
```

如何防范 XSS 攻击？

1. 过滤用户的输入

2. 在视图绑定数据的时候(前端拼接，或者服务端脚本绑定)需要对数据进行HTML编码

## HTTP劫持

打开的是百度的页面，右下角弹出广告。

攻击：注入广告

情景：在公共场所有很多免费的WIFI，有些免费的WIFI会对HTTP进行劫持，然后修改html注入广告，网络供应商也会进行HTTP劫持，如使用移动网络的时候经常会出现移动广告

如何防御 HTTP劫持？

可以将HTTP替换成HTTPS，劫持后没有证书无法进行解密，就无法注入广告了。

## DOSS攻击

### SYN攻击

SYN 攻击指的是，攻击客户端在短时间内伪造大量不存在的IP地址，向服务器不断地发送SYN包，服务器回复确认包，并等待客户的确认。由于源地址是不存在的，服务器需要不断的重发直至超时，这些伪造的SYN包将长时间占用未连接队列，正常的SYN请求被丢弃。SYN 攻击是一种典型的 DoS/DDoS 攻击。

攻击：导致目标系统运行缓慢，严重者会引起网络堵塞甚至系统瘫痪。

如何防御 SYN 攻击？

可以使用系统自带的 netstats 命令来检测 SYN 攻击

1. 缩短超时（SYN Timeout）时间

2. 增加最大半连接数

3. 过滤网关防护

4. SYN cookies技术

5. 服务器部署安全防火墙

[大话WEB安全](http://blog.thankbabe.com/2016/04/03/Safe/)