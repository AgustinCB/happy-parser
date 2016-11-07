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
 * Every class extending this one should have a process method
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

  /**
   * Maps parsed values
   * @param {Function}  mapValues - function that mapes the values
   * @return {Parser}   this parser
   */


  (0, _createClass3.default)(Parser, [{
    key: 'map',
    value: function map(mapValues) {
      this.mapValues = mapValues;
      return this;
    }

    /**
     * Parses an input
     * @param {Iterable}  input - iterable (string, array) with the values to be parsed
     * @return {Result}   result of the parse
     */

  }, {
    key: 'parse',
    value: function parse(input) {
      this.result = new _result2.default(input);
      this.result = this.process(input);

      if (this.mapValues) this.result.values = this.result.values.map(this.mapValues);

      return this.result;
    }

    /**
     * Returns a parser for this or empty.
     * @param {Mixed}   empty - value to be pased in the empty result
     * @return {Parser} new generated parser
     */

  }, {
    key: 'orNone',
    value: function orNone() {
      var empty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.or(empty);
    }

    /**
     * Returns a negated version of this parser
     * @return {Parser} new generated parser
     */

  }, {
    key: 'not',
    value: function not() {
      return new NegatedParser(this);
    }

    /**
     * Returns a parser that then does another parsing
     * @param {Function}  cb - callback that returns a new parser
     * @param {Boolean}   alwaysCheckSecond - whether to check or not for the second step on empty.
     * @return {Parser} new generated parser
     */

  }, {
    key: 'then',
    value: function then(next, alwaysCheckSecond) {
      if (next === undefined) return Parser.zero();
      var cb = !(typeof next === "function") ? function () {
        return next;
      } : next;
      return new BindedParser(this, cb, alwaysCheckSecond);
    }

    /**
     * Returns a parser of this parser or another
     * @param {Array<Parser>}   arguments - list of parsers to or
     * @return {Parser}         new generated parser
     */

  }, {
    key: 'or',
    value: function or() {
      return [].concat(Array.prototype.slice.call(arguments)).reduce(function (parser, or) {
        if (!(or instanceof Parser)) or = Parser.result(or);
        return new AddedParser(parser, or);
      }, this);
    }

    /**
     * Creates a parser that success if this one passes a condition
     * @param {Function}  condition - function that takes an input and returns a boolean
     * @return  {Parser}  parser that success in a condition
     */

  }, {
    key: 'satisfy',
    value: function satisfy(condition) {
      return this.then(function (input) {
        return condition(input) ? input : Parser.zero();
      });
    }

    /**
     * Alias of satisfy
     * @param {Function}  condition - function that takes an input and returns a boolean
     * @return  {Parser}  parser that success in a condition
     */

  }, {
    key: 'filter',
    value: function filter(condition) {
      return this.satisfy(condition);
    }

    /**
     * Returns a parser to check that input has at least one element
     * @return  {Parser}
     * 
     */

  }, {
    key: 'many',
    value: function many() {
      var _this = this;

      return this.then(function (c) {
        return _this.manyOrNone().then(function (c1) {
          return Parser.result(util.toArray(c).concat(util.toArray(c1)));
        });
      });
    }

    /**
     * Returns a parser to check that input has 0+ elements of this parser
     * @param {Mixed}   empty - value to be pased in the empty result
     * @return {Parser}
     */

  }, {
    key: 'manyOrNone',
    value: function manyOrNone() {
      var empty = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.many().or(empty);
    }

    /**
     * Returns a parser to check that the item is a given value
     * @param {Mixed}   value - value to check
     * @return {Parser}
     */

  }, {
    key: 'equals',
    value: function equals(value) {
      return this.satisfy(function (input) {
        return value === input;
      });
    }

    /**
     * Returns a parser to checks that the first items are equals to a given value
     * @param {Mixed}   value - value to check
     * @param {Boolean} partial - checks for partial success
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

      return this.equals(value[0]).then(function (head) {
        return _this2.startsWith(value.slice(1)).then(function (tail) {
          return handleResult(head + tail);
        }, true);
      });
    }

    /**
     * Returns a parser that checks for various results of this separated by another parser
     * @param {Parser}  parser - returns the separator
     * @param {Mixed}   empty - value to be pased in the empty result
     * @return {Parser}
     */

  }, {
    key: 'sepBy',
    value: function sepBy(parser) {
      var _this3 = this;

      var empty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      return this.then(function (head) {
        var sepParser = parser.then(function (_) {
          return _this3.then(function (next) {
            return next;
          });
        });
        return sepParser.manyOrNone().then(function (tail) {
          return util.toArray(head).concat(tail);
        });
      }).or(empty);
    }

    /**
     * Returns a parser that checks for this parser betweeen other parsers
     * @param {Parser}  left - parser for the left part
     * @param {Parser}  right - parser for the right part (optional)
     * @return {Parser}
     */

  }, {
    key: 'between',
    value: function between(left, right) {
      var _this4 = this;

      if (!right) right = left;

      return left.then(function (_) {
        return _this4.then(function (res) {
          return right.then(function (_) {
            return res;
          });
        });
      });
    }

    /**
     * Returns a parser that checks for this parser to be chained with an operation
     * @param  {Parser}  operation - operation to chain with the parser
     * @param  {Mixed}   def - value to be pased in case of empty result
     * @return {Parser}
     */

  }, {
    key: 'chain',
    value: function chain(operation, def) {
      var _this5 = this;

      var rest = function rest(x) {
        return operation.then(function (f) {
          return _this5.then(function (y) {
            return rest(f(x, y));
          });
        }).or(x);
      };

      var parser = this.then(rest);

      if (def !== undefined) return parser.or(def);
      return parser;
    }

    /**
     * Returns a parser that checks for this parser to be chained to the right with an operation
     * @param  {Parser}   operation - operation to chain with the parser
     * @param  {Mixed}   def - value to be pased in case of empty result
     * @return {Parser}
     */

  }, {
    key: 'chainRight',
    value: function chainRight(operation, def) {
      var _this6 = this;

      var rest = function rest(x) {
        return operation.then(function (f) {
          return _this6.chainRight(operation).then(function (y) {
            return f(x, y);
          });
        }).or(x);
      };

      var parser = this.then(rest);

      if (def) return parser.or(def);
      return parser;
    }

    /**
     * Returns a parser that checks that strims the results
     * @param  {Parser} junk - parser with the junk to trim
     * @return {Parser}
     */

  }, {
    key: 'trim',
    value: function trim() {
      var junk = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Parser.junk;

      return this.between(junk);
    }
  }]);
  return Parser;
}();

// Operations

/**
 * Result
 * Return always a basic value
 * @param {Mixed}   value - value of the result
 * @return {Parser}
 */


exports.default = Parser;
Parser.result = function (value) {
  return new ResultParser(value);
};

/**
 * Zero
 * Returns the zero parser
 * @return {Parser}
 */
Parser.zero = function () {
  return new ZeroParser();
};

/** 
 * Item
 * Returns the item parser
 * @return {Parser}
 */
Parser.item = function () {
  return new ItemParser();
};

/**
 * lazy
 * Returns a parser that will be defined on execution time
 * @param   {Function}  fn - returns a lazy parser
 * @return  {Parser}
 */
Parser.lazy = function (fn) {
  return Parser.zero().then(fn, true);
};

/**
 * Operators
 * Creates a parser for a list of operators
 * @param   {Array<Parser>} arguments - list of parsers
 * @return  {Parser}
 */
Parser.operations = function () {
  return [].concat(Array.prototype.slice.call(arguments)).reduce(function (parser, next) {
    return parser.or(next[0].then(function () {
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
 * thened parser
 * Returns the result of thening two parsers
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
          var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
              value = _step$value[0],
              string = _step$value[1];

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
      var res1 = this.parser1.parse(input);

      if (res1.length) return res1;
      return res1.concat(this.parser2.parse(input));
    }
  }]);
  return AddedParser;
}(Parser);

var NegatedParser = function (_Parser6) {
  (0, _inherits3.default)(NegatedParser, _Parser6);

  function NegatedParser(parser) {
    (0, _classCallCheck3.default)(this, NegatedParser);

    var _this13 = (0, _possibleConstructorReturn3.default)(this, (NegatedParser.__proto__ || (0, _getPrototypeOf2.default)(NegatedParser)).call(this));

    _this13.parser = parser;
    return _this13;
  }

  (0, _createClass3.default)(NegatedParser, [{
    key: 'process',
    value: function process(input) {
      var res = this.parser.process(input);
      if (res.length) return this.result;
      return this.result.push(input, input);
    }
  }]);
  return NegatedParser;
}(Parser);