'use strict'

import Parser from './parser'
export { default as Parser } from './parser'
import * as util from './util'

// export const ParserClass = Parser

export const lazy = Parser.lazy

export const result = Parser.result

// Utils

/**
 * Creates a parser that success if the first character passes a condition
 * @param {Function}  condition function that takes an input and returns a boolean
 * @return  {Parser}  parser that success in a condition
 */
export const satisfy = (condition) =>
                          item.then((input) => condition(input) ? result(input) : zero)

// Parsers
export const zero = Parser.zero()
export const item = Parser.item()
export const digit = satisfy((c) => {
  const v = parseInt(c)
  return typeof v === 'number' && v >= 0 && v <= 9
})
export const lower = satisfy((c) => util.isLower(c))
export const upper = satisfy((c) => util.isUpper(c))
export const letter = lower.or(upper)
export const symbol = satisfy((c) => !(util.isLower(c) || util.isUpper(c) || util.isSpace(c)))
export const space = satisfy((c) => util.isSpace(c))
export const char = (value) => item.equals(value)
export const alphanumeric = letter.or(digit)
export const string = (str) => item.manyOrNone().equals(str)

export const spaces = space.manyOrNone('')
export const neword = letter.many()
export const word = letter.manyOrNone()

Parser.junk = spaces

export const uint = digit.many()
uint.mapValues = (v) => parseInt(v)
export const int = item.equals('-').then((minus) =>
                    uint.then((number) => result(parseInt(minus + number))), true)
