'use strict'

import Result from './result'
import * as util from './util'

/**
 * Class representing a parsers
 */
export default class Parser {
  /**
   * Creates a parser
   */
  constructor () {
    if (this.process === undefined) {
      throw new TypeError('Must override process')
    }
    this.result = new Result()

    this.mapValues = false
  }

  map (mapValues) {
    this.mapValues = mapValues
    return this
  }

  parse (input) {
    this.result = new Result()
    this.result = this.process(input)

    if (this.mapValues) this.result.values = this.result.values.map(this.mapValues)

    return this.result
  }

  orNone (empty = '') {
    return this.or(empty)
  }

  not () {
    return new NegatedParser(this)
  }

  /**
   * Binds two parsers together
   * @param {Parser}    parser first parser to then
   * @return {Function} function that takes a function and returns a parser
   */
  then (cb, alwaysCheckSecond) { 
    if (cb === undefined) return Parser.zero()
    if (!(typeof cb === "function")) cb = () => cb
    return new BindedParser(this, cb, alwaysCheckSecond)
  }

  /**
   * Sums this parser to another
   * @param {Parser}  parser parser to sum
   * @return {Parser} parser that concatenates the result of the two params
   */
  or () {
    return [...arguments].reduce((parser, or) => {
      if (!(or instanceof Parser)) or = Parser.result(or)
      return new AddedParser(parser, or)
    }, this)
  }

  /**
   * Creates a parser that success if the result of this parser passes a condition
   * @param {Function}  condition function that takes an input and returns a boolean
   * @return  {Parser}  parser that success in a condition
   */
  satisfy (condition) {
    return this.then((input) => condition(input) ? input : Parser.zero())
  }

  filter (condition) {
    return this.satisfy(condition)
  }

  /**
   * Returns a parser to check that input has at least one element
   * @return  {Parser}
   * 
   */
  many () {
    return this.then((c) => 
            this.manyOrNone().then((c1) => 
               Parser.result(util.toArray(c).concat(util.toArray(c1)))))
  }

  /**
   * Returns a parser to check that input has 0+ elements of this parser
   * @return {Parser}
   */
  manyOrNone (empty = '') {
    return this.many().or(empty)
  }

  /**
   * Returns a parser to check that the first item is a given value
   * @return {Parser}
   */
  equals (value) {
    return this.satisfy((input) => value === input)
  }

  /**
   * Returns a parser to checks that the first items are equals to a given value
   * @return {Parser}
   */
  startsWith (value, partial = false) {
    const handleResult = (partialValue) => {
      if (partial) return partialValue

      if (partialValue === value) return value

      return Parser.zero()
    }

    if (!value.length) return Parser.zero()

    return this.equals(value[0]).then((head) =>
            this.startsWith(value.slice(1)).then((tail) =>
              handleResult(head+tail), true))
  }

  /**
   * Returns a parser that checks for various results of this separated by another parser
   * @return {Parser}
   */
  sepBy (parser, empty = '') {
    return this.then((head) => {
      const sepParser = parser.then((_) =>
        this.then((next) => next)
      )
      return sepParser.manyOrNone().then((tail) =>
        util.toArray(head).concat(tail)
      )
    }).or(empty)
  }

  /**
   * Returns a parser that checks for this parser betweeen other parsers
   * @return {Parser}
   */
  between (left, right) {
    if (!right) right = left

    return left.then((_) =>
            this.then((res) =>
              right.then((_) =>
                res)))
  }

  /**
   * Returns a parser that checks for this parser to be chained with an operation
   * @param  {Parser}   operation - operation to chain with the parser
   * @return {Parser}
   */
  chain (operation, def) {
    const rest = (x) => operation.then((f) => 
      this.then((y) => rest(f(x, y)))
    ).or(x)

    const parser = this.then(rest)

    if (def !== undefined) return parser.or(def)
    return parser
  }

  /**
   * Returns a parser that checks for this parser to be chained to the right with an operation
   * @param  {Parser}   operation - operation to chain with the parser
   * @return {Parser}
   */
  chainRight (operation, def) {
    const rest = (x) => operation.then((f) =>
      this.chainRight(operation).then((y) => f(x, y))
    ).or(x)

    const parser = this.then(rest)

    if (def) return parser.or(def)
    return parser
  }

  tokenify (junk = Parser.junk) {
    return this.between(junk)
  }
}

// Operations

/**
 * Result
 * Return always a basic value
 */
Parser.result = function (value){
  return new ResultParser(value);
}

/**
 * Zero
 * Returns the zero parser
 */
Parser.zero = function () {
  return new ZeroParser()
}

/** 
 * Item
 * Returns the item parser
 */
Parser.item = function () {
  return new ItemParser()
}

/**
 * lazy
 * Returns a parser that will be defined on execution time
 */
Parser.lazy = (fn) => Parser.zero().then(fn, true)

/**
 * Operators
 * Creates a parser for a list of operators
 */
Parser.operations = function () {
  return [...arguments].reduce((parser, next) =>
      parser.or(next[0].then(() => next[1])), Parser.zero())
}

// Basic parsers

/**
 * Item parser
 * Returns first character of the input and zero if a zero length input
 */
class ItemParser extends Parser {
  process (input) {
    if (input && input.length) {
      return this.result.push(input[0], input.slice(1))
    }
    return this.result
  }
}

/**
 * Zero parser
 * Returns always an empty result
 */
class ZeroParser extends Parser {
  process (_) {
    return this.result
  }
}
 
/**
 * Result parser
 * Returns always the same value
 */
class ResultParser extends Parser {
  constructor (value) {
    super()
    this.value = value
  }

  process (input) {
    return this.result.push(this.value === undefined ?
        input :
        this.value, input)
  }
}

/**
 * thened parser
 * Returns the result of thening two parsers
 */
class BindedParser extends Parser {
  constructor (parser, cb, alwaysCheckSecond = false) {
    super()
    this.parser = parser
    this.cb = cb
    this.alwaysCheckSecond = alwaysCheckSecond
  }

  process (input) {
    const firstResult = this.parser.parse(input),
      nextParserFn = this.parserifyCb()

    if (this.alwaysCheckSecond && !firstResult.length) return nextParserFn('').parse(input)

    for (const [ value, string ] of firstResult) {
      this.result = this.result.concat(nextParserFn(value).parse(string))
    }
    return this.result
  }

  parserifyCb () {
    return (value) => {
      let nextParser = this.cb.bind(this)(value)
      if (!(nextParser instanceof Parser)) nextParser = Parser.result(nextParser)

      return nextParser
    }
  }
}

/**
 * Added parser
 * Returns the result of adding two parsers
 */
class AddedParser extends Parser {
  constructor (parser1, parser2) {
    super()
    this.parser1 = parser1
    this.parser2 = parser2
  }

  process (input) {
    const res1 = this.parser1.parse(input)

    if (res1.length) return res1
    return res1.concat(this.parser2.parse(input))
  }
}

class NegatedParser extends Parser {
  constructor (parser) {
    super()
    this.parser = parser
  }

  process(input) {
    const res = this.parser.process(input)
    if (res.length) return this.result
    return this.result.push(input, input)
  }
}
