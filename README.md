# clone-rename

[中文文档](https://github.com/PsChina/clone-rename/blob/master/README.CN.md)

Deep clone your object and rename the key.

## Get start

```bash
> npm install clone-rename
```

## Usage

Used when the data returned by the back end is inconsistent with the property name used by the front end.

### Example

The current backend separation assumes that the item information is displayed when you use the goodsID and goodsName properties and the backend provides the id and name

just use clone-rename to change the attribute name

#### Array

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
    id:'goodsID', // Rename all attribute id to goodsID.
    name: 'goodsName' // Rename all attribute name to goodsName.
}

const result = cloneRename(res,filter) // deep copy

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

#### Object

It also can change the object。

```js

import cloneRename from 'clone-rename';

let project = {name:'JavaScript'}

let obj = {
    name:'PsChina',
    age:'25',
    like:[project]
}

const filter = {
    name:'babel' // Rename all key name to Babel.
}

const result1 = cloneRename(obj,filter) // default deepCopy & deepRename both true
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

Shallow copy

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

Shallow rename

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

## Copy

It also helps you copy objects that contain Date RegExp and Function objects.

### Date

```js
let time = new Date();

let sameTime = cloneRename(time);

console.log(time, sameTime ,time===sameTime);
// <currentTime> <currentTime> false
```

### Function

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

### RgeExp

```js
let numberRegObj = {reg:/[0-9]/};

let newRegObj = cloneRename(numberRegObj);

console.log(numberRegObj, newRegObj, numberRegObj.reg === newRegObj.reg);
// {reg:/[0-9]/} {reg:/[0-9]/} false
```