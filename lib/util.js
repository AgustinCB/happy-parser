'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isUpper = exports.isUpper = function isUpper(str) {
  var code = str.charCodeAt(0);
  return code >= 97 && code <= 122;
};

var isLower = exports.isLower = function isLower(str) {
  var code = str.charCodeAt(0);
  return code >= 65 && code <= 90;
};

var toArray = exports.toArray = function toArray(item) {
  if (item && !item.length) return [item];
  if (!item) return [];
  return item;
};