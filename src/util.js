'use strict'

const whitespaces = " \n\t\v\f\r"

export const isLower = (str) => {
  const code = str.charCodeAt(0)
  return code >= 97 && code <= 122
}

export const isUpper = (str) => {
  const code = str.charCodeAt(0)
  return code >= 65 && code <= 90
}

export const isSpace = (str) =>
  whitespaces.includes(str)

export const toArray = (item) => {
  if ((item || item === 0) && !item.length)
    return [ item ]
  if (!item)
    return []
  return item
}
