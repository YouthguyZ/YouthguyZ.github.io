## 模块化介绍

随着现代浏览器的能力越来越强，页面的表现形式也随之增强，对前端开发来说，最直接的影响就是需要编写和管理的js代码也越来越多。我们不得不追求一种更好的管理代码的方式，使得我们的应用不会随着体积的增加而难以维护，这就是前端模块化的产生背景。

我们先来明确一下，模块化给我们的能带来哪些好处：
- 减少了全局命名空间的污染
- 高复用。抽离出来的模块可以被多次使用。
- 易维护。分离了各个模块，使得我们的最小更新单元是一个模块。
- 易扩展。对模块的修改、增加就是对应用的修改与增加。

我们带着对这些好处的思考，看看没有规范之前，社区都有哪些尝试。

## 发展历程

模块化的由来也不是一蹴而就的，它是在经历了一系列的实践以后，才逐渐的确立了一些规范，我们先来看看它都经历了什么。

### 单纯的函数

```js
function f1() {
  alert('f1')
}

function f2() {
  alert('f2')
}

var message = 'global message'
```

这是我们最原始的方法，即在全局定义我们想要的函数方法、变量，它带来的问题显而易见：
1. 所有方法和变量都放在全局命名空间下，污染了全部作用域。
2. 容易产生命名的冲突。
3. 无法看出各个模块之间的关系。你得查看函数体的代码才能知道它是否有依赖其他函数。

为了解决上面的前两个问题，于是又出现了命名空间的模式。

### namespace

```js
var util = {
  message: 'message from util',
  fn1: function() {
    console.info('fn1')
  },
  fn2: function() {
    console.info('fn2')
  }
}

```

我们用一个对象承载了前一个例子中的变量和方法，换句话说，就是我们的变量和方法都在`util`的命名空间下。然而这种模式也有自己明显的不足之处：
命名空间内的变量和方法并不是私有的，你可以随意的修改它们。比如：

```js
util.message = 'hello'
util.fn1 = null
```

为了解决这个问题，我们需要使用`IIFE(立即执行函数表达式)`。

### IIFE
```js
var util = (function (){
  var message = 'hello'
  function fn() {
    console.info('iife data:', message)
  }
  function f2() {
    console.info('fn2')
  }
  return {
    fn: fn,
    message: message
  }
})()

util.message = 'nihao' // 不会修改 util 模块内的 message 变量
util.fn() // => iife data: hello
```

这已经凸显出模块作用的雏形了，使用闭包，可以保护数据的私有性，而且如果我们需要引入其它依赖的话，可以很方便的向这个`IIFE`传递参数，例如：
```js
var anotherUtil = (function (){
  var status = {
    error: 'error',
    info: 'info'
  }
  return {
    status: status
  }
})()

var util = (function (other){
  console.info(other.status.info) // 'info'
})(anotherUtil)

```

我们可以在`util模块`中使用`anotherUtil模块`中的变量，这就形成了一种模块间的依赖关系。

## 模块化规范

## 模块循环引用问题

## webpack打包