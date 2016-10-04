---
layout: post
category : web
title: '微信小程序 quick-start'
tagline: ""
tags : [web]
---

## quick start

### 添加项目

新版本的IDE(0.9.092300)已经不需要破解了，选择无AppID，有两个API功能受限，不影响功能开发

```
调用 wx.login 是受限的, API 的返回是工具的模拟返回
调用 wx.operateWXData 是受限的, API 的返回是工具的模拟返回
```

<!--break-->

选择无AppID、勾选quick start

![project-start](/images/201610/project-start.png)

项目目录结构

```
├── app.js
├── app.json
├── app.wxss
├── pages
│   ├── index
│   │   ├── index.js
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── logs
│       ├── logs.js
│       ├── logs.json
│       ├── logs.wxml
│       └── logs.wxss
└── utils
    └── util.js
```

```
.wxml的是页面
.js后缀的是脚本文件
.json后缀的文件是配置文件
.wxss后缀的是样式表文件
```

### 调试查看程序效果

![quick-start](/images/201610/quick-start.png)

## 注册程序

### app生命周期

```
App({
  onLaunch: function() { 
    // Do something initial when launch.
  },
  onShow: function() {
      // Do something when show.
  },
  onHide: function() {
      // Do something when hide.
  },
  globalData: 'I am global data'
})

//全局的 getApp() 函数，可以获取到小程序实例
var appInstance = getApp()
console.log(appInstance.globalData) 
```

## 注册页面

### page生命周期

```
Page({
  data: {
    text: "This is page data."
  },
  onLoad: function(options) {
    // Do some initialize when page load.
  },
  onReady: function() {
    // Do something when page ready.
  },
  onShow: function() {
    // Do something when page show.
  },
  onHide: function() {
    // Do something when page hide.
  },
  onUnload: function() {
    // Do something when page close.
  },
  onPullDownRefresh: function() {
    // Do something when pull down
  },
  // Event handler.
  viewTap: function() {
    this.setData({
      text: 'Set some data for updating view.'
    })
  }
})
```

### 数据绑定

data初始化数据，通过 WXML 对数据进行绑定

```
Page({
  data: {
    text: 'init data'
  }
})
<view>{ {text} }</view>
```

代码需要将{ { .. } }的空格去掉

需要通过setData()的方法修改data的值

1. 直接修改 this.data 无效，无法改变页面的状态，还会造成数据不一致

2. 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据

```
<view>{ {text} }</view>
<button bindtap="changeText"> Change normal data </button>
<view>{ {array[0].text} }</view>
<button bindtap="changeItemInArray"> Change Array data </button>
<view>{ {obj.text} }</view>
<button bindtap="changeItemInObject"> Change Object data </button>
<view>{ {newField.text} }</view>
<button bindtap="addNewField"> Add new data </button>

Page({
  data: {
    text: 'init data',
    array: [{text: 'init data'}],
    object: {
      text: 'init data'
    }
  },
  changeText: function() {
    // this.data.text = 'changed data'  // bad, it can not work
    this.setData({
      text: 'changed data'
    })
  },
  changeItemInArray: function() {
    // you can use this way to modify a danamic data path
    this.setData({
      'array[0].text':'changed data'
    })
  },
  changeItemInObject: function(){
    this.setData({
      'object.text': 'changed data'
    });
  },
  addNewField: function() {
    this.setData({
      'newField.text': 'new data'
    })
  }
})
```

### 事件绑定

```
<view bindtap="viewTap"> click me </view>
Page({
  viewTap: function() {
    console.log('view tap')
  }
})
```

## 页面的路由

| 路由方式 | 触发时机 | 路由后页面 | 路由前页面 |
|========|=========|===========|==========|
| 初始化 | 小程序打开的第一个页面 | onLoad，onShow | 
| 打开新页面 | 调用 API wx.navigateTo 或使用组件 <navigator /> | onLoad，onShow | onHide|
| 页面重定向 | 调用 API wx.redirectTo 或使用组件 <navigator /> | onLoad，onShow | onUnload|
| 页面返回 | 调用 API wx.navigateBack或用户按左上角返回按钮 | onShow | onUnload
| Tab切换 | 多 Tab 模式下用户切换 Tab | 第一次打开 onLoad，onshow；否则 onShow | onHide|

## 模块化

exports对外暴露接口，require引入

```
// common.js
function sayHello(name) {
  console.log('Hello ' + name + '!')
}
module.exports = {
  sayHello: sayHello
}

var common = require('common.js')
Page({
  helloMINA: function() {
    common.sayHello('MINA')
  }
})
```

## 视图

框架的视图层由 WXML 与 WXSS 编写，由组件来进行展示

virtual-dom

视图的数据绑定写法类似angularjs1.x，但没有双向绑定的特性，其他的类似ng-if/ng-hide/ng-repeat/ng-template/ng-click

### 数据绑定

```
<view> { { message } } </view>
```

### 条件渲染

```
<view wx:if="{ {length > 5} }"> 1 </view>
<view wx:elif="{ {length > 2} }"> 2 </view>
<view wx:else> 3 </view>
```

### 列表渲染

```
<view wx:for="{ {array} }" wx:for-index="idx" wx:for-item="itemName">
  { {idx} }: { {itemName.message} }
</view>
```

### 模板

```
<template name="msgItem">
  <view>
    <text> { {index} }: { {msg} } </text>
    <text> Time: { {time} } </text>
  </view>
</template>
<template is="msgItem" data="{ {...item} }"/>
```

### 事件

```
<view id="tapTest" data-hi="MINA" bindtap="tapName"> Click me! </view>
Page({
  tapName: function(event) {
    console.log(event)
  }
})
```

### 引用

WXML 提供两种文件引用方式import和include

```
<template name="item">
  <text>{ {text} }</text>
</template>

<import src="item.wxml"/>
<template is="item" data="{ {text: 'forbar'} }"/>


<include src="header.wxml"/>
<view> body </view>
<include src="footer.wxml"/>
```

## WXSS

扩展特性

1. 尺寸单位

2. 样式导入

rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。规定屏幕宽为750rpx。如在 iPhone6 上，屏幕宽度为375px，共有750个物理像素，则750rpx = 375px = 750物理像素，1rpx = 0.5px = 1物理像素。

## 其他

1. 组件和API详见[官方开发文档](https://mp.weixin.qq.com/debug/wxadoc/dev/)

2. 页面的脚本逻辑在是在JsCore中运行，JsCore是一个没有窗口对象的环境

3. 一个应用同时只能打开5个页面

## 资料

[官方开发文档](https://mp.weixin.qq.com/debug/wxadoc/dev/)

[微信小程序开发资源汇总](https://github.com/justjavac/awesome-wechat-weapp)