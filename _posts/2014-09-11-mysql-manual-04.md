---
layout: post
category : 数据库
title: 'Mysql5.1参考手册摘录04'
tagline: ""
tags : [数据库, Mysql]
---

* auto-gen TOC:

{:toc}

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

在mysqlbinlog语句中通过--start-date和--stop-date选项指定DATETIME格式的起止时间。

举例说明，假设在今天上午10:00(今天是2005年4月20日)，执行SQL语句来删除一个大表。要想恢复表和数据，**可以恢复前晚上的备份，并输入**：

	mysqlbinlog --stop-date="2005-04-20 9:59:59" /var/log/mysql/bin.123456 \
	 | mysql -u root -pmypwd

	mysqlbinlog --start-date="2005-04-20 10:01:00" /var/log/mysql/bin.123456 \
	 | mysql -u root -pmypwd \	

第一行恢复截止到在--stop-date选项中以DATETIME格式给出的日期和时间的所有数据。

第二行从上午10:01登录的SQL语句将运行。

5.9.3.2. 指定恢复位置

使用mysqlbinlog的选项--start-position和--stop-position来指定日志位置。

作用与起止日选项相同，不同的是给出了从日志起的位置号。

使用日志位置是更准确的恢复方法，特别是当由于破坏性SQL语句同时发生许多事务的时候。

要想确定位置号，可以运行mysqlbinlog寻找执行了不期望的事务的时间范围，但应将结果重新指向文本文件以便进行检查。操作方法为：

	mysqlbinlog --start-date="2005-04-20 9:55:00" --stop-date="2005-04-20 10:05:00" \
	 /var/log/mysql/bin.123456 > /tmp/mysql_restore.sql

该命令将在/tmp目录创建小的文本文件，将显示执行了错误的SQL语句时的SQL语句。

可以用文本编辑器打开该文件，寻找不要想重复的语句。

如果二进制日志中的位置号用于停止和继续恢复操作，应进行注释。

用log_pos加一个数字来标记位置。

使用位置号恢复了以前的备份文件后，你应从命令行输入下面内容：

	mysqlbinlog --stop-position="368312" /var/log/mysql/bin.123456 \
	    | mysql -u root -pmypwd 
	 
	mysqlbinlog --start-position="368315" /var/log/mysql/bin.123456 \
	    | mysql -u root -pmypwd \ 

上面的第1行将恢复到停止位置为止的所有事务。

下一行将恢复从给定的起始位置直到二进制日志结束的所有事务。

因为mysqlbinlog的输出包括每个SQL语句记录之前的SET TIMESTAMP语句，恢复的数据和相关MySQL日志将反应事务执行的原时间。

#### 5.9.4. 表维护和崩溃恢复

使用myisamchk来检查或维护MyISAM表(对应.MYI和.MYD文件的表)。

### 5.10. MySQL本地化和国际应用

查看默认字符集

	mysql> SHOW VARIABLES LIKE 'character%';
	+--------------------------+----------------------------------+
	| Variable_name            | Value                            |
	+--------------------------+----------------------------------+
	| character_set_client     | latin1                           |
	| character_set_connection | latin1                           |
	| character_set_database   | utf8                             |
	| character_set_filesystem | binary                           |
	| character_set_results    | latin1                           |
	| character_set_server     | utf8                             |
	| character_set_system     | utf8                             |
	| character_sets_dir       | /usr/local/mysql/share/charsets/ |
	+--------------------------+----------------------------------+
	8 rows in set (0.00 sec)

默认情况下，MySQL使用**cp1252(Latin1)字符集**根据Swedish/Finnish规则进行排序。

1. 编译MySQL 时，指定了一个默认的字符集，这个字符集是 latin1；

2. 安装MySQL 时，可以在配置文件 (my.ini) 中指定一个默认的的字符集，如果没指定，这个值继承自编译时指定的；

3. 启动mysqld 时，可以在命令行参数中指定一个默认的的字符集，如果没指定，这个值继承自配置文件中的配置，此时 character_set_server 被设定为这个默认的字符集；

4. 当创建一个新的数据库时，除非明确指定，这个数据库的字符集被缺省设定为character_set_server；

5. 当选定了一个数据库时，character_set_database 被设定为这个数据库默认的字符集；

6. 在这个数据库里创建一张表时，表默认的字符集被设定为 character_set_database，也就是这个数据库默认的字符集；

7. 当在表内设置一栏时，除非明确指定，否则此栏缺省的字符集就是表默认的字符集；


**修改默认字符集**

修改mysql的my.ini文件中的字符集键值，如：

	default-character-set = utf8
	character_set_server =  utf8

修改完后，重启mysql的服务。

或者使用mysql的命令

	mysql> SET character_set_client = utf8 ;
	mysql> SET character_set_connection = utf8 ;
	mysql> SET character_set_database = utf8 ;
	mysql> SET character_set_results = utf8 ;
	mysql> SET character_set_server = utf8 ;
	mysql> SET collation_connection = utf8 ;
	mysql> SET collation_database = utf8 ;
	mysql> SET collation_server = utf8 ;

character_set_client：客户端发送过来文字的字符集
character_set_results：发送给客户端的结果所使用的字符集
character_set_connection：用于连接的字符集


### 5.11. MySQL日志文件

> 程序中记录日志一般有两个目的：Troubleshooting(故障排除)和显示程序运行状态。

日志文件   | 记入文件中的信息类型
---------- | --------------------
错误日志   | 记录启动、运行或停止mysqld时出现的问题。
查询日志   | 记录建立的客户端连接和执行的语句。
更新日志   | 记录更改数据的语句。不赞成使用该日志。
二进制日志 | 记录所有更改数据的语句。还用于复制。
慢日志     | 记录所有执行时间超过long_query_time秒的所有查询或不使用索引的查询。

默认情况下，所有**日志创建于mysqld数据目录中**。通过刷新日志，你可以强制mysqld来关闭和重新打开日志文件（或者在某些情况下切换到一个新的日志）。当你执行一个`FLUSH LOGS`语句或执行`mysqladmin flush-logs`或`mysqladmin refresh`时，出现**日志刷新**。

查询当前日志记录的状况： 

	mysql> show variables like 'log_%';（是否启用了日志）
	mysql> show master status;（怎样知道当前的日志）
	mysql> show master logs;（显示二进制日志的数目）

	mysql> show variables like 'log_%';
	+---------------------------------+------------------------------+
	| Variable_name                   | Value                        |
	+---------------------------------+------------------------------+
	| log_bin                         | ON                           |
	| log_bin_trust_function_creators | OFF                          |
	| log_error                       | /usr/local/mysql/var/lkl.err |
	| log_output                      | FILE                         |
	| log_queries_not_using_indexes   | OFF                          |
	| log_slave_updates               | OFF                          |
	| log_slow_queries                | OFF                          |
	| log_warnings                    | 1                            |
	+---------------------------------+------------------------------+

	mysql> show master status;
	+------------------+----------+--------------+------------------+
	| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
	+------------------+----------+--------------+------------------+
	| mysql-bin.000025 |  1986367 |              |                  |
	+------------------+----------+--------------+------------------+

	mysql> show master logs;
	+------------------+-----------+
	| Log_name         | File_size |
	+------------------+-----------+
	| mysql-bin.000001 |     27284 |
	| mysql-bin.000002 |   1038693 |
	| mysql-bin.000003 |      1263 |
	| mysql-bin.000004 |       126 |
	| mysql-bin.000005 |       150 |
	| mysql-bin.000006 |       126 |
	| mysql-bin.000007 |     26239 |
	| mysql-bin.000008 |   1038693 |
	| mysql-bin.000009 |       126 |
	| mysql-bin.000010 |       126 |
	| mysql-bin.000011 |       150 |
	| mysql-bin.000012 |       126 |
	| mysql-bin.000013 |       395 |
	| mysql-bin.000014 | 118660415 |
	| mysql-bin.000015 |      1868 |
	| mysql-bin.000016 |    712781 |
	| mysql-bin.000017 |     31461 |
	| mysql-bin.000018 |   2818724 |
	| mysql-bin.000019 |       126 |
	| mysql-bin.000020 |    201758 |
	| mysql-bin.000021 |   1567758 |
	| mysql-bin.000022 |    216192 |
	| mysql-bin.000023 |       126 |
	| mysql-bin.000024 |  13110010 |
	| mysql-bin.000025 |   1986613 |
	+------------------+-----------+

	mysql> reset master;
	+------------------+-----------+
	| Log_name         | File_size |
	+------------------+-----------+
	| mysql-bin.000001 |       107 |
	+------------------+-----------+

日志量大计划任务定时清理

#### 5.11.1. 错误日志

错误日志文件包含了当mysqld启动和停止时，以及服务器在运行过程中发生任何严重错误时的相关信息。

如果mysqld莫名其妙地死掉并且mysqld_safe需要重新启动它，mysqld_safe在错误日志中写入一条restarted mysqld消息。

如果mysqld注意到需要自动检查或着修复一个表，则错误日志中写入一条消息。

用`--log-error[=file_name]`选项来指定mysqld保存**错误日志文件的位置**。如果没有给定file_name值，mysqld使用错误日志名host_name.err 并在数据目录中写入日志文件。

如果你执行`FLUSH LOGS`，错误日志用-old重新命名后缀并且mysqld创建一个新的空日志文件。(如果未给出--log-error选项，则不会重新命名）。

#### 5.11.2. 通用查询日志

用`--log[=file_name]`或`-l [file_name]`选项启动。没有给定file_name的值， 默认名是host_name.log。

**所有连接和语句被记录到日志文件**。

**mysqld按照它接收的顺序记录语句到查询日志**。这可能与执行的顺序不同。

查询日志还包含所有语句，而二进制日志不包含只查询数据的语句。

服务器重新启动和日志刷新不会产生新的一般查询日志文件

重新命名文件并创建一个新文件

	shell> mv hostname.log hostname-old.log
	shell> mysqladmin flush-logs
	shell> cp hostname-old.log to-backup-directory
	shell> rm hostname-old.log


#### 5.11.3. 二进制日志

二进制日志以一种更有效的格式，并且是**事务安全的方式**包含更新日志中可用的所有信息。

二进制日志的主要目的是在恢复使能够最大可能地更新数据库，因为二进制日志包含备份后进行的所有更新。(取代更新日志)

二进制日志还用于在主复制服务器上记录所有将发送给从服务器的语句。	

运行服务器时若启用二进制日志则性能大约慢1%。但是，二进制日志的好处，即用于恢复并允许设置复制超过了这个小小的性能损失。

用`--log-bin[=file_name]`选项启动，mysqld写入包含所有更新数据的SQL命令的日志文件。

mysqld在每个二进制日志名后面添加一个数字扩展名。每次你启动服务器或刷新日志时该数字则增加。

如果当前的日志大小达到max_binlog_size，还会自动创建新的二进制日志。如果你正使用大的事务，二进制日志还会超过max_binlog_size：事务全写入一个二进制日志中，绝对不要写入不同的二进制日志中。

mysqld还创建一个二进制日志索引文件，默认情况下与二进制日志文件的文件名相同，扩展名为`.index`。你可以用`--log-bin-index[=file_name]`选项更改二进制日志索引文件的文件名。

可以用`RESET MASTER`语句删除所有二进制日志文件，或用`PURGE MASTER LOGS`只删除部分二进制文件。

#### 5.11.4. 慢速查询日志

用`--log-slow-queries[=file_name]`选项启动时，mysqld写一个包含所有执行时间超过`long_query_time`秒的SQL语句的日志文件。获得初使表锁定的时间不算作执行时间。

语句执行完并且所有锁释放后记入慢查询日志。记录顺序可以与执行顺序不相同。

慢查询日志可以用来找到`执行时间长的查询，可以用于优化`。但是，检查又长又慢的查询日志会很困难。要想容易些，你可以使用mysqldumpslow命令获得日志中显示的查询摘要来处理慢查询日志。

> 慢日志的查询可以部署MTOP，跑计划任务然后通过可视化web界面进行查看。

5.11.5. 日志文件维护

MySQL服务器可以创建各种不同的日志文件，必须定期清理这些文件，确保日志不会占用太多的硬盘空间。

通过脚本从cron等入手处理日志文件。

通过mysqladmin flush-logs或SQL语句FLUSH LOGS来强制MySQL开始使用新的日志文件。

日志清空操作做下列事情：

- 使用标准日志(--log)或慢查询日志(--log-slow-queries)，关闭并重新打开日志文件。

- 使用更新日志(--log-update)或二进制日志(--log-bin)，关闭日志并且打开有更高序列号的新日志文件。


### 5.12. 在同一台机器上运行多个MySQL服务器

可能想要测试一个新的MySQL发布，同时不影响现有产品的设置。或者，你可能想使不同的用户访问来访问不同的mysqld服务器以便他们自己来管理。

在一个单独的机器上运行多个服务器，每个服务器必须有**唯一的各运行参数值**。这些值可以在**命令行中设置或在选项文件中设置**。

下面的选项对每个服务器必须是不同的：

- --port=port_num

- --socket=path

- --shared-memory-base-name=name

- --pid-file=path

- --log=path

- --log-bin=path

- --log-update=path

- --log-error=path

- --bdb-logdir=path

- --tmpdir=path

- --bdb-tmpdir=path


在不同的位置有多个MySQL的安装，一般情况可以用--basedir=path选项为每个服务器指定基本安装目录，使每个服务器使用不同的数据目录、日志文件和PID文件。（所有这些值的 默认值相对于根目录来确定）。那样的话， 你唯一需要指定的其它选项是--socket和--port选项。

使用各个安装服务器相应的根目录中的bin/mysqld_safe命令来启动服务器。mysqld_safe确定正确的--basedir选项传递给mysqld，你仅需要为mysqld_safe指定--socket和--port选项。

5.12.2. 在Unix中运行多个服务器

在Unix中运行多个服务器最容易的方法是使用不同的TCP/IP端口s和Unix套接字文件编译，因此每个实例在不同的网络接口侦听。

另外，每个安装应在不同的基础目录中编译，那将自动为你的每个服务器产生使用不同的编译进来的数据目录、日志文件和PID文件位置。

假设一个现有的4.1.8版本服务器配置为默认TCP/IP端口号(3306)和Unix套接字文件(/tmp/mysql.sock)。要想配置一个新的5.1.2-alpha版的服务器来使用不同的操作参数，使用一个configure命令，大概象这样使用：

	shell> ./configure --with-tcp-port=port_number \
	        --with-unix-socket-path=file_name \
	        --prefix=/usr/local/mysql-5.1.2-alpha

port_number和file_name必须不同于默认TCP/IP端口号和Unix套接字文件路径名，并且--prefix值应指定一个不同于现有MySQL安装目录的安装目录。

用一个不同的Unix套接字文件和TCP/IP端口号启动，不必编译新的MySQL服务器。还可以在运行时指定这些值。

	shell> mysqld_safe --socket=file_name --port=port_number

### 5.13. MySQL查询高速缓冲

查询缓存存储SELECT查询的文本以及发送给客户端的相应结果。

如果随后收到一个相同的查询，服务器从查询缓存中重新得到查询结果，而不再需要解析和执行查询。

是否启用

	mysql>  SHOW VARIABLES LIKE 'have_query_cache';
	+------------------+-------+
	| Variable_name    | Value |
	+------------------+-------+
	| have_query_cache | YES   |
	+------------------+-------+

查询解析之前进行比较，因此下面的两个查询被查询缓存认为是不相同的：

	SELECT * FROM tbl_name
	Select * from tbl_name

查询必须是完全相同的(逐字节相同)才能够被认为是相同的。另外，同样的查询字符串由于其它原因可能认为是不同的。使用不同的数据库、不同的协议版本或者不同 默认字符集的查询被认为是不同的查询并且分别进行缓存。	

- 查询缓存不返回旧的数据。当表更改后，查询缓存值的相关条目被清空。

- 如果你有许多mysqld服务器更新相同的MyISAM表，在这种情况下查询缓存不起作用。

- 查询缓存不适用于服务器方编写的语句。如果正在使用服务器方编写的语句，要考虑到这些语句将不会应用查询缓存

为了监视查询缓存性能，使用SHOW STATUS查看缓存状态变量：

	mysql> SHOW STATUS LIKE 'Qcache%';



注：程序的缓存使用Memcached缓存



