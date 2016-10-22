import chai from 'chai'
import * as jsparser from '../lib/main'

const should = chai.should()

describe('#main', function () {
  it('Should contain parser class', function () {
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
    jsparser.ZERO.parse('asd').length.should.equal(0)
    jsparser.ZERO.parse(123).length.should.equal(0)
  })

  it('Should contain a item helper', function () {
    jsparser.ITEM.parse('asd').values[0].should.equal('a')
    jsparser.ITEM.parse([ 1, 2, 3 ]).values[0].should.equal(1)
  })

  it('Should contain a parser for digits', function () {
    jsparser.DIGIT.parse('asd').length.should.equal(0)
    jsparser.DIGIT.parse('1, 2, 3').values[0].should.equal('1')
  })

  it('Should contain a parser for lowercase letters', function () {
    jsparser.LOWER.parse('asd').values[0].should.equal('a')
    jsparser.LOWER.parse('1, 2, 3').length.should.equal(0)
    jsparser.LOWER.parse('ASD').length.should.equal(0)
  })

  it('Should contain a parser for uppercase letters', function () {
    jsparser.UPPER.parse('Asd').values[0].should.equal('A')
    jsparser.UPPER.parse('1, 2, 3').length.should.equal(0)
    jsparser.UPPER.parse('aSD').length.should.equal(0)
  })

  it('Should contain a parser for letters', function () {
    jsparser.LETTER.parse('Asd').values[0].should.equal('A')
    jsparser.LETTER.parse('1, 2, 3').length.should.equal(0)
    jsparser.LETTER.parse('aSD').values[0].should.equal('a')
    jsparser.LETTER.parse(',aSD').length.should.equal(0)
  })

  it('Should contain a parser for specific chars', function () {
    jsparser.CHAR('A').parse('Asd').values[0].should.equal('A')
    jsparser.CHAR('A').parse('1, 2, 3').length.should.equal(0)
  })

  it('Should contain a parser for alphanumerics', function () {
    jsparser.ALPHANUMERIC.parse('Asd').values[0].should.equal('A')
    jsparser.ALPHANUMERIC.parse('1, 2, 3').values[0].should.equal('1')
    jsparser.ALPHANUMERIC.parse('aSD').values[0].should.equal('a')
    jsparser.ALPHANUMERIC.parse(',aSD').length.should.equal(0)
  })

  it('Should contain a parser for non-empty words', function () {
    jsparser.NEWORD.parse('Asd!').values[0].should.equal('Asd')
    jsparser.NEWORD.parse('').length.should.equal(0)
  })

  it('Should contain a parser for words', function () {
    jsparser.WORD.parse('Asd!').values[0].should.equal('Asd')
    jsparser.WORD.parse('').values[0].should.equal('')
  })

  it('Should contain a parser for uints', function () {
    jsparser.UINT.parse('123').values[0].should.equal(123)
    jsparser.UINT.parse('-123').length.should.equal(0)
    jsparser.UINT.parse('asd').length.should.equal(0)
  })

  it('Should contain a parser for ints', function () {
    jsparser.INT.parse('123').values[0].should.equal(123)
    jsparser.INT.parse('-123').values[0].should.equal(-123)
    jsparser.INT.parse('asd').length.should.equal(0)
  })
})
