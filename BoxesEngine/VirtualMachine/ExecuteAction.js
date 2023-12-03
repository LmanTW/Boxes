export default executeAction

//Execute Action
function executeAction (action, boxes, systemBoxes) {
  let result
 
  if (action.length === 1) {
    if (action[0].type === 'operator') return { error: true, content: `Unexpected <operator>`, line: action[0].type, start: action[0].start }

    if (action[0].type === 'name') {
      let data = getBox(action, boxes, systemBoxes, 0)
      if (data.error) return data

      result = Object.assign(data.data, { line: action[0].line, start: action[0].start })
    } else if (action[0].type === 'array' || action[0].type === 'input') {
      result = { type: action[0].type, value: [] }

      for (let i = 0; i < action[0].value.length; i++) {
        let data = executeAction(action[0].value[i], boxes, systemBoxes)
        if (data.error) return data

        result.value.push({ type: data.result.type, value: data.result.value })
      }
    }  else result = action[0]
  } else if (action[0].type === 'operator' && action[0].value === '!') {
    if (action[1].type === 'boolean') result = { type: 'boolean', value: (action[1].value === 'Yes') ? 'No' : 'Yes' }
    else if (action[1].type === 'name') {
      let data = getBox(action, boxes, systemBoxes, 1)
      if (data.error) return data
      if (data.data.type !== 'boolean') return { error: true, content: `Cannot Perform "NOT" Operation On <${data.data.type}>`, line: action[1].line, start: action[1].start }
      if (action[data.skip+1] !== undefined) return { error: true, content: `Unexpected <${action[data.skip+1].type}>`, line: action[data.skip+1].line, start: action[data.skip+1].start }

      result = { type: 'boolean', value: (data.data.value === 'Yes') ? 'No' : 'Yes' }
    } else return { error: true, content: `Cannot Perform "NOT" Operation On <${action[1].type}>`, line: action[1].line, start: action[1].start }
  } else if (arrayIncludeAmount(action, (item) => item.type === 'operator' && item.value === '+') > 0 || arrayIncludeAmount(action, (item) => item.type === 'operator' && item.value === '-') > 0 || arrayIncludeAmount(action, (item) => item.type === 'operator' && item.value === '*') > 0 || arrayIncludeAmount(action, (item) => item.type === 'operator' && item.value === '/') > 0) {
    let type
    
    if (arrayIncludeAmount(action, (item) => item.type === 'operator' && item.value === '+') > 0) type = '+'
    else if (arrayIncludeAmount(action, (item) => item.type === 'operator' && item.value === '-') > 0) type = '-'
    else if (arrayIncludeAmount(action, (item) => item.type === 'operator' && item.value === '*') > 0) type = '*'
    else if (arrayIncludeAmount(action, (item) => item.type === 'operator' && item.value === '/') > 0) type = '/'

    let chunks = splitArray(action, (item) => item.type === 'operator' && item.value === type)

    if (chunks.length > 2) {
      if (chunks[2].length > 0) return { error: true, content: `Unexpected <${chunks[2][0].type}>`, line: chunks[2][0].line, start: chunks[2][0].start }
      else return { error: true, content: `Unexpected <${action[action.length-1].type}>`, line: action[action.length-1].line, start: action[action.length-1].start }
    }

    for (let i = 0; i < chunks.length; i++) {
      let data = executeAction(chunks[i], boxes, systemBoxes)
      if (data.error) return data

      chunks[i] = data.result
    }

    if (type === '+') {
      if (chunks[0].type !== 'string' && chunks[0].type !== 'number') return { error: true, content: `Cannot Perform "Add" Operation On <${chunks[0].type}>`, line: chunks[0].line, start: chunks[0].start }
      if (chunks[1].type !== 'string' && chunks[1].type !== 'number') return { error: true, content: `Cannot Perform "Add" Operation On <${chunks[1].type}>`, line: chunks[1].line, start: chunks[1].start }

      if (chunks[0].type === 'string' || chunks[1].type === 'string') result = { type: 'string', value: chunks[0].value+chunks[1].value }
      else result = { type: 'number', value: `${(+chunks[0].value)+(+chunks[1].value)}` }
    } else if (type === '-') {
      if (chunks[0].type !== 'number') return { error: true, content: `Cannot Perform "Subtract" Operation On <${chunks[0].type}>` }
      if (chunks[1].type !== 'number') return { error: true, content: `Cannot Perform "Subtract" Operation On <${chunks[1].type}>` }

      result = { type: 'number', value: `${(+chunks[0].value)-(+chunks[1].value)}` }
    } else if (type === '*') {
      if (chunks[0].type === 'string' && chunks[1].type === 'number') {
        if (+chunks[1].value < 0) return { error: true, content: `<number> Must Be Positive`, line: chunks[1].line, start: chunks[1].start }

        result = { type: 'string', value: chunks[0].value.repeat(+chunks[1].value) }
      }
      else {
        if (chunks[0].type !== 'number') return { error: true, content: `Cannot Perform "Multiply" Operation On <${chunks[0].type}>` }
        if (chunks[1].type !== 'number') return { error: true, content: `Cannot Perform "Multiply" Operation On <${chunks[1].type}>` }

        result = { type: 'number', value: `${(+chunks[0].value)*(+chunks[1].value)}` }
      }
    } else if (type === '/') {
      if (chunks[0].type !== 'number') return { error: true, content: `Cannot Perform "Divide" Operation On <${chunks[0].type}>` }
      if (chunks[1].type !== 'number') return { error: true, content: `Cannot Perform "Divide" Operation On <${chunks[1].type}>` }  

      result = { type: 'number', value: `${(+chunks[0].value)/(+chunks[1].value)}` }
    }
  } else if (action[0].type === 'name') {
    let data = getBox(action, boxes, systemBoxes, 0)
    if (data.error) return data

    if (action[data.skip+1] !== undefined) return { error: true, content: `Unexpected <${action[data.skip+1].type}>`, line: action[data.skip+1].line, start: action[data.skip+1].start }

    result = data.data
  } else return { error: true, content: `Unexpected <${action[1].type}>`, line: action[1].line, start: action[1].start }

  return { error: false, result }
}

import arrayIncludeAmount from '../Tools/ArrayIncludeAmount.js'
import splitArray from '../Tools/SplitArray.js'

import getBox from './GetBox.js'
