// Get is list equal to each other
export default isListEqual

function isListEqual(data, data2) {
  for (let i = 0; i < data.value.length; i++) {
    if (data.value[i].type === data2.value[i].type ){
      if (data.value[i].type === 'list') {
        if (!isListEqual(data.value[i], data2.value[i])) return false
      } else if (data.value[i].value !== data2.value[i].value) return false
    } else return false
  }

  return true
}
