# VNode 介绍

## vnode 函数生成 Vnode

首先我们要理解 VNode。**所谓 VNode，其实就是一个 javascript 对象，它内部有一些属性，可以表示 DOM 元素的一些属性。** 我们来看一下这里对 VNode 的定义（src/vnode.ts）：

```js
export interface VNode {
  sel: string | undefined // 选择器
  data: VNodeData | undefined // 数据
  children: Array<VNode | string> | undefined // 子节点
  elm: Node | undefined // 对应的 DOM 元素
  text: string | undefined // 对应的文本内容
  key: Key | undefined // key
}
```

VNode 中的 data 就是用来对应真实 DOM 中属性的，它是 VNodeData 类型的：

```js
export interface VNodeData {
  props?: Props
  attrs?: Attrs
  class?: Classes
  style?: VNodeStyle
  dataset?: Dataset
  on?: On
  hero?: Hero
  attachData?: AttachData
  hook?: Hooks // vnode hook
  key?: Key
  ns?: string // for SVGs
  fn?: () => VNode // for thunks
  args?: any[] // for thunks
  [key: string]: any // for any other 3rd party module
}
```

还有一个重要的就是 hook，它是 Hooks 类型的（src/hooks.ts）：

```js
export type PreHook = () => any;
export type InitHook = (vNode: VNode) => any;
export type CreateHook = (emptyVNode: VNode, vNode: VNode) => any;
export type InsertHook = (vNode: VNode) => any;
export type PrePatchHook = (oldVNode: VNode, vNode: VNode) => any;
export type UpdateHook = (oldVNode: VNode, vNode: VNode) => any;
export type PostPatchHook = (oldVNode: VNode, vNode: VNode) => any;
export type DestroyHook = (vNode: VNode) => any;
export type RemoveHook = (vNode: VNode, removeCallback: () => void) => any;
export type PostHook = () => any;

export interface Hooks {
  pre?: PreHook
  init?: InitHook
  create?: CreateHook
  insert?: InsertHook
  prepatch?: PrePatchHook
  update?: UpdateHook
  postpatch?: PostPatchHook
  destroy?: DestroyHook
  remove?: RemoveHook
  post?: PostHook
}
```

其实就是定义了对应 hook 的函数形式。最后再介绍一下**生成 VNode 的函数 vnode：**

```js
export function vnode (sel: string | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  text: string | undefined,
  elm: Element | Text | undefined): VNode {
  const key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, elm, key };
}
```

特别简单，就是根据传入的参数，返回一个对象而已。

## h 函数生成 Vnode

知道了 VNode，我们现在来看一下 h 函数，先来看一下它的定义：

```js

export function h(sel: string): VNode;
export function h(sel: string, data: VNodeData | null): VNode;
export function h(sel: string, children: VNodeChildren): VNode;
export function h(sel: string, data: VNodeData | null, children: VNodeChildren): VNode;
```

它重载了四个函数，也就是说，我们有四种不同的方式去调用它。比如要创建一个不包含子节点的 VNode，我们可以这么调用：

```js
h('h1', { style: { color: 'red' } })
```

h 函数的最终实现如下，具体的逻辑写在注释中了：

```js
export function h (sel: any, b?: any, c?: any): VNode {
  var data: VNodeData = {};
  var children: any;
  var text: any;
  var i: number;
  if (c !== undefined) { // 意味着 传递了三个参数，即 sel, data, children
    if (b !== null) { // 意味着 data 不为null，很好，是我们想要的，把 b 赋值给 data 即可
      data = b;
    }
    if (is.array(c)) { // 意味着 children 是一个数组，那太好了，完美的情况，直接把 c 赋值为 children
      children = c;
    } else if (is.primitive(c)) { // c为字符串或者数字的话，把它赋值为 text 好了
      text = c;
    } else if (c && c.sel) { // ok, 这时候 c 可能就是一个 vnode了，把它包装成数组吧
      children = [c];
    }
  } else if (b !== undefined && b !== null) { // 这里说明只传递了两个参数哦
    if (is.array(b)) { // 如果是个数组的话，那就当成 children 处理
      children = b;
    } else if (is.primitive(b)) { // 简单类型的话，当成 text
      text = b;
    } else if (b && b.sel) { // vnode 的话，包装成数组，也当成 children
      children = [b];
    } else { data = b; } // finally，赋值为 data。
  }

  // 经过以上的判断，这时候 data, children 都处理好了

  if (children !== undefined) {
    for (i = 0; i < children.length; ++i) {
      // 这里是把 children 中，出现的字符串或者数字，转成 vnode
      if (is.primitive(children[i])) children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
    }
  }
  if (
    sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
    (sel.length === 3 || sel[3] === '.' || sel[3] === '#')
  ) {
    addNS(data, children, sel);
  }
  // 最终通过 vnode 函数返回一个虚拟节点
  return vnode(sel, data, children, text, undefined);
};
```

其实这里的逻辑都是为了满足上面四个重载的实现。对于不同场景传入的参数，做了不同的处理，相当于一层 normalize 的操作，将不同的输入规范化成统一的形式后进行处理，可以方便我们的后续操作。