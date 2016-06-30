---
layout: post
category : web
title: 'mysql主从'
tagline: ""
tags : [mysql]
---

* auto-gen TOC:
{:toc}

## MySQL复制介绍

MySQL复制就是一台MySQL服务器（slave）从另一台MySQL服务器（master）进行日志的复制然后再解析日志并应用到自身

![mysql copy](/images/201606/mysql_copy.png)

MySQL复制过程分成三步：

1. master将改变记录到二进制日志（binary log）。这些记录过程叫做二进制日志事件，binary log events；

2. slave将master的binary log events拷贝到它的中继日志（relay log）；

3. slave重做中继日志中的事件，将改变应用到自己的数据库中。 MySQL复制是异步的且串行化的

<!--break-->

## 权限配置

主服务器 `192.168.15.216`， 从服务器 `192.168.15.54`

登录master Mysql，给从机分配一个同步用的账号

```
mysql> grant replication slave on *.* to '帐号名'@'从机IP' identified by '密码';
mysql> grant replication slave on *.* to 'account'@'192.168.15.216' identified by 'password';
```

## master配置`my.cnf`

```
vi /etc/
在[mysqld]加上：
 server-id=216
#同步二进制文件，包含需要同步的数据 
 log-bin=mysql-bin  
#需要同步的数据库  
 binlog-do-db=mc_project
```

## slave 配置

```
vi /etc/my.cnf
 增加：
 server-id=54
#master的IP 
 master-host=192.168.15.216
 master-user=mc
 master-password=mingchao
#master的my.cnf上的端口 
 master-port=3306
 master-connect-retry=60
``` 

## 清空日志文件

主从库开启二进制日志文件

![binlog](/images/201606/binlog.png)

注意的是，如果不想清空日志文件的话，需要记录当前master的log_file和log_pos，并在下面启用复制操作时指定这两个参数或者在slave的配置文件指定。

```
change master to
master_host='192.168.15.216',master_user='mc',master_password='mingchao',master_port=3306,master_log_file='mysql-bin.000001',master_log_pos=202;
```

分别停掉从机和主机的mysql服务(先从后主)，先启动从机mysql服务，再启动主机mysql服务

## 查看状态

```
show master status\G;      #主服务器 192.168.15.216
show slave status\G;       #从服务器 192.168.15.54
```

![slave status](/images/201606/slave_status.png)

备注：

Slave_IO_State：等待 master 发生事件

Master_Host：当前的主服务器主机 

Master_User：被用于连接主服务器的当前用户

Master_Port：当前的主服务器接口 

Connect_Retry：master-connect-retry选项的当前值 

Master_Log_File：SLAVE中的I/O线程当前正在读取的主服务器二进制日志文件的名称 

Read_Master_Log_Pos：在当前的主服务器二进制日志中，SLAVE中的I/O线程已经读取的位置

Relay_Log_File：SQL线程当前正在读取和执行的中继日志文件的名称 

Relay_Log_Pos：在当前的中继日志中，SQL线程已读取和执行的位置 

Relay_Master_Log_File：由SQL线程执行的包含多数近期事件的主服务器二进制日志文件的名称

Slave_IO_Running：I/O线程是否被启动并成功地连接到主服务器上 

Slave_SQL_Running：SQL线程是否被启动

Replicate_Do_DB：replicate-do-db选项的当前值 

Replicate_Ignore_DB：replicate-ignore-db选项的当前值 

Replicate_Do_Table：replicate-do-table选项的当前值

Replicate_Ignore_Table：replicate-ignore-table选项的当前值

Replicate_Wild_Do_Table：replicate-wild-do-table选项的当前值 

Replicate_Wild_Ignore_Table：replicate-wild-ignore_table选项的当前值

Last_Errno：最近一次错误码 

Last_Error：最近一次错误内容 

Skip_Counter：最近被使用的用于SQL_SLAVE_SKIP_COUNTER的值 

Exec_Master_Log_Pos：来自主服务器的二进制日志的由SQL线程执行的上一个时间的位置（Relay_Master_Log_File）。在主服务器的二进制日志中的(Relay_Master_Log_File,Exec_Master_Log_Pos)对应于在中继日志中的(Relay_Log_File,Relay_Log_Pos) 

Relay_Log_Space：所有原有的中继日志结合起来的总大小 

Until_Condition：如果没有指定UNTIL子句，则没有值。如果从属服务器正在读取，直到达到主服务器的二进制日志的给定位置为止，则值为Master。如果从属服务器正在读取，直到达到其中继日志的给定位置为止，则值为Relay 

Until_Log_File：用于指示日志文件名，日志文件名和位置值定义了SQL线程在哪个点中止执行

Until_Log_Pos：用于指示日志位置值，日志文件名和位置值定义了SQL线程在哪个点中止执行

Master_SSL_Allowed：如果允许对主服务器进行SSL连接，则值为Yes。如果不允许对主服务器进行SSL连接，则值为No。如果允许SSL连接，但是从属服务器没有让SSL支持被启用，则值为Ignored。

Master_SSL_CA_File：master-ca选项的当前值 

Master_SSL_CA_Path：master-capath选项的当前值

Master_SSL_Cert：master-cert选项的当前值

Master_SSL_Cipher：master-cipher选项的当前值

Master_SSL_Key：master-key选项的当前值

Seconds_Behind_Master：本字段是从属服务器“落后”多少的一个指示。

```
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
则表明主从配置成功！
```

需要注意的是，默认情况下，会同步该用户下所有的DB，如果想限定哪些DB，有3种思路
在master上的/etc/my.inf中通过参数binlog-do-db、binlog-ignore-db设置需要同步的数据库。
在执行grant分配权限操作的时候，限定数据库
在slave上限定数据库使用replicate-do-db=dbname

## 测试

在主机上登录数据库，插入数据到同步数据库mc_project中

在从机上登录数据库，查看同步数据库mc_project，可以看到刚才在主机上插入的数据。