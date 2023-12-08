export default parseList

// Parse list
function parseList (fragments, line) {
  let fragments2 = []

  let state = {}
  for (let i = 0; i < fragments.length; i++) {
    if (state.type === undefined) {
      if (fragments[i].type === 'bracket' && fragments[i].value === '[') state = { type: 'list', bracket: ']', value: [], start: fragments[i].start, layer: fragments[i].layer }
      else if (fragments[i].type === 'bracket' && fragments[i].value === '{') state = { type: 'actionList', bracket: '}', value: [], start: fragments[i].start, layer: fragments[i].layer }
      else if (fragments[i].type === 'bracket' && fragments[i].value === '(') state = { type: 'inputList', bracket: ')', value: [], start: fragments[i].start, layer: fragments[i].layer }
      else {
        if (fragments[i].type === 'bracket') return { error: true, content: 'Unexpected <braket>', line, start: fragments[i].start }

        fragments2.push(fragments[i])
      }
    } else {
      if (fragments[i].type === 'bracket' && fragments[i].value === state.bracket && fragments[i].layer === state.layer) {
        let symbol = (state.type === 'list' || state.type === 'inputList') ? ',' : '>'

        for (let i2 = 1; i2 < state.value.length; i2++) {
          if ((state.value[i2].type === 'operator' && state.value[i2].value === symbol && state.value[i2].layer === state.layer+1) && (state.value[i2-1].type !== undefined && state.value[i2-1].type === 'operator' && state.value[i2-1].value === symbol && state.value[i2-1].layer === state.layer+1)) return { error: true, content: `Unexpected "${symbol}"`, line, start: state.value[i2].start }
        }

        if (state.value.length > 0) {
          if (state.value[state.value.length-1].type === 'operator' && state.value[state.value.length-1].value === symbol && state.value[state.value.length-1].layer === state.layer+1) return { error: true, content: `Unexpected "${symbol}"`, line, start: state.value[state.value.length-1].start }

          let items = splitArray(state.value, (item) => item.type === 'operator' && item.value === symbol && item.layer === state.layer+1)

          for (let i2 = 0; i2 < items.length; i2++) {
            let data = parseList(items[i2], line)
            if (data.error) return data

            items[i2] = data.fragments
          }

          fragments2.push({ type: state.type, value: items, line, start: state.start, end: i })
        } else fragments2.push({ type: state.type, value: [], line, start: state.start, end: i })

        state = {}
      } else state.value.push(fragments[i])
    }
  }

  if (state.type !== undefined) return { error: true, content: `<${state.type}> Cannot Be Closed`, line, start: state.start }

  return { error: false, fragments: fragments2 }
}

import splitArray from '../Tools/SplitArray.js'
