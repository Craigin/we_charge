import _ from 'lodash'
import api from 'api'
import {getCurrentWeek, getAfterDay, timeStrFormat} from 'utils/dateFormat'
import Cell from './cell'

const generateFieldId = id => `field_${id}`

const generateColumns = (fields) => {
  let _columns = fields.map(field => {
    return Object.assign(_.pick(field, ['id', 'index']), {
      field: generateFieldId(field.id),
      label: field.name,
      component: Cell
    })
  })
  _columns.unshift({
    field: 'aspect',
    label: '维度',
    index: 999
  })
  _columns.sort((a, b) => b.index - a.index)
  return _columns
}
const getDimensionText = (str) => {
  if (str === 'client') {
    return '客户'
  } else if (str === 'user') {
    return '帐户'
  } else if (str === 'all') {
    return 'PV'
  }
}
const getVirtualCellIds = (str) => {
  return str && str.split('/').map(item => generateFieldId(item))
}
const handleDataByExtract = (cell, data) => {
  // 取不到值 显示为0
  return cell && cell.extract && _.result(data, cell.extract) || 0
}
const handleVirtualCellByExtract = (item, data) => {
  let {
    cell: {
      extract,
      render
    }
  } = item
  let [m, d] = getVirtualCellIds(extract)
  let mValue = data.find(item => item.key === m).data
  let dValue = data.find(item => item.key === d).data
  let res = mValue / dValue
  let value = isNaN(res) ? 0 : res.toFixed(3)
  return render === 'percentage' ? `${value * 1000 / 10}%` : value
}
const generateDataPromise = (param, group) => {
  let payload = group.payload && JSON.parse(group.payload) || {aspects: []}
  let list = payload.aspects.map(item => {
    return {
      aspect: getDimensionText(item),
      type: item
    }
  })
  return Promise.all(list.map(item => {
    let {aspect} = item
    let itemPromise = group.fields.map(field => {
      let cell = field.fieldCells.find(cell => cell.aspect === item.type)
      return Promise.resolve(getQueryPromise(param, cell)).then(data => {
        if (cell) {
          cell.executeSentence = data && data.executeSentence
        }
        return {
          key: generateFieldId(field.id),
          data: handleDataByExtract(cell, data),
          cell
        }
      })
    })
    return Promise.all(itemPromise).then(data => {
      for (let item of data) {
        if (item.cell && item.cell.type && item.cell.type === 'virtual') {
          item.data = handleVirtualCellByExtract(item, data)
        }
      }
      return data
    }).then(data => {
      let row = {
        aspect,
        cells: []
      }
      for (let item of data) {
        row[item.key] = item.data
      }
      row.cells = data
      return row
    })
  }))
}
const getQueryPromise = (param = {}, options = {}) => {
  let {
    type
  } = options
  if (type === 'mysql') {
    return getFieldcellMysqlData(param, options)
  } else if (type === 'sql') {
    return getEagleEyeOlQuery(param, options)
  } else if (type === 'raw') {
    return getEagleEyeRawQuery(param, options)
  }
}

const getEagleEyeRawQuery = (param = {}, options = {}) => {
  let {
    clientType,
    dateRange: [start, end],
    form: {
      idsContent,
      idsPivot
    }
  } = param
  let {
    sentence: row
  } = options
  row = JSON.parse(row)
  if (!row) return 'row is not json'
  if (row.query && row.query.query.bool && row.query.query.bool.filter) {
    let filters = []
    if (idsPivot && idsContent) {
      let insideIdsArray = idsContent.replace(/↵/g, '').split(/[,;]/g).filter(item => item)
      if (insideIdsArray.length) {
        if (idsPivot === 'user_id') {
          filters.push({
            terms: {
              user_id: insideIdsArray
            }
          })
        } else if (idsPivot === 'client_id') {
          filters.push({
            terms: {
              client_id: insideIdsArray
            }
          })
        }
      }
    }
    if (start && end) {
      if (start === end) {
        filters.push({
          term: {
            day: parseInt(start)
          }
        })
      } else {
        filters.push({
          range: {
            day: {
              gte: parseInt(start),
              lt: parseInt(end)
            }
          }
        })
      }
    }
    if (clientType) {
      filters.push({
        term: {
          client_type: clientType
        }
      })
    }
    row.query.query.bool.filter = row.query.query.bool.filter.concat(filters)
  }
  return api.queryEagleEyeRaw(row).then(data => {
    if (data) {
      data.executeSentence = row
    }
    return data
  })
}

const getEagleEyeOlQuery = (param = {}, options = {}) => {
  let {
    clientType,
    dateRange: [start, end],
    form: {
      idsContent,
      idsPivot
    }
  } = param
  let {
    sentence: sql
  } = options
  let sqlWhere = []
  if (idsPivot && idsContent) {
    let insideIds = idsContent.replace(/↵/g, '').split(/[,;]/g).filter(item => item).join()
    if (insideIds) {
      if (idsPivot === 'user_id') {
        sqlWhere.push(`user_id in (${insideIds})`)
      } else if (idsPivot === 'client_id') {
        sqlWhere.push(`client_id in (${insideIds})`)
      }
    }
  }
  if (clientType) {
    sqlWhere.push(`client_type = ${clientType}`)
  }
  if (start && end) {
    if (start === end) {
      sqlWhere.push(`day = ${start}`)
    } else {
      sqlWhere.push(`day >= ${start} and day  < ${end}`)
    }
  }
  if (sqlWhere.length > 0) {
    let _where = ` ${sqlWhere.join(' and ')}`
    if (/where/gi.test(sql)) {
      sql += ` and ${_where}`
    } else {
      sql += ` where ${_where}`
    }
  }
  return api.getEagleEyeOlQuery({sql}).then(data => {
    if (data) {
      data.executeSentence = sql
    }
    return data
  })
}
const getFieldcellMysqlData = (param = {}, options = {}) => {
  let {id} = options
  let {
    clientType,
    dateRange: [start, end],
    form: {
      idsContent = '',
      idsPivot
    }
  } = param
  if (start && end) {
    if (start === end) {
      end = getAfterDay(timeStrFormat(start))
    }
  }
  return api.getFieldcellMysqlData({
    clientType,
    start,
    end,
    id,
    idsContent: idsContent.replace(/↵/g, '').split(/[,;]/g).filter(item => item).join(),
    idsPivot
  })
}
export const generateSchema = data => {
  let row = data.rows[0]
  if (!row) {
    return {}
  }
  let schema = {
    sections: []
  }
  schema.sections = row.groups.map(group => {
    return {
      ..._.pick(group, ['id', 'name', 'index']),
      key: `report_${group.report_id}_${group.id}`,
      pagination: false,
      columns: generateColumns(group.fields),
      data (param) {
        return generateDataPromise(param, group)
      }
    }
  })
  return schema
}

export let param = {
  type: '',
  clientId: '',
  userId: '',
  clientType: '',
  dateRange: getCurrentWeek()
}
