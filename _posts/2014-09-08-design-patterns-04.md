---
layout: post
category : 设计模式
title: '结构型模式'
tagline: ""
tags : [设计模式, 结构型模式]
---

适配器模式、装饰器模式、代理模式、外观模式、桥接模式、组合模式、享元模式

## 适配器模式（Adapter）

> 将一个类的接口转换成客户希望的另外一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

### 适配器模式组成

- 目标角色（Target）：定义Client使用的接口。

- 被适配角色（Adaptee）：角色有一个已存在并使用了的接口，这个接口需要适配。

- 适配器角色（Adapter）：核心，将被适配角色已有的接口转换为目标角色希望的接口。

<!--break-->

### 分类

类适配器模式和对象适配器模式

### 类的适配器模式代码示例

	// 已存在的、具有特殊功能、但不符合我们既有的标准接口的类
	class Adaptee {
	    public function method1() {  
	        echo("this is original method!");  
	    } 
	}

	interface Targetable {    
	    /* 与原类中的方法相同 */  
	    public function method1();  
	  
	    /* 新类的方法 */  
	    public function method2();  
	} 

	class Adapter extends Adaptee implements Targetable {  
	 
	    public function method2() {  
	        echo("this is the targetable method!");  
	    }  
	}

	class Client {
	    public static function main() {  
	        $target = new Adapter();  
	        $target->method1();  
	        $target->method2();  
	    }  
	}     

	Client::main();

### 对象的适配器模式代码示例

	class Adaptee {
	    public function method1() {  
	        echo("this is original method!");  
	    } 
	}

	interface Targetable {    
	    public function method1();
	    public function method2();  
	} 

	class Wrapper implements Targetable {  
	  
	    private $source;  
	      
	    public function Wrapper($source){   
	        $this->source = $source;  
	    }

	    public function method2() {  
	        echo("this is the targetable method!");  
	    }  

	    public function method1() {  
	        $this->source->method1();  
	    }  
	}  

	class Client {    
	    public static function main() {  
	        $source = new Adaptee();  
	        $target = new Wrapper( $source );  
	        $target->method1();
	        $target->method2();
	    }  
	}     

	Client::main(); 

这次不继承Adaptee类，而是持有Adaptee类的实例，输出与第一种一样，只是适配的方法不同而已。

## 装饰器模式

> 动态地给一个对象增加一些新的功能

装饰器模式就是基于对象组合的方式，装饰器模式的本质就是动态组合

### 装饰模式的组成

- 抽象构件角色（Component）：定义一个抽象接口，以规范准备接收附加责任的对象。

- 具体构件角色（Concrete Component）：被装饰者，定义一个将要被装饰增加功能的类。

- 装饰角色（Decorator）：持有一个构件对象的实例，并定义了抽象构件定义的接口。

- 具体装饰角色（Concrete Decorator）：负责给构件添加增加的功能。

### 代码示例

	interface Component {  
	    public function method();  
	}  

	class ConcreteComponent implements Component {  
	    public function method() {  
	        echo("the original method!"."<br>");  
	    }  
	}

	class Decorator implements Component {  
	  
	    private $concreteComponent;  
	      
	    public function Decorator( $concreteComponent ) {   
	        $this->concreteComponent = $concreteComponent;  
	    }  
	 
	    public function method() {  
	        echo("before decorator!"."<br>");  
	        $this->concreteComponent->method();  
	        echo("after decorator!"."<br>");
	    }  
	}    

	class Client {
	    public static function main() {  
	        $concreteComponent = new ConcreteComponent();  
	        $obj = new Decorator( $concreteComponent );  
	        $obj->method();  
	    }  
	}     

	Client::main();

### 场景

- 需要在不影响其他对象的情况下，以动态、透明的方式给对象添加职责。

- 如果不适合使用子类来进行扩展的时候，可以考虑使用装饰器模式。

- 动态的为一个对象增加功能，而且还能动态撤销。（继承不能做到这一点，继承的功能是静态的，不能动态增删。）


## 代理模式（Proxy）

## 外观模式（Facade）

## 桥接模式（Bridge）

## 组合模式（Composite）

## 享元模式（Flyweight）

![设计模式](/images/201409/designpattern20140908.jpg)

