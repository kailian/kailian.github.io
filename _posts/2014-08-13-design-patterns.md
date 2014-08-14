---
layout: post
category : 设计模式
title: '设计模式六大原则'
tagline: ""
tags : [设计模式]
---

1.单一职责原则（Single Responsibility Principle）

2.里氏替换原则（Liskov Substitution Principle）

3.依赖倒置原则（Dependence Inversion Principle）

4.接口隔离原则（Interface Segregation Principle）

5.迪米特法则（Law Of Demeter）

6.开闭原则（Open Close Principle）

<!--break-->

### 单一职责原则

> 一个类只负责一项职责

- 可以降低类的复杂度，一个类只负责一项职责，其逻辑肯定要比负责多项职责简单的多；
- 提高类的可读性，提高系统的可维护性；
- 变更引起的风险降低，变更是必然的，如果单一职责原则遵守的好，当修改一个功能时，可以显著降低对其他功能的影响。

### 里氏替换原则

> 所有引用基类的地方必须能透明地使用其子类的对象
> 只要父类出现的地方，子类都可以出现。而且替换为子类也不会发生任何异常或错误，使用者根本不需要知道是子类还是父类。
> 子类可以扩展父类的功能，但不能改变父类原有的功能

父类中凡是已经实现好的方法（相对于抽象方法而言），实际上是在设定一系列的规范和契约，虽然它不强制要求所有的子类必须遵从这些契约，但是如果子类对这些非抽象方法任意修改，就会对整个继承体系造成破坏。

除添加新的方法完成新增功能外，尽量不要重写父类的方法，也尽量不要重载父类的方法。

### 依赖倒置原则

> 高层模块不应该依赖低层模块，二者都应该依赖其抽象；抽象不应该依赖细节；细节应该依赖抽象。

相对于细节的多变性，抽象的东西要稳定的多。以抽象为基础搭建起来的架构比以细节为基础搭建起来的架构要稳定的多。

依赖倒置原则的核心思想是面向接口编程。模块间的依赖通过抽象发生的，实现类之间不发生直接的关系，其依赖通过接口或者抽象类发生

面向接口编程比相对于面向实现编程好在什么地方

优点：减少类间的耦合性

实现：

1.构造函数：建立类的时候，通过构造函数的方法给类中的接口赋值

（分页类通过构造函数传入路径和分页总数、单页数量，返回分页的渲染代码）

2.SET方法：在类中，增加一个public的SET的方法，调用SET方法是，进行赋值

3.接口方法：调用方法参数中，有一个参数是接口


    interface IReader{  
        public String getContent();  
    }

    class Newspaper implements IReader {  
        public String getContent(){  
            return "林书豪17+9助尼克斯击败老鹰……";  
        }  
    }  
    class Book implements IReader{  
        public String getContent(){  
            return "很久很久以前有一个阿拉伯的故事……";  
        }  
    }  
      
    class Mother{  
        public void narrate(IReader reader){  
            System.out.println("妈妈开始讲故事");  
            System.out.println(reader.getContent());  
        }  
    }  
      
    public class Client{  
        public static void main(String[] args){  
            Mother mother = new Mother();  
            mother.narrate(new Book());  
            mother.narrate(new Newspaper());  
        }  
    } 


### 接口隔离原则

> 客户端不应该依赖它不需要的接口（需要什么接口就提供什么接口）

> 类间的依赖关系应该建立在最小的接口上（接口细化）

> 建立单一接口

1．接口要尽量小

2.尽量少的公布public方法

3.要求接口只提供访问者需要的方法。（其它的一律private）

### 迪米特原则（最小知识原则）

> 一个对象应该对其他对象保持最少的了解。

> 迪米特法则的核心就是类间解耦，弱耦合

过分的使用迪米特原则，会产生大量这样的中介和传递类，导致系统复杂度变大。所以在采用迪米特法则时要反复权衡，既做到结构清晰，又要高内聚低耦合。

### 开闭原则

> 一个软件实体如类，模块和函数应该对扩展开放，对修改关闭

> 开闭原则要求尽量通过扩展软件实体的方法来适应变化，而不是通过修改已有的代码来完成变化

用抽象构建框架，用实现扩展细节