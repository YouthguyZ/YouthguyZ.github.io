# EventLoop 事件循环机制

本文将以例子的形式，一步步的讲解js事件循环机制的工作原理。我们先来看一个最简单的例子：

```js
console.info('start')
console.info('end')
```

我相信你闭着眼也能知道上面的代码输出什么吧：

```js
start
end
```

为什么会输出这样的结果呢？因为js是单线程的，而且上面两行代码是**同步任务**，所以就按照出现的先后顺序执行了。

我们开始加一点内容：
```js
console.info('start')
setTimeout(() => {
  console.info('task setTimeout')
}, 100)
console.info('end')
```

我想这个也应该难不倒你。由于`setTimeout`的方法不会立即执行，而是要等`100ms`，所以输出的顺序是：
```js
start
end 
task setTimeout
```

看上去跟预期的一样，但是实际上是我们想的那样么？我们将`setTimeout`的`100ms`改为`0ms`呢？输出结果会变么？答案是：**不会**。也许你会好奇，第0ms后执行回调，不就是立即执行么，为什么不先打印出回调函数的内容呢？

这里你应该对`setTimeout`有所误解，它从来都不是在指定时间后去执行回调函数，而是在指定时间后，把回调函数放到**任务队列**中去。具体什么时候执行，还得看具体的例子分析。上例中，由于打印完了`end`后，主线程没有同步任务了，所以会去执行这个队列中的回调函数，打印出`task setTimeout`。

OK，我们再来加一点代码看看：

```js
console.info('start')
setTimeout(() => {
  console.info('task setTimeout')
}, 0)

new Promise((resolve, reject) => {
  console.info('promise1')
  resolve()
}).then(res => {
  console.info('then 1')
}).then(res => {
  console.info('then 2')
})

console.info('end')

```

可以看到，我们加了一段`Promise`的代码，来想一下打印结果会是什么呢？

```js
start
promise1
end
then 1
then 2
task setTimeout
```

为什么会出现这样的结果呢？因为我们的`Promise`的`then`方法，实际上也是异步的，它只有接收到了`resolve`指令才会去执行（`reject`与`catch`也是同理）。而我们`new Promise(XX)`中这个`XX`方法也是同步的任务，所以，代码由上往下执行的时候，会在`start`后打印`promise1`，接着调用`resolve()`方法，将`then()`方法放到**微任务队列**中，然后继续执行同步任务，打印`end`。之后，没有其他的同步代码了，开始先从微任务队列中拿出任务执行，也就是执行了`res=>{console.info('then 1')}`的代码，注意，这段代码执行后，其实也返回了一个undefined给下一个`then`方法，于是下一个`then`函数也被加到了微任务队列中去执行。当打印完`then 1`后，发现微任务队列中还有任务，也就是我们刚刚添加的那个，继续执行，所以打印出了`then 2`。打印完后，发现微任务队列中没有任务了，开始去异步任务队列中去找任务，找到了`setTimeout`的回调，拿出来执行。结束。

Ok，说到这里，你可能有点晕了，我们来解释几个知识点，摘自阮一峰老师的博客：

1. **同步任务和异步任务**

所有任务可以分成两种，一种是同步任务（synchronous），另一种是异步任务（asynchronous）。同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；异步任务指的是，不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

2. **异步执行的机制**

（1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。

（2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。

（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。

（4）主线程不断重复上面的第三步。

### 参考文章

- [http://www.ruanyifeng.com/blog/2014/10/event-loop.html](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
- [https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)