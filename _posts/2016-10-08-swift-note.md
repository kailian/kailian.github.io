---
layout: post
category : iOS
title: 'swift-note'
tagline: ""
tags : [iOS,swift]
---

## 关于swift

> Swift is a powerful and intuitive programming language for macOS, iOS, watchOS and tvOS

### swfit3 features

- Open Source（开源）

- Refined API Naming（重新定义swift2的API命令）

- Modern（现代化）

- Closures unified with function pointers（闭包）

- Tuples and multiple return values（元组）

- Generics（泛型）

- Fast and concise iteration over a range or collection

- Structs that support methods, extensions, and protocols

- Functional programming patterns, e.g., map and filter

- Native error handling using try / catch / throw

<!--break-->

更新 xcode 到 xcode 8，命令行输入swift

```
swift
Welcome to Apple Swift version 3.0 (swiftlang-800.0.46.2 clang-800.0.38). Type :help for assistance.
  1> :help
...

Debugger commands:

  apropos           -- List debugger commands related to a word or subject.
  breakpoint        -- Commands for operating on breakpoints (see 'help b' for shorthand.)
...
```

## 基本概念

### hello world

```
print("Hello, world")
print("")
```

### 基础数据类型

- Int表示整型值； 

- Double 和 Float 表示浮点型值； 

- Bool 是布尔型值；

- String 是文本型数据。 

Swift 还提供了三个基本的集合类型，Array ，Set 和 Dictionary

nil 表示没有值

常量和变量

let来声明常量，使用var来声明变量。常量与变量名不能包含数学符号，箭头，保留的（或者非法的）Unicode 码位，连线与制表符。也不能以数字开头。声明一个可选常量或者变量但是没有赋值，它们会自动被设置为 nil。变量一旦定义，其类型不可更改。

```
var myVariable = 42 
myVariable = 50 
let myConstant = 42

var surveyAnswer: String?
// surveyAnswer 被自动设置为 nil
```

类型安全和类型推断

```
let myConstant = 42
// myConstant 会被推测为 Int 类型
```

类型标注

```
var welcomeMessage: String
```

字符串格式化，将常量或变量名放入圆括号中，并在开括号前使用反斜杠将其转义

```
let apples = 3
let oranges = 5
let appleSummary = "I have \(apples) apples."
let fruitSummary = "I have \(apples + oranges) pieces of fruit."
```

可选类型(Optional): 代表变量可能有值的情况。形式: var 变量 : 类型? ,默认是无值(nil)

```
var addr : String? = "addr"
```

### 元组（Tuples）

把多个值组合成一个复合值

```
let http404Error = (404, "Not Found")
let http200Status = (statusCode: 200, description: "OK")
```

将一个元组的内容分解（decompose）成单独的常量和变量，要忽略的部分用下划线（_）标记

```
let (statusCode, statusMessage) = http404Error
let (justTheStatusCode, _) = http404Error
```

### 注释

```
// 这是一个注释
/* 这是一个,
多行注释 */
```

swfit 支持在注释中使用markdown编写文档

[代码注释中使用 Markdown 并生成在线文档](http://www.jianshu.com/p/2388dd995e4e/comments/3074937)

### 错误处理

```
func canThrowAnError() throws {
    // 这个函数有可能抛出错误
}

do {
    try canThrowAnError()
    // 没有错误消息抛出
} catch {
    // 有一个错误消息抛出
}

do {
    try makeASandwich()
    eatASandwich()
} catch SandwichError.outOfCleanDishes {
    washDishes()
} catch SandwichError.missingIngredients(let ingredients) {
    buyGroceries(ingredients)
}
```

## 运算符（Operators）

- 赋值运算符

- 算术运算符

- 组合赋值运算符

- 比较运算符

- 三目运算符

- 空合运算符

- 区间运算符

- 逻辑运算符

闭区间运算符

闭区间运算符（a...b）定义一个包含从 a 到 b（包括 a 和 b）的所有值的区间。a 的值不能超过 b。 ‌ 

```
for index in 1...5 {
    print("\(index) * 5 = \(index * 5)")
}
```

半开区间运算符

半开区间（a..`<`b）定义一个从 a 到 b 但不包括 b 的区间。 之所以称为半开区间，是因为该区间包含第一个值而不包括最后的值。

```
let names = ["Anna", "Alex", "Brian", "Jack"]
let count = names.count
for i in 0..<count {
    print("第 \(i + 1) 个人叫 \(names[i])")
}
```

## 集合类型 (Collection Types)

数组（Arrays）是有序数据的集。集合（Sets）是无序无重复数据的集。字典（Dictionaries）是无序的键值对的集。Swift 的Arrays、Sets和Dictionaries类型被实现为泛型集合。

![CollectionTypes](/images/201610/CollectionTypes_intro_2x.png)

数组(Arrays)

数组使用有序列表存储同一类型的多个值。相同的值可以多次出现在一个数组的不同位置中。

集合(Set)

集合用来存储相同类型并且没有确定顺序的值。当集合元素顺序不重要时或者希望确保每个元素只出现一次时可以使用集合而不是数组。

字典（Dictionaries）

字典是一种存储多个相同类型的值的容器。每个值（value）都关联唯一的键（key），键作为字典中的这个值数据的标识符。和数组中的数据项不同，字典中的数据项并没有具体顺序。

用方括号[]来创建数组和字典

```
var shoppingList = ["catfish", "water", "tulips", "blue paint"]
shoppingList[1] = "bottle of water"

var occupations = [
    "Malcolm": "Captain",
    "Kaylee": "Mechanic",
]
occupations["Jayne"] = "Public Relations"
```

创建空数组和空字典

```
let emptyArray = String[]() 
let emptyDictionary = Dictionary<String, Float>()
```

遍历数组

```
for item in shoppingList {
    print(item)
}

for (index, value) in shoppingList.enumerate() {
    print("Item \(String(index + 1)): \(value)")
}
```

## 控制流（Control Flow）

For-In 循环

```
for index in 1...5 {
    print("\(index) times 5 is \(index * 5)")
}
```

While 循环

```
while condition {  
    statements
}
```

```
repeat {
    statements
} while condition
```

条件语句

if语句最简单的形式就是只包含一个条件，只有该条件为true时，才执行相关代码

Switch

```
switch some value to consider {
case value 1:
    respond to value 1
case value 2,
     value 3:
    respond to value 2 or 3
default:
    otherwise, do something else
}

switch approximateCount {
case 0:
    naturalCount = "no"
case 1..<5:
    naturalCount = "a few"
case 5..<12:
    naturalCount = "several"
case 12..<100:
    naturalCount = "dozens of"
case 100..<1000:
    naturalCount = "hundreds of"
default:
    naturalCount = "many"
}
```

控制转移语句

- continue 停止本次循环

- break 结束整个控制流的执行

- fallthrough

- return

- throw

```
let integerToDescribe = 5
var description = "The number \(integerToDescribe) is"
switch integerToDescribe {
case 2, 3, 5, 7, 11, 13, 17, 19:
    description += " a prime number, and also"
    fallthrough
default:
    description += " an integer."
}
print(description)
// 输出 "The number 5 is a prime number, and also an integer."
```

## 函数和闭包

### 函数（Functions）

以 `func` 作为前缀。指定函数返回类型时，用返回箭头 ->（一个连字符后跟一个右尖括号）后跟返回类型的名称的方式来表示。没有定义返回类型的函数会返回一个特殊的Void值。它其实是一个空的元组（tuple），没有任何元素，可以写成()

```
func greet(person: String) -> String {
    let greeting = "Hello, " + person + "!"
    return greeting
}
```

无参数

```
func sayHelloWorld() -> String {
    return "hello, world"
}
```

多参数

```
func greet(person: String, alreadyGreeted: Bool) -> String {
    if alreadyGreeted {
        return greetAgain(person: person)
    } else {
        return greet(person: person)
    }
}
```

无返回值

```
func greet(person: String) {
    print("Hello, \(person)!")
}
```

多重返回值

```
func minMax(array: [Int]) -> (min: Int, max: Int) {
    var currentMin = array[0]
    var currentMax = array[0]
    for value in array[1..<array.count] {
        if value < currentMin {
            currentMin = value
        } else if value > currentMax {
            currentMax = value
        }
    }
    return (currentMin, currentMax)
}
```

可选元组返回类型

通过在元组类型的右括号后放置一个问号来定义一个可选元组，例如 (Int, Int)? 或 (String, Int, Bool)?

```
func minMax(array: [Int]) -> (min: Int, max: Int)? {
    if array.isEmpty { return nil }
    var currentMin = array[0]
    var currentMax = array[0]
    for value in array[1..<array.count] {
        if value < currentMin {
            currentMin = value
        } else if value > currentMax {
            currentMax = value
        }
    }
    return (currentMin, currentMax)
}
```

默认参数值

```
func someFunction(parameterWithoutDefault: Int, parameterWithDefault: Int = 12) {
    // If you omit the second argument when calling this function, then
    // the value of parameterWithDefault is 12 inside the function body.
}
```

可变参数

一个可变参数（variadic parameter）可以接受零个或多个值。通过在变量类型名后面加入（...）的方式来定义可变参数。

```
func arithmeticMean(_ numbers: Double...) -> Double {
    var total: Double = 0
    for number in numbers {
        total += number
    }
    return total / Double(numbers.count)
}
```

使用函数类型

```
var mathFunction: (Int, Int) -> Int = addTwoInts
```

嵌套函数

```
func chooseStepFunction(backward: Bool) -> (Int) -> Int {
    func stepForward(input: Int) -> Int { return input + 1 }
    func stepBackward(input: Int) -> Int { return input - 1 }
    return backward ? stepBackward : stepForward
}
```

### 闭包（Closures）

- 全局函数是一个有名字但不会捕获任何值的闭包

- 嵌套函数是一个有名字并可以捕获其封闭函数域内值的闭包

- 闭包表达式是一个利用轻量级语法所写的可以捕获其上下文中变量或常量值的匿名闭包

优化：

- 利用上下文推断参数和返回值类型

- 隐式返回单表达式闭包，即单表达式闭包可以省略 return 关键字

- 参数名称缩写

- 尾随（Trailing）闭包语法

闭包表达式语法

```
{ (parameters) -> returnType in
    statements
}
```

```
reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in
    return s1 > s2
})
```

优化

```
reversedNames = names.sorted(by: { (s1: String, s2: String) -> Bool in return s1 > s2 } )
```

根据上下文推断类型

```
reversedNames = names.sorted(by: { s1, s2 in return s1 > s2 } )
```

单表达式闭包隐式返回

```
reversedNames = names.sorted(by: { s1, s2 in s1 > s2 } )
```

参数名称缩写

```
reversedNames = names.sorted(by: { $0 > $1 } )
```

运算符方法

```
reversedNames = names.sorted(by: >)
```

尾随闭包

```
// 以下是不使用尾随闭包进行函数调用
someFunctionThatTakesAClosure(closure: {
    // 闭包主体部分
})

// 以下是使用尾随闭包进行函数调用
someFunctionThatTakesAClosure() {
    // 闭包主体部分
}
```

```
reversedNames = names.sorted() { $0 > $1 }
//闭包表达式是函数或方法的唯一参数，使用尾随闭包时，可以把 () 省略掉
reversedNames = names.sorted { $0 > $1 }
```

## 枚举（Enumerations）

枚举语法

```
enum SomeEnumeration {
    // 枚举定义放在这里
}

enum CompassPoint {
    case north
    case south
    case east
    case west
}

enum Planet {
    case mercury, venus, earth, mars, jupiter, saturn, uranus, neptune
}
```

## 类和结构体

通常一个类的实例被称为对象，类是引用类型

类和结构体的选择，结构体实例总是通过值传递，类实例总是通过引用传递。

考虑构建结构体

- 该数据结构的主要目的是用来封装少量相关简单数据值。

- 有理由预计该数据结构的实例在被赋值或传递时，封装的数据将会被拷贝而不是被引用。

- 该数据结构中储存的值类型属性，也应该被拷贝，而不是被引用。

- 该数据结构不需要去继承另一个既有类型的属性或者行为。

class 和 struct 关键字定义

```
struct SomeStructure {
    // structure definition goes here
}
class SomeClass {
    // class definition goes here
}
```

```
struct Resolution {
    var width = 0
    var height = 0
}
class VideoMode {
    var resolution = Resolution()
    var interlaced = false
    var frameRate = 0.0
    var name: String?
}

let someResolution = Resolution()
let someVideoMode = VideoMode()

someVideoMode.resolution.width = 1280

let vga = Resolution(width:640, height: 480)
```

```
let hd = Resolution(width: 1920, height: 1080)
var cinema = hd
cinema.width = 2048
```

示例中又声明了一个名为cinema的变量，并将hd赋值给它。因为Resolution是一个结构体，所以cinema的值其实是hd的一个拷贝副本，而不是hd本身。


## 面向对象

### 构造

```
init() {
    // 在此处执行构造过程
}
```

```
struct Fahrenheit {
    var temperature: Double
    init() {
        temperature = 32.0
    }
}
```

```
class SurveyQuestion {
    var text: String
    var response: String?
    init(text: String) {
        self.text = text
    }
    func ask() {
        print(text)
    }
}
let cheeseQuestion = SurveyQuestion(text: "Do you like cheese?")
cheeseQuestion.ask()
// 输出 "Do you like cheese?"
cheeseQuestion.response = "Yes, I do like cheese."
```

如果结构体或类的所有属性都有默认值，同时没有自定义的构造器，那么 Swift 会给这些结构体或类提供一个默认构造器（default initializers）。这个默认构造器将简单地创建一个所有属性值都设置为默认值的实例。

```
struct Size {
    var width = 0.0, height = 0.0
}
let twoByTwo = Size(width: 2.0, height: 2.0)
```

子类构造器

```
class Bicycle: Vehicle {
    override init() {
        super.init()
        numberOfWheels = 2
    }
}
```

### 析构

析构器只适用于类类型，当一个类的实例被释放之前，析构器会被立即调用。析构器用关键字deinit来标示，类似于构造器要用init来标示。

```
deinit {
    // 执行析构过程
}
```

```
class Player {
    var coinsInPurse: Int
    init(coins: Int) {
        coinsInPurse = Bank.vendCoins(coins)
    }
    func winCoins(coins: Int) {
        coinsInPurse += Bank.vendCoins(coins)
    }
    deinit {
        Bank.receiveCoins(coinsInPurse)
    }
}
```

### 继承

不继承于其它类的类，称之为基类。Swift支持继承和多态（override父类方法）。重写，子类可以为继承来的实例方法（instance method），类方法（class method），实例属性（instance property），或下标（subscript）提供自己定制的实现（implementation）。

```
class SomeClass: SomeSuperclass {
    // 这里是子类的定义
}
```

```
class Vehicle {
    var currentSpeed = 0.0
    var description: String {
        return "traveling at \(currentSpeed) miles per hour"
    }
    func makeNoise() {
        // 什么也不做-因为车辆不一定会有噪音
    }
}

class Bicycle: Vehicle {
    var hasBasket = false
}

class Tandem: Bicycle {
    var currentNumberOfPassengers = 0
}
```

``` 
class NamedShape {
    var numberOfSides: Int = 0
    var name: String
  
    init(name: String) {
        self.name = name
    }
  
    func simpleDescription() -> String {
        return "A shape with \(numberOfSides) sides."
    }
}

class EquilateralTriangle: NamedShape {
    var sideLength: Double = 0.0
 
    init(sideLength: Double, name: String) {
        self.sideLength = sideLength
        super.init(name: name)
        numberOfSides = 3
    }
 
    var perimeter: Double {
        get {
            return 3.0 * sideLength
        }
        set {
            sideLength = newValue / 3.0
        }
    }
 
    override func simpleDescription() -> String {
        return "An equilateral triagle with sides of length \(sideLength)."
    }
} 
var triangle = EquilateralTriangle(sideLength: 3.1, name: "a triangle")
triangle.perimeter
triangle.perimeter = 9.9
triangle.sideLength
```

注意：赋值器（setter）中，接收的值被自动命名为newValue

调用方法

函数的参数名称只能在函数内部使用，但方法的参数名称除了在内部使用外还可以在外部使用（第一个参数除外）

```
class Counter {
    var count: Int = 0
    func incrementBy(amount: Int, numberOfTimes times: Int) {
        count += amount * times
    }
} 
var counter = Counter()
counter.incrementBy(2, numberOfTimes: 7)
```

方法参数取别名：在上面的代码里，numberOfTimes面向外部，times面向内部

## 协议（Protocols）

使用protocol关键字定义协议

```
protocol SomeProtocol {
    // 这里是协议的定义部分
}
```

要让自定义类型采纳某个协议，在定义类型时，需要在类型名称后加上协议名称，中间以冒号（:）分隔。采纳多个协议时，各协议之间用逗号（,）分隔

```
struct SomeStructure: FirstProtocol, AnotherProtocol {
    // 这里是结构体的定义部分
}
```

拥有父类的类在采纳协议时，应该将父类名放在协议名之前，以逗号分隔

```
class SomeClass: SomeSuperClass, FirstProtocol, AnotherProtocol {
    // 这里是类的定义部分
}
```

协议总是用 var 关键字来声明变量属性，在类型声明后加上 { set get } 来表示属性是可读可写的，可读属性则用 { get } 来表示

用 static 关键字/class 关键字作为前缀来声明类型属性

```
protocol SomeProtocol {
    var mustBeSettable: Int { get set }
    var doesNotNeedToBeSettable: Int { get }
}

protocol AnotherProtocol {
    static var someTypeProperty: Int { get set }
}
```

```
protocol FullyNamed {
    var fullName: String { get }
}

struct Person: FullyNamed {
    var fullName: String
}

let john = Person(fullName: "John Appleseed")


class Starship: FullyNamed {
    var prefix: String?
    var name: String
    init(name: String, prefix: String? = nil) {
        self.name = name
        self.prefix = prefix
    }
    var fullName: String {
        return (prefix != nil ? prefix! + " " : "") + name
    }
}
var ncc1701 = Starship(name: "Enterprise", prefix: "USS")
// ncc1701.fullName 是 "USS Enterprise"
```

协议可以要求采纳协议的类型实现某些指定的实例方法或类方法。这些方法作为协议的一部分，像普通方法一样放在协议的定义中，但是不需要大括号和方法体。可以在协议中定义具有可变参数的方法，和普通方法的定义方式相同。但是，不支持为协议中的方法的参数提供默认值。

```
protocol SomeProtocol {
    static func someTypeMethod()
}

protocol RandomNumberGenerator {
    func random() -> Double
}

class LinearCongruentialGenerator: RandomNumberGenerator {
    var lastRandom = 42.0
    let m = 139968.0
    let a = 3877.0
    let c = 29573.0
    func random() -> Double {
        lastRandom = ((lastRandom * a + c) % m)
        return lastRandom / m
    }
}
let generator = LinearCongruentialGenerator()
print("Here's a random number: \(generator.random())")
// 打印 “Here's a random number: 0.37464991998171”
print("And another one: \(generator.random())")
// 打印 “And another one: 0.729023776863283”
```

mutating 关键字，表示可以在该方法中修改它所属的实例以及实例的任意属性的值

实现协议中的 mutating 方法时，若是类类型，则不用写 mutating 关键字。而对于结构体和枚举，则必须写 mutating 关键字。


```
protocol Togglable {
    mutating func toggle()
}

enum OnOffSwitch: Togglable {
    case Off, On
    mutating func toggle() {
        switch self {
        case Off:
            self = On
        case On:
            self = Off
        }
    }
}
var lightSwitch = OnOffSwitch.Off
lightSwitch.toggle()
// lightSwitch 现在的值为 .On
```

协议可以要求采纳协议的类型实现指定的构造器。必须为构造器实现标上 required 修饰符；一个子类重写了父类的指定构造器，并且该构造器满足了某个协议的要求，那么该构造器的实现需要同时标注 required 和 override 修饰符。

```
protocol SomeProtocol {
    init(someParameter: Int)
}

class SomeClass: SomeProtocol {
    required init(someParameter: Int) {
        // 这里是构造器的实现部分
    }
}

protocol SomeProtocol {
    init()
}

class SomeSuperClass {
    init() {
        // 这里是构造器的实现部分
    }
}

class SomeSubClass: SomeSuperClass, SomeProtocol {
    // 因为采纳协议，需要加上 required
    // 因为继承自父类，需要加上 override
    required override init() {
        // 这里是构造器的实现部分
    }
}
```

协议可以像其他普通类型一样使用，使用大写字母开头的驼峰式写法

- 作为函数、方法或构造器中的参数类型或返回值类型

- 作为常量、变量或属性的类型

- 作为数组、字典或其他容器中的元素类型

```
class Dice {
    let sides: Int
    let generator: RandomNumberGenerator
    init(sides: Int, generator: RandomNumberGenerator) {
        self.sides = sides
        self.generator = generator
    }
    func roll() -> Int {
        return Int(generator.random() * Double(sides)) + 1
    }
}

var d6 = Dice(sides: 6, generator: LinearCongruentialGenerator())
for _ in 1...5 {
    print("Random dice roll is \(d6.roll())")
}
// Random dice roll is 3
// Random dice roll is 5
```

委托（代理）模式，允许类或结构体将一些需要它们负责的功能委托给其他类型的实例。委托模式的实现很简单：定义协议来封装那些需要被委托的功能，这样就能确保采纳协议的类型能提供这些功能。委托模式可以用来响应特定的动作，或者接收外部数据源提供的数据，而无需关心外部数据源的类型。

```
protocol DiceGame {
    var dice: Dice { get }
    func play()
}

protocol DiceGameDelegate {
    func gameDidStart(game: DiceGame)
    func game(game: DiceGame, didStartNewTurnWithDiceRoll diceRoll:Int)
    func gameDidEnd(game: DiceGame)
}

class SnakesAndLadders: DiceGame {
    let finalSquare = 25
    let dice = Dice(sides: 6, generator: LinearCongruentialGenerator())
    var square = 0
    var board: [Int]
    init() {
        board = [Int](count: finalSquare + 1, repeatedValue: 0)
        board[03] = +08; board[06] = +11; board[09] = +09; board[10] = +02
        board[14] = -10; board[19] = -11; board[22] = -02; board[24] = -08
    }
    var delegate: DiceGameDelegate?
    func play() {
        square = 0
        delegate?.gameDidStart(self)
        gameLoop: while square != finalSquare {
            let diceRoll = dice.roll()
            delegate?.game(self, didStartNewTurnWithDiceRoll: diceRoll)
            switch square + diceRoll {
            case finalSquare:
                break gameLoop
            case let newSquare where newSquare > finalSquare:
                continue gameLoop
            default:
                square += diceRoll
                square += board[square]
            }
        }
        delegate?.gameDidEnd(self)
    }
}

class DiceGameTracker: DiceGameDelegate {
    var numberOfTurns = 0
    func gameDidStart(game: DiceGame) {
        numberOfTurns = 0
        if game is SnakesAndLadders {
            print("Started a new game of Snakes and Ladders")
        }
        print("The game is using a \(game.dice.sides)-sided dice")
    }
    func game(game: DiceGame, didStartNewTurnWithDiceRoll diceRoll: Int) {
        numberOfTurns += 1
        print("Rolled a \(diceRoll)")
    }
    func gameDidEnd(game: DiceGame) {
        print("The game lasted for \(numberOfTurns) turns")
    }
}

let tracker = DiceGameTracker()
let game = SnakesAndLadders()
game.delegate = tracker
game.play()
// Started a new game of Snakes and Ladders
// The game is using a 6-sided dice
// Rolled a 3
// Rolled a 5
// Rolled a 4
// Rolled a 5
// The game lasted for 4 turns
```

通过扩展添加协议一致性

```
protocol TextRepresentable {
    var textualDescription: String { get }
}

extension Dice: TextRepresentable {
    var textualDescription: String {
        return "A \(sides)-sided dice"
    }
}

let d12 = Dice(sides: 12, generator: LinearCongruentialGenerator())
print(d12.textualDescription)
// 打印 “A 12-sided dice”
```

协议合成，需要同时采纳多个协议，可以将多个协议采用 SomeProtocol & AnotherProtocol 这样的格式进行组合，称为 协议合成（protocol composition）。

```
protocol Named {
    var name: String { get }
}
protocol Aged {
    var age: Int { get }
}
struct Person: Named, Aged {
    var name: String
    var age: Int
}
func wishHappyBirthday(to celebrator: Named & Aged) {
    print("Happy birthday, \(celebrator.name), you're \(celebrator.age)!")
}
let birthdayPerson = Person(name: "Malcolm", age: 21)
wishHappyBirthday(to: birthdayPerson)
// 打印 “Happy birthday Malcolm - you're 21!”
```

检查协议一致性

- is 用来检查实例是否符合某个协议，若符合则返回 true，否则返回 false。

- as? 返回一个可选值，当实例符合某个协议时，返回类型为协议类型的可选值，否则返回 nil。

- as! 将实例强制向下转换到某个协议类型，如果强转失败，会引发运行时错误。


## 扩展（Extensions）

用关键字 extension 来声明扩展

```
extension SomeType {
    // 为 SomeType 添加的新功能写到这里
}
```

扩展一个已有类型，使其采纳一个或多个协议

```
extension SomeType: SomeProtocol, AnotherProctocol {
    // 协议实现写到这里
}
```

计算型属性（Computed Properties）

扩展可以为已有类型添加计算型实例属性和计算型类型属性。下面的例子为 Swift 的内建 Double 类型添加了五个计算型实例属性

```
extension Double {
    var km: Double { return self * 1_000.0 }
    var m : Double { return self }
    var cm: Double { return self / 100.0 }
    var mm: Double { return self / 1_000.0 }
    var ft: Double { return self / 3.28084 }
}
let oneInch = 25.4.mm
print("One inch is \(oneInch) meters")
// 打印 “One inch is 0.0254 meters”
let threeFeet = 3.ft
print("Three feet is \(threeFeet) meters")
// 打印 “Three feet is 0.914399970739201 meters”
```

构造器，扩展可以为已有类型添加新的构造器。

```
struct Size {
    var width = 0.0, height = 0.0
}
struct Point {
    var x = 0.0, y = 0.0
}
struct Rect {
    var origin = Point()
    var size = Size()
}

let defaultRect = Rect()
let memberwiseRect = Rect(origin: Point(x: 2.0, y: 2.0),
    size: Size(width: 5.0, height: 5.0))

// 一个额外的接受指定中心点和大小的构造器来扩展 Rect 结构体
extension Rect {
    init(center: Point, size: Size) {
        let originX = center.x - (size.width / 2)
        let originY = center.y - (size.height / 2)
        self.init(origin: Point(x: originX, y: originY), size: size)
    }
}

let centerRect = Rect(center: Point(x: 4.0, y: 4.0),
    size: Size(width: 3.0, height: 3.0))
// centerRect 的原点是 (2.5, 2.5)，大小是 (3.0, 3.0)
```

扩展可以为已有类型添加新的实例方法和类型方法。

```
extension Int {
    func repetitions(task: () -> Void) {
        for _ in 0..<self {
            task()
        }
    }
}

3.repetitions({
    print("Hello!")
})
// Hello!
```

可变实例方法

通过扩展添加的实例方法也可以修改该实例本身。结构体和枚举类型中修改 self 或其属性的方法必须将该实例方法标注为 mutating，正如来自原始实现的可变方法一样

```
extension Int {
    mutating func square() {
        self = self * self
    }
}
var someInt = 3
someInt.square()
// someInt 的值现在是 9
```

下标，扩展可以为已有类型添加新下标

```
extension Int {
    subscript(digitIndex: Int) -> Int {
        var decimalBase = 1
        for _ in 0..<digitIndex {
            decimalBase *= 10
        }
        return (self / decimalBase) % 10
    }
}
746381295[0]
// 返回 5
```

扩展可以为已有的类、结构体和枚举添加新的嵌套类型

```
extension Int {
    enum Kind {
        case Negative, Zero, Positive
    }
    var kind: Kind {
        switch self {
        case 0:
            return .Zero
        case let x where x > 0:
            return .Positive
        default:
            return .Negative
        }
    }
}

func printIntegerKinds(numbers: [Int]) {
    for number in numbers {
        switch number.kind {
        case .Negative:
            print("- ", terminator: "")
        case .Zero:
            print("0 ", terminator: "")
        case .Positive:
            print("+ ", terminator: "")
        }
    }
    print("")
}
printIntegerKinds([3, 19, -27, 0, -6, 0, 7])
// 打印 “+ + - 0 - 0 + ”
```

## 泛型（Generics）

泛型代码让你能够根据自定义的需求，编写出适用于任意类型、灵活可重用的函数及类型。它能让你避免代码的重复，用一种清晰和抽象的方式来表达代码的意图。

swapTwoInts(_:_:) 函数交换 b 的原始值到 a，并交换 a 的原始值到 b。

```
func swapTwoInts(inout a: Int, inout _ b: Int) {
    let temporaryA = a
    a = b
    b = temporaryA
}
var someInt = 3
var anotherInt = 107
swapTwoInts(&someInt, &anotherInt)
```

要交换两个 String 值或者 Double值，就不得不写更多的函数，swapTwoInts(_:_:)、swapTwoStrings(_:_:) 和 swapTwoDoubles(_:_:) 的函数功能都是相同的，唯一不同之处就在于传入的变量类型不同，分别是 Int、String 和 Double。

```
func swapTwoStrings(inout a: String, inout _ b: String) {
    let temporaryA = a
    a = b
    b = temporaryA
}

func swapTwoDoubles(inout a: Double, inout _ b: Double) {
    let temporaryA = a
    a = b
    b = temporaryA
}
```

泛型函数

```
func swapTwoValues<T>(inout a: T, inout _ b: T) {
    let temporaryA = a
    a = b
    b = temporaryA
}


func swapTwoInts(inout a: Int, inout _ b: Int)
func swapTwoValues<T>(inout a: T, inout _ b: T)
```

这个函数的泛型版本使用了占位类型名（在这里用字母 T 来表示）来代替实际类型名（例如 Int、String 或 Double）。占位类型名没有指明 T 必须是什么类型，但是它指明了 a 和 b 必须是同一类型 T，无论 T 代表什么类型。只有 swapTwoValues(_:_:) 函数在调用时，才能根据所传入的实际类型决定 T 所代表的类型。

T这个尖括号告诉 Swift 那个 T 是 swapTwoValues(_:_:) 函数定义内的一个占位类型名，因此 Swift 不会去查找名为 T 的实际类型。

```
var someInt = 3
var anotherInt = 107
swapTwoValues(&someInt, &anotherInt)
// someInt is now 107, and anotherInt is now 3

var someString = "hello"
var anotherString = "world"
swapTwoValues(&someString, &anotherString)
// someString is now "world", and anotherString is now "hello"
``` 

编写一个非泛型版本的栈，以 Int 型的栈为例

```
struct IntStack {
    var items = [Int]()
    mutating func push(item: Int) {
        items.append(item)
    }
    mutating func pop() -> Int {
        return items.removeLast()
    }
}
```

泛型版本的栈

```
struct Stack<Element> {
    var items = [Element]()
    mutating func push(item: Element) {
        items.append(item)
    }
    mutating func pop() -> Element {
        return items.removeLast()
    }
}
```

扩展一个泛型类型

```
extension Stack {
    var topItem: Element? {
        return items.isEmpty ? nil : items[items.count - 1]
    }
}
```

类型约束语法

```
func someFunction<T: SomeClass, U: SomeProtocol>(someT: T, someU: U) {
    // 这里是泛型函数的函数体部分
}
```

关联类型

定义了一个 Container 协议，该协议定义了一个关联类型 ItemType

```
protocol Container {
    associatedtype ItemType
    mutating func append(item: ItemType)
    var count: Int { get }
    subscript(i: Int) -> ItemType { get }
}

struct IntStack: Container {
    // IntStack 的原始实现部分
    var items = [Int]()
    mutating func push(item: Int) {
        items.append(item)
    }
    mutating func pop() -> Int {
        return items.removeLast()
    }
    // Container 协议的实现部分
    typealias ItemType = Int
    mutating func append(item: Int) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> Int {
        return items[i]
    }
}

struct Stack<Element>: Container {
    // Stack<Element> 的原始实现部分
    var items = [Element]()
    mutating func push(item: Element) {
        items.append(item)
    }
    mutating func pop() -> Element {
        return items.removeLast()
    }
    // Container 协议的实现部分
    mutating func append(item: Element) {
        self.push(item)
    }
    var count: Int {
        return items.count
    }
    subscript(i: Int) -> Element {
        return items[i]
    }
}
```


## 参考

- [developer-swift](https://developer.apple.com/swift/)

- [resources](https://developer.apple.com/swift/resources/)

- [getting-started](https://swift.org/getting-started/)

- [documentation](https://swift.org/documentation/)

- [Swift 学习指引](http://swiftguide.cn/)

- [jazzy](https://github.com/realm/jazzy)