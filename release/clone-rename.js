'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @author Pan·ShanShan
 *
 * @description Last update 2018-04-11.
*/

/**
 * @param {Object} input Prepare the object to be cloned.
 *
 * @param {Object} filter The key to change the name.
 *
 * @return {Object} The newObj is the cloned object.
 *
 * The newArr is an array of clones.
*/
function cloneRename(input, filter) {
    if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' || input instanceof Function) {
        if (input instanceof Array) {
            var newArr = [];
            for (var i = 0, length = input.length; i < length; i++) {
                var item = input[i];
                if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
                    newArr.push(cloneRename(item, filter));
                } else {
                    newArr.push(item);
                }
            }
            return newArr;
        } else if (input instanceof Date) {
            return new Date(input.getTime());
        } else if (input instanceof Function) {
            var funStr = input.toString();
            var paramArr = funStr.substring(funStr.indexOf('(') + 1, funStr.indexOf(')')).split(',');
            var funcBody = funStr.substring(funStr.indexOf('{'), funStr.length + 1);
            paramArr.push(funcBody);
            return new (Function.prototype.bind.apply(Function, [null].concat(_toConsumableArray(paramArr))))();
        } else if (input instanceof RegExp) {
            return new RegExp(input);
        } else if (input instanceof Object) {
            var newObj = {};
            for (var key in input) {
                if (input.hasOwnProperty(key)) {
                    var value = input[key];
                    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                        var obj = cloneRename(value, filter);
                        newObj[cloneRename.filterKey(key, filter)] = obj;
                    } else {
                        newObj[cloneRename.filterKey(key, filter)] = value;
                    }
                }
            }
            return newObj;
        }
    } else {
        return input;
    }
}
/**
 * @param {String} key The name of each property of the cloned object.
 *
 * @param {Object} filter The key to change the name.
 *
 * @return {String} New attribute names that are expected to be changed.
*/
cloneRename.filterKey = function (key, filter) {
    if ((typeof filter === 'undefined' ? 'undefined' : _typeof(filter)) === 'object') {
        for (var defauktKey in filter) {
            if (key === defauktKey) {
                key = filter[defauktKey];
            }
        }
    }
    return key;
};
