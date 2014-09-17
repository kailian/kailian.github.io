---
layout: post
category : 设计模式
title: '行为型模式(二)'
tagline: ""
tags : [设计模式, 行为型模式]
---

* auto-gen TOC:

{:toc}

类的状态：备忘录模式、状态模式

通过中间类：访问者模式、中介者模式、解释器模式

## 备忘录模式（Memento）

> 在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态。这样就可以将该对象恢复到原先保存的状态

经常需要保存对象的中间状态，当需要的时候，可以恢复到这个状态。类似编辑器的ctrl+z回退操作，ctrl+y恢复操作。

<!--break-->

### 备忘录模式的结构

- 发起人：记录当前时刻的内部状态，负责定义哪些属于备份范围的状态，负责创建和恢复备忘录数据。

- 备忘录：负责存储发起人对象的内部状态，在需要的时候提供发起人需要的内部状态。

- 管理角色：对备忘录进行管理，保存和提供备忘录。

### 代码示例

	class Originator {  
	    private $state = "";  
	      
	    public function getState() {  
	        return $this->state;  
	    } 

	    public function setState( $state ) {  
	        $this->state = $state;  
	    }

	    public function createMemento(){  
	        return new Memento( $this->state );  
	    }

	    public function restoreMemento( $memento ) {  
	        $this->setState( $memento->getState() );  
	    }  
	}  
	  
	class Memento {  
	    private $state = "";  
	    public function Memento( $state ) {  
	        $this->state = $state;  
	    }  
	    public function getState() {  
	        return $this->state;  
	    }  
	    public function setState( $state ) {  
	        $this->state = $state;  
	    }  
	}
	  
	class Caretaker {  
	    private $memento; 

	    public function getMemento() {  
	        return $this->memento;  
	    } 

	    public function setMemento( $memento ) {  
	        $this->memento = $memento;  
	    }  
	}

	class Client {  
	    public static function main() {  
	        $originator = new Originator();  
	        $originator->setState( "状态1" );
	        echo( "初始状态:".$originator->getState()."<br>" );  
	        $caretaker = new Caretaker();
	        $caretaker->setMemento( $originator->createMemento() );  
	        $originator->setState( "状态2" );  
	        echo( "改变后状态:".$originator->getState()."<br>" );  
	        $originator->restoreMemento( $caretaker->getMemento() );  
	        echo( "恢复后状态:".$originator->getState()."<br>" );  
	    }  
	}    

	Client::main();

单状态单备份，Originator类中的state变量需要备份，以便在需要的时候恢复；Memento类中，也有一个state变量，用来存储Originator类中state变量的临时状态；而Caretaker类就是用来管理备忘录类的，用来向备忘录对象中写入状态或者取回状态。

### 备忘录模式的优点有：

- 当发起人角色中的状态改变时，有可能这是个错误的改变，我们使用备忘录模式就可以把这个错误的改变还原。

- 备份的状态是保存在发起人角色之外的，这样，发起人角色就不需要对各个备份的状态进行管理。

### 备忘录模式的缺点：

在实际应用中，备忘录模式都是多状态和多备份的，发起人角色的状态需要存储到备忘录对象中，对资源的消耗是比较严重的。

## 状态模式（State）

> 当对象的状态改变时，同时改变其行为

### 状态模式结构

- State类是个状态类

- Context类可以实现切换

### 代码示例

	class State {  
	      
	    private $value;  
	      
	    public function getValue() {  
	        return $this->value;  
	    }  
	  
	    public function setValue( $value ) {  
	        $this->value = $value;  
	    }  
	  
	    public function method1(){  
	        echo("execute the first opt!"."<br>");  
	    }  
	      
	    public function method2(){  
	        echo("execute the second opt!"."<br>");  
	    }  
	}

	class Context {  
	  
	    private $state;  
	  
	    public function Context( $state ) {  
	        $this->state = $state;  
	    }  
	  
	    public function getState() {  
	        return $this->state;  
	    }  
	  
	    public function setState( $state ) {  
	        $this->state = $state;  
	    }
	  
	    public function method() {  
	        if ( $this->state->getValue() == "state1" ) {  
	            $this->state->method1();  
	        } else if ( $this->state->getValue() == "state2" ) {  
	            $this->state->method2();
	        }  
	    }  
	} 

	class Client {  
	  
	    public static function main() {  
	          
	        $state = new State();  
	        $context = new Context( $state );  
	          
	        //设置第一种状态  
	        $state->setValue( "state1" );  
	        $context->method();  
	          
	        //设置第二种状态  
	        $state->setValue( "state2" );  
	        $context->method();  
	    }  
	}       

	Client::main();


## 访问者模式（Visitor）

> 封装某些作用于某种数据结构中各元素的操作，它可以在不改变数据结构的前提下定义作用于这些元素的新的操作。

	class A {  
	    public function method1() {  
	        echo("我是A");  
	    }  
	      
	    public function method2( $b ) {  
	        $b->showA( $this );  
	    }  
	}  
	  
	class B {  
	    public function showA( $a ) {  
	        $a->method1();  
	    }  
	} 

	class Client {  
	    public static function main() {  
	        $a = new A();  
	        $a->method1();  
	        $a->method2( new B() );  
	    }  
	}   

	Client::main();

对于类A来说，类B就是一个访问者。这个例子可扩展性比较差，并不是访问者模式的全部。

### 访问者模式的结构

- 抽象访问者：抽象类或者接口，声明访问者可以访问哪些元素

- 访问者：实现抽象访问者所声明的方法

- 抽象元素类：接口或者抽象类，声明接受哪一类访问者访问，程序上是通过accept方法中的参数来定义的。

- 元素类：实现抽象元素类所声明的accept方法

- 结构对象：一个元素的容器，一般包含一个容纳多个不同类、不同接口的容器

### 代码示例

	//抽象访问者
	abstract class Element {  
	    public abstract function accept( $visitor );  
	    public abstract function doSomething();  
	}  
	  
	//抽象元素类
	interface IVisitor {  
	    public function visit1( $el1 );  
	    public function visit2( $el2 );  
	}  
	  
	//访问者
	class ConcreteElement1 extends Element {
	    public function doSomething() {
	        echo("这是元素1"."<br>");  
	    }
	      
	    public function accept( $visitor ) {
	        $visitor->visit1( $this );  
	    }
	}  
	  
	class ConcreteElement2 extends Element {
	    public function doSomething() {
	        echo("这是元素2"."<br>");  
	    }
	      
	    public function accept( $visitor ) {
	        $visitor->visit2( $this );
	    }
	} 

	//元素类
	class Visitor implements IVisitor {
	  
	    public function visit1( $el1 ) {
	        $el1->doSomething();
	    }
	      
	    public function visit2( $el2 ) {
	        $el2->doSomething();
	    }
	}  
	  
	//结构对象
	class ObjectStruture {
	    public static function getList() {
	        $list = array();
	        list($msec, $sec) = explode( ' ', microtime() );
	        srand((float) $sec);
	        
	        for( $i = 0; $i < 10; $i++ ) {
	            $a = rand( 10,100 );
	            if( $a > 50 ) {
	                array_push($list, new ConcreteElement1());
	            } else {  
	                array_push($list, new ConcreteElement2()); 
	            }  
	        }  
	        return $list;  
	    }  
	}
	  
	class Client {  
	    public static function main(){ 
	        $lists = ObjectStruture::getList();
	        foreach ( $lists as $key => $list ) {
	            $list->accept( new Visitor() );
	        } 
	    }  
	}     

	Client::main();

### 访问者模式的优点

- 符合单一职责原则

- 扩展性好

访问者模式并不是那么完美，它也有着致命的缺陷：增加新的元素类比较困难。通过访问者模式的代码可以看到，在访问者类中，每一个元素类都有它对应的处理方法，也就是说，每增加一个元素类都需要修改访问者类（也包括访问者类的子类或者实现类），修改起来相当麻烦。也就是说，在元素类数目不确定的情况下，应该慎用访问者模式。


## 中介者模式（Mediator）

> 用一个中介者对象封装一系列的对象交互，中介者使各对象不需要显示地相互作用，从而使耦合松散，而且可以独立地改变它们之间的交互。

中介者模式又称为调停者模式，减少系统耦合，任何一个类的变动，只会影响的类本身，以及中介者。

- 抽象中介者：定义好同事类对象到中介者对象的接口，用于各个同事类之间的通信。

- 中介者实现类：从抽象中介者继承而来，实现抽象中介者中定义的事件方法。从一个同事类接收消息，然后通过消息影响其他同时类。

- 同事类：如果一个对象会影响其他的对象，同时也会被其他对象影响，那么这两个对象称为同事类。同事类一般由多个组成，他们之间相互影响，相互依赖。同事类越多，关系越复杂。在中介者模式中，同事类之间必须通过中介者才能进行消息传递。

注：修改自java代码，PHP不支持重载实现多态，将setNumber改为changeNumber

	abstract class AbstractColleague {  
	    protected $number;
	  
	    public function getNumber() {  
	        return $this->number;  
	    }

	    public function setNumber( $number ) {  
	        $this->number = $number;  
	    }
	   
	    //注意这里的参数不再是同事类，而是一个中介者  
	    public abstract function changeNumber($number, $abstractMediator);  
	}

	class ColleagueA extends AbstractColleague{  
	  
	    public function changeNumber( $number, $abstractMediator ) {  
	        $this->number = $number;
	        $abstractMediator->AaffectB();  
	    }  
	}  
	  
	class ColleagueB extends AbstractColleague{  
	  
	    public function changeNumber( $number, $abstractMediator ) {  
	        $this->number = $number;
	        $abstractMediator->BaffectA();
	    }  
	}

	abstract class AbstractMediator {  
	    protected $A;  
	    protected $B;  
	      
	    public function AbstractMediator( $a, $b ) {  
	        $this->A = $a;  
	        $this->B = $b;  
	    }  
	  
	    public abstract function AaffectB();  
	      
	    public abstract function BaffectA();  
	  
	}

	class Mediator extends AbstractMediator {
	    //处理A对B的影响  
	    public function AaffectB() {  
	        $number = $this->A->getNumber();  
	        $this->B->setNumber( $number * 100 );  
	    }  
	  
	    //处理B对A的影响  
	    public function BaffectA() {  
	        $number = $this->B->getNumber();  
	        $this->A->setNumber( $number / 100 );  
	    }  
	}

	class Client {  
	    public static function main() {  
	        $collA = new ColleagueA();  
	        $collB = new ColleagueB();  
	          
	        $am = new Mediator( $collA, $collB );  
	          
	        echo("==========通过设置A影响B=========="."<br>");  
	        $collA->changeNumber( 1000, $am );  
	        echo("collA的number值为：".$collA->getNumber()."<br>");  
	        echo("collB的number值为A的100倍：".$collB->getNumber()."<br>");  
	  
	        echo("==========通过设置B影响A=========="."<br>");  
	        $collB->changeNumber( 1000, $am );  
	        echo("collB的number值为：".$collB->getNumber()."<br>");
	        echo("collA的number值为B的0.01倍：".$collA->getNumber()."<br>");  
	          
	    }  
	}  

	Client::main();

处理对象关系的代码重新封装到一个中介类中，通过这个中介类来处理对象间的关系。

### 中介者模式的优点

- 适当地使用中介者模式可以避免同事类之间的过度耦合，使得各同事类之间可以相对独立地使用。

- 使用中介者模式可以将对象间一对多的关联转变为一对一的关联，使对象间的关系易于理解和维护。

- 使用中介者模式可以将对象的行为和协作进行抽象，能够比较灵活的处理对象间的相互作用。

## 解释器模式（Interpreter）

> 给定一种语言，定义他的文法的一种表示，并定义一个解释器，该解释器使用该表示来解释语言中句子。

### 解释器模式的结构：

- 抽象解释器：声明一个所有具体表达式都要实现的抽象接口（或者抽象类），接口中主要是一个interpret()方法，称为解释操作。具体解释任务由它的各个实现类来完成，具体的解释器分别由终结符解释器TerminalExpression和非终结符解释器NonterminalExpression完成。

- 终结符表达式：实现与文法中的元素相关联的解释操作，通常一个解释器模式中只有一个终结符表达式，但有多个实例，对应不同的终结符。终结符一半是文法中的运算单元，比如有一个简单的公式R=R1+R2，在里面R1和R2就是终结符，对应的解析R1和R2的解释器就是终结符表达式。

- 非终结符表达式：文法中的每条规则对应于一个非终结符表达式，非终结符表达式一般是文法中的运算符或者其他关键字，比如公式R=R1+R2中，+就是非终结符，解析+的解释器就是一个非终结符表达式。非终结符表达式根据逻辑的复杂程度而增加，原则上每个文法规则都对应一个非终结符表达式。

- 环境角色：这个角色的任务一般是用来存放文法中各个终结符所对应的具体值，比如R=R1+R2，我们给R1赋值100，给R2赋值200。这些信息需要存放到环境角色中，很多情况下我们使用Map来充当环境角色就足够了。

### 代码示例

	interface Expression {  
	    public function interpret( $context );  
	}
	  
	class Plus implements Expression {   
	    public function interpret( $context ) {  
	        return $context->getNum1() + $context->getNum2();  
	    }  
	}  

	class Minus implements Expression {    
	    public function interpret( $context ) {  
	        return $context->getNum1() - $context->getNum2();  
	    }  
	}  

	class Context {        
	    private $num1;  
	    private $num2;  
	      
	    public function Context( $num1, $num2 ) {  
	        $this->num1 = $num1;  
	        $this->num2 = $num2;  
	    }  
	      
	    public function getNum1() {  
	        return $this->num1;  
	    }

	    public function setNum1( $num1 ) {  
	        $this->num1 = $num1;  
	    }

	    public function getNum2() {  
	        return $this->num2;  
	    }

	    public function setNum2( $num2 ) {  
	        $this->num2 = $num2;  
	    }   
	}

	class Client {   
	    public static function main() {  
	        // 计算9+2-8的值
	        $plus = new Plus();
	        $minus = new Minus();
	        $context = new Context( 9, 2 );
	        $result = $plus->interpret( $context );
	        $context = new Context( $result, 8 );
	        $result = $minus->interpret( $context );
	        echo($result);  
	    }  
	}

	Client::main();

解释器是一个简单的语法分析工具。

公式千变万化，但是都是由加减乘除四个非终结符来连接的，可以使用解释器模式。
