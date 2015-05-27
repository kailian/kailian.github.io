---
layout: post
category : linux
title: '系统信息查看指令'
tagline: ""
tags : [linux]
---


* auto-gen TOC:
{:toc}

### 查看内存

	free
	free -m
	-b -k -m：分别以字节（KB、MB）为单位显示内存使用情况

top命令 是Linux下常用的性能分析工具 ，能够实时显示系统中各个进程的资源占用状况

<!--break-->

统计信息区前五行是系统整体的统计信息。第一行是任务队列信息，同uptime命令的执行结果。

	01:06:48  当前时间  
	up 1:22  系统运行 时间，格式为时:分  
	1 user  当前登录用户 数  
	load average: 0.06, 0.60, 0.48  系统负载 ，即任务队列的平均长度。
	            三个数值分别为  1分钟、5分钟、15分钟前到现在的平均值。

top命令使用过程中，还可以使用一些交互的命令来完成其它参数的功能。这些命令是通过快捷键启动的。

	＜空格＞：立刻刷新。
	P：根据CPU使用大小进行排序。
	T：根据时间、累计时间排序。
	q：退出top命令。
	m：切换显示内存信息。
	t：切换显示进程和CPU状态信息。
	c：切换显示命令名称和完整命令行。
	M：根据使用内存大小进行排序。
	W：将当前设置写入~/.toprc文件中。这是写top配置文件的推荐方法。

### 查看空间

	df -h
	df -hi

### 查看负载

	w
	cat /proc/loadavg

### 查看IO

	iostat
	iostat 4 表示每隔4秒就刷新一次

安装iotop

	yum install iotop
	iotop --only
	使用-o或-only选项来查看所有正在运行的进程或线程实
	man iotop
	列出所有使用和iotop的命令选项

### 查看监听端口

	netstat -lntp

### 查看进程

	ps –ef
	ps -aux

### 查看程序

	rpm -qa
