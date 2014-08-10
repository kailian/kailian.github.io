---
layout: post
category : 工具
title: 'sublime text2 ctags'
tagline: ""
tags : [sublime, 工具]
---

实现sublime text编辑器跳转

#### Windows安装

	1、下载并解压ctags包中的ctags.exe到系统环境路径（默认压缩在c:\windows\system32就好了）
	2、若没安装package control在这个插件的话，先安装ctags 
	3、现在安装开始ctags的插件了，在package control中选择install package，搜索ctags就能找到ctags的插件，安装之。

<!--break-->

首先cmd进入对应的目录，然后使用命令，会生成一个.tags 文件 

	ctags -R -f .tags

### linux安装

1、首先安装ctags工具：

    sudo apt-get install ctags 
    yum install ctags

2、进入项目目录

	ctags -R -f .tags

3、sublime text 安装ctags插件

光标放在某个函数上， 点击ctrl+shift+鼠标左键 就可以跳转到函数声明的地方，点击ctrl+shift+鼠标右键 就可以跳回去

