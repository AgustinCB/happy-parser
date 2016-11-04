'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.int = exports.uint = exports.word = exports.neword = exports.spaces = exports.string = exports.alphanumeric = exports.char = exports.space = exports.symbol = exports.letter = exports.upper = exports.lower = exports.digit = exports.item = exports.zero = exports.satisfy = exports.result = exports.lazy = exports.Parser = undefined;

var _parser = require('./parser');

Object.defineProperty(exports, 'Parser', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_parser).default;
  }
});

var _result = require('./result');

var _result2 = _interopRequireDefault(_result);

var _parser2 = _interopRequireDefault(_parser);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//export const ParserClass = Parser

var lazy = exports.lazy = _parser2.default.lazy;

var result = exports.result = _parser2.default.result;

// Utils

/**
 * Creates a parser that success if the first character passes a condition
 * @param {Function}  condition function that takes an input and returns a boolean
 * @return  {Parser}  parser that success in a condition
 */
var satisfy = exports.satisfy = function satisfy(condition) {
  return item.then(function (input) {
    return condition(input) ? result(input) : zero;
  });
};

// Parsers 
var zero = exports.zero = _parser2.default.zero();
var item = exports.item = _parser2.default.item();
var digit = exports.digit = satisfy(function (c) {
  var v = parseInt(c);
  return typeof v === "number" && v >= 0 && v <= 9;
});
var lower = exports.lower = satisfy(function (c) {
  return util.isLower(c);
});
var upper = exports.upper = satisfy(function (c) {
  return util.isUpper(c);
});
var letter = exports.letter = lower.or(upper);
var symbol = exports.symbol = satisfy(function (c) {
  return !(util.isLower(c) || util.isUpper(c) || util.isSpace(c));
});
var space = exports.space = satisfy(function (c) {
  return util.isSpace(c);
});
var char = exports.char = function char(value) {
  return item.equals(value);
};
var alphanumeric = exports.alphanumeric = letter.or(digit);
var string = exports.string = function string(str) {
  return item.manyOrNone().equals(str);
};

var spaces = exports.spaces = space.manyOrNone('');
var neword = exports.neword = letter.many();
var word = exports.word = letter.manyOrNone();

_parser2.default.junk = spaces;

var uint = exports.uint = digit.many();
uint.mapValues = function (v) {
  return parseInt(v);
};
var int = exports.int = item.equals('-').then(function (minus) {
  return uint.then(function (number) {
    return result(parseInt(minus + number));
  });
}, true);