//Get Target
export default (operation, data) => {
  if (operation.target[0] === undefined) return { error: true, content: 'Missing Target', line: operation.line }
  else if (operation.target[0].type === 'operator' && operation.target[0].value === '+') {
    let skip = 0

    let lock = false

    if (operation.target[1].type === 'operator' && operation.target[1].value === '@') {
      skip = 1

      lock = true
    }

    if (operation.target[skip+1] === undefined) return { error: true, content: 'Expecting A <name>', line: operation.target[skip].line, start: operation.target[skip].end }
    if (operation.target[skip+1].type !== 'name') return { error: true, content: `Unexpected <${operation.target[skip+1].type}>`, line: operation.target[skip+1].line, start: operation.target[skip+1].start }
    if (operation.target[skip+2] !== undefined) return { error: true, content: `Unexpected <${operation.target[skip+2].type}>`, line: operation.target[skip+2].line, start: operation.target[skip+2].start}

    if (['Result', 'Input'].includes(operation.target[skip+1].value)) return { error: true, content: `"${operation.target[skip+1].value}" Is Reserved`, line: operation.target[skip+1].line, start: operation.target[skip+1].start }
    if (data[operation.target[skip+1].value] !== undefined) return { error: true, content: `Box Named "${operation.target[1].value}" Already Exist`, line: operation.target[skip+1].line, start: operation.target[skip+1].start }

    return { error: false, target: operation.target[skip+1].value, lock }
  } else if (operation.target[0].type === 'name') {
    if (operation.target[1] !== undefined) return { error: true, content: `Unexpected <${operation.target[1].type}>`, line: operation.target[1].line, start: operation.target[1].start }

    if (data[operation.target[0].value] === undefined) return { error: true, content: `Box Not Found: "${operation.target[0].value}"`, line: operation.target[0].line, start: operation.target[0].start }
    if (data[operation.target[0].value].lock) return { error: true, content: `The Box Is Locked: "${operation.target[0].value}"`, line: operation.target[0].line, start: operation.target[0].start }

    return { error: false, target: operation.target[0].value, lock }
  } else return { error: true, content: `Unexpected <${operation.target[0].type}>`, line: operation.target[0].line, start: operation.target[0].start }
}
