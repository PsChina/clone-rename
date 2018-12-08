# clone-rename

[English]()

深拷贝你的对象并且重命名属性。

## 开始

```bash
> npm install clone-rename
```

## 何时试用

前后端分离的情况下，后端返回数据的属性名称和前端独立开发时使用的属性名称不一样。

### 例子

后端返回数据的属性名称是 `id` 和 `name` 但是 mock 数据时前端使用的是 `goodsID` 和 `goodsName`。

#### 拷贝数组

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
]

const filter = {
    id:'goodsID', // 将所有属性为 id 的 key 更改为 goodsID 。
    name: 'goodsName' // 将所有属性为 name 的 key 更改为 goodsName 。
}

const result = cloneRename(res,filter) // 默认是深拷贝

/*
result:
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

#### 拷贝对象

它还能拷贝对象

```js

import cloneRename from 'clone-rename';

let project = {name:'JavaScript'}

let obj = {
    name:'PsChina',
    age:'25',
    like:[project]
}

const filter = {
    name:'babel' // 将所有属性名为 name 的 key 改名为 babel 。
}

const result1 = cloneRename(obj,filter) // 第三个参数不传递默认是开始深拷贝和深度更改键名。{deepCopy:true, deepRename:true}
/*
result1:
{
    babel:'PsChina',
    age:'25',
    like:[{babel:'JavaScript'}]
}
*/
result1.like[0] === project // false
```

浅层拷贝

```js
const result2 = cloneRename(obj,filter,{deepCopy:false})

/*
result2:
{
    babel:'PsChina',
    age:'25',
    like:[{name:'JavaScript'}]
}
*/

result2.like[0] === project // true
```

浅层重命名

```js
const result3 = cloneRename(obj,filter,{deepRename:false})

/*
result3:
{
    babel:'PsChina',
    age:'25',
    like:[{name:'JavaScript'}]
}
*/
result3.like[0] === project // false


```

## 拷贝

它还能拷贝 date 对象和 function 以及正则表达式

### 拷贝日期对象

```js
let time = new Date();

let sameTime = cloneRename(time);

console.log(time, sameTime ,time===sameTime);
// <currentTime> <currentTime> false
```

### 拷贝函数

```js
function sum(a, b){
    return a + b;
};

let sameSum = cloneRename(sum);

sum(1,2);
//3

sameSum(1,2);
//3

console.log(sum === sameSum);
//false
```

### 拷贝正则表达式

```js
let numberRegObj = {reg:/[0-9]/};

let newRegObj = cloneRename(numberRegObj);

console.log(numberRegObj, newRegObj, numberRegObj.reg === newRegObj.reg);
// {reg:/[0-9]/} {reg:/[0-9]/} false
```