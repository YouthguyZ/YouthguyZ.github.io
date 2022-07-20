# Mutation 

## mutation 使用方法

**更改 Vuex 的 store 中的状态的唯一方法是提交 mutation**。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数。我们来看一个例子：

```js
const store = new Vuex.Store({
  state: {
    name: 'Jerry',
  },
  mutations: {
    changeName(state, newName) {
      state.name = newName
    }
  }
})
```

这个 Store 中定义了一个名为 changeName 的 mutation。我们可以在 Vue 组件中这样来使用：

```js
export default {
  methods: {
    change() {
      this.$store.commit('changeName', 'Kobe')
    }
  },
}
```

确实跟事件系统很像，这里相当于“触发”一个 changeName 的事件，并且传递 'Kobe' 作为参数。Store 接收到“事件”以后，会执行 changeName 方法来修改 state 中的 name 属性的值。

## mutation 实现原理

### mutation 的注册

还是老样子，我们还是先看一下 Store 的构造函数，首先初始化了这两个变量：

```js
this._committing = false
this._mutations = Object.create(null)
```

接着重新绑定了 commit 方法的作用域：

```js
this.commit = function boundCommit (type, payload, options) {
  return commit.call(store, type, payload, options)
}
```

然后就是我们熟悉的代码：

```js
installModule(this, state, [], this._modules.root)
```

它的内部会调用 `makeLocalContext` 来生成一个 `local` 对象，之前两节都分析过了，因为此时的 `noNamespace` 为 `true`，所以这个
local 对象的 commit 属性的值就是 store.commit。此时的 local 的值为：

```js
{
  commit: store.commit,
  dispatch: store.dispatch,
  getters: () => store.getters,
  state: () => getNestedState(store.state, path)
}
```

接着就开始注册 mutation 了：

```js
module.forEachMutation((mutation, key) => {
  const namespacedType = namespace + key
  registerMutation(store, namespacedType, mutation, local)
})
```

`module.forEachMutation` 与上一节提到的 `module.forEachGetter` 类似，也是 Module 类上面的方法：

```js
forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn)
  }
}
```

这里的 `this._rawModule` 就是我们的 options，它定义了一个 changeName 的 mutation，所以会进 if 判断里面，执行：

```js
forEachValue(this._rawModule.mutations, fn)
```

也就是遍历这个 mutation 对象，用 fn 去操作。这里的 fn 就是：

```js
(mutation, key) => {
  const namespacedType = namespace + key
  registerMutation(store, namespacedType, mutation, local)
}
```

这个匿名函数了。因为我们的 namespace 为空，所以这里的 namespaceType 就是 key 的值，也就是 changeName，接着执行 `registerMutation` 去注册我们的 mutation。我们来看一下注册的实现逻辑：

```js
function registerMutation (store, type, handler, local) {
  const entry = store._mutations[type] || (store._mutations[type] = [])
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload)
  })
}
```

首先定义我们根据 type ，也就是我们的 mutation 的名称来获取对应的方法，如果没有的话，初始化成一个空数组；接着，往这个数组里面添加一个函数 `wrappedMutationHandler`，这个函数接收一个 payload 作为参数，函数里面调用了：
```js
handler.call(store, local.state, payload)
```

这里的 handler 就是我们自己在初始化 Store 时定义的 changeName 方法，这里我们也可以看出来，为什么 mutation 方法接收的参数，第一个是 state，第二个是 payload 了。

到这里，mutation 的初始化其实就已经完成了，做的事情其实很简单，就是往 `store._mutations` 中添加这个方法。

### mutation 的提交

有了 mutation 以后，我们就可以通过提交 mutation 的方式来修改 state 中某个属性的值了，我们结合一开始的例子看一下：

```js
this.$store.commit('changeName', 'Kobe')
```

调用的这个 commit 方法，其实就是绑定后的 boundCommit 方法，实际调用的还是 `commit.call(store, type, payload, options)` 方法，只不过强行绑定了 store 作为函数运行作用域而已，我们来看看这个 commit 方法的实现：

```js
commit (_type, _payload, _options) {
  // check object-style commit
  const {
    type,
    payload,
    options
  } = unifyObjectStyle(_type, _payload, _options)

  const mutation = { type, payload }
  const entry = this._mutations[type]
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[vuex] unknown mutation type: ${type}`)
    }
    return
  }
  this._withCommit(() => {
    entry.forEach(function commitIterator (handler) {
      handler(payload)
    })
  })
  this._subscribers.forEach(sub => sub(mutation, this.state))

  if (
    process.env.NODE_ENV !== 'production' &&
    options && options.silent
  ) {
    console.warn(
      `[vuex] mutation type: ${type}. Silent option has been removed. ` +
      'Use the filter functionality in the vue-devtools'
    )
  }
}

```

首先执行的是 `unifyObjectStyle` 方法，它其实也是针对参数做规范化，我们来看看它的实现：

```js

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload
    payload = type
    type = type.type
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', `expects string as the type, but found ${typeof type}.`)
  }

  return { type, payload, options }
}
```

由于我们调用 commit 的方式有两种：`commit(type, payload, options)` 或者 `commit({type, palyload}, options)`，所以这个函数会针对两种不同的情况做统一化的操作。可以看出来，如果第一个参数是对象类型的话，那么就说明是通过第二种方式调用的，这时候要手动的把参数向后移位，再给 type 赋值（转化成第一种的方式），最后返回这个统一后的对象 `{ type, payload, options }`。

拿到这个对象以后，再继续往下看：

```js
const mutation = { type, payload }
const entry = this._mutations[type]
if (!entry) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[vuex] unknown mutation type: ${type}`)
  }
  return
}
```

这里把上面生成的统一化对象中的 `{ type, payload }` 合并成一个 mutation 对象，接着获取我们的 mutation 函数，它是一个数组。如果没有找到这个 mutation 的话，会在开发环境报错提示。接着就是我们重点要介绍的一段逻辑了：

```js
this._withCommit(() => {
  entry.forEach(function commitIterator (handler) {
    handler(payload)
  })
})
```

这里的代码实际上在执行我们的 mutation 方法，但是是用 `this._withCommit` 包裹的一层。这个函数也是定义在 Store 构造函数中，我们来看看它是干什么的：

```js
_withCommit (fn) {
  const committing = this._committing
  this._committing = true
  fn()
  this._committing = committing
}
```

它接收一个函数作为参数，然后获取我们当前 store 的 `_committing` 状态，这个我们一开始就介绍了，它的初始值为 false。然后设置它的值为 true，表示当前正在提交 mutation，紧接着就开始执行我们传入的参数，执行完以后复位这个 `_committing` 状态。其实这种模式跟我们的切面编程有点类似，就是在 fn 函数的前后执行一些切面逻辑。

好了，再回到例子中，我们的 fn 对应的就是这个函数：

```js
() => {
  entry.forEach(function commitIterator (handler) {
    handler(payload)
  })
}
```

这个函数的作用，就是遍历我们 entry 中的 mutation，然后执行 `handler` 函数，并把 payload 作为参数传进去。

这里的 handler，其实就是我们上面介绍的这个函数：
```js
function wrappedMutationHandler (payload) {
  handler.call(store, local.state, payload)
}
```

也就是会执行我们的定义好的 `changeName` 方法，去改变 state 中的值。到这里，是不是有一些豁然开朗的感觉呢？

## mapMutations 使用方法

同样的， mutation 也有自己的 map 方法 `mapMutations`，可以将组件中的 methods 映射为 store.commit 调用。例如：

```js
export default {
  // ...
  methods: {
    ...Vuex.mapMutations({
      change: 'changeName'
    })
  }
}
```

## mapMutations 实现原理

我们来看看它的实现：

```js
export const mapMutations = normalizeNamespace((namespace, mutations) => {
  const res = {}
  if (process.env.NODE_ENV !== 'production' && !isValidMap(mutations)) {
    console.error('[vuex] mapMutations: mapper parameter must be either an Array or an Object')
  }
  normalizeMap(mutations).forEach(({ key, val }) => {
    res[key] = function mappedMutation (...args) {
      // Get the commit method from store
      let commit = this.$store.commit
      if (namespace) {
        const module = getModuleByNamespace(this.$store, 'mapMutations', namespace)
        if (!module) {
          return
        }
        commit = module.context.commit
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    }
  })
  return res
})
```

和之前一样的套路，首先检查 mutations 的类型是不是数组或者对象，如果不是的话会在开发环境下报一个错误提示。接着，将 mutations 统一化成数组去遍历。在遍历中，把 key 赋值给 res 作为添加的属性，对应的值就是一个 `mappedMutation` 函数。在这个函数中，我们重点要理解它的返回值这行代码：

```js
return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
```

对应我们的例子，这里的 val 其实是 "changeName" 这个字符串，很显然它执行的是 `commit.apply(this.$store, [val].concat(args))`，翻译一下就是：

```js
commit.apply(this.$store, ['changeName'].concat(args))
```

也就是在 this.$store 的作用域下，执行 `commit('changeName', ...args)`，是不是就是我们直接调用 `this.$store.commit('changeName', ...args)` 一样了？

还有另一种情况，就是我们此时 val 是一个函数，也就是说们的 mapMutations 的参数可以这么写：

```js{4,5,6}
export default {
  methods: {
    ...Vuex.mapMutations({
      change: commit => {
        commit('changeName', 'Jack')
      }
    })
  },
}
```

虽然不常用，但是确实是可以这么做的。这时候在源码中就会执行 `val.apply(this, [commit].concat(args))`，也就是把 commit 作为第一个参数放到这个 val 的参数列表中，这样我们就可以在函数中去提交这个 mutation 了。

## State 必须通过 mutation 来修改吗？

文章一开头提到了，**更改 Vuex 的 store 中的状态的唯一方法是提交 mutation**（这句话引用自 Vuex 官网，不是我说的）。但是真的是这样么？我们直接修改 store.state 中的某个属性，能成功修改吗？比如像这样：

```js
this.$store.state.name = 'Jack'
```

读者不妨先结合之前分析过的 state 的原理思考一下 ...

OK，公布答案，其实这样是完全可以的。先说一下为什么可以修改，因为我们的 state ，最终会被转化为 Vue 实例的 data 属性中的 $$state，即我们的 `store._vm.$$state`，这是一个响应式的对象，我们修改这个对象中的属性值，就相当于我们在修改 Vue 中的 data 中的某个属性一样，没什么区别，所以当然可以啦。

但是这样是**极不推荐**的，Vuex 这样的库主要解决的就是混乱的数据管理问题，把应用的状态集中化。试想我们的 A 组件，B 组件，C 组件等都通过`this.$store.state.name = xxx`  的方式来修改数据的话，我们的代码会很难维护，因为你无法轻易的找到数据是在哪里被修改的。但是通过提交 mutation 的方式，我们不仅可以将状态数据的修改都集中到某一个 mutation 函数中，还可以借助调试工具，一步追踪数据修改的源头，快速定位。

所以，最佳实践就是我们对 state 的每一次的修改，都要通过提交 mutation 来完成。为了强制这一做法，Vuex 提供了一个严格模式的选项，我们可以在初始化的时候传入：

```js
const store = new Vuex.Store({
  // ...
  strict: true
})
```

在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。我们来看一下它的实现原理。

## Strict 实现原理

首先，在我们的 Store 构造函数中，会解构出我们定义的 options 的属性：

```js
const {
    plugins = [],
    strict = false
  } = options

// ...

// strict mode
this.strict = strict
```

可以看到，如果我们没有设置的话，默认是 false，然后保存到实例属性 strict 上。

接着在我们的 `resetStoreVM` 方法中，会根据这个 strict 的值来确定是否启用严格模式：

```js
// enable strict mode for new vm
if (store.strict) {
  enableStrictMode(store)
}
```

如果为 true 的话，那么就会执行 `enableStrictMode` 方法来开启严格模式，我们来看看是如何开启的：

```js
function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, () => {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
    }
  }, { deep: true, sync: true })
}
```

这里你需要对 Vue 源码中响应式模块有些了解了，这里实际上是调用 Vue 实例上的 $watch 方法来监控 this._data.$$state，我们稍微介绍一下这个 $watch 方法的原理：

```js
Vue.prototype.$watch = function (
  expOrFn,
  cb,
  options
) {
  var vm = this;
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options)
  }
  options = options || {};
  options.user = true;
  var watcher = new Watcher(vm, expOrFn, cb, options);
  if (options.immediate) {
    try {
      cb.call(vm, watcher.value);
    } catch (error) {
      handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
    }
  }
  return function unwatchFn () {
    watcher.teardown();
  }
};
```

它接受三个参数，第一个是要计算的表达式或者函数，对应的是一个匿名函数：

```js
function () { return this._data.$$state }
```

第二个是回调函数，对应的是一个箭头函数：

```js
() => {
  if (process.env.NODE_ENV !== 'production') {
    assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
  }
}
```

第三个是附加选项，就是关于这个 watcher 的一些配置信息，对应的是：`{ deep: true, sync: true }`。

执行过程中会走到我们的 `var watcher = new Watcher(vm, expOrFn, cb, options);`，这里的 options 添加了一个 `user: true` 的属性，表明这是用户定义的 Watcher，不是 Vue 内部的。

当创建 Watcher 的时候，expOrFn 会作为 watcher 的 getter，我们就是通过这个 getter 来获取监听对象的；cb 作为回调函数，会在我们使用 getter 求值后调用；options 中的 deep 和 sync 都为 true 表明这是一个深度监听的同步 Watcher。

大体的流程是这样的，我们注册了一个 深度监听的同步 Watcher，它会监听 `this._data.$$state` 也就是我们 Store 中的 `state` ，当它发生改变的时候， watcher 的 update 方法会触发，因为他是同步的，所以会立即执行 watcher 的 run 方法，在这里再通过调用 get 方法去执行我们的 getter 也就是 `function () { return this._data.$$state }` 这个匿名函数。之后，也就是重要的是我们这时候的回调函数会执行：

```js
() => {
  if (process.env.NODE_ENV !== 'production') {
    assert(store._committing, `do not mutate vuex store state outside mutation handlers.`)
  }
}
```

它会检查这时候的 `store._committing` 的值，如果是 false 的话，那么就会再开发环境下报错，提示用户不能用其他方法去修改 state 的值。这个变量我们在分析 commit 方法实现的时候提到过，commit 会调用 `_withCommit` 包裹一层，再来回顾一下：

```js
_withCommit (fn) {
  const committing = this._committing
  this._committing = true
  fn()
  this._committing = committing
}
```

可以看到，在执行我们 mutation 之前，就将这个 `_committing` 设置为 true 了，所以你如果是通过提交 mutation 来修改 state 的话，肯定会走到这一步的；但是如果你是通过其他的方法，比如直接修改 state.name 的数据，那么这个值就还是 false，那么就会出发断言执行，达到警告的目的。简而言之，这个 _committing 就相当于一个标记位。是不是很巧妙呢～

当然，相信你也看出来了，这个 strict 模式的代价是比较大的，因为它创建了一个 **深度&同步** 的 watcher，所以当你的 state 数据量很大的时候，我们的 watcher 计算的代价也是比较高的，所以为了性能考虑，不推荐在正式环境开启这个配置，可以结合环境来动态的设置它的值：

```js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```

## 总结

本节我们介绍了如何通过提交 mutation 的方式去修改 state 的属性，也分析了提交 mutation 这一过程的实现。我们在实际的开发中要遵守这样的约定。最后还分析了 strict 的作用，但是要注意的是，“严格模式会深度监测状态树来检测不合规的状态变更——请确保在发布环境下关闭严格模式，以避免性能损失”。下一节我们将介绍 Action 的使用。