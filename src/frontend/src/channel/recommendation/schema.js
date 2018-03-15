import _ from 'lodash'
import api from 'api'
import {getCurrentWeek} from 'utils/dateFormat'

let calcPercentage = (numerator, denominator) => {
  if (!numerator) {
    return '0'
  }
  let percent = denominator ? `${(numerator / denominator * 100).toFixed(2)}%` : 'NA'
  return `${numerator} (${percent})`
}

export const schema = {
  name: '推荐指标',
  sections: [
    {
      key: 'recommendationFilter',
      name: '推荐转化漏斗',
      pagination: false,
      data (param) {
        let queries = {
          total: queryEagleEyeRaw(param, {
            table: 'dx.recommendation.get',
            where: {
              type: 'refresh'
            }
          }),
          view: queryEagleEyeRaw(param, {
            table: 'dx.company.view',
            where: {
              'referrer.keyword': ':recommendation'
            }
          }),
          follow: queryEagleEyeRaw(param, {
            table: 'dx.company.follow',
            where: {
              type: 'follow',
              'context.keyword': ':recommendation'
            }
          }),
          view_follow: queryEagleEyeRaw(param, {
            table: 'dx.company.follow',
            where: {
              type: 'follow',
              'context.keyword': ':company',
              'referrer.keyword': ':recommendation'
            }
          }),
          view_buy: queryEagleEyeRaw(param, {
            table: 'dx.company.buy',
            where: {
              'referrer': ':recommendation'
            }
          })
        }
        return Promise.all(_.map(queries, (query, key) => {
          return query.then(data => {
            return {
              key,
              data
            }
          }).catch(err => {
            console.error('getEagleEyeOlQuery error', err)
            return {
              key,
              data: undefined
            }
          })
        })).then(data => {
          let row = {}
          data.forEach(item => {
            row[item.key] = item.data
          })
          return [row]
        })
      },
      columns: [
        {
          field: 'total',
          label: '全部'
        },
        {
          field: 'view',
          label: '详情',
          text (value, row) {
            return calcPercentage(value, row.total)
          }
        },
        {
          field: 'follow',
          label: '关注',
          text (value, row) {
            return calcPercentage(value, row.total)
          }
        },
        {
          field: 'view_follow',
          label: '详情&关注',
          text (value, row) {
            return calcPercentage(value, row.total)
          }
        },
        {
          field: 'view_buy',
          label: '详情&购买',
          text (value, row) {
            return calcPercentage(value, row.total)
          }
        }
      ]
    },
    {
      key: 'recommendationHit',
      name: '推荐命中率',
      pagination: false,
      data (param) {
        let tables = [
          {
            title: '查看',
            table: 'dx.company.view'
          },
          {
            title: '关注',
            table: 'dx.company.follow'
          },
          {
            title: '购买',
            table: 'dx.company.buy'
          }
        ]
        return Promise.all(_.map(tables, item => {
          let {title, table} = item
          let queries = {
            total: queryEagleEyeRaw(param, {
              table
            }),
            rank: queryEagleEyeRaw(param, {
              table,
              where: {
                rec_exist: 1
              }
            }),
            rank300: queryEagleEyeRaw(param, {
              table,
              where: [
                {
                  term: {
                    rec_exist: 1
                  }
                },
                {
                  range: {
                    rec_rank: {
                      lte: 300
                    }
                  }
                }
              ]
            }),
            rank100: queryEagleEyeRaw(param, {
              table,
              where: [
                {
                  term: {
                    rec_exist: 1
                  }
                },
                {
                  range: {
                    rec_rank: {
                      lte: 100
                    }
                  }
                }
              ]
            })
          }

          return Promise.all(_.map(queries, (query, key) => {
            return query.then(data => {
              return {
                key,
                data
              }
            }).catch(err => {
              console.error('getEagleEyeOlQuery error', err)
              return {
                key,
                data: undefined
              }
            })
          })).then(data => {
            let row = {}
            data.forEach(item => {
              row[item.key] = item.data
            })
            row.title = title
            return row
          })
        }))
      },
      columns: [
        {
          field: 'title',
          label: '-'
        },
        {
          field: 'total',
          label: '总数'
        },
        {
          field: 'rank',
          label: 'RANK',
          text (value, row) {
            return calcPercentage(value, row.total)
          }
        },
        {
          field: 'rank300',
          label: 'RANK-300',
          text (value, row) {
            return calcPercentage(value, row.total)
          }
        },
        {
          field: 'rank100',
          label: 'RANK-100',
          text (value, row) {
            return calcPercentage(value, row.total)
          }
        }
      ]
    }
  ]
}

export let param = {
  type: '',
  clientId: '',
  userId: '',
  clientType: '',
  dateRange: getCurrentWeek()
}

export let queryEagleEyeRaw = (param = {}, options = {}) => {
  let {
    // type,
    clientId,
    userId,
    clientType,
    dateRange: [start, end]
  } = param
  let {
    table,
    where
  } = options

  let filters = []
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
  if (clientId) {
    filters.push({
      term: {
        client_id: clientId
      }
    })
  }
  if (userId) {
    filters.push({
      term: {
        user_id: userId
      }
    })
  }
  if (clientType) {
    filters.push({
      term: {
        client_type: clientType
      }
    })
  }
  if (Array.isArray(where)) {
    filters = filters.concat(where)
  } else {
    for (let key in where) {
      let val = where[key]
      filters.push({
        term: {
          [key]: val
        }
      })
    }
  }

  let query = {
    query: {
      bool: {
        filter: filters
      }
    },
    aggs: {
      multi_field_cardinality: {
        cardinality: {
          script: {
            lang: 'painless',
            inline: `doc['user_id'].value + '#' + doc['company'].value`
          }
        }
      }
    },
    size: 10
  }

  return api.queryEagleEyeRaw({
    table,
    query
  }).then(data => data.aggregations.multi_field_cardinality.value)
}
