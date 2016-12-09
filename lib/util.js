'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var whitespaces = ' \n\t\v\f\r';

var isLower = exports.isLower = function isLower(str) {
  var code = str.charCodeAt(0);
  return code >= 97 && code <= 122;
};

var isUpper = exports.isUpper = function isUpper(str) {
  var code = str.charCodeAt(0);
  return code >= 65 && code <= 90;
};

var isSpace = exports.isSpace = function isSpace(str) {
  return whitespaces.includes(str);
};

var accumulator = exports.accumulator = function accumulator(type, AccType) {
  if (AccType) return new AccType();
  return type === 'string' ? '' : [];
};
var toArray = exports.toArray = function toArray(item) {
  if ((item || item === 0 || item === false) && !item.length) {
    return [item];
  }
  if (!item) {
    return [];
  }
  return item;
};