# 模拟实现 new 操作符

如果你对面对对象编程有所了解的话，你对`new`操作符一定不会陌生。js也可以使用`new`来创建一个新的对象，今天我们就来看看`new`的实现原理，以及如何自己实现一个具备`new`功能的函数。

首先我们先来看一下[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)上对`new`操作符的介绍，它归结为以下四个步骤:
- 1. Creates a blank, plain JavaScript object; （创建一个简单对象）
- 2. Links (sets the constructor of) this object to another object; （链接这个对象到另一个对象上）
- 3. Passes the newly created object from Step 1 as the this context; （将第一步创建的对象作为`this`）
- 4. Returns this if the function doesn't return its own object. （如果函数没有返回对象的话，返回`this`）

OK，有一个大概的了解，我们就开始。

本文的内容，你需要有js的**原型对象**有所了解，推荐《javascript高级程序设计》一书。

首先来看一个例子：

```js
function Player(name) {
  this.name = name;
}
var player = new Player('Kobe')

console.info(player) // => Player { name: 'Kobe' }
```

首先，我们能直观看到的，是使用`new`操作符，**创建了一个`Player`的实例**，它有一个实例属性`name`，值为`"Kobe"`。但是，这个`player`实例，其实这时候已经被加上了一个内部属性`[[prototype]]`，大部分浏览器都会使用`__proto__`这个属性来表示这个对象。也就是说，我们的`player.__proto__`对象，就是它的原型对象（实际上它是一个指针，指向的是`Player.prototype`对象）。

所以，这个时候，有如下的关系：
```js
player.__proto__ === Player.prototype // true
// 或者使用 ES5 的方法：
Object.getPrototypeOf(player) === Player.prototype
```

还有一个，就是我们的`player`的`name`属性被正常赋值了，也就是说，函数中的`this`，实际上会绑定到我们的`player`对象上。

对此，总结上面的几点，`new`的功能如下：
- 返回一个新对象。**这里要提醒一下，如果函数返回了对象类型的值，那么这个值会作为`new`操作符的结果；如果返回的是基本类型，则会被忽略**。
- 绑定`this`。
- 把对象的``[[prototype]]``属性指向函数的`prototype`属性。

我们可以写出`new`的实现源码：

```js {5}
function newOp(Ctor, ...rest) {
  if (typeof Ctor !== 'function') {
    throw new Error('First argument must be a function')
  }
  var o = Object.create(Ctor.prototype)
  var result = Ctor.apply(o, rest)
  if (result instanceof Object) {
    return result
  }
  return o;
}

```

这里使用了`Object.create`来建立了对象和函数原型对象的关系，关于这个方法的介绍，可以参考[另一篇博文](./create.md)。**我们也可以使用 `Object.setPrototypeOf(o, Ctor.prototype)`来达到相同的目的**。

我们用上面的例子来测试一下：
```js
var player = newOp(Player, 'Fisher')

console.info(player.__proto__ === Player.prototype) // => true
console.info(player.name) // => Fisher
```

Done！
