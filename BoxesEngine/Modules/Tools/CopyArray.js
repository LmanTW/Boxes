export default copyArray

// Copy array
function copyArray (array) {
  let list = []
  
  array.forEach((item, index) => {
    if (Array.isArray(item)) list.push(copyArray(item, index)) 
    else list.push(item)
  })

  return list
}
