# 深拷贝

具体的实现过程可以参考下面两篇文章，这里仅列举出几个需要重视的点：

1. 如何对嵌套对象进行拷贝

2. 如何对数组进行拷贝

3. 如何解决循环引用的问题

4. 对于其他类型，比如Symbol、正则、函数等，如何拷贝

5. 如果对象嵌套过多，如何解决递归会出现栈溢出的情况

### 参考文章

- [https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1](https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1)
- [https://github.com/yygmind/blog/issues/29](https://github.com/yygmind/blog/issues/29)