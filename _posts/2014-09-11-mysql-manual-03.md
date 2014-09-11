---
layout: post
category : 数据库
title: 'Mysql5.1参考手册摘录03'
tagline: ""
tags : [数据库, Mysql]
---

## 第4章：MySQL程序概述

### MYSQL服务器和服务器启动脚本： 

- **mysqld**是MySQL服务器。

- mysqld_safe、mysql.server和mysqld_multi是服务器启动脚本。

- mysql_install_db初始化数据目录和初始数据库。

- **mysql**是一个**命令行客户程序**，用于交互式或以批处理模式执行SQL语句。

<!--break-->

- mysqladmin是用于管理功能的客户程序。

- **mysqldump**和mysqlhotcopy负责**数据库备份**。

- mysqlimport导入数据文件。

- mysqlshow显示信息数据库和表的相关信息。

- myisamchk执行表维护操作。

- myisampack产生压缩、只读的表。

- mysqlbinlog是处理二进制日志文件的实用工具。

- perror显示错误代码的含义。

具体使用，命令行使用 `-?`或`--help`

### 指定程序选项

MySQL程序首先检查环境变量，然后检查选项文件，然后检查命令行来确定给出了哪些选项。如果多次指定一个选项，最后出现的选项占先。

这说明环境变量具有最低的优先级，**命令行选项**具有**最高优先级**。

在选项文件中指定程序选项的默认值来让MySQL程序处理各选项。不需要在每次运行程序时输入选项，但可以根据需要通过命令行选项来覆盖默认值。

### 在命令行上使用选项

规则

- 在命令名后面紧跟选项

- 选项参量以一个和两个破折号开始，例如，`-?`和`--help`

-  选项名对大小写敏感。-v和-V均有效，但具有不同的含义。(它们是`--verbose`和`--version`选项的短名）。

-  对于带选项值的长选项，通过一个`=`将选项名和值隔离开来。对于带选项值的短选项，选项值可以紧随选项字母后面，或者二者之间可以用一个空格隔开。(`-hlocalhost`和`-h localhost`是等效的）。该规则的例外情况是指定MySQL密码的选项。该选项的形式可以为`--password=pass_val`或`--password`。在后一种情况(未给出密码值)，程序将提示输入密码。也可以给出密码选项，短形式为`-ppass_val`或`-p`。然而，对于短形式，如果给出了密码值，必须紧跟在选项后面，中间不能插入空格。

- `-e`或`--execute`选项，可用来将SQL语句传递给服务器。该语句必须用引号引起来(单引号或双引号)

例如：

	shell> mysql -u root -p -e "SELECT User, Host FROM User" mysql

### 使用选项文件

	[client]
	port=3306
	socket=/tmp/mysql.sock
	 
	[mysqld]
	port=3306
	socket=/tmp/mysql.sock
	key_buffer_size=16M
	max_allowed_packet=8M
	 
	[mysqldump]
	quick

opt_name

等价于命令行中的`--opt_name`

opt_name=value

等价于命令行中的`--opt_name=value`

`#`注释，`；`注释

### 用环境变量指定选项

使用MYSQL_TCP_PORT变量指定TCP/IP端口号

	MYSQL_TCP_PORT=3306
	export MYSQL_TCP_PORT
