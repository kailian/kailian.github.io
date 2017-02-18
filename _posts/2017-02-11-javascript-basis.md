---
layout: post
category : web
title: 'javascript基础'
tagline: ""
tags : [web,javascript]
---

## JavaScript 语言特性

JavaScript是一门动态的，弱类型，基于原型的脚本语言。

动态性

```
//定义一个对象 
var obj = new Object(); 
//动态创建属性
name obj.name = "an object"; 
//动态创建属性
sayHi obj.sayHi = function(){ 
    return "Hi"; 
} 
obj.sayHi();
```

<!--break-->

弱类型

数据类型无需在声明时指定，解释器会根据上下文对变量进行实例化。

```
//定义一个变量s，并赋值为字符串
var s = "text";
console.log(s);
//赋值s为整型
s = 12+5;
console.log(s);
//赋值s为浮点型
s = 6.3;
console.log(s);
//赋值s为一个对象
s = new Object();
s.name = "object";
console.log(s.name);
结果为：
text
17
6.3
Object
```

JavaScript 是一门解释型的语言，特别是在浏览器中的 JavaScript，所有的主流浏览器都将 JavaScript 作为一个解释型的脚本来进行解析。

## 基本概念

### 基本类型

在 JavaScript 中，包含5种基本的基本数据类型

- 字符串(string)

- 数值(number)

- 布尔值(boolean)

- undefined

- null

在 JavaScript 中，所有的数字，不论是整型，浮点型，都属于number基本类型。

在内存中都有固定的大小，通过变量来直接访问基本类型的数据。

### 引用类型

- object

- array

- function

引用类型大小在原则上是不受任何限制的，通过对其引用的访问来访问它们本身，引用本身是一个地址，即指向真实存储复杂对象的位置。

```
var a;
var str = "Hello, world";
var num = 1;
var bool = true;
var obj = new Object();
obj.str = str;
obj.num = num;
var array = new Array("foo", "bar", "zoo");
var func = function(){
    console.log("I am a function here");
}

console.log(typeof str); //string
console.log(typeof num); //number
console.log(typeof bool); //boolean
console.log(typeof a); //undefined
console.log(typeof null); //object
console.log(typeof obj); //object
console.log(typeof array); //object
console.log(typeof func); //function
```

```
var x = 1;
var y = x;
console.log(x); // 1
console.log(y); // 1
x = 2;
console.log(x); // 2
console.log(y); // 1

var arr1 = [1,2,3,4,5];
var arr2 = arr1;
arr1.push(6);
console.log(arr2); //[1, 2, 3, 4, 5, 6]
```

Undefined类型只有一个值，即特殊的undefined。使用var声明变量但未对其加以初始化时，这个变量的值就是undefined。

为了兼容旧版浏览器，会给window对象添加undefined值

```
window.undefined = window.undefined;  
```

Null类型只有一个值，即特殊的null。null值表示一个空对象指针。

typeof null返回为object，因为特殊值null被认为是一个空的对象引用。

undefined值是派生自null值的

```
console.log(undefined == null); //true
```

Boolean

true和false，这两个值与数字值不是一回事，因此true不一定等于1，而false也不一定等于0。JavaScript中所有类型的值都有与这两个Boolean值等价的值。要将一个值转换为其对应的Boolean值，可以调用类型转换函数Boolean()。

```
console.log(true == 1); //true
console.log(false == 0); //true
console.log(true === 1); //false
console.log(false === 0); //false
```

| 数据类型   |转换为true的值           |转换为false的值|
|==========|========================|=============|
| Boolean   |true                   |false|
| String    |任何非空的字符串          |""(空字符串)|
| Number    |任何非0数值（包括无穷大）  |0和NAN|
| Object    |任何对象                |null|
| Undefined |不适用                  |undefined|

`!!`一般用来将后面的表达式强制转换为布尔类型的数据（boolean），只要变量的值为:0、null、" "、undefined或者NaN都将返回的是false，反之返回的是true。

```
var a;
var b = null; 
console.log(!!a);//undifined情况下，false
console.log(!!b);//null情况下，false
```

Number

整数、浮点数值、Infinity和NAN（非数值 Not a Number），用于表示一个本来要返回数值的操作数未返回数值的情况。

在JavaScript中，任何数值除以0会返回Infinity（无穷大）。

```
var num = Number('hello');
console.log(num); // NaN
console.log(NaN !== NaN ); // true
console.log(isNaN(NaN)); // 检测NAN true
```

```
console.log(1 / 0             ); // Infinity
console.log(Infinity          ); // Infinity
console.log(Infinity + 1      ); // Infinity
console.log(Math.pow(10, 1000)); // Infinity
console.log(Math.log(0)       ); // -Infinity
console.log(1 / Infinity      ); // 0
console.log(Infinity - Infinity); // NAN
```

String

string类型有些特殊，因为字符串具有可变的大小，所以显然它不能被直接存储在具有固定大小的变量中。由于效率的原因，我们希望JS只复制对字符串的引用，而不是字符串的内容。但是另一方面，字符串在许多方面都和基本类型的表现相似，而字符串是不可变的这一事实（即没法改变一个字符串值的内容），因此可以将字符串看成行为与基本类型相似的不可变引用类型。

### 类型的转换

valueOf()的优先级要高于toString()

toNumber()将值转换为数字

toString()将值转换为字符串

```
var obj = {
    valueOf: function () {
        console.log("valueOf");
        return {};
    },
    toString: function () {
        console.log("toString");
        return {};
    }
}
Number(obj)
```

+将字符串转换成数字

```
function toNumber(strNumber) {
    return +strNumber;
}
console.log(toNumber("1234")); // 1234
console.log(toNumber("ACB")); // NaN
console.log(+new Date()) // 1486712017313
```

通过调用对象的 valueOf()方法来取得对象的值，如果和上下文的类型匹配，则使用该值。如果 valueOf 取不到值的话，则需要调用对象的 toString()方法，而如果上下文为数值型，则又需要将此字符串转换为数值。

```
var x = 3;
var y = x + "2"; // 32
var z = x + 2; // 5
```

### 类型的判断

```
function handleMessage(message, handle) {
    if(typeof handle == "function") {
        return handle(message);
    } else {
        console.log("the 2nd argument should be a function");
    }
}
```

对象 obj 和数组 array 的 typeof 值均为object

```
var obj = {};
var array = [];
console.log(obj instanceof Array); //false
console.log(array instanceof Array); //true
```

### 变量

变量，即通过一个名字将一个值关联起来，以后通过变量就可以引用到该值。

```
var a = 2;
```

JavaScript会拆解为2步，第一，声明 var a;在编译阶段处理，第二，赋值，a=2;在执行阶段处理。

```
a = 2;
var a;
console.log( a ); //2
```

编译阶段

```
var a;
```

执行阶段

```
a = 2;
console.log( a );
```

```
console.log( a ); //undefined
var a = 2;
```

编译阶段

```
var a;
```

执行阶段

```
console.log( a );
a = 2;
```

详细可查看[You-Dont-Know-JS](https://github.com/kailian/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch4.md)

JavaScript 会在执行任何代码之前处理所有变量声明，无论是在条件块中声明还是在其他构造中声明。JavaScript 一旦找到所有变量，就会执行函数中的代码。如果在函数内部隐式声明变量（即，该变量出现在赋值表达式的左侧但尚未使用 var 进行声明），则它将创建为全局变量。  

局部变量

在函数定义内声明的变量是局部变量。  每当执行函数时，都会创建和销毁该变量，且无法通过函数之外的任何代码访问该变量。  JavaScript 不支持块范围（通过一组大括号 {. . .} 定义新范围），但块范围变量的特殊情况除外。

```
var aNumber = 100;
tweak();

function tweak(){
    // This prints "undefined", because aNumber is also defined locally below.
    console.log(aNumber);

    if (false)
    {
        var aNumber = 123;  
    }
}
```

当 JavaScript 执行一个函数时，它首先会查找所有变量声明，例如 var someVariable;。  它使用初始值 undefined 创建变量。  如果使用一个值声明变量（例如 var someVariable = "something";），则该变量的初始值仍为 undefined，并且仅当执行包含声明的行时才采用已声明的值。

全局变量

全局变量是global对象(window)的属性

- 使用var显示声明的全局变量

- 不使用var隐示声明的全局变量

```
var a = 'a';
b = 'b';

console.log(a); // a
console.log(b); // b
console.log(window.a); // a
console.log(window.b); // b

// 显式声明的全局变量不能被删除
delete a; // 返回 false
// 隐式声明的全局变量可以被删除
delete b; // 返回 true
console.log(typeof a); // string
console.log(typeof b); // undefined

console.log(Object.getOwnPropertyDescriptor(window, a));
//Object {value: "a", writable: true, enumerable: true, configurable: false}
console.log(Object.getOwnPropertyDescriptor(window, b));
//Uncaught ReferenceError: b is not defined
```

使用 var 声明的变量是不可配置的，不能被delete。

块范围变量 let 和 const

变量的作用域

变量被定义的区域即为其作用域，全局变量具有全局作用域；局部变量，比如声明在函数内部的变量则具有局部作用域，在函数的外部是不能直接访问的。块范围变量，大括号 {. . .} 定义新范围，仅适用于其设置所在的范围。

Javascript语言的特殊之处，函数内部可以直接读取全局变量。

函数内部声明变量的时候，一定要使用var命令。如果不用的话，实际上声明了一个全局变量。

## JavaScript对象

JavaScript对象其实就是属性的集合(以及一个原型对象)，这里的集合与数学上的集合是等价的，即具有确定性，无序性和互异性。

属性是由键-值对组成的，即属性的名字和属性的值。属性的名字是一个字符串，而值可以为任意的 JavaScript 对象(JavaScript 中的一切皆对象，包括函数)。

```
//声明一个对象
var box = new Object();
box.color = "red";
box.height = 300;
```

JavaScript 引擎在初始化时，会构建一个全局对象，在客户端环境中，这个全局对象即为 window。

在其他的 JavaScript 环境中需要引用这个全局对象，只需要在顶级作用域(即所有函数声明之外的作用域)中声明

```
var global = this;
```

```
var v = "global";
var array = ["hello", "world"];
function func(id){
    var element = document.getElementById(id);
    // do something
}
```

相当于

```
window.v = "global";
window.array = ["hello", "world"];
window.func = function(id){
    var element = document.getElementById(id);
    // do something
}
```

在顶级作用域中声明的变量将作为全局对象的属性被保存，从这一点上来看，变量其实就是属性。

### 函数

函数本身也是对象。

函数在 JavaScript 中可以

- 被赋值给一个变量

- 被赋值为对象的属性

- 作为参数被传入别的函数

- 作为函数的结果被返回

- 用字面量来创建

函数对象，由function创造出来的函数。包括 Function,Object,Array,String,Number。

```
//函数构造器创建函数
var funcName = new Function( [argname1, [... argnameN,]] body );
var add = new Function("x", "y", "return(x+y)");

//字面量创建函数
function add(x, y) {
    return x + y;
}

var add = function(x, y){
    return x + y;
}
```

function 关键字会调用Function 来 new 一个对象，并将参数表和函数体准确的传递给 Function 的构造器。通常来说，在全局作用域内声明一个对象，只不过是对一个属性赋值而已，比如上例中的 add函数，事实上只是为全局对象添加了一个属性，属性名为add，而属性的值是一个对象，即 function(x, y){return x+y;}

只有函数对象才有 prototype属性。

[function函数部分](https://segmentfault.com/a/1190000000660786)

### 原型对象及原型链

原型(prototype)，是 JavaScript 特有的一个概念，通过使用原型，JavaScript 可以建立其传统 OO 语言中的继承，从而体现对象的层次关系。JavaScript 本身是基于原型的，每个对象都有一个 prototype 的属性，这个 prototype 本身也是一个对象，因此它本身也可以有自己的原型，这样就构成了一个链结构。

```
function a(){};

var temp = new a();

a.prototype = new Object();
a.prototype = temp;
```

a.prototype指向a的一个实例，而且属于普通对象。

访问一个属性的时候，解析器需要从下向上的遍历这个链结构，直到遇到该属性，则返回属性对应的值，或者遇到原型为 null 的对象(JavaScript 的基对象 Object 的构造器的默认 prototype 有一个 null 原型)，如果此对象仍没有该属性，则返回 undefined。

由于遍历原型链的时候，是有下而上的，所以最先遇到的属性值最先返回，通过这种机制可以完成继承及重载等传统的 OO 机制。

```
//声明一个对象base
function Base(name) {
    this.name = name;
    this.getName = function() {
        return this.name;
    }
}
//声明一个对象child
function Child(id) {
    this.id = id;
    this.getId = function() {
        return this.id;
    }
}
//将child的原型指向一个新的base对象
Child.prototype = new Base("base");
//实例化一个child对象
var c1 = new Child("child");
console.log(c1.getId()); //child
console.log(c1.getName()); //base
```

### 指针__proto__

对象obj都具有proto属性(null和undefined除外),可称为隐式原型，一个对象的隐式原型指向构造该对象的构造函数的原型。proto属性就是原型对象的引用。

__proto__指向创造obj对象的函数对象的prototype属性。__proto__看是谁创造的。

```
function a(){};
var obj=new a();
console.log(a.__proto__===Function.prototype); //true
console.log(a.prototype.__proto__===Object.prototype); //true
console.log(obj.__proto__===a.prototype); //true
```

a是函数，a的__proto__属性为Function.prototype，内建的函数原型对象的__proto__属性则为Object.prototype对象，

### 构造函数属性constructor

```
function a(){};
var obj=new a();
obj.constructor.b=`我是a的新的属性`;
console.log(a.b); //我是a的新的属性
console.log(a.constructor===Function); //true
console.log(a.prototype.constructor===a); //true
console.log(obj.constructor===a); //true
```

函数a是由Function创造出来，那么它的constructor指向的Function，obj是由new a()方式创造出来，obj.constructor指向a。

```
Object.prototype.constructor===Object
Object.prototype.__proto__===null
```

```
function Task(id){  
    this.id = id;  
}
    
Task.prototype.status = "STOPPED";  
Task.prototype.execute = function(args){  
    return "execute task_"+this.id+"["+this.status+"]:"+args;  
}  
    
var task1 = new Task(1);  
var task2 = new Task(2);  
    
task1.status = "ACTIVE";
task2.status = "STARTING";
    
console.log(task1.execute("task1")); //execute task_1[ACTIVE]:task1 
console.log(task2.execute("task2")); //execute task_2[STARTING]:task2
```

### this

在 JavaScript 中，this 表示当前上下文，即调用者的引用。

call 和 apply 通常用来修改函数的上下文，函数中的 this 指针将被替换为 call 或者 apply的第一个参数。

```
//定义一个人，名字为jack
var jack = {
    name : "jack",
    age : 26
}
//定义另一个人，名字为abruzzi
var abruzzi = {
    name : "abruzzi",
    age : 26
}
//定义一个全局的函数对象
function printName(){
    return this.name;
}
//设置printName的上下文为jack, 此时的this为jack
console.log(printName.call(jack));
//设置printName的上下文为abruzzi,此时的this为abruzzi
console.log(printName.call(abruzzi));
```

## 闭包（closure）

> Closure is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope.

在 JavaScript 中，内部（嵌套）函数将存储对局部变量的引用（即使在函数返回之后），这些局部变量存在于与函数本身相同的范围中。  这一组引用称为闭包。

三个特性

1.函数嵌套函数

2.函数内部可以引用外部的参数和变量

3.参数和变量不会被垃圾回收机制回收

```
function send(name) {
    // Local variable 'name' is stored in the closure
    // for the inner function.
    return function () {
        sendHi(name);
    }
}

function sendHi(msg) {
    console.log('Hello ' + msg);
}

var func = send('Bill');
func(); // Hello Bill
sendHi('Pete'); // Hello Pete
func(); // Hello Bill
```

由于 JavaScript 中，函数是对象，对象是属性的集合，而属性的值又可以是对象，则在函数内定义函数成为理所当然，如果在函数 func 内部声明函数 inner，然后在函数外部调用 inner，这个过程即产生了一个闭包。

JavaScript闭包是一个拥有许多变量和绑定了这些变量的环境的表达式（通常是一个函数），因而这些变量也是该表达式的一部分。

JavaScript闭包就是在另一个作用域中保存了一份它从上一级函数或者作用域得到的变量，而这些变量是不会随上一级函数的执行完成而销毁。函数内对外部作用域上的变量引用，使其常驻内存中，得不到释放。

如何从外部读取局部变量？

```
function f1() {
    var n = 999;
    function f2() {
        console.log(n); 
    }
    return f2;
}
var result = f1();
result(); // 999
```

作用

- 读取函数内部的变量

- 让这些变量的值始终保持在内存中

- 模拟面向对象的代码风格

- 设计私有的方法和变量

缺点

常驻内存，会增大内存使用量，使用不当很容易造成内存泄露

### 循环

```
var outter = [];
function clouseTest() {
    var array = ["one", "two", "three", "four"];
    for(var i = 0; i < array.length;i++) {
        var x = {};
        x.no = i;
        x.text = array[i];
        x.invoke = function() {
            console.log(i);
        }
        outter.push(x);
    }
}
//调用这个函数
clouseTest();
console.log(outter[0].invoke());
console.log(outter[1].invoke());
console.log(outter[2].invoke());
console.log(outter[3].invoke());
```

程序结果

```
4
4
4
4
```

在每次迭代的时候，这样的语句 x.invoke = function(){console.log(i);}并没有被执行，只是构建了一个函数体为”console.log(i);”的函数对象，如此而已。而当 i=4 时，迭代停止，外部函数返回，当再去调用 outter[0].invoke()时，i 的值依旧为 4，因此 outter 数组中的每一个元素的 invoke 都返回 i 的值：4。

```
var outter = [];
function clouseTest2(){
    var array = ["one", "two", "three", "four"];
    for(var i = 0; i < array.length;i++){
        var x = {};
        x.no = i;
        x.text = array[i];
        x.invoke = function(no){
            return function(){
                console.log(no);
            }
        }(i);
        outter.push(x);
    }
}
clouseTest2();

console.log(outter[0].invoke());
console.log(outter[1].invoke());
console.log(outter[2].invoke());
console.log(outter[3].invoke());
相当于执行
x.invoke = function(){console.log(0);}
x.invoke = function(){console.log(1);}
x.invoke = function(){console.log(2);}
x.invoke = function(){console.log(4);}
```

```
for (var i=1; i<=5; i++) {
    setTimeout( function timer(){
        console.log( i );
    }, i*1000 );
}

// IIFEs
for (var i=1; i<=5; i++) {
    (function(){
        setTimeout( function timer(){
            console.log( i );
        }, i*1000 );
    })();
}

// IIFEs pass i
for (var i=1; i<=5; i++) {
    (function(j){
        setTimeout( function timer(){
            console.log( j );
        }, j*1000 );
    })( i );
}

// block scope let
for (var i=1; i<=5; i++) {
    let j = i; // yay, block-scope for closure!
    setTimeout( function timer(){
        console.log( j );
    }, j*1000 );
}

for (let i=1; i<=5; i++) {
    setTimeout( function timer(){
        console.log( i );
    }, i*1000 );
}

```

匿名自执行函数

```
var datamodel = {
    table : [],
    tree : {}
};

(function(dm){
    for(var i = 0; i < dm.table.rows; i++) {
        var row = dm.table.rows[i];
        for(var j = 0; j < row.cells; i++){
            drawCell(i, j);
        }
    }
})(datamodel);
```

创建了一个匿名的函数，并立即执行它，由于外部无法引用它内部的变量，执行完后很快就会被释放，最主要的是这种机制不会污染全局对象。

封装

```
var person = function(){
    //变量作用域为函数内部，外部无法访问
    var name = "default";
    return {
        getName : function(){
            return name;
        },
        setName : function(newName){
        name = newName;
        }
    }
}();
console.log(person.name);//直接访问，结果为undefined
console.log(person.getName());// default
person.setName("abruzzi");
console.log(person.getName());// abruzzi
```

```
function Person() {
    var name = "default";
    return {
        getName : function() {
            return name;
        },
        setName : function(newName) {
            name = newName;
        }
    }
};

var john = Person();
console.log(john.getName());
john.setName("john");
console.log(john.getName());
var jack = Person();
console.log(jack.getName());
jack.setName("jack");
console.log(jack.getName());
```

### 柯里化

柯里化就是预先将函数的某些参数传入，得到一个简单的函数，但是预先传入的参数被保存在闭包中，因此会有一些奇特的特性。

```
var adder = function(num) {
    return function(y){
        return num + y;
    }
}
var inc = adder(1);
var dec = adder(-1);

console.log(inc(99));//100
console.log(dec(101));//100
console.log(adder(100)(2));//102
console.log(adder(2)(100));//102
```

上下文的引用

```
var str = "a";
var object = {
    str : "b",
    getStr : function(){
    　　return function(){
            return this.str;
    　　};
    }
};
console.log(object.getStr()());

var str = "a";
var object = {
    str : "b",
    getStr : function(){
    　　 var self = this;
    　　 return function(){
            return self.str;
    　　 };
    }
};
console.log(object.getStr()());
```

### 模块

```
function CoolModule() {
    var something = "cool";
    var another = [1, 2, 3];

    function doSomething() {
        console.log( something );
    }

    function doAnother() {
        console.log( another.join( " ! " ) );
    }

    //public API for our module
    return {
        doSomething: doSomething,
        doAnother: doAnother
    };
}

var foo = CoolModule();

foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

模块只是函数，可以传参数

```
function CoolModule(id) {
    function identify() {
        console.log( id );
    }

    return {
        identify: identify
    };
}

var foo1 = CoolModule( "foo 1" );
var foo2 = CoolModule( "foo 2" );

foo1.identify(); // "foo 1"
foo2.identify(); // "foo 2"
```

模块管理

```
var MyModules = (function Manager() {
    var modules = {};

    function define(name, deps, impl) {
        for (var i=0; i<deps.length; i++) {
            deps[i] = modules[deps[i]];
        }
        modules[name] = impl.apply( impl, deps );
    }

    function get(name) {
        return modules[name];
    }

    return {
        define: define,
        get: get
    };
})();

MyModules.define( "bar", [], function(){
    function hello(who) {
        return "Let me introduce: " + who;
    }

    return {
        hello: hello
    };
} );

MyModules.define( "foo", ["bar"], function(bar){
    var hungry = "hippo";

    function awesome() {
        console.log( bar.hello( hungry ).toUpperCase() );
    }

    return {
        awesome: awesome
    };
} );

var bar = MyModules.get( "bar" );
var foo = MyModules.get( "foo" );

console.log(
    bar.hello( "hippo" )
); // Let me introduce: hippo

foo.awesome(); // LET ME INTRODUCE: HIPPO
```

## 内存管理

### 内存空间

JavaScript具有自动垃圾回收机制，每一个数据都需要一个内存空间。内存空间又被分为两种，栈内存(stack)与堆内存(heap)。

JS的基础数据类型，这些值都有固定的大小，往往都保存在栈内存中（闭包除外），由系统自动分配存储空间。先进后出，后进先出。

JS的引用数据类型，比如数组Array，它们值的大小是不固定的。引用数据类型的值是保存在堆内存中的对象。无序存储，可根据引用直接获取。

自动垃圾收集机制，就是找出那些不再继续使用的值，然后释放其占用的内存。垃圾收集器会每隔固定的时间段就执行一次释放操作。

```
var a1 = 0;   // 栈 
var a2 = 'this is string'; // 栈
var a3 = null; // 栈

var b = { m: 20 }; // 变量b存在于栈中，{m: 20} 作为对象存在于堆内存中
var c = [1, 2, 3]; // 变量c存在于栈中，[1, 2, 3] 作为对象存在于堆内存中
```

### 内存生命周期

1. 分配所需要的内存

2. 使用分配到的内存（读、写）

3. 不需要时将其释放、归还

JavaScript 在定义变量时就完成了内存分配

```
var a = 20;  // 在堆内存中给数值变量分配空间
console.log(a + 100);  // 使用内存
var a = null; // 使用完毕之后，释放内存空间
```

使用值的过程实际上是对分配内存进行读取与写入的操作。读取与写入可能是写入一个变量或者一个对象的属性值，甚至传递函数的参数。

在局部作用域中，当函数执行完毕，局部变量也就没有存在的必要了，因此垃圾收集器很容易做出判断并回收。但是全局变量什么时候需要自动释放内存空间则很难判断，因此在我们的开发中，需要尽量避免使用全局变量，以确保性能问题。

### 垃圾回收（GC）

垃圾回收算法主要依赖于引用（reference）的概念。在内存管理的环境中，一个对象如果有访问另一个对象的权限（隐式或者显式），叫做一个对象引用另一个对象。例如，一个Javascript对象具有对它原型的引用（隐式引用）和对它属性的引用（显式引用）。

- 在javascript中，如果一个对象不再被引用，那么这个对象就会被GC回收； 

- 如果两个对象互相引用，而不再被第三者所引用，那么这两个互相引用的对象也会被回收。在js中使用闭包，往往会给javascript的垃圾回收器制造难题。尤其是遇到对象间复杂的循环引用时，垃圾回收的判断逻辑非常复杂，搞不好就有内存泄漏的危险。 

引用计数(reference counting)

最简单的垃圾收集算法。此算法把“对象是否不再需要”简化定义为“对象有没有其他对象引用到它”。如果没有引用指向该对象（零引用），对象将被垃圾回收机制回收

```
var o = { 
  a: {
    b:2
  }
}; 
// 两个对象被创建，一个作为另一个的属性被引用，另一个被分配给变量o
// 很显然，没有一个可以被垃圾收集
var o2 = o; // o2变量是第二个对“这个对象”的引用
o = 1;      // 现在，“这个对象”的原始引用o被o2替换了
var oa = o2.a; // 引用“这个对象”的a属性
// 现在，“这个对象”有两个引用了，一个是o2，一个是oa
o2 = "yo"; // 最初的对象现在已经是零引用了，然而它的属性a的对象还在被oa引用，所以还不能回收
oa = null; // a属性的那个对象现在也是零引用了，它可以被垃圾回收了
```

标记清除（mark and sweep）

简化定义：对象是否可以获得

这个算法假定设置一个叫做根（root）的对象（在Javascript里，根是全局对象）。定期的，垃圾回收器将从根开始，找所有从根开始引用的对象，然后找这些对象引用的对象……从根开始，垃圾回收器将找到所有可以获得的对象和所有不能获得的对象。

内存问题

在闭包中引入闭包外部的变量时，当闭包结束时此对象无法被垃圾回收（GC）

```
var a = function() {
  var largeStr = new Array(1000000).join('x');
  return function() {
    return largeStr;
  }
}();
```

DOM泄露，当原有的COM被移除时，子结点引用没有被移除则无法回收。

```
var select = document.querySelector;
var treeRef = select('#tree');

//在COM树中leafRef是treeFre的一个子结点
var leafRef = select('#leaf');
var body = select('body');

body.removeChild(treeRef);

//#tree不能被回收入，因为treeRef还在
//解决方法:
treeRef = null;

//tree还不能被回收，因为叶子结果leafRef还在
leafRef = null;

//现在#tree可以被释放了。
```

Timers计（定）时器泄露

```
for (var i = 0; i < 90000; i++) {
  var buggyObject = {
    callAgain: function() {
      var ref = this;
      var val = setTimeout(function() {
        ref.callAgain();
      }, 90000);
    }
  }

  buggyObject.callAgain();
  //虽然你想回收但是timer还在
  buggyObject = null;
}
```

## 参考

[MDN, JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

[JavaScript-Core-and-Practice](http://icodeit.org/jsccp/JavaScript-Core-and-Practice-V0.9.9b.pdf)

[JavaScript内存空间详解](http://www.jianshu.com/p/996671d4dcc4)

[js原型链之prototype,__proto__以及constructor(一)](http://www.0313.name/2017/01/13/prototype-proto-constructor.html)

[js原型链之prototype,__proto__以及constructor(二)](http://www.0313.name/2017/01/13/prototype-proto-constructor.html)