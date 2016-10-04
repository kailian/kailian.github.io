---
layout: post
category : web
title: '微信web开发者工具'
tagline: ""
tags : [web]
---

## 微信web开发者工具

微信开发者工具是用[node-webkit](https://github.com/nwjs/nw.js)，基于node.js和chromium的应用程序实时运行环境开发的。界面功能用React编写，wxml、wxss经过编译生成html和css。微信小程序提供UI组件库和底层API，基于微信生态，目测只支持在微信上运行。

<!--break-->

查看开发工具源代码

```
cd /Applications/wechatwebdevtools.app/Contents/Resources/app.nw

├── app
├── modified_modules
├── node_modules
└── package.json

cd /Applications/wechatwebdevtools.app/Contents/Resources/app.nw/app/dist

├── app.js
├── common
├── actions // 动作
├── stores // 数据层
├── components //组件
├── dispatcher // 派发器
├── config // 配置
├── contentscript
├── cssStr // react中使用css的封装
├── debugger
├── editor
├── extensions // chrome 开发者工具扩展
├── inject
├── lib // 第三方库
├── utils
└── weapp
```

查看package.json

```
{
    "main":"app/html/index.html",
    "name":"微信web开发者工具",
    "appname":"wechatwebdevtools",
    "version":"0.9.092300",
    "window":{
        "title":"微信web开发者工具 v0.9.092300",
        "icon":"app/images/icon.png",
        "toolbar":true,
        "width":600,
        "height":480,
        "frame":true
    },
    "inject_js_start":"app/dist/inject/jweixindebug.js",
    "inject_js_end":"app/dist/inject/devtools.js",
    "chromium-args":"-ignore-certificate-errors -load-extension=/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/app/dist/extensions/",
    "node-remote":"http://*.appservice.open.weixin.qq.com/*",
    "webview":{
        "partitions":[
            {
                "name":"trusted",
                "accessible_resources":["<all_urls>"]
            },
            {
                "name":"devtools",
                "accessible_resources":["<all_urls>"]
            }
        ]
    }
}
```

应用程序打开的是`app/html/index.html`，加载了`../dist/app.js`

跳转到ContainController.js

```
require("./lunch/lunch.js"), //登录
require("./Create/create.js"), //创建项目
require("./main.js"), //主界面
```

### lib目录

第三方库

编辑器是用[monaco-editor](https://microsoft.github.io/monaco-editor/)

react+flux

### webapp目录

```
├── appservice
├── commit
├── newquick //quick-start 的示例代码
├── onlinevendor
├── tpl //page 页面的模板
├── trans //wxml、wxss的转换方法
├── utils
├── vendor
└── weApp.js
```

weApp.js

调用trans替换，正则匹配对应的file是否存在，添加到tpl/appserviceTpl.js

commit

```
├── build.js
├── getallwxss.js
├── initAppConfig.js
├── initAppServiceJs.js
├── pack.js
├── unpack.js
└── upload.js //打包上传
```

build会调用trans的方法进行转换，

上传的配置stores/projectStores.js

projectStores.Setting.MaxCodeSize，限制上传大小为5M

trans

```
├── transManager.js
├── transConfigToPf.js
├── transWxmlToHtml.js
├── transWxmlToJs.js
└── transWxssToCss.js
```

1、transManager 

require其他4个js，返回最后替换的结果getResponse

2、transConfigToPf

Pf 是指 pageFrame，2、transConfigToPf 替换或删除模板 tpl/pageFrameTpl.js 里面的注释

```
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <link href="https://res.wx.qq.com/mpres/htmledition/images/favicon218877.ico" rel="Shortcut Icon">
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
  <script>
    var __webviewId__;
  </script>
  <!-- percodes -->
  <!--{ {WAWebview} }-->
  <!--{ {reportSDK} }-->
  <!--{ {webviewSDK} }-->
  <!--{ {exparser} }-->
  <!--{ {components_js} }-->
  <!--{ {virtual_dom} }-->
  <!--{ {components_css} }-->
  <!--{ {allWXML} }-->
  <!--{ {eruda} }-->
  <!--{ {style} }-->
  <!--{ {currentstyle} }-->
  <!--{ {generateFunc} }-->
  </head>
<body>
  <div></div>
  </body>
</html>
```

3、transWxmlToHtml、transWxmlToJs、transWxssToCss判断page目录下是否存在对应的文件，存在就执行转换方法，transConfigToPf中用对应文件链接替换掉对应的注释标签。

转换wxml中的自定义tag为virtual_dom

![virtual-dom](/images/201610/virtual-dom.png)

转换wxss为css