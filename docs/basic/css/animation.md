# Animation 帧动画

::: tip 帧动画
帧动画（逐帧动画），是一种动画技术，其原理就是将每帧不同的图像连续播放，从而产生动画效果。
:::

## 基本用法

根据帧动画的概念，我们知道要定义一个帧动画的话，需要提供对应的”帧“，我们来看一下最简单的一个例子：

```html
<style>
  .box-1 {
    height: 50px;
    width: 50px;
    background-color: lightcoral;
    animation-name: move;
    animation-duration: 3s;
  }

  @keyframes move {
    from {
      margin-left: 0;
    }

    to {
      margin-left: 100px;
    }
  }
</style>
<div class="box-1"></div>
```

上面的代码定义了一个`move`的动画，这个动画包含两个帧：起始帧`from`和结束帧`to`。在起始帧的时候，小方块的左外边距是0；在结束帧的时候，左外边距是100px，最后我们把这个动画应用到小方块的样式上，使用`animation-name`指定动画名称，使用`animation-duration`指定动画的时长。定义好以后，我们就可以看到，小方块会在三秒内，从左到右，移动100像素。看一下运行结果：

<img alt='动画-小方块移动' src='../images/animation-01.gif' style='border: 1px solid #eaeaea' />

OK，这样一个简单的动画就实现了。看上去挺简单的，下面我们来实现一个稍微复杂一点的动画：小方块绕着一个正方形移动，同时不断变换颜色：

```html {7,8}
<style>
.rect {
  width: 50px;
  height: 50px;
  background-color: lightcoral;
  animation-name: circle-move;
  animation-duration: 4s;
  animation-iteration-count: infinite;
}

@keyframes circle-move{
  25% {
    transform: translateX(250px);
    background-color: aqua;
  }
  50% {
    transform: translate(250px, 250px);
    background-color: blueviolet;
  }
  75% {
    transform: translateY(250px);
    background-color: bisque;
  }
}
</style>

<div class="box-2">
  <div class="rect"></div>
</div>
```

跟第一个例子不同的是，在定义各个帧的时候，我们没有使用`from`和`to`，而是使用了百分比。其次，我们没有定义起始帧和结束帧，那么这里动画执行过程中的起始帧和结束帧就是小方块的初始样式。我们来看看效果：

<img alt='动画-小方块绕圈移动' src='../images/animation-02.gif' width='70%' style='border: 1px solid #eaeaea' />

下面我们开始详细的介绍一下动画相关的各个属性的含义。

## CSS 属性详解

跟动画相关的属性有以下几个：

- `animation-name` 动画名称
- `animation-duration` 动画执行时间
- `animation-delay` 动画延时时间，即动画过多长时间后执行
- `animation-iteration-count` 动画执行次数
- `animation-direction` 动画方向
- `animation-timing-function` 动画函数
- `animation-fill-mode` 动画填充模式
- `animation-play-state` 动画的播放状态
- `animation` 简写形式，可以将上述所有属性写在这里

### `animation-name` 和 `animation-duration`

动画名称和动画时长的值，都可以是一个或多个。比如我们修改第一个例子，让小方块移动的同时，不断变大：

```html {13,14}
<style>
@keyframes enlarge {
  100%{
    height: 100px;
    width: 100px;
  }
}

.box-1 {
  height: 50px;
  width: 50px;
  background-color: lightcoral;
  animation: move, enlarge;
  animation-duration: 3s, 2s;
}
</style>

```

看一下效果：

<img alt='动画-小方块移动和放大' src='../images/animation-03.gif' width='70%' style='border: 1px solid #eaeaea' />

我们给小方块添加了两个动画，一个是右移，一个是放大。移动动画执行3s，放大动画执行2s。可以看到，小方块在往右移动的时候逐渐变大，在第二秒的时候最大，到放大动画的结束帧状态，然后第二秒结束后小方块的大小回到原始状态，但是这时候移动的动画还没结束，所以还要向右移动一秒，然后回到原始位置。


### `animation-delay`

动画延迟时间，即从动画应用在元素上到动画开始的这段时间的长度。。这个属性的值很有意思，默认是0s，代表动画应用到元素上后立即执行。它的值如果是正数，那么表示延时；如果是负数，会让动画立即开始，但是动画会从它的动画序列中某位置开始，例如，如果设定值为-1s，动画会从它的动画序列的第1秒位置处立即开始。

这里还要注意的是，**元素的起始状态和动画的起始帧，这两个是有区别的**。元素的起始状态是元素的属性，动画的起始帧是我们在动画样式里面定义的属性，这两个是不一样的。我们用延时来看看效果：

```html
<style>
  .box-3{
    height: 100px;
    width: 100px;
    background-color: green;
    animation-name: change-color;
    animation-delay: 2s;
    animation-duration: 3s;
  }
  @keyframes change-color {
    0%{
      background: red;
    }
    100%{
      background-color: blue;
    }
  }
</style>
<div class="box-3"></div>
```

执行结果如下：

<img alt='动画-animation-delay' src='../images/animation-04.gif' width='70%' style='border: 1px solid #eaeaea' />

可以看到，小方块没有立即开始变色，而是等了两秒后才开始的。在等的这两秒内，小方块保持了原始状态，也就是绿色，在第二秒（也就是延时）结束后，开始执行动画，进入动画的起始帧，也就是红色，然后从红色向蓝色变色，三秒后结束。

### `animation-iteration-count`

动画执行次数，它也支持多个值。如果设置了多个值，那么每次播放动画时，将使用列表中的下一个值，在使用最后一个值后循环回第一个值。它的值可以为小数，`infinite`（无限播放），不能为负数。

### `animation-direction`

动画的方向，它的值是以下当中的一个或多个：

- `normal` 默认属性，动画在每个循环内，从起始帧向结束帧执行
- `reverse` 与`normal`相反，动画在每个循环内，从结束帧向起始帧执行
- `alternate` 动画交替反向运行，反向运行时，动画按步后退，同时，带时间功能的函数也反向，比如，ease-in 在反向时成为ease-out。计数取决于开始时是奇数迭代还是偶数迭代
- `alternate-reverse` 反向交替， 反向开始交替。动画第一次运行时是反向的，然后下一次是正向，后面依次循环。决定奇数次或偶数次的计数从1开始。

可能看定义比较晦涩，我们来通过一个例子看看四个属性的区别：

```html {16,17,18,19}
<style>
.box-4{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.box-4 div{
  height: 70px;
  width: 70px;
  /* 让文字居中显示 */
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: green;
  color: white;
  animation-name: enlarge;
  animation-duration: 4s;
  animation-delay: 1s;
  animation-iteration-count: 2;
}
.box-4 div:nth-child(1) {
  animation-direction: normal;
}
.box-4 div:nth-child(2) {
  animation-direction: reverse;
}
.box-4 div:nth-child(3) {
  animation-direction: alternate;
}
.box-4 div:nth-child(4) {
  animation-direction: alternate-reverse;
}  
</style>

<div class="box-4">
  <div>normal</div>
  <div>reverse</div>
  <div>alternate</div>
  <div>alternate-reverse</div>
</div>

```

我们设置了动画延时一秒执行，动画持续4s，执行两次。来看看效果：

<img alt='动画-animation-direction' src='../images/animation-05.gif' style='border: 1px solid #eaeaea' />

很清晰的可以看见四个属性的区别了：当设置称`normal`时，也就是默认值时，小方块从小到大；设置为`reverse`时，小方块从大到小；设置为`alternate`时，小方块先从小到大，再从大到小；`alternate-reverse`则刚好相反，先从大到小，再从小到大。


### `animation-fill-mode`

填充模式可能是个比较抽象的概念，它的作用是设置CSS动画在执行之前和之后如何将样式应用于其目标。它的值可以是以下当中的一个或多个：
- `none` 默认值
- `forwards` 目标将保留由执行期间遇到的最后一个关键帧计算值
- `backwards` 动画将在应用于目标时立即应用第一个关键帧中定义的值，并在animation-delay期间保留此值
- `both` 动画将遵循forwards和backwards的规则，从而在两个方向上扩展动画属性

同样的，还是通过例子来直观的感受一下他们的区别：

```html
<style>
.box-5{
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.box-5 div{
  height: 70px;
  width: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: green;
  animation-name: enlarge1;
  color: white;
  animation-duration: 4s;
  animation-delay: 1s;
}
.box-5 div:nth-child(1) {
  animation-fill-mode: none;
}
.box-5 div:nth-child(2) {
  animation-fill-mode: forwards;
}
.box-5 div:nth-child(3) {
  animation-fill-mode: backwards;
}
.box-5 div:nth-child(4) {
  animation-fill-mode: both;
}
@keyframes enlarge1 {
  0%{
    background-color: red;
  }
  100%{
    height: 100px;
    width: 100px;
  }
}
</style>

<div class="box-5">
  <div>none</div>
  <div>forwards</div>
  <div>backwords</div>
  <div>both</div>
</div>

```

我们定义了一个`enlarge1`的动画，这个动画在之前`enlarge`的基础上，多了一个起始帧的状态。我们来看看效果：

<img alt='动画-animation-fill-mode' src='../images/animation-06.gif' style='border: 1px solid #eaeaea' />

首先，第一个`none`没什么可说的；第二个，动画执行完以后，停在了最后一帧，也就是放大后的状态；第三个，立即将起始帧的状态赋给元素，所以我们看到的第三个小块是立即变红的，而第一个和第二个是`delay`一秒后变红（建议自己尝试下代码，gif图上delay的效果看不明显）；第四个就是结合了第二和第三个特点，它立即将起始帧作用于元素，并且动画执行结束停留在最后一帧，所以我们看到的第四个小方块也是立即变红，并且最后停在了100*100的大小。

### `animation-timing-function`

这个属性定义了CSS动画在每一动画周期中执行的节奏。常见的值有`ease`，`linear`等，也可以是函数类型的，比如：`cubic-bezier(0.1, 0.7, 1.0, 0.1)`，`steps(4, end)`，`frames(10)`等，更多可以参考 [MDN - animation-timing-function](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timing-function)。

关于`step()`函数，可以参考张鑫旭老师的这篇文章：[https://www.zhangxinxu.com/wordpress/2018/06/css3-animation-steps-step-start-end/](https://www.zhangxinxu.com/wordpress/2018/06/css3-animation-steps-step-start-end/)

关于`step(num_of_steps, position)`函数，有几点要注意：
1. 第一个参数，表示的是两帧之间的步长。比如`step(2, start)`，代表你的第一帧和第二帧之间要走几次才能走的到
2. `position`为`start`的时候，表示动画立即开始，即会立马走一帧
3. `position`为`end`的时候，动画执行时间结束立马停止，即使后面还有没走完的帧也不管

【因为这里的例子要很多的代码做比较，所以先不写了。占个坑位，以后有时间的话把这里补上】



### `animation-play-state`

动画的播放状态，它的值有两个：`running` 和 `paused`，分别表示动画正在运行和动画暂停。利用这个属性，我们可以控制动画的暂停于播放，来看个例子：

```html
<style>
  .box-7{
    height: 100px;
    width: 100px;
    background-color: blue;
    animation-name: move;
    animation-duration: 3s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  .box-7:hover{
    animation-play-state: paused;
  }
</style>

<div class="box-7"></div>
```

我们还是使用之前的移动动画`move`，并且设置的是双向来回的无限循环的运动，接着我们给元素添加了一个`hover`伪类，表示在鼠标移动到元素上时，动画暂停。我们来看看效果：

<img alt='动画-animation-play-state' src='../images/animation-07.gif' style='border: 1px solid #eaeaea' />

可以看到，当鼠标移入时，动画暂停，鼠标移出时，动画继续上次暂停的位置播放。利用这个属性，我们可以作出网页上那种轮播图的效果，可以参考下一章的[这个例子](./animation-demos#轮播图)。



