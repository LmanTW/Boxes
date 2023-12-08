// Get array include amount
export default (array, callback) => {
  let amount = 0

  array.forEach((item) => {
    if (callback(item)) amount++
  })

  return amount
}
