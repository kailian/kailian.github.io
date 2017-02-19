---
layout: post
category : web
title: 'javascript-this'
tagline: ""
tags : [web,javascript]
---

部分翻译内容，完整内容请查看[You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch2.md)，仅作为笔记参考。

## 什么是this

在 JavaScript 中，this 表示当前上下文，即调用者的引用。this是运行时绑定而不是创建时绑定。即函数在调用时是基于其上下文来绑定的。

this is neither a reference to the function itself, nor is it a reference to the function's lexical scope.

> this is actually a binding that is made when a function is invoked, and what it references is determined entirely by the call-site where the function is called.

当函数调用，一个活动记录也称为执行上下文被创建。记录信息包括函数调用栈，函数如何调用，传递的参数等。当函数执行时，this引用这个活动记录其中的一个属性。

<!--break-->

## 为什么用 this？

```
function identify() {
    return this.name.toUpperCase();
}

function speak() {
    var greeting = "Hello, I'm " + identify.call( this );
    console.log( greeting );
}

var me = {
    name: "Kyle"
};

var you = {
    name: "Reader"
};

identify.call( me ); // KYLE
identify.call( you ); // READER

speak.call( me ); // Hello, I'm KYLE
speak.call( you ); // Hello, I'm READER
```

this机制提供了更优雅的方式来隐式地“传递”一个对象引用，能实现更干净的API设计和更容易的代码复用。

## this的四大绑定规则

通过call-site(from the call-stack)分析绑定

- Default Binding

- Implicit Binding

- Explicit Binding

- New Binding

### Default Binding

默认绑定，浏览器全局范围，this等价于window对象。在严格模式下，全局对象将无法使用默认绑定，this会绑定到undefined。

```
this === window
```

```
function foo() {
    //this作用于函数调用，this指向global object
    console.log( this.a );
}

var a = 2;
foo(); // 2
```

注意，strict模式下global object不能作为Default Binding。

```
function foo() {
    "use strict";
    console.log( this.a );
}

var a = 2;

foo(); // TypeError: `this` is `undefined`
```

### Implicit Binding

隐式绑定，调用位置是否有上下文对象，是否被对象引用或者包含。

the implicit binding rule says that it's that object which should be used for the function call's this binding.

```
function foo() {
    // foo的调用者为obj
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

obj.foo(); // 2
```

foo()作为obj属性的一个引用。foo先在obj里面声明，然后obj添加foo的引用。obj就是foo的this，this.a也就是obj.a。

```
function foo() {
    console.log( this.a );
}

var obj2 = {
    a: 42,
    foo: foo
};

var obj1 = {
    a: 2,
    obj2: obj2
};

obj1.obj2.foo(); // 42
```

对象属性引用链中只有最顶层或者说最后层会影响调用位置。

Implicitly Lost

隐式丢失，一个容易出现的问题是会丢失绑定对象，回到默认绑定上。

```
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

var bar = obj.foo; // function reference/alias!

var a = "oops, global"; // `a` also property on global object

bar(); // "oops, global"
```

bar()作为obj.foo的引用，bar()的this是默认绑定，下面是一个更清晰的解释。

```
function foo() {
    console.log( this.a );
}

function doFoo(fn) {
    // `fn` is just another reference to `foo`

    fn(); // <-- call-site!
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // `a` also property on global object

doFoo( obj.foo ); // "oops, global"
```

obj.foo参数传递只是作为隐式赋值，传入函数式会被隐式赋值。

```
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2,
    foo: foo
};

var a = "oops, global"; // `a` also property on global object

setTimeout( obj.foo, 100 ); // "oops, global"
```

```
function setTimeout(fn,delay) {
    // wait (somehow) for `delay` milliseconds
    fn(); // <-- call-site!
}
```

setTimeout提供一个内建的javascript运行环境。

### Explicit Binding

显式绑定，使用foo.call(..)、call(..) 或 apply(..)将obj绑定到this。

```
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2
};

foo.call( obj ); // 2
```

使用call将obj强制绑定到this上。如果传入的绑定对象是string、boolean、number类型，会使用为new String(..)、new Boolean(..)、 new Number(..)的形式。

Hard Binding

```
function foo() {
    console.log( this.a );
}

var obj = {
    a: 2
};

var bar = function() {
    foo.call( obj );
};

bar(); // 2
setTimeout( bar, 100 ); // 2

// `bar` hard binds `foo`'s `this` to `obj`
// so that it cannot be overriden
bar.call( window ); // 2
```

创建函数bar()调用foo.call(obj),因此this绑定到了foo 和 obj上，不管之后怎么修改都不会重新绑定。

```
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = function() {
    return foo.apply( obj, arguments );
};

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

另外一种表达

```
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

// simple `bind` helper
function bind(fn, obj) {
    return function() {
        return fn.apply( obj, arguments );
    };
}

var obj = {
    a: 2
};

var bar = bind( foo, obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

Function.prototype.bind已经是es5的一个内建方法。bind返回一个绑定原始函数的新的函数并使用this的当前上下文环境。

```
function foo(something) {
    console.log( this.a, something );
    return this.a + something;
}

var obj = {
    a: 2
};

var bar = foo.bind( obj );

var b = bar( 3 ); // 2 3
console.log( b ); // 5
```

API Call "Contexts"

一些JavaScript内建函数提供参数选项用于绑定this上下文，这些方法通常使用显示绑定。

```
function foo(el) {
    console.log( el, this.id );
}

var obj = {
    id: "awesome"
};

// use `obj` as `this` for `foo(..)` calls
[1, 2, 3].forEach( foo, obj ); // 1 awesome  2 awesome  3 awesome
```

### new Binding

constructors作为函数附加的方法，当class使用new关键字初始化时，constructors就被调用。

```
something = new MyClass(..);
```

new调用函数会自动执行下面操作

- 创建（或者构造）一个新的对象

- 原型指向到新的构造对象上

- 构造对象绑定到函数调用上

- 如果函数没有返回其他对象，那么new表达式中的函数调用会自动返回这个新构造对象

```
function foo(a) {
    this.a = a;
}

var bar = new foo( 2 );
console.log( bar.a ); // 2
```

## 优化级

了解规则之后，this绑定对象需要找到函数的调用位置并判断使用规则。当this调用位置有多条规则同时触发，规则的优先级是怎样的？

默认绑定的优先级最低

显式绑定的优先级比隐式绑定的优先级高

```
function foo() {
    console.log( this.a );
}

var obj1 = {
    a: 2,
    foo: foo
};

var obj2 = {
    a: 3,
    foo: foo
};

obj1.foo(); // 2
obj2.foo(); // 3

obj1.foo.call( obj2 ); // 3
obj2.foo.call( obj1 ); // 2
```

new绑定比隐式绑定优先级高

```
function foo(something) {
    this.a = something;
}

var obj1 = {
    foo: foo
};

var obj2 = {};

obj1.foo( 2 );
console.log( obj1.a ); // 2

obj1.foo.call( obj2, 3 );
console.log( obj2.a ); // 3

var bar = new obj1.foo( 4 );
console.log( obj1.a ); // 2
console.log( bar.a ); // 4
```

new 和 call/apply不能同时使用，new foo.call(obj1)是不允许的。我们可以通过硬绑定测试这两种规则。

function.prototype.bind(..)

```
function foo(something) {
    this.a = something;
}

var obj1 = {};

var bar = foo.bind( obj1 );
bar( 2 );
console.log( obj1.a ); // 2

var baz = new bar( 3 );
console.log( obj1.a ); // 2
console.log( baz.a ); // 3
```

```
function bind(fn, obj) {
    return function() {
        fn.apply( obj, arguments );
    };
}
```

MDN网页上为bind(..)提供的polyfill（低版本兼容填补工具）

```
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError( "Function.prototype.bind - what " +
                "is trying to be bound is not callable"
            );
        }

        var aArgs = Array.prototype.slice.call( arguments, 1 ),
            fToBind = this,
            fNOP = function(){},
            fBound = function(){
                return fToBind.apply(
                    (
                        this instanceof fNOP &&
                        oThis ? this : oThis
                    ),
                    aArgs.concat( Array.prototype.slice.call( arguments ) )
                );
            }
        ;

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
```

new覆盖了硬绑定对象，new绑定的优先级更高

为什么new可以覆盖 硬绑定 这件事很有用？

主要原因是，创建一个实质上忽略this的 硬绑定 而预先设置一部分或所有的参数的函数（这个函数可以与new一起使用来构建对象）。bind(..)的一个能力是，任何在第一个this绑定参数之后被传入的参数，默认地作为当前函数的标准参数（技术上这称为“局部应用（partial application）”，是一种“柯里化（currying）”）

```
function foo(p1,p2) {
    this.val = p1 + p2;
}

// using `null` here because we don't care about
// the `this` hard-binding in this scenario, and
// it will be overridden by the `new` call anyway!
var bar = foo.bind( null, "p1" );

var baz = new bar( "p2" );

baz.val; // p1p2
```

如何明确this绑定对象？

- 函数是否是new绑定？如果是，this绑定的是新创建的对象。

```
var bar = new Foo();
```

- 函数是否通过call、apply显示绑定或硬绑定？如果是，this绑定的是指定的对象。

```
var bar = foo.call(obj);
```

- 函数是否在某个上下文对象中隐式调用？如果是，this绑定的是那个上下文对象。

```
var bar = obj.foo();
```

- 上述全不是，则使用默认绑定。如果在严格模式下，就绑定到undefined，否则绑定到全局window对象。

```
var bar = foo();
```

## 特殊的绑定

### Ignored this（忽略this）

把null或undefined作为this的绑定对象传入call、apply、bind，调用时会被忽略，使用默认绑定。

```
function foo() {
    console.log( this.a );
}

var a = 2;

foo.call( null ); // 2
```

故意使用null绑定this的情况

使用apply(..)来将一个数组散开，从而作为函数调用的参数，是一个很常见的做法。bind(..)可以使用curry参数（预设值）。

```
function foo(a,b) {
    console.log( "a:" + a + ", b:" + b );
}

// spreading out array as parameters
foo.apply( null, [2, 3] ); // a:2, b:3

// currying with `bind(..)`
var bar = foo.bind( null, 2 );
bar( 3 ); // a:2, b:3
```

使用null绑定this会导致隐藏的危险，比如使用第三方库，使用null调用，而且那些函数确实使用了this引用，那么意味着它可能会使用默认绑定，会导致多种麻烦的诊断和难以追踪的Bug。

### Safer this

或许一个更安全的实践是为this传递一个特别绑定一个不会对程序产生副作用的对象。

DMZ (de-militarized zone) object（隔离区/非军事化区），一个完全空的、没有任何委托的对象。

我们对不关心的this可以传递一个DMZ对象，确保隐藏/意外的使用this限制在这个空对象中。对象和程序的全局对象隔离开。

变量名可以为ø（空集合的数学符号的小写）或者其他喜欢用的名字

创建完全为空的对象的最简单方法就是Object.create(null)，和{}类似，但没有Object.prototype的委托。

```
function foo(a,b) {
    console.log( "a:" + a + ", b:" + b );
}

// our DMZ empty object
var ø = Object.create( null );

// spreading out array as parameters
foo.apply( ø, [2, 3] ); // a:2, b:3

// currying with `bind(..)`
var bar = foo.bind( ø, 2 );
bar( 3 ); // a:2, b:3
```

### Indirection（间接引用）

创建函数的间接引用，当函数被调用时，默认绑定规则也会生效。

一个通用的间接引用方法是赋值

```
function foo() {
    console.log( this.a );
}

var a = 2;
var o = { a: 3, foo: foo };
var p = { a: 4 };

o.foo(); // 3
(p.foo = o.foo)(); // 2
```

赋值表达式p.foo = o.foo的 结果值 是一个刚好指向底层函数对象的引用。起作用的调用点就是foo()，而非你期待的p.foo()或o.foo()。默认规则生效。

在strict mode下，this引用的值是函数调用的上下文决定的，而不是函数的调用点。

### Softening Binding（软绑定）

硬绑定是一种通过强制函数绑定到特定的this上，来防止函数调用在不经意间退回到 默认绑定 的策略（除非你用new去覆盖它）。

硬绑定的问题是降低了函数的灵活性，阻止我们用隐式绑定或者显式绑定去覆盖的目的。

为默认绑定提供不同的默认值（global或undefined），同时让函数可以通过隐式绑定或显式绑定来绑定this。

可以构建一个软绑定来模拟实现

```
if (!Function.prototype.softBind) {
    Function.prototype.softBind = function(obj) {
        var fn = this,
            curried = [].slice.call( arguments, 1 ),
            bound = function bound() {
                return fn.apply(
                    (!this ||
                        (typeof window !== "undefined" &&
                            this === window) ||
                        (typeof global !== "undefined" &&
                            this === global)
                    ) ? obj : this,
                    curried.concat.apply( curried, arguments )
                );
            };
        bound.prototype = Object.create( fn.prototype );
        return bound;
    };
}
```

softBind(..)工具的工作方式和ES5内建的bind(..)方法类似，除了软绑定行为。封装一个特殊函数逻辑在调用时检查this，如果它是global或undefined，就使用预先指定的默认值 （obj），否则保持this不变。其他方式，this处于未改变的状态，它也提供了可选的柯里化参数。

```
function foo() {
   console.log("name: " + this.name);
}

var obj = { name: "obj" },
    obj2 = { name: "obj2" },
    obj3 = { name: "obj3" };

var fooOBJ = foo.softBind( obj );

fooOBJ(); // name: obj

obj2.foo = foo.softBind(obj);
obj2.foo(); // name: obj2   <---- look!!!

fooOBJ.call( obj3 ); // name: obj3   <---- look!

setTimeout( obj2.foo, 10 ); // name: obj   <---- falls back to soft-binding
```

## Lexical this

箭头函数不是通过function声明的，而是通过fat arrow操作符=>。与使用4种标准的this规则不同的是，箭头函数从包含它的（function或global）作用域采用this绑定。

```
function foo() {
    // return an arrow function
    return (a) => {
        // `this` here is lexically adopted from `foo()`
        console.log( this.a );
    };
}

var obj1 = {
    a: 2
};

var obj2 = {
    a: 3
};

var bar = foo.call( obj1 );
bar.call( obj2 ); // 2, not 3!
```

foo()把obj1绑定到this，bar（一个通过箭头函数返回的引用）的this也绑定了obj1。箭头函数的词法绑定不能被其他方式覆盖（即使是new）。

常用的用法是回调方法，时间句柄或者计时器。

```
function foo() {
    setTimeout(() => {
        // `this` here is lexically adopted from `foo()`
        console.log( this.a );
    },100);
}

var obj = {
    a: 2
};

foo.call( obj ); // 2
```

ES6之前的处理方法

```
function foo() {
    var self = this; // 词法上捕获`this`
    setTimeout( function(){
        console.log( self.a );
    }, 100 );
}

var obj = {
    a: 2
};

foo.call( obj ); // 2
```

self = this和箭头函数本质上都是避开了this的作用机制。

不要混用this风格和词法绑定风格的写法。

## 原文

[You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch2.md)