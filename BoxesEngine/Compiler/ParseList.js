export default parseList

//Parse List
function parseList (fragments, line) {
  let fragments2 = []

  let state = {}
  for (let i = 0; i < fragments.length; i++) {
    if (state.type === undefined) {
      if (fragments[i].type === 'bracket' && fragments[i].value === '[') state = { type: 'array', value: [], start: fragments[i].start, layer: fragments[i].layer }
      else if (fragments[i].type === 'bracket' && fragments[i].value === '{') state = { type: 'actions', value: {}, start: fragments[i].start, layer: fragments[i].layer }
      else if (fragments[i].type === 'bracket' && fragments[i].value === '(') state = { type: 'input', value: [], start: fragments[i].start, layer: fragments[i].layer }
      else fragments2.push(fragments[i])
    } else {
      if (state.type === 'array' || state.type === 'input') {
        if (fragments[i].type === 'bracket' && (fragments[i].value === ']' || fragments[i].value === ')') && state.layer === fragments[i].layer) {
          for (let i2 = 1; i2 < state.value.length; i2++) {
            if ((state.value[i2] !== undefined && state.value[i2].type === 'operator' && state.value[i2].value === ',' && state.layer+1 === state.value[i2].layer) && (state.value[i2-1] !== undefined && state.value[i2-1].type === 'operator' && state.value[i2-1].value === ',' && state.layer+1 === state.value[i2-1].layer)) return { error: true, content: `Unexpected "${type}"`, line: state.value[i2].line, start: state.value[i2].start }
          }

          let items = splitArray(state.value, (item) => item.type === 'operator' && item.value === ',' && state.layer+1 === item.layer)

          for (let i2 = 0; i2 < items.length; i2++) {
            let data = parseList(items[i2], line)

            if (data.error) return data

            items[i2] = data.fragments
          }

          fragments2.push({ type: (fragments[i].value === ']') ? 'array' : 'input', value: items, line, start: state.start })

          state = {}
        } else state.value.push(fragments[i])
      } else if (state.type === 'actions') {
        if (fragments[i].type === 'bracket' && fragments[i].value === '}' && state.layer === fragments[i].layer) {
          for (let i2 = 1; i2 < state.value.length; i2++) {
            if ((state.value[i2] !== undefined && state.value[i2].type === 'operator' && state.value[i2].value === '>' && state.layer+1 === state.value[i2].layer) && (state.value[i2-1] !== undefined && state.value[i2-1].type === 'operator' && state.value[i2-1].value === type && state.layer+1 === state.value[i2-1].layer)) return { error: true, content: `Unexpected "${type}"`, line: state.value[i2].line, start: state.value[i2].start }
          }

          let items = splitArray(state.value, (item) => item.type === 'operator' && item.value === '>' && state.layer+1 === item.layer)

          for (let i2 = 0; i2 < items.length; i2++) {
            let data = parseList(items[i2], line)

            if (data.error) return data

            items[i2] = data.fragments
          }

          fragments2.push({ type: 'actions', value: items, line, start: state.start})

          state = {}
          
        } else state.value.push(fragments[i])
      }   
    }
  }

  if (state.type !== undefined) return { error: true, content: `<bracket> Cannot Be Closed`, line, start: state.start }

  return { error: false, fragments: fragments2 }
}

import arrayIncludeAmount from '../Tools/ArrayIncludeAmount.js'
import splitArray from '../Tools/SplitArray.js'
