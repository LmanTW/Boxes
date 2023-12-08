// Get target
export default (target, boxes, environment) => {
  let property = []

  let skip = 0

  if (target[0].type === 'operator' && target[0].value === '+') {
    property.push('create')

    if (target[1].type === 'operator' && target[1].value === '@') {
      property.push('lock')

      skip+=2
    } else skip++
  }

  if (target[skip] === undefined) return { error: true, content: `Expecting A <name>`, line: target.line, start: 0 }
  if (target[skip].type !== 'name') return { error: true, content: `Unexpect <${target[skip].type}>`, line: target[skip].line, start: target[skip].start }

  let name = target[skip].value
  let path = []

  if (property.includes('create')) {
    if (target[skip+1] !== undefined) return { error: true, content: `Unexpect <${target[skip+1].type}>`, line: target[skip+1].line, start: target[skip+1].start }
    if (environment[name] !== undefined) return { error: true, content: `Box Named "${name}" Already Exist (Environment Box)`, line: target[skip].line, start: target[skip].start }
    if (boxes[name] !== undefined) return { error: true, content: `Box Names "${name}" Already Exist`, line: target[skip].line, start: target[skip].start }

    boxes[name] = { lock: property.includes('lock'), data: { type: 'empty', value: 'Empty' }}
  } else {
    if (target[skip+1] !== undefined && target[skip+1].type !== 'inputList') return { error: true, content: `Unexpected <${target[skip+1].typ}>`, line: target[skip+1].line, start: target[skip+1].start }
    if (environment[name] !== undefined) return { error: true, content: `Box Is Locked: "${name}" (Environment Box)`, line: target[skip].line, start: target[skip].start }
    if (boxes[name] === undefined) return { error: `Box Not Found: "${name}"` }

    if (target[skip+1] !== undefined && target[skip+1].type === 'inputList') {
      if (boxes[name].data.type !== 'list') return { error: `Cannot Perform "Read" Operation On <${boxes[name].data.type}>` }

      skip++

      let data = boxes[name].data

      function checkInputList (inputList) {
        if (data === undefined || data.type !== 'list') return { error: true, content: `Cannot Perform "read" Operation On <${(data === undefined) ? 'empty' : data.type}>`, line: target[skip].line, start: target[skip].start }

        if (inputList.value.length < 1) return { error: true, content: `Expecting A <number>`, line: target[skip].line, start: target[skip].start+1 }
        if (inputList.value.length > 1) return { error: true, content: `Unexpected <${inputList.value[1][0].type}>`, line: target[skip].value[1][0].line, start: inputList.value[1][0].start }
        for (let item of inputList.value) {
          if (item[0].type !== 'number' && item[0].type !== 'name' && item[0].type !== 'list') return { error: true, content: `Unexpected <${item[0].type}>`, line: item[0].line, start: item[0].start }
          if (item.length > 1) return { error: true, content: `Unexpected <${item[1].type}>`, line: item[1].line, start: item[1].start }
        }

        if (inputList.value[0][0].type === 'number') {
          path.push(inputList.value[0][0].value)
          data = data.value[inputList.value[0][0].value]
        } else if (inputList.value[0][0].type === 'name') {
          if (boxes[inputList.value[0][0].value] === undefined && environment[inputList.value[0][0].value] === undefined) return { error: true, content: `Box Not Found: "${inputList.value[0][0].value}"`, line: inputList.value[0][0].line, start: inputList.value[0][0].start }

          let value = (boxes[inputList.value[0][0].value] === undefined) ? environment[inputList.value[0][0].value].data : boxes[inputList.value[0][0].value].data

          return checkInputList({ type: 'inputList', value: [[value]] })
        } else {
          for (let item of inputList.value[0][0].value) {
            if (data.type !== 'list') return { error: `Cannot Perform "read" Operation On <${data.type}>` }

            if (Array.isArray(item)) {
              if (item[0].type !== 'number') return { error: true, content: `Unexpected <${item[0].type}>`, line: item[0].line, start: item[0].start }
              if (item.length > 1) return { error: true, content: `Unexpected <${item[1].type}>`, line: item[1].line, start: item[1].start }

              path.push(item[0].value)
              data = data.value[item[0].value]
            } else {
              if (item.type !== 'number') return { error: true, content: `Unexpected <${item.type}>`, line: item.line, start: item.start }
  
              path.push(item.value)
              data = data.value[item.value]
            }
          }
        }

        return { error: false }
      }

      while (target[skip] !== undefined && target[skip].type === 'inputList') {
        let data = checkInputList(target[skip])
        if (data.error) return data        
   
        skip++
      }
    }
  }


  return { error: false, name, path }
}
