export default copyArray

// Copy array
function copyArray (array) {
  let list = []
  
  array.forEach((item) => {
    if (Array.isArray(item)) list.push(copyArray(item)) 
    else list.push(item)
  })

  return list
}
