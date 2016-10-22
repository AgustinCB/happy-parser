import chai from 'chai'
import Parser from '../lib/parser'

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
    let res = Parser.result(42)

    res.parse('asd').values[0].should.equal(42)
    res.parse(123).values[0].should.equal(42)
  })

  it('Zero should always return empty', function () {
    Parser.zero().parse('asd').length.should.equal(0)
    Parser.zero().parse(123).length.should.equal(0)
  })

  it('Item should always return the first element', function () {
    Parser.item().parse('asd').values[0].should.equal('a')
    Parser.item().parse([ 1, 2, 3 ]).values[0].should.equal(1)
  })

  describe('#bind', function () {
    it('Should bind two parsers', function () {
      let parser = Parser.item(),
        res = parser.bind(Parser.item).parse('asd')

      res.length.should.equal(1)
      res.values[0].should.equal('s')
      res.unconsumedStrings[0].should.equal('d')
    })

    it('Should always go to the second parser on requested', function () {
      let res = Parser.zero().bind(Parser.item, true).parse('asd')

      res.length.should.equal(1)
      res.values[0].should.equal('a')
      res.unconsumedStrings[0].should.equal('sd')
    })
  })

  it('Should sum two parsers', function () {
    let parser = Parser.result(42).plus(Parser.item()),
      res = parser.parse('asd')

    res.length.should.equal(2)
    res.values[0].should.equal(42)
    res.values[1].should.equal('a')
  })

  it('Should satisfy conditions', function () {
    let parser = Parser.item().satisfy((c) => c < 4),
      res = parser.parse([ 1, 5, 7 ]),
      res1 = parser.parse([ 5, 7 ])

    res.length.should.equal(1)
    res.values[0].should.equal(1)

    res1.length.should.equal(0)
  })

  it('Should check for more than zero result', function () {
    let parser = Parser.item().satisfy((c) => c < 4).atLeastOne(),
      input = [ 1, 2, 3, 42 ],
      res = parser.parse(input),
      index = 0

    res.length.should.equal(3)
    res.values[0].length.should.equal(3)
    res.values[0].forEach((value) => {
      value.should.equal(input[index])
      index += 1
    })
  })

  it('Should check for zero or more results', function () {
    let parser = Parser.item().satisfy((c) => c < 4).many([]),
      input = [ 1, 2, 3, 42 ],
      res = parser.parse(input),
      res2 = parser.parse([ 42, 43 ]),
      index = 0

    res.length.should.equal(4)
    res.values[0].length.should.equal(3)
    res.values[0].forEach((value) => {
      value.should.equal(input[index])
      index += 1
    })

    res2.length.should.equal(1)
    res2.values[0].length.should.equal(0)
  })

  it('Should check the first item', function () {
    let parser = Parser.item().firstIs(42),
      res = parser.parse([ 42, 43 ]),
      res2 = parser.parse([ 41, 43 ])

    res.length.should.equal(1)
    res.values[0].should.equal(42)

    res2.length.should.equal(0)
  })

  describe('#startsWith', function () {
    it('Should check the first items', function () {
      let parser = Parser.item().startsWith('AgustinCB'),
        res = parser.parse('AgustinCB is awesome'),
        res2 = parser.parse('And AgustinCB too')

      res.length.should.equal(1)
      res.values[0].should.equal('AgustinCB')

      res2.length.should.equal(0)
    })

    it('Should check the first items partially', function () {
      let parser = Parser.item().startsWith('AgustinCB', true),
        res = parser.parse('AgustinCB is awesome'),
        res2 = parser.parse('And AgustinCB too')

      res.length.should.equal(1)
      res.values[0].should.equal('AgustinCB')

      res2.length.should.equal(1)
      res2.values[0].should.equal('A')
    })
  })

  it('Should check for items separated by a parser', function () {
    let parser = Parser.item().firstIs('A').sepBy(Parser.item().firstIs(',')),
      res = parser.parse('A,A,A'),
      res2 = parser.parse('asd')

    res.length.should.equal(4)
    res.values[0].should.equal('AAA')

    res2.length.should.equal(1)
    res2.values[0].length.should.equal(0)
  })

  it('Should check for items between a parser', function () {
    let parser = Parser.item().firstIs('A').between(Parser.item().firstIs(',')),
      res = parser.parse(',A,'),
      res2 = parser.parse('asd')

    res.length.should.equal(1)
    res.values[0].should.equal('A')

    res2.length.should.equal(0)
  })
})
