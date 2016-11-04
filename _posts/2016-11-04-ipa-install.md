---
layout: post
category : iOS
title: '在线安装ipa'
tagline: ""
tags : [iOS]
---

## itms-services

itms-service是apple为iOS企业用户提供的无线分发安装方式所使用的协议，使用这种方式发布应用不需要通过App Store

<!--break-->

## nginx配置https证书

购买或者自己生成，请参考网上教程

## nginx配置mime type

```
application/octet-stream ipa
text/xml plist
```

> 下载ipa的url必须是https的，plist的链接必须是https的

## plist

编辑或者通过打包脚本自动生成app.plist

简单的plist配置

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
   <key>items</key>
   <array>
       <dict>
           <key>assets</key>
           <array>
               <dict>
                   <key>kind</key>
                   <string>software-package</string>
                   <key>url</key>
                   <string>https://下载的域名/下载的ipa.ipa</string>
               </dict> 
           </array>
           <key>metadata</key>
           <dict>
               <key>bundle-identifier</key>
               <string>（app唯一识别标志，不同会被识别为不同app）</string>
               <key>bundle-version</key>
               <string>0.0.0.1（替换为版本号）</string>
               <key>kind</key>
               <string>software</string>
               <key>subtitle</key>
               <string>应用名称</string>
               <key>title</key>
               <string>应用名称</string>
           </dict>
       </dict>
   </array>
</dict>
</plist>
```

## 生成二维码或者网页链接

```
itms-services://?action=download-manifest&url=https://xxx.com/app.plist
```

```
<a href="itms-services://?action=download-manifest&url=https://xxx.com/app.plist" id="text">安装 app</a>  

```

## 测试

iPhone5s，iPhone6，iPhone6s均可通过扫描二维码的itms-services直接安装ipa