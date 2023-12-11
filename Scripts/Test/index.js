import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs'

import { Compiler, VirtualMachine } from '../../BoxesEngine/API.js'

(async () => {
  let data = Compiler.compile(fs.readFileSync(`${dirname(fileURLToPath(import.meta.url))}/test.boxes`, 'utf8'))

  if (data.error) console.log(`Compiler Error`, data)
  else {
    let vm = new VirtualMachine()

    console.log(await vm.start(data.operations))
  }
})()
