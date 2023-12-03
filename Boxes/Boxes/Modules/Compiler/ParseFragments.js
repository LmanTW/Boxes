//Parse Fragments
export default (string, line) => {
  let fragments = []

  let layer = 0

  let state = {}
  for (let i = 0; i < string.length; i++) {
    if (string[i] === ' ') {
      if (state.type !== undefined && state.type !== 'string') {
        fragments.push({ type: state.type, value: state.value, line, start: state.start, end: i })

        state = {}
      }
    } else if (string[i] === '#') {
      if (state.type !== 'string') i = string.length-1
    } else if (string[i] === '[' || string[i] === '{' || string[i] === '(') {
      if (state.type !== 'string') {
        if (state.type !== undefined) {
          fragments.push({ type: state.type, value: state.value, line, start: state.start, end: i })

          state = {}
        }

        fragments.push({ type: 'bracket', value: string[i], line, start: i, end: i, layer })

        layer++
      }
    } else if (string[i] === ']' || string[i] === '}' || string[i] === ')') {
      if (state.type !== 'string') {
        if (state.type !== undefined) {
          fragments.push({ type: state.type, value: state.value, line, start: state.start, end: i })

          state = {}
        }

        layer--

        fragments.push({ type: 'bracket', value: string[i], line, start: i, end: i, layer })
      }
    } else if (state.type === undefined) {
      if (string[i] === `'` || string[i] === `"`) state = { type: 'string', bracket: string[i], value: '', start: i }
      else if ('1234567890'.includes(string[i])) state = { type: 'number', value: string[i], start: i }
      else if (string.substring(i, i+3) === 'Yes') {
        fragments.push({ type: 'boolean', value: 'Yes', line, start: i, end: i+2 })

        i+=2
      } else if (string.substring(i, i+2) === 'No') {
        fragments.push({ type: 'boolean', value: 'no', line, start: i, end: i+1 })

        i++
      } else if (string.substring(i, i+5) === 'Empty') {
        fragments.push({ type: 'empty', valie: 'Empty', line, start: i, end: i+4 })

        i+=4
      } else if (operators.includes(string.substring(i, i+2))) {
        fragments.push({ type: 'operator', value: string.substring(i, i+2), line, start: i, end: i+1})
        
        i++
      } else if (operators.includes(string[i])) fragments.push({ type: 'operator', value: string[i], line, start: i, layer })
      else state = { type: 'name', value: string[i], start: i }
    } else {
      if (state.type === 'string') {
        if (string[i] === state.bracket) {
          fragments.push({ type: 'string', value: state.value, line, start: state.start, end: i })
          
          state = {}
        } else state.value+=string[i]
      } else if (state.type === 'number') {
        if (!'1234567890.'.includes(string[i])) {
          fragments.push({ type: 'number', value: state.value, line, start: state.start, end: i-1 })

          state = {}

          i--
        } else {
          if (string[i] === '.' && state.value[state.value.length-1] === '.') return { error: true, content: 'Unexpected "."', line, start: i }

          state.value+=string[i]
        }
      } else if (state.type === 'name') {
        if ('+-=!<@,'.includes(string[i])) {
          fragments.push({ type: 'name', value: state.value, line, start: state.start, end: i-1 })

          state = {}

          i--
        } else state.value+=string[i]
      }
    }
  }

  if (state.type !== undefined) {
    if (state.type === 'string') return { error: true, content: '<string> Cannot Be Closed', line, start: state.start }
    else fragments.push({ type: state.type, value: state.value, line, start: state.start, end: string.length-1 })
  }

  let fragments2 = []

  for (let i = 0; i < fragments.length; i++) {
    if ((fragments[i].type === 'operator' && fragments[i].value === '-') && (fragments[i+1] !== undefined && fragments[i+1].type === 'number')) {
      fragments2.push({ type: 'number', value: `-${fragments[i+1].value}`, line: fragments[i].line, start: fragments[i].start, end: fragments[i+1].end })

      i++
    } else fragments2.push(fragments[i])
  }

  return { error: false, fragments: fragments2 }
}

const operators = ['+', '-', '=', '!', '<-', '->', '>', '@', ',']
