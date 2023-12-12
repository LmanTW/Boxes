// API
export default class {
  // Compile Boxes code
  static compile (code) {
    let operations = []
 
    let lines = code.split('\n')
    for (let i = 0; i < lines.length; i++) {
      let data = parseFragment(lines[i], i+1)
      if (data.error) return data

      if (data.fragments.length > 0) {
        data = parseList(data.fragments, i+1)
        if (data.error) return data

        let directionAmount = data.fragments.filter((item) => item.type === 'operator' && (item.value === '<-' || item.value === '->'))
        if (directionAmount < 1) return { error: true, content: `Cannot Found Any Direction`, line: i+1 }
        if (directionAmount > 1) return { error: true, content: `Too Many Directions`, line: i+1 }

        let symbol = (data.fragments.filter((item) => item.type === 'operator' && item.value === '<-').length > 0) ? '<-' : '->'

        let chunks = splitArray(data.fragments, (item) => item.type === 'operator' && item.value === symbol)

        if (symbol === '<-') operations.push({ target: chunks[0], source: splitArray(chunks[1], (item) => item.type === 'operator' && item.value === '|').filter((item) => item.length > 0), line: i+1 })
        else operations.push({ target: chunks[1], source: splitArray(chunks[0], (item) => item.type === 'operator' && item.value === '|').filter((item) => item.length > 0), line: i+1 })
      }
    }

    return { error: false, operations }
  }

  // Highlight
  static highlight (code) {
    let fragments = []

    code.split('\n').forEach((item, index) => fragments = fragments.concat(highlight(item, index)))

    return fragments
  }
}

import splitArray from '../Tools/SplitArray.js'

import parseFragment from './ParseFragment.js'
import parseList from './ParseList.js'
import highlight from './Highlight.js'
