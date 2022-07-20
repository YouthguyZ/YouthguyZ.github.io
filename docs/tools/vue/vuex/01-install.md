# 安装 Vuex

在模块化的系统中，需要使用 `Vue.use(Vuex)` 来安装；当使用全局 `<script>` 标签引用 `Vuex` 时，不需要这样。

## 模块化的安装

`Vue` 的插件机制实现原理：

```js
function initUse (Vue) {
  Vue.use = function (plugin) {
    // 避免重复的安装
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // 把 Vue 作为额外的参数传递进来，这样每个插件就可以获得 Vue 的一些能力
    var args = toArray(arguments, 1);
    args.unshift(this);

    // 如果插件有 install 方法，那么就调用这个方法
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      // 如果插件是个函数，那么直接调用这个函数
      plugin.apply(null, args);
    }
    // 注册插件
    installedPlugins.push(plugin);
    return this
  };
}
```


接着我们再来看看 `src/index.js` 中导出的对象：

```js
export default {
  Store,
  install,
  version: '__VERSION__',
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
  createNamespacedHelpers
}
```

可以看到，是包含了 `install` 方法的，我们来看看它的定义（在src/index.js）：

```js
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```

`install` 方法首先检查了它是否已经存在。通过上面分析 `Vue.use()` 我们已经知道，此时走的是这段逻辑：`plugin.install.apply(plugin, args);`，而这个 `args` 的第一个元素，就是 `args.unshift(this);` 中的 `this` ，即我们的 `Vue` 对象。所以这里的 `install(_Vue)` 中的参数 `_Vue` 就是调用 `use` 的那个 `Vue`。

`store` 里面还声明了一个 `Vue` 的全局变量，会在初次安装的时候赋值为上面的 `_Vue`，完成绑定。当第二次在同一个`Vue`上调用 `use` 的时候，就会触发这段逻辑 `if (Vue && _Vue === Vue) { ... }` ，从而报错。

我们来看一下核心的 `applyMixin(Vue)` 方法的实现，它的实现在 `src/mixin.js` 中：

```js
export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}

```

`mixin.js` 导出的是一个函数。首先进行了 `Vue` 版本的判断，对 `2.x` 和 `1.x` 做了不同的处理。我们主要分析 `2.x` 版本下的实现。它的代码很简单，就一行： `Vue.mixin({ beforeCreate: vuexInit })`，也就是利用 `Vue.mixin` 定义了一个全局的混入 `beforeCreate`，也就是为每一个组件，提供了一个 `beforeCreate` 的钩子，我们来看看它主要做了什么：

```js
function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
```

其实很简单，就是给当前组件实例上添加一个 `$store` 对象。对于根组件，我们直接使用定义在 `options` 上的 `store` 属性即可（如果是函数的话，使用这个函数的返回值）；对于其他的组件，就直接获取 `parent` 上的 `$store` 属性即可，也就是说，最终通过引用关系，它的值其实就是根组件上的 `store`。


## `<script>`标签安装

如果你通过 `<script>` 标签使用 `Vuex` 时，不需要手动的去调用：`Vue.use(Vuex)`，这是为什么呢？我们先来看一下 `Store` 的构造函数

```js
let Vue 

export class Store {
  constructor (options = {}) {
    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue)
    }
    // ...
  }
```

可以看到，在构造函数的一开始，就自动给我们做了 `install` 这件事了。它会先检查 `Vue` 是否已经赋值了，我们通过最开始的分析知道，`Vue` 变量会在 `install` 方法中赋值，如果此时是 `falsy` 的，说明没有调用过 `install` 方法；接着检查 `window.Vue` 是否存在，即当前是浏览器环境，且 `Vue` 已经被引入了。只有满足这几个条件，那么就会自动执行 `install` 操作，并且将当前环境下的 `Vue` 作为参数传递进去。后面的步骤就跟上面的一样了。

## 总结

以上就是安装 `Vuex` 部分的源码分析。一共有两种安装 `Vuex` 插件的方式：模块化的引入和 `script` 标签引入，针对不同的情况，都会有对应的 `install` 方案。