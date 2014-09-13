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

#### 5.8.1. MySQL用户名和密码

MySQL用户名最大可达16字符长。

MySQL的加密密码使用自己的算法。该加密算法不同于Unix登录过程使用的算法。MySQL密码加密与`PASSWORD()`SQL函数的方法相同。Unix密码加密与`ENCRYPT()`SQL函数的方法相同。

#### 5.8.2. 向MySQL增加新用户账户

两种方式创建MySQL账户：

- 使用GRANT语句(更精确，错误少)

- 直接操作MySQL授权表

创建账户的其它方法是使用MySQL账户管理功能的第三方程序。phpMyAdmin即是一个程序。

为了更改，必须以MySQL root用户连接MySQL服务器，并且root账户必须有mysql数据库的INSERT权限和RELOAD管理权限。

	mysql> GRANT ALL PRIVILEGES ON *.* TO 'monty'@'localhost'
	    ->     IDENTIFIED BY 'some_pass' WITH GRANT OPTION;
	mysql> GRANT ALL PRIVILEGES ON *.* TO 'monty'@'%'
	    ->     IDENTIFIED BY 'some_pass' WITH GRANT OPTION;
	mysql> GRANT RELOAD,PROCESS ON *.* TO 'admin'@'localhost';
	mysql> GRANT USAGE ON *.* TO 'dummy'@'localhost';

两个账户有相同的用户名monty和密码some_pass。

两个账户均为超级用户账户，具有完全的权限可以做任何事情。

一个账户 ('monty'@'localhost')只用于从本机连接时。另一个账户('monty'@'%')可用于从其它主机连接。

一个账户有用户名admin，没有密码。该账户只用于从本机连接。授予了RELOAD和PROCESS管理权限。这些权限允许admin用户执行mysqladmin reload、mysqladmin refresh和mysqladmin flush-xxx命令，以及mysqladmin processlist。未授予访问数据库的权限。你可以通过GRANT语句添加此类权限。

 一个账户有用户名dummy，没有密码。该账户只用于从本机连接。未授予权限。通过GRANT语句中的USAGE权限，你可以创建账户而不授予任何权限。它可以将所有全局权限设为'N'。

直接用INSERT语句创建相同的账户，然后使用FLUSH PRIVILEGES告诉服务器重载授权表

	shell> mysql --user=root mysql
	mysql> INSERT INTO user
	    ->     VALUES('localhost','monty',PASSWORD('some_pass'),
	    ->     'Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y');
	mysql> INSERT INTO user
	    ->     VALUES('%','monty',PASSWORD('some_pass'),
	    ->     'Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y','Y');
	mysql> INSERT INTO user SET Host='localhost',User='admin',
	    ->     Reload_priv='Y', Process_priv='Y';
	mysql> INSERT INTO user (Host,User,Password)
	    ->     VALUES('localhost','dummy','');
	mysql> FLUSH PRIVILEGES;

当你用INSERT创建账户时使用FLUSH PRIVILEGES的原因是告诉服务器重读授权表。否则，只有重启服务器后更改方会被注意到。使用 GRANT，则不需要使用FLUSH PRIVILEGES。

用INSERT使用PASSWORD()函数是为了加密密码。GRANT语句为你加密密码，因此不需要PASSWORD()。

让某个用户从给定域的所有机器访问(例如，mydomain.com)，你可以在账户名的主机部分使用含‘%’通配符的GRANT语句

	mysql> GRANT ...
	    ->     ON *.*
	    ->     TO 'myname'@'%.mydomain.com'
	    ->     IDENTIFIED BY 'mypass';

#### 5.8.3. 从MySQL删除用户账户

DROP USER语句，该语句可以删除来自所有授权表的帐户权限记录。

	DROP USER user;

#### 5.8.4. 限制账户资源

`将max_user_connections系统变量设置为非零值`。但是，该方法严格限于全局，不允许管理具体账户。并且，它只限制使用单一账户同时连接的数量，而不是客户端连接后的操作。

在MySQL 5.1中，可以为具体账户限制下面的服务器资源：

- 账户每小时可以发出的查询数

- 账户每小时可以发出的更新数

- 账户每小时可以连接服务器的次数

- 限制每个账户的同时连接服务器的连接数

mysql数据库的user表必须包含资源相关的列。资源限制保存在max_questions、max_updates、max_connections和max_user_connections列内。

**用GRANT语句设置资源限制**，使WITH子句来命名每个要限制的资源和根据每小时记数的限制值。

	mysql> GRANT ALL ON customer.* TO 'francis'@'localhost'
	    ->     IDENTIFIED BY 'frank'
	    ->     WITH MAX_QUERIES_PER_HOUR 20
	    ->          MAX_UPDATES_PER_HOUR 10
	    ->          MAX_CONNECTIONS_PER_HOUR 5
	    ->          MAX_USER_CONNECTIONS 2;

根据每个账户进行资源计算，而不是根据每个客户端。例如，如果你的账户的查询限制为50，你不能通过两个客户端同时连接服务器将限制增加到100。两个连接的查询被计算到一起。

将所有账户当前的记数重设为零，可以**执行FLUSH USER_RESOURCES语句**。还可以通过**重载授权表来重设记数**(例如，使用FLUSH PRIVILEGES语句或mysqladmin reload命令)。

#### 5.8.5. 设置账户密码

用**mysqladmin命令**在命令行指定密码：

	shell> mysqladmin -u user_name -h host_name password "newpwd"
	shell> mysqladmin -u user_name -poldpw password "newpwd"

执行**SET PASSWORD**语句：

	mysql> SET PASSWORD FOR 'jeffrey'@'%' = PASSWORD('biscuit');

	shell> mysql -u root mysql
	mysql> INSERT INTO user (Host,User,Password)
	    -> VALUES('%','jeffrey',PASSWORD('biscuit'));
	mysql> FLUSH PRIVILEGES;

更改已有账户的密码，使用UPDATE来设置Password列值：

	shell> mysql -u root mysql
	mysql> UPDATE user SET Password = PASSWORD('bagel')
	    -> WHERE Host = '%' AND User = 'francis';
	mysql> FLUSH PRIVILEGES;

使用SET PASSWORD、INSERT或UPDATE指定账户的密码时，必须用PASSWORD()函数对它进行加密。(唯一的特例是如果密码为空，你不需要使用PASSWORD())

#### 5.8.6. 使你的密码安全

决不能将mysql.user表的访问权限授予任何非管理账户。

	shell> mysql -u francis -pfrank db_name

很方便但是不安全，因为你的密码对系统状态程序(例如ps)变得可见，它可以被其他的用户调用来显示命令行。一般MySQL客户在他们的初始化顺序期间用零覆盖命令行参数，但是仍然有一个短暂间隔时间内参数值可见的。

如果你在“.my.cnf”里面存储密码，除了你本人其它人不能访问该文件。保证文件的访问模式是400或600。例如：

	shell> chmod 600 .my.cnf

#### 5.8.7. 使用安全连接

MySQL支持MySQL客户端和服务器之间的安全(加密的)连接所使用的安全套接字层(SSL)协议。

获得安全的MySQL连接，必须：

1. 安装OpenSSL库。

2. 配置MySQL，用--with-vio和--with-openssl选项运行configure脚本。

3. 确保升级了授权表，使mysql.user表内包含SSL相关列。

4. 要想检查是否运行的mysqld服务器支持OpenSSL，检查have_openssl系统变量的值

值为YES，服务器支持OpenSSL连接。

	mysql> SHOW VARIABLES LIKE 'have_openssl';


为MySQL设置SSL证书

测试SSL连接，按下面方法启动服务器，其中$DIR是示例my.cnf选项文件安装的路径名

	shell> MySQLd --defaults-file=$DIR/my.cnf &

使用相同的选项文件调用客户端程序：

	shell> MySQL --defaults-file=$DIR/my.cnf

SSL GRANT 选项

REQUIRE SSL选项限制服务器只允许该账户的SSL加密连接。

	mysql> GRANT ALL PRIVILEGES ON test.* TO 'root'@'localhost'
	    -> IDENTIFIED BY 'goodsecret' REQUIRE SSL;

### 5.9. 备份与恢复

#### 5.9.1. 数据库备份

保持备份的一致性，对相关表执行LOCK TABLES操作，然后对表执行FLUSH TABLES。

这样当你复制数据库目录中的文件时，允许其它客户继续查询表。需要FLUSH TABLES语句来确保开始备份前将所有激活的索引页写入硬盘。

备份数据库的另一个技术是使用mysqldump程序或mysqlhotcopy脚本。

	shell> mysqldump --tab=/path/to/some/dir --opt db_name
	shell> mysqlhotcopy db_name /path/to/some/dir

只要服务器不再进行更新，还可以只复制所有表文件(`*.frm`、`*.MYD`和`*.MYI`文件)。mysqlhotcopy脚本使用该方法。(但请注意如果数据库包含InnoDB表，这些方法不工作。InnoDB不将表的内容保存到数据库目录中，mysqlhotcopy只适合MyISAM表）。

对于InnoDB表，可以进行在线备份，不需要对表进行锁定

恢复原mysqldump备份，或二进制备份。

	shell> mysqlbinlog hostname-bin.[0-9]* | mysql

5.9.2.1. 备份策略

按计划定期进行备份。可以用几个工具完全备份(在某个时间点的数据快照)MySQL。例如，InnoDB Hot Backup为InnoDB数据文件提供在线非数据块物理备份，**mysqldump提供在线逻辑备份**。

	shell> mysqldump --single-transaction --all-databases > backup_sunday_1_PM.sql

进行增量备份，我们需要保存增量更改。应使用`--log-bin`选项启动MySQL服务器，以便更新数据时将这些更改保存到文件中。该选项启用二进制日志，因此服务器写将每个更新数据的SQL语句写入MySQL二进制日志。

MySQL二进制日志文件：	

	-rw-rw---- 1 guilhem  guilhem   1277324 Nov 10 23:59 gbichot2-bin.000001
	-rw-rw---- 1 guilhem  guilhem         4 Nov 10 23:59 gbichot2-bin.000002
	-rw-rw---- 1 guilhem  guilhem        79 Nov 11 11:06 gbichot2-bin.000003
	-rw-rw---- 1 guilhem  guilhem       508 Nov 11 11:08 gbichot2-bin.000004
	-rw-rw---- 1 guilhem  guilhem 220047446 Nov 12 16:47 gbichot2-bin.000005
	-rw-rw---- 1 guilhem  guilhem    998412 Nov 14 10:08 gbichot2-bin.000006
	-rw-rw---- 1 guilhem  guilhem       361 Nov 14 10:07 gbichot2-bin.index

每次重启，MySQL服务器用序列中的下一个编号创建一个新的二进制日志文件。当服务器运行时，你还可以通过执行FLUSH LOGS SQL语句或mysqladmin flush-logs命令，告诉服务器关闭当前的二进制日志文件并创建一个新文件。mysqldump也有一个选项来清空日志。数据目录中的.index文件包含该目录下所有MySQL二进制日志的清单。该文件用于复制。

恢复时MySQL二进制日志很重要，因为它们是增量备份。如果进行完全备份时确保清空了日志，则后面创建的二进制日志文件包含了备份后的所有数据更改。

在完全备份时能够清空 MySQL二进制日志，以便转储文件包含包含新的当前的二进制日志：

	shell> mysqldump --single-transaction --flush-logs --master-data=2
           --all-databases > backup_sunday_1_PM.sql

执行该命令后，数据目录则包含新的二进制日志文件，gbichot2-bin.000007。结果.sql文件包含下列行：

	-- Position to start replication or point-in-time 恢复时y from
	-- CHANGE MASTER TO MASTER_LOG_FILE='gbichot2-bin.000007',MASTER_LOG_POS=4;


因为mysqldump命令可以执行完全备份，这些行表示两件事情：

- ·sql文件包含所有写入gbichot2-bin.000007二进制日志文件或最新的文件之前的更改。

- 备份后所记录的所有数据更改不出现在.sql中，但出现在gbichot2-bin.000007二进制日志文件或最新的文件中。

MySQL二进制日志占据硬盘空间。要想释放空间，应随时清空。操作方法是删掉不再使用的二进制日志，例如进行完全备份时：

	shell> mysqldump --single-transaction --flush-logs --master-data=2
	--all-databases --delete-master-logs > backup_sunday_1_PM.sql

注：如果你的服务器为复制主服务器，用`mysqldump --delete-master-logs`删掉MySQL二进制日志很危险，因为从服务器可能还没有完全处理该二进制日志的内容。

5.9.2.2. 为恢复进行备份

	shell> mysql < backup_sunday_1_PM.sql

	shell> mysqlbinlog gbichot2-bin.000007 gbichot2-bin.000008 | mysql

5.9.2.3. 备份策略摘要

- 一定用--log-bin或甚至--log-bin=log_name选项运行MySQL服务器，其中日志文件名位于某个安全媒介上，不同于数据目录所在驱动器。如果你有这样的安全媒介，最好进行硬盘负载均衡

- 定期进行完全备份，使用mysqldump命令进行在线非块备份。

- 用FLUSH LOGS或mysqladmin flush-logs清空日志进行定期增量备份。

#### 5.9.3. 自动恢复

5.9.3.1. 指定恢复时间

5.9.3.2. 指定恢复位置

#### 5.9.4. 表维护和崩溃恢复

### 5.10. MySQL本地化和国际应用

### 5.11. MySQL日志文件

### 5.12. 在同一台机器上运行多个MySQL服务器

### 5.13. MySQL查询高速缓冲



