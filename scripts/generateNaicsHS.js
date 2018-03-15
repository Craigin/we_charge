const fs = require('fs')

let separator = /[\r\n]+/
let text = fs.readFileSync('scripts/imp-code.txt').toString()

let maps = text.split(separator).map(line => line.trim()).filter(line => line).map(line => {
  let hscode = line.substring(0, 10).trim()
  let naics = line.substring(265, 271).trim()
  return {
    hscode,
    naics
  }
})

fs.writeFileSync('src/common/database/naicsHS.json', JSON.stringify(maps, undefined, 2))