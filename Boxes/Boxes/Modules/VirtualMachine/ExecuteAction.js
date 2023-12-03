export default executeAction

//Execute Action
function executeAction (action, boxes, systemBoxes) {
  let result
 
  if (action.length === 1) {
    if (action[0].type === 'operator') return { error: true, content: `Unexpected <operator>`, line: action[0].type, start: action[0].start }

    if (action[0].type === 'name') {
      let data = getBox(action, boxes, systemBoxes, 0)
      if (data.error) return data

      result = data.data
    } if (action[0].type === 'array') {
      result = { type: 'array', value: [] }

      for (let i = 0; i < action[0].value.length; i++) {
        let data = executeAction(action[0].value[i], boxes, systemBoxes)
        if (data.error) return data

        result.value.push({ type: data.result.type, value: data.result.value })
      }
    } else result = action[0]
  } else if (action[0].type === 'operator' && action[0].value === '!') {
    if (action[1].type === 'boolean') result = { type: 'boolean', value: (action[1].value === 'Yes') ? 'No' : 'Yes' }
    else if (action[1].type === 'name') {
      let data = getBox(action, boxes, systemBoxes, 1)
      if (data.error) return data
      if (data.data.type !== 'boolean') return { error: true, content: `Cannot Perform "NOT" Operation On <${data.data.type}>`, line: action[1].line, start: action[1].start }
      if (action[data.skip+1] !== undefined) return { error: true, content: `Unexpected <${action[data.skip+1].type}>`, line: action[data.skip+1].line, start: action[data.skip+1].start }

      result = { type: 'boolean', value: (data.data.value === 'Yes') ? 'No' : 'Yes' }
    } else return { error: true, content: `Cannot Perform "NOT" Operation On <${action[1].type}>`, line: action[1].line, start: action[1].start }
  } else if (false) {
    
  } else if (action[0].type === 'name') {
    let data = getBox(action, boxes, systemBoxes, 0)
    if (data.error) return data

    if (action[data.skip+1] !== undefined) return { error: true, content: `Unexpected <${action[data.skip+1].type}>`, line: action[data.skip+1].line, start: action[data.skip+1].start }

    result = data.data
  }


  return { error: false, result }
}

import getBox from './GetBox.js'
