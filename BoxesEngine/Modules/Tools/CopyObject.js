// Copy object
export default (source) => {
  let object = {}

  applySource(object, source)

  return object
}

// Apply source
function applySource (target, source) {
   Object.keys(source).forEach((item) => {
    if (typeof source[item] === 'object') {
      if (target[item] === undefined) target[item] = {}

      applySource(target[item], source[item])
    } else target[item] = source[item]
  })
}
