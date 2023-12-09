export default convertBoxData

// Convert Boxes data to Javascript data
function convertBoxData (data) {
  if (data.type === 'string') return data.value
  if (data.type === 'number') return +data.value
  if (data.type === 'boolean') return data.value === 'Yes'
  if (data.type === 'empty') return undefined
  if (data.type === 'list') return data.value.map((item) => convertBoxData(item))
  if (data.type === 'externalFunction') return data.value

  throw new Error(`Unsupported Boxes Data Type <${typeof data}>`)
}
