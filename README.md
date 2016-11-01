# Node parser combinator
[![travis-ci](https://api.travis-ci.org/AgustinCB/happy-parser.png?branch=master)](https://travis-ci.org/AgustinCB/docker-api)

Monadic parser combinator for node javascript.

## Example

```javascript
const parsec = require('happy-parser');

const sum = (x, y) => x + y, 
      rest = (x, y) => x - y

const
  termOperations = parsec.Parser.operations([ parsec.char('+'), sum ], [ parsec.char('-'), rest ]),
  factorOperations = parsec.Parser.operations([ parsec.char('^'), Math.pow.bind() ])

const factor = parsec.lazy(() => 
            parsec.int.trim().or(expr.trim().between(parsec.char('('), parsec.char(')'))).trim()
          ),
      term = parsec.lazy(() => factor.chainRight(factorOperations).trim()),
      expr = term.chain(termOperations).trim()

console.log(expr.parse(' 3^2 + (4 - 7) '))
```

Check also the [documentation](https://github.com/AgustinCB/happy-parser/tree/master/docs) and [tests](https://github.com/AgustinCB/happy-parser/tree/master/test)
