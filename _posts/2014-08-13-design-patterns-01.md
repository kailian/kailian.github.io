---
layout: post
category : 设计模式
title: '创建型模式'
tagline: ""
tags : [设计模式, 创建型模式]
---

* auto-gen TOC:
{:toc}

## 创建型模式

ABFPS（AbstractFactory、Builder、Factory Method、Prototype、Singleton）

## 单例模式（Singleton）

> 确保一个类只有一个实例，而且自行实例化并向整个系统提供这个实例

> 通过阻止外部实例化和修改，来控制所创建的对象的数量。

### 目的：

> 希望对象只创建一个实例，并且提供一个全局的访问点。

<!--break-->

1.私有构造函数 - 其他类不能实例化一个新的对象。

2.私有化引用 - 不能进行外部修改。

3.公有静态方法是唯一可以获得对象的方式。

### 懒汉模式

> 调用取得实例方法的时候才会实例化对象

### PHP示例

    class Singleton {
        private static $instance = null;

        public static function getInstance() {
            if ( ! (self::$instance ) ) {
                self::$instance = new self();
            }  
            return self::$instance;
        }

        //空构造函数  
        private function __construct() {  

        }

        //空克隆成员函数
        private function __clone() {

        }

        public function test() {
            echo "test";
        } 
    }
    Singleton::getInstance()->test();


### 饿汉模式

> 加载类的时候会连带着创建实例

PHP中不支持饿汉式的单例模式

因为PHP不支持在类定义时给类的成员变量赋予非基本类型的值。如表达式，new操作等等

### java示例

    public class Singleton {
        private Singleton(){}
        private static Singleton instance = new Singleton();
        public static Singleton getInstance() {
    　　　　return instance;
        }
    }

## 工厂模式（Factory Method）

> 定义一个用于创建对象的接口，让子类决定实例化哪一个类

- 通过工厂模式，将产品的实例化封装起来

- 调用者只关心产品的接口就可以了，至于具体的实现，调用者根本无需关心

- 降低耦合度


### 代码示例

    interface IProduct {  
        public function productMethod();  
    }  

    class Product implements IProduct {  
        public function productMethod() {  
            echo("产品");  
        }  
    }  

    interface IFactory {  
        public function createProduct();  
    }  

    class Factory implements IFactory {  
        public function createProduct() {  
            return new Product();  
        }  
    }

    class Client {  
        public static function main() {  
            $factory = new Factory();  
            $prodect = $factory->createProduct();  
            $prodect->productMethod();  
        }  
    }
    Client::main();


### 组装汽车

不使用工厂模式

    class Engine {  
        public function getStyle(){  
            echo("这是汽车的发动机");  
        }  
    }  
    class Underpan {  
        public function getStyle(){  
            echo("这是汽车的底盘");  
        }  
    }  
    class Wheel {  
        public function getStyle(){  
            echo("这是汽车的轮胎");  
        }  
    }
    class Car {
        function __construct( $underpan, $wheel, $engine ) {
            $this->underpan = $underpan;
            $this->wheel = $wheel;
            $this->engine = $engine;
        }

        public function show() {
            $this->underpan->getStyle();
            $this->wheel->getStyle();
            $this->engine->getStyle();
        }   
    }
    class Client {  
        public static function main() {  
            $engine = new Engine();  
            $underpan = new Underpan();  
            $wheel = new Wheel();  
            $car = new Car($underpan, $wheel, $engine);  
            $car->show();  
        }  
    } 

    Client::main();

### 工厂模式

    class Engine {  
        public function getStyle(){  
            echo("这是汽车的发动机");  
        }  
    }

    class Underpan {  
        public function getStyle(){  
            echo("这是汽车的底盘");  
        }  
    } 

    class Wheel {  
        public function getStyle(){  
            echo("这是汽车的轮胎");  
        }  
    }

    class Car {
        function __construct( $underpan, $wheel, $engine ) {
            $this->underpan = $underpan;
            $this->wheel = $wheel;
            $this->engine = $engine;
        }

        public function show() {
            $this->underpan->getStyle();
            $this->wheel->getStyle();
            $this->engine->getStyle();
        }   
    }

    interface IFactory {  
        public function createCar();  
    }

    class Factory implements IFactory {  
        public function createCar() {  
            $engine = new Engine();  
            $underpan = new Underpan();  
            $wheel = new Wheel();  
            $car = new Car($underpan, $wheel, $engine);  
            return $car;  
        }  
    }

    class Client {  
        public static function main() {  
            $factory = new Factory();  
            $car = $factory->createCar();  
            $car->show();  
        }  
    }
    Client::main();


### angular的工厂调用

    angular.module('myModule', []).  
      config(['depProvider', function(depProvider){  
        ...  
      }]).  
      factory('serviceId', ['depService', function(depService) {  
        ...  
      }]).  
      directive('directiveName', ['depService', function(depService) {  
        ...  
      }]).  
      filter('filterName', ['depService', function(depService) {  
        ...  
      }]).  
      run(['depService', function(depService) {  
        ...  
      }]);  


## 抽象工厂模式（AbstractFactory）

> 为创建一组相关或相互依赖的对象提供一个接口，而且无需指定他们的具体类

抽象工厂模式是在工厂模式的基础上增加的一层抽象概念。如果比较抽象工厂模式和工厂模式，我们不难发现前者只是增加了一层抽象的概念。抽象工厂是一个父类工厂，可以创建其它工厂类。故我们也叫它“工厂的工厂”。


    interface CPU {
        function process();
    }  

    interface CPUFactory {
        function produceCPU();
    } 

    class AMDFactory implements CPUFactory {
        public function produceCPU() {
            return new AMDCPU();
        }
    }

    class IntelFactory implements CPUFactory {
        public function produceCPU() {
            return new IntelCPU();
        }
    } 

    class AMDCPU implements CPU {
        public function process() {
            print_r("AMD is processing...");
        }
    } 

    class IntelCPU implements CPU {
        public function process() {
            print_r("Intel is processing...");
        }
    } 

    //创建工厂的工厂
    class Computer {
        private $cpu;

        function __construct($factory) { 
            $this->factory = $factory;
            $this->Computer();
        }
     
        public function Computer() {
            $this->cpu = $this->factory->produceCPU();
            $this->cpu->process();
        }
    } 

    class Client {
        public static function main() {
            new Computer(self::createSpecificFactory());
        }
     
        public static function createSpecificFactory() {
            $sys = 0;
            if ($sys == 0) 
                return new AMDFactory();
            else
                return new IntelFactory();
        }
    }

    Client::main();


## 创建者模式（Builder）

> 将一个复杂对象的构建和表示分离，使得同样的构建过程可以构建不同的表示。

将构建复杂对象的过程与组成对象的部件解耦。

建造模式使得产品内部表象可以独立的变化，客户不必知道产品内部组成的细节。

- 产品类：一般是一个较为复杂的对象。包含定义组件的类，包括将这些组件装配成产品的接口。

- 抽象建造者：用来规范产品对象各个组成成分的建造。至少会有两个抽象方法，一个用来建造产品，一个是用来返回产品。

- 具体建造者: 实现抽象类的所有未实现的方法，具体来说一般是两项任务：组建产品；返回组建好的产品。

- 指导者：调用具体的建造者创建产品对象。

### 代码示例


    class Product {  
        private $name;  
        private $type;
        public function showProduct() {  
           echo("名称：".$this->name);  
           echo("型号：".$this->type);   
        }
        public function setName( $name ) {    
            $this->name = $name;  
        }
        public function setType( $type ) {
            $this->type = $type;  
        }  
    } 

    abstract class Builder {  
        public abstract function setPart($arg1, $arg2);  
        public abstract function getProduct();  
    } 

    class ConcreteBuilder extends Builder {  
        private $product;

        function __construct() { 
            $this->product = new Product();
        } 
          
        public function getProduct() {  
            return $this->product;  
        }  
      
        public function setPart($arg1, $arg2) { 
            $this->product->setName($arg1);  
            $this->product->setType($arg2);  
        }  
    } 

    class Director {  
        private $builder;
        function __construct() { 
            $this->builder = new ConcreteBuilder();
        }  
        public function getAProduct(){  
            $this->builder->setPart("宝马汽车","X7");  
            return $this->builder->getProduct();  
        }  
        public function getBProduct(){  
            $this->builder->setPart("奥迪汽车","Q5");  
            return $this->builder->getProduct();  
        }  
    }

    class Client { 
        public static function main(){  
            $director = new Director();  
            $product1 = $director->getAProduct();  
            $product1->showProduct();  
      
            $product2 = $director->getBProduct();  
            $product2->showProduct();  
        }  
    }
    Client::main();


### 建造者模式的优点

- 建造者模式的封装性很好。

- 建造者模式很容易进行扩展，新的需求，通过实现一个新的建造者类就可以完成


### 建造者模式与工厂模式的区别

把指导者类看做是最终调用的客户端，那么剩余的部分就可以看作是一个简单的工厂模式

创建模式着重于逐步将组件装配成一个成品并向外提供，而抽象工厂模式着重于得到产品族中相关的多个产品对象。


## 原型模式（Prototype）

> 用原型实例指定创建对象的种类，并通过拷贝这些原型创建新的对象。

原型模式主要用于对象的复制，它的核心是就是原型类Prototype。

实现Cloneable接口。实现了此接口的类上使用copy方法。


    interface Cloneable {
      function copy();
    }

    class Prototype implements Cloneable {
        public function copy(){    
            return clone $this;

            /**
             * 深拷贝
             */
            /*
            $serialize_obj = serialize($this);  //序列化
            $clone_obj = unserialize($serialize_obj);   //反序列化
            return $clone_obj; */
        }  
    }  
      
    class ConcretePrototype extends Prototype{  
        public function show(){  
            echo("原型模式实现类");  
        }  
    }  
      
    class Client {  
        public static function main(){  
            $cp = new ConcretePrototype();  
            for($i=0; $i< 10; $i++){  
                $clonecp = $cp->copy();  
                $cp->show();  
            }  
        }  
    }

    Client::main();

### 原型模式的优点

- 使用原型模式创建对象比直接new一个对象在性能上要好的多，因为Object类的clone方法是一个本地方法，它直接操作内存中的二进制流，特别是复制大对象时，性能的差别非常明显。

- 简化对象的创建

使用原型模式复制对象不会调用类的构造方法。因为对象的复制是通过调用Object类的clone方法来完成的，它直接在内存中复制数据，因此不会调用到类的构造方法。不但构造方法中的代码不会执行，甚至连访问权限都对原型模式无效。

单例模式与原型模式是冲突的。