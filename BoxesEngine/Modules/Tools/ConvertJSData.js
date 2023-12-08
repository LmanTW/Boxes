// Convert Javascript data to Boxes data
export default (data) => {
  if (typeof data === 'string') return { type: 'string', value: data }
  if (typeof data === 'number') return { type: 'number', value: `${data}` }
  if (typeof data === 'boolean') return { type: 'boolean', value: (data) ? 'Yes' : 'No' }
  if (typeof data === 'undefined') return { type: 'empty', value: 'Empty' }
  if (typeof data === 'function') return { type: 'externalFunction', value: data }

  throw new Error(`Unsupported Javascript Data Type: ${typeof data}`)
}
