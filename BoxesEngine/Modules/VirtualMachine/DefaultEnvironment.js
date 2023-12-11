// Get default environment
export default () => {
  return {
    'print': (...data) => console.log(...data.map((item) => getPrintContent(item, 0))),

    'String.from': (data) => {return getDataValue(data)},
    'String.substring': (string, start, end) => {
      if (typeof string !== 'string') throw `Cannot Perform "Substring" Operation On <${getTypeName(string)}>`
      if (typeof start !== 'number') throw `Cannot Perform "Substring" Operation Using <${getTypeName(start)}> (start)`
      if (typeof end !== 'number') throw `Cannot Perform "Substring" Operation Using <${getTypeName(end)}> (end)`

      return data.substring(start, end)
    },
    'String.replace': (string, pattern, replacement) => {
      if (typeof string !== 'string') throw `Cannot Perform "Replace" Operation On <${getTypeName(string)}>`
      if (typeof pattern !== 'string') throw `Cannot Perform "Replace" Operation Using <${getTypeName(pattern)}> (pattern)`
      if (typeof replacement !== 'string') throw `Cannot Perform "Replace" Operation Using <${getTypeName(replacement)}> (replacement)`

      return string.replaceAll(pattern, replacement)
    },
    'String.split': (string, separator) => {
      if (typeof string !== 'string') throw `Cannot Perform "Split" Operation On <${getTypeName(string)}>`
      if (typeof separator !== 'string') throw `Cannot Perform "Split" Operation Using <${getTypeName(separator)}>`

      return string.split(separator)
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
    'Number.toFixed': (number, digits) => {
      if (typeof number !== 'number') throw `Cannot Perform "To Fixed" Operation On <${getTypeName(number)}>`
      if (typeof digits !== 'number') throw `Cannot Perform "To Fixed" Operation Using <${getTypeName(digits)}> (digits)`

      return parseInt(number).toFixed(digits)
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
    },

    'Math.PI': 3.14,
    'Math.abs': (number) => {
      if (typeof number !== 'number') throw `Cannot Perform "Absolute" Operation On <${getTypeName(number)}>`

      return Math.abs(number)
    },
    'Math.ceil': (number) => {
      if (typeof number !== 'number') throw `Cannot Perform "Ceil" Operation On <${getTypeName(number)}>`

      return Math.ceil(number)      
    },
    'Math.cos': (number) => {
      if (typeof number !== 'number') throw `Cannot Perform "Cosine" Operation On <${getTypeName(number)}>`

      return Math.cos(number)
    },
    'Math.floor': (number) => {
      if (typeof number !== 'number') throw `Cannot Perform "Floor" Operation On <${getTypeName(number)}>`

      return Math.floor(number)
    },
    'Math.pow': (number, exponent) => {
       if (typeof number !== 'number') throw `Cannot Perform "Power" Operation On <${getTypeName(number)}>`
       if (typeof exponent !== 'number') throw `Cannot Perform "Power" Operation Using <${getTypeName(exponent)}>`

       return Math.pow(number, exponent)
    },
    'Math.random': (min, max) => {
      if (typeof min !== 'number') throw `Cannot Perform "Random" Operation Using <${getTypeName(min)}> (min)`
      if (typeof max !== 'number') throw `Cannot Perform "Random" Operation Using <${getTypeName(max)}> (max)`

      return Math.floor(Math.random()*max)+min
    },
    'Math.sin': (number) => {
      if (typeof number !== 'number') throw `Cannot Perform "Sine" Operation On <${getTypeName(number)}>`

      return Math.sin(number)
    },
    'Math.turnc': (number) => {
      if (typeof number !== 'number') throw `Cannot Perform "Truncate" Operation On <${getTypeName(number)}>`

      return Math.trunc(number)
    },

    'Timer.wait': async (time) => {
      if (typeof time !== 'number') throw `Cannot Perform "Wait" Operation Using <${getTypeName(time)}>`

      return new Promise((resolve) => {
        setTimeout(() => resolve(), time)
      })
    },
    'Timer.createTimeout': (time, callback) => {
      if (typeof time !== 'number') throw `Cannot Perform "Create Timeout" Operation Using <${getTypeName(time)}>`
      if (typeof callback !== 'function') throw `Cannot Perform "Create Timeout" Operation On <${getTypeName(callback)}>`

      let id = generateID(5, Object.keys(timers))
      timers[id] = setTimeout(() => {
        if (timers[id] !== undefined) {
          delete timers[id]

          callback()
        }
      }, interval)

      return id
    },
    'Timer.createInterval': (interval, callback) => {
      if (typeof interval !== 'number') throw `Cannot Perform "Create Interval" Operation Using <${getTypeName(interval)}>`
      if (typeof callback !== 'function') throw `Cannot Perform "Create Interval" Operation On <${getTypeName(callback)}>`

      let id = generateID(5, Object.keys(timers))
      timers[id] = setInterval(callback, interval)

      return id
    },

    'Date.now': () => {
      return Date.now()
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
  if (typeof data === 'object' && data.type === 'promise') return ' '.repeat(layer*2)+'[Promise]'
}

// Get data value
function getDataValue (data) {
  if (['string', 'number'].includes(typeof data)) return data.toString()
  if (typeof data === 'boolean') return (data) ? 'Yes' : 'No'
  if (typeof data === 'undefined') return 'Empty'
  if (data === null) return 'Fire'
  if (Array.isArray(data)) return `[${data.map((item) => getDataValue(item)).join(',')}]`
  if (typeof data === 'function') return '[Action List]'
  if (typeof data === 'object' && data.type === 'promise') return '[Promise]'
}

//Get data type name
function getTypeName (data) {
  if (['string', 'number', 'boolean'].includes(typeof data)) return typeof data
  if (typeof data === 'undefined') return 'Empty'
  if (data === null) return 'Fire'
  if (Array.isArray(data)) return 'list'
  if (typeof data === 'function') return 'actionList'
  if (typeof data === 'object' && data.type === 'promise') return 'promise'
}

import generateID from '../Tools/GenerateID.js'
import copyArray from '../Tools/CopyArray.js'

let timers = {}
