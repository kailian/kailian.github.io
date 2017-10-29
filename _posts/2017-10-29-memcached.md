---
layout: post
category : web
title: 'memcached相关记录'
tagline: ""
tags : [web]
---

## Memcached

[Memcached官网](http://memcached.org/)

[Memcached wiki](https://github.com/memcached/memcached/wiki)

Memcached 是一个高性能的分布式内存对象缓存系统，通过在内存中缓存数据和对象来减少读取数据库的次数，提高系统访问速度。

1. 用户请求时检查数据是否有存在缓存中，存在返回，不存在读取数据库并存一份数据到缓存
2. 数据变动时（如更新、删除的情况下），重新同步缓存信息

```
Cache Results

function get_foo(foo_id)
    foo = memcached_get("foo:" . foo_id)
    return foo if defined foo

    foo = fetch_foo_from_database(foo_id)
    memcached_set("foo:" . foo_id, foo)
    return foo
end
```

<!--break-->

## 安装

```
brew install memcached
```

启动

```
memcached -d -m 64 -c 4096 -l 127.0.0.1 -p 11210 -u www -t 10
memcached -d -m 256 -c 4096 -l 127.0.0.1 -p 11211 -u www -t 10

-d            run as a daemon
-c <num>      max simultaneous connections (default: 1024)
-m <num>      max memory to use for items in megabytes (default: 64 MB)
-p <num>      TCP port number to listen on (default: 11211)
-u <username> assume identity of <username> (only when run as root)
-t <num>      number of threads to use (default: 4)
```

## 命令行操作

### 连接

```
telnet localhost 11211
quit
```

### 基本命令

```
command <key> <flags> <expiration time> <bytes>
```

- set
- add
- replace
- get
- delete

### 统计信息

stats
stats slabs 显示各个slab的信息，包括chunk的大小、数目、使用情况等
stats items 显示记录信息
stats cachedump slabs_id limit_num 显示memcached记录
stats sizes 命令用于显示所有item的大小和个数

```
stats items
STAT items:1:number 1
STAT items:1:age 198198
STAT items:1:evicted 0
STAT items:1:evicted_nonzero 0
STAT items:1:evicted_time 0
STAT items:1:outofmemory 0
STAT items:1:tailrepairs 0
STAT items:1:reclaimed 0
STAT items:1:expired_unfetched 0
STAT items:1:evicted_unfetched 0
STAT items:1:crawler_reclaimed 0
STAT items:1:crawler_items_checked 0
STAT items:1:lrutail_reflocked 0
STAT items:2:number 7
STAT items:2:age 383946
STAT items:2:evicted 0
STAT items:2:evicted_nonzero 0
STAT items:2:evicted_time 0
STAT items:2:outofmemory 0
STAT items:2:tailrepairs 0
STAT items:2:reclaimed 0
STAT items:2:expired_unfetched 0
STAT items:2:evicted_unfetched 0
STAT items:2:crawler_reclaimed 0
STAT items:2:crawler_items_checked 0
STAT items:2:lrutail_reflocked 0
END
stats cachedump 1 1
ITEM laravel:itemList [6 b; 1509694289 s]
END
```

### 清理所有缓存

```
flush_all
```

## 通过shell操作Memcached命令

```
printf "stats\r\n" | nc 127.0.0.1 11211
printf "set hello 0 0 5\r\nworld\r\n" | nc 127.0.0.1 11211
printf "get hello\r\n" | nc 127.0.0.1 11211
```

