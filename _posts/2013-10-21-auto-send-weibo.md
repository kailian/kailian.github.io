---
layout: post
category : web
title: '【web】PHP自动发微博'
tagline: ""
tags : [php, web]
---

<div class="alert alert-danger alert-margin" role="alert">
	原写于2013-10-21，于2014-08-09改到github上
</div>

第一种是模拟登陆新浪通行证的做法，但是存在不稳定因素

第二种使用新浪提供的API，[文档](http://open.weibo.com/wiki/%E9%A6%96%E9%A1%B5)

<!--break-->

使用的是OAuth2.0授权认证，重要的是，**开发者账号的access_token是不受时间限制的**

首先可以通过授权登录得到uid跟access_token，得到之后写成常量或存入数据库，使用时读取

php使用sae平台上的api即可根据需求在自己的微博上发布微博或获取信息

http://apidoc.sinaapp.com/sae/SaeTClientV2.html

	include_once( 'saetv2.ex.class.php' );
	$c = new SaeTClientV2( WB_AKEY , WB_SKEY , $access_token);
	$ret = $c->update($content);

通过微信API，就可以通过微信发微博了，真够无聊的~~