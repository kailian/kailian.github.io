---
layout: post
category : web
title: 'laravel 广播'
tagline: ""
tags : [web]
---

## laravel广播

广播系统的目的是用于实现当服务端完成某种特定功能后向客户端推送消息的功能，比如服务器处理完成某项工作后向客户端发送结果

广播流程图

![laravel-broadcast.png](/images/201904/laravel-broadcast.png)

<!--break-->

## Socket.IO 服务

第三方服务[laravel-echo-server](https://github.com/tlaverdure/laravel-echo-server)

1、全局安装socket

```
npm install -g laravel-echo-server
```

2、配置laravel-echo-server.json

```
laravel-echo-server init
```

配置

```
{
	"authHost": "http://localhost",
	"authEndpoint": "/broadcasting/auth",
	"clients": [
		{
			"appId": "7c4d46b3224252d1",
			"key": "d5facfd856868864f68f8f923f7b2212"
		}
	],
	"database": "redis",
	"databaseConfig": {
		"redis": {
			"port": "6379",
			"host": "127.0.0.1",
			"db": 1
		},
		"sqlite": {
			"databasePath": "/database/laravel-echo-server.sqlite"
		}
	},
	"devMode": true,
	"host": null,
	"port": "6001",
	"protocol": "http",
	"socketio": {},
	"sslCertPath": "",
	"sslKeyPath": "",
	"sslCertChainPath": "",
	"sslPassphrase": "",
	"subscribers": {
		"http": true,
		"redis": true
	},
	"apiOriginAllow": {
		"allowCors": true,
		"allowOrigin": "http://localhost:80",
		"allowMethods": "GET, POST",
		"allowHeaders": "Origin, Content-Type, X-Auth-Token, X-Requested-With, Accept, Authorization, X-CSRF-TOKEN, X-Socket-Id"
	}
}
```

3、启动socket服务

```
laravel-echo-server start
```

订阅方式有Redis、Http、Pusher，laravel事件使用的是Redis。

4、模拟一个post请求发送json

http://localhost:6001/apps/7c4d46b3224252d1/events?auth_key=d5facfd856868864f68f8f923f7b2212

```
{
    "channel": "publish",
    "name": "sendPublish",
    "data": {
        "status": 200,
        "message": "发布成功"
	}
}
```

![laravel-echo-server.png](/images/201904/laravel-echo-server.png)

## laravel广播事件

.env 配置

```
BROADCAST_DRIVER=redis
```

config/app.php的BroadcastServiceProvider的注释去掉，注册广播授权路由和回调

```
App\Providers\BroadcastServiceProvider::class,
```

广播配置config/broadcasting.php

新增一个广播事件

```
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PublishEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $data;
    public $broadcastQueue = 'publish';
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($data = '')
    {
        $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('publish');
    }

    /**
     * 事件的广播名称。
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'sendPublish';
    }

    public function broadcastWith()
    {
        return [
            'data' => $this->data,
            'time' => time()
        ];
    }
}
```

没有定义broadcastAs方法，会获取类名作为事件name

```
$name = method_exists($this->event, 'broadcastAs')
            ? $this->event->broadcastAs() : get_class($this->event);
```

启动事件队列服务，配置public $broadcastQueue = 'publish'; 指定队列

```
php artisan queue:work redis --queue=publish --sleep=3 --timeout=180
```

调用广播事件进行广播

```
$data = [
    'msg' => '发布成功'
];
event(new \App\Events\PublishEvent($data));
```

## 客户端

使用[vue-echo](https://github.com/happyDemon/vue-echo)

main.js

```
import io from 'socket.io-client';
import VueEcho from 'vue-echo';

window.io = io;
Vue.use(VueEcho, {
  broadcaster: 'socket.io',
  host: window.location.hostname + ':6001'
});
```

client.js 在可以监听channel

```
mounted() {
    this.$echo.channel('publish').listen('.sendPublish', (res) => {
        console.log(res);
    });
},
```

在使用 Echo 订阅事件的时候为事件类加上 `.` 前缀。需要填写完全限定名称的类名。

## 参考资料

- [laravel广播文档](https://learnku.com/docs/laravel/5.4/broadcasting/1179)
- [深入浅出 Laravel Echo](https://learnku.com/articles/17327)