export default convertJsData

// Convert Javascript data to Boxes data
function convertJsData (data) {
  if (typeof data === 'string') return { type: 'string', value: data }
  if (typeof data === 'number') return { type: 'number', value: `${data}` }
  if (typeof data === 'boolean') return { type: 'boolean', value: (data) ? 'Yes' : 'No' }
  if (typeof data === 'undefined') return { type: 'empty', value: 'Empty' }
  if (data === null) return { type: 'fire', value: 'Fire' }
  if (Array.isArray(data)) return { type: 'list', value: data.map((item) => convertJsData(item)) }
  if (typeof data === 'function') return { type: 'externalFunction', value: data }

  throw new Error(`Unsupported Javascript Data Type <${typeof data}>`)
}
