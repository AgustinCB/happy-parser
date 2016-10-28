'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _result = require('./result');

var _result2 = _interopRequireDefault(_result);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class representing a parsers
 */
var Parser = function () {
  /**
   * Creates a parser
   */
  function Parser() {
    (0, _classCallCheck3.default)(this, Parser);

    if (this.process === undefined) {
      throw new TypeError('Must override process');
    }
    this.result = new _result2.default();

    this.mapValues = false;
  }

  (0, _createClass3.default)(Parser, [{
    key: 'parse',
    value: function parse(input) {
      this.result = new _result2.default();
      this.result = this.process(input);

      if (this.mapValues) this.result.values = this.result.values.map(this.mapValues);

      return this.result;
    }

    /**
     * Binds two parsers together
     * @param {Parser}    parser first parser to bind
     * @return {Function} function that takes a function and returns a parser
     */

  }, {
    key: 'bind',
    value: function bind(cb, alwaysCheckSecond) {
      return new BindedParser(this, cb, alwaysCheckSecond);
    }

    /**
     * Sums this parser to another
     * @param {Parser}  parser parser to sum
     * @return {Parser} parser that concatenates the result of the two params
     */

  }, {
    key: 'plus',
    value: function plus(parser) {
      if (!(parser instanceof Parser)) parser = Parser.result(parser);
      return new AddedParser(this, parser);
    }

    /**
     * Creates a parser that success if the result of this parser passes a condition
     * @param {Function}  condition function that takes an input and returns a boolean
     * @return  {Parser}  parser that success in a condition
     */

  }, {
    key: 'satisfy',
    value: function satisfy(condition) {
      return this.bind(function (input) {
        return condition(input) ? input : Parser.zero();
      });
    }

    /**
     * Returns a parser to check that input has at least one element
     * @return  {Parser}
     * 
     */

  }, {
    key: 'atLeastOne',
    value: function atLeastOne() {
      var _this = this;

      return this.bind(function (c) {
        return _this.many().bind(function (c1) {
          return Parser.result(util.toArray(c).concat(util.toArray(c1)));
        });
      });
    }

    /**
     * Returns a parser to check that input has 0+ elements of this parser
     * @return {Parser}
     */

  }, {
    key: 'many',
    value: function many() {
      var empty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.atLeastOne().plus(empty);
    }

    /**
     * Returns a parser to check that the first item is a given value
     * @return {Parser}
     */

  }, {
    key: 'firstIs',
    value: function firstIs(value) {
      return this.satisfy(function (input) {
        return value === input;
      });
    }

    /**
     * Returns a parser to checks that the first items are equals to a given value
     * @return {Parser}
     */

  }, {
    key: 'startsWith',
    value: function startsWith(value) {
      var _this2 = this;

      var partial = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var handleResult = function handleResult(partialValue) {
        if (partial) return partialValue;

        if (partialValue === value) return value;

        return Parser.zero();
      };

      if (!value.length) return Parser.zero();

      return this.firstIs(value[0]).bind(function (head) {
        return _this2.startsWith(value.slice(1)).bind(function (tail) {
          return handleResult(head + tail);
        }, true);
      });
    }

    /**
     * Returns a parser that checks for various results of this separated by another parser
     * @return {Parser}
     */

  }, {
    key: 'sepBy',
    value: function sepBy(parser) {
      var _this3 = this;

      var empty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      return this.bind(function (head) {
        var sepParser = parser.bind(function (_) {
          return _this3.bind(function (next) {
            return next;
          });
        });
        return sepParser.many().bind(function (tail) {
          return util.toArray(head).concat(tail);
        });
      }).plus(empty);
    }

    /**
     * Returns a parser that checks for this parser betweeen other parsers
     * @return {Parser}
     */

  }, {
    key: 'between',
    value: function between(left, right) {
      var _this4 = this;

      if (!right) right = left;

      return left.bind(function (_) {
        return _this4.bind(function (res) {
          return right.bind(function (_) {
            return res;
          });
        });
      });
    }

    /**
     * Returns a parser that checks for this parser to be chained with an operation
     * @param  {Parser}   operation - operation to chain with the parser
     * @return {Parser}
     */

  }, {
    key: 'chain',
    value: function chain(operation, def) {
      var _this5 = this;

      var rest = function rest(x) {
        return operation.bind(function (f) {
          return _this5.bind(function (y) {
            return rest(f(x, y));
          });
        }).plus(x);
      };

      var parser = this.bind(rest);

      if (def !== undefined) return parser.plus(def);
      return parser;
    }

    /**
     * Returns a parser that checks for this parser to be chained to the right with an operation
     * @param  {Parser}   operation - operation to chain with the parser
     * @return {Parser}
     */

  }, {
    key: 'chainRight',
    value: function chainRight(operation, def) {
      var _this6 = this;

      var rest = function rest(x) {
        return operation.bind(function (f) {
          return _this6.chainRight(operation).bind(function (y) {
            return f(x, y);
          });
        }).plus(x);
      };

      var parser = this.bind(rest);

      if (def) return parser.plus(def);
      return parser;
    }
  }]);
  return Parser;
}();

// Operations

/**
 * Result
 * Return always a basic value
 */


exports.default = Parser;
Parser.result = function (value) {
  return new ResultParser(value);
};

/**
 * Zero
 * Returns the zero parser
 */
Parser.zero = function () {
  return new ZeroParser();
};

/** 
 * Item
 * Returns the item parser
 */
Parser.item = function () {
  return new ItemParser();
};

/**
 * lazy
 * Returns a parser that will be defined on execution time
 */
Parser.lazy = function (fn) {
  return Parser.zero().bind(fn, true);
};

/**
 * Operators
 * Creates a parser for a list of operators
 */
Parser.operations = function () {
  return [].concat(Array.prototype.slice.call(arguments)).reduce(function (parser, next) {
    return parser.plus(next[0].bind(function () {
      return next[1];
    }));
  }, Parser.zero());
};

// Basic parsers

/**
 * Item parser
 * Returns first character of the input and zero if a zero length input
 */

var ItemParser = function (_Parser) {
  (0, _inherits3.default)(ItemParser, _Parser);

  function ItemParser() {
    (0, _classCallCheck3.default)(this, ItemParser);
    return (0, _possibleConstructorReturn3.default)(this, (ItemParser.__proto__ || (0, _getPrototypeOf2.default)(ItemParser)).apply(this, arguments));
  }

  (0, _createClass3.default)(ItemParser, [{
    key: 'process',
    value: function process(input) {
      if (input && input.length) {
        return this.result.push(input[0], input.slice(1));
      }
      return this.result;
    }
  }]);
  return ItemParser;
}(Parser);

/**
 * Zero parser
 * Returns always an empty result
 */


var ZeroParser = function (_Parser2) {
  (0, _inherits3.default)(ZeroParser, _Parser2);

  function ZeroParser() {
    (0, _classCallCheck3.default)(this, ZeroParser);
    return (0, _possibleConstructorReturn3.default)(this, (ZeroParser.__proto__ || (0, _getPrototypeOf2.default)(ZeroParser)).apply(this, arguments));
  }

  (0, _createClass3.default)(ZeroParser, [{
    key: 'process',
    value: function process(_) {
      return this.result;
    }
  }]);
  return ZeroParser;
}(Parser);

/**
 * Result parser
 * Returns always the same value
 */


var ResultParser = function (_Parser3) {
  (0, _inherits3.default)(ResultParser, _Parser3);

  function ResultParser(value) {
    (0, _classCallCheck3.default)(this, ResultParser);

    var _this9 = (0, _possibleConstructorReturn3.default)(this, (ResultParser.__proto__ || (0, _getPrototypeOf2.default)(ResultParser)).call(this));

    _this9.value = value;
    return _this9;
  }

  (0, _createClass3.default)(ResultParser, [{
    key: 'process',
    value: function process(input) {
      return this.result.push(this.value === undefined ? input : this.value, input);
    }
  }]);
  return ResultParser;
}(Parser);

/**
 * Binded parser
 * Returns the result of binding two parsers
 */


var BindedParser = function (_Parser4) {
  (0, _inherits3.default)(BindedParser, _Parser4);

  function BindedParser(parser, cb) {
    var alwaysCheckSecond = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    (0, _classCallCheck3.default)(this, BindedParser);

    var _this10 = (0, _possibleConstructorReturn3.default)(this, (BindedParser.__proto__ || (0, _getPrototypeOf2.default)(BindedParser)).call(this));

    _this10.parser = parser;
    _this10.cb = cb;
    _this10.alwaysCheckSecond = alwaysCheckSecond;
    return _this10;
  }

  (0, _createClass3.default)(BindedParser, [{
    key: 'process',
    value: function process(input) {
      var firstResult = this.parser.parse(input),
          nextParserFn = this.parserifyCb();

      if (this.alwaysCheckSecond && !firstResult.length) return nextParserFn('').parse(input);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(firstResult), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = (0, _slicedToArray3.default)(_step.value, 2);

          var value = _step$value[0];
          var string = _step$value[1];

          this.result = this.result.concat(nextParserFn(value).parse(string));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this.result;
    }
  }, {
    key: 'parserifyCb',
    value: function parserifyCb() {
      var _this11 = this;

      return function (value) {
        var nextParser = _this11.cb.bind(_this11)(value);
        if (!(nextParser instanceof Parser)) nextParser = Parser.result(nextParser);

        return nextParser;
      };
    }
  }]);
  return BindedParser;
}(Parser);

/**
 * Added parser
 * Returns the result of adding two parsers
 */


var AddedParser = function (_Parser5) {
  (0, _inherits3.default)(AddedParser, _Parser5);

  function AddedParser(parser1, parser2) {
    (0, _classCallCheck3.default)(this, AddedParser);

    var _this12 = (0, _possibleConstructorReturn3.default)(this, (AddedParser.__proto__ || (0, _getPrototypeOf2.default)(AddedParser)).call(this));

    _this12.parser1 = parser1;
    _this12.parser2 = parser2;
    return _this12;
  }

  (0, _createClass3.default)(AddedParser, [{
    key: 'process',
    value: function process(input) {
      return this.parser1.parse(input).concat(this.parser2.parse(input));
    }
  }]);
  return AddedParser;
}(Parser);