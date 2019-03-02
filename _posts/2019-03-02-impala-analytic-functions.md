---
layout: post
category : 大数据
title: 'impala分析函数'
tagline: ""
tags : [大数据]
---

## impala 分析函数

impala_analytic_functions

[文档](https://www.cloudera.com/documentation/enterprise/5-8-x/topics/impala_analytic_functions.html)

## 临时表

作用：重复使用到不必重复查询，简化语句复杂度，方便查看

<!--break-->

```
WITH table_name AS (SELECT 1 id, 2 num UNION SELECT 2,2)
SELECT * FROM table_name

%% 取每个账号的第一个创角记录作为临时表
WITH role_unique AS (
  SELECT
    *
  FROM
    (
      SELECT
        role_id,
        create_time,
        row_number() over(
          PARTITION BY 
          account_name
          ORDER BY
            create_time asc
        ) AS row_num
      FROM
        t_log_role_create
    ) role_create
  where
    row_num = 1
)
```

## 分析函数

```
function(args) OVER([partition_by_clause] [order_by_clause [window_clause]])
```

- FUNCTION 子句
- PARTITION 子句
- ORDER BY 子句
- WINDOWING 子句

## PARTITION

类型GROUP BY，分组

## ORDER BY

排序

## 窗口条件

```
ROWS BETWEEN [ { m | UNBOUNDED } PRECEDING | CURRENT ROW] [ AND [CURRENT ROW | { UNBOUNDED | n } FOLLOWING] ]
RANGE BETWEEN [ {m | UNBOUNDED } PRECEDING | CURRENT ROW] [ AND [CURRENT ROW | { UNBOUNDED | n } FOLLOWING] ]
```

关于ROWS和RANGE的区别

- ROWS 每一行元素都视为新的计算行，即每一行都是一个新的窗口
- RANGE 具有相同值的所有元素行视为同一计算行，即具有相同值的所有行都是同一个窗口

```
Query:

with num_table AS (SELECT 1 id, 1 num UNION SELECT 2,2 UNION SELECT 3,3 UNION SELECT 4,6 UNION SELECT 5,4 UNION SELECT 6,5 UNION SELECT 7,5 UNION SELECT 8,4) SELECT num,sum(num) over (ORDER BY num asc rows between unbounded preceding and current row) as total FROM num_table;

+-----+-------+
| num | total |
+-----+-------+
| 1   | 1     |
| 2   | 3     |
| 3   | 6     |
| 4   | 10    |
| 4   | 14    |
| 5   | 19    |
| 5   | 24    |
| 6   | 30    |

Query:
with num_table AS (SELECT 1 id, 1 num UNION SELECT 2,2 UNION SELECT 3,3 UNION SELECT 4,6 UNION SELECT 5,4 UNION SELECT 6,5 UNION SELECT 7,5 UNION SELECT 8,4) SELECT num,sum(num) over (ORDER BY num asc range between unbounded preceding and current row) as total FROM num_table;

+-----+-------+
| num | total |
+-----+-------+
| 1   | 1     |
| 2   | 3     |
| 3   | 6     |
| 4   | 14    |
| 4   | 14    |
| 5   | 24    |
| 5   | 24    |
| 6   | 30    |
```

## Row_Number，Rank，Dense_Rank

- Row_Number，整数的升序顺序，从1开始，逐行加1
- Rank，整数的升序顺序，从1开始，重复值生成重复整数，重复后按值的数量增加序列
- Dense_Rank，整数的升序顺序，从1开始，重复值生成重复整数，重复后按值的数值增加序列

使用：

1. 获取最新数据
2. 获取topN数据

```
WITH create_table AS (
    SELECT '2018-10-01' create_date, 'account1' account_name UNION ALL
    SELECT '2018-10-02', 'account2' UNION ALL
    SELECT '2018-10-03', 'account3' UNION ALL
    SELECT '2018-10-04', 'account3' UNION ALL
    SELECT '2018-10-05', 'account2' UNION ALL
    SELECT '2018-10-06', 'account4' UNION ALL
    SELECT '2018-10-07', 'account5'
)
SELECT
  create_date,
  account_name,
  row_number() over(
    order by
      account_name
  ) row_num,
  rank() over (
    order by
      account_name
  ) rank_id,
  dense_rank() over (
    order by
      account_name
  ) dense_id
from
  create_table
order by
  account_name;
```

```
+-------------+--------------+---------+---------+----------+
| create_date | account_name | row_num | rank_id | dense_id |
+-------------+--------------+---------+---------+----------+
| 2018-10-01  | account1     | 1       | 1       | 1        |
| 2018-10-02  | account2     | 2       | 2       | 2        |
| 2018-10-05  | account2     | 3       | 2       | 2        |
| 2018-10-03  | account3     | 4       | 4       | 3        |
| 2018-10-04  | account3     | 5       | 4       | 3        |
| 2018-10-06  | account4     | 6       | 6       | 4        |
| 2018-10-07  | account5     | 7       | 7       | 5        |
```

## LAG，LEAD

- LAG(col, n, DEFAULT) 用于统计窗口内往上第n行值
- LEAD(col, n, DEFAULT) 用于统计窗口内往下第n行值, 与LAG相反

```
WITH pay_date AS (
    SELECT '2018-10-01' dt, 5000 pay UNION ALL
    SELECT '2018-10-02', 6000 UNION ALL
    SELECT '2018-10-03', 7000 UNION ALL
    SELECT '2018-10-04', 8000 UNION ALL
    SELECT '2018-10-05', 9000 UNION ALL
    SELECT '2018-10-06', 10000 UNION ALL
    SELECT '2018-10-07', 11000
)
SELECT
  dt,
  lag(pay, 1) over (
    order by
      dt
  ) as pre_day,
  pay,
  lead(pay, 1) over (
    order by
      dt
  ) as next_day,
  avg(pay) over (order by dt
    rows between 1 preceding and 1 following) as pay_average
FROM
  pay_date order by dt;
```

前一日，当天，后一天，三天平均值（可根据需要调整窗口）

```
+------------+---------+-------+----------+-------------+
| dt         | pre_day | pay   | next_day | pay_average |
+------------+---------+-------+----------+-------------+
| 2018-10-01 | NULL    | 5000  | 6000     | 5500        |
| 2018-10-02 | 5000    | 6000  | 7000     | 6000        |
| 2018-10-03 | 6000    | 7000  | 8000     | 7000        |
| 2018-10-04 | 7000    | 8000  | 9000     | 8000        |
| 2018-10-05 | 8000    | 9000  | 10000    | 9000        |
| 2018-10-06 | 9000    | 10000 | 11000    | 10000       |
| 2018-10-07 | 10000   | 11000 | NULL     | 10500       |
```

```
WITH pay_date AS (
  SELECT
    FROM_UNIXTIME(pay_time, 'yyyy-MM-dd') AS dt,
    sum(pay_money) as pay
  FROM
    t_log_pay
  WHERE
    pay_time between 1538323200
    AND 1538927999
  GROUP BY
    dt
)
SELECT
  dt,
  lag(pay, 1) over (
    order by
      dt
  ) as pre_day,
  pay,
  lead(pay, 1) over (
    order by
      dt
  ) as next_day,
  avg(pay) over (order by dt
    rows between 1 preceding and 1 following) as pay_average
FROM
  pay_date order by dt;
```

## FIRST_VALUE，LAST_VALUE

- FIRST_VALUE 取分组内排序后，截止到当前行，第一个值
- LAST_VALUE 取分组内排序后，截止到当前行，最后一个值
- FIRST_VALUE(DESC) 获得组内全局的最后一个值

```
with test_table AS (
    SELECT 1 id, 'test1' test UNION ALL
    SELECT 2, 'test1' UNION ALL
    SELECT 3, 'test1' UNION ALL
    SELECT 4, 'test2' UNION ALL
    SELECT 5, 'test2' UNION ALL
    SELECT 6, 'test2'
) SELECT id,
test,
 first_value(id)
OVER (
PARTITION BY test
ORDER BY id RANGE UNBOUNDED preceding
) as first_val,
last_value(id)
OVER (
PARTITION BY test
ORDER BY id desc RANGE UNBOUNDED preceding
) as last_val,
first_value(id)
OVER (
PARTITION BY test
ORDER BY id desc RANGE UNBOUNDED preceding
) as first_desc
from test_table order by id;
```

```
+----+-------+-----------+----------+------------+
| id | test  | first_val | last_val | first_desc |
+----+-------+-----------+----------+------------+
| 1  | test1 | 1         | 1        | 3          |
| 2  | test1 | 1         | 2        | 3          |
| 3  | test1 | 1         | 3        | 3          |
| 4  | test2 | 4         | 4        | 6          |
| 5  | test2 | 4         | 5        | 6          |
| 6  | test2 | 4         | 6        | 6          |
```

## 使用示例

CREATE TABLE t_log_role_create (
    account_name STRING COMMENT '账号',
    create_time INT COMMENT '注册时间'
) COMMENT '玩家注册表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS TEXTFILE
;

CREATE TABLE t_log_login (
    account_name STRING COMMENT '账号',
    login_time INT COMMENT '登录时间'
) COMMENT '玩家登录表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS TEXTFILE
;

CREATE TABLE t_log_pay (
    account_name STRING COMMENT '账号',
    pay_time INT COMMENT '充值时间',
    pay_money float COMMENT '充值金额'
) COMMENT '玩家充值表'
ROW FORMAT DELIMITED FIELDS TERMINATED BY '\t'
STORED AS TEXTFILE
;

统计留存，用户在某段时间内开始使用游戏，经过一段时间后，仍然继续使用游戏的被认作是留存用户，这部分用户占当日新增用户的比例即是用户留存率

```
WITH role_unique_a AS (
  SELECT
    *
  FROM
    (
      SELECT
        account_name,
        create_time,
        row_number() over(
          PARTITION BY 
          account_name
          ORDER BY
            create_time asc
        ) AS row_num
      FROM
        t_log_role_create
      WHERE
        create_time between 1533657600
        AND 1533743999
    ) role_create
  where
    row_num = 1
)
SELECT
  e.create_date,
  f.day,
  e.account_num,
  f.total,
  (f.total / e.account_num) AS rate
FROM
  (
    SELECT
      COUNT(distinct account_name) AS account_num,
      FROM_UNIXTIME(create_time, 'yyyy-MM-dd') AS create_date
    FROM
      role_unique_a
    group by
      create_date
  ) e
  join (
    SELECT
      COUNT(distinct b.account_name) AS total,
      FROM_UNIXTIME(login_time, 'yyyy-MM-dd') AS day,
      FROM_UNIXTIME(create_time, 'yyyy-MM-dd') AS create_date
    FROM
      t_log_login a
      join role_unique_a b on a.account_name = b.account_name
    where a.login_time > 1533657600
    group by
      day,
      create_date
  ) f on e.create_date = f.create_date
ORDER BY
  create_date,
  day;
```

统计LTV，（Lifetime-Value）：生命周期价值，即平均一个用户在首次登录游戏到最后一次登录游戏内，为该游戏创造的收入总计

```
WITH role_unique_a AS (
  SELECT
    *
  FROM
    (
      SELECT
        account_name,
        create_time,
        row_number() over(
          PARTITION BY upf,
          account_name
          ORDER BY
            create_time asc
        ) AS row_num
      FROM
        t_log_role_create
      where
      create_time between 1533657600
        AND 1533743999
    ) role_create
  where
    row_num = 1
)
SELECT
  e.create_date,
  f.day,
  e.account_num,
  f.total,
  total / account_num as ltv
FROM
  (
    SELECT
      COUNT(distinct account_name) AS account_num,
      FROM_UNIXTIME(create_time, 'yyyy-MM-dd') AS create_date
    FROM
      role_unique_a
    GROUP BY
      create_date
  ) e
  join (
    SELECT
      create_date,
      day,
      sum(pay_money) over (
        partition by create_date
        ORDER BY
          day rows between unbounded preceding
          and current row
      ) as total
    from
      (
        SELECT
          SUM(pay_money) as pay_money,
          FROM_UNIXTIME(pay_time, 'yyyy-MM-dd') AS day,
          FROM_UNIXTIME(b.create_time, 'yyyy-MM-dd') AS create_date
        FROM
          t_log_pay a
          join
           role_unique_a b on a.account_name = b.account_name
        WHERE
          pay_time > 1533657600
        GROUP BY
          day,
          create_date
      ) c
  ) f on e.create_date = f.create_date
ORDER BY
  create_date,
  day;
```
