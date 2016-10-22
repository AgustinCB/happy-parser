'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INT = exports.UINT = exports.WORD = exports.NEWORD = exports.ALPHANUMERIC = exports.CHAR = exports.LETTER = exports.UPPER = exports.LOWER = exports.DIGIT = exports.ITEM = exports.ZERO = exports.satisfy = exports.Parser = undefined;

var _result = require('./result');

var _result2 = _interopRequireDefault(_result);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Parser = exports.Parser = _parser2.default;

// Utils

/**
 * Creates a parser that success if the first character passes a condition
 * @param {Function}  condition function that takes an input and returns a boolean
 * @return  {Parser}  parser that success in a condition
 */
var satisfy = exports.satisfy = function satisfy(condition) {
  return ITEM.bind(function (input) {
    return condition(input) ? Parser.result(input) : ZERO;
  });
};

// Parsers 
var ZERO = exports.ZERO = Parser.zero();
var ITEM = exports.ITEM = Parser.item();
var DIGIT = exports.DIGIT = satisfy(function (c) {
  return parseInt(c);
});
var LOWER = exports.LOWER = satisfy(function (c) {
  return util.isLower(c);
});
var UPPER = exports.UPPER = satisfy(function (c) {
  return util.isUpper(c);
});
var LETTER = exports.LETTER = LOWER.plus(UPPER);
var CHAR = exports.CHAR = function CHAR(value) {
  return ITEM.firstIs(value);
};
var ALPHANUMERIC = exports.ALPHANUMERIC = LETTER.plus(DIGIT);

var NEWORD = exports.NEWORD = LETTER.atLeastOne();
var WORD = exports.WORD = LETTER.many();

var UINT = exports.UINT = DIGIT.atLeastOne();
UINT.mapValues = function (v) {
  return parseInt(v);
};
var INT = exports.INT = ITEM.firstIs('-').bind(function (minus) {
  return UINT.bind(function (number) {
    return Parser.result(parseInt(minus + number));
  });
}, true);