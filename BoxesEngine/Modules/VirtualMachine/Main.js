// API
export default class {
  #environment = {}
  #options

  #state = 'idle'
  #TaskManager = new TaskManager()
  #ChunkManager = new ChunkManager(this.#TaskManager)

  #executeData = {}
  #interval
  #resolve

  #boxes

  constructor (environment, options) {
    environment = mergeObject(getDefaultEnvironment(), environment)

    Object.keys(environment).forEach((item) => {
      if (['Result', 'Input'].includes(item)) throw new Error(`Box Name "${item}" Is Reserved`)

      this.#environment[item] = convertJsData(environment[item])
    })


    this.#options = mergeObject({
      chunkPerExecution: 100,
      executionInterval: 0,

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

        this.#executeData = {
          operations,
          currentOperation: 0,
          globalChunk: this.#ChunkManager.addChunk(undefined, { name: '<global>' }, {}, operations[0].source, false),
          result: { type: 'empty', value: 'Empty' }
        }

        this.#interval = setInterval(() => this.#tick(), this.#options.executionInterval)
        this.#resolve = resolve
      })
    } else if (this.#state === 'paused') this.#interval = setInterval(() => this.#tick(), this.#options.executionInterval)
    else throw new Error(`Cannot Start Virtual Machine (State: ${this.#state})`)
  }

  // Pause the virtual machine
  pause () {
    if (this.#state === 'running') {
      this.#state = 'paused'

      clearInterval(this.#interval)
    } else throw new Error(`Cannot Pause Virtual Machine (State: ${this.#state})`)
  }

  // Run ActionList
  async runActionList (actionList, input) {
    if (this.#state === 'running') {
      return new Promise((resolve) => {
        this.#ChunkManager.addChunk(undefined, undefined, { input: convertJsData(input) }, actionList, false, (result) => resolve(convertBoxesData(this, result)))
      })
    } else throw new Error(`Cannot Run Action List (State: ${this.#state})`)
  }

  // Tick
  #tick () {
    for (let i = 0; i < this.#options.chunkPerExecution; i++) {
      if (this.#TaskManager.tasks.length > 0) {
        let chunk = this.#ChunkManager.chunks[this.#TaskManager.nextTask()]

        if (chunk === undefined) chunk = this.#ChunkManager.chunks[this.#TaskManager.nextTask()]

        if (chunk.state === 'running') {
          let data = executeChunk(this, this.#ChunkManager, chunk, this.#boxes, this.#environment)
          if (data.error) {
            this.#state = 'idle'

            clearInterval(this.#interval)

            this.#resolve(data)

            break
          }

          this.#executeData.result = chunk.result
        }

        if (this.#ChunkManager.chunks[this.#executeData.globalChunk] === undefined && this.#executeData.currentOperation < this.#executeData.operations.length-1) {
          let data = getTarget(this.#executeData.operations[this.#executeData.currentOperation].target, this.#boxes, mergeObject(this.#environment, { Result: chunk.result, Input: chunk.input }), this.#executeData.operations[this.#executeData.currentOperation].line)
          if (data.error) {
            this.#state = 'idle'

            clearInterval(this.#interval)

            this.#resolve(data)

            break
          }

          setTarget(data.name, data.path, chunk.result, this.#boxes)

          this.#executeData.currentOperation++

          this.#executeData.globalChunk = this.#ChunkManager.addChunk(undefined, { name: '<global>' }, {}, this.#executeData.operations[this.#executeData.currentOperation].source, false)
        }
      } else {
        if (!this.#options.keepRunning) {
          this.#state = 'idle'

          clearInterval(this.#interval)

          this.#resolve(this.#executeData.result)

          break
        }
      }
    }
  }
}

import convertBoxesData from '../Tools/ConvertBoxesData.js'
import convertJsData from '../Tools/ConvertJsData.js'
import mergeObject from '../Tools/MergeObject.js'

import getDefaultEnvironment from './DefaultEnvironment.js'
import ChunkManager from './ChunkManager.js'
import executeChunk from './ExecuteChunk.js'
import TaskManager from './TaskManager.js'
import getTarget from './GetTarget.js'
import setTarget from './SetTarget.js'
