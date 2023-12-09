// Get default environment
export default () => {
  return {
    'print': (...data) => console.log(...data.map((item) => getPrintContent(item, 0))),

    'String.from': (data) => {return getDataValue(data)},
    'String.split': (data, separator) => {
      if (typeof data !== 'string') throw `Cannot Perform "Split" Operation On <${getTypeName(data)}>`
      if (typeof separator !== 'string') throw `Cannot Perform "Split" Operation Using <${getTypeName(data)}>`

      return data.split(separator)
    },
    'String.substring': (data, start, end) => {
      if (typeof data !== 'string') throw `Cannot Perform "Substring" Operation On <${getTypeName(data)}>`
      if (typeof start !== 'number') throw `Cannot Perform "Substring" Operation Using <${getTypeName(start)}> (start)`
      if (typeof end !== 'number') throw `Cannot Perform "Substring" Operation Using <${getTypeName(end)}> (end)`

      return data.substring(start, end)
    },

    'Number.from': (data) => {
      if (typeof data === 'string') {
        if (isNaN(+data)) return undefined

        return +data
      } else if (typeof data === 'number') return data
      else if (typeof data === 'boolean') return +data
      else if (typeof data === 'undefined' || data === null) return 0
      else if (Array.isArray(data)) return undefined
    },

    'List.add': (list, data) => {
      if (!Array.isArray(list)) throw `Cannot Perform "Add To List" Operation On <${getTypeName(list)}>`

      return list.concat([data])
    },
    'List.insert': (list, index, data) => {
      if (!Array.isArray(list)) throw `Cannot Perform "Insert To List" Operation On <${getTypeName(list)}>`
      if (typeof index !== 'number') throw `Cannot Perform "Insert To List" Operation Using <${getTypeName(index)}> (index)`

      list = copyArray(list)

      list.splice(index, 0, data)
      
      return list
    },
    'List.join': (data, separator) => {
      if (!Array.isArray(data)) throw `Cannot Perform "Join" Operation On <${getTypeName(data)}>`
      if (typeof separator !== 'string') throw `Cannot Perform "Join" Operation Using <${getTypeName(separator)}>`

      return data.join(separator)
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
  if (['string', 'number', 'boolean'].incluEdes(typeof data)) return typeof data
  if (typeof data === 'undefined') return 'Empty'
  if (data === null) return 'Fire'
  if (Array.isArray(data)) return 'list'
}

import copyArray from '../Tools/CopyArray.js'
