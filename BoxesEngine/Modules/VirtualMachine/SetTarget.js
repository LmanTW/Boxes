// Set target
export default (name, path, data, boxes) => {
  if (path.length > 0) {
    let target = boxes[name].data

    for (let i = 0; i < path.length-1; i++) target = target.value[path[i]]
 
    if (data.type === 'fire') target.value.splice(path[path.length-1], 1)
    else target.value[path[path.length-1]] = data
  } else {
    if (data.type === 'fire') delete boxes[name]
    else boxes[name].data = data
  }
}
