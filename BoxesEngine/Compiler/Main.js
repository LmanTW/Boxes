//Compiler
export default class {
  //Compile
  static compile (code) {
    let lines = code.split('\n')

    let errors = []
    let operations = []

    lines.forEach((string, index) => {
      if (string === '') return

      let data = parseFragments(string, index+1)
      if (data.error) return errors.push({ content: data.content, line: data.line, start: data.start })

      if (data.fragments.length < 1) return
  
      data = parseList(data.fragments, index+1)
      if (data.error) return errors.push({ content: data.content, line: data.line, start: data.start })

      for (let item of data.fragments) {
        if (item.type === 'bracket') return errors.push({ content: 'Unexpected <bracket>', line: data.line, start: item.start })
      }

      if (!data.error) {
        let directions = arrayIncludeAmount(data.fragments, (item) => item.type === 'operator' && item.value === '->')+arrayIncludeAmount(data.fragments, (item) => item.type === 'operator' && item.value === '<-')
        
        if (directions < 1) errors.push({ content: 'Cannot Found Any Direction', line: index, start: undefined })
        else if (directions > 1) errors.push({ content: 'Too Many Directions', line: index, start: undefined })
        else {
          if (arrayIncludeAmount(data.fragments, (item) => item.type === 'operator' && item.value === '->') > 0) {
            let chunks = splitArray(data.fragments, (item) => item.type === 'operator' && item.value === '->')

            operations.push({ source: chunks[0], target: chunks[1], line: index+1 }) 
          } else if (arrayIncludeAmount(data.fragments, (item) => item.type === 'operator' && item.value === '<-') > 0) {
            let chunks = splitArray(data.fragments, (item) => item.type === 'operator' && item.value === '<-')

            operations.push({ source: chunks[1], target: chunks[0], line: index+1 })
          }
        }
      }
    })

    return { error: errors.length > 0, errors, operations }
  }
}

import arrayIncludeAmount from '../Tools/ArrayIncludeAmount.js'
import splitArray from '../Tools/SplitArray.js'

import parseFragments from './ParseFragments.js'
import parseList from './ParseList.js'

const operators = ['+', '-', '*', '/', '=', '!', '<-', '->', '>', '@', ',']
