module.exports = {
  parseTsv,
  parseTsvWithTabs
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * PARSE A TSV WITH THE "TAB" TRICK (exposed)
 * (Gathering all tabs into one tab and specify the
 * columns corresponding to each tab)
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function parseTsvWithTabs (params = {}) {
  /*
  This function is used in order to circumvent a Google Spreadsheets bug.

  When publishing a TSV from a spreadsheet with the option "whole document"
  enabled, only one tab is published. The idea is to gather all tabs data into
  one tab called _output, and tell the parseTsvWithTabs function which column corresponds to
  which tab.

  params = {
    tsv: 'The tsv data, as a string',
    tabsParams: [{
      start: 'Number (inclusive) of the first column of the tab
        (first col of the TSV is 0)',
      end: 'Number (inclusive) of the last column of the tab',
      keysLinePos: 'Number of the line in the TSV where can be found the column
        name (first line is 0, data is assumed to start right after this line)',
      types: 'Object litteral describing which data type is expected for each field
        (see below)'
    }]
  }

  Possible types for data description:
    - 'string' (default)
    - 'number'
    - 'boolean'
    - if the type is a function, return func(value)
  */

  const tsv = params.tsv || ''
  const tabsParams = params.tabsParams || []

  // Split the TSV string into a 2 dimentional array, lines first, then values
  // then "rotate" the table in order to get a 2 dim array with cols first
  const linesStr = tsv.split('\r')
  const table = linesStr.map(line => line.split('\t'))
  const rotatedTable = rotateTable(table)

  // Get n 2 dim arrays, with n being the nb of tabs specified
  const rotatedTabs = tabsParams.map(tabParam => {
    const loBound = tabParam.start || 0
    const hiBound = tabParam.end || 0
    const rotatedTab = rotatedTable.filter((columnn, col) => col >= loBound && col <= hiBound)
    return rotatedTab
  })

  // Rotate back each tab, and filter the empty lines
  const filteredTabs = rotatedTabs.map(rotatedTab => {
    const tab = rotateTable(rotatedTab)
    const filteredTab = tab.filter(line => line.join('').trim() !== '')
    return filteredTab
  })

  // Reduce each tab to a TSV again, and return an array with n TSV strings,
  // n being the number of tabs specified
  const tsvTabs = filteredTabs.map(tab => {
    return tab.map(line => {
      return line.join('\t')
    }).join('\r')
  })

  // Parse each tab with the corresponding specified params
  const parsedTsvTabs = tsvTabs.map((tab, i) => parseTsv({
    tsv: tab,
    tabParams: tabsParams[i]
  }))

  return parsedTsvTabs
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  PARSE A TSV STRING (exposed)
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function parseTsv (params = {}) {
  const tsv = params.tsv || ''
  const tabParams = params.tabParams || {}
  const keysLinePos = tabParams.keysLinePos || 0
  const types = tabParams.types || {}

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
        if (cleanVal.toLowerCase() === 'false' ||
          cleanVal.toLowerCase() === 'non' ||
          cleanVal.toLowerCase() === 'no' ||
          cleanVal.toLowerCase() === 'n' ||
          cleanVal.toLowerCase() === '0' ||
          cleanVal.toLowerCase() === '') lineObj[key] = false
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

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *  ROTATE TABLE (not exposed)
 *
 *  Transforms an array representation of a table
 *  from tableArray[row_nb][col_nb]
 *  to tableArray[col_nb][row_nb]
 *  And vice versa
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function rotateTable (table) {
  const rotated = []
  table.forEach((line, row) => {
    line.forEach((value, col) => {
      if (!rotated[col]) rotated[col] = []
      if (!rotated[col][row]) rotated[col][row] = value.trim()
    })
  })
  return rotated
}
