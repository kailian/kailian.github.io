---
layout: post
category : jekyll
title: '在github搭建博客'
tagline: ""
tags : [github, 博客, jekyll]
---

* auto-gen TOC:
{:toc}

<div class="alert alert-danger alert-margin" role="alert">
	目的只是在github上建博客，只包含win环境相关软件的配置使用，暂不包括linux的相关环境配置。
</div>

## 使用ssh连接github

目的：省去每次上传都要输用户密码的麻烦

Win上使用git bash进入命令行界面

	cd ~/.ssh
	#看是否存在，“No such file or directory”则继续
	ssh-keygen -t rsa -C email@youremail.com
	#回车，生成秘钥
	#本机设置生成SSH Key之后，需要添加到GitHub上，以完成SSH链接的设置
	#进入.ssh目录，复制id_rsa.pub
	#Github上account setting选择ssh keys => add ssh key
	#复制id_rsa.pub的内容进去
	#同时clone代码的时候选择ssh的方式即可
	#测试一下
	ssh -T git@github.com
	#提交代码需要配置
	git config --global user.name "你的名字"
	git config --global user.email "your_email@youremail.com"

<!--break-->

## 接下来先新建一个repository
2.1、name为xxx.github.io 或者xxx.github.me之类的

Create repository

创建后进入项目管理，选择右侧的setting

2.2、然后本地git目录git clone git@github.com:xxx

新建一个index.html
	Git add
	Git commit
	Git push
访问 xxx.github.io

即可访问到静态页面

## 本地配置jekyll环境
至于要生成博客，则需要jekyll，github支持的生成静态网页的工具

Win安装jekyll

详情见http://jekyllrb.com/docs/installation/

安装ruby，下载http://rubyforge.org/frs/download.php/74298/rubyinstaller-1.9.2-p180.exe

http://rubyinstaller.org/downloads/上下载DevKit-tdm-32-4.5.2-20111229-1559-sfx.exe

安装jekyll本地环境

安装rubuinstaller选择添加path

安装后安装devkit，双击解压到（自定义）
	
	Win+R，进入devkit解压目录，执行
	Ruby dk.rb init
	Ruby dk.rb install
	#存在被墙的问题，需要更换gem源
	gem sources --remove http://rubygems.org/
	gem sources -a http://ruby.taobao.org/
	Gem install Jekyll
	#进入项目目录
	#解决utf8编码问题，先执行
	chcp 65001
	#代码页就被变成UTF-8
	Jekyll server
	Demo ：
	Git clone git@github.com:plusjade/jekyll-bootstrap.git
	则进入git项目目录，执行jekyll server，其他命令执行jekyll help
	默认访问localhost:4000即可

![Alt kailian.github.io](/images/kailian.png)

https://github.com/jekyll/jekyll/wiki/sites 

其他博客参考，github使用jekyll的博客的都是开源的。

到此完成，之后只要按照jekyll的语法，跟修改页面相关样式就可以建立一个在github上的博客了

文章支持使用markdown，命名按jekyll的命名要求即可

### 评论

可使用第三方插件（多说）

### jekyll博客主题

[HPSTR Theme](http://mmistakes.github.io/hpstr-jekyll-theme/)
