export default mergeObject

// Merge object
function mergeObject (target, object) {
  target = copyObject(target)

  if (object === undefined) return target

  Object.keys(object).forEach((item) => {
    if (typeof object[item] === 'object') {
      if (typeof target[item] !== 'object') target[item] = {}

      target[item] = mergeObject(target[item], object[item])
    } else target[item] = object[item]
  })

  return target
}

import copyObject from '../Tools/CopyObject.js'
