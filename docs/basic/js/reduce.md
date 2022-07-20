# 我叫reduce，我很厉害

`reduce`方法的语法如下：
```js
arr.reduce(callback( accumulator, currentValue[, index[, array]] )[, initialValue])
```
它接收一个回调函数和一个可选的初始值。一般称这个函数为`reducer`函数，它函数作用于数组上的每一个元素，返回一个单一的值，它接收四个参数：

- `累加器（Accumulator）`
    
    如果`reduce`方法没有提供初始值的话，那么它的值就是上一次回调函数返回的值（第一个默认为数组的第一项）；如果提供了，那么他就等于初始值。

- `当前值（Current Value）`

    数组中正在被计算的元素。

- `当前索引（Current Index）`

    正在被计算的元素在数组中的索引。如果提供了初始值，那么这个索引从1开始；否则从0开始。

- `源数组（Source Array）`

    调用`reduce`函数的源数组。

## `reduce` 工作原理

先来看这个简单的例子，没有初始值的情况

```js
[1, 2, 3, 4].reduce((accumulator, currentValue, currentIndex, arr) => {
  return accumulator * currentValue
})
```

这个回调函数会被调用三次，每一次调用的参数和返回值如下：

| callback 函数|    accumulator 累加器  |  currentValue 当前值   |  currentIndex 当前索引 | arr 数组 |  返回值 |
|-------------|:----------------------:|:--------------------:|:------------------:|:---------:| --------:|
|   第一次调用  |           1               |       2           |        1         | `[1,2,3,4]`|   2    |
|   第二次调用  |           2               |       3           |        2         | `[1,2,3,4]`|   6    |
|   第三次调用  |           6               |       4           |        3         | `[1,2,3,4]`|   24   |

所以上面的reduce方法最终返回**24**，也就是各项的乘积。我们再来看看提供初始值的情况。

```js
[1, 2, 3, 4].reduce((accumulator, currentValue, currentIndex, arr) => {
  return accumulator * currentValue
}, 5)
```

这个`callback`函数会被调用四次，每一次调用的参数和返回值如下：

| callback 函数|    accumulator 累加器  |  currentValue 当前值   |  currentIndex 当前索引 | arr 数组 |   返回值  |
|-------------|:----------------------:|:--------------------:|:---------------------:|:---------:| --------:|
|   第一次调用  |           5            |       1              |        0              | `[1,2,3,4]`|   5    |
|   第二次调用  |           5            |       2              |        1              | `[1,2,3,4]`|   10   |
|   第三次调用  |           10           |       3              |        2              | `[1,2,3,4]`|   30   |
|   第三次调用  |           30           |       4              |        3              | `[1,2,3,4]`|   120  |

可以看到，加了初始值以后，数组是从第一个元素开始迭代的，一共迭代了4次，最终结果就是初始值与数组各个元素的乘积**120**。

对比上面两个例子，我想你对于`reduce`的工作原理应该已经有了思路，其实稍微有点绕的是第一个参数`accumulator`的计算方式。为了方便你理解，我从网上摘了一些例子，读者可以根据这些例子来加深对`reduce`函数的理解。


## `reduce` 应用

### 求一个数组的各元素之和

```js
let sum = [0, 1, 2, 3].reduce((accumulator, currentValue) => {
  return accumulator + currentValue
}, 0)

console.info(sum) // 6
```

对于求对象数组中的某一个属性的和也是小case，比如求一个班级的所有学生的总分：

```js
let clazz = [{ name: 'jerry', score: 50 }, { name: 'judy', score: 97 }]
let sum = clazz.reduce((accumulator, currentValue) => {
    return accumulator.score + currentValue.score
})

console.log(sum) // 147
```

### 数组拍平

```js

let flattened = [[0, 1], [2, 3], [4, 5]].reduce(
  function(accumulator, currentValue) {
    return accumulator.concat(currentValue)
  },[])

console.info(flattened) // [0, 1, 2, 3, 4, 5]
```

### 数组去重

```js
var arr = [1,2,3,4,1,2,4]

var uniArr = arr.reduce((pre, cur) => {
  if (pre.indexOf(cur) < 0) {
    pre.push(cur)
  }
  return pre
}, [])

console.info(uniArr) // 1,2,3,4]
```

### 统计数组中各项出现的次数

```js
var arr = ['kobe','fisher','casol','farmer','worldpeace','kobe','fisher','kobe','casol']
var countedArr = arr.reduce((pre, cur) => {
  if (cur in pre){
    pre[cur] ++
  } else {
    pre[cur] = 1
  }
  return  pre;
}, {})

console.info(countedArr) // {kobe: 3, fisher: 2, casol: 2, farmer: 1, worldpeace: 1}
```

### 根据属性对对象数组分组

```js
var arr = [
    {name: 'kobe', titles: 5},
    {name: 'duncun', titles: 5},
    {name: 'curry', titles: 3},
    {name: 'jerry', titles: 0}
]

function groupBy(objectArr = [], property){
  return objectArr.reduce((pre, cur) => {
    const key = cur[property];
    if (!pre[key]) {
      pre[key] = []
    }
    pre[key].push(cur)
    return pre;
  }, {})
}

const groupedArr = groupBy(arr, 'titles')
console.info(groupedArr)
// { 0: [{name: 'jerry', titles: 0}], 3: [{name: 'curry', titles: 3}], 5: [{name: 'kobe', titles: 5}, {name: 'duncun', titles: 5}]}

```

### 函数管道

函数管道，可以简单的理解为一组函数按顺序执行，第二个函数的参数是第一个函数的返回值，第三个函数的参数是第二个参数的返回值...以此类推

```js
function pipe(...fns){
  return function(input) {
    return fns.reduce((pre, cur) => {
      return cur(pre)
    }, input)
  }
}

// 写成比较高大上的写法就是 MDN 上面的剪头函数了，如下：
// const pipe = (...fns) => input => fns.reduce((pre, cur) => cur(pre), input)

// 一些要组合的函数
const double = a => a + a
const triple = a => a * 3
const add100 = a => a + 100

const times12 = pipe(double, triple, double)
const times4 = pipe(double, double)
const all = pipe(add100, double, triple)

const a = times12(10) // 120: 10x2x3x2
const b = times4(5) // 20: 5x2x2
const c = all(2) // 612: (2+100)x2x3
```

### 按顺序执行一组Promise

```js
function runPromisesInSeq(promises = [], input) {
  return promises.reduce((pre, cur) => {
    // 这里的`pre`指的是上一个Promise，`cur`指的是当前Promise
    return pre.then(cur)
  }, Promise.resolve(input))
}

function p1(a) {
  return new Promise(r => r(a*5))
}

function p2(a) {
  return new Promise(r => r(a+4))
}

function p3(a) {
  return new Promise(r => r(a-3))
}

runPromisesInSeq([p1, p2, p3], 10).then(res => {
  console.info(res) // 51 <= 10x5+4-3
})
```

### 模拟`Array.prototype.map`方法

```js
Array.prototype.reducedMap = function(callback, ctx) {
  return this.reduce((pre, cur, index, arr) => {
    pre[index] = callback.call(ctx, cur, index, arr)
    return pre
  }, [])
}
var arr = [1,2,3].reducedMap((item, index, arr) => {
    return item*index;
})
console.info(arr) // [0, 2, 6]
```

## Polyfill

> TODO

### 参考文章
- [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)