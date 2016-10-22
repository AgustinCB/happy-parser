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

  parse (input) {
    this.result = new Result()
    this.result = this.process(input)

    if (this.mapValues) this.result.values = this.result.values.map(this.mapValues)

    return this.result
  }

  /**
   * Binds two parsers together
   * @param {Parser}    parser first parser to bind
   * @return {Function} function that takes a function and returns a parser
   */
  bind (cb, alwaysCheckSecond) { 
    return new BindedParser(this, cb, alwaysCheckSecond);
  }

  /**
   * Sums this parser to another
   * @param {Parser}  parser parser to sum
   * @return {Parser} parser that concatenates the result of the two params
   */
  plus (parser) {
    return new AddedParser(this, parser)
  }

  /**
   * Creates a parser that success if the result of this parser passes a condition
   * @param {Function}  condition function that takes an input and returns a boolean
   * @return  {Parser}  parser that success in a condition
   */
  satisfy (condition) {
    return this.bind((input) => condition(input) ? Parser.result(input) : Parser.zero());
  }

  /**
   * Returns a parser to check that input has at least one element
   * @return  {Parser}
   * 
   */
  atLeastOne () {
    return this.bind((c) => 
            this.many().bind((c1) => 
               Parser.result(util.toArray(c).concat(util.toArray(c1)))))
  }

  /**
   * Returns a parser to check that input has 0+ elements of this parser
   * @return {Parser}
   */
  many (empty = '') {
    return this.atLeastOne().plus(Parser.result(empty))
  }

  /**
   * Returns a parser to check that the first item is a given value
   * @return {Parser}
   */
  firstIs (value) {
    return this.satisfy((input) => value === input)
  }

  /**
   * Returns a parser to checks that the first items are equals to a given value
   * @return {Parser}
   */
  startsWith (value) {
    if (!value.length) return Parser.zero()

    return this.firstIs(value[0]).bind((_) =>
            this.startsWith(value.slice(1)).bind((_) => Parser.result(value), true))
  }

  /**
   * Returns a parser that checks for various results of this separated by another parser
   * @return {Parser}
   */
  sepBy (parser, empty = '') {
    return this.bind((head) => {
      let sepParser = parser.bind((_) =>
        this.bind((next) => Parser.result(next))
      )
      return sepParser.many().bind((tail) =>
        Parser.result(util.toArray(head).concat(tail))
      )
    }).plus(Parser.result(empty))
  }

  /**
   * Returns a parser that checks for this parser betweeen other parsers
   * @return {Parser}
   */
  between (left, right) {
    if (!right) right = left

    return left.bind((_) =>
            this.bind((res) =>
              right.bind((_) =>
                Parser.result(res))))
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
 * Binded parser
 * Returns the result of binding two parsers
 */
class BindedParser extends Parser {
  constructor (parser, cb, alwaysCheckSecond = false) {
    super()
    this.parser = parser
    this.cb = cb
    this.alwaysCheckSecond = alwaysCheckSecond
  }

  process (input) {
    let firstResult = this.parser.parse(input),
      nextParser = this.cb.bind(this)

    if (this.alwaysCheckSecond && !firstResult.length) return nextParser('').parse(input)

    for (let [ value, string ] of firstResult) {
      this.result = this.result.concat(nextParser(value).parse(string))
    }
    return this.result
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
    return this.parser1.parse(input)
      .concat(this.parser2.parse(input))
  }
}
