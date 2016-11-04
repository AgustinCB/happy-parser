'use strict';

/**
 * Class representing a parser result
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _iterator = require('babel-runtime/core-js/symbol/iterator');

var _iterator2 = _interopRequireDefault(_iterator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Result = function () {
  /**
   * Creates the result
   */
  function Result() {
    (0, _classCallCheck3.default)(this, Result);

    this.values = [];
    this.unconsumedStrings = [];
  }

  /**
   * Adds a new set (parser, unconsumedString) into the collection
   * @param  {Object} parser resulting parser
   * @param  {String} unconsumedString unconsumed string
   * @return {Result} this result
   */


  (0, _createClass3.default)(Result, [{
    key: 'push',
    value: function push(value, unconsumedString) {
      this.values.push(value);
      this.unconsumedStrings.push(unconsumedString);
      return this;
    }

    /**
     * Concatenates two results
     * @param  {Result} result result to concatenate
     * @return {Result} this result
     */

  }, {
    key: 'concat',
    value: function concat(result) {
      return result.reduce(function (prev, value, string) {
        return prev.push(value, string);
      }, Result.copy(this));
    }

    /**
     * Returns an array representation of the result
     * @return {Array}
     */

  }, {
    key: 'entries',
    value: function entries() {
      return [].concat((0, _toConsumableArray3.default)(this));
    }

    /**
     * Iterates a result using a function
     * @param  {Function} fn function to iterate results
     */

  }, {
    key: 'forEach',
    value: function forEach(fn) {
      this.entries().forEach(function (pair) {
        return fn.apply(undefined, (0, _toConsumableArray3.default)(pair));
      });
    }

    /**
     * Returns an array resulting of operation item by item in the result
     * @param  {Function} fn function to map results
     * @return {Array}
     */

  }, {
    key: 'map',
    value: function map(fn) {
      return this.entries().map(function (pair) {
        return fn.apply(undefined, (0, _toConsumableArray3.default)(pair));
      });
    }

    /**
     * Reduce a result using an initial value and an operation
     * @param  {Function} fn function to reduce results
     * @param  {Mixed}    initialValue initial value of the reduce operation
     * @return {Array}
     */

  }, {
    key: 'reduce',
    value: function reduce(fn, initialValue) {
      return this.entries().reduce(function (prev, pair) {
        return fn.apply(undefined, [prev].concat((0, _toConsumableArray3.default)(pair)));
      }, initialValue);
    }

    /**
     * Filter a result using an operation
     * @param  {Function} fn function to filter results
     * @return {Array}
     */

  }, {
    key: 'filter',
    value: function filter(fn) {
      var _this = this;

      var newEntries = this.entries().filter(function (pair) {
        return fn.bind.apply(fn, [_this].concat((0, _toConsumableArray3.default)(pair)))();
      }),
          res = new Result();

      newEntries.forEach(function (pair) {
        return res.push.apply(res, (0, _toConsumableArray3.default)(pair));
      });

      return res;
    }

    /**
     * Clear a result
     */

  }, {
    key: 'empty',
    value: function empty() {
      this.values = [];
      this.unconsumedStrings = [];
    }
  }, {
    key: 'get',
    value: function get() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      return this.values[index];
    }

    /**
     * returns the collection as an iterable
     * @return  {Array}   list of results
     */

  }, {
    key: _iterator2.default,
    value: _regenerator2.default.mark(function value() {
      var i;
      return _regenerator2.default.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = _regenerator2.default.keys(this.values);

            case 1:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 7;
                break;
              }

              i = _context.t1.value;
              _context.next = 5;
              return [this.values[i], this.unconsumedStrings[i]];

            case 5:
              _context.next = 1;
              break;

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, value, this);
    })

    /**
     * returns the length of the collection
     * @return  {number}   length of the collection
     */

  }, {
    key: 'length',
    get: function get() {
      return this.values.length;
    }
  }]);
  return Result;
}();

/**
 * Adds a new copy of the result
 * @param  {Result} copyFrom source result
 * @return {Result} the copied result
 */


exports.default = Result;
Result.copy = function (copyFrom) {
  var result = new Result();

  result.values = copyFrom.values.slice(0);
  result.unconsumedStrings = copyFrom.unconsumedStrings.slice(0);

  return result;
};