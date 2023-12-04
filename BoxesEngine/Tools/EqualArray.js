//Equal Array
export default (a, b) => {
  if (a.length !== b.length) return false

  return JSON.stringify(a) === JSON.stringify(b)
}
