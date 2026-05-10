"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function getChildPath(parentPath, key) {
  return parentPath ? parentPath + "." + key : key;
}

function getPathLeaf(path) {
  var parts = path.split(".");
  var leaf = parts[parts.length - 1];
  return leaf === undefined ? path : leaf;
}

function createRenameContext(key, parentPath, value) {
  var path = getChildPath(parentPath, key);
  return {
    key: key,
    path: path,
    parentPath: parentPath,
    depth: parentPath ? parentPath.split(".").length : 0,
    value: value
  };
}

/**
 * @Author: shanshan.pan 
 * @Date: 2018-04-11 14:30:14 
 * @Last Modified by: shanshan.pan
 * @Last Modified time: 2018-12-08 09:01:33
 */

/**
 * @param {Object} input Prepare the object to be cloned.
 *
 * @param {Object} filter The key to change the name.
 *
 * @param {Object} options Whether deep rename or deep copy
 *
 * @return {Object} The newObj is the cloned object.
 *
 * The newArr is an array of clones.
*/
function cloneRename(input, filter) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var parentPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
  var deepCopy = options.deepCopy,
      deepRename = options.deepRename;

  if (deepCopy === undefined) {
    deepCopy = true;
  }

  if (deepRename === undefined) {
    deepRename = true;
  }

  if (input === null || input === undefined) {
    return input;
  }

  if (_typeof(input) === 'object' || input instanceof Function) {
    if (input instanceof Array) {
      var newArr = [];

      for (var i = 0, length = input.length; i < length; i++) {
        var item = input[i];

        if (deepCopy) {
          if (_typeof(item) === 'object') {
            newArr.push(cloneRename(item, filter, options, getChildPath(parentPath, String(i))));
          } else {
            newArr.push(item);
          }
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
      return _construct(Function, _toConsumableArray(paramArr));
    } else if (input instanceof RegExp) {
      return new RegExp(input);
    } else if (input instanceof Object) {
      var newObj = {};

      for (var key in input) {
        if (input.hasOwnProperty(key)) {
          var value = input[key];
          var context = createRenameContext(key, parentPath, value);
          var newKey = cloneRename.filterKey(key, filter, context);

          if (deepCopy) {
            if (_typeof(value) === 'object') {
              var obj = void 0;

              if (deepRename) {
                obj = cloneRename(value, filter, options, context.path);
              } else {
                obj = cloneRename(value, undefined, options, context.path);
              }

              newObj[newKey] = obj;
            } else {
              newObj[newKey] = value;
            }
          } else {
            newObj[newKey] = value;
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


cloneRename.filterKey = function (key, filter, context) {
  if (typeof filter === "function") {
    return filter(key, context || createRenameContext(key, "", undefined));
  }

  if (filter && _typeof(filter) === 'object') {
    if (context && Object.prototype.hasOwnProperty.call(filter, context.path)) {
      return getPathLeaf(filter[context.path]);
    }

    for (var defaultKey in filter) {
      if (key === defaultKey) {
        key = filter[defaultKey];
      }
    }
  }

  return key;
};

module.exports = cloneRename;
