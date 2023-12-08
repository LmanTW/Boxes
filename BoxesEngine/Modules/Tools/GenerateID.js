// Generate id
export default (length, keys) => {
  if (keys.length === undefined) keys = []

  let string = generateAnID(length)

  while (keys.includes(string)) string = generateAnID(length)

  return string
}

// Generate an id
function generateAnID (length) {
  let string = ''

  for (let i = 0; i < length; i++) string+=letters[getRandom(0, letters.length-1)]

  return string
}

import getRandom from './GetRandom.js'

const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
