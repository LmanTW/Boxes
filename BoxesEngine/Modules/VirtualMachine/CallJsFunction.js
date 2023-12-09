// Call javascript function
export default (chunk, func, input, async) => {
  if (async) chunk.returnedResult = { type: 'promise', value: '' }
  else {
    chunk.state = 'waiting'

    setTimeout(async () => {
      try {
        let data = await func(...input.map((item) => convertBoxesData(item)))

        chunk.returnedResult = { error: false, data: convertJsData(data) }
      } catch(error) {
        chunk.returnedResult = { error: true, content: error.toString() }
      }

      chunk.state = 'running'
    }, 0)
  }
}

import convertBoxesData from '../Tools/ConvertBoxesData.js'
import convertJsData from '../Tools/ConvertJsData.js'
