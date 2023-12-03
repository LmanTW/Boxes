//Get Box Item
export default (action, boxes, systemBoxes, start) => {
  let data

  if (systemBoxes[action[start].value] !== undefined) data = systemBoxes[action[start].value]
  else if (boxes[action[start].value] !== undefined) data = boxes[action[start].value].data
  else return { error: true, content: `Box Not Found: ${action[start].value}`, line: action[start].line, start: action[start].start }

  if (action[start+1] !== undefined && action[start+1].type === 'input') {
    let skip = start+1
    
    while (action[skip] !== undefined && action[skip].type === 'input') {
      let data2 = executeAction([action[skip]], boxes, systemBoxes)

      if (data2.error) return data2
      if (data.type !== 'array' && data.type !== 'actionArray' && data.type !== 'externalFunction') return { error: true, content: `Cannot Read ${data2.value[0].value} From <${data.type}>`, line: action[skip].line, start: action[skip].start }
      if (data.type === 'array' && data2.result.value[0].type !== 'number') return { error: true, content: `Cannot Perform "READ" Operation Using <${data2.result.value[0].type}>`, line: action[skip].line, start: action[skip].start }
 
      if (data.type === 'array') data = data.value[data2.result.value[0].value]
      else if (data.type === 'actionArray') {        
        let result = { type: 'empty', value: 'Empty' }

        for (let item of data.value) {
          let data3 = executeAction(item, boxes, Object.assign(systemBoxes, { Result: result, Input: { type: 'array', value: data2.result.value }}))
          if (data3.error) return data3

          result = data3.result
        }

        data = result
      } else {
        try {
          data = convertJSType(data.value(...convertBoxesType({ type: 'array', value: data2.result.value })))
        } catch (error) {
          return { error: true, content: error.toString(), line: action[skip].line, start: action[skip].start }
        }
      }
      
      skip++
    }

    if (data === undefined) data = { type: 'empty', value: 'Empty' }

    return { error: false, data, skip: skip-1 }
  } else return { error: false, data, skip: start }
}

import convertBoxesType from '../Tools/ConvertBoxesType.js'
import convertJSType from '../Tools/ConvertJSType.js'

import executeAction from './ExecuteAction.js'
