# Class: Result
Creates the result

**length**:  , returns the length of the collection
## (new Result()).push(parser, unconsumedString) 

Adds a new set (parser, unconsumedString) into the collection

**Parameters**

**parser**: `Object`, resulting parser

**unconsumedString**: `String`, unconsumed string

**Returns**: `Result`, this result

## (new Result()).concat(result) 

Concatenates two results

**Parameters**

**result**: `Result`, result to concatenate

**Returns**: `Result`, this result

## (new Result()).entries() 

Returns an array representation of the result

**Returns**: `Array`

## (new Result()).forEach(fn) 

Iterates a result using a function

**Parameters**

**fn**: `function`, function to iterate results


## (new Result()).map(fn) 

Returns an array resulting of operation item by item in the result

**Parameters**

**fn**: `function`, function to map results

**Returns**: `Array`

## (new Result()).reduce(fn, initialValue) 

Reduce a result using an initial value and an operation

**Parameters**

**fn**: `function`, function to reduce results

**initialValue**: `Mixed`, initial value of the reduce operation

**Returns**: `Array`

## (new Result()).filter(fn) 

Filter a result using an operation

**Parameters**

**fn**: `function`, function to filter results

**Returns**: `Array`

## (new Result()).empty() 

Clear a result


## (new Result()).iterator() 

returns the collection as an iterable

**Returns**: `Array`, list of results

## Result.copy(copyFrom) 

Adds a new copy of the result

**Parameters**

**copyFrom**: `Result`, source result

**Returns**: `Result`, the copied result

* * *
