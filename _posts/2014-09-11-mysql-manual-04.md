---
layout: post
category : 数据库
title: 'Mysql5.1参考手册摘录04'
tagline: ""
tags : [数据库, Mysql]
---

## 第5章：数据库管理

### 5.1. MySQL服务器和服务器启动脚本

#### mysqld

MySQL服务器，是在MySQL安装中负责大部分工作的主程序。

要想使用客户端程序，该程序必须运行，因为客户端通过连接服务器来访问数据库。

<!--break-->

	ps aux | grep "mysql"
	root      8328  0.0  0.3 106188  1536 ?        S    Aug16   0:00 /bin/sh /usr/local/mysql/bin/mysqld_safe --datadir=/usr/local/mysql/var --pid-file=/usr/local/mysql/var/lkl.pid
	mysql     8700  0.0  7.2 598300 36500 ?        Sl   Aug16  14:40 /usr/local/mysql/bin/mysqld --basedir=/usr/local/mysql --datadir=/usr/local/mysql/var --plugin-dir=/usr/local/mysql/lib/plugin --user=mysql --log-error=/usr/local/mysql/var/lkl.err --pid-file=/usr/local/mysql/var/lkl.pid --socket=/tmp/mysql.sock --port=3306

#### mysqld-max

包括更多特性的一个服务器版本

#### mysqld_safe

服务器启动脚本。如果mysqld-max存在,mysqld_safe试图启动它，否则启动mysqld。

#### mysql.server

服务器启动脚本。该脚本用于使用包含为特定级别的运行启动服务的脚本的运行目录的系统。它调用mysqld_safe来启动MySQL服务器。

#### mysqld_multi

服务器启动脚本，可以启动或停止系统上安装的多个服务器。

其他程序参考[原文](http://dev.mysql.com/doc/refman/5.1/zh/database-administration.html)

### 5.1.3. mysqld_safe：MySQL服务器启动脚本

mysqld_safe增加了一些安全特性，例如当**出现错误时重启服务器并向错误日志文件写入运行时间信息**。

### 服务器系统变量

SHOW VARIABLES语句查看系统变量及其值

	SHOW VARIABLES;

动态系统变量

许多服务器系统变量是动态的，可以使用SET GLOBAL或SET SESSION在运行时设置。

### 服务器状态变量

	SHOW STATUS;

### 5.5 MySQL服务器关机进程

1. 启动关闭进程

2. 服务器根据需要创建关闭线程

3. 服务器停止接收新连接

4. 服务器终止当前的活动

5. 存储引擎被停掉或关闭

6. 服务器退出

### 5.6 一般安全问题

- MySQL根据访问控制列表(ACL)对所有连接、查询和其它用户尝试执行的操作进行安全管理。MySQL客户端和服务器之间还支持SSL-加密连接。

- 不要让任何人(除了MySQL root账户)访问mysql数据库中的user表！这很关键。加密的密码才是MySQL中的真正的密码。

- 学习MySQL访问权限系统。用GRANT和REVOKE语句来控制对MySQL的访问。不要授予超过需求的权限。决不能为所有主机授权。

- 通过SHOW GRANTS语句检查查看谁已经访问了什么。然后使用REVOKE语句删除不再需要的权限。

- 不要将纯文本密码保存到数据库中。使用MD5()、SHA1()或单向哈希函数。

- 不要信任应用程序的用户输入的任何数据。

- 一个常见的错误是只保护字符串数据值。一定要记住还应检查数字数据。如果当用户输入值`234`时，应用程序生成查询`SELECT * FROM table WHERE ID=234`，用户可以输入值`234 OR 1=1`使应用程序生成查询`SELECT * FROM table WHERE ID=234 OR 1=1`。结果是服务器查找表内的每个记录。

保护防范这类攻击的最简单的方法是使用单引号将数字常量引起来

检查清单：

- 试试用Web形式输入单引号和双引号(‘'’和‘"’)。

- 试试修改动态URL，可以在其中添加%22(‘"’)、%23(‘#’)和%27(‘'’)。

- 试试在动态URL中修改数据类型，使用前面示例中的字符，包括数字和字符类型。

- 试试输入字符、空格和特殊符号，不要输入数值字段的数字。

- 将数据传给MySQL之前先检查其大小。

- 用管理账户之外的用户名将应用程序连接到数据库。不要给应用程序任何不需要的访问权限。

- 应可以(并且应该)用普通非特权用户运行mysqld。

### 5.7 MySQL访问权限系统

#### 权限系统的作用

MySQL权限系统的主要功能是证实连接到一台给定主机的用户，并且赋予该用户在数据库上的SELECT、INSERT、UPDATE和DELETE权限。
附加的功能包括有匿名的用户并对于MySQL特定的功能例如LOAD DATA INFILE进行授权及管理操作的能力。

#### 权限系统工作原理

MySQL存取控制包含2个阶段：

- 阶段1：服务器检查是否允许你连接。

- 阶段2：假定你能连接，服务器检查你发出的每个请求。看你是否有足够的权限实施它。例如，如果你从数据库表中选择(select)行或从数据库删除表，服务器确定你对表有SELECT权限或对数据库有DROP权限。

**访问控制, 阶段1：连接核实**

身份检查使用3个user表(Host, User和Password)范围列执行。服务器只有在user表记录的Host和User列匹配客户端主机名和用户名并且提供了正确的密码时才接受连接。

**访问控制, 阶段2：请求核实**

一旦你建立了连接，服务器进入访问控制的阶段2。对在此连接上进来的每个请求，服务器检查你想执行什么操作，然后检查是否有足够的权限来执行它。权限可以来自user、db、host、tables_priv或columns_priv表。

#### 权限更改何时生效

当mysqld启动时，所有授权表的内容被读进内存并且从此时生效。

当服务器注意到授权表被改变了时，现存的客户端连接有如下影响：

表和列权限在客户端的下一次请求时生效。

数据库权限改变在下一个USE db_name命令生效。

全局权限的改变和密码改变在下一次客户端连接时生效。

如果用GRANT、REVOKE或SET PASSWORD对授权表进行修改，服务器会注意到并立即重新将授权表载入内存。

如果你手动地修改授权表(使用INSERT、UPDATE或DELETE等等)，你应该执行mysqladmin flush-privileges或mysqladmin reload告诉服务器再装载授权表，否则你的更改将不会生效，除非你重启服务器。

### 5.8 MySQL用户账户管理