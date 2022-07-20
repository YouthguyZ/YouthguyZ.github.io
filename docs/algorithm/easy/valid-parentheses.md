# LeeCode 第 20 题

## 问题描述

给定一个只包括 `(`, `)`, `{`, `}`, `[`, `]` 的字符串，判断字符串是否有效。

有效字符串需满足：

  - 左括号必须用相同类型的右括号闭合。
  - 左括号必须以正确的顺序闭合。

注意空字符串可被认为是有效字符串。


## I/O 示例

- 示例 1:<br>
输入: "()"<br>
输出: true

- 示例 2:<br>
输入: "()[]{}"<br>
输出: true

- 示例 3:<br>
输入: "(]"<br>
输出: false

- 示例 4:<br>
输入: "([)]"<br>
输出: false

- 示例 5:<br>
输入: "{[]}"<br>
输出: true

## 解题思路

利用 **栈** 的结构解决。

## 编码实现

```js
var isValid = function (s) {
  let stack = []
  for (let i = 0; i < s.length; i++) {
    const cur = s[i]
    if (cur === '(' || cur === '{' || cur === '[') {
      stack.push(cur)
    } else {
      let top = stack[stack.length - 1]
      if (top === '{' && cur === '}') stack.pop()
      else if (top === '[' && cur === ']') stack.pop()
      else if (top === '(' && cur === ')') stack.pop()
      else stack.push(cur)
    }
  }
  return stack.length === 0
};
```