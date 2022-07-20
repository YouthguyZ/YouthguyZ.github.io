---
sidebarDepth: 3
---

# Resolve 和 ResolveLoader

这个属性可以修改模块的解析规则。关于模块的解析，可以参考这篇文章 [module resolution](https://webpack.js.org/concepts/module-resolution/)。

## 模块解析规则

这里我们对这个解析规则做一个简单的介绍。

首先我们要知道，webpack 是有自己的默认路径解析规则的，这也是为什么我们在代码中使用 import，require 等语句请求另一个文件，webpack 能正确的加载出来的原因。**解析器是根据资源的绝对路径去定位模块的。** webpack 使用 [enhanced-resolve](https://github.com/webpack/enhanced-resolve) 作为解析器去**解析模块路径**，他的解析规则如下：

### 绝对路径

```js
import '/home/workspace/util';

// or windows
import 'C:\\Users\\me\\file';
```

由于我们已经拿到了绝对路径，这时候就不需要什么解析器去解析了。

### 相对路径

```js
import '../src/util.js'

import './math.js'
```

将当前文件所在目录作为上下文，在根据相对路径的位置去解析对应的文件。

### 模块路径

```js
import 'module'

import 'module/file.js'
```

模块的搜索范围在 **resolve.modules** 中指定的所有目录中。你可以通过配置 **resolve.alias** 给一个模块起一个别名，然后通过这个别名引入这个模块，这里先有个印象，我们下文会具体介绍。

当路径确认后，解析器会检查这个路径指向的是一个文件还是一个目录。

如果指向一个文件的话，分这两种情况：

1. 路径包含文件扩展名，则直接绑定到这个文件
2. 文件不包含扩展名的情况下，会采用 **resolve.extensions** 中的选项，逐一的去试探有没有对应扩展名的文件存在

如果指向一个目录的话，会按如下的流程去确定文件：

1. 如果目录中包含 package.json 文件，那么会按顺序的搜索 resolve.mainFields 中的配置项，找到的第一个匹配项将会决定文件路径
2. 如果没有 package.json 文件，或者 resolve.mainFields 返回的不是一个有效路径，那么会去按顺序的查找 resolve.mainFiles 中的配置项，看在这个目录下能不能找一个匹配的文件
3. 根据 resolve.extensions 的配置解析文件。


如果你对 resolve 的配置不是很了解的话，那么你对上述表述的内容可能不是很清楚。没关系，接下来我们就来看看 resolve 的各项配置，相信你看完以后再来回顾，一定可以理解。


## resolve 配置详解

### alias 🔑

配置模块的别名。看下面的栗子：

如果不使用这个配置，我们引入某个文件可能要写上一连串的路径：

```js
import utils from '../../path/to/utils/'
```
这样的方式，不仅容易出错，而且一旦你变更了文件的路径，你就要去手动的修改引入模块的路径，很不方便。这时候，你就可以使用 alias 来配置：

```js
const path = require('path');

module.exports = {
  //...
  resolve: {
    alias: {
      util: path.resolve(__dirname, 'path/to/utils')
    }
  }
};
```

有了这个配置，你可以直接在代码中通过：`import util from 'util'` 来使用这个模块的内容，相当方便！

从 webpack 5 开始，它的值也可以是一个路径数组：

```js
module.exports = {
  resolve: {
    alias: {
      util: [path.resolve(__dirname, 'path/to/utils'), path.resolve(__dirname, 'path/to/another/utils')]
    }
  }
}
```

你也可以让 webpack 不去解析这个模块路径，只要将它设置成 false 即可。


```js
module.exports = {
  resolve: {
    alias: {
      util: false
    }
  }
}
```

#### 精确匹配

你可以在 key 后面加上一个 $ 表示精确的匹配：

```js
const path = require('path');

module.exports = {
  //...
  resolve: {
    alias: {
      xyz$: path.resolve(__dirname, 'path/to/file.js')
    }
  }
};
```

得到的结果如下：
```js
import Test1 from 'xyz'; // 正确匹配。这就相当于引入了 path/to/file.js 文件
import Test2 from 'xyz/file.js'; // 匹配失败。会执行普通的文件解析。也就是会先去找 node_modules/xyz/file.js，在一级一级往上找。
```

更多的可以参考这张表：[resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealias)


### aliasFields

指定要根据这个 [规范](https://github.com/defunctzombie/package-browser-field-spec) 解析的字段，比如 browser。一般我们很少会配置这个字段。

```js
module.exports = {
  //...
  resolve: {
    aliasFields: ['browser']
  }
};
```

### descriptionFiles  🔑

指定描述文件。

```js
module.exports = {
  //...
  resolve: {
    descriptionFiles: ['package.json']
  }
};
```

### enforceExtension  🔑

强制使用后缀名。如果设置成 true 的话，那么你每个模块引入的代码都要带上后缀名，不然解析会报错。

```js
module.exports = {
  resolve: {
    enforceExtension: false
  }
};
```

### extensions  🔑

要解析的文件的后缀名。如果你引入的文件没有提供后缀的话，那么会按顺序的尝试这里面的后缀，如果找到了，后面的都跳过。

```js
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  }
};
```

假设我有一个 Button.jsx 文件，但是我在其它文件中引入这个 Button 的时候这么引入的：

```js
import Button from './src/components/Button'
```

那么解析器就会先找 src/components/Button.js，没找到，继续找 src/components/Button.jsx，找到了，Ok，结束。


:::tip
如果你配置了这个选项，那么意味这 webpack 默认的规则被你重写了。你项目中所有的文件引入都会使用这个规则去解析。
:::

### mainFields  🔑

当从一个 npm 包中导入时，比如：`import Vue from 'vue'`，用 package.json 中哪个字段的值对应的文件，就是这个属性决定的。它的默认值跟你 webpack 配置的 target 有关：

当 target 为 webworker，web，或者没有指定的时候，默认值为：
```js
module.exports = {
  resolve: {
    mainFields: ['browser', 'module', 'main']
  }
};
```

其它情况下为：
```js
module.exports = {
  resolve: {
    mainFields: ['module', 'main']
  }
};
```

举个栗子，我们常用的 vue.js 的 package.json 文件中有如下的配置：

```json
{
  "main": "dist/vue.runtime.common.js",
  "module": "dist/vue.runtime.esm.js",
}
```

当我们使用 `import Vue from 'vue'` 的时候，在默认的 webpack 配置下，很显然会去找 module 对应的值，也就是我们的 dist/vue.runtime.esm.js 文件。因为 module 在数组的前面，优先级高。


### mainFiles  🔑

当解析到一个目录的时候，应该去找该目录下的哪个文件。

```js
module.exports = {
  //...
  resolve: {
    mainFiles: ['index']
  }
};
```

比如你使用 `import { Button } from './components'` 的时候，它就会找 ./components/index.js 文件。


### modules  🔑

指定 webpack 解析模块时的搜索路径。

他可以是一个相对路径，也可以是一个绝对路径。如果是相对路径的话，它会跟 Node 寻找 node_modules 一样，一层层的往上级找；如果是绝对路径的话，那么就直接在这个路径里面找。

```js
const path = require('path');

module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
};
```

注意，数组里的顺序也代表了查找的优先级。上面的定义表示，针对一个文件，先从 src 目录找（这是一个绝对路径），没找到的话再从 node_modules 找，还没找到的话再从 ../node_modules 找（这是相对路径，会逐层往上找），直到找到为止，否则报错找不到 module。

### unsafeCache

开启不安全的缓存（听着名字就不安全）。设置为 true 的话将会对所有模块做缓存，你也可以指定某个文件夹去单独做缓存。

```js
module.exports = {
  resolve: {
    // unsafeCache: true
    unsafeCache: /src\/utilities/ // 只对 src/utilities 做缓存
  }
};
```

### cacheWithContext

如果启用了 unsafeCache ，那么把 request.context 作为缓存的 key 包含进来。因为 webpack 3.1.0 的时候，当你配置了resolve 或 resolveLoader，那么 context 会在解析缓存的时候被忽略。这个选项是为了性能考虑加上的。


### cachePredicate

A function which decides whether a request should be cached or not. An object is passed to the function with path and request properties. It must return a boolean.

这是一个函数，它决定着要不要对一个请求做缓存。函数有一个参数，它有 path 和 request 两个属性。函数必须返回一个布尔值，来决定缓存与否。

```js
module.exports = {
  //...
  resolve: {
    cachePredicate: (module) => {
      return /node_modules/.test(module.path); // 只对 node_modules 下的做缓存
    }
  }
};
```

### restrictions

这个是 webpack5 新加的配置，用来限制解析的路径。比如你只想解析 js 文件和 css 文件的话，你可以这么配置：

```js
module.exports = {
  //...
  resolve: {
    restrictions: [/\.(js|css)$/]
  }
};
```

这样，你项目中任何解析到其它类型文件的时候，就会报错。


## resolveLoader 配置

resolveLoader 的配置和 resolve 一模一样，唯一不同的是它的作用对象是 loader。

```js
const path = require('path')

module.exports = {
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, './src/my-loaders')], // 指定从 node_modules 和 ./src/my-loaders 中解析 loader
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main']
  }
};
```