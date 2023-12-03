export default convertBoxesType

//Convert Boxes Type
function convertBoxesType (data) {
  if (data.type === 'string') return data.value
  if (data.type === 'number') return +data.value
  if (data.type === 'boolean') return (data.value === 'Yes')
  if (data.type === 'empty') return undefined
  if (data.type === 'array') return data.value.map((item) => convertBoxesType(item))

  throw new Error(`Cannot Convert Boxes Type: <${data.type}>`)
}
