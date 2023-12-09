// Get default environment
export default () => {
  return {
    'print': (...data) => console.log(...data.map((item) => getPrintContent(item, 0))),

    'String.from': (data) => {return getDataValue(data)},
    'String.split': (data, separator) => {
      if (typeof data !== 'string') throw `Cannot Perform "split" Operation On <${getTypeName(data)}>`
      if (typeof separator !== 'string') throw `Cannot Perform "split" Operation Using <${getTypeName(data)}>`

      return data.split(separator)
    }
  }
}

// Get print content 
function getPrintContent (data, layer) {
  if (typeof data === 'string') return ' '.repeat(layer*2)+`"${data}"`
  if (typeof data === 'number') return ' '.repeat(layer*2)+data
  if (typeof data === 'boolean') return ' '.repeat(layer*2)+((data) ? 'Yes' : 'No')
  if (typeof data === 'undefined') return ' '.repeat(layer*2)+'Empty'
  if (data === null) return ' '.repeat(layer*2)+'Fire'
  if (Array.isArray(data)) {
    if (layer > 1) return ' '.repeat(layer*2)+`[Array: ${data.length}]`
    else {
      let items = data.map((item) => getPrintContent(item, layer+1))

      if (items.length > 99) return `${' '.repeat(layer*2)}[${items.slice(0, 99).join(',\n')}\n... ${data.length-99} More\n${' '.repeat(layer*2)}]`
      else return `${' '.repeat(layer*2)}[\n${items.join(',\n')}\n${' '.repeat(layer*2)}]`
    }
  }
}

// Get data value
function getDataValue (data) {
  if (['string', 'number'].includes(typeof data)) return data.toString()
  if (typeof data === 'boolean') return (data) ? 'Yes' : 'No'
  if (typeof data === 'undefined') return 'Empty'
  if (data === null) return 'Fire'
  if (Array.isArray(data)) return `[${data.map((item) => getDataValue(item)).join(',')}]`
}

//Get data type name
function getTypeName (data) {
  if (['string', 'number', 'boolean'].includes(typeof data)) return typeof data
  if (typeof data === 'undefined') return 'Empty'
  if (data === null) return 'Fire'
  if (Array.isArray(data)) return 'List'
}
