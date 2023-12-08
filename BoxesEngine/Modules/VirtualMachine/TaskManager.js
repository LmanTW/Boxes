// Task manager
export default class {
  #tasks = []
  #currentTask = 0

  get tasks () {return this.#tasks}

  // Clear all the tasks
  clear () {
    this.#tasks = []
    this.#currentTask = 0
  }

  // Add task
  addTask (id) {
    this.#tasks.push(id)
  }

  // Remove task
  removeTask (id) {
    while (this.#tasks.includes(id)) this.#tasks.splice(this.#tasks.indexOf(id), 1)
  }

  // Next
  nextTask () {
    let task = this.#tasks[this.#currentTask]

    this.#currentTask++
    
    if (this.#currentTask >= this.#tasks.length) this.#currentTask = 0

    return task
  }
}
