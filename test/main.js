import chai from 'chai'
import * as jsparser from '../lib/main'

const should = chai.should()

describe('#main', function () {
  it('Should contain a lazy method', function () {
    jsparser.lazy.should.be.ok
  })

  it('Should contain a result method', function () {
    jsparser.result.should.be.ok
  })

  it('Should contain a Parser object', function () {
    jsparser.Parser.should.be.ok
  })

  it('Should contain a satisfy helper', function () {
    let parser = jsparser.satisfy((c) => c < 4),
      res = parser.parse([ 1, 5, 7 ]),
      res1 = parser.parse([ 5, 7 ])

    res.length.should.equal(1)
    res.values[0].should.equal(1)

    res1.length.should.equal(0)
  })

  it('Should contain a zero helper', function () {
    jsparser.zero.parse('asd').length.should.equal(0)
    jsparser.zero.parse(123).length.should.equal(0)
  })

  it('Should contain a item helper', function () {
    jsparser.item.parse('asd').values[0].should.equal('a')
    jsparser.item.parse([ 1, 2, 3 ]).values[0].should.equal(1)
  })

  it('Should contain a parser for digits', function () {
    jsparser.digit.parse('asd').length.should.equal(0)
    jsparser.digit.parse('1, 2, 3').values[0].should.equal('1')
  })

  it('Should contain a parser for lowercase letters', function () {
    jsparser.lower.parse('asd').values[0].should.equal('a')
    jsparser.lower.parse('1, 2, 3').length.should.equal(0)
    jsparser.lower.parse('ASD').length.should.equal(0)
  })

  it('Should contain a parser for uppercase letters', function () {
    jsparser.upper.parse('Asd').values[0].should.equal('A')
    jsparser.upper.parse('1, 2, 3').length.should.equal(0)
    jsparser.upper.parse('aSD').length.should.equal(0)
  })

  it('Should contain a parser for letters', function () {
    jsparser.letter.parse('Asd').values[0].should.equal('A')
    jsparser.letter.parse('1, 2, 3').length.should.equal(0)
    jsparser.letter.parse('aSD').values[0].should.equal('a')
    jsparser.letter.parse(',aSD').length.should.equal(0)
  })

  it('Should contain a parser for symbols', function () {
    jsparser.symbol.parse('+').values[0].should.equal('+')
    jsparser.symbol.parse('Asd').length.should.equal(0)
  })

  it('Should contain a parser for specific chars', function () {
    jsparser.char('A').parse('Asd').values[0].should.equal('A')
    jsparser.char('A').parse('1, 2, 3').length.should.equal(0)
  })

  it('Should contain a parser for specific strings', function () {
    jsparser.string('Asd').parse('Asd').values[0].should.equal('Asd')
    jsparser.string('Asd').parse('1, 2, 3').length.should.equal(0)
  })

  it('Should contain a parser for alphanumerics', function () {
    jsparser.alphanumeric.parse('Asd').values[0].should.equal('A')
    jsparser.alphanumeric.parse('1, 2, 3').values[0].should.equal('1')
    jsparser.alphanumeric.parse('aSD').values[0].should.equal('a')
    jsparser.alphanumeric.parse(',aSD').length.should.equal(0)
  })

  it('Should contain a parser for non-empty words', function () {
    jsparser.neword.parse('Asd!').values[0].should.equal('Asd')
    jsparser.neword.parse('').length.should.equal(0)
  })

  it('Should contain a parser for words', function () {
    jsparser.word.parse('Asd!').values[0].should.equal('Asd')
    jsparser.word.parse('').values[0].should.equal('')
  })

  it('Should contain a parser for uints', function () {
    jsparser.uint.parse('123').values[0].should.equal(123)
    jsparser.uint.parse('-123').length.should.equal(0)
    jsparser.uint.parse('asd').length.should.equal(0)
  })

  it('Should contain a parser for ints', function () {
    jsparser.int.parse('123').values[0].should.equal(123)
    jsparser.int.parse('-123').values[0].should.equal(-123)
    jsparser.int.parse('asd').length.should.equal(0)
  })

  it('Should contain a parser for spaces', function () {
    jsparser.spaces.parse(' \t\n').length.should.equal(1)
  })
})
