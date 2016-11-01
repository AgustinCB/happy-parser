# Class: Parser
Creates a parser

## (new Parser()).map(mapValues) 

Maps parsed values

**Parameters**

**mapValues**: `function`, function that mapes the values

**Returns**: `Parser`, this parser

## (new Parser()).parse(input) 

Parses an input

**Parameters**

**input**: `Iterable`, iterable (string, array) with the values to be parsed

**Returns**: `Result`, result of the parse

## (new Parser()).orNone(empty) 

Returns a parser for this or empty.

**Parameters**

**empty**: `Mixed`, value to be pased in the empty result

**Returns**: `Parser`, new generated parser

## (new Parser()).not() 

Returns a negated version of this parser

**Returns**: `Parser`, new generated parser

## (new Parser()).then(cb, alwaysCheckSecond) 

Returns a parser that then does another parsing

**Parameters**

**cb**: `function`, callback that returns a new parser

**alwaysCheckSecond**: `Boolean`, whether to check or not for the second step on empty.

**Returns**: `Parser`, new generated parser

## (new Parser()).or(arguments) 

Returns a parser of this parser or another

**Parameters**

**arguments**: `Array.&lt;Parser&gt;`, list of parsers to or

**Returns**: `Parser`, new generated parser

## (new Parser()).satisfy(condition) 

Creates a parser that success if this one passes a condition

**Parameters**

**condition**: `function`, function that takes an input and returns a boolean

**Returns**: `Parser`, parser that success in a condition

## (new Parser()).filter(condition) 

Alias of satisfy

**Parameters**

**condition**: `function`, function that takes an input and returns a boolean

**Returns**: `Parser`, parser that success in a condition

## (new Parser()).many() 

Returns a parser to check that input has at least one element

**Returns**: `Parser`

## (new Parser()).manyOrNone(empty) 

Returns a parser to check that input has 0+ elements of this parser

**Parameters**

**empty**: `Mixed`, value to be pased in the empty result

**Returns**: `Parser`

## (new Parser()).equals(value) 

Returns a parser to check that the item is a given value

**Parameters**

**value**: `Mixed`, value to check

**Returns**: `Parser`

## (new Parser()).startsWith(value, partial) 

Returns a parser to checks that the first items are equals to a given value

**Parameters**

**value**: `Mixed`, value to check

**partial**: `Boolean`, checks for partial success

**Returns**: `Parser`

## (new Parser()).sepBy(parser, empty) 

Returns a parser that checks for various results of this separated by another parser

**Parameters**

**parser**: `Parser`, returns the separator

**empty**: `Mixed`, value to be pased in the empty result

**Returns**: `Parser`

## (new Parser()).between(left, right) 

Returns a parser that checks for this parser betweeen other parsers

**Parameters**

**left**: `Parser`, parser for the left part

**right**: `Parser`, parser for the right part (optional)

**Returns**: `Parser`

## (new Parser()).chain(operation, def) 

Returns a parser that checks for this parser to be chained with an operation

**Parameters**

**operation**: `Parser`, operation to chain with the parser

**def**: `Mixed`, value to be pased in case of empty result

**Returns**: `Parser`

## (new Parser()).chainRight(operation, def) 

Returns a parser that checks for this parser to be chained to the right with an operation

**Parameters**

**operation**: `Parser`, operation to chain with the parser

**def**: `Mixed`, value to be pased in case of empty result

**Returns**: `Parser`

## (new Parser()).trim(junk) 

Returns a parser that checks that strims the results

**Parameters**

**junk**: `Parser`, parser with the junk to trim

**Returns**: `Parser`

## Parser.result(value) 

Result
Return always a basic value

**Parameters**

**value**: `Mixed`, value of the result

**Returns**: `Parser`

## Parser.zero() 

Zero
Returns the zero parser

**Returns**: `Parser`

## Parser.item() 

Item
Returns the item parser

**Returns**: `Parser`

## Parser.lazy(fn) 

lazy
Returns a parser that will be defined on execution time

**Parameters**

**fn**: `function`, returns a lazy parser

**Returns**: `Parser`

## Parser.operations(arguments) 

Operators
Creates a parser for a list of operators

**Parameters**

**arguments**: `Array.&lt;Parser&gt;`, list of parsers

**Returns**: `Parser`

* * *
