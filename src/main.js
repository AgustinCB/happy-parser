'use strict'

import Result from './result'
import ParserClass from './parser'
import * as util from './util'

export const Parser = ParserClass

// Utils

/**
 * Creates a parser that success if the first character passes a condition
 * @param {Function}  condition function that takes an input and returns a boolean
 * @return  {Parser}  parser that success in a condition
 */
export const satisfy = (condition) => 
                          ITEM.bind((input) => condition(input) ? Parser.result(input) : ZERO)

// Parsers 
export const ZERO = Parser.zero()
export const ITEM = Parser.item()
export const DIGIT = satisfy((c) => parseInt(c))
export const LOWER = satisfy((c) => util.isLower(c))
export const UPPER = satisfy((c) => util.isUpper(c))
export const LETTER = LOWER.plus(UPPER)
export const CHAR = (value) => ITEM.firstIs(value)
export const ALPHANUMERIC = LETTER.plus(DIGIT)

export const NEWORD = LETTER.atLeastOne()
export const WORD = LETTER.many()

export const UINT = DIGIT.atLeastOne()
UINT.mapValues = (v) => parseInt(v)
export const INT = ITEM.firstIs('-').bind((minus) => 
                    UINT.bind((number) => Parser.result(parseInt(minus+number))), true)
