---
layout: post
category : web
title: 'php慢日志'
tagline: ""
tags : [web,php]
---

## php开启慢日志

修改`php-fpm.conf`

```
; - 'slowlog'
; The log file for slow requests
; Note: slowlog is mandatory if request_slowlog_timeout is set
slowlog = /var/logs/php/$pool.log.slow
; dumped to the 'slowlog' file. A value of '0s' means 'off'.
request_slowlog_timeout = 1
```

<!--break-->

## 日志说明

script_filename 是入口文件，执行方法超过执行时间 调用路径

```
[21-Sep-2016 14:49:34]  [pool www] pid 22263
script_filename = /data/web/public/index.php
[0x00007fe3d8a9c070] fastcgi_finish_request() /data/web/bootstrap/cache/compiled.php:16014
[0x00007fe3d8a9bf40] send() /data/web/public/index.php:56
```

## 分析慢日志脚本

```
#!/bin/bash

usage() {
    echo "Usage: $0 --log=<LOG>"
}

eval set -- $(
    getopt -q -o "h" -l "context:,log:,help" -- "$@"
)

while true; do
    case "$1" in
        --context) CONTEXT=$2; shift 2;;
        --log)     LOG=$2;     shift 2;;
        -h|--help) usage;      exit 0;;
        --)                    break;;
    esac
done

if [[ -z "$LOG" ]]; then
    usage
    exit 1
fi

C=${CONTEXT:-5}

awk '
    $1 ~ "0x" && $3 ~ "/" { files[$3]++ }
    END {
        for (file in files) {
            print files[file], file | "sort -nr"
        }
    }
' $LOG | while IFS=" " read count data; do
    IFS=":" data=($data)

    file=${data[0]}
    line=${data[1]}

    echo FILE: $file [COUNT: $count]
    cat -n $file | grep -P -C $C --color=always "^\s*$line\t.*"
    echo
done
```

```
sh slow.sh --log www.log.slow
```

[脚本来源](http://huoding.com/2014/11/14/388)