let parsec = require('./lib/main')

let rest = (x, y) => x-y
let sum = (x, y) => x+y
let pow = (x, y) => range(y).reduce((acc, next) => acc * x, 1)

// Sugar to get the integers from 0 to 1
const range = (r) => Array.apply(0, Array(r)).map((x, y) => y)

let expOp = parsec.Parser.operators([ [ parsec.CHAR('^'), pow ] ])

let op = parsec.Parser.operators([ [ parsec.CHAR('+'), sum ], [ parsec.CHAR('-'), rest ] ])

let expr = parsec.Parser.lazy((_) => term.chain(op))

let factor = parsec.INT.plus(expr.between(parsec.CHAR('('), parsec.CHAR(')')))
let term = parsec.Parser.lazy((_) => factor.chainRight(expOp))

console.log(expr.parse('1+2^2^3-(3+4)').entries())
console.log(term.parse('2^2^3').entries())
