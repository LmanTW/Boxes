//Virtual Machine
export default class {
  #state = 'idle'
  #boxes
  
  constructor () {
    
  }

  get state () {return this.#state}

  //Run
  run (operations) {
    if (this.#state === 'idle') {
      this.#boxes = {}

      let result

      for (let i = 0; i < operations.length; i++) {
        let data = this.#execute(operations[i])

        if (data.error) return { error: true, errors: [{ content: data.content, line: data.line, start: data.start }] }

        result = data.result
      }

      return { error: false, result }
    } else throw new Error(`Cannot Run Virtual Machine (State: ${this.#state})`)
  }

  //Execute
  #execute (operation) {
    let data = getTarget(operation, this.#boxes)

    if (data.error) return data

    let { target, lock } = data

    if (operation.source[0] === undefined) return { error: true, content: 'Missing Source', line: operation.line }

    let result = { type: 'empty', value: 'Empty' }
    for (let action of splitArray(operation.source, (item) => item.type === 'operator' && item.value === '>')) {
      data = executeAction(action, this.#boxes, { Result: result })

      if (data.error) return data

      result = data.result
    }

    if (this.#boxes[target] === undefined) this.#boxes[target] = { lock, data: result }
    else this.#boxes[target].data = result

    return { error: false, result }
  }
}

import splitArray from '../Tools/SplitArray.js'

import executeAction from './ExecuteAction.js'
import getTarget from './GetTarget.js'
