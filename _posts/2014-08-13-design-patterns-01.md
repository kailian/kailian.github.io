---
layout: post
category : 设计模式
title: '创建型模式'
tagline: ""
tags : [设计模式, 创建型模式]
---

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

    public class Singleton {
        private Singleton(){}
        private static Singleton instance = null;
        public static synchronized Singleton getInstance() {
    　　　　if (instance == null) {
    　　　　    instance = new Singleton();
    　　　　}
    　　　　return instance;
        }
    }


### 饿汉模式

> 加载类的时候会连带着创建实例

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


        interface IProduct {  
            public void productMethod();  
        }  
          
        class Product implements IProduct {  
            public void productMethod() {  
                System.out.println("产品");  
            }  
        }  
          
        interface IFactory {  
            public IProduct createProduct();  
        }  
          
        class Factory implements IFactory {  
            public IProduct createProduct() {  
                return new Product();  
            }  
        }  
          
        public class Client {  
            public static void main(String[] args) {  
                IFactory factory = new Factory();  
                IProduct prodect = factory.createProduct();  
                prodect.productMethod();  
            }  
        }

> 组装汽车

不使用工厂模式

        class Engine {  
            public void getStyle(){  
                System.out.println("这是汽车的发动机");  
            }  
        }  
        class Underpan {  
            public void getStyle(){  
                System.out.println("这是汽车的底盘");  
            }  
        }  
        class Wheel {  
            public void getStyle(){  
                System.out.println("这是汽车的轮胎");  
            }  
        }  
        public class Client {  
            public static void main(String[] args) {  
                Engine engine = new Engine();  
                Underpan underpan = new Underpan();  
                Wheel wheel = new Wheel();  
                ICar car = new Car(underpan, wheel, engine);  
                car.show();  
            }  
        } 

工厂模式

        interface IFactory {  
            public ICar createCar();  
        }  
        class Factory implements IFactory {  
            public ICar createCar() {  
                Engine engine = new Engine();  
                Underpan underpan = new Underpan();  
                Wheel wheel = new Wheel();  
                ICar car = new Car(underpan, wheel, engine);  
                return car;  
            }  
        }  
        public class Client {  
            public static void main(String[] args) {  
                IFactory factory = new Factory();  
                ICar car = factory.createCar();  
                car.show();  
            }  
        }

angular的工厂调用

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
> 抽象工厂模式是在工厂模式的基础上增加的一层抽象概念。如果比较抽象工厂模式和工厂模式，我们不难发现前者只是增加了一层抽象的概念。抽象工厂是一个父类工厂，可以创建其它工厂类。故我们也叫它“工厂的工厂”。


    interface CPU {
        void process();
    }
     
    interface CPUFactory {
        CPU produceCPU();
    }
     
    class AMDFactory implements CPUFactory {
        public CPU produceCPU() {
            return new AMDCPU();
        }
    }
     
    class IntelFactory implements CPUFactory {
        public CPU produceCPU() {
            return new IntelCPU();
        }
    }
     
    class AMDCPU implements CPU {
        public void process() {
            System.out.println("AMD is processing...");
        }
    }
     
    class IntelCPU implements CPU {
        public void process() {
            System.out.println("Intel is processing...");
        }
    }
     
    //创建工厂的工厂
    class Computer {
        CPU cpu;
     
        public Computer(CPUFactory factory) {
            cpu = factory.produceCPU();
            cpu.process();
        }
    }
     
    public class Client {
        public static void main(String[] args) {
            new Computer(createSpecificFactory());
        }
     
        public static CPUFactory createSpecificFactory() {
            int sys = 0; // 基于特定要求
            if (sys == 0) 
                return new AMDFactory();
            else
                return new IntelFactory();
        }
    }

## 创建者模式（Builder）

> 将一个复杂对象的构建和表示分离，使得同样的构建过程可以构建不同的表示。


