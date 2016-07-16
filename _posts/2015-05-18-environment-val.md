---
layout: post
category : linux
title: '环境变量'
tagline: ""
tags : [linux]
---

## 登录的环境变量配置文件

	/etc/profile（所有用户生效）
	/etc/profile.d/*.sh
	~/.bash_profile
	~/.bashrc（当前用户生效）
	/etc/bashrc

<!--break-->

## 配置文件生效

`.` 文件

`source` 文件

## 配置文件生效过程


![Alt environment](/images/201505/environment.png)


`/etc/profile`


	if [ $UID -gt 199 ] && [ "`id -gn`" = "`id -un`" ]; then
	    umask 002
	else
	    umask 022
	fi
	...
	for i in /etc/profile.d/*.sh ; do
	    if [ -r "$i" ]; then
	        if [ "${-#*i}" != "$-" ]; then
	            . "$i"
	        else
	            . "$i" >/dev/null 2>&1
	        fi
	    fi
	done
	[root@localhost ~]# umask
	0022


umask查看系统默认权限

文件最高权限666

目录最高权限777

权限不能用数字换算，必须用字母

umask定义的权限，是系统权限中准备丢弃的权限



	rw-rw-rw-   ----w--w-  r--r--r--
	rwxrwxrwx  ----w--w-  rwxr-xr-x（755）

## 环境变量配置文件的功能


1.USER变量

2.LOGNAME变量

3.MAIL变量

4.PATH变量

5.HOSTNAME变量

6.HISTSIZE变量

7.umask

8.调用`/etc/profile.d/*.sh`


	~/.bash_profile
	if [ -f ~/.bashrc ]; then
	        . ~/.bashrc
	fi

变量叠加，重新生效
重复定义的变量，后面的配置覆盖前面的

	~/.bashrc（定义别名）
	# Source global definitions
	if [ -f /etc/bashrc ]; then
	        . /etc/bashrc
	fi

`/etc/bashrc`

	PS1变量（起始符）
	umask
	PASH变量

## 其他环境变量配置文件

注销时生效的环境变量配置文件

	~/.bash_logout

（比用命令看少，保存在内存中，退出后记录）

	~/.bash_history

## shell登录信息

登录前欢迎信息

本地终端登录信息

	/etc/issue

远程终端登录信息

	/etc/issue.net

需要配置

	/etc/ssh/sshd_config
	Banner /etc/issue.net

登录后欢迎信息（包括本地和远程）

	/etc/motd


