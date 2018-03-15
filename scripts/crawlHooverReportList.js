const fs = require('fs')
const axios = require('axios')
const cheerio = require('cheerio')

const HOOVER_COM = 'http://www.hoovers.com/'
const HOOVER_REPORT_LIST_URL = 'http://www.hoovers.com/industry-analysis/industry-directory.html'

const URL_RE = /\.([0-9]+)\.html$/
axios.get(HOOVER_REPORT_LIST_URL).then(response => {
  let $ = cheerio.load(response.data)
  return $('.industry_browse .drawer').toArray().map(ele => {
    ele = $(ele)
    let name = ele.find('.icon-plus-minus-dark').text().trim()

    let children = ele.find('table tbody tr').toArray().map(ele => {
      ele = $(ele)
      let name = ele.find('td').first().text().trim()

      let url = ele.find('td a').attr('href')
      let id
      let m = URL_RE.exec(url)
      if (m) {
        id = m[1]
      }
      url = `${HOOVER_COM}${url.substr(1)}`

      return {
        name,
        id,
        url
      }
    })
    return {
      name,
      children
    }
  })
}).then(groups => {
  let text = JSON.stringify({
    children: groups
  }, undefined, 2)
  fs.writeFileSync('src/common/database/hooverReport.json', text)
})
