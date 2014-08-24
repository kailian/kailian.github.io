---
layout: post
category : 算法
title: '经纬度的计算'
tagline: ""
tags : [经纬度]
---

> 原理

地球赤道上环绕地球一周走一圈共 `40075.04公里`， 而一圈分成`360°`，而每`1°`（度）有`60'`， 每一度`40075.04km/360°=111.31955km`。

由于经线全部等长所以差一纬度就差111千米。

而经度间的的距离也都是相等的，只不过经度越接近于两极地区经线间的距离就越近，所以经线每度间的距离是自赤道由每度111千米向两极点逐渐递减。

故向差一经度距离为`111 * 当地纬度数的余弦值 * 1`（这个1就是跨了1度的经线）即`111 * cos纬度数`

<!--break-->

> 利用经度，纬度计算两地距离

![经纬度计算公式](/images/201408/lanlung20140824.jpg)

对上面的公式解释如下：

1.Lat1 Lung1 表示A点经纬度，Lat2 Lung2 表示B点经纬度；

2.a = Lat1 – Lat2 为两点纬度之差  b = Lung1 -Lung2 为两点经度之差；

3.6378.137为地球半径，单位为千米；

计算出来的结果单位为千米。

```php
function fn_rad($d) { 
	return $d * pi() / 180.0;
}

// 2点间计算
function P2PDistance($lng1, $lat1, $lng2, $lat2) {
	// 纬度1,经度1 ~ 纬度2,经度2
	$EARTH_RADIUS = 6378.137;
	$a =  fn_rad($lat1) -  fn_rad($lat2);
	$b = fn_rad($lng1) - fn_rad($lng2);
	$s = 2 * asin(sqrt(pow(sin($a/2),2) + cos($radLat1)*cos($radLat2)*pow(sin($b/2),2)));
	$s = $s * $EARTH_RADIUS;
	var_dump(number_format($s,5));
	$s = round($s * 10000) / 10000;
	var_dump(number_format($s,5));
	return number_format($s,2);
}
```

[百度地图API](http://developer.baidu.com/map/carapi-6.htm)

