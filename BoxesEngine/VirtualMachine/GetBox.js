//Get Box Item
export default (action, boxes, systemBoxes, start) => {
  let data

  if (systemBoxes[action[start].value] !== undefined) data = systemBoxes[action[start].value]
  else if (boxes[action[start].value] !== undefined) data = boxes[action[start].value].data
  else return { error: true, content: `Box Not Found: ${action[start].value}`, line: action[start].line, start: action[start].start }

  if (action[start+1] !== undefined && action[start+1].type === 'input') {
    let skip = start+1
    
    while (action[skip] !== undefined && action[skip].type === 'input') {
      let data2 = executeAction(action[skip].value[0], boxes, systemBoxes)

      if (data2.error) return data2
      if (data2.result.type !== 'number') return { error: true, content: `Cannot Perform "READ" Operation Using <${data2.result.type}>`, line: action[skip].line, start: action[skip].start }
      if (data.type !== 'array') return { error: true, content: `Cannot Read ${data2.result.value} From <${data.type}>`, line: action[skip].line, start: action[skip].start }

      data = data.value[data2.result.value]
      
      skip++
    }

    if (data === undefined) return { type: 'empty', value: 'Empty' }

    return { error: false, data, skip: skip-1 }
  } else return { error: false, data, skip: start }
}

import executeAction from './ExecuteAction.js'
