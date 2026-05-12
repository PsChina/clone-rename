# clone-rename

[![npm version](https://img.shields.io/npm/v/clone-rename.svg)](https://www.npmjs.com/package/clone-rename)
[![npm downloads](https://img.shields.io/npm/dm/clone-rename.svg)](https://www.npmjs.com/package/clone-rename)

[中文文档](https://github.com/PsChina/clone-rename/blob/master/README.CN.md)

Deep clone your data and rename object keys. It is useful when backend, third-party, or mock data uses different field names from your frontend model.

## Install

```bash
npm install clone-rename
```

## Usage

```js
import cloneRename from 'clone-rename';

const result = cloneRename(data, filter, options);
```

The legacy API is still the main API:

```js
cloneRename(input, filter, {
  deepCopy: true,
  deepRename: true
});
```

## Rename Rules

### Basic key map

Renames every matching key at every nested level by default.

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

### Path-based key map

Use dot paths on the **left** when you only want to rename a specific nested field. The **right** side is just the new key name.

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

> **Right-side rule:** only the last segment after the final `.` is used as the new key name. Renaming happens in place — `cloneRename` does not move fields across the tree. For example, `{ 'user.id': 'account.userId' }` and `{ 'user.id': 'userId' }` are equivalent; both produce `user.userId` and neither creates an `account` container.

### Function key map

Pass a function when the new key depends on the current key or its context.

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

The context object contains:

```ts
{
  key: string;
  path: string;
  parentPath: string;
  depth: number;
  value: any;
}
```

## Options

### Default behavior

`deepCopy` and `deepRename` are both `true` by default.

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

### Shallow copy

```js
const result = cloneRename(obj, filter, {
  deepCopy: false
});
```

Nested values keep their original references.

### Shallow rename

```js
const result = cloneRename(obj, filter, {
  deepRename: false
});
```

Nested values are still copied, but nested keys are not renamed.

## Copy Support

`cloneRename` can clone `Date`, `RegExp`, and root `Function` values.

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

Type declarations are included.

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
