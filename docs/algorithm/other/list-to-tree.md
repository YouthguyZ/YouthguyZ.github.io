# 列表转成树

## 题目
::: tip 要求
实现 `convert2Tree` 方法将下面数组根据 `id` 和 `parentId` 转成树状 （可以假定只有一个 root）
:::

```js
const data = [
  { id: 1, parentId: null, label: '1' },
  { id: 7, parentId: 4, label: '7' },
  { id: 2, parentId: 1, label: '2' },
  { id: 3, parentId: 1, label: '3' },
  { id: 4, parentId: 2, label: '4' },
  { id: 5, parentId: 3, label: '5' },
  { id: 6, parentId: 4, label: '6' },
];
convert2Tree(data);

// {
//   id: "",
//   label: "",
//   children: [{
//     //...
//   }]
// }

/***
 *        1 
 *       / \
 *      2   3
 *     /   /
 *    4   5
 *   / \
 *  6   7
 * 
 */
```
