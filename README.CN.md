# clone-rename

[![npm version](https://img.shields.io/npm/v/clone-rename.svg)](https://www.npmjs.com/package/clone-rename)
[![npm downloads](https://img.shields.io/npm/dm/clone-rename.svg)](https://www.npmjs.com/package/clone-rename)

[English](https://github.com/PsChina/clone-rename)

深拷贝你的数据，并重命名对象 key。适合处理后端接口、第三方接口、mock 数据和前端模型字段名不一致的场景。

## 安装

```bash
npm install clone-rename
```

## 使用

```js
import cloneRename from 'clone-rename';

const result = cloneRename(data, filter, options);
```

旧 API 仍然是主 API：

```js
cloneRename(input, filter, {
  deepCopy: true,
  deepRename: true
});
```

## 重命名规则

### 普通 key 映射

默认会递归重命名所有层级里匹配到的 key。

```js
import cloneRename from 'clone-rename';

const res = [
  {
    id: '001',
    name: 'apple'
  },
  {
    id: '002',
    name: 'banana'
  }
];

const result = cloneRename(res, {
  id: 'goodsID',
  name: 'goodsName'
});

/*
[
  {
    goodsID: '001',
    goodsName: 'apple'
  },
  {
    goodsID: '002',
    goodsName: 'banana'
  }
]
*/
```

### 路径 key 映射

如果只想改某个具体的嵌套字段，可以在**左边**用点路径定位。**右边**只是新的 key 名。

```js
import cloneRename from 'clone-rename';

const data = {
  id: 'root-001',
  user: {
    id: 'user-001',
    profile: {
      name: 'Ada Lovelace'
    }
  },
  order: {
    id: 'order-001'
  }
};

const result = cloneRename(data, {
  'user.id': 'userId',
  'user.profile.name': 'displayName'
});

/*
{
  id: 'root-001',
  user: {
    userId: 'user-001',
    profile: {
      displayName: 'Ada Lovelace'
    }
  },
  order: {
    id: 'order-001'
  }
}
*/
```

> **右侧规则：** 只取最后一个 `.` 之后的片段作为新 key 名。重命名在原位发生 —— `cloneRename` 不会跨节点移动字段。例如 `{ 'user.id': 'account.userId' }` 和 `{ 'user.id': 'userId' }` 等价，两者都会得到 `user.userId`，都不会创建 `account` 容器。

### 函数 key 映射

当新 key 需要根据当前 key 或上下文动态决定时，可以传函数。

```js
import cloneRename from 'clone-rename';

function camelCase(key) {
  return key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

const result = cloneRename(data, (key, context) => {
  if (context.path === 'user.id') return 'userId';
  if (key.includes('_')) return camelCase(key);
  return key;
});
```

`context` 包含：

```ts
{
  key: string;
  path: string;
  parentPath: string;
  depth: number;
  value: any;
}
```

## 选项

### 默认行为

`deepCopy` 和 `deepRename` 默认都是 `true`。

```js
const project = { name: 'JavaScript' };

const obj = {
  name: 'PsChina',
  age: '25',
  like: [project]
};

const result = cloneRename(obj, {
  name: 'babel'
});

/*
{
  babel: 'PsChina',
  age: '25',
  like: [{ babel: 'JavaScript' }]
}
*/

result.like[0] === project; // false
```

### 浅拷贝

```js
const result = cloneRename(obj, filter, {
  deepCopy: false
});
```

嵌套值会保留原来的引用。

### 浅层重命名

```js
const result = cloneRename(obj, filter, {
  deepRename: false
});
```

嵌套值仍然会被拷贝，但嵌套 key 不会被重命名。

## 拷贝支持

`cloneRename` 可以拷贝 `Date`、`RegExp` 和作为根输入的 `Function`。

```js
const time = new Date();
const sameTime = cloneRename(time);

console.log(time === sameTime); // false
```

```js
function sum(a, b) {
  return a + b;
}

const sameSum = cloneRename(sum);

sameSum(1, 2); // 3
console.log(sum === sameSum); // false
```

```js
const numberRegObj = { reg: /[0-9]/ };
const newRegObj = cloneRename(numberRegObj);

console.log(numberRegObj.reg === newRegObj.reg); // false
```

## TypeScript

包内置类型声明。

```ts
import cloneRename, {
  type RenameContext,
  type RenameFilter,
  type CloneRenameOptions
} from 'clone-rename';

const filter: RenameFilter = {
  'user.id': 'userId'
};

const options: CloneRenameOptions = {
  deepCopy: true,
  deepRename: true
};

const result = cloneRename({ user: { id: 1 } }, filter, options);

cloneRename(
  { user: { id: 1 } },
  (key: string, context: RenameContext) => {
    if (context.path === 'user.id') return 'userId';
    return key;
  }
);
```
