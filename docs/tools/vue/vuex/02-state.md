# State 详解

## State 使用方法

在 `Store` 中定义一个 `state` 其实很简单，我们的分析也从这个简单的例子开始：

```js
const store = new Vuex.Store({
  state: {
    message: 'Hello world'
  }
})
```

在单文件组件中，我们使用这个 `store` 也很简单，直接用 `this.$store.state.message` 就可以拿到这个值了。`Vuex` 在我们定义 `state` 的时候做了哪些工作呢？我们本节就来分析分析。

## State 实现原理

`state` 是在 `Store` 中定义的，所以我们要先分析 `Store` 构造函数的实现。它做的工作还是比较多的，我们从上往下分析主线即可。首先是：

```js
if (!Vue && typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

if (process.env.NODE_ENV !== 'production') {
  assert(Vue, `must call Vue.use(Vuex) before creating a store instance.`)
  assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
  assert(this instanceof Store, `store must be called with the new operator.`)
}
```

第一个 `if` 我们已经分析过了，是在浏览器环境下自动注册 `Vuex` 插件。第二个 `if` 主要是在开发环境给一些提示，很简单，就略过了。接着是一大串的初始化：

```js
const {
  plugins = [],
  strict = false
} = options

// store internal state 
this._committing = false
this._actions = Object.create(null)
this._actionSubscribers = []
this._mutations = Object.create(null)
this._wrappedGetters = Object.create(null)
this._modules = new ModuleCollection(options)
this._modulesNamespaceMap = Object.create(null)
this._subscribers = []
this._watcherVM = new Vue()
this._makeLocalGettersCache = Object.create(null)
```

这里我们主要关注 `this._modules` 对象，它的值是 `ModuleCollection` 的实例，我们来分析一下这个对象（定义在 module/module-collection）：

```js
export default class ModuleCollection {
  constructor (rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false)
  }
  register (path, rawModule, runtime = true) {
    if (process.env.NODE_ENV !== 'production') {
      assertRawModule(path, rawModule)
    }

    const newModule = new Module(rawModule, runtime)
    if (path.length === 0) { // path 为空的时候，说明是顶层的，就是根root
      this.root = newModule
    } else {
      const parent = this.get(path.slice(0, -1))
      parent.addChild(path[path.length - 1], newModule)
    }

    // register nested modules
    if (rawModule.modules) {
      forEachValue(rawModule.modules, (rawChildModule, key) => {
        this.register(path.concat(key), rawChildModule, runtime)
      })
    }
  }
  // .... 省略其他
}
```

通过构造函数可以看出，我们传进来的 `options` 被当成 `rawRootModule` 传入给了实例上的 `register` 方法。在我们的例子中，就相当于这样调用的：

```js
this.register([], {
  state: {
    message: 'Hello world'
  }
}, false)
```
 
首先调用进行参数值的断言：

```js
if (process.env.NODE_ENV !== 'production') {
  assertRawModule(path, rawModule)
}
```
在开发环境下，如果你的 `getters`，`mutations` 和 `actions` 的值不符合规范， `Vuex` 会给你相应的提示。整个断言的实现如下：

```js
// 函数断言
const functionAssert = {
  assert: value => typeof value === 'function', // 断言函数
  expected: 'function' // 期望类型：function
}
// 对象断言
const objectAssert = {
  assert: value => typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'),
  expected: 'function or object with "handler" function' // 期望类型：函数类型或者有一个handler函数的对象
}

const assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
}

function assertRawModule (path, rawModule) {

  // key 的值 为getters/actions/mutations
  Object.keys(assertTypes).forEach(key => {
    // 没有定义的话，直接返回
    if (!rawModule[key]) return

    const assertOptions = assertTypes[key] // 拿到断言对象，开始 assert

    forEachValue(rawModule[key], (value, type) => {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      )
    })
  })
}
// 创建警告信息
function makeAssertionMessage (path, key, type, value, expected) {
  let buf = `${key} should be ${expected} but "${key}.${type}"`
  if (path.length > 0) {
    buf += ` in module "${path.join('.')}"`
  }
  buf += ` is ${JSON.stringify(value)}.`
  return buf
}
```

可以看到，整个实现还是比较清晰的。这里定义的规则是 `getters` 和 `mutations` 属性必须是对象，`actions` 属性必须是函数或者是包含 `handler` 函数的对象。如果不满足，就会调用 `makeAssertionMessage` 生成错误信息提示，再通过 `assert` 抛出错误警告。

Ok，再回到我们的主线上来，接下来是这样一行代码：

```js
const newModule = new Module(rawModule, runtime)
```

也就是等价于：

```js
const newModule = new Module({
  state: {
    message: 'Hello world'
  }
}, false)

```

What？咋又创建了对象啊？继续看看这个对象是啥吧（定义在 module/module.js 里面）：

```js

export default class Module {
  constructor (rawModule, runtime) {
    this.runtime = runtime
    // 存储孩子们
    this._children = Object.create(null)
    // 存储一个 rawModule 的副本 
    this._rawModule = rawModule
    // 这个值就是我们传入的 state 属性值，这个例子中就是 { message: 'Hello world' }
    const rawState = rawModule.state

    // 然后设置 state 的值，如果上面的 rawState 是函数的话，那么就使用它的执行结果；否则直接使用它
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
  }
  // ... 省略
}
```

（长舒一口气）这次的对象还算比较简单，主要是定义了一些实例属性。这个类里面还有一些其他的属性和方法，我们后面分析到的时候再来看。好了，到现在位置，我们的 `newModule` 属性已经有值了，再继续往下看吧：

```js
if (path.length === 0) { // path 为空的时候，说明是顶层的，就是根root
  this.root = newModule
} else {
  const parent = this.get(path.slice(0, -1))
  parent.addChild(path[path.length - 1], newModule)
}

// register nested modules
if (rawModule.modules) {
  forEachValue(rawModule.modules, (rawChildModule, key) => {
    this.register(path.concat(key), rawChildModule, runtime)
  })
}
```

可以看到，我们的 `path` 此时是空数组，所以走的是这段逻辑：`this.root = newModule`。并且我们本例中也没有定义 `modules`，所以下面这段代码也不会走。所以，整体看下来，`register` 函数做的事情就是添加了一个 `root` 属性而已。

所以，上面的 `this._modules = new ModuleCollection(options)` 最终执行完以后，会得到如下的结果：

```js
this._modules = {
  root: {
    runtime: false,
    _children: {},
    _rawModule: {
      state: {
        message: 'Hello world'
      }
    },
    state: {
      message: 'Hello world'
    }
  }
}
```


至于 `Store` 中定义的其他变量，我们用到的时候再分析，继续往下看：

```js
// bind commit and dispatch to self
const store = this
const { dispatch, commit } = this
this.dispatch = function boundDispatch (type, payload) {
  return dispatch.call(store, type, payload)
}
this.commit = function boundCommit (type, payload, options) {
  return commit.call(store, type, payload, options)
}
```

这段代码主要是将 `Store` 上面的 `dispatch` 和 `commit` 两个方法，都绑定到自身实例的作用域上。
（这段代码我目前还不是很清楚有什么作用，因为 `dispatch` 和 `commit` 这两个方法是定义在 `class` 上的，按理说可以访问 `this`，这里为什么要再做一次作用域的绑定呢？如果你知道原因，还望告知。 ）

继续往下看：

```js
// strict mode
this.strict = strict

// 拿到 state 对象
const state = this._modules.root.state

// init root module.
// this also recursively registers all sub-modules
// and collects all module getters inside this._wrappedGetters
installModule(this, state, [], this._modules.root)

// initialize the store vm, which is responsible for the reactivity
// (also registers _wrappedGetters as computed properties)
resetStoreVM(this, state)

// apply plugins
plugins.forEach(plugin => plugin(this))

// 为某个特定的 Vuex 实例打开或关闭 devtools。对于传入 false 的实例来说 Vuex store 不会订阅到 devtools 插件。
// 可用于一个页面中有多个 store 的情况。
const useDevtools = options.devtools !== undefined ? options.devtools : Vue.config.devtools
if (useDevtools) {
  devtoolPlugin(this)
}
```

第一个要关注的是 `installModule(this, state, [], this._module.root, true)`，它的实现如下：

```js
function installModule (store, rootState, path, module, hot) {
  // path
  const isRoot = !path.length
  const namespace = store._modules.getNamespace(path)

  // register in namespace map
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace] && process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join('/')}`)
    }
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      if (process.env.NODE_ENV !== 'production') {
        if (moduleName in parentState) {
          console.warn(
            `[vuex] state field "${moduleName}" was overridden by a module with the same name at "${path.join('.')}"`
          )
        }
      }
      Vue.set(parentState, moduleName, module.state)
    })
  }

  const local = module.context = makeLocalContext(store, namespace, path)

  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}
```

看上去很长的一大串代码，其实对于我们这里例子，很多逻辑分支都是走不到的。所以，我们可以跳过不相关的逻辑，来看一下这行代码：

```js
const local = module.context = makeLocalContext(store, namespace, path)
```

这里的 `namespace` 是空字符串，`path` 是空数组。然后开始创建 `localContext` 对象，赋值给 `module`，也就是我们的根模块。我们来看一下这个方法的实现：

```js
/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  const noNamespace = namespace === ''

  const local = {
    dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(`[vuex] unknown local action type: ${args.type}, global type: ${type}`)
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : (_type, _payload, _options) => {
      const args = unifyObjectStyle(_type, _payload, _options)
      const { payload, options } = args
      let { type } = args

      if (!options || !options.root) {
        type = namespace + type
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(`[vuex] unknown local mutation type: ${args.type}, global type: ${type}`)
          return
        }
      }

      store.commit(type, payload, options)
    }
  }

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? () => store.getters
        : () => makeLocalGetters(store, namespace)
    },
    state: {
      get: () => getNestedState(store.state, path)
    }
  })

  return local
}
```

方法看上去很长，但是注释写的很清楚，这个方法是用来给传入的 `store` 增加 `commit`，`dispatch`，`getters`，`state` 这四个属性的。因为我们的例子中 `namespace` 是空，所以 `noNamespace` 的值是 `true`，所以定义的 `local` 变量的两个属性的值其实就是 `store.commit` 和 `store.dispatch`，最后再对这个 `local` 对象扩充 `getters` 和 `state` 两个属性。这里要注意的是，`getters` 和 `state` 的值都是函数，也就是说必须要调用函数才能获取到对应的值，这一种懒加载的获取方式，因为这两个属性的值在 `vm` 更新的时候会改变，我们分析到的时候再介绍，这里有个了解即可。

得到了 `local` 以后，我们再来看最后的一段逻辑：
```js
module.forEachMutation((mutation, key) => {
  const namespacedType = namespace + key
  registerMutation(store, namespacedType, mutation, local)
})

module.forEachAction((action, key) => {
  const type = action.root ? key : namespace + key
  const handler = action.handler || action
  registerAction(store, type, handler, local)
})

module.forEachGetter((getter, key) => {
  const namespacedType = namespace + key
  registerGetter(store, namespacedType, getter, local)
})

module.forEachChild((child, key) => {
  installModule(store, rootState, path.concat(key), child, hot)
})
```

可读性很强的一段代码，主要是注册 `mutation`，`action`，`getters` 和给 `children` 注册这些属性，还是那句话，我们的例子中这些都没有，所以这些都走不到，可以先不看。

以上花了很长的篇幅去介绍 `installModule(this, state, [], this._modules.root)` 这段代码的逻辑，其实这里面很多代码我们这个例子都用不到，所以整体看下来，做的事情其实并不多。我们接着往下看：

```js
// initialize the store vm, which is responsible for the reactivity
// (also registers _wrappedGetters as computed properties)
resetStoreVM(this, state)
```
这里也非常关键，通过注释我们大概了解到，这里是初始化了 `store` 的 `vm` 实例，用来处理响应式数据的。另外也注册了 `_wrappedGetters` 作为计算属性。我们来看一下如何实现的：

```js
function resetStoreVM (store, state, hot) {
  const oldVm = store._vm

  // bind store public getters
  // 绑定 store 的公用的 getters
  store.getters = {}
  // reset local getters cache
  // 重制局部的 getters 缓存
  store._makeLocalGettersCache = Object.create(null)
  const wrappedGetters = store._wrappedGetters
  const computed = {}
  forEachValue(wrappedGetters, (fn, key) => {
    // use computed to leverage its lazy-caching mechanism
    // direct inline function use will lead to closure preserving oldVm.
    // using partial to return function with only arguments preserved in closure environment.
    computed[key] = partial(fn, store)
    Object.defineProperty(store.getters, key, {
      get: () => store._vm[key],
      enumerable: true // for local getters
    })
  })

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store)
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(() => {
        oldVm._data.$$state = null
      })
    }
    Vue.nextTick(() => oldVm.$destroy())
  }
}
```

函数一开始是一些属性的 `reset` 的逻辑，我们其实最关注的是这一段：

```js
const silent = Vue.config.silent
Vue.config.silent = true
store._vm = new Vue({
  data: {
    $$state: state
  },
  computed
})
Vue.config.silent = silent
```

这里，使用 `Vue` 构造器来盛放我们的 `state` 和 `getters`，并且赋值给 `_vm` 属性。所以，我们的 `state` 才可以有响应式的能力。最后针对 `oldVm`，如果存在的话那么就调用它的 `$destroy` 方法去执行销毁。本例因为我们是初始化的操作，所以不会走到这段逻辑。

最后再来看一下 `Store` 构造器最后的几行代码：

```js
// apply plugins
// 插件注册
plugins.forEach(plugin => plugin(this))

// devTool 的一些处理，暂时不考虑
const useDevtools = options.devtools !== undefined ? options.devtools : Vue.config.devtools
if (useDevtools) {
  devtoolPlugin(this)
}
```

最后针对插件做了一些处理，至此，针对我们最初的例子而言，调用 `new Store` 以后的流程都介绍完了。

再回到我们的例子中，我们将 `this.$store.state.message` 赋值给一个计算属性 `message`，然后这个计算属性就能正确的拿到我们的 `store` 中定义的 `state.message` 的值，这是为什么呢？

其实在我们的 `Store` 构造器中，还有一个 `state` 的 `getter` 和 `setter`：

```js
get state () {
  return this._vm._data.$$state
}

set state (v) {
  if (process.env.NODE_ENV !== 'production') {
    assert(false, `use store.replaceState() to explicit replace store state.`)
  }
}
```

`get` 中返回的，正是我们之前讲过的 `store._vm` 的数据，我们可以通过 `_data` 来获取定义在 `data` 中的属性，这个 `_data` 呢是 `Vue` 的内部属性，我们在 `Vue` 组件中直接获取的 `this.xxx` ，其实都是通过这个 `_data` 代理出去的。这里很显然，我们的 `_data.$$state` 就是我们在分析 `resetStoreVM` 时介绍过的 `new Vue` 的那段逻辑。是不是有点清晰了？

另外，如果你尝试直接修改 state 的值，开发环境下会给你报错，让你通过 `store.replaceState()` 来修改，这个我们后面也会说到。


## mapState 使用方法

接着我们再看看另一个跟 `state` 有关的函数：`mapState`。假设有一个场景，我们需要从 `state` 中获取很多数据，我们会这样写：
```js
export default {
  computed: {
    name() {
      return this.$store.state.name
    },
    message() {
      return this.$store.state.message
    },
    showHeader() {
      return this.$store.state.showHeader
    }
  }
}
```

已经可以看到，出现了很多相似的代码逻辑了，想要避免这种重复代码，`mapState` 就是一个很好的选择，我们可以这么来优化：

```js
export default {
  computed: mapState({
    msg: state => state.message,
    name: 'name',
    isHeaderVisible: 'showHeader' 
  }),
}
```

这样你就有了三个计算属性：`msg`，`name`，`isHeaderVisible`，分别对应着 `state` 中的 `message`，`name` 和 `showHeader`。如果计算属性的名称和 `state` 的一样的话，甚至可以这么简写：

```js
export default {
  computed: mapState(['message', 'name', 'showHeader']),
}
```

是不是很简洁明了，下面我们就来结合第一个例子看看这个神奇的 `mapState` 的实现原理，它定义在 `src/helper.js` 中。

## mapState 实现原理

```js
/**
 * Reduce the code which written in Vue.js for getting the state.
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} states # Object's item can be a function which accept state and getters for param, you can do something for state and getters in it.
 * @param {Object}
 */
export const mapState = normalizeNamespace((namespace, states) => {
  const res = {}
  if (process.env.NODE_ENV !== 'production' && !isValidMap(states)) {
    console.error('[vuex] mapState: mapper parameter must be either an Array or an Object')
  }
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState () {
      let state = this.$store.state
      let getters = this.$store.getters
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapState', namespace)
        if (!module) {
          return
        }
        state = module.context.state
        getters = module.context.getters
      }
      return typeof val === 'function'
        ? val.call(this, state, getters) // 这里的 this，是在运行时绑定的，也就是我们的 vm 实例的作用域
        : state[val]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})
```

`mapState` 函数是通过高阶函数生成的，我们先来看一下这个 `normalizeNamespace` 的实现：

```js
/**
 * Return a function expect two param contains namespace and map. 
 * it will normalize the namespace and then the param's function will handle the new namespace and the map.
 * @param {Function} fn
 * @return {Function}
 */
function normalizeNamespace (fn) {
  return (namespace, map) => {
    if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(namespace, map)
  }
}
```

这个函数其实就是对我们的参数做了一层规范化。因为我们的 `mapState` 是可以支持 `namespace` 的，我们后面讨论到 `Module` 的时候再详细介绍。本例中我们直接传递了 `state`，所以对应的第一个参数 `namespace` 是个对象，所以会走第一个 `if` 分支，对参数做一次规范化。即设置 `namespace` 为空字符串，再把我们设置的 `state` 赋值给 `map`。这样做的好处是，可以针对所有的场景只调用 `fn(namespace, map)`。其实在 `Vue` 的源码中也有大量类似的 `normalize` 的操作，这样的目的主要是针对用户不同的使用方式，内部可以使用统一的底层接口来处理，而不用针对每一个场景单独处理。

再回到原来的函数中去，这时候 `normalizeNamespace((namespace, states) => { ... })` 中的 `namespace` 是 `""`，`states` 则是：

```js
{
  msg: state => state.message,
  name: 'name',
  isHeaderVisible: 'showHeader' 
}
```

然后在开发环境会对这个 `states` 做一次 `isValidMap` 的校验：

```js
function isValidMap (map) {
  return Array.isArray(map) || isObject(map)
}
```

很简单，就是看它是不是对象或者是数组，如果都不是的话，会报错提示。接着就开始对这个 `states` 做处理了，它先调用了一下 `normalizeMap`，我们来看看它的用途：

```js
/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap (map) {
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}
```

其实注释上写的很详细了，就是对 `state` 做一次规范化，统一转成一个**包含 `{ key: xx, val: xx }` 对象的数组**，此时你应该恍然大悟，原来这就是`mapState` 支持传入数组参数的原理啊！是的，就像 `mapState(['message', 'name', 'showHeader']),` 这个例子一样，最后还是统一的转成对象数组来处理的，no magic ～

好了，数据源准备好了，我们就可以开始进入正题了：

```js
const res = {}
normalizeMap(states).forEach(({ key, val }) => {
  res[key] = function mappedState () {
    let state = this.$store.state
    let getters = this.$store.getters
    if (namespace) {
      const module = getModuleByNamespace(this.$store, 'mapState', namespace)
      if (!module) {
        return
      }
      state = module.context.state
      getters = module.context.getters
    }
    return typeof val === 'function'
      ? val.call(this, state, getters)
      : state[val]
  }
  // mark vuex getter for devtools
  res[key].vuex = true
})
```

可以看到，我们的 `res[key]` 其实是一个函数，也就是我们最终在页面上的计算属性的值。我们这里没有 `namespace` 所以也不会去计算 `module` 的值。接着会判断 `val` 是不是函数，是的话，就调用它来获取值，否则就直接使用 `state[val]` 的值，最后再给它设置 `vuex` 为 `true`，这是一个给开发工具用的一个标记，这里可以不用管。

我们可以结合我们的例子来看一下这个处理过程：

对于 `msg: state => state.message` 而言，它在遍历时，`key` 是 `msg`，`val` 是 `state => state.message` 函数。所以最后返回的是 `val.call(this, state, getters)`，即通过函数调用的方式拿到了 `this.$store.state.message` 的值。其实这里也可以看出来，我们的 `val` 其实还可以接受第二个参数，也就是 `getters`，即可以是这样的：`msg: (state, getters) => state.message + getters.extraMessage`。

对于 `isHeaderVisible: 'showHeader'` 而言，它在遍历时，`key` 是 `isHeaderVisible`，`val` 是 `"showHeader"` 字符串。所以最后返回的是 `state[val]` 也就是 `this.$store.state['showHeader']`。

最后，在 `mapState` 函数的结束时，返回这个充满着数据的 `res` 对象，就 OK 了。所以我们 `mapState` 返回的是一个对象，它的每一个属性的值都是一个函数，通过调用这个函数，我们能拿到对应的 `state` 的值。

## 总结

本节我们分析了 `state` 相关的实现，主要包括 `Store` 的初始化流程，`state` 是如何被使用的，以及 `mapState` 的实现原理。结合我们的具体例子，其实真正执行的代码并不多，所以这里对整体流程的梳理还是很有帮助的，不必受一些非必要逻辑的干扰。其实我们没有走的那些逻辑，大部分都和 `module`、`namespace` 有关，我们后面分析到的时候还会回来继续分析，这样也可以帮助大家加强对整个流程的理解。

