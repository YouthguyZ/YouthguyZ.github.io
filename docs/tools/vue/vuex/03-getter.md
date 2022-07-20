# Getters 详解

## getter 使用方法

其实 `getters` 很像我们在 `Vue` 中使用的**计算属性**，它的用法也很简单：

```js
const store = new Vuex.Store({
  state: {
    firstName: 'Jerry',
    lastName: 'Yuan'
  },
  getters: {
    fullname(state) {
      return state.firstName + ' ' + state.lastName
    }
  }
})
```

我们在 `Vue` 里面，可以这么来使用 `getters`：

```js
export default {
  data () {
    return {
      name: this.$store.getters.fullname
    }
  }
}
```

是不是很简单。本节我们就来看看它的内部实现原理。

## getter 实现原理

还记得上一节我们分析 `state` 的时候，在 `Store` 构造函数里面会初始化一些内部的变量，其中有两个是跟 `getters` 相关的：

```js
this._wrappedGetters = Object.create(null)
this._makeLocalGettersCache = Object.create(null)
```

这两个一看就是跟 `getters` 相关的有木有！根据名字，我们看出来 `_wrappedGetters` 是一个包装了 `getters` 的对象，而 `_makeLocalGettersCache` 则是跟缓存相关的对象，本节我们分析不到这个变量。

我们继续往下看，接着就到了我们之前介绍过的：

```js
installModule(this, state, [], this._modules.root)
```

这里面的逻辑我们就不啰嗦了，上一节都有介绍过，我们只看跟 `getters` 相关的逻辑即可。所以我们来看这一段代码：

```js
const local = module.context = makeLocalContext(store, namespace, path)
```

生成局部上下文时，会初始化我们的 `getters` 对象，我们来看一下：

```js
function makeLocalContext (store, namespace, path) {
  const noNamespace = namespace === ''
  const local = {} // 省略 ...
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
```

我们给 `local` 扩充属性的时候，定义了一个 `getters`，它是一个函数，只有在调用的时候才会求值，是懒加载的一种实现。它返回的值是 `store.getters`。注意的是，这个 `makeLocalContext` 函数返回的值，是赋值给我们的` module.context` 的，在我们的例子中，也就是根模块 `store._modules.root`。我们继续看后面会对这个 `local` 做什么操作：

```js
module.forEachGetter((getter, key) => {
  const namespacedType = namespace + key
  registerGetter(store, namespacedType, getter, local)
})
```

这个 `module.forEachGetter` 方法是在 `module/module.js` 的 `Module` 类中定义的，很简单：

```js
forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn)
  }
}
```

在上一节我们分析过了，此时的 `this._rawModule` 对应的正是我们的 `options`，所以这里的 `getters` 是：
```js
{
  fullname(state) {
    return state.firstName + ' ' + state.lastName
  }
}
```

所以会遍历这个 `getters` 对象，用 `fn` 函数操作它。这个 `forEachValue` 函数也很简单：

```js
export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}
```

就是遍历这个对象的属性，然后用传入的函数来操作这些属性，属性值作为第一个参数，属性的 key 作为第二个参数，比如：

```js
forEachValue({name:'jerry', age: 12}, (value, key) => {
  console.info(key, value)
})

>> name jerry
>> 12 age
```

其实对于这些工具函数，如果不知道它的意思，但是又想最快的知道它的用途，可以去对应的单元测试里面去看看，在 `test/unit/*` 下。这也是源码学习的一个技巧。

好了，所以此时这个函数中： `module.forEachGetter((getter, key) => { ... })` 的参数 `getter` 是我们的函数：

```js
function fullname(state) {
  return state.firstName + ' ' + state.lastName
}
```

`key` 就是 `fullname` 了。其实看上去有点绕，但是实际上做的就是一件事，遍历 `getters`，用回调来处理里面的每一个属性和值。所以我们来看看回调中的这句代码：

```js
registerGetter(store, namespacedType, getter, local)
```

它的实现：

```js
function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] duplicate getter key: ${type}`)
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  }
}
```

很清晰。首先先检查有没有重复的定义 `getter`，如果有的话在开发环境下报错。如果没有定义过，那么就给 `store._wrappedGetters` 对象添加这个属性，它的 `key` 是我们的 `getter` 的名字，值是一个函数：

```js
function wrappedGetter (store) {
  return rawGetter(
    local.state, // local state
    local.getters, // local getters
    store.state, // root state
    store.getters // root getters
  )
}
```

这个函数的参数是 `store`，函数只做了一件事，就是调用我们的 `rawGetter` 函数，并且给它填充几个参数，注释写的也很清晰，分别是局部 `state`，局部 `getters`，根 `state`，根 `getters`。所以我们在定义 `getter` 的时候，第一个参数是当前模块下的 `state`, 第二个参数是当前模块下的 `getter`,后面两个在模块下使用的，后续再说。

到这里，我们就给 `store._wrappedGetters` 赋上了我们定义的 `getters` 了，继续回到 `Store` 的构造函数往下看：

```js
resetStoreVM(store, state, hot)
```

这个函数我们上一节分析过，不过是针对 `state` 的，这一节我们可以针对性的分析 `getter` 了，具体的逻辑在这里：

```js
function resetStoreVM (store, state, hot) {
  const oldVm = store._vm

  // bind store public getters
  store.getters = {}
  // reset local getters cache
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
  const silent = Vue.config.silent
  Vue.config.silent = true
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed
  })
  Vue.config.silent = silent
  // 省略 ....
}
```

可以看到，我们遍历了包含 `getters` 的 `store._wrappedGetters` 对象，并且赋值给了 `computed` 对象，这个对象会作为 `Vue` 实例中的计算属性传入。我们来分析一下给计算属性赋值的过程：

```js
computed[key] = partial(fn, store)
```

其中 `partial` 的定义：

```js
export function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}
```

所以，此时 `computed['fullname']` 的值是：

```js
function () {
  return fn(arg)
}
```
思考一下，这里为什么用 `partial` 包一层呢？其实这也是一种懒加载的模式。因为我们返回的是一个函数，这个函数没被调用之前，它的内部是不确定的。即这个时候，`fn` 的值是未知的，得运行时才能确定。另外这里还考虑了行内函数引起的闭包的问题。

此时，对 `Vue` 源码了解的同学应该知道，**这个计算属性对应的 `computedWatcher` 的 `getter`属性其实就是上面这个函数。** 这个我们后面对计算属性求值的时候会用到。

接着，往 `store.getters` 中添加这个属性，它是只读的，它的值是 `store._vm[key]`。

好了，现在我们的 `getters` 的初始化就完成了。相信这时候，你已经知道我们在页面使用 `this.$store.getters.fullname` 是如何获取到这个正确的值了吧。我们根据这个例子再走一遍流程吧。使用 `this.$store.getters.fullname` 获取 `fullname`，会触发 `get` 访问器，也就是这里定义的：

```js
Object.defineProperty(store.getters, key, {
  get: () => store._vm[key],
  enumerable: true // for local getters
})
```
出发了**访问器**后，会执行函数来获取值，这里的值就是 `store._vm['fullname']`，然而，`store._vm` 是一个 `Vue` 实例，访问它的属性会触发 `Vue` 的响应式系统获取值。这里会触发 `fullname` 对应的 `computedwatcher` 的求值，也就是会调用：

```js
function () {
    return fn(arg)
  }
```

这里的 `arg` 是我们的 `store`， `fn` 是一个包装函数，我们上面分析过了：

```js
function wrappedGetter (store) {
  return rawGetter(
    local.state, // local state
    local.getters, // local getters
    store.state, // root state
    store.getters // root getters
  )
}
```

所以最终会触发 `rawGetter` 这个函数的执行， `rawGetter` 其实就是我们的自己定义的获取函数：

```js
function fullname(state) {
  return state.firstName + ' ' + state.lastName
}
```

顺便提一下，在这个 `getter` 函数中使用 `state.firstName`  和 `state.lastName` 同样的会触发 `Vue` 的响应式系统，这个也就是之前分析过的 `state` 的取值过程。

## mapGetters 使用方法

跟 `state` 类似，我们的 `getters` 也有类似的 map 方法：

```js{20}
const store = new Vuex.Store({
  state: {
    firstName: 'Jerry',
    lastName: 'Yuan'
  },
  getters: {
    fullname(state) {
      return state.firstName + ' ' + state.lastName
    },
    reversedFullname(state) {
      return state.lastName + ' ' + state.firstName
    }
  }
})

var vm = new Vue({
  el: '#app',
  store,
  computed: {
    ...Vuex.mapGetters(['fullname', 'reversedFullname'])
  }
})
```

它的实现也很简单，有了上一节对 `mapState` 的理解，这里就很轻松了。

## mapGetters 实现原理

它的实现也在 `src/helper.js` 中：

```js
/**
 * Reduce the code which written in Vue.js for getting the getters
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} getters
 * @return {Object}
 */
export const mapGetters = normalizeNamespace((namespace, getters) => {
  const res = {}
  if (process.env.NODE_ENV !== 'production' && !isValidMap(getters)) {
    console.error('[vuex] mapGetters: mapper parameter must be either an Array or an Object')
  }
  normalizeMap(getters).forEach(({ key, val }) => {
    // The namespace has been mutated by normalizeNamespace
    val = namespace + val
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(`[vuex] unknown getter: ${val}`)
        return
      }
      return this.$store.getters[val]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})
```

首先一开始，还是检查了 `getters` 的类型，如果不是数组或者对象的话，会在开发环境报一个错误。接着我们对 `getters` 做一次 `normalize`，然后在循环中对它的 `key` 和 `val` 做处理。它会我们的 `res` 对象添加属性，`key` 为 `getter` 的 `key`，值是一个 `mappedGetter` 的函数，我们来看一下这个内部的函数的实现：

```js
res[key] = function mappedGetter () {
  if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
    return
  }
  if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
    console.error(`[vuex] unknown getter: ${val}`)
    return
  }
  return this.$store.getters[val]
}
```

第一个判断是针对 `namespace` 的，这里我们不用管。第二个判断是如果没有找到对应的 `getter` 也会在开发环境给用户报错。找到的话，就直接返回这个 `this.$store.getters[val]`，也就是说，是直接通过 `key` 来访问 `this.$store.getters` 对象的。

注意了，这里的 `this` 也是运行时绑定的，由于我们是在 `Vue` 实例中运行的，所以这里的 `this` 就是我们当前的 `Vue` 实例。

最后返回 `res` 对象，包含我们需要的这些 `getters` 。

## 总结

本节我们介绍了 `getters` 和 `mapGetters` 的使用和实现原理，通过上面的分析可以看出，它其实是借用 `Vue` 的计算属性实现的。当我们访问一个 `getter` 的时候，实际上是访问了当前 `store` 中的 `_vm` 实例上的对应的计算属性，触发计算属性的求值，最后得出我们的 `getter` 的值。 然后关于 `mapGetters` 也和我们上一节介绍的 `mapState` 大同小异，主要是让开发者少写一点重复代码，内部的实现其实就是遍历传入的 `getters` 对象，然后依次给你转成 `getters` 的实现。下一节我们将介绍如何利用 `mutation` 来修改我们的 `state`。