// API
export default class {
  #environment = {}
  #options

  #state = 'idle'
  #TaskManager = new TaskManager()
  #ChunkManager = new ChunkManager(this.#TaskManager)

  #boxes

  constructor (environment, options) {
    if (environment !== undefined) {
      Object.keys(environment).forEach((item) => {
        if (['Result', 'Input'].includes(item)) throw new Error(`Box Name "${item}" Is Reserved`)

        this.#environment[item] = convertJsData(environment[item])
      })
    }

    this.#options = mergeObject({
      keepRunning: false
    }, options)
  }

  get boxes () {return this.#boxes}

  // Start the virtual machine
  async start (operations) {
    if (this.#state === 'idle') {
      return new Promise((resolve) => {
        this.#state = 'running'

        this.#TaskManager.clear()
        this.#ChunkManager.clear()

        this.#boxes = {}

        let currentOperation = 0
        let globalChunk = this.#ChunkManager.addChunk(undefined, { name: '<global>' }, {}, operations[0].source, false)
        let result = { type: 'empty', value: 'Empty' }

        let interval = setInterval(() => {
          if (this.#TaskManager.tasks.length > 0) {
            let chunk = this.#ChunkManager.chunks[this.#TaskManager.nextTask()]

            if (chunk.state === 'running') {
              let data = executeChunk(this.#ChunkManager, chunk, this.#boxes, this.#environment)
              if (data.error) {
                 clearInterval(interval)

                 return resolve(data)
              }

              result = chunk.result
            }

            if (this.#ChunkManager.chunks[globalChunk] === undefined && currentOperation < operations.length-1) {
              let data = getTarget(operations[currentOperation].target, this.#boxes, mergeObject(this.#environment, { Result: chunk.result, Input: chunk.input }), operations[currentOperation].line)
              if (data.error) return resolve(data)

              setTarget(data.name, data.path, chunk.result, this.#boxes)

              currentOperation++

              globalChunk = this.#ChunkManager.addChunk(undefined, { name: '<global>' }, {}, operations[currentOperation].source, false)
            }
          } else {
            if (!this.#options.keepRunning) {
              clearInterval(interval)

              resolve(result)
            }
          }
        })
      })
    } else throw new Error(`Cannot Start Virtual Machine (State: ${this.#state})`)
  }

  // Tick
  tick () {
    if (this.#state === 'running') {
         
    } else throw new Error(`Virtual Machine Is Not Running (State: ${this.#state})`)
  }
}

import convertJsData from '../Tools/ConvertJsData.js'
import mergeObject from '../Tools/MergeObject.js'

import ChunkManager from './ChunkManager.js'
import executeChunk from './ExecuteChunk.js'
import TaskManager from './TaskManager.js'
import getTarget from './GetTarget.js'
import setTarget from './SetTarget.js'
