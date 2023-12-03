//Array Include Amount
export default (array, callback) => {
  let amount = 0

  array.forEach((item) => {
    if (callback(item)) amount++
  })

  return amount
}
