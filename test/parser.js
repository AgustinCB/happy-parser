import chai from 'chai'
import Parser from '../lib/parser'
import * as parsec from '../lib/main'

const should = chai.should()

describe('#parser', function () {
  it('Should contain a process method', function () {
    class WrongParser extends Parser {
    }

    try {
      new WrongParser()
    } catch (err) {
      err.toString().should.equal('TypeError: Must override process')
    }
  })

  it('Result should always return it\'s value', function () {
    const res = Parser.result(42)

    res.parse('asd').values[0].should.equal(42)
    res.parse(123).values[0].should.equal(42)
  })

  it('Result should have the input', function () {
    const res = Parser.result(42)

    res.parse('asd').input.should.equal('asd')
  })

  it('Zero should always return empty', function () {
    Parser.zero().parse('asd').length.should.equal(0)
    Parser.zero().parse(123).length.should.equal(0)
  })

  it('Item should always return the first element', function () {
    Parser.item().parse('asd').values[0].should.equal('a')
    Parser.item().parse([ 1, 2, 3 ]).values[0].should.equal(1)
  })

  it('Should allow lazy parsers', function () {
    const parser = Parser.lazy(() => parser1),
      parser1 = Parser.item(),
      res = parser1.parse('asd')

    res.length.should.equal(1)
    res.values[0].should.equal('a')
  })

  it('Should create a parser of multiple operations', function () {
    const op1 = (x) => x, op2 = (y) => y
    const parser = Parser.operations([ parsec.char('x'), op1 ], [ parsec.char('y'), op2 ]),
      res1 = parser.parse('x'), res2 = parser.parse('y'), res3 = parser.parse('z')

    res1.length.should.equal(1)
    res1.values[0].should.equal(op1)
    res2.length.should.equal(1)
    res2.values[0].should.equal(op2)
    res3.length.should.equal(0)
  })

  it('Should be able to map values', function () {
    const parser = Parser.item().map((c) => c.toUpperCase())

    parser.parse('asd').values[0].should.equal('A')
  })

  describe('#then', function () {
    it('Should bind two parsers', function () {
      const parser = Parser.item(),
        res = parser.then(Parser.item).parse('asd')

      res.length.should.equal(1)
      res.values[0].should.equal('s')
      res.unconsumedStrings[0].should.equal('d')
    })

    it('Should always go to the second parser on requested', function () {
      const res = Parser.zero().then(Parser.item, true).parse('asd')

      res.length.should.equal(1)
      res.values[0].should.equal('a')
      res.unconsumedStrings[0].should.equal('sd')
    })

    it('Should automatically convert to a result', function () {
      const res = Parser.item().then(() => 42).parse('asd')

      res.length.should.equal(1)
      res.values[0].should.equal(42)
    })

    it('Should return also the input', function () {
      const res = Parser.item().then((_, input) => {
        input.should.equal('sd')
        return 42
      }).parse('asd')
    })
  })

  describe('#or', function () {
    it('Should sum two parsers', function () {
      const parser = Parser.result(42).or(Parser.item()),
        res = parser.parse('asd'),
        res2 = parser.parse('')

      res.length.should.equal(1)
      res.values[0].should.equal(42)
      res2.length.should.equal(1)
      res2.values[0].should.equal(42)
    })

    it('Should convert non-parser arguments into results', function () {
      const parser = Parser.item().or(42),
        res = parser.parse('asd'),
        res2 = parser.parse('')

      res.length.should.equal(1)
      res.values[0].should.equal('a')
      res2.length.should.equal(1)
      res2.values[0].should.equal(42)
    })

    it('Should accept more than one option', function () {
      const parser = Parser.zero().or(Parser.item(), 42),
        res = parser.parse('asd'),
        res2 = parser.parse('')

      res.length.should.equal(1)
      res.values[0].should.equal('a')
      res2.length.should.equal(1)
      res2.values[0].should.equal(42)
    })
  })

  it('Should filter conditions', function () {
    const parser = Parser.item().filter((c) => c < 4),
      res = parser.parse([ 1, 5, 7 ]),
      res1 = parser.parse([ 5, 7 ])

    res.length.should.equal(1)
    res.values[0].should.equal(1)

    res1.length.should.equal(0)
  })

  it('Should satisfy conditions', function () {
    const parser = Parser.item().satisfy((c) => c < 4),
      res = parser.parse([ 1, 5, 7 ]),
      res1 = parser.parse([ 5, 7 ])

    res.length.should.equal(1)
    res.values[0].should.equal(1)

    res1.length.should.equal(0)
  })

  it('Should be able to be optional', function () {
    const parser = Parser.item().satisfy((c) => c < 4).orNone(),
      res = parser.parse([ 1, 5, 7 ]),
      res1 = parser.parse([ 5, 7 ])

    res.length.should.equal(1)
    res.values[0].should.equal(1)

    res1.length.should.equal(1)
    res1.values[0].should.equal('')
  })

  it('Should be able to be negated', function () {
    const parser = Parser.item().satisfy((c) => c < 4).not(),
      res = parser.parse([ 5, 7 ]),
      res1 = parser.parse([ 1, 2 ])

    res.length.should.equal(1)
    res.values[0][0].should.equal(5)
    res.values[0][1].should.equal(7)

    res1.length.should.equal(0)
  })

  it('Should check for more than zero result', function () {
    const parser = Parser.item().satisfy((c) => c < 4).many(),
      input = [ 1, 2, 3, 42 ],
      res = parser.parse(input)
    let index = 0

    res.length.should.equal(1)
    res.values[0].length.should.equal(3)
    res.values[0].forEach((value) => {
      value.should.equal(input[index])
      index += 1
    })
  })

  it('Should check for more than zero result in an accumulator', function () {
    const parser = parsec.neword.trim().many(Array),
      input = "asd asd asd",
      res = parser.parse(input)

    res.length.should.equal(1)
    res.values[0].length.should.equal(3)
    res.values[0].forEach((value) => {
      value.should.equal("asd")
    })
  })

  it('Should return many arrays instead of one concatenated', function () {
    const parser = Parser.item().then(Parser.result([ 1, 2 ])).many(),
      res = parser.parse('asd').get()

    res.length.should.equal(3)
    res.forEach((value) => {
      value.length.should.equal(2)
      value[0].should.equal(1)
      value[1].should.equal(2)
    })
  })

  it('Should check for zero or more results', function () {
    const parser = Parser.item().satisfy((c) => c < 4).manyOrNone([])
    const input = [ 1, 2, 3, 42 ],
      res = parser.parse(input),
      res2 = parser.parse([ 42, 43 ])
    let index = 0

    res.length.should.equal(1)
    res.values[0].length.should.equal(3)
    res.values[0].forEach((value) => {
      value.should.equal(input[index])
      index += 1
    })

    console.log(res2, res, Parser.item().satisfy((c) => c < 4).manyOrNone([]).parse([42, 43]))
    res2.length.should.equal(1)
    res2.values[0].length.should.equal(0)
  })

  it('Should check the first item', function () {
    const parser = Parser.item().equals(42),
      res = parser.parse([ 42, 43 ]),
      res2 = parser.parse([ 41, 43 ])

    res.length.should.equal(1)
    res.values[0].should.equal(42)

    res2.length.should.equal(0)
  })

  describe('#startsWith', function () {
    it('Should check the first items', function () {
      const parser = Parser.item().startsWith('AgustinCB'),
        res = parser.parse('AgustinCB is awesome'),
        res2 = parser.parse('And AgustinCB too')

      res.length.should.equal(1)
      res.values[0].should.equal('AgustinCB')

      res2.length.should.equal(0)
    })

    it('Should check the first items partially', function () {
      const parser = Parser.item().startsWith('AgustinCB', true),
        res = parser.parse('AgustinCB is awesome'),
        res2 = parser.parse('And AgustinCB too')

      res.length.should.equal(1)
      res.values[0].should.equal('AgustinCB')

      res2.length.should.equal(1)
      res2.values[0].should.equal('A')
    })
  })

  it('Should check for items separated by a parser', function () {
    const parser = Parser.item().equals('A').sepBy(Parser.item().equals(',')),
      res = parser.parse('A,A,A'),
      res2 = parser.parse('asd')

    res.length.should.equal(1)
    res.values[0].should.equal('AAA')

    res2.length.should.equal(1)
    res2.values[0].length.should.equal(0)
  })

  it('Should check for items between a parser', function () {
    const parser = Parser.item().equals('A').between(Parser.item().equals(',')),
      res = parser.parse(',A,'),
      res2 = parser.parse('asd')

    res.length.should.equal(1)
    res.values[0].should.equal('A')

    res2.length.should.equal(0)
  })

  it('Should check the first item between parsers', function () {
    const parser = Parser.item().startsWith('asd').between(Parser.item().equals(',')),
      res = parser.parse(',asd,'),
      res2 = parser.parse([ 41, 43 ])

    res.length.should.equal(1)
    res.values[0].should.equal('asd')

    res2.length.should.equal(0)
  })

  describe('#chain', function () {
    const rest = (x, y) => x-y, sum = (x, y) => x+y
    const op = Parser.operations([ parsec.char('+'), sum ], [ parsec.char('-'), rest ])
    const expr = parsec.int.chain(op)
    it('Should chain parsers', function () {
      const res = expr.parse('2+3-4')

      res.length.should.equal(1)
      res.values[0].should.equal(1)
    })

    it('Should return default value on empty', function () {
      const defExpr = parsec.int.chain(op, 0),
        res = defExpr.parse('a')

      res.length.should.equal(1)
      res.values[0].should.equal(0)
    })
  })

  describe('#chainRight', function () {
    const range = (r) => Array.apply(0, Array(r)).map((x, y) => y)
    const pow = (x, y) => range(y).reduce((acc, next) => acc * x, 1)
    const expOp = Parser.operations([ parsec.char('^'), pow ])
    it('Should chain parsers', function () {
      const term = parsec.int.chainRight(expOp)
      const res = term.parse('2^2^3')

      res.length.should.equal(1)
      res.values[0].should.equal(256)
    })

    it('Should return default value on empty', function () {
      const defTerm = parsec.int.chain(expOp, 1),
        res = defTerm.parse('a')

      res.length.should.equal(1)
      res.values[0].should.equal(1)
    })
  })

  it('Should tokenify a parser', function () {
    const parser = Parser.item().trim(),
      res = parser.parse('   asd')

    res.length.should.equal(1)
    res.values[0].should.equal('a')
    res.unconsumedStrings[0].should.equal('sd')
  })
})
