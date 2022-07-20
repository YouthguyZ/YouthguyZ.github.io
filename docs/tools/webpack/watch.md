---
sidebarDepth: 3
---

# Watch

webpack 可以监听文件的改动，并且重新编译。本节我们就来看看如何配置。

## 开启文件监听

要开启文件监听很简单：

```js
module.exports = {
  //...
  watch: true
};
```

上面的配置结果是，webpack 在初次打包后，会继续的监听文件的变化，一有修改就会重新编译打包。

值得注意的是，在 webpack-dev-server 和 webpack-dev-middleware 中 watch 是默认为 true 的。这也是我们配置 devServer 时，不需要配置 watch 的原因（但是你可以配置 devServer.watchOptions ）。

## 配置监听选项

webpack 提供了一个 watchOptions 配置项，可以让我们控制监听的一些行为。

### aggregateTimeout

它是一个数字类型的值。它表示在上一次构建后，等待多少毫秒去收集本次的更新，然后聚合到一次构建中。**它的单位值是毫秒。** 通俗的理解，就是前后两次构建的等待时间。

```js
module.exports = {
  watch: true,
  watchOptions: {
    aggregateTimeout: 2000 // 表示每隔两秒构建一次（如果有文件修改的话）
  }
}
```

### ignored

忽略哪些文件的监听。一般为了性能需要，我们会忽略那些包含很多文件的目录，比如 node_modules。


```js
module.exports = {
  watch: true,
  watchOptions: {
    // ignored: '/node_modules/', // 正则形式
    ignored: ['files/**/*.js', 'node_modules/**'] // 数组形式（使用 anymatch 模式匹配）
  }
}
```


### poll

是否轮询。它为 true 的话表示开启轮询，为 false 的话表示关闭轮询，默认是 false。它也可以是一个数字，表示轮询的时间间隔。

如果监听模式不起作用的话，可以尝试一下这个选项。

```js
module.exports = {
  watch: true,
  watchOptions: {
    poll: true
  }
}
```

### info-verbosity

这是一个命令行选项，只能在命令行运行，用来控制监听时的日志显示。

它的选项可以是 none, verbose, info。比如下面的命令就表示不输出相关的日志信息：

```bash
webpack --watch --info-verbosity none
```