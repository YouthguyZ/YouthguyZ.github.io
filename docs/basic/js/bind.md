
# 模拟 call, apply, bind 函数

## call

我们先来看一个例子：
```js
function getInfo(team, location) {
    return `This is ${this.name} from ${team}, ${location}`
}
var player = { name : 'kobe' }
var info = getInfo.call(player, 'Lakers', 'LA')
console.info(info)
// 输出: This is kobe from Lakers, LA
```

分析上面的`call`的作用，我们可以得出以下几个结论：

- 它让函数内部的`this`指向了我们的`player`对象，即相当于调用了`player.getInfo`
- 函数的参数和返回值都是正常工作的
- 没有给`player`对象和`getInfo`带来任何副作用。即使用`call`没有修改`player`或者`getInfo`

我们一步一步的解决，首先第一个，函数指向问题：

```js
// 这里我们使用 ES6 的语法
Function.prototype.myCall = function(context) {
  context = context || window
  context.fn = this
  context.fn()
}
```
`this` 在这里就是当前调用的函数，这样在调用的时候，就相当于让`this`指向了`context`。

其次就是参数和返回值，这也很简单，使用ES6的新语法，可以很方便的取到所有参数，然后执行获取结果即可；顺便，我们清理掉添加在`context`上的`fn`：
```js
Function.prototype.myCall = function(context, ...rest) {
  context = context || window
  context.fn = this
  var result = context.fn(...rest)
  delete context.fn
  return result
}
```

此时，我们的一个简易的`call`方法应该可以工作了，试一下：
```js
var a = getInfo.myCall({name:'jerry'}, 'A', 'B')
console.info(a) // 输出：This is jerry from A, B
```

最后还需要考虑一个问题，上面的例子是在我们假设这个`context`对象没有`fn`属性的情况下生效的，也就是说，如果它也有一个`fn`属性或者方法的话，那么就会出现问题。我们应该把这个属性名称设置为一个独一无二的值，不让它与我们对象中的属性有重复的可能性。其实ES6的`Symbol`一下子就可以解决了，但是我们这里自己去实现一个获取的方法，结合前面的代码，我们**最终实现**的代码如下：

```js
Function.prototype.myCall = function(context, ...rest) {
  context = context || window
  var uniqueID = '__' + Math.random() + Date.now()
  while (context.hasOwnProperty(uniqueID)) {
    uniqueID = '__' + Math.random() + Date.now()
  }
  context[uniqueID] = this
  var result = context[uniqueID](...rest)
  delete context[uniqueID]
  return result
}
```

## apply

`apply` 与 `call` 的区别仅在于参数传递格式不一样，这里根据上面的结果做一些修改即可：

```js
Function.prototype.myApply = function(context, argsArr) {
  context = context || window
  var uniqueID = Symbol() // 这里我们使用 Symbol 来作为key
  context[uniqueID] = this
  var result = context[uniqueID](...argsArr)
  delete context[uniqueID]
  return result
}
```

## bind

[MDN文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)。

MDN对`bind`函数的介绍：
> The bind() method creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.

`bind`函数**返回的是一个函数**，它的重要意义在于两个，一个是**绑定this**,一个是**初始化参数**。我们先来看一下它的用法：
```js
function test(name, age) {
    return `${name}, ${age}, ${this.msg}`
}
var bFn = test.bind({ msg: 'hehe' }, 'jerry')
bFn(23) // => jerry, 23, hehe
```

可以看到，`this`绑定到我们传入的对象`{msg: 'hehe'}`，所以打印出来的`this.msg`的值为`hehe`；其次，第一次绑定test函数的时候，我们传入了`name`参数，然后又在调用的时候，传入了`age`参数，这其实是一个叫做`偏函数`的概念，本章我们先不讨论这个。这两个参数在不同的时机传入都可以使函数正常工作。接下来我们先简单的模拟一个简单的版本：

```js
Function.prototype.myBind = function(context) {
    var fToBound = this, slice = Array.prototype.slice;
    var args = slice.call(arguments, 1)
    return function() {
        var innerArgs = slice.call(arguments)
        var finalArgs = args.concat(innerArgs)
        return fToBound.apply(context, finalArgs)
    }
}

var myBind = test.myBind({ msg: 'hello' }, 'jerry')
myBind(99) // jerry, 99, hello
```

上面的代码应该很好理解，`args` 是我们在执行`myBind`的时候传入的函数参数，`innerArgs`是我们在调用函数时传入的参数，最后我们把两个参数合并，再使用`apply`函数来修改函数作用域为`context`，最后返回函数执行结果。

但是上面的代码有什么问题呢？在文档上我们可以发现，`bind`返回的函数其实是支持`new`操作符的。看下面的例子：

```js
function Person(name) {
    this.name = name;
}

var PersonBound = Person.bind({name:'jerry'}, 'Kobe')
var p = new PersonBound()

var PersonMyBound = Person.myBind({name:'jerry'}, 'Kobe')
var p2 = new PersonMyBound()

console.info(p.name) // Kobe
console.info(p2.name) // undefined

```

可以看到，原生的`bind`函数返回的`PersonBound`函数正常的工作了，不过它没有使用传入的`{name:'jerry'}`对象作为`this`的绑定，而是像正常的构造函数一样，使用了参数（`name`）来给实例属性赋值；而我们上面实现的`myBind`函数就达不到相应的效果了，我们还需要再修改一下：

```js  {5}
Function.prototype.myBind = function(context) {
    var fToBound = this, slice = Array.prototype.slice
    var args = slice.call(arguments, 1)
    return function BoundFn() {
        var ctx = this instanceof BoundFn ? this : context
        var innerArgs = slice.call(arguments)
        var finalArgs = args.concat(innerArgs)
        return fToBound.apply(ctx, finalArgs)
    }
}

```

其中这行`var ctx = this instanceof BoundFn ? this : context` 判断了当前是不是使用`new`来实例化对象的，关于`new`的介绍，可以参考[实现new操作符](./new)。如果是`new`的，那么就把`this`（也就是绑定后的对象，对应例子中的 PersonMyBound）作为函数的上下文，否则就用我们传入的`context`。
我们来运行一下：

```js
var PersonMyBound = Person.myBind({name:'jerry'}, 'Kobe')
var p2 = new PersonMyBound()

console.info(p2.name) // => Kobe

```

再来看一个场景：
```js {5}
function Person(name) {
    this.name = name;
}

Person.prototype.age = 25

var PersonBound = Person.bind({name:'jerry'}, 'Kobe')
var p = new PersonBound()

var PersonMyBound = Person.myBind({name:'jerry'}, 'Kobe')
var p2 = new PersonMyBound()

console.info(p.name + ':' +p.age) // Kobe:25
console.info(p2.name + ':' + p2.age) // Kobe:undefined

```

What！怎么又出问题了？？我们发现，`Person`原型属性`age`在`PersonMyBound`中丢失了！为什么呢？

分析我们的`myBind`函数不难发现，我们返回的是一个全新的函数，它的`prototype`也是一个"全新的"原型对象，它与我们的`Person`函数并没有产生任何关系，所以没有打印出`age`也很正常。我们接下来就来建立这种连接关系。

```js {11}
Function.prototype.myBind = function(context) {
    var fToBound = this, slice = Array.prototype.slice
    var args = slice.call(arguments, 1)
    var fBound = function () {
        var ctx = this instanceof fBound ? this : context
        var innerArgs = slice.call(arguments)
        var finalArgs = args.concat(innerArgs)
        return fToBound.apply(ctx, finalArgs)
    }
    // 这里的this, 就是我们绑定的函数
    fBound.prototype = this.prototype
    return fBound
}
```
我们手动的将函数的原型对象赋值给我们的绑定函数，建立了这种联系，来测试一下效果：
```js
var PersonMyBound = Person.myBind({name:'jerry'}, 'Kobe')
var p2 = new PersonMyBound()

console.info(p2.name + ':' + p2.age) // Kobe:25

```

成功了！但是不要太高兴，还是有问题！看这个例子你就明白了：
```js

function P() {}
var PBound = P.myBind()

PBound.prototype.name = 'from P'

console.info(P.prototype.name) // => from P
```

显而易见，我们的原函数`P`和绑定函数`PBound`，它们的原型对象是同一个！追根溯源，这句代码是有问题的：`fBound.prototype = this.prototype`。它把原函数的原型赋值给绑定函数，这时候这两个`prototype`指向的都是同一个对象了，这就产生了问题。那么如何解决问题呢？我们可以创建一个原函数的副本出来，给绑定函数使用，这样两个就不会产生干扰了。

```js {11}
Function.prototype.myBind = function(context) {
    var fToBound = this, slice = Array.prototype.slice
    var args = slice.call(arguments, 1)
    var fBound = function () {
        var ctx = this instanceof fBound ? this : context
        var innerArgs = slice.call(arguments)
        var finalArgs = args.concat(innerArgs)
        return fToBound.apply(ctx, finalArgs)
    }
    // 这里的this, 就是我们绑定的函数
    fBound.prototype = Object.create(this.prototype)
    return fBound
}

```

再测试上例子，你会发现已经没有问题了。至此，可以算是大功告成了，最后，我们来加一些参数校验，看看最终版的实现：
```js
Function.prototype.bind = function(otherThis) {
    if (typeof this !== 'function') {
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }
    var fToBound = this, slice = Array.prototype.slice
    var args = slice.call(arguments, 1)
    var fBound = function () {
        var ctx = this instanceof fBound ? this : context
        var innerArgs = slice.call(arguments)
        var finalArgs = args.concat(innerArgs)
        return fToBound.apply(ctx, finalArgs)
    }
    fBound.prototype = Object.create(this.prototype)
    return fBound
  };
```

Done！

> 如果你参考的是 MDN 的实现方案，会发现它建立这种原型的联系，是使用一个中间函数来过渡的，这其实跟我们的Object.create方法是一样的道理，为什么一样呢？你看看这篇[Object.create](./create.md)的分析就明白了

---

本文均参考MDN文档：

链接1: [MDN-Function.prototype.call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

链接2: [MDN-Function.prototype.apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

链接3: [MDN-Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)