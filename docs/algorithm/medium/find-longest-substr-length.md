# LeeCode 第 3 题

## 问题描述

给定一个字符串，请你找出其中不含有重复字符的**最长子串**的长度。

## I/O 示例

* **示例 1**: <br>
输入: "abcabcbb"<br>
输出: 3 <br>
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。<br>

* **示例 2**:<br>
输入: "bbbbb"<br>
输出: 1<br>
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。<br>

* **示例 3**:<br>
输入: "pwwkew"<br>
输出: 3<br>
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。<br>

**请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。**


## 解题思路

“滑动窗口”（Sliding Window）。// TODO

## 编码实现

```js
var lengthOfLongestSubstring = function (s) {
  if (s.length === 1) return 1;
  let i = 0, j = 0, set = new Set(), maxLength = 0
  for (; i < s.length; i++) {
    if (!set.has(s[i])) {
      set.add(s[i])
    } else {
      while (set.has(s[i])) {
        set.delete(s[j++])
      }
      set.add(s[i])
    }
    maxLength = Math.max(set.size, maxLength)
  }
  return maxLength
};
```