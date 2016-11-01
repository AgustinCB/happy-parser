'use strict'

/**
 * Class representing a parser result
 */
export default class Result {
  /**
   * Creates the result
   */
  constructor () {
    this.values = []
    this.unconsumedStrings = []
  }

  /**
   * Adds a new set (parser, unconsumedString) into the collection
   * @param  {Object} parser resulting parser
   * @param  {String} unconsumedString unconsumed string
   * @return {Result} this result
   */
  push (value, unconsumedString) {
    this.values.push(value)
    this.unconsumedStrings.push(unconsumedString)
    return this
  }

  /**
   * Concatenates two results
   * @param  {Result} result result to concatenate
   * @return {Result} this result
   */
  concat (result) {
    return result.reduce((prev, value, string) => prev.push(value, string), Result.copy(this))
  }

  /**
   * Returns an array representation of the result
   * @return {Array}
   */
  entries () {
    return [...this]
  }

  /**
   * Iterates a result using a function
   * @param  {Function} fn function to iterate results
   */
  forEach (fn) {
    this.entries().forEach((pair) => fn(...pair))
  }

  /**
   * Returns an array resulting of operation item by item in the result
   * @param  {Function} fn function to map results
   * @return {Array}
   */
  map (fn) {
    return this.entries().map((pair) => fn(...pair))
  }

  /**
   * Reduce a result using an initial value and an operation
   * @param  {Function} fn function to reduce results
   * @param  {Mixed}    initialValue initial value of the reduce operation
   * @return {Array}
   */
  reduce (fn, initialValue) {
    return this.entries().reduce((prev, pair) => fn(prev, ...pair), initialValue)
  }

  /**
   * Filter a result using an operation
   * @param  {Function} fn function to filter results
   * @return {Array}
   */
  filter (fn) {
    const newEntries = this.entries().filter((pair) => fn.bind(this, ...pair)()),
      res = new Result()

    newEntries.forEach((pair) => res.push(...pair))

    return res
  }

  /**
   * Clear a result
   */
  empty () {
    this.values = []
    this.unconsumedStrings = []
  }

  /**
   * returns the collection as an iterable
   * @return  {Array}   list of results
   */
  *[Symbol.iterator]() {
    for (let i in this.values) {
      yield [this.values[i], this.unconsumedStrings[i]];
    }
  }

  /**
   * returns the length of the collection
   * @return  {number}   length of the collection
   */
  get length () {
    return this.values.length;
  }
}

/**
 * Adds a new copy of the result
 * @param  {Result} copyFrom source result
 * @return {Result} the copied result
 */
Result.copy = (copyFrom) => {
  const result = new Result()

  result.values = copyFrom.values.slice(0)
  result.unconsumedStrings = copyFrom.unconsumedStrings.slice(0)

  return result
}
