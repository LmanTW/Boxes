//Virtual Machine
export default class {
  #state = 'idle'
  #boxes

  #data
  
  constructor () {
    
  }

  get state () {return this.#state}

  //Run
  run (operations) {
    if (this.#state === 'idle') {
      this.#data = {}

      console.log(operations)

      for (let i = 0; i < operations.length; i++) {
        let data = this.#execute(operations[i])

        if (data.error) return { error: true, errors: [{ content: data.content, line: data.line, start: data.start }] }
      }

      return { error: false }
    } else throw new Error(`Cannot Run Virtual Machine (State: ${this.#state})`)
  }

  //Execute
  #execute (operation) {
    let target, source

    if (operation.target[0].type === 'operator' && operation.target[0].value === '+') {
      let skip = 0

      let lock = false

      if (operation.target[1].type === 'operator' && operation.target[1].value === '@') {
        skip = 1

        lock = true
      }

      if (operation.target[skip+1] === undefined) return { error: true, content: 'Expecting A <name>', line: operation.target[skip].line, start: operation.target[skip].end }
      if (operation.target[skip+1].type !== 'name') return { error: true, content: `Unexpected <${operation.target[skip+1].type}>`, line: operation.target[skip+1].line, start: operation.target[skip+1].start }
      if (operation.target[skip+2] !== undefined) return { error: true, content: `Unexpected <${operation.target[skip+2].type}>`, line: operation.target[skip+2].line, start: operation.target[skip+2].start}

      if (['This', 'Input'].includes(operation.target[skip+1].value)) return { error: true, content: `"${operation.target[skip+1].value}" Is Reserved`, line: operation.target[skip+1].line, start: operation.target[skip+1].start }
      if (this.#data[operation.target[skip+1].value] !== undefined) return { error: true, content: `Box Named "${operation.target[1].value}" Already Exist`, line: operation.target[skip+1].line, start: operation.target[skip+1].start }

      this.#data[operation.target[skip+1].value] = { lock, data: { type: 'empty', value: 'Empty' }}

      target = operation.target[skip+1].value
    } else if (operation.target[0].type === 'name') {
      if (operation.target[1] !== undefined) return { error: true, content: `Unexpected <${operation.target[1].type}>`, line: operation.target[1].line, start: operation.target[1].start }

      if (this.#data[operation.target[0].value] === undefined) return { error: true, content: `Box Not Found: "${operation.target[0].value}"`, line: operation.target[0].line, start: operation.target[0].start }
      if (this.#data[operation.target[0].value].lock) return { error: true, content: `The Box Is Locked: "${operation.target[0].value}"`, line: operation.target[0].line, start: operation.target[0].start }

      target = operation.target[0].value
    } else return { error: true, content: `Unexpected <${operation.target[0].type}>`, line: operation.target[0].line, start: operation.target[0].start }
    
    let actions = splitSource(operation.source, 'operator', '>')

    console.log(actions)

    return { error: false }
  }
}

//Split Source
function splitSource (source, type, value) {
  let chunks = [[]]

  source.forEach((item) => {
    if (item.type === type && item.value === value) chunks.push([])
    else chunks[chunks.length-1].push(item)
  })

  return chunks
}
