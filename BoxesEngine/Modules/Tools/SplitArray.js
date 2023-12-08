// Split array
export default (array, callback) => {
  let chunks = [[]]

  array.forEach((item) => {
    if (callback(item)) chunks.push([])
    else chunks[chunks.length-1].push(item)
  })

  return chunks
}
