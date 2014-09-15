---
layout: post
category : 数据库
title: 'Mysql5.1参考手册摘录06'
tagline: ""
tags : [数据库, Mysql]
---

## 第7章：优化

### 7.1. 优化概述

> 使一个系统更快的最重要因素当然是**基本设计**。此外，还需要知道系统正做什么样的事情，以及瓶颈是什么。

常见的系统瓶颈是：

- 磁盘搜索。优化是将数据分布在多个磁盘上。

- 磁盘读/写。优化是从多个磁盘并行地读。

- CPU周期。

- 内存带宽。当CPU需要的数据超出CPU缓存时，主缓存带宽就成为内存的一个瓶颈。

<!--break-->

#### 7.1.1. MySQL设计局限与折衷

为了更容易地让**非事务表**顺利工作(如果出现问题不能回滚)，MySQL采用下述规则。请注意这些规则只适用于不运行在严格模式下或为INSERT或UPDATE使用IGNORE规定程序时。

- **所有列有默认值**。请注意当运行在严格SQL模式(包括TRADITIONAL SQL模式)时，必须为NOT NULL列指定默认值。

- 如果向列内插入不合适的或超出范围的值，MySQL将该列设定为**最好的可能的值**，而不是报告错误。对于数字值，为0、可能的最小值或最大值。对于字符串，为空字符串或列内可以保存的字符串。

- 所有表达式的计算结果返回一个表示错误状况的信号。例如，1/0返回NULL。

最安全的(通常是最快的)方法径是让应**用程序确保只向数据库传递合法值**。

#### 7.1.2. 为可移植性设计应用程序

#### 7.1.3. 我们已将MySQL用在何处？

### 7.2. 优化SELECT语句和其它查询

> 影响所有语句的一个因素是：你的许可设置得越复杂，所需要的开销越多。

**执行GRANT语句时使用简单的许可**，当客户执行语句时，可以使MySQL降低许可检查开销。

例如，如果未授予任何表级或列级权限，服务器不需要检查tables_priv和columns_priv表的内容。

如果查询量很高，可以花一些时间**使用简化的授权结构来降低许可检查开销**。

如果你的问题是与具体MySQL表达式或函数有关，可以使用mysql客户程序所带的BENCHMARK()函数执行定时测试。

	mysql> SELECT BENCHMARK(1000000,1+1);
	+------------------------+
	| BENCHMARK(1000000,1+1) |
	+------------------------+
	|                      0 |
	+------------------------+
	1 row in set (0.32 sec)

#### 7.2.1. EXPLAIN语法（获取SELECT相关信息）

	EXPLAIN tbl_name
	EXPLAIN [EXTENDED] SELECT select_options

EXPLAIN语句可以用作DESCRIBE的一个同义词，或获得关于MySQL如何执行SELECT语句的信息：

- EXPLAIN tbl_name是DESCRIBE tbl_name或SHOW COLUMNS FROM tbl_name的一个同义词。

- **如果在SELECT语句前放上关键词EXPLAIN，MySQL将解释它如何处理SELECT，提供有关表如何联接和联接的次序**。

借助于EXPLAIN，可以知道什么时候必须为表加入索引以得到一个使用索引来寻找记录的更快的SELECT。

EXPLAIN为用于SELECT语句中的**每个表返回一行信息**。表以它们**在处理查询过程中将被MySQL读入的顺序被列出**。

	mysql> explain select * from wzd_ask;
	+----+-------------+---------+------+---------------+------+---------+------+------+-------+
	| id | select_type | table   | type | possible_keys | key  | key_len | ref  | rows | Extra |
	+----+-------------+---------+------+---------------+------+---------+------+------+-------+
	|  1 | SIMPLE      | wzd_ask | ALL  | NULL          | NULL | NULL    | NULL |   11 |       |
	+----+-------------+---------+------+---------------+------+---------+------+------+-------+
	1 row in set (0.00 sec)

具体字段的含义见[手册](http://dev.mysql.com/doc/refman/5.1/zh/optimization.html#explain)。

MySQL用一遍扫描多次联接（single-sweep multi-join）的方式解决所有联接。这意味着MySQL从第一个表中读一行，然后找到在第二个表中的一个匹配行，然后在第3个表中等等。当所有的表处理完后，它输出选中的列并且返回表清单直到找到一个有更多的匹配行的表。从该表读入下一行并继续处理下一个表。

一张表有什么索引

	SHOW INDEX FROM tbl_name

**key列显示MySQL实际决定使用的键（索引）**。如果没有选择索引，键是NULL。

下列例子显示出一个多表JOIN如何能使用EXPLAIN提供的信息逐步被优化。

假定你有下面所示的SELECT语句，计划使用EXPLAIN来检查它：

	EXPLAIN SELECT tt.TicketNumber, tt.TimeIn,
	           tt.ProjectReference, tt.EstimatedShipDate,
	           tt.ActualShipDate, tt.ClientID,
	           tt.ServiceCodes, tt.RepetitiveID,
	           tt.CurrentProcess, tt.CurrentDPPerson,
	           tt.RecordVolume, tt.DPPrinted, et.COUNTRY,
	           et_1.COUNTRY, do.CUSTNAME
	    FROM tt, et, et AS et_1, do
	    WHERE tt.SubmitTime IS NULL
	      AND tt.ActualPC = et.EMPLOYID
	      AND tt.AssignedPC = et_1.EMPLOYID
	      AND tt.ClientID = do.CUSTNMBR;

列声明：

表  |  列         |  列类型
--- |  ---        |  ---
tt  |  ActualPC   |  CHAR(10)
tt  |  AssignedPC |  CHAR(10)
tt  |  ClientID   |  CHAR(10)
et  |  EMPLOYID   |  CHAR(15)
do  |  CUSTNMBR   |  CHAR(15) 

索引：

表  |  索引
--- |  --- 
tt  |  ActualPC
tt  |  AssignedPC
tt  |  ClientID
et  |  EMPLOYID(主键)
do  |  CUSTNMBR(主键)

在进行优化前，EXPLAIN语句产生下列信息：

	table type possible_keys key  key_len ref  rows  Extra
	et    ALL  PRIMARY       NULL NULL    NULL 74
	do    ALL  PRIMARY       NULL NULL    NULL 2135
	et_1  ALL  PRIMARY       NULL NULL    NULL 74
	tt    ALL  AssignedPC,   NULL NULL    NULL 3872
	           ClientID,
	           ActualPC
	      range checked for each record (key map: 35)

type对每张表是ALL，这个**输出显示MySQL正在对所有表产生一个笛卡尔乘积**；即每一个行的组合！这将花相当长的时间，因为**必须检查每张表的行数的乘积**！对于一个实例，这是74 * 2135 * 74 * 3872 = 45,268,558,720行。如果表更大，你只能想象它将花多长时间……

**MySQL能更高效地在声明具有相同类型和尺寸的列上使用索引。**在本文中，VARCHAR和CHAR是相同的，除非它们声明为不同的长度。

为了修正在列长度上的不同，使用**ALTER TABLE将ActualPC的长度从10个字符变为15个字符**：

	mysql> ALTER TABLE tt MODIFY ActualPC VARCHAR(15);

执行EXPLAIN语句产生这个结果：	

	table type   possible_keys key     key_len ref         rows    Extra
	tt    ALL    AssignedPC,   NULL    NULL    NULL        3872    Using
	             ClientID,                                         where
	             ActualPC
	do    ALL    PRIMARY       NULL    NULL    NULL        2135
	      range checked for each record (key map: 1)
	et_1  ALL    PRIMARY       NULL    NULL    NULL        74
	      range checked for each record (key map: 1)
	et    eq_ref PRIMARY       PRIMARY 15      tt.ActualPC 1

rows值的乘积少了一个因子74。

	mysql> ALTER TABLE tt MODIFY AssignedPC VARCHAR(15),
	    ->                MODIFY ClientID   VARCHAR(15);

EXPLAIN产生的输出显示在下面：

	table type   possible_keys key      key_len ref           rows Extra
	et    ALL    PRIMARY       NULL     NULL    NULL          74
	tt    ref    AssignedPC,   ActualPC 15      et.EMPLOYID   52   Using
	             ClientID,                                         where
	             ActualPC
	et_1  eq_ref PRIMARY       PRIMARY  15      tt.AssignedPC 1
	do    eq_ref PRIMARY       PRIMARY  15      tt.ClientID   1	

剩下的问题是，默认情况，MySQL假设在tt.ActualPC列的值是均匀分布的，并且对tt表不是这样。幸好，很容易告诉MySQL来分析关键字分布：

	mysql> ANALYZE TABLE tt；

EXPLAIN产生这个结果：

	table type   possible_keys key     key_len ref           rows Extra
	tt    ALL    AssignedPC    NULL    NULL    NULL          3872 Using
	             ClientID,                                        where
	             ActualPC
	et    eq_ref PRIMARY       PRIMARY 15      tt.ActualPC   1
	et_1  eq_ref PRIMARY       PRIMARY 15      tt.AssignedPC 1
	do    eq_ref PRIMARY       PRIMARY 15      tt.ClientID   1

#### 7.2.2. 估计查询性能

#### 7.2.3. SELECT查询的速度

> 要想使一个较慢速SELECT ... WHERE更快，应首先检查是否能增加一个索引。不同表之间的引用通常通过索引来完成。

**使用EXPLAIN语句来确定SELECT语句使用哪些索引。**

#### 7.2.4. MySQL怎样优化WHERE子句