# 模拟 Object.create() 函数

`Object.create`是ES6的新方法，它会基于传入的对象A创建一个新对象B，并且把B的原型指向A。它还支持第二个参数，可以扩展这个新对象。看个例子：
```js
var person = {
  name: 'Kobe'
}

var p1 = Object.create(person, {})

console.info(p1.__proto__ === person) // true

```

很简单的一个功能，就是把`person`作为`p1`的原型对象即可。所以我们的实现也很简单：

```js
Object.myCreate = function(source, properties) {
  if (!(source instanceof Object)) {
    throw new Error('First argument must be an Object');
  }
  function F() {}
  F.prototype = source;
  var obj = new f();
  if (properties && properties instanceof Object) { // 简单的判断一下第二个参数
    Object.defineProperties(obj, properties)
  }
  return obj;
}
```


参考链接：
> [MDN：Object.create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)