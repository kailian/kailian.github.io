---
layout: post
category : 计算机网络
title: '计算机网络实验'
tagline: ""
tags : [tcp, 计算机网络]
---

以前的计算机网络实验，各种协议的简单组合。

> 网络设计要求：

- 两台交换机S0、S1的fa0/24端口均是通过交叉双绞线相连，形成VLAN中继;

- R1、R2、R3，设置动态路由RIP；配置2个节点的帧中继环境配置帧中继实现网络互连；

- 配置静态NAT ，实现地址转换；

- 设置相关静态路由，使网络连通。

<!--break-->

> 实验设备

- Cisco2610XM 6台

- Cisco Catalyst2950-24 Switch 4台

- 帧中继交换机1台  

- 带网卡及装有超级终端的计算机8台

- 服务器2台 

- DCE/DTE线7条，交叉双绞线2条，直通双绞线12条

> 实验拓扑图

![实验拓扑图](/images/201408/network20140831.png)

> 网络设备地址列表

设备名称	| 网络地址
------------| --------
R1	        | Fa0/0 210.40.1.1/24 <br/>S0/0 210.10.1.1/24 <br/>S0/1 210.10.2.1/24 S0/2 218.10.1.1/24
R2	        | S0/0 210.10.1.2/24 <br/>S0/1 210.10.2.1/24 <br/>S0/2 210.20.1.1/24
R3	        | S0/0 210.10.2.2/24 <br/>S0/1 210.10.3.2/24 <br/>S0/2 210.30.1.1/24
R4	        | Fa0/0 210.50.1.1/24 <br/>S0/0 218.10.1.2/24
R5	        | Fa0/0 210.20.2.1/24 <br/>S0/0  210.20.1.2/24
R6	        | Fa0/0 192.168.1.1/24<br/> S0/0  210.30.1.2/24
PC0	        | 192.168.1.11/24
PC1	        | 192.168.1.12/24
PC2	        | 192.168.1.13/24
PC3	        | 210.20.2.11/24
PC4	        | 210.40.1.11/24
PC5	        | 210.40.1.21/24
PC6	        | 210.40.1.12/24
PC7	        | 210.40.1.12/24
Server0	    | 210.50.1.11/24
Server1	    | 192.168.1.2/24

> 配置过程

- 配置VLAN

- 配置路由器R1的各端口IP，并配置动态路由RIP协议

- 配置路由器R2的各端口IP，并配置动态路由RIP协议

- 配置路由器R3的各端口IP，并配置动态路由RIP协议

- 配置路由器R4、5、6的各端口IP，并配置静态路由

- 配置帧中继

- 配置静态NAT映射关系

> 网络设备配置

VLAN配置

S0：

	hostname S0> 
	interface FastEthernet0/1
	 switchport access vlan 10
	interface FastEthernet0/10
	 switchport access vlan 20
	interface FastEthernet0/23
	interface FastEthernet0/24
	 switchport mode trunk
	interface Vlan1
	 no ip address
	line con 0
	line vty 0 4
	 login
	line vty 5 15
	 login

S1:

	hostname S1
	interface FastEthernet0/1
	 switchport access vlan 10
	 switchport mode access
	interface FastEthernet0/2
	 switchport access vlan 10
	 switchport mode access
	!interface FastEthernet0/10
	 switchport access vlan 20
	interface FastEthernet0/11
	 switchport access vlan 20
	interface FastEthernet0/23
	interface FastEthernet0/24
	 switchport mode trunk
	interface Vlan1
	 no ip address
	 shutdown
	line con 0
	line vty 0 4
	 login
	line vty 5 15
	 login

RIP动态路由，帧中继，静态路由配置

R1:

	hostname R1
	interface FastEthernet0/0
	 ip address 210.40.1.1 255.255.255.0
	 duplex auto
	 speed auto
	interface Serial0/0
	 bandwidth 500
	 ip address 210.10.1.1 255.255.255.0
	 clock rate 64000
	interface Serial0/1
	 bandwidth 500
	 ip address 210.10.2.1 255.255.255.0
	 clock rate 64000
	interface Serial0/2
	 ip address 218.10.1.1 255.255.255.0
	 encapsulation frame-relay
	 frame-relay map ip 218.10.1.1 201 cisco
	 clock rate 64000
	router rip
	 network 210.10.1.0
	 network 210.10.2.0
	 network 210.10.3.0
	 network 210.40.1.0
	 no auto-summary
	ip classless
	ip route 210.20.2.0 255.255.255.0 210.20.1.1 
	ip route 210.50.1.0 255.255.255.0 218.10.1.2 
	no cdp run
	line con 0
	line vty 0 4
	 login

R2:

	hostname R2
	interface FastEthernet0/0
	 no ip address
	 duplex auto
	 speed auto
	 shutdown
	interface Serial0/0
	 bandwidth 500
	 ip address 210.10.1.2 255.255.255.0
	interface Serial0/1
	 bandwidth 500
	 ip address 210.10.3.1 255.255.255.0
	interface Serial0/2
	 ip address 210.20.1.1 255.255.255.0
	router rip
	 network 210.10.1.0
	 network 210.10.3.0
	 network 210.20.1.0
	ip classless
	ip route 210.20.2.0 255.255.255.0 210.20.1.2 
	ip route 210.50.1.0 255.255.255.0 210.10.1.1 
	line con 0
	line vty 0 4
	 login

R3:

	hostname R3
	interface Loopback0
	 no ip address
	interface FastEthernet0/0
	 no ip address
	 duplex auto
	 speed auto
	 shutdown
	interface Serial0/0
	 bandwidth 500
	 ip address 210.10.2.2 255.255.255.0
	interface Serial0/1
	 bandwidth 500
	 ip address 210.10.3.2 255.255.255.0
	 clock rate 64000
	interface Serial0/2
	 bandwidth 500
	 ip address 210.30.1.1 255.255.255.0
	 clock rate 64000
	router rip
	 network 210.10.2.0
	 network 210.10.3.0
	 network 210.30.1.0
	ip classless
	ip route 210.20.2.0 255.255.255.0 210.20.1.1 
	ip route 210.50.1.0 255.255.255.0 210.10.2.1
	line con 0
	line vty 0 4
	 login

R4

	hostname R4
	interface FastEthernet0/0
	 ip address 210.50.1.1 255.255.255.0
	 duplex auto
	 speed auto
	interface Serial0/0
	 ip address 218.10.1.2 255.255.255.0
	 encapsulation frame-relay
	 frame-relay map ip 218.10.1.2 102 cisco
	 clock rate 64000
	interface Serial0/1
	 no ip address
	 shutdown
	router rip
	ip classless
	ip route 0.0.0.0 0.0.0.0 218.10.1.1 
	no cdp run
	line con 0
	line vty 0 4
	 login

R5:

	hostname R5
	interface FastEthernet0/0
	 ip address 210.20.2.1 255.255.255.0
	 duplex auto
	 speed auto
	interface Serial0/0
	 ip address 210.20.1.2 255.255.255.0
	 clock rate 64000
	interface Serial0/1
	 no ip address
	 shutdown
	router rip
	ip classless
	ip route 0.0.0.0 0.0.0.0 210.20.1.1 
	no cdp run
	line con 0
	line vty 0 4
	 login

配置静态NAT

R6:

	hostname R6
	interface FastEthernet0/0
	 ip address 192.168.1.1 255.255.255.0
	 ip nat inside
	 duplex auto
	 speed auto
	interface Serial0/0
	 ip address 210.30.1.2 255.255.255.0
	 ip nat outside
	interface Serial0/1
	 no ip address
	 shutdown
	ip nat inside source static 192.168.1.11 210.30.1.11 
	ip nat inside source static 192.168.1.12 210.30.1.12 
	ip nat inside source static 192.168.1.13 210.30.1.13 
	ip classless
	ip route 210.20.2.0 255.255.255.0 210.30.1.1 
	ip route 0.0.0.0 0.0.0.0 210.30.1.1 
	line con 0
	line vty 0 4
	 login

> 结果测试

![实验结果](/images/201408/network120140831.png)

![实验结果](/images/201408/network220140831.png)

![实验结果](/images/201408/network320140831.png)

PC0、PC3、SERVER0均可两两ping通，帧中继，RIP，静态NAT配置成功

![实验结果](/images/201408/network420140831.png)

![实验结果](/images/201408/network520140831.png)

对VLAN10、VLAN20进行测试，连通，VLAN配置成功
