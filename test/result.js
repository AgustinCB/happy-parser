import chai from 'chai'
import Result from '../lib/result'

const should = chai.should()

describe('#result', function () {
  it('Should push new items into a result', function () {
    let res = new Result()

    res.push('value', 'string')

    res.values.length.should.equal(1)
    res.values[0].should.equal('value')

    res.unconsumedStrings.length.should.equal(1)
    res.unconsumedStrings[0].should.equal('string')
  })

  it('Length should equal the number of results', function () {
    let res = new Result()

    res.push('value', 'string')
    res.push('value', 'string')

    res.length.should.equal(res.values.length)
  })

  it('Should concat two results', function () {
    let res = new Result(),
      res1 = new Result()

    res.push('value', 'string')
    res1.push('value1', 'string1')

    let res2 = res.concat(res1)

    res2.length.should.equal(2)
    res2.values[0].should.equal(res.values[0])
    res2.values[1].should.equal(res1.values[0])

    res2.unconsumedStrings.length.should.equal(2)
    res2.unconsumedStrings[0].should.equal(res.unconsumedStrings[0])
    res2.unconsumedStrings[1].should.equal(res1.unconsumedStrings[0])
  })

  it('Should return an array-like object', function () {
    let res = new Result()

    res.push('value', 'string')

    let array = res.entries()

    array.length.should.equal(1)
    array[0].length.should.equal(2)
    array[0][0].should.equal(res.values[0])
    array[0][1].should.equal(res.unconsumedStrings[0])
  })

  it('Should iterate using forEach', function () {
    let res = new Result(),
      index = 0

    res.push('value', 'string')
    res.push('value', 'string')
    res.push('value1', 'string1')
    res.push('value1', 'string1')

    res.forEach((value, string) => {
      value.should.equal(res.values[index])
      string.should.equal(res.unconsumedStrings[index])
      index += 1
    })
  })

  it('Should map a result', function () {
    let res = new Result()

    res.push('value', 'string')
    res.push('value', 'string')
    res.push('value1', 'string1')
    res.push('value1', 'string1')

    let array = res.map((value, string) => {
      return value + string
    })

    array.forEach((value, index) => {
      value.should.equal(res.values[index] + res.unconsumedStrings[index])
    })
  })

  it('Should copy a result', function () {
    let res = new Result(),
      index = 0

    res.push('value', 'string')
    res.push('value', 'string')

    let res1 = Result.copy(res)

    res.length.should.equal(res1.length)

    res.forEach((value, string) => {
      value.should.equal(res1.values[index])
      string.should.equal(res1.unconsumedStrings[index])
      index += 1
    })
  })

  it('Should reduce a result', function () {
    let res = new Result()

    res.push('value', 'string')
    res.push('value', 'string')
    res.push('value1', 'string1')
    res.push('value1', 'string1')

    let reducedRes = res.reduce((prev, value, string) => {
      return prev + value + string
    }, '')

    reducedRes.should.equal(res.entries().reduce((prev, item) => prev + item[0] + item[1], ''))
  })

  it('Should filter a result', function () {
    let res = new Result()

    res.push('value', 'string')
    res.push('value1', 'string1')
    res.push('value', 'string')
    res.push('value1', 'string1')

    let filteredRes = res.filter((value, string) => value === 'value')

    filteredRes.length.should.equal(2)
    filteredRes.values[0].should.equal(res.values[0])
    filteredRes.values[1].should.equal(res.values[2])
  })

  it('Should clear an array', function () {
    let res = new Result()

    res.push('value', 'string')
    res.push('value1', 'string1')
    res.push('value', 'string')
    res.push('value1', 'string1')

    res.empty()

    res.length.should.equal(0)
  })

  it('Should get a result with get', function () {
    let res = new Result()

    res.push('value', 'string')
    res.push('value1', 'string1')
    res.push('value', 'string')
    res.push('value1', 'string1')

    res.get().should.equal('value')
    res.get(3).should.equal('value1')
  })

  it('Should iterate an array using for...of construction', function () {
    let res = new Result()

    res.push('value', 'string')
    res.push('value1', 'string1')
    res.push('value', 'string')
    res.push('value1', 'string1')

    let index = 0
    for (let [value, string] of res) {
      value.should.equal(res.values[index])
      string.should.equal(res.unconsumedStrings[index])
      index += 1
    }
  })
})
