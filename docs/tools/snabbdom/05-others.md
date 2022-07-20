# Q&A

前面几个章节，我们基本上学完了 snabbdom 的原理，包括 vnode，patch，modules，thunks 等相关的介绍，但是 snabbdom 还有一些其它重要的逻辑我们介绍主流程的时候忽略了，这里我们补充介绍以下三点：

- `diff`：当新旧节点都包含 children 时，snabbdom 是如何比对的？
- `createRmCb`：为什么在移除节点时需要用这个函数来包一层？
- `insertedVnodeQueue`：多次出现的 insertedVnodeQueue 到底有啥用？

带着这三个问题，我们来看源码。

## diff

## createRmCb

## insertedVnodeQueue