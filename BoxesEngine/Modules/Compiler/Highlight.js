// Highlist Boxes code 
export default (line) => {
  let fragments = []

  let state = {}

  if (string[i] === '#') {
    if (state.type !== 'string') {
      if (state.type !== undefined) fragments.push({ type: state.type, line, start: state.start, end: i })

      fragments.push({ type: 'comment', line, start: i, end: line.length-1 })

      return fragments
    }
  } else if (string[i] === ' ') {
    if (state.type !== undefined && state.type !== 'string') {
      fragments.push({ type: state.type, line, start: state.start, end: i })

      state = {}
    }
  } else if ('[{('.includes(string[i])) {
    if (state.type !== 'string') {
      if (state.type !== undefined) {
        fragments.push({ type: state.type, line, start: state.start, end: i })

        state = {}
      }

      fragments.push({ type: 'bracket', line, start: i, end: i, layer })

      layer++
    }
  } else if (']})'.includes(string[i])) {
    if (state.type !== 'string') {
      if (state.type !== undefined) {
        fragments.push({ type: state.type, line, start: state.start, end: i })

        state = {}
      }

      layer--

      fragments.push({ type: 'bracket', line, start: i, end: i, layer })
    }
  } else if (state.type === undefined) {
    let start = i

    if (string[i] === `'` || string[i] === `"`) state = { type: 'string', bracket: string[i], line, start }
    else if ('0123456789'.includes(string[i])) state = { type: 'number', line, start }
    else if (string.substring(i, i+3) === 'Yes' || string.substring(i, i+2) === 'No') {
      let value = (string.substring(i, i+3) === 'Yes') ? 'Yes' : 'No'
 
      fragments.push({ type: 'boolean', line, start, end: i+value.length-1 })

      i+=value.length-1
    } else if (string.substring(i, i+5) === 'Empty') {
      fragments.push({ type: 'empty', line, start, end: i+4 })

      i+=4
    } else if (string.substring(i, i+4) === 'Fire') {
      fragments.push({ type: 'fire', line, start, end: i+3 })

      i+=3
    } else if (operators.includes(string.substring(i, i+2))) {
      fragments.push({ type: 'operator', line, start, end: i+1 })
 
      i++
    } else if (operators.includes(string[i])) fragments.push({ type: 'operator', line, start, end: i, layer })
    else state = { type: 'name', line, start: i }
  } else {
    if (state.type === 'string') {
      if (string[i] === state.bracket) {
        fragments.push({ type: 'string', line, start: state.start, end: i })

        state = {}
      }
    } else if (state.type === 'number') {
      if (!'0123456789.'.includes(string[i])) {
        fragments.push({ type: 'number', line, start: state.start, end: i-1 })

        state = {}

        i--  
      }
    } else if (state.type === 'name') {
      if ('+-*/~@!=><|&?:,'.includes(string[i])) {
        fragments.push({ type: 'name', line, start: state.start, end: i-1 })

        state = {}

        i--
      }
    }
  }

  if (state.type !== undefined && state.type !== 'string') fragments.push({ type: state.type, value: state.value, line, start: state.start, end: string.length-1 })

  let fragments2 = []

  for (let i = 0; i < fragments.length; i++) {
    if ((fragments[i].type === 'operator' && fragments[i].value === '-') && (fragments[i+1] !== undefined && fragments[i+1].type === 'number') && fragments[i-1] === undefined) {

      fragments2.push({ type: 'number', line, start: fragments[i].start, end: fragments[i+1].end })      

      i++
    } else fragments2.push(fragments[i])
  }

  return fragments
}
