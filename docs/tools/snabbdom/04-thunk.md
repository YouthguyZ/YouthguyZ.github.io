# Thunk

## 什么是 Thunk

官方给它的定义是：

:::tip Thunks
*Thunks are an optimization strategy that can be used when one is dealing with immutable data.*
:::

翻译过来，就是当你处理不可变数据时候使用的一种优化技巧。试想一下，如果你有一个函数，用来生成一个标题：

```js
function titleView (title) {
  return h('h1', 'Title: ' + title)
}
```

这个函数的结果只和我们的入参 title 有关。如果我们的 title 一直不变的话，那么再次创建虚拟 DOM 并且与旧节点 patch，都是一种浪费。为了避免这种无谓的开销，所以引入了 thunk 函数：

```js
function render (state) {
  return thunk('h1', 'title', titleView, [state.title])
}
```

在这种情况下，patch 过程中 snabbdom 会比较 title 的值。如果没有改变的话，它讲直接重用老的节点。这就避免了再次创建元素和diff这些消耗了。我们来看一下它的实现原理。

## 源码解析

先来看一下 thunk 函数的签名：

```js
thunk(selector, key, renderFn, [stateArguments])
```

它接受四个参数：
- `selector`：选择器
- `key`：用来标识这个 thunk 的 key
- `renderFn`：渲染函数，它返回的是一个 vnode
- `[stateArguments]`：状态参数列表

**当 thunk 函数被调用时，`renderFn` 会接收 `[stateArguments]` 作为参数。这个 `renderFn` 会在它改变的时候，或者这个状态列表改变的时候被调用。**

好了，接下来我们就来分析它的实现原理。它的源码位于 src/thunk.ts 中：

```js
export const thunk = function thunk(sel: string, key?: any, fn?: any, args?: any): VNode {
  if (args === undefined) {
    args = fn;
    fn = key;
    key = undefined;
  }
  return h(sel, {
    key: key,
    hook: {init, prepatch},
    fn: fn,
    args: args
  });
} as ThunkFn;
```

我们看到，它其实就是一个增强版的 `h` 函数。首先第一个 `if (args === undefined)` 判断，是当我们只传递三个参数时，会将第二个参数 key 设置为 undefined，并且后面的参数都往后移位。这是一种参数规范化的操作。接着就直接调用我们的 `h` 函数了，注意这里有两点与之前不一样：

1. h 函数还接受了 fn 和 args 作为参数
2. 这里的 h 函数有两个钩子：init 和 prepatch

先来分析第一点。首先，我们看到，thunk 函数的接口是 ThunkFn 类型的，它的定义如下：

```js
export interface ThunkFn {
  (sel: string, fn: Function, args: Array<any>): Thunk;
  (sel: string, key: any, fn: Function, args: Array<any>): Thunk;
}
```

第一行就是我们刚刚介绍的传三个函数的情况，分别是 sel，fn，args；第二行就是完整的参数调用的接口签名。这两个函数都是返回 Thunk 数据类型的，这个 Thunk 定义如下：

```js
export interface Thunk extends VNode {
  data: ThunkData;
}
```

而 ThunkData 又继承自 VNodeData：

```js
export interface ThunkData extends VNodeData {
  fn: () => VNode;
  args: Array<any>;
}
```

VNodeData 类型中，fn 和 args 都是可选的，而 ThunkData 继承自 VNodeData，并且覆盖了这两个属性，变成了 required 的了。所以当我们 thunk 函数中的 h 执行完成以后，它的 data 包含了 fn 和 args，所以这里属于 Thunk 类型。这其实是为了满足 ts 的类型检查，没有太多业务逻辑层面的作用。

我们再来看第二点，它的两个钩子分别是：init 和 prepatch。init 方法其实很简单：

```js
function init(thunk: VNode): void {
  const cur = thunk.data as VNodeData;
  const vnode = (cur.fn as any).apply(undefined, cur.args);
  copyToThunk(vnode, thunk);
}
```

其实就是拿到我们 data 中定义的 fn 函数和参数列表 args，然后把这个 args 作为参数执行 fn 来得到 vnode，最后再调用 copyToThunk 方法把 vnode 拷贝到 thunk 中。

来看一下 copyToThunk 方法：

```js
function copyToThunk(vnode: VNode, thunk: VNode): void {
  thunk.elm = vnode.elm;
  (vnode.data as VNodeData).fn = (thunk.data as VNodeData).fn;
  (vnode.data as VNodeData).args = (thunk.data as VNodeData).args;
  thunk.data = vnode.data;
  thunk.children = vnode.children;
  thunk.text = vnode.text;
  thunk.elm = vnode.elm;
}
```

它也很简单，就是简单的值的拷贝，把 vnode 的属性都拷贝到 thunk 中去。


再来看一下 prepatch 钩子：

```js
function prepatch(oldVnode: VNode, thunk: VNode): void {
  let i: number, old = oldVnode.data as VNodeData, cur = thunk.data as VNodeData;
  const oldArgs = old.args, args = cur.args;
  if (old.fn !== cur.fn || (oldArgs as any).length !== (args as any).length) {
    copyToThunk((cur.fn as any).apply(undefined, args), thunk);
    return;
  }
  for (i = 0; i < (args as any).length; ++i) {
    if ((oldArgs as any)[i] !== (args as any)[i]) {
      copyToThunk((cur.fn as any).apply(undefined, args), thunk);
      return;
    }
  }
  copyToThunk(oldVnode, thunk);
}
```

其实也是一个 copyToThunk 的过程。

第一个 if 其实就我们之前说的 renderFn 的调用时机：renderFn 发生改变 或者 args 发生改变（这里是长度不一样）。当满足这两个条件时，也会调用 copyToThunk 。

接下来的 for 循环就是针对参数列表的检查了，当列表的元素前后发生变化时，也会调用 copyToThunk。

如果逃过了上面的 if 检查和 for 循环的话，最后还有一个 copyToThunk 来捕获“漏网之鱼”。