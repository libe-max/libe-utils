module.exports = ({tsv = '', keysLinePos = 0, types = {}}) => {
  // tsv is a string containing the raw tsv file
  // keysLinePos is the line number (first is zero) where the keys are in the tsv data is assumed to start right after the keysLinePos
  // types is an object describing to what data type the values shoud be converted :
  //   - 'string' (default)
  //   - 'number'
  //   - 'boolean'
  //   - if the type is a function, return func(value)

  const lines = tsv.split(/\r/)
  const values = lines.map(line => line.split('\t'))
  const data = []
  values.forEach((line, lineNb) => {
    if (lineNb < keysLinePos + 1) return
    const lineObj = {}
    line.forEach((value, valuePos) => {
      const key = values[keysLinePos][valuePos].replace(/\n/igm, '')
      const cleanVal = value.replace(/\n/igm, '')

      // If no type is specified
      if (!types[key]) {
        lineObj[key] = cleanVal

      // If number is expected
      } else if (types[key] === 'number') {
        if (isNaN(
          parseFloat(cleanVal, 10))
        ) throw new Error(`Cannot convert to number: ${cleanVal}`)
        lineObj[key] = parseFloat(cleanVal, 10)

      // If boolean is expected
      } else if (types[key] === 'boolean') {
        if (cleanVal.toLowerCase() === 'false'
          || cleanVal.toLowerCase() === 'non'
          || cleanVal.toLowerCase() === 'no'
          || cleanVal.toLowerCase() === 'n'
          || cleanVal.toLowerCase() === '0'
          || cleanVal.toLowerCase() === '') lineObj[key] = false
        else lineObj[key] = true

      // If a converter function is provided
      } else if (typeof types[key] === 'function') {
        lineObj[key] = types[key](cleanVal)

      // If type is unknown
      } else {
        throw new Error(`Unknown type to convert to: ${types[key]}`)
      }
    })
    data.push(lineObj)
  })
  return data
}
