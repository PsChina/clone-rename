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
 * @param {Object} opions Whether deep rename or deep copy
 *
 * @return {Object} The newObj is the cloned object.
 *
 * The newArr is an array of clones.
*/
function cloneRename(input, filter) {
  var opions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var deepCopy = opions.deepCopy,
      deepRename = opions.deepRename;

  if (deepCopy === undefined) {
    deepCopy = true;
  }

  if (deepRename === undefined) {
    deepRename = true;
  }

  if (_typeof(input) === 'object' || input instanceof Function) {
    if (input instanceof Array) {
      var newArr = [];

      for (var i = 0, length = input.length; i < length; i++) {
        var item = input[i];

        if (deepCopy) {
          if (_typeof(item) === 'object') {
            newArr.push(cloneRename(item, filter, opions));
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

          if (deepCopy) {
            if (_typeof(value) === 'object') {
              var obj = void 0;

              if (deepRename) {
                obj = cloneRename(value, filter, opions);
              } else {
                obj = cloneRename(value, {}, opions);
              }

              newObj[cloneRename.filterKey(key, filter)] = obj;
            } else {
              newObj[cloneRename.filterKey(key, filter)] = value;
            }
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
  if (_typeof(filter) === 'object') {
    for (var defauktKey in filter) {
      if (key === defauktKey) {
        key = filter[defauktKey];
      }
    }
  }

  return key;
};

module.exports = cloneRename;