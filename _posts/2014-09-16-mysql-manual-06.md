---
layout: post
category : 数据库
title: 'Mysql5.1参考手册摘录07'
tagline: ""
tags : [数据库, Mysql]
---

* auto-gen TOC:
{:toc}

## 第7章：优化01

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

B－树索引进行估计，需要

	log(row_count)/log(index_block_length/3 * 2/(index_length + data_pointer_length))+1

次搜索才能找到行。

在MySQL中，索引块通常是1024个字节，数据指针通常是4个字节，这对于有一个长度为3(中等整数)的索引的500,000行的表，通过公式可以计算出`log(500,000)/log(1024/3*2/(3+4))+1= 4`次搜索。

当表格变得更大时，所有内容缓存到OS或SQL服务器后，将仅仅或多或少地更慢。在数据变得太大不能缓存后，将逐渐变得更慢，直到应用程序只能进行磁盘搜索(以logN增加)。为了避免这个问题，随数据增加而增加 键高速缓冲区大小。对于MyISAM表, 由key_buffer_size系统变量控制高速缓冲区大小。

#### 7.2.3. SELECT查询的速度

> 要想使一个较慢速SELECT ... WHERE更快，应首先检查是否能增加一个索引。不同表之间的引用通常通过索引来完成。

**使用EXPLAIN语句来确定SELECT语句使用哪些索引。**

#### 7.2.4. MySQL怎样优化WHERE子句

去除不必要的括号：

	((a AND b) AND c OR (((a AND b) AND (c AND d))))
	优化 (a AND b AND c) OR (a AND b AND c AND d)

常量重叠：	

	(a<b AND b=c) AND a=5
	优化 b>5 AND b=c AND a=5

去除常量条件(由于常量重叠需要)：

	(B>=5 AND B=5) OR (B=6 AND 5=5) OR (B=7 AND 5=6)
	优化 B=5 OR B=6

MySQL执行的部分优化：

- 索引使用的常数表达式仅计算一次。

- 无效常数表达式的早期检测。MySQL快速检测某些SELECT语句是不可能的并且不返回行。

- 如果不使用GROUP BY或分组函数(COUNT()、MIN()……)，HAVING与WHERE合并。

- 对于联接内的每个表，构造一个更简单的WHERE以便更快地对表进行WHERE计算并且也尽快跳过记录。

- 所有常数的表在查询中比其它表先读出。常数表为：

	- 空表或只有1行的表。

	- 与在一个PRIMARY KEY或UNIQUE索引的WHERE子句一起使用的表，这里所有的索引部分使用常数表达式并且索引部分被定义为NOT NULL。

- 如果有一个ORDER BY子句和不同的GROUP BY子句，或如果ORDER BY或GROUP BY包含联接队列中的第一个表之外的其它表的列，则创建一个临时表。

- 如果使用SQL_SMALL_RESULT，MySQL使用内存中的一个临时表。

- 每个表的索引被查询，并且使用最好的索引，除非优化器认为使用表扫描更有效。

- 输出每个记录前，跳过不匹配HAVING子句的行

**一些快速查询的例子：**

	SELECT COUNT(*) FROM tbl_name;

	SELECT MIN(key_part1),MAX(key_part1) FROM tbl_name;

	SELECT MAX(key_part2) FROM tbl_name WHERE key_part1=constant;

	SELECT ... FROM tbl_name ORDER BY key_part1,key_part2,... LIMIT 10;

	SELECT ... FROM tbl_name ORDER BY key_part1 DESC, key_part2 DESC, ... LIMIT 10;

下列查询仅使用索引树就可以解决(假设索引的列为数值型)：

	SELECT key_part1,key_part2 FROM tbl_name WHERE key_part1=val;

	SELECT COUNT(*) FROM tbl_name WHERE key_part1=val1 AND key_part2=val2;

	SELECT key_part2 FROM tbl_name GROUP BY key_part1;

下列查询使用索引按排序顺序检索行，不用另外的排序：

	SELECT ... FROM tbl_name
	    ORDER BY key_part1,key_part2,... ;
	 
	SELECT ... FROM tbl_name
	    ORDER BY key_part1 DESC, key_part2 DESC, ... ;

#### 7.2.5. 范围优化

7.2.5.1. 单元素索引的范围访问方法

对于单元素索引，可以用WHERE子句中的相应条件很方便地表示索引值区间，因此我们称为范围条件而不是“区间”。

单元素索引范围条件的定义:

- 对于BTREE和HASH索引，当使用=、<=>、IN、IS NULL或者IS NOT NULL操作符时，关键元素与常量值的比较关系对应一个范围条件。

- 对于BTREE索引，当使用>、<、>=、<=、BETWEEN、!=或者<>，或者LIKE 'pattern'(其中 'pattern'不以通配符开始)操作符时，关键元素与常量值的比较关系对应一个范围条件。

- 对于所有类型的索引，多个范围条件结合OR或AND则产生一个范围条件。

一些WHERE子句中有范围条件的查询的例子：

	SELECT * FROM t1 
	    WHERE key_col > 1 
	    AND key_col < 10;
	 
	SELECT * FROM t1 
	    WHERE key_col = 1 
	    OR key_col IN (15,18,20);
	 
	SELECT * FROM t1 
	    WHERE key_col LIKE 'ab%' 
	    OR key_col BETWEEN 'bar' AND 'foo';

MySQL尝试为每个可能的索引从WHERE子句提取范围条件。

MySQL尝试为每个可能的索引从WHERE子句提取范围条件。在提取过程中，不能用于构成范围条件的条件被放弃，产生重叠范围的条件组合到一起，并且产生空范围的条件被删除。

	SELECT * FROM t1 WHERE
	   (key1 < 'abc' AND (key1 LIKE 'abcde%' OR key1 LIKE '%b')) OR
	   (key1 < 'bar' AND nonkey = 4) OR
	   (key1 < 'uux' AND key1 > 'z');

其中key1是有索引的列，nonkey没有索引

删除nonkey = 4和key1 LIKE '%b'，因为它们不能用于范围扫描。删除它们的正确途径是用TRUE替换它们，以便进行范围扫描时不会丢失匹配的记录。

	(key1 < 'abc' AND (key1 LIKE 'abcde%' OR TRUE)) OR
	(key1 < 'bar' AND TRUE) OR
	(key1 < 'uux' AND key1 > 'z')

取消总是为true或false的条件：

	(key1 LIKE 'abcde%' OR TRUE)总是true
	(key1 < 'uux' AND key1 > 'z')总是false

用常量替换这些条件，得到：

	(key1 < 'abc' AND TRUE) OR (key1 < 'bar' AND TRUE) OR (FALSE)

删除不必要的TRUE和FALSE常量，得到

	(key1 < 'abc') OR (key1 < 'bar')

将重叠区间组合成一个产生用于范围扫描的最终条件

	(key1 < 'bar')

用于范围扫描的条件比WHERE子句限制少。MySQL再执行检查以过滤掉满足范围条件但不完全满足WHERE子句的行。

7.2.5.2. 多元素索引的范围访问方法

多元素索引的范围条件是单元素索引的范围条件的扩展。多元素索引的范围条件将索引记录限制到一个或几个关键元组内。使用索引的顺序，通过一系列关键元组来定义关键元组区间。

#### 7.2.6. 索引合并优化

> 索引合并方法用于通过range扫描搜索行并将结果合成一个。合并会产生并集、交集或者正在进行的扫描的交集的并集。

7.2.6.1. 索引合并交集访问算法

7.2.6.2. 索引合并并集访问算法

7.2.6.3. 索引合并排序并集访问算法

