import PageStart from './pageStart'
import CompanyResult from './companyResult'
import CompanyMining from './companyMining'
import CompanyView from './companyView'
import EmailResult from './emailResult'

import {getCurrentWeek} from 'utils/dateFormat'

export const schema = {
  name: '使用报告统计分析',
  sections: [
    {
      key: 'pageStart',
      name: '登录情况(页面启动次数)',
      fixSQL: true,
      db: 'dx.start',
      component: PageStart
    },
    {
      key: 'companyResult',
      name: '搜索行为情况',
      fixSQL: true,
      db: 'dx.search.company_result',
      component: CompanyResult,
      where: '(filters = 0 or filters is null)'
    },
    {
      key: 'companyMining',
      name: '使用发掘情况',
      fixSQL: true,
      db: 'dx.mining.company.submit',
      component: CompanyMining
    },
    {
      key: 'companyView',
      name: '查看公司详情情况',
      db: 'dx.company.view',
      component: CompanyView
    },
    {
      key: 'emailResult',
      name: '公司邮箱情况',
      fixSQL: false,
      db: 'dx.company.view',
      component: EmailResult
    }
  ]
}

export let param = {
  dateRange: getCurrentWeek(),
  type: '',
  clientId: '',
  userId: '',
  clientType: '',
  pivot: ''
}

let getBasicSql = (param = {}, schema = {}) => {
  let {
    pivot = 'pv'
  } = param
  let {
    db
  } = schema
  let sql
  if (pivot === 'pv') {
    sql = `select sum(count) as count from ${db}`
  } else if (pivot === 'client_id') {
    sql = `select count(distinct client_id) as count from ${db}`
  } else if (pivot === 'user_id') {
    sql = `select count(distinct user_id) as count from ${db}`
  }
  return sql
}

export let handleSQLByParam = (param = {}, schema = {}) => {
  let {
    // type,
    clientId,
    userId,
    where,
    dateRange: [start, end],
    clientType
  } = param
  let {
    where: schemaWhere
  } = schema
  let sql = getBasicSql(param, schema)
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
    if (start === end) {
      sqlWhere.push(`day = ${start}`)
    } else {
      sqlWhere.push(`day >= ${start} and day  < ${end}`)
    }
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
  sql += ' group by day order by day'
  return sql
}
