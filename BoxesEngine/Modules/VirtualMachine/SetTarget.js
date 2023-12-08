// Set target
export default (name, path, data, boxes) => {
  if (path.length > 0) {
    let target = boxes[name].data

    for (let i = 0; i < path.length-1; i++) target = target.value[path[i]]
 
    target.value[path[path.length-1]] = data
  } else {
    boxes[name].data = data
  }
}
