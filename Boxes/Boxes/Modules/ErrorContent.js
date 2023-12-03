import wcwidth from 'wcwidth'

//Error Content
export default class {
  //Get Content
  static getContent (type, errors, code) {
    let lines = [`[${type} Error${(errors.length > 1) ? 's' : ''}] (${errors.length}):`]

    errors.forEach((item) => {
      lines.push(`| ${item.content} (Line: ${item.line})`)
      lines = lines.concat(getPosition(code, item.line, item.start))
    })

    return lines.join('\n')
  }
}

//Get Position
function getPosition (code, line, start) {
  if (start === undefined) return []

  let lines = code.split('\n')
  let string = lines[line-1]

  return [`| | ${string}`, `| ${' '.repeat(wcwidth(`| ${string.substring(0, start)}`))}^`]
}
