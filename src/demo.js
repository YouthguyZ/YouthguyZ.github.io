//评测题目:
// 实现 convert2Tree 方法将下面数组根据 id 和 parentId 转成树状 （可以假定只有一个 root）

const data = [
  { id: 1, parentId: null, label: '1' },
  { id: 7, parentId: 4, label: '7' },
  { id: 2, parentId: 1, label: '2' },
  { id: 3, parentId: 1, label: '3' },
  { id: 4, parentId: 2, label: '4' },
  { id: 5, parentId: 3, label: '5' },
  { id: 6, parentId: 4, label: '6' },
];

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

convert2Tree(data);

// {
//   id: "",
//   label: "",
//   children: [{
//     //...
//   }]
// }

function convert2Tree(arr = [], parentId = null) {
  let result = [], temp = []
  arr.forEach((item, index) => {
    if (item.parentId === parentId) {
      // 简单的拷贝，不改变原始数据
      let obj = { ...item }
      temp = convert2Tree(arr, item.id)
      if (temp.length > 0) {
        obj.children = temp
      }
      result.push(obj)
    }
  })
  return result
}

function convert2Tree(arr = []) {
  // 转成 map, 方便查找 
  let mapObj = arr.reduce((pre, cur) => {
    pre[cur.id] = cur
    cur.children = []
    return pre;
  }, {})
  console.info(mapObj)
  return arr.filter(item => {
    const pId = item.parentId
    mapObj[pId] && mapObj[pId].children.push(item)
    // root
    return pId === null
  })
}

console.info(listToTree(data))