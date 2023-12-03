//Actuator
export default class {
  #vm

  constructor () {

  }

  //Run
  run (code) {
    let data = Compiler.compile(code)

    if (data.error) console.log(ErrorContent.getContent('Compiler', data.errors, code))
    else {
      this.#vm = new VirtualMachine()

      data = this.#vm.run(data.operations)

      if (data.error) console.log(ErrorContent.getContent('Runtime', data.errors, code)) 
      return data.result
    }
  }
}

import VirtualMachine from './VirtualMachine/Main.js'
import ErrorContent from './ErrorContent.js'
import Compiler from './Compiler/Main.js'
