# Action 

Action 类似于 mutation，不同在于：

- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作。

## Action 使用方法

我们来看一下简单的例子：

```js
const store = new Vuex.Store({
  state: {
    name: 'Jerry',
  },
  mutations: {
    changeName(state, newName) {
      state.name = newName
    }
  },
  actions: {
    setName(context, val) {
      // 在 action 中提交 changeName 这个 mutation
      context.commit('changeName', val)
    }
  }
})
```

我们在使用的时候可以通过 dispatch 来分发这个 action：

```js
this.$store.dispatch('setName', 'Jack')
```

## Action 实现原理

### Action 的注册

首先在 Store 构造函数中：

```js
this._actions = Object.create(null)
// ...
const store = this
const { dispatch, commit } = this
this.dispatch = function boundDispatch (type, payload) {
  return dispatch.call(store, type, payload)
}
// ...
```

先定义了 _actions 这个实例属性，接着将 dispatch 方法重新绑定作用域。这块的逻辑跟上一节介绍的 Mutation 很像。继续往下执行，会走到 `installModule(this, state, [], this._modules.root)`，在这个方法内会调用 `module.forEachAction` 来注册我们定义的 actions：

```js
module.forEachAction((action, key) => {
  const type = action.root ? key : namespace + key
  const handler = action.handler || action
  registerAction(store, type, handler, local)
})
```

`forEachAction` 的定义在 module/module.js 中，也是 Module 类的一个方法：

```js
forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn)
  }
}
```

这里的 `_rawModule.actions` 其实就是我们在构造函数中定义的这个 actions：
 
```js
{
  setName(context, val) {
    context.commit('changeName', val)
  }
}
```

所以此时会遍历我们的 actions，逐一的注册 action。其实我们的 action 还支持这样的定义：

```js
actions: {
  someAction: {
    root: true,
    handler (namespacedContext, payload) { ... } // -> 'someAction'
  }
}
```

这个跟我们下一节要说的 module 相关，这里不多介绍，还是按照我们例子那样去分析。所以这里的 type 就是我们 action 的名称 setName，handler 就是我们定义的函数，然后调用 `registerAction` 去注册，我们来看一下 registerAction 的定义：

```js
function registerAction (store, type, handler, local) {
  const entry = store._actions[type] || (store._actions[type] = [])
  entry.push(function wrappedActionHandler (payload) {
    let res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload)
    if (!isPromise(res)) {
      res = Promise.resolve(res)
    }
    if (store._devtoolHook) {
      return res.catch(err => {
        store._devtoolHook.emit('vuex:error', err)
        throw err
      })
    } else {
      return res
    }
  })
}
```

跟 mutation 的注册逻辑也很相似，我们先获取 `store.actions['setName']` 的值，如果之前没有定义的话，就初始化成一个空数组。然后往这个数组中添加一个 action 的包装函数：`wrappedActionHandler`，函数内部手动调用了我们定义的 action 方法，并且预设了很多参数：

```js
let res = handler.call(store, {
    dispatch: local.dispatch,
    commit: local.commit,
    getters: local.getters,
    state: local.state,
    rootGetters: store.getters,
    rootState: store.state
}, payload)
```

还记得这个 local 变量么？我们之前介绍过，他是通过 `makeLocalContext(store, namespace, path)` 得到的，它的值跟当前的 module 有关，也就是说，我们的 action 可以获取到当前模块的 dispatch，commit，getters，state 这些方法和数据，且都在一个对象中，Vuex 文档上称它为 context 对象，它作为我们 action 的第一个参数。另外也可以看出，context 中也能获取根上面的 getters 和 state。

接下来是判断我们的 res 对象是不是 Promise，如果不是的话就用 `res = Promise.resolve(res)` 将它变成一个 `resolved` 状态的 Promise 后返回。这里把 res 转成 Promise 主要是为了我们执行 dispatch 的时候用的，下文分析的时候会详细介绍。

好了，到这里，我们的 action 就已经注册好了。接下来我们看看当调用 dispatch 的时候，发生了什么。

### Action 的分发

我们可以通过 `this.$store.dispatch('setName', { param: 'XXX' })` 或者 `this.$store.dispatch({ type: 'setName', param: 'XXX' })` 两种方式来分发 action，当我们调用 dispatch 方法的时候，会首先走到绑定后的方法：

```js
function boundDispatch (type, payload) {
  return dispatch.call(store, type, payload)
}
```

其实就是绑定了当前 store 作为作用域，我们来一点一点看看这个 dispatch 方法的实现过程。

```js
dispatch (_type, _payload) {
  // 跟我们在 mutation 中的实现一样，拿到一个统一化后的对象
  // 具体实现可以参考上一节
  const {
    type,
    payload
  } = unifyObjectStyle(_type, _payload)

  // 在这里把 type 和 payload 合并到一个对象中，作为一个整体
  const action = { type, payload }
  // 拿到我们对应 type 的 action 方法，它是一个数组，里面的函数是包装后的 wrappedActionHandler
  const entry = this._actions[type]
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] unknown action type: ${type}`)
    }
    return
  }

  try {
    this._actionSubscribers
      .filter(sub => sub.before)
      .forEach(sub => sub.before(action, this.state))
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[vuex] error in before action subscribers: `)
      console.error(e)
    }
  }

  const result = entry.length > 1
    ? Promise.all(entry.map(handler => handler(payload)))
    : entry[0](payload)

  return result.then(res => {
    try {
      this._actionSubscribers
        .filter(sub => sub.after)
        .forEach(sub => sub.after(action, this.state))
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[vuex] error in after action subscribers: `)
        console.error(e)
      }
    }
    return res
  })
}
```

一开始的处理几乎跟上一节介绍的 `commit` 一致，这里就不赘述了。接着的一段 `try ... catch ...` 是针对我们的 `_actionSubscribers` 的，这里它的值为 `[]`，所以也没啥用。接着到了我们的重点：

```js
const result = entry.length > 1
    ? Promise.all(entry.map(handler => handler(payload)))
    : entry[0](payload)
```

首先判断 entry.length 的长度，也就是我们对应 mutation 的 handler 数组的长度，如果大于 1，那么就遍历这个 entry 去挨个执行我们的 handler，并且传入我们的 payload。这里的 handler 就是我们上面讲过的 `wrappedActionHandler`，它返回的是一个 Promise，所以 `entry.map(handler => handler(payload))` 返回的是一个 Promise 数组，然后用 `Promise.all()` 去执行这一组 Promise 得到一个新的 Promise；如果 length 为 1 的话，那么就直接执行 `entry[0](payload)` 得到一个 Promise 即可。

上一步我们得到了 result，它是一个 Promise，最后我们返回这个 `result.then` ，then 方法的内部也会用 `try ... catch ...` 执行 `_actionSubscribers` 的相关代码。最后返回这个 res 对象。至此，我们的 dispatch 过程就结束了。

### dispatch 流程举例

为了方便理解，我们通过一开始的例子走一遍 dipatch 的整个流程。

```js
const store = new Vuex.Store({
  state: {
    name: 'Jerry',
  },
  mutations: {
    changeName(state, newName) {
      state.name = newName
    }
  },
  // 注册
  actions: {
    setName(context, val) {
      // 在 action 中提交 changeName 这个 mutation
      context.commit('changeName', val)
    }
  }
})

// 调用
this.$store.dispatch('setName', 'Jack')
```

首先，`new Vuex.Store` 执行完后，我们的 actions 就完成了注册，这时候 `store._actions` 的值：

```js
{
  setName: [
    function wrappedActionHandler (payload) {
      var res = handler.call(store, {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store.getters,
        rootState: store.state
      }, payload);
      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }
      if (store._devtoolHook) {
        return res.catch(function (err) {
          store._devtoolHook.emit('vuex:error', err);
          throw err
        })
      } else {
        return res
      }
    }
  ]
}
```

注意，这里的 handler 就是我们自己定义的 setName 方法。  

接着，我们调用 dispatch 方法，首先会执行到一开始绑定的函数中，也就是这里：

```js
function boundDispatch (type, payload) {
  return dispatch.call(store, type, payload)
}
```

也就是相当于调用了 `store.dispatch('setName', 'Jack')`，我们再来看 dispatch 方法。上面分析过了，它通过 `this._actions['setName']` 拿到的 entry 对象，其实就是上面的：

```js
[
    function wrappedActionHandler (payload) { ... }
]
```

可以看到，此时 entry.length 是 1，所以此时接下来走的是这个逻辑 `let result = entry[0](payload)`，就是拿出我们的 `wrappedActionHandler` 函数，传入 payload 去执行，也就是会执行：

```js
var res = handler.call(store, {
    dispatch: local.dispatch,
    commit: local.commit,
    getters: local.getters,
    state: local.state,
    rootGetters: store.getters,
    rootState: store.state
}, payload);
```

翻译一下，等价于在 store 的作用域内，执行如下代码：

```js
var res = setName({
    dispatch: local.dispatch,
    commit: local.commit,
    getters: local.getters,
    state: local.state,
    rootGetters: store.getters,
    rootState: store.state
}, 'Jack')
```

也就是执行 `local.commit('changeName', 'Jack')`，执行完后数据已经修改了。本例中这个 res 的值很显然是 undefined，所以会通过：`res = Promise.resolve(res);` 包装成 Promise然后返回。

所以我们的 `entry[0](payload)` 执行完以后，result 的值就等于上面的 res，即一个 resolved 的 Promise 对象。

最后返回的值是：

```js 
result.then(res => res)
```

其实这里的 res 还是 undefined，可以通过打印出来看看：

```js
this.$store.dispatch('setName', 'Jack').then(res => {
  console.info(res) // undefined
})
```

好了，相信到这里，你应该对 diapatch 的过程已经很清晰了吧。


## mapActions 使用方法

我们的 actions 当然也有对应的工具函数了，与 mapMutations 的用法一模一样：

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

## mapActions 实现原理

mapActions 的实现过程也与我们的 mapMutations 几乎一致，这里就不重复说明了，有兴趣的话可以看一下上一节介绍 mapMutations 的部分，两个方法从实现上几乎没有什么不同：

```js
export const mapActions = normalizeNamespace((namespace, actions) => {
  const res = {}
  // 检查 actions 是否满足对象或者数组
  if (process.env.NODE_ENV !== 'production' && !isValidMap(actions)) {
    console.error('[vuex] mapActions: mapper parameter must be either an Array or an Object')
  }
  // 遍历 actions
  normalizeMap(actions).forEach(({ key, val }) => {
    // 添加属性，值为我们包装后的 action 函数
    res[key] = function mappedAction (...args) {
      // get dispatch function from store
      let dispatch = this.$store.dispatch
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapActions', namespace)
        if (!module) {
          return
        }
        dispatch = module.context.dispatch
      }
      return typeof val === 'function'
        // 如果 val 是函数的话，那么就在当前作用域上执行这个函数，并且把 dispatch 作为第一个参数
        ? val.apply(this, [dispatch].concat(args))
        // 否则就直接调用 dispatch 方法，这里的 val 就是我们的 action 的 name
        // 就相当于 this.$store.dispatch('actionName', ...args)
        : dispatch.apply(this.$store, [val].concat(args))
    }
  })
  return res
})
```

## 总结

本节我们介绍了 action 的相关用法，它其实跟我们的 mutation 很像，只不过它可以处理异步操作。我们在 mutation 中不应该使用异步的方法去修改 state，而是应该将这种操作放进 action 中，用 action 来提交 mutation。最后我们还分析了 mapActions 的用法，它跟我们上一节中的 mapMutations 的实现几乎一致。下一节我们将介绍 Vuex 中的模块化系统 —— Module 的实现。