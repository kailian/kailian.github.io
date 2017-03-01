---
layout: post
category : web
title: 'service worker'
tagline: ""
tags : [web]
---

## Service Worker 是什么？

service worker 是独立于当前页面的一段运行在浏览器后台进程里的脚本。

service worker不需要用户打开 web 页面，也不需要其他交互，异步地运行在一个完全独立的上下文环境，不会对主线程造成阻塞。基于service worker可以实现消息推送，静默更新以及地理围栏等服务。

service worker提供一种渐进增强的特性，使用特性检测来渐渐增强，不会在老旧的不支持 service workers 的浏览器中产生影响。可以通过service workers解决让应用程序能够离线工作，让存储数据在离线时使用的问题。

<!--break-->

注意事项：

1.service worker运行在它们自己的完全独立异步的全局上下文中，也就是说它们有自己的容器。

2.service worker没有直接操作DOM的权限，但是可以通过postMessage方法来与Web页面通信，让页面操作DOM。

3.service worker是一个可编程的网络代理，允许开发者控制页面上处理的网络请求。

4.浏览器可能随时回收service worker，在不被使用的时候，它会自己终止，而当它再次被用到的时候，会被重新激活。

5.service worker的生命周期是由事件驱动的而不是通过Client。

### Service Worker生命周期

service worker拥有一个完全独立于Web页面的生命周期

![sw-lifecycle.png](/images/201703/sw-lifecycle.png)

1. 注册service worker，在网页上生效

2. 安装成功，激活 或者 安装失败（下次加载会尝试重新安装）

3. 激活后，在sw的作用域下作用所有的页面，首次控制sw不会生效，下次加载页面才会生效。

4. sw作用页面后，处理fetch（网络请求）和message（页面消息）事件 或者 被终止（节省内存）。

### Service Worker支持使用

#### 浏览器支持

[service worker support](https://jakearchibald.github.io/isserviceworkerready/)

![navigator-serviceworker.png](/images/201703/navigator-serviceworker.png)

#### polyfill

使用[ServiceWorker cache polyfill](https://github.com/dominiccooney/cache-polyfill)让旧版本浏览器支持 ServiceWorker cache API，

#### https

Server需要支持https

通过service worker可以劫持连接，伪造和过滤响应，为了避免这些问题，只能在HTTPS的网页上注册service workers，防止加载service worker的时候不被坏人篡改。

Github Pages是HTTPS的，可以通过Github做一些尝试

### 调试工具

在调试的时候可以用于unregister、stop、start等操作

chrome访问`chrome://inspect/#service-workers`或`chrome://serviceworker-internals`查看service-workers

![chrome-tool-1.png](/images/201703/chrome-tool-1.png)

![chrome-tool-2.png](/images/201703/chrome-tool-2.png)

firefox通过`about:debugging#workers`查看

![firefox-tool.png](/images/201703/firefox-tool.png)

更多请参考[debugging-service-workers](https://developers.google.com/web/fundamentals/getting-started/codelabs/debugging-service-workers/)

## 离线存储数据

对URL寻址资源，使用[Cache API](https://davidwalsh.name/cache)。对其他数据，使用IndexedDB。

## 离线阅读

### demo

使用[https](https://2017/02/27/pwa)访问本文，打开ChromeDevTools，选择Application选项卡->Service Workers

![sw-devtools.png](/images/201703/sw-devtools.png)

可以看到Service Workers注册

点击下面离线保存按钮

<button class="btn btn-sm btn-primary offline-btn">离线保存</button>

然后选择Cache Storage，可以看到文字内容已经缓存到Cache Storage

![sw-cache.png](/images/201703/sw-cache.png)

然后选择Service Workers 勾选 Offline，NetWork出现了⚠️️，然后试试离线访问本文😎

![sw-offline.png](/images/201703/sw-offline.png)

### 原理

#### 注册 service worker

创建一个 JavaScript 文件（比如：sw.js）作为 service worker

告诉浏览器注册这个JavaScript文件为service worker，检查service worker API是否可用，如果可用就注册service worker

```
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}
```

sw.js文件被放在这个域的根目录下，和网站同源。这个service work将会收到这个域下的所有fetch事件。

如果将service worker文件注册为/example/sw.js，那么，service worker只能收到/example/路径下的fetch事件（例如： /example/page1/, /example/page2/）。

#### 缓存站点的资源

定义需要缓存的文件，然后在sw注册安装后回到cache Api将资源文件写入缓存。如果所有的文件都被缓存成功了，那么service worker就安装成功了。如果任何一个文件下载失败，那么安装步骤就会失败。

```
var cacheName = 'v1';
var assetsToCache = [
  '/styles/main.css',
  '/script/main.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(assetsToCache);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});
```

#### 从缓存中加载

service worker成功注册，并且用户浏览了另一个页面或者刷新了当前的页面，service worker将开始接收到fetch事件。

拦截网络请求并使用缓存，缓存命中，返回缓存资源，否则返回一个实时从网络请求fetch的结果。

```
self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === '/') {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(function() {
            return cache.match(event.request);
          });
        })
      );
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
```

#### 缓存版本管理

版本修改的时候会触发activate，将旧版本的缓存清理掉。

```
var OFFLINE_PREFIX = 'offline-';
var CACHE_NAME = 'main_v1.0.0';
self.addEventListener('activate', function(event) {
  var mainCache = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if ( mainCache.indexOf(cacheName) === -1 && cacheName.indexOf(OFFLINE_PREFIX) === -1 ) {
            // When it doesn't match any condition, delete it.
            console.info('SW: deleting ' + cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
```

## Service Worker 库

- [sw-toolbox](https://github.com/GoogleChrome/sw-toolbox)

- [sw-precache](https://github.com/GoogleChrome/sw-precache)

- [offline-plugin](https://github.com/NekR/offline-plugin)，webpack离线插件

## 参考

- [your-first-pwapp](https://developers.google.com/web/fundamentals/getting-started/codelabs/your-first-pwapp/)

- [service-workers](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)

- [渐进式 Web App 的离线存储](https://segmentfault.com/a/1190000006640450)

<script src="/assets/themes/twitter/js/offline-sw.js"></script>