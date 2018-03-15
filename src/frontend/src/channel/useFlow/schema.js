import {IP_QUERY_PROVIDER} from 'common'
import {HOSTS} from 'config'
import {fixTimeZoneDay, getCurrentWeek} from 'utils/dateFormat'
// import Name from './name'
import Link from './link'

const numberToIp = (number) => {
  if (number < 0) {
    number = 0xFFFFFFFF + number + 1
  }
  let list = []
  while (number) {
    let digit = number % 256
    list.unshift(digit)
    number = Math.floor(number / 256)
  }
  return list.join('.')
}

const CLIENT_COLUMN = {
  field: 'client_id',
  label: 'client_name',
  component: Link,
  text: 'client_name',
  href (value, row) {
    let where = {client_id: value}
    where = encodeURIComponent(JSON.stringify(where))
    return `${HOSTS.LANTERN}/#/database/v4_admin/tbl_client?where=${where}`
  },
  actions: [
    {
      key: 'editCredit',
      title: '修改点数',
      event: 'editCredit'
    }
  ]
}

const USER_COLUMN = {
  field: 'user_id',
  label: 'user_name',
  component: Link,
  text: 'user_name',
  href (value, row) {
    let where = {user_id: value}
    where = encodeURIComponent(JSON.stringify(where))
    return `${HOSTS.LANTERN}/#/database/v4_admin/tbl_user_info?where=${where}`
  }
}

const COMPANY_COLUMN = {
  field: 'company',
  label: 'company',
  component: Link,
  href (value, row) {
    value = encodeURIComponent(value)
    return `${HOSTS.DISCOVERY}/company/${value}`
  }
}

export const schema = {
  name: '使用报告统计分析',
  sections: [
    {
      key: 'pageStart',
      name: '登录情况 dx.start (页面启动次数)',
      fixSQL: true,
      data () {
      },
      db: 'log_dx.start',
      columns: [
        CLIENT_COLUMN,
        USER_COLUMN,
        {
          field: 'server_ip',
          label: 'server_ip',
          text (value, row) {
            return numberToIp(value)
          },
          component: Link,
          href (value, row) {
            return IP_QUERY_PROVIDER + numberToIp(value)
          }
        },
        {
          field: 'value',
          label: 'value'
        },
        {
          field: 'env',
          label: 'env'
        },
        {
          field: 'build',
          label: 'build'
        },
        {
          field: 'timestamp',
          label: 'timestamp',
          className: 'light-text'
        }
      ]
    },
    {
      key: 'companyResult',
      name: '搜索行为情况 dx.search.company_result',
      fixSQL: true,
      db: 'log_dx.search.company_result',
      columns: [
        CLIENT_COLUMN,
        USER_COLUMN,
        {
          field: 'type',
          label: 'type'
        },
        {
          field: 'query',
          label: 'query'
        },
        {
          field: 'total',
          label: 'total'
        },
        {
          field: 'filters',
          label: 'filters'
        },
        {
          field: 'timestamp',
          label: 'timestamp',
          className: 'light-text'
        }
      ]
    },
    {
      key: 'companyMining',
      name: '使用发掘情况 dx.mining.company.submit',
      fixSQL: true,
      db: 'log_dx.mining.company.submit',
      columns: [
        CLIENT_COLUMN,
        USER_COLUMN,
        {
          field: 'timestamp',
          label: 'timestamp',
          className: 'light-text'
        }
      ]
    },
    {
      key: 'companyView',
      name: '查看公司详情情况 dx.company.view',
      db: 'log_dx.company.view',
      fixSQL: true,
      columns: [
        CLIENT_COLUMN,
        USER_COLUMN,
        COMPANY_COLUMN,
        {
          field: 'referrer',
          label: 'referrer'
        },
        {
          field: 'timestamp',
          label: 'timestamp',
          className: 'light-text'
        }
      ]
    }
  ]
}
export const limit = 8
export const pageSizes = [8, 15, 20]

export let param = {
  dateRange: getCurrentWeek(),
  type: '',
  clientId: '',
  userId: '',
  limit: limit,
  offset: 0
}

export let handleSQLByParam = (param = {}, schema = {}, hasLimit = true) => {
  let {
    // type,
    clientId,
    userId,
    clientType,
    where,
    limit,
    offset,
    dateRange: [start, end]
  } = param
  let {
    db,
    where: schemaWhere
  } = schema
  let sql = `select * from ${db}`
  if (!hasLimit) {
    sql = `select /*! USE_SCROLL(300,300000)*/ * from ${db}`
  }
  let sqlWhere = []
  if (clientId) {
    sqlWhere.push(`client_id = ${clientId}`)
  }
  if (userId) {
    sqlWhere.push(`user_id = ${userId}`)
  }
  if (clientType) {
    sqlWhere.push(`client_type = ${clientType}`)
  }
  if (start && end) {
    // 处理时区问题
    let [_start, _end] = fixTimeZoneDay(start, end)
    sqlWhere.push(`timestamp >= '${_start}' and timestamp < '${_end}'`)
  }
  if (where) {
    sqlWhere.push(where)
  }
  if (schemaWhere) {
    sqlWhere.push(schemaWhere)
  }
  if (sqlWhere.length > 0) {
    sql += ` where ${sqlWhere.join(' and ')}`
  }
  sql += ` order by timestamp desc`
  if (hasLimit) {
    sql += ` limit ${limit} offset ${offset}`
  }
  return sql
}
