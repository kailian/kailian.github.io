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

- 类适配器模式

- 对象适配器模式

- 接口适配器模式

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

### 接口适配器模式


	interface Sourceable {        
	    public function method1();  
	    public function method2();  
	} 

	abstract class Wrapper2 implements Sourceable {        
	    public function method1(){}  
	    public function method2(){}  
	} 

	class SourceSub1 extends Wrapper2 {  
	    public function method1(){  
	        echo("the sourceable interface's first Sub1!"."<br>");  
	    }    
	}

	class SourceSub2 extends Wrapper2 {  
	    public function method2(){  
	        echo("the sourceable interface's second Sub2!"."<br>");  
	    }  
	}

	class Client {
	    public static function main() {  
	        $source1 = new SourceSub1();  
	        $source2 = new SourceSub2();  
	          
	        $source1->method1();  
	        $source1->method2();  
	        $source2->method1();  
	        $source2->method2();  
	    }    
	}     

	Client::main();

类的适配器模式：当希望将一个类转换成满足另一个新接口的类时，可以使用类的适配器模式，创建一个新类，继承原有的类，实现新的接口即可。

对象的适配器模式：当希望将一个对象转换成满足另一个新接口的对象时，可以创建一个Wrapper类，持有原类的一个实例，在Wrapper类的方法中，调用实例的方法就行。

接口的适配器模式：当不希望实现一个接口中所有的方法时，可以创建一个抽象类Wrapper，实现所有方法，我们写别的类的时候，继承抽象类即可。

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

> 为其他对象提供一种代理以控制对这个对象的访问。在某些情况下，一个对象不适合或者不能直接引用另一个对象，而代理对象可以在客户端和目标对象之间起到中介的作用。

### 代理模式的组成

- 代理角色（Proxy）： 保存一个引用使得代理可以访问实体。若 RealSubject和Subject的接口相同，Proxy会引用Subject。提供一个与Subject的接口相同的接口，这样代理就可以用来替代实体。

- 抽象主题角色（Subject）：定义真实主题角色RealSubject和抽象主题角色Proxy的共用接口。代理主题通过持有真实主题RealSubject的引用。

- 真实主题角色（RealSubject）：定义了代理角色(proxy)所代表的具体对象。

### 代码示例

	interface Sourceable {  
	    public function method();  
	}  

	class Source implements Sourceable {  
	 
	    public function method() {  
	        echo("the original method!");  
	    }  
	}  

	class Proxy implements Sourceable {  
	  
	    private $source;  
	    public function Proxy() {    
	        $this->source = new Source();  
	    }  
	 
	    public function method() {  
	        $this->before();  
	        $this->source->method();  
	        $this->atfer();
	    } 

	    private function atfer() {  
	        echo("after proxy!");  
	    }

	    private function before() {  
	        echo("before proxy!");  
	    }  
	}  

	class Client {
	    public static function main() {  
	        $source = new Proxy();  
	        $source->method();  
	    }    
	}     

	Client::main();

已有的方法在使用的时候需要对原有的方法进行改进，就是采用一个代理类调用原有的方法，且对产生的结果进行控制。


## 外观模式（Facade）

> 为子系统中的一组接口提供一个统一的高层接口。

外观模式中，一个子系统的外部与其内部的通信通过一个统一的外观类进行，外观类将客户类与子系统的内部复杂性分隔开，使得客户类只需要与外观角色打交道，而不需要与子系统内部的很多对象打交道。

目的在于降低系统的复杂程度。

### 外观模式组成

- Facade（外观角色）：在客户端可以调用它的方法，在外观角色中可以知道相关的（一个或者多个）子系统的功能和责任；在正常情况下，它将所有从客户端发来的请求委派到相应的子系统去，传递给相应的子系统对象处理。

- SubSystem（子系统角色）：软件系统中可以有一个或者多个子系统角色，每一个子系统可以不是一个单独的类，而是一个类的集合，它实现子系统的功能；每一个子系统都可以被客户端直接调用，或者被外观角色调用，它处理由外观类传过来的请求；子系统并不知道外观的存在，对于子系统而言，外观角色仅仅是另外一个客户端而已。

### 代码示例

	class CPU {  
	      
	    public function startup() {  
	        echo("cpu startup!"."<br>");  
	    }  
	      
	    public function shutdown() {  
	        echo("cpu shutdown!"."<br>");  
	    }  
	}    

	class Memory {  
	      
	    public function startup() {  
	        echo("memory startup!"."<br>");  
	    }  
	      
	    public function shutdown() {  
	        echo("memory shutdown!"."<br>");  
	    }  
	}

	class Disk {  
	      
	    public function startup() {  
	        echo("disk startup!"."<br>");  
	    }  
	      
	    public function shutdown() {  
	        echo("disk shutdown!"."<br>");  
	    }  
	} 

	class Computer {  
	    private $cpu;  
	    private $memory;  
	    private $disk;  
	      
	    public function Computer() {  
	        $this->cpu = new CPU();  
	        $this->memory = new Memory();  
	        $this->disk = new Disk();  
	    }  
	      
	    public function startup() {  
	        echo("start the computer!"."<br>");  
	        $this->cpu->startup();  
	        $this->memory->startup();  
	        $this->disk->startup();  
	        echo("start computer finished!"."<br>");  
	    }  
	      
	    public function shutdown() {  
	        echo("begin to close the computer!"."<br>");  
	        $this->cpu->shutdown();  
	        $this->memory->shutdown();  
	        $this->disk->shutdown();  
	        echo("computer closed!"."<br>");  
	    }  
	}     

	class Client {
	    public static function main() {  
	        $computer = new Computer();  
	        $computer->startup();  
	        $computer->shutdown();  
	    }    
	}     

	Client::main();

在引入外观类之后，与子系统业务类之间的交互统一由外观类来完成。

由于在外观类中维持了对子系统对象的引用，客户端可以通过外观类来间接调用子系统对象的业务方法，而无须与子系统对象直接交互。

## 桥接模式（Bridge）

> 将抽象部分与它的实现部分分离，使它们都可以独立地变化。

### 桥接模式的组成

- 抽象化（Abstraction）角色：抽象化给出的定义，并保存一个对实现化对象的引用。在抽象对象里面的方法，需要调用实现部分的对象来完成。

- 修正抽象化（Refined Abstraction）角色：扩展抽象化角色，改变和修正父类对抽象化的定义。定义跟实际业务相关的方法。

- 实现化（Implementor）角色：这个角色给出实现化角色的接口，但不给出具体的实现。

- 具体实现化（Concrete Implementor）角色：这个角色给出实现化角色接口的具体实现。

### 代码示例

	interface Sourceable {  
	    public function method();  
	}  

	class SourceSub1 implements Sourceable {  
	  
	    public function method() {  
	        echo("this is the first sub!");  
	    }
	} 

	class SourceSub2 implements Sourceable {  
	  
	    public function method() {  
	        echo("this is the second sub!");  
	    }  
	}    

	abstract class Bridge {  
	    private $source;  
	  
	    public function method() {  
	        $this->source->method();  
	    }  
	      
	    public function getSource() {  
	        return $this->source;  
	    }  
	  
	    public function setSource( $source ) {  
	        $this->source = $source;  
	    }  
	} 

	class MyBridge extends Bridge {  
	    public function method(){  
	        $this->getSource()->method();  
	    }  
	} 

	class Client {  
	      
	    public static function main() {   
	        $bridge = new MyBridge();  
	          
	        /*调用第一个对象*/  
	        $source1 = new SourceSub1();  
	        $bridge->setSource( $source1 );  
	        $bridge->method();  
	          
	        /*调用第二个对象*/  
	        $source2 = new SourceSub2();  
	        $bridge->setSource( $source2 );  
	        $bridge->method();  
	    }  
	}         

	Client::main();

通过对Bridge类的调用，实现了对接口Sourceable的实现类SourceSub1和SourceSub2的调用。


## 组合模式（Composite）

> 将对象组合成树形结构以表示“部分——整体”的层次结构，组合模式使得用户对单个对象和组合对象的使用具有一致性。

- Component类：组合中的对象声明接口，在适当情况下，实现所有类共有接口的行为。声明一个接口用于访问和管理Component的子部件

- Leaf类：叶节点对象，叶节点没有子节点。由于叶节点不能增加分支和树叶，所以叶节点的Add和Remove没有实际意义。

- Composite类：实现Componet的相关操作，比如Add和Remove操作。

- Children：用来存储叶节点集合

### 代码示例

	abstract class Component {
	    private $name; 
	    public function Component( $name ) {
	        $this->name = $name;
	    }
	 
	    public abstract function Add( $component );
	    public abstract function Remove( $component );
	    public abstract function Diaplay( $depth );
	}

	class Leaf {
	    private $name;    
	    public function Leaf( $name ) {
	        $this->name = $name;  
	    }
	 
	    public function Add( $component ) {
	        echo("不能向叶子节点添加子节点");
	    }
	 
	    public function Remove( $component ) {
	        echo("叶子节点没有子节点");
	    }
	 
	    public function Diaplay() {
	        echo( $this->name );
	    }
	} 

	class Composite {
	 
	    private $children;
	 
	    public function Composite( $name ) {
	        $this->name = $name;
	        if ( $this->children == null) {
	            $this->children = array();
	        }
	    }
	 
	    public function Add( $component ) {
	        array_push( $this->children, $component );
	        
	    }
	 
	    public function Remove( $component ) {
	        $index = array_search( $component, $this->children );
	        unset( $this->children[$index] );
	    }
	 
	    public function Diaplay() {
	        print_r($this->children);
	    }
	}

	class Client {  
	      
	    public static function main() {   
	        $root = new Composite("根节点root<br>");
	        $aleaf = new Leaf( "根上生出的叶子A<br>" );
	        $root->Add( $aleaf );
	        $bleaf = new Leaf( "根上生出的叶子B<br>" );
	        $root->Add( $bleaf );
	     
	        $comp = new Composite( "根上生出的分支CompositeX<br>" );
	        $aleaf = new Leaf( "分支CompositeX生出的叶子LeafXA<br>" );
	        $comp->Add( $aleaf );
	        $bleaf = new Leaf( "分支CompositeX生出的叶子LeafXB<br>" );
	        $comp->Add( $bleaf );
	     
	        $root->Add( $comp );
	     
	        $comp2 = new Composite( "分支CompositeX生出的分支CompositeXY<br>" );
	        $aleaf = new Leaf( "分支CompositeX生出的叶子LeafXA<br>" );
	        $comp2->Add( $aleaf );
	        $bleaf = new Leaf( "分支CompositeX生出的叶子LeafXB<br>" );
	        $comp2->Add( $bleaf );
	     
	        $comp->Add($comp2);
	     
	        $cleaf = new Leaf( "根节点生成的叶子LeafC<br>" ); 
	        $root->Add( $cleaf );
	        $dleaf = new Leaf( "leaf D<br>" );
	        $root->Add( $dleaf );
	        $root->Remove( $dleaf );
	        $root->Diaplay();
	    }  
	}         

	Client::main();

组合模式，将对象组合成树形结构以表示“部分-整体”的层次结构，组合模式使得用户对单个对象和组合对象的使用具有一致性。

## 享元模式（Flyweight）

> 运用共享技术有效地支持大量细粒度的对象。

享元模式的主要目的是实现对象的共享，即共享池，当系统中对象多的时候可以减少内存的开销，通常与工厂模式一起使用。

### 使用场景

- 一个应用程序使用了大量的对象。

- 完全由于使用大量的对象，造成很大的存储开销。

- 对象的大多数状态都可以变为外部状态。

- 如果删除对象以外的状态那么可以用相对较少的共享对象取代很多组对象。

- 应用程序不依赖于对象标识。

### 代码示例

	abstract class Order {
	    // 执行卖出动作
	    public abstract function sell();
	}

	class FlavorOrder extends Order {
	    public $flavor;

	    // 获取咖啡口味
	    public function FlavorOrder( $flavor ) {
	       $this->flavor = $flavor;
	    }

	    public function sell() {
	       echo("卖出一份".$this->flavor."的咖啡。"."<br>");
	    }
	}

	class FlavorFactory {
	    private $flavorPool = array();

	    // 静态工厂,负责生成订单对象
	    private static $flavorFactory = null;

	    public static function getInstance() {
	        if ( ! (self::$flavorFactory ) ) {
	            self::$flavorFactory = new self();
	        }  
	        return self::$flavorFactory;
	    }

	    public function getOrder( $flavor ) {
	        if( in_array( $flavor, array_keys( $this->flavorPool ) ) ) {
	            $order = $this->flavorPool[$flavor];
	        } else {
	            $order = new FlavorOrder( $flavor );
	            $order->sell();
	            $this->flavorPool[$flavor] = $order;
	        }
	        return $order;
	    }

	    public function getTotalFlavorsMade() {
	       return count( $this->flavorPool );
	    }
	}

	class Client {  
	    private static $orders = array();

	    private static function takeOrders( $flavor ) {
	       $flavorFactory = FlavorFactory::getInstance();      
	       array_push( self::$orders, $flavorFactory->getOrder( $flavor ) );
	    }

	    public static function main() {   
	        $flavorFactory = FlavorFactory::getInstance();
	        self::takeOrders("摩卡");
	        self::takeOrders("卡布奇诺");
	        self::takeOrders("香草星冰乐");
	        self::takeOrders("香草星冰乐");
	        self::takeOrders("拿铁");
	        self::takeOrders("卡布奇诺");
	        self::takeOrders("拿铁");
	        self::takeOrders("卡布奇诺");
	        self::takeOrders("摩卡");
	        self::takeOrders("香草星冰乐");
	        self::takeOrders("卡布奇诺");
	        self::takeOrders("摩卡");
	        self::takeOrders("香草星冰乐");
	        self::takeOrders("拿铁");
	        self::takeOrders("拿铁");

	        foreach (self::$orders as $key => $order) {
	            $order->sell();
	        }

	        echo("客户一共买了 " . count( self::$orders ) . " 杯咖啡! "."<br>");
	        echo("共生成了 " . $flavorFactory->getTotalFlavorsMade() . " 个 FlavorOrder 对象! ");
	    }  
	}         

	Client::main();

客户一共买了 15 杯咖啡! 
共生成了 4 个 FlavorOrder 对象!

口味共享极大减少了对象数目，减小了内存消耗

### 优缺点

- 享元模式使得系统更加复杂。为了使对象可以共享，需要将一些状态外部化，这使得程序的逻辑复杂化。

- 享元模式将享元对象的状态外部化，而读取外部状态使得运行时间稍微变长。

![设计模式](/images/201409/designpattern20140908.jpg)

