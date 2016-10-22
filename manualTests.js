const parser = require('../lib/main')

const intList = parser.INT.sepBy(parser.CHAR(','), []).between(parser.CHAR('['), parser.CHAR(']'))

console.log(parser.UINT.parse('123').entries())
console.log(parser.UINT.parse('-123').entries())
console.log(parser.WORD.parse('YES!').entries())
console.log(parser.LETTER.startsWith('YES!').parse('YES!').entries())
console.log(intList.parse('[1,2,3,4]').entries())
console.log(intList.parse('[]').entries())
