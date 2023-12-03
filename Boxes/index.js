import fs from 'fs'

import { Actuator } from './Boxes/API.js'

let actuator = new Actuator()
console.log(actuator.run(fs.readFileSync('/Users/lukelin/Desktop/Boxes/test.boxes', 'utf8')))

//console.log(Compiler.compile(fs.readFileSync('/Users/lukelin/Desktop/Boxes/test.boxes', 'utf8')))
