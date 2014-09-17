---
layout: post
category : web
title: '安装node-express'
tagline: ""
tags : [node, web]
---

* auto-gen TOC:

{:toc}

## node安装

### linux

	wget http://nodejs.org/dist/node-latest.tar.gz
	tar zxvf node-latest.tar.gz
	cd node-v0.10.12
	./configure
	make
	make instal
	export NODE_HOME=/usr/local/node
	export PATH=$NODE_HOME/bin:$PATH  
	export NODE_PATH=$NODE_HOME/lib/node_modules:$PATH

<!--break-->

### windows

直接下载安装，配置环境变量
	
	参考：
	一、用户环境变量参数：
	PATH =D:\soft\nodejs\;D:\soft\nodejs\node_modules\express; C:\Users\Administrator\AppData\Roaming\npm;
	二、系统环境变量参数
	Path=D:\soft\nodejs;D:\soft\nodejs\node_modules\express;C:\Users\Administrator\AppData\Roaming\npm;
	NODE_PATH=D:\soft\nodejs\node_modules;C:\Users\Administrator\AppData\Roaming\npm;

## express安装 

如果安装的express是4.X就要安装 express-generator 不然 express目录是没有bin文件目录的。会报错express 不是内部或外部命令（windows）

参考 Express - guide

需要安装 

	npm install -g express-generator
	express -V
	express -e node-express
	进入项目目录，启动服务
	npm start

![express](/images/201408/express20140809.png)




