'use strict'

export const isLower = (str) => {
  let code = str.charCodeAt(0)
  return code >= 97 && code <= 122
}

export const isUpper = (str) => {
  let code = str.charCodeAt(0)
  return code >= 65 && code <= 90
}

export const toArray = (item) => {
  if (item && !item.length)
    return [ item ]
  if (!item)
    return []
  return item
}
