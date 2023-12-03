export default convertJSType

//Convert Javascript Type
function convertJSType(data) {
  if (typeof data === 'string') return { type: 'string', value: data }
  if (typeof data === 'number') return { type: 'number', value: `${data}` }
  if (typeof data === 'boolean') return { type: 'boolean', value: (data) ? 'Yes' : 'No' }
  if (data === undefined) return { type: 'empty', value: 'Empty' }
  if (Array.isArray(data)) return { type: 'array', value: data.map((item) => convertJSType(item)) }
  if (typeof data === 'function') return { type: 'externalFunction', value: data }

  throw new Error(`Cannot Convert Javascript Type: <${typeof data}>`)
}
