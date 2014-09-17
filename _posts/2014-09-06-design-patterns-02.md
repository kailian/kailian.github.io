---
layout: post
category : 设计模式
title: '行为型模式(一)'
tagline: ""
tags : [设计模式, 行为型模式]
---

* auto-gen TOC:

{:toc}

父类与子类：策略模式、模板方法

两个类之间：观察者模式、迭代器模式、职责链模式、命令模式

## 策略模式（Strategy）

> 定义一组算法，将每个算法都封装起来，并且使他们之间可以互换。且算法的变化不会影响到使用算法的客户。

与模版方法模式的区别在于：在模版方法模式中，调用算法的主体在抽象的父类中，而在策略模式中，调用算法的主体则是封装到了封装类Context中，抽象策略Strategy一般是一个接口，目的只是为了定义规范，里面一般不包含逻辑。

<!--break-->

### 策略模式的结构

- 封装类：对策略进行二次封装，目的是避免高层模块对策略的直接调用。

- 抽象策略：通常情况下为一个接口，当各个实现类中存在着重复的逻辑时，则使用抽象类来封装这部分公共的代码。

- 具体策略：具体策略角色通常由一组封装了算法的类来担任，这些类之间可以根据需要自由替换。

### 代码示例

	interface IStrategy {  
	    public function doSomething();  
	} 

	class ConcreteStrategy1 implements IStrategy {  
	    public function doSomething() {  
	        echo("具体策略1"."<br>");  
	    }  
	} 

	class ConcreteStrategy2 implements IStrategy {  
	    public function doSomething() {  
	        echo("具体策略2"."<br>");  
	    }  
	}
	  
	class Context {  
	    private $strategy;  
	      
	    public function Context( $strategy ) {  
	        $this->strategy = $strategy;  
	    }  
	      
	    public function execute() {  
	        $this->strategy->doSomething();  
	    }  
	}  
	  
	class Client {  
	    public static function main() {   
	        echo("-----执行策略1-----"."<br>");  
	        $context = new Context(new ConcreteStrategy1());  
	        $context->execute();  
	  
	        echo("-----执行策略2-----"."<br>");  
	        $context = new Context(new ConcreteStrategy2());  
	        $context->execute();  
	    }  
	} 

	Client::main();


策略模式的决定权在用户，系统本身提供不同算法的实现，新增或者删除算法，对各种算法做封装。因此，策略模式多用在算法决策系统中，外部用户只需要决定用哪个算法即可。	

### 策略模式的主要优点

- 策略类之间可以自由切换，由于策略类实现自同一个抽象，可以自由切换

- 易于扩展

- 避免使用多重条件

### 策略模式的缺点

- 维护各个策略类会给开发带来额外开销

- 必须对客户端（调用者）暴露所有的策略类，因为使用哪种策略是由客户端来决定的


## 模板方法（Template Method）

> 定义一个操作中算法的框架，而将一些步骤延迟到子类中，使得子类可以不改变算法的结构即可重定义该算法中的某些特定步骤。

一个抽象类中，有一个主方法，再定义1...n个方法，可以是抽象的，也可以是实际的方法，定义一个类，继承该抽象类，重写抽象方法。通过调用抽象类，实现对子类的调用。

	abstract class AbstractSort {  
	      
	    /** 
	     * 将数组array由小到大排序 
	     * @param array $arr
	     */  
	    protected abstract function sort( $arr );  
	      
	    public function showSortResult( $arr ) {  
	        $arr = $this->sort( $arr );  
	        echo "排序结果：";  
	        for ( $i = 0; $i < count($arr); $i++) {  
	            echo $arr[$i].",";  
	        }
	    }  
	}

	class ConcreteSort extends AbstractSort {
	    protected function sort($arr) {
	        $len = count( $arr );
	        for( $i = 1; $i < $len; $i++ ) {
	            for( $j = $len - 1; $j >= $i; $j-- ) {
	                if( $arr[$j] < $arr[$j-1] ) {
	                    $x = $arr[$j];
	                    $arr[$j] = $arr[$j-1];
	                    $arr[$j-1] = $x;
	                }
	            }       
	        }
	        return $arr; 
	    }
	}
	    
	class Client {  
	    public static $arr = [ 10, 32, 1, 9, 5, 7, 12, 0, 4, 3 ]; // 预设数据数组  
	    public static function main() {  
	        $sort = new ConcreteSort();  
	        $sort->showSortResult( self::$arr );  
	    }    
	}

	Client::main();


### 模版方法模式的结构

模版方法模式由一个抽象类和一个（或一组）实现类通过继承结构组成，抽象类中的方法
分为三种：

- 抽象方法：父类中只声明但不加以实现，而是定义好规范，然后由它的子类去实现。

- 模版方法：由抽象类声明并加以实现。一般来说，模版方法调用抽象方法来完成主要的逻辑功能，并且，模版方法大多会定义为final类型，指明主要的逻辑功能在子类中不能被重写。

- 钩子方法：由抽象类声明并加以实现。但是子类可以去扩展，子类可以通过扩展钩子方法来影响模版方法的逻辑。

### 模版方法的优点

- 容易扩展，增加实现类实现功能的扩展，符合开闭原则。

- 便于维护，主要逻辑相同

- 比较灵活，钩子方法，子类的实现也可以影响父类中主逻辑的运行。由于子类影响到了父类，违反了里氏替换原则，也会给程序带来风险。

在多个子类拥有相同的方法，并且这些方法逻辑相同时，可以考虑使用模版方法模式。在程序的主框架相同，细节不同的场合下，也比较适合使用这种模式。


## 观察者模式（Observer）

> 定义对象间一种一对多的依赖关系，使得当每一个对象改变状态，则所有依赖于它的对象都会得到通知并自动更新。

一个对象要时刻监听着另一个对象，只要它的状态一发生改变，自己随之要做出相应的行动。

### 观察者模式的结构

- 被观察者：存放观察者对象的Vector容器，这个角色可以是接口，也可以是抽象类或者具体的类

- 观察者：观察者角色一般是一个接口，只有一个update方法，在被观察者状态发生变化时，这个方法就会被触发调用。

- 具体的被观察者：扩展定义具体的业务逻辑

- 具体的观察者：观察者接口的具体实现

### 代码示例

	abstract class Subject {  
	    private $obsArr = array();  
	      
	    public function addObserver( $obs ) { 
	        array_push( $this->obsArr,$obs );  
	    }

	    public function delObserver( $obs ) {
	        $index = array_search( $obs, $this->obsArr );
	        unset( $this->obsArr[$index] );
	    }

	    protected function notifyObserver(){  
	        foreach ( $this->obsArr as $key => $obs ) {
	            $obs->update();
	         } 
	    }

	    public abstract function doSomething();
	}

	class ConcreteSubject extends Subject {
	    public function doSomething() {
	        echo( "被观察者事件反生"."<br>" );
	        $this->notifyObserver();
	    }  
	}

	interface Observer {
	    public function update();
	}

	class ConcreteObserver1 implements Observer {
	    public function update() {
	        echo("观察者1收到信息，并进行处理。"."<br>");
	    }
	}

	class ConcreteObserver2 implements Observer {
	    public function update() {
	        echo("观察者2收到信息，并进行处理。"."<br>");
	    }
	}  
	  
	class Client {  
	    public static function main() {  
	        $sub = new ConcreteSubject();  
	        $sub->addObserver( new ConcreteObserver1() ); //添加观察者1  
	        $sub->addObserver( new ConcreteObserver2() ); //添加观察者2  
	        $sub->doSomething();  
	    }  
	}  

	Client::main();

只调用了Subject的方法，但同时两个观察者的相关方法都被同时调用了。

观察者模式的优点

- 观察者与被观察者之间是属于轻度的关联关系，并且是抽象耦合的

- 观察者模式是一种常用的触发机制，它形成一条触发链，依次对各个观察者的方法进行处理。由于是链式触发，当观察者比较多的时候，性能问题是比较令人担忧的。

## 迭代器模式（Iterator）

> 提供一种方法访问一个容器对象中各个元素，而又不暴露该对象的内部细节。

可以将集合看成是一个可以包容对象的容器，例如List，Set，Map，数组，而迭代器的作用就是把容器中的对象一个一个地遍历出来。

迭代器模式的结构

- 抽象容器：一般是一个接口，提供一个iterator()方法

- 具体容器：就是抽象容器的具体实现类

- 抽象迭代器：定义遍历元素所需要的方法，取得第一个元素的方法first()，取得下一个元素的方法next()，判断是否遍历结束的方法isDone()（或者叫hasNext()），移出当前对象的方法remove()

- 迭代器实现：实现迭代器接口中定义的方法，完成集合的迭代。

### 代码示例

	interface Iterators {  
	    public function next();  
	    public function hasNext();  
	} 

	class ConcreteIterator implements Iterators {  
	    private $list = array();  
	    private $cursor = 0;  
	    public function ConcreteIterator( $list ) {  
	        $this->list = $list;  
	    }

	    public function hasNext() {  
	        if( $this->cursor == count( $this->list ) ) {  
	            return false;
	        }  
	        return true;  
	    }

	    public function next() {  
	        $obj = null;  
	        if($this->hasNext()){  
	            $obj = $this->list[$this->cursor++];  
	        }  
	        return $obj;  
	    }  
	} 

	interface Aggregate {  
	    public function add( $obj );  
	    public function remove( $obj );  
	    public function iterator();  
	} 

	class ConcreteAggregate implements Aggregate {  
	    private $list = array();  
	    public function add( $obj ) {  
	        array_push( $this->list, $obj );
	    }  
	  
	    public function iterator() {  
	        return new ConcreteIterator( $this->list );  
	    }  
	  
	    public function remove( $obj ) {
	        $index = array_search( $obj, $this->list );  
	        unset( $this->list[$index] );
	    }  
	} 

	class Client {  
	    public static function main() {  
	        $ag = new ConcreteAggregate();  
	        $ag->add("小明");  
	        $ag->add("小红");  
	        $ag->add("小刚");  
	        $iterator = $ag->iterator();  
	        while( $iterator->hasNext() ) {  
	            $str = $iterator->next();  
	            echo $str."<br>";  
	        }
	    }  
	}  

	Client::main();

容器类接口中主要有三个方法：添加对象方法add、删除对象方法remove、取得迭代器方法iterator。

Iterator是迭代器接口，主要有两个方法：取得迭代对象方法next，判断是否迭代完成方法hasNext。

### 迭代器模式的优缺点：

- 简化了遍历方式

- 可以提供多种遍历方式，比如说对有序列表，我们可以根据需要提供正序遍历，倒序遍历两种迭代器

- 封装性良好，用户只需要得到迭代器就可以遍历，而对于遍历算法则不用去关心

对于比较简单的遍历（像数组或者有序列表），使用迭代器方式遍历较为繁琐。我们只需要使用语言中已有的容器和迭代器就可以了。


## 职责链模式（Chain of Responsibility）

> 使多个对象都有机会处理请求，从而避免了请求的发送者和接收者之间的耦合关系。将这些对象连成一条链，并沿着这条链传递该请求，直到有对象处理它为止。

责任链模式，有多个对象，每个对象持有对下一个对象的引用，这样就会形成一条链，请求在这条链上传递，直到某一对象决定处理该请求。但是发出者并不清楚到底最终那个对象会处理该请求，所以，责任链模式可以实现，在隐瞒客户端的情况下，对系统进行动态的调整。

### 代码示例 

	interface Handler {  
	    public function operator();  
	}

	abstract class AbstractHandler {
	    private $handler;
	    public function getHandler() {  
	        return $this->handler;
	    }  
	  
	    public function setHandler( $handler ) {
	        $this->handler = $handler;  
	    }  
	      
	}

	class MyHandler extends AbstractHandler implements Handler {
	    private $name;
	    public function MyHandler( $name ) {
	        $this->name = $name;  
	    }  
	 
	    public function operator() {  
	        echo($this->name."deal!"."<br>");  
	        if( $this->getHandler() != null ) {  
	            $this->getHandler()->operator();  
	        }  
	    }  
	} 

	class Client {    
	    public static function main() {  
	        $h1 = new MyHandler("h1");  
	        $h2 = new MyHandler("h2");  
	        $h3 = new MyHandler("h3");    
	        $h1->setHandler( $h2 );
	        $h2->setHandler( $h3 );    
	        $h1->operator();  
	    }  
	}      

	Client::main(); 

链接上的请求可以是一条链，可以是一个树，还可以是一个环，模式本身不约束这个，需要我们自己去实现，同时，在一个时刻，命令只允许由一个对象传给另一个对象，而不允许传给多个对象。

### 责任链模式的优缺点

责任链模式与if…else…相比，他的耦合性要低一些，因为它把条件判定都分散到了各个处理类中，并且这些处理类的优先处理顺序可以随意设定。

责任链模式缺点，这与if…else…语句的缺点是一样的，那就是在找到正确的处理类之前，所有的判定条件都要被执行一遍，当责任链比较长时，性能问题比较严重。


## 命令模式（Command）

> 将一个请求封装成一个对象，从而让你使用不同的请求把客户端参数化，对请求排队或者记录请求日志，可以提供命令的撤销和恢复功能。

命令模式的本质：封装请求。


## 命令模式的结构，命令模式就是对命令的封装。

- Command类：是一个抽象类，类中对需要执行的命令进行声明；

- ConcreteCommand类：Command类的实现类，对抽象类中声明的方法进行实现；

- Client类：最终的客户端调用类；

- Invoker类：调用者，负责调用命令；

- Receiver类：接收者，负责接收命令并且执行命令。

### 代码示例

	class Invoker {  
	    private $command;  
	    public function setCommand( $command ) {  
	        $this->command = $command;  
	    }

	    public function action(){  
	        $this->command->execute();  
	    }  
	}  
	  
	abstract class Command {  
	    public abstract function execute();  
	}  
	  
	class ConcreteCommand extends Command {  
	    private $receiver;  
	    public function ConcreteCommand( $receiver ) {  
	        $this->receiver = $receiver;  
	    }

	    public function execute() {  
	        $this->receiver->doSomething();  
	    }  
	}  
	  
	class Receiver {  
	    public function doSomething() {  
	        echo("接受者-业务逻辑处理"."<br>");  
	    }  
	}  
	  
	class Client {  
	    public static function main() {  
	        $receiver = new Receiver();  
	        $command = new ConcreteCommand( $receiver );  
	        //客户端直接执行具体命令方式
	        $command->execute();  
	  
	        //客户端通过调用者来执行命令  
	        $invoker = new Invoker();
	        $invoker->setCommand( $command );  
	        $invoker->action();  
	    }  
	}  

	Client::main();


执行的时序首先是调用者类，然后是命令类，最后是接收者类。

### 命令模式的优缺点

- 耦合度要比把所有的操作都封装到一个类中要低的多，把命令的调用者与执行者分开，使双方不必关心对方是如何操作的。

- 命令模式的封装性很好：每个命令都被封装起来

- 命令模式的扩展性很好：在命令模式中，在接收者类中一般会对操作进行最基本的封装，命令类则通过对这些基本的操作进行二次封装。命令模式中的命令对象，能够很容易的组合成为复合命令。

即使简单的命令的也要封装命令类
