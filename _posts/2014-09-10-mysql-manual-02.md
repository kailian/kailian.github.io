---
layout: post
category : 数据库
title: 'Mysql5.1参考手册摘录02'
tagline: ""
tags : [数据库, Mysql]
---

* auto-gen TOC:

{:toc}

第2章：安装，并不在想学习的范围内，跳过

## 第3章：教程

查看由mysql提供的选择项目表，可以用--help选项来调用：

	shell> mysql --help

### 连接与断开服务器

连接

	shell> mysql -h host -u user -p
	Enter password: ********

<!--break-->

在mysql>提示下输入QUIT (或\q)随时退出

	mysql> QUIT
	Bye

### 输入查询

	mysql> SELECT VERSION(), CURRENT_DATE;

一个命令通常由SQL语句组成，随后跟着一个分号。

mysql用表格(行和列)方式显示查询输出。第一行包含列的标签，随后的行是查询结果。

mysql显示返回了多少行，以及查询花了多长时间，它给你提供服务器性能的一个大致概念。因为他们表示时钟时间(不是 CPU 或机器时间)，并且因为他们受到诸如服务器负载和网络延时的影响，因此这些值是`不精确的`。

命令不区分大小写。

	mysql> SELECT SIN(PI()/4), (4+1)*5;
	+------------------+---------+
	| SIN(PI()/4)      | (4+1)*5 |
	+------------------+---------+
	| 0.70710678118655 |      25 |
	+------------------+---------+
	1 row in set (0.02 sec)	

在一行上输入多条语句，只需要以一个分号间隔开各语句：

	mysql> SELECT VERSION(); SELECT NOW();	
	+-----------------+
	| VERSION()       |
	+-----------------+
	| 5.1.2-alpha-log |
	+-----------------+
	1 row in set (0.00 sec)
	 
	+---------------------+
	| NOW()               |
	+---------------------+
	| 2005-10-11 15:15:00 |
	+---------------------+
	1 row in set (0.00 sec)

mysql接受自由格式的输入：它收集输入行但直到看见分号才执行。
	
	mysql> SELECT
	    -> USER()
	    -> ,
	    -> CURRENT_DATE;
	+---------------+--------------+
	| USER()        | CURRENT_DATE |
	+---------------+--------------+
	| jon@localhost | 2005-10-11   |
	+---------------+--------------+

如果你决定不想执行正在输入过程中的一个命令，输入\c取消它：

	mysql> SELECT
	    -> USER()
	    -> \c

### 创建并使用数据库

	mysql> SHOW DATABASES;

数据库存在，尝试访问它：

	mysql> USE test
	Database changed

询问MySQL管理员许可你使用自己的一个数据库，防止在该数据库创建的任何东西可以被访问它的其它人删除

	mysql> GRANT ALL ON menagerie.* TO 'your_mysql_name'@'your_client_host';

your_mysql_name是分配给你的MySQL用户名，your_client_host是所连接的服务器所在的主机。

#### 创建并选择数据库

	mysql> CREATE DATABASE menagerie;
	mysql> USE menagerie
	Database changed

数据库名称（表名）是区分大小写的(不像SQL关键字)

在调用mysql时，通过命令行选择数据库，在提供连接参数之后指定数据库名称

	shell> mysql -h host -u user -pmypassword menagerie

	shell> mysql -h host -u user -p menagerie
	Enter password: ********

不建议在命令行输入密码，因为这样会暴露密码，能被在机器上登录的其它用户窥探到。

#### 创建表

	mysql> SHOW TABLES;

建立`pet`表

	mysql> CREATE TABLE pet (name VARCHAR(20), owner VARCHAR(20),
    -> species VARCHAR(20), sex CHAR(1), birth DATE, death DATE);

    mysql> DESCRIBE pet;
    mysql> DESC pet;

#### 将数据装入表中

	mysql> INSERT INTO pet
    -> VALUES ('Puffball','Diane','hamster','f','1999-03-30',NULL);

#### 从表检索信息

	SELECT what_to_select
	FROM which_table
	WHERE conditions_to_satisfy;

选择所有数据

	mysql> SELECT * FROM pet;

选择特殊行

	mysql> SELECT * FROM pet WHERE name = 'Bowser';
	mysql> SELECT * FROM pet WHERE species = 'snake' OR species = 'bird';

AND和OR可以混用，但AND比OR具有更高的优先级。

	mysql> SELECT * FROM pet WHERE (species = 'cat' AND sex = 'm')
    -> OR (species = 'dog' AND sex = 'f');

选择特殊列

	mysql> SELECT name, birth FROM pet;

排序结果，使用ORDER BY子句

	mysql> SELECT name, birth FROM pet ORDER BY birth;

默认排序是`升序`，`最小的值在第一`。要想以降序排序，在你正在排序的列名上增加`DESC（降序 ）`关键字

	mysql> SELECT name, species, birth FROM pet
    -> ORDER BY species, birth DESC;

#### 日期计算

	mysql> SELECT name, birth, CURDATE(),
    -> (YEAR(CURDATE())-YEAR(birth))
    -> - (RIGHT(CURDATE(),5)<RIGHT(birth,5))
    -> AS age
    -> FROM pet ORDER BY name;

YEAR()提取日期的年部分，RIGHT()提取日期的MM-DD (日历年)部分的最右面5个字符。
一般不在mysql中计算。

#### NULL值操作

不能使用算术比较 操作符例如=、<或!=，使用`IS NULL`和`IS NOT NULL`操作符。

	mysql> SELECT 0 IS NULL, 0 IS NOT NULL, '' IS NULL, '' IS NOT NULL;
	+-----------+---------------+------------+----------------+
	| 0 IS NULL | 0 IS NOT NULL | '' IS NULL | '' IS NOT NULL |
	+-----------+---------------+------------+----------------+
	|         0 |             1 |          0 |              1 |
	+-----------+---------------+------------+----------------+

可以在定义为NOT NULL的列内插入0或空字符串，实际是NOT NULL

#### 模式匹配

> SQL模式匹配允许你使用`_`匹配任何单个字符，而`%`匹配任意数目字符(包括零字符)。

以`b`开头的名字

	mysql> SELECT * FROM pet WHERE name LIKE 'b%';

包含`w`的名字

	mysql> SELECT * FROM pet WHERE name LIKE '%w%';

正好包含5个字符的名字，使用`_`模式字符

	mysql> SELECT * FROM pet WHERE name LIKE '_____';

由MySQL提供的模式匹配的其它类型是使用扩展正则表达式。使用REGEXP和NOT REGEXP操作符(或RLIKE和NOT RLIKE，它们是同义词)。

扩展正则表达式的一些字符是：

- `.`匹配任何单个的字符。

- 字符类`[...]`匹配在方括号内的任何字符。例如，`[abc]`匹配`a`、`b`或`c`。为了命名字符的范围，使用一个`-`。`[a-z]`匹配任何字母，而`[0-9]`匹配任何数字。

-  ` * `匹配零个或多个在它前面的字符。例如，`x*`匹配任何数量的`x`字符，`[0-9]*`匹配任何数量的数字，而`.*`匹配任何数量的任何字符。

如果REGEXP模式与被测试值的任何地方匹配，模式就匹配(这不同于LIKE模式匹配，只有与整个值匹配，模式才匹配)。

为了定位一个模式以便它必须匹配被测试值的开始或结尾，在模式开始处使用`^`或在模式的结尾用`$`。

以`b`开头的名字

	mysql> SELECT * FROM pet WHERE name REGEXP '^b';

包含正好5个字符的名字

	mysql> SELECT * FROM pet WHERE name REGEXP '^.{5}$';	

#### 计数行

COUNT(`*`)函数计算行，COUNT( )和GROUP BY以各种方式分类你的数据。

	mysql> SELECT COUNT(*) FROM pet;
	mysql> SELECT sex, COUNT(*) FROM pet GROUP BY sex;

#### 使用1个以上的表

用pet联结自身来进行相似种类的雄雌配对

	mysql> SELECT p1.name, p1.sex, p2.name, p2.sex, p1.species
	    -> FROM pet AS p1, pet AS p2
	    -> WHERE p1.species = p2.species AND p1.sex = 'f' AND p2.sex = 'm';

### 获得数据库和表的信息

找出当前选择了哪个数据库，包含什么表，表的结构

	mysql> SELECT DATABASE();
	mysql> SHOW TABLES;
	mysql> DESCRIBE pet;

#### 在批处理模式下使用mysql

运行的命令放在一个文件中，然后告诉mysql从文件读取它的输入

	shell> mysql < batch-file

在语句出现错误的时候仍想继续执行脚本，则应使用--force命令行选项。

产生多个输出的查询，通过一个分页器而不是盯着它翻屏到屏幕的顶端来运行输出：

	shell> mysql < batch-file | more

捕捉文件中的输出以便进行进一步的处理：

	shell> mysql < batch-file > mysql.out

在批模式中得到交互输出格式，使用mysql -t。为了回显以输出被执行的命令，使用mysql -vvv。

### 常用查询的例子
	mysql> CREATE TABLE shop (
	    -> article INT(4) UNSIGNED ZEROFILL DEFAULT '0000' NOT NULL,
	    -> dealer  CHAR(20)                 DEFAULT ''     NOT NULL,
	    -> price   DOUBLE(16,2)             DEFAULT '0.00' NOT NULL,
	    -> PRIMARY KEY(article, dealer));
	mysql> INSERT INTO shop VALUES
	    -> (1,'A',3.45),(1,'B',3.99),(2,'A',10.99),(3,'B',1.45),
	    -> (3,'C',1.69),(3,'D',1.25),(4,'D',19.95);

#### 列的最大值

	SELECT MAX(article) AS article FROM shop;

#### 拥有某个列的最大值的行

	SELECT article, dealer, price
	FROM   shop
	WHERE  price=(SELECT MAX(price) FROM shop);

	SELECT article, dealer, price
	FROM shop
	ORDER BY price DESC
	LIMIT 1;

#### 列的最大值：按组

	SELECT article, MAX(price) AS price
	FROM   shop
	GROUP BY article

#### 拥有某个字段的组间最大值的行

	SELECT article, dealer, price
	FROM   shop s1
	WHERE  price=(SELECT MAX(s2.price)
	              FROM shop s2
	              WHERE s1.article = s2.article);

#### 使用用户变量

可以清空MySQL用户变量以记录结果，不必将它们保存到客户端的临时变量中。

	mysql> SELECT @min_price:=MIN(price),@max_price:=MAX(price) FROM shop;
	mysql> SELECT * FROM shop WHERE price=@min_price OR price=@max_price;

#### 根据两个键搜索

寻找两个通过OR组合到一起的关键字

	SELECT field1_index, field2_index FROM test_table
	WHERE field1_index = '1' OR  field2_index = '1'

每个SELECT只搜索一个关键字，可以进行优化

	SELECT field1_index, field2_index
	    FROM test_table WHERE field1_index = '1'
	UNION
	SELECT field1_index, field2_index
	    FROM test_table WHERE field2_index = '1';

#### 根据天计算访问量

使用位组函数来计算每个月中用户访问网页的天数。

	CREATE TABLE t1 (year YEAR(4), month INT(2) UNSIGNED ZEROFILL,
	             day INT(2) UNSIGNED ZEROFILL);
	INSERT INTO t1 VALUES(2000,1,1),(2000,1,20),(2000,1,30),(2000,2,2),
	            (2000,2,23),(2000,2,23);
	SELECT year,month,BIT_COUNT(BIT_OR(1<<day)) AS days FROM t1
	       GROUP BY year,month; 
	+------+-------+------+
	| year | month | days |
	+------+-------+------+
	| 2000 |    01 |    3 |
	| 2000 |    02 |    2 |
	+------+-------+------+  

该查询计算了在表中按年/月组合的不同天数，可以自动去除重复的询问。 

#### 使用AUTO_INCREMENT

通过AUTO_INCREMENT属性为新的行产生唯一的标识   

	CREATE TABLE animals (
		id MEDIUMINT NOT NULL AUTO_INCREMENT,
		name CHAR(30) NOT NULL,
		PRIMARY KEY (id)
	);

可以使用LAST_INSERT_ID()SQL函数或mysql_insert_id() C API函数来查询最新的AUTO_INCREMENT值。这些函数与具体连接有关，因此其返回值不会被其它执行插入功能的连接影响。

注释：对于多行插入，LAST_INSERT_ID()和mysql_insert_id()从插入的第一行实际返回AUTO_INCREMENT关键字。



