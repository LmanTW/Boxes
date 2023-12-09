// Execute chunk
export default (ChunkManager, chunk, boxes, environment) => {
  let action = chunk.actions[chunk.currentAction]
  let fragment = action[chunk.currentFragment]

  if (action.filter((item) => item.type === 'operator' && ['=', '||', '&&', '==', '>', '<', '+', '-', '*', '/'].includes(item.value)).length>  0) {
    if (chunk.executeData === undefined) {
      let type

      for (let item of ['=', '||', '&&', '==', '>', '<', '>=', '<=', '+', '-', '*', '/']) {
        if (action.filter((item2) => item2.type === 'operator' && item2.value === item).length > 0) {
          type = item

          break
        }
      }

      let operators = action.filter((item) => item.type === 'operator' && item.value === type)
      if (operators.length > 1) return { error: true, content: `Unexpected <operator>`, line: operators[1].line, start: operators[1].start }

      chunk.executeData = { type, chunks: splitArray(action, (item) => item.type === 'operator' && item.value === type), returnedResults: [] }

      ChunkManager.addChunk(chunk, undefined, { result: chunk.result, input: chunk.input }, [chunk.executeData.chunks[0]], false)

      return { error: false }
    } else {
      chunk.executeData.returnedResults.push(chunk.returnedResult)

      if (chunk.executeData.returnedResults.length >= chunk.executeData.chunks.length) {
        let data = chunk.executeData.returnedResults

       if (chunk.executeData.type === '=') {
          if (data[0].name === undefined) return { error: true, content: `<${data[0].type}> Is Not In A Box`, line: data[0].line, start: data[0].start }
          if (boxes[data[0].name].lock) return { error: true, content: `Box Is Locked: "${data[0].name}"`, line: data[0].line, start: data[0].start }

          setTarget(data[0].name, data[0].path, data[1], boxes)

          chunk.result = data[1]
        } else if (chunk.executeData.type === '||' || chunk.executeData.type === '&&') {
          if (data[0].type !== 'boolean') return { error: true, content: `Cannot Perform "${(chunk.executeData.type === '||') ? 'Or' : 'And'}" Operation On <${data[0].type}>`, line: data[0].line, start: data[0].start }
          if (data[1].type !== 'boolean') return { error: true, content: `Cannot Perform "${(chunk.executeData.type === '||') ? 'Or' : 'And'}" Operation Using <${data[1].type}>`, line: data[1].line, start: data[1].start }

          chunk.result = { type: 'boolean', value: ((chunk.executeData.type === '||') ? data[0].value === 'Yes' || data[1].value === 'Yes' : data[0].value === 'Yes' && data[1].value === 'Yes') ? 'Yes' : 'No', line: data[0].line, start: data[0].start, end: data[1].end }
        } else if (chunk.executeData.type === '==') {
          if (data[0].type !== data[1].type) chunk.result = { type: 'boolean', value: 'no', line: data[0].line, start: data[0].start, end: data[1].end }

          if (data[0].type === 'list') {
             chunk.result = { type: 'boolean', value: (isListEqual(data[0], data[1])) ? 'yes' : 'no', line: data[0].line, start: data[0].start, end: data[1].end }             
          } else chunk.result = { type: 'boolean', value: (data[0].value === data[1].value) ? 'yes' : 'no', line: data[0].line, start: data[0].start, end: data[1].end }
        } else if (['>', '<', '>=', '<='].includes(chunk.executeData.type)) {
          let operationName
          if (chunk.executeData.type === '>') operationName = 'More Than'
          else if (chunk.executeData.type === '<') operationName = 'Less Than'
          else if (chunk.executeData.type === '>=') operationName = 'More Than Or Equal To'
          else if (chunk.executeData.type === '<=') operationName = 'Less Than Or Equal To'

          if (data[0].type !== 'number') return { error: true, content: `Cannot Perform "${operationName}" Operation On <${data[0].type}>`, line: data[0].line, start: data[0].start }
          if (data[1].type !== 'number') return { error: true, content: `Cannot Perform "${operationName}" Operation On <${data[1].type}>`, line: data[1].line, start: data[1].start }

          let value
          if (chunk.executeData.type === '>') value = +data[0].value > +data[1].value
          else if (chunk.executeData.type === '<') value = +data[0].value < +data[1].value
          else if (chunk.executeData.type === '>=') value = +data[0].value >= +data[1].value
          else if (chunk.executeData.type === '<=') value = +data[0].value <= +data[1].value

          chunk.result = { type: 'boolean', value: (value) ? 'Yes' : 'No', line: data[0].line, start: data[0].start, end: data[1].end }
        } else if (chunk.executeData.type === '+') {
          if (data[0].type !== 'string' && data[0].type !== 'number') return { error: true, content: `Cannot Perform "Add" Operation On <${data[0].type}>`, line: data[0].line, start: data[0].start }
          if (data[1].type !== 'string' && data[1].type !== 'number') return { error: true, content: `Cannot Perform "Add" Operation Using <${data[1].type}>`, line: data[1].line, start: data[1].start }

          if (data[0].type === 'string' || data[1].type === 'string') chunk.result = { type: 'string', value: data[0].value+data[1].value, line: data[0].line, start: data[0].start, end: data[1].end }
          else chunk.result = { type: 'number', value: `${(+data[0].value)+(+data[1].value)}`, line: data[0].line, start: data[0].start, end: data[1].end }
        } else if (chunk.executeData.type === '*') {
          if (data[0].type !== 'string' && data[0].type !== 'number') return { error: true, content: `Cannot Perform "Multiply" Operation On <${data[0].type}>`, line: data[0].line, start: data[0].start }
          if (data[1].type !== 'number') return { error: true, content: `Cannot Perform "Multiply" Operation Using <${data[1].type}>`, line: data[1].line, start: data[1].start }
 
          if (data[0].type === 'string') {
            if (+data[1].value < 0) return { error: true, content: 'Cannot Perform "String Multiply" Using <number> Less Than 0', line: data[1].line, start: data[1].start }

            chunk.result = { type: 'string', value: data[0].value.repeat(+data[1].value), line: data[0].line, start: data[0].start, end: data[1].end }
          } else chunk.result = { type: 'number', value: (+data[0].value)*(+data[1].value), line: data[0].line, start: data[0].start, end: data[1].end }
        } else if (['-', '/'].includes(chunk.executeData.type)) {
          if (data[0].type !== 'number') return { error: true, content: `Cannot Perform "${(chunk.executeData.type === '-') ? 'Subtract' : 'Divide'}" Operation On <${data[0].type}>`, line: data[0].line, start: data[0].start }
          if (data[1].type !== 'number') return { error: true, content: `Cannot Perform "${(chunk.executeData.type === '-') ? 'Subtract' : 'Divide'}" Operation Using <${data[1].type}>`, line: data[1].line, start: data[1].start }
 
          let value = (chunk.executeData.type === '-') ? (+data[0].value)-(+data[1].value) : (+data[0].value)/(+data[1].value)

          if (value === Infinity) chunk.result = { type: 'empty', value: 'Empty', line: data[0].line, start: data[0].start, end: data[1].start }
          else chunk.result = { type: 'number', value: `${value}`, line: data[0].line, start: data[0].start, end: data[1].end }
        }

        chunk.currentFragment = action.length
        chunk.executeData = undefined
      } else {
        ChunkManager.addChunk(chunk, undefined, { result: chunk.result, input: chunk.input }, [chunk.executeData.chunks[chunk.executeData.returnedResults.length]], false)

        return { error: false }
      }
    }
  } else if (fragment.type === 'operator' && fragment.value === '!')  {
    if (chunk.executeData === undefined) {
      chunk.executeData = true

      ChunkManager.addChunk(chunk, undefined, { result: chunk.result, input: chunk.input }, [action.slice(chunk.currentFragment+1, action.length)], false)

      return { error: false }
    } else {
      if (chunk.returnedResult.type !== 'boolean') return { error: true, content: `Cannot Perform "Not" Operation On <${chunk.returnedResult.type}>`, line: fragment.line, start: fragment.line }
     
      chunk.result = { type: 'boolean', value: (chunk.returnedResult.value === 'Yes') ? 'No' : 'Yes', line: fragment.line, start: fragment.start, end: chunk.returnedResult.end }

      chunk.currentFragment = action.length
    }
  } else if (fragment.type === 'operator' && fragment.value === '~') chunk.properties.push('async')
  else if (['string', 'number', 'boolean', 'empty', 'fire', 'actionList'].includes(fragment.type)) {    
    if (action.length > chunk.currentFragment+1) return { error: true, content: `Unexpected <${action[chunk.currentFragment+1].type}>`, line: action[chunk.currentFragment+1].line, start: action[chunk.currentFragment+1].start }

    chunk.result = fragment
  }
  else if (fragment.type === 'name') {
    if (!['Result', 'Input'].includes(fragment.value) && boxes[fragment.value] === undefined && environment[fragment.value] === undefined) return { error: true, content: `Box Not Found: "${fragment.value}"`, line: fragment.line, start: fragment.start }

    let data
    if (fragment.value === 'Result') data = { type: chunk.result.type, value: chunk.result.value, line: fragment.line, start: fragment.start, end: fragment.end, name: fragment.value, path: [] }
    else if (fragment.value === 'Input') data = { type: chunk.input.type, value: chunk.input.value, line: fragment.line, start: fragment.start, end: fragment.end, name: fragment.value, path: [] }
    else data = (boxes[fragment.value] === undefined) ? environment[fragment.value] : boxes[fragment.value].data

    chunk.result = { type: data.type, value: data.value, line: data.line, start: data.start, end: data.end, name: fragment.value, path: [] }
  } else if (fragment.type === 'list' || fragment.type === 'inputList') {
    if (chunk.executeData === undefined) {
      if (action[chunk.currentFragment+1] !== undefined && action[chunk.currentFragment+1].type !== 'inputList') return { error: true, content: `Unexpected <${action[chunk.currentFragment+1].type}>`, line: action[chunk.currentFragment+1].line, start: action[chunk.currentFragment+1].start }

      chunk.executeData = { state: 'gettingItems', returnedResults: [] }

      if (fragment.value.length > 0) ChunkManager.addChunk(chunk, undefined, { result: chunk.result }, [fragment.value[0]], false)
      else {
        if (chunk.result.type === 'list') return { error: true, content: `Cannot Perform "Read" Operation Using <empty>` }
        else chunk.returnedData = { type: 'empty', value: 'Empty', line: fragment.line, start: fragment.start, end: fragment.end }
      }

      return { error: false }
    } else if (chunk.executeData.state === 'gettingItems') {
      chunk.executeData.returnedResults.push(chunk.returnedResult)

      if (chunk.executeData.returnedResults.length >= fragment.value.length) {
        if (fragment.type === 'list') chunk.result = { type: 'list', value: chunk.executeData.returnedResults, line: fragment.line, start: fragment.start, end: fragment.end }
        else {
          if (chunk.result.type !== 'list' && chunk.result.type !== 'actionList' && chunk.result.type !== 'externalFunction') return { error: true, content: `cannot perform "read" operation on <${chunk.result.type}>` }

          if (chunk.result.type === 'list') {
            if (chunk.executeData.returnedResults[0].type !== 'number' && chunk.executeData.returnedResults[0].type !== 'list') return { error: true, content: `Cannot Perform "Read" Operation Using <${chunk.executeData.returnedResults[0].type}>`, line: fragment.line, start: fragment.start }

            let data = chunk.result

            if (chunk.executeData.returnedResults[0].type === 'number') data = data.value[chunk.executeData.returnedResults[0].value]
            else {
              for (let item of chunk.executeData.returnedResults[0].value) {
                if (data === undefined || data.type !== 'list') return { error: true, content: `Cannot Perform "Read" Operation On <${(data === undefined) ? 'empty' : data.type}>`, line: item.line, start: item.start }
                if (item.type !== 'number') return { error: true, content: `Cannot Perform "Read" Operation Using <${item.type}>`, line: item.line, start: item.start }

                data = data.value[item.value]
              }
            }

            if (data === undefined) {
              chunk.result.type = 'empty'
              chunk.result.value = 'Empty'
            } else {
              chunk.result.type = data.type
              chunk.result.value = data.value
            }

            chunk.result.end = fragment.end

            if (chunk.result.path) chunk.result.path.push(chunk.executeData.returnedResults[0].value)
          } else if (chunk.result.type === 'actionList') {
            chunk.executeData.state = 'waitingActions'

            ChunkManager.addChunk(chunk, { line: fragment.line }, { input: { type: 'list', value: chunk.executeData.returnedResults }}, chunk.result.value, chunk.properties.includes('async'))

            return { error: false }
          } else if (chunk.result.type === 'externalFunction') {
            chunk.executeData.state = 'waitingExternalFunction'

            callJsFunction(chunk, chunk.result.value, chunk.executeData.returnedResults, chunk.properties.includes('async'))

            return { error: false }
          }
        }

        chunk.executeData = undefined
      } else {
        ChunkManager.addChunk(chunk, undefined, { result: chunk.result }, [fragment.value[chunk.executeData.returnedResults.length]])
        
        return { error: false }
      }
    } else if (chunk.executeData.state === 'waitingActions') chunk.result = chunk.returnedResult
    else if (chunk.executeData.state === 'waitingExternalFunction') {
      if (chunk.returnedResult.error) return { error: true, content: chunk.returnedResult.content, line: fragment.line, start: fragment.start }

      chunk.result = { type: chunk.returnedResult.data.type, value: chunk.returnedResult.data.value, line: fragment.line, start: fragment.start }
    }
  } else return { error: true, content: `Unexpected <${fragment.type}>`, line: fragment.line, start: fragment.start }

  if (chunk.currentFragment >= action.length-1) {
    chunk.currentFragment = 0

    if (chunk.currentAction >= chunk.actions.length-1) {
      let parentChunk = ChunkManager.chunks[chunk.parentChunk]

      if (!chunk.async && parentChunk !== undefined) {
        parentChunk.state = 'running'
        parentChunk.returnedResult = chunk.result
      }

      ChunkManager.removeChunk(chunk.id)
    } else {
      chunk.currentAction++
      chunk.properties = []
    }
  } else chunk.currentFragment++

  return { error: false }
}

import splitArray from '../Tools/SplitArray.js'

import callJsFunction from './CallJsFunction.js'
import isListEqual from './EqualList.js'
import setTarget from './SetTarget.js'
