"use strict";
/**
 * @Author: shanshan.pan
 * @Date: 2018-04-11 14:30:14
 * @Last Modified by: shanshan.pan
 * @Last Modified time: 2018-12-08 08:50:46
 */
Object.defineProperty(exports, "__esModule", { value: true });
function getChildPath(parentPath, key) {
    return parentPath ? `${parentPath}.${key}` : key;
}
function getPathLeaf(path) {
    const parts = path.split('.');
    const leaf = parts[parts.length - 1];
    return leaf === undefined ? path : leaf;
}
function createRenameContext(key, parentPath, value) {
    const path = getChildPath(parentPath, key);
    return {
        key,
        path,
        parentPath,
        depth: parentPath ? parentPath.split('.').length : 0,
        value
    };
}
function cloneRenameValue(input, filter, options = {}, parentPath = '') {
    if (input === null || input === undefined) {
        return input;
    }
    let { deepCopy, deepRename } = options;
    if (deepCopy === undefined) {
        deepCopy = true;
    }
    if (deepRename === undefined) {
        deepRename = true;
    }
    if (typeof input === 'object' || input instanceof Function) {
        if (input instanceof Array) {
            const newArr = [];
            for (let i = 0, length = input.length; i < length; i++) {
                const item = input[i];
                if (deepCopy) {
                    if (typeof item === 'object') {
                        newArr.push(cloneRenameValue(item, filter, options, getChildPath(parentPath, String(i))));
                    }
                    else {
                        newArr.push(item);
                    }
                }
                else {
                    newArr.push(item);
                }
            }
            return newArr;
        }
        else if (input instanceof Date) {
            return new Date(input.getTime());
        }
        else if (input instanceof Function) {
            const funStr = input.toString();
            const paramArr = funStr
                .substring(funStr.indexOf('(') + 1, funStr.indexOf(')'))
                .split(',');
            const funcBody = funStr.substring(funStr.indexOf('{'), funStr.length + 1);
            paramArr.push(funcBody);
            return new Function(...paramArr);
        }
        else if (input instanceof RegExp) {
            return new RegExp(input);
        }
        else if (input instanceof Object) {
            const newObj = {};
            for (const key in input) {
                if (input.hasOwnProperty(key)) {
                    const value = input[key];
                    const context = createRenameContext(key, parentPath, value);
                    const newKey = cloneRename.filterKey(key, filter, context);
                    if (deepCopy) {
                        if (typeof value === 'object') {
                            let obj;
                            if (deepRename) {
                                obj = cloneRenameValue(value, filter, options, context.path);
                            }
                            else {
                                obj = cloneRenameValue(value, undefined, options, context.path);
                            }
                            newObj[newKey] = obj;
                        }
                        else {
                            newObj[newKey] = value;
                        }
                    }
                    else {
                        newObj[newKey] = value;
                    }
                }
            }
            return newObj;
        }
    }
    else {
        return input;
    }
}
/**
 * @param input Prepare the object to be cloned.
 * @param filter The key to change the name.
 * @param options Whether deep rename or deep copy.
 * @return The cloned value with renamed keys.
 */
const cloneRename = function (input, filter, options = {}) {
    return cloneRenameValue(input, filter, options);
};
/**
 * @param key The name of each property of the cloned object.
 * @param filter The key to change the name.
 * @return New attribute names that are expected to be changed.
 */
cloneRename.filterKey = function filterKey(key, filter, context) {
    if (typeof filter === 'function') {
        return filter(key, context || createRenameContext(key, '', undefined));
    }
    if (filter && typeof filter === 'object') {
        if (context && Object.prototype.hasOwnProperty.call(filter, context.path)) {
            return getPathLeaf(filter[context.path]);
        }
        for (const defaultKey in filter) {
            if (key === defaultKey) {
                key = filter[defaultKey];
            }
        }
    }
    return key;
};
exports.default = cloneRename;
