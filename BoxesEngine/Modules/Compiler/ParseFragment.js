// Parse a line of Boxes code to fragment
export default (string, line) => {
  let fragments = []

  let state = {}
  let layer = 0

  for (let i = 0; i < string.length; i++) {
    if (string[i] === '#') {
      if (state.type !== 'string') {
        if (state.type !== undefined) fragments.push({ type: state.type, value: state.value, line, start: state.start, end: i })

        return { error: false, fragments }
      }
    } else if (string[i] === ' ') {
      if (state.type !== undefined && state.type !== 'string') {
        fragments.push({ type: state.type, value: state.value, line, start: state.start, end: i })

        state = {}
      }
    } else if ('[{('.includes(string[i])) {
      if (state.type !== 'string') {
        if (state.type !== undefined) {
          fragments.push({ type: state.type, value: state.value, line, start: state.start, end: i })

          state = {}
        }

        fragments.push({ type: 'bracket', value: string[i], line, start: i, end: i, layer })

        layer++
      }
    } else if (']})'.includes(string[i])) {
      if (state.type !== 'string') {
        if (state.type !== undefined) {
          fragments.push({ type: state.type, value: state.value, line, start: state.start, end: i })

          state = {}
        }

        layer--

        fragments.push({ type: 'bracket', value: string[i], line, start: i, end: i, layer })
      }
    }else if (state.type === undefined) {
      let start = i

      if (string[i] === `'` || string[i] === `"`) state = { type: 'string', bracket: string[i], value: '', line, start }
      else if ('0123456789'.includes(string[i])) state = { type: 'number', value: string[i], line, start }
      else if (string.substring(i, i+3) === 'Yes' || string.substring(i, i+2) === 'No') {
        let value = (string.substring(i, i+3) === 'Yes') ? 'Yes' : 'No'
 
        fragments.push({ type: 'boolean', value, line, start, end: i+value.length-1 })

        i+=value.length-1
      } else if (string.substring(i, i+5) === 'Empty') {
        fragments.push({ type: 'empty', value: 'Empty', line, start, end: i+4 })

        i+=4
      } else if (string.substring(i, i+4) === 'Fire') {
        fragments.push({ type: 'fire', value: 'Fire', line, start, end: i+3 })

        i+=3
      } else if (operators.includes(string.substring(i, i+2))) {
        fragments.push({ type: 'operator', value: string.substring(i, i+2), line, start, end: i+1 })
 
        i++
      } else if (operators.includes(string[i])) fragments.push({ type: 'operator', value: string[i], line, start, end: i, layer })
      else state = { type: 'name', value: string[i], line, start: i }
    } else {
      if (state.type === 'string') {
        if (string[i] === state.bracket) {
          fragments.push({ type: 'string', value: state.value, line, start: state.start, end: i })

          state = {}
        } else state.value+=string[i]
      } else if (state.type === 'number') {
        if (!'0123456789.'.includes(string[i])) {
          fragments.push({ type: 'number', value: state.value, line, start: state.start, end: i-1 })

          state = {}

          i--  
        } else state.value+=string[i]
      } else if (state.type === 'name') {
        if ('+-*/~@!=><|&?:,'.includes(string[i])) {
          fragments.push({ type: 'name', value: state.value, line, start: state.start, end: i-1 })

          state = {}

          i--
        } else state.value+=string[i]
      }
    }
  }

  if (state.type !== undefined) {
    if (state.type === 'string') return { error: true, content: `<string> Cannot Be Closed`, line, start: state.start }
    else fragments.push({ type: state.type, value: state.value, line, start: state.start, end: string.length-1 })
  }

  let fragments2 = []

  for (let i = 0; i < fragments.length; i++) {
    if ((fragments[i].type === 'operator' && fragments[i].value === '-') && (fragments[i+1] !== undefined && fragments[i+1].type === 'number') && fragments[i-1] === undefined) {

      for (let i2 = 1; i2 < fragments[1].value.length-1; i2++) {
        if (fragments[1].value[i2] === '.' && fragments[1].value[i2-1] === '.') return { error: true, content: 'Unexpected "."', line, start: i2 }
      }

      fragments2.push({ type: 'number', value: `-${fragments[i+1].value}`, line, start: fragments[i].start, end: fragments[i+1].end })      

      i++
    } else {
      if (fragments[i].type === 'number') {
        for (let i2 = 1; i2 < fragments[0].value.length-1; i2++) {
          if (fragments[0].value[i2] === '.' && fragments[0].value[i2-1] === '.') return { error: true, content: 'Unexpected "."', line, start: i2 }
        }

        fragments2.push(fragments[i])
      } else fragments2.push(fragments[i])
    }
  }

  return { error: false, fragments: fragments2 }
}

const operators = ['+', '-', '*', '/', '~', '@', '!', '=', '==', '<', '>', '>=', '<=', '||', '&&', '?', ':', '<-', '->', ',', '|']
