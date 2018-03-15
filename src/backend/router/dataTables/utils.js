import _ from 'lodash'
import {mysql, getTable, getCollection} from 'db'
import * as commonUtils from 'common/utils'
import {DISCOVERY_ADMIN_DB_NAME} from './common'
import schema from './schema'
import Sequelize from 'sequelize'
const Op = Sequelize.Op

function mapTableSchema (tableSchema) {
  let {
    columns
  } = tableSchema
  if (!columns) {
    return tableSchema
  }

  let mapRefer = refer => {
    let {
      type: databaseType = 'mysql',
      database: databaseName = DISCOVERY_ADMIN_DB_NAME
    } = refer
    return mapTableSchema({
      ...refer,
      type: databaseType,
      database: databaseName
    })
  }

  columns = columns.map(column => {
    let {
      refer,
      referred,
    } = column
    let newColumn = {...column}
    if (refer) {
      newColumn.refer = mapRefer(refer)
    }
    if (referred) {
      newColumn.referred = referred.map(mapRefer)
    }
    return newColumn
  })

  return {
    ...tableSchema,
    columns
  }
}

async function traverseTableSchema (schema, options = {}) {
  let {
    columns
  } = schema
  if (!columns) {
    return
  }
  if (schema.name === 'company_hash_id') {
  }
  let {
    data, // rows
    onRefer,
    onReferred
  } = options

  for (let column of columns) {
    let {
      refer,
      referred,
    } = column
    if (refer) {
      let newData = await onRefer(column, refer, data)
      await traverseTableSchema(refer, {...options, data: newData})
    }
    if (referred) {
      for (let referredItem of referred) {
        let newData = await onReferred(column, referredItem, data)
        newData = [].concat.apply([], newData); // flatten
        await traverseTableSchema(referredItem, {...options, data: newData})
      }
    }
  }
}

export function fixDatabases (databases, options = {}) {
  return databases.map(databaseSchema => {
    let {
      type: databaseType = 'mysql',
      name: databaseName,
      tables
    } = databaseSchema
    tables = _.mapValues(tables, (tableSchema, tableName) => {
      let {
        columns
      } = tableSchema
      if (databaseType === 'mysql') {
        let table = getTable(databaseName, tableName)

        // 补全列
        let otherColumns = Object.keys(table.attributes)
          .filter(a => !columns.find(c => c.name === a))
          .map(a => {
            return {
              name: a,
              edit: true
            }
          })

        columns = columns.concat(otherColumns)
      }
      return mapTableSchema({
        ...tableSchema,
        columns
      })
    })
    return {
      ...databaseSchema,
      tables
    }
  })
}

export const DATABASE_SCHEMA = fixDatabases(schema)

export function getTableSchema (databaseType, databaseName, tableName) {
  let databaseSchema = DATABASE_SCHEMA.find(databaseSchema => {
    return databaseType === databaseSchema.type && databaseName == databaseSchema.name
  })
  if (!databaseSchema) {
    throw new Error(`database not found ${databaseType} ${databaseName}`)
  }
  let {
    tables: {
      [tableName]: tableSchema
    }
  } = databaseSchema
  if (!tableSchema) {
    throw new Error(`table not found ${databaseType} ${databaseName}.${tableName}`)
  }
  return tableSchema
}

function collectionFindAllAndCount(collection, criteria) {
  let {
    where,
    attributes,
    offset,
    limit
  } = criteria
  let cursor = collection.find(where, attributes)
  let cursor1 = cursor
  if (offset !== undefined) {
    cursor1 = cursor1.skip(offset)
  }
  if (limit !== undefined) {
    cursor1 = cursor1.limit(limit)
  }
  return Promise.all([cursor1.toArray(), cursor.count()]).then(([rows, count]) => {
    return {
      rows,
      count
    }
  })
}

function mapValues (data, columns) {
  return _.mapValues(_.pick(data, columns.map(c => c.name)), (v, k) => {
    let c = columns.find(c => c.name === k)
    return c.transform ? c.transform(v) : v
  })
}

let fillReferAndReferred = async function (rows, tableSchema) {
  let calcAttributes = (attributes, columns, extra) => {
    let returnAttributes = []
    if (attributes) {
      returnAttributes = returnAttributes.concat(attributes)
    }
    if (columns) {
      let arr = columns.map(c => c.name)
      returnAttributes = returnAttributes.concat(arr)
    }
    if (extra) {
      returnAttributes = returnAttributes.concat(extra)
    }
    returnAttributes = _.uniq(returnAttributes.filter(a => a))
    return returnAttributes.length > 0 ? returnAttributes : undefined;
  }
  await traverseTableSchema(tableSchema, {
    data: rows,
    onRefer: async function (schema, refer, data) {
      let {
        name,
      } = schema
      let values = new Set(data.map(item => item[name]))
      let {
        name: referName,
        type: databaseType,
        database: databaseName,
        table: tableName,
        column: referColumn,
        labelColumn: referLabelColumn,
        columns: referColumns,
        attributes
      } = refer
      attributes = calcAttributes(attributes, referColumns, [referColumn, referLabelColumn])
      let criteria = {
        attributes,
        where: {
          [referColumn]: {
            $in: Array.from(values)
          }
        },
        raw: true
      }
      let rows
      switch (databaseType) {
        case 'mysql': {
          let table = getTable(databaseName, tableName)
          rows = await table.findAll(criteria)
          break
        }
        case 'mongo': {
          let collection = getCollection(databaseName, tableName)
          let result = await collectionFindAllAndCount(collection, criteria)
          rows = result.rows
          break
        }
        default: {
          throw new Error(`Unknown refer database type ${databaseType}`)
          // break
        }
      }
      let map = _.keyBy(rows, referColumn)
      data.forEach(item => {
        item[referName] = map[item[name]]
      })
      return rows
    },
    onReferred: async function (schema, referred, data) {
      let {
        name
      } = schema
      let {
        name: referredName,
        type: databaseType,
        database: databaseName,
        table: tableName,
        column: referredColumn,
        attributes: attributes,
        columns: referredColumns,
        labelColumn: referredLabelColumn,
        limit
      } = referred
      attributes = calcAttributes(attributes, referredColumns, [referredColumn, referredLabelColumn])
      let values = new Set(data.map(item => item[name]))
      values = Array.from(values)
      let map = {}
      for (let value of values) {
        let criteria = {
          attributes,
          where: {
            [referredColumn]: value
          },
          limit,
          raw: true
        }
        let rows
        switch (databaseType) {
          case 'mysql': {
            let table = getTable(databaseName, tableName)
            rows = await table.findAll(criteria)
            break
          }
          case 'mongo': {
            let collection = getCollection(databaseName, tableName)
            let result = await collectionFindAllAndCount(collection, criteria)
            rows = result.rows
            break
          }
          default: {
            throw new Error(`Unknown referred database type ${databaseType}`)
            break
          }
        }
        map[value] = rows
      }
      data.forEach(item => {
        item[referredName] = map[item[name]]
      })
      return Object.values(map)
    }
  })
}

let afterSelect = async function (row, tableSchema) {
  let {extraColumns} = tableSchema
  if (!extraColumns) return

  await Promise.all(extraColumns.map(async (column) => {
    let result
    let {
      name,
      type: databaseType,
      database: databaseName,
      table: tableName,
      queryType,
      sentence,
      options
    } = column
    switch (databaseType) {
      case 'mysql': {
        if (queryType === 'sql') {
          let db = mysql[databaseName]
          if (!db) {
            throw new Error(`Unknown database ${databaseName}`)
          }
          let sql
          let value
          let res = await sentence(row, options)
          if (typeof res === 'string') {
            sql = res
          } else {
            value = res.value
            sql = res.sql
          }

          let queryResult = []
          if (sql) {
            queryResult = await db.database.query(sql)
          }
          result = value || queryResult[0]
        }
        break
      }
      case 'mongo': {}
      default: {
        throw new Error(`Unknown database type ${databaseType}`)
      }
    }
    row[name] = result
  }))
}

let _select = async function (ctx, data) {
  let {
    params: {
      databaseType,
      databaseName,
      tableName
    },
    $session: {
      supervisor
    }
  } = ctx

  let schema = getTableSchema(databaseType, databaseName, tableName)
  if (!schema) {
    ctx.throw(400, `Unknown table ${tableName}`)
  }

  let {
    order: defaultOrder,
    columns = [],
    readable
  } = schema
  let {
    _search,
    _page: pagination,
    _order: order = defaultOrder,
    _attributes: attributes,
    _explain
  } = data

  if (!commonUtils.checkRole(readable, supervisor)) {
    ctx.throw(400, `read not allowed.\nrequired: ${readable}, roles: ${supervisor.roles}, high: ${supervisor.highPrivilege}`)
  }

  let where = mapValues(data, columns)
  // console.log('where', where)
  for (let k in where) {
    let queryValue = where[k]
    if (/{.*}/.test(queryValue)) {
      try {
        let obj = JSON.parse(queryValue)
        where[k] = obj.action
      } catch (e) {
        console.log('JSON parse error', e)
      }
    }
  }
  // console.log('where', where)
  if (_search) {
    let table = databaseType === 'mysql' ? getTable(databaseName, tableName) : undefined
    let integerTypes = [
      'TINYINT',
      'SMALLINT',
      'MEDIUMINT',
      'INT',
      'BIGINT'
    ]
    let floatTypes = [
      'FLOAT',
      'DOUBLE'
    ]
    let searchNumber = Number(_search)
    let searchIsNotInteger = !Number.isInteger(searchNumber)
    let searchIsNotFloat = isNaN(searchNumber)
    let shouldSkip = name => {
      if (table) {
        let attribute = table.attributes[name]
        if (attribute) {
          let type = attribute.type.toSql()
          if (searchIsNotInteger && integerTypes.indexOf(type) >= 0) {
            return true
          }
          if (searchIsNotFloat && floatTypes.indexOf(type) >= 0) {
            return true
          }
        }
      }
    }
    let searchColumns = columns.filter(c => c.search && !shouldSkip(c.name))
    if (searchColumns.length) {
      let searchWhere = searchColumns.map(c => {
        let searchValue = c.transform ? c.transform(_search) : _search
        let constraint = c.search === 'like' ? {
            $like: `%${searchValue}%`
          } : searchValue
        return {
          [c.name]: constraint
        }
      })
      where = {
        ...where,
        $or: searchWhere
      }
    }
  }
  if (order && typeof order === 'string') {
    order = order.split(',').map(split => {
      let len = split.length
      if (split.endsWith('+')) {
        return [split.substr(0, len - 1), 'ASC']
      }
      if (split.endsWith('-')) {
        return [split.substr(0, len - 1), 'DESC']
      }
      return [split, 'ASC']
    })
  }
  if (pagination) {
    if (typeof pagination === 'string') {
      let [page = 1, pageSize = 20] = pagination.split(',')
      page = parseInt(page)
      pageSize = parseInt(pageSize)
      pagination = {
        page,
        pageSize
      }
    } else if (Array.isArray(pagination)) {
      let [page = 1, pageSize = 20] = pagination
    }
  } else {
    pagination = {}
  }
  let {
    page = 1,
    pageSize = 20
  } = pagination

  if (attributes) {
    attributes = attributes.split(',')
  } else {
    attributes = columns.map(c => c.name)
  }

  let criteria = {
    where,
    attributes,
    order,
    offset: (page - 1) * pageSize,
    limit: pageSize,
    raw: true
  }
  if (_explain !== undefined) {
    ctx.$respond(_.omit(criteria, ['include']))
    return
  }
  let result
  switch (databaseType) {
    case 'mysql': {
      let table = getTable(databaseName, tableName)
      result = await table.findAndCountAll(criteria)
      break
    }
    case 'mongo': {
      let table = getCollection(databaseName, tableName)
      result = await collectionFindAllAndCount(table, criteria)
      break
    }
    default: {
      throw new Error(`Unknown database type ${databaseType}`)
    }
  }
  let {
    count,
    rows
  } = result
  await fillReferAndReferred(rows, schema)
  await Promise.all(rows.map(row => afterSelect(row, schema)))

  ctx.$respond({
    pagination: {
      total: count,
      page,
      pageSize
    },
    rows
  })
}

let _create = async function (ctx, data) {
  let {
    params: {
      databaseType,
      databaseName,
      tableName
    },
    $session: {
      supervisor,
      supervisor: {
        user_id: userId
      }
    }
  } = ctx
  let schema = getTableSchema(databaseType, databaseName, tableName)
  if (!schema) {
    ctx.throw(400, `Unknown table ${tableName}`)
  }
  let {
    databaseWrite = databaseName,
    creatable,
    columns = []
  } = schema
  if (!commonUtils.checkRole(creatable, supervisor)) {
    ctx.throw(400, `create not allowed.\nrequired: ${creatable}, roles: ${supervisor.roles}, high: ${supervisor.highPrivilege}`)
  }

  data = mapValues(data, columns.filter(c => c.edit))
  let now = new Date()
  data.create_user_id = userId
  data.create_time = now
  data.update_user_id = userId
  data.update_time = now
  let row
  switch (databaseType) {
    case 'mysql': {
      let table = getTable(databaseWrite, tableName)
      try {
        row = await table.create(data, {raw: true})
      } catch (err) {
        ctx.throw(400, err)
      }
      break
    }
    case 'mongo': {
      let table = getCollection(databaseWrite, tableName)
      try {
        await table.insertOne(data)
      } catch (err) {
        ctx.throw(400, err)
      }
      let primaryColumns = columns.filter(c => c.primary)
      let where = _.pick(data, primaryColumns.map(c => c.name))
      row = await table.findOne(where)
      break
    }
    default: {
      throw new Error(`Unknown database type ${databaseType}`)
    }
  }
  await fillReferAndReferred([row], schema)
  ctx.$respond(row)
}

let _update = async function (ctx, data, where = data) {
  let {
    params: {
      databaseType,
      databaseName,
      tableName
    },
    $session: {
      supervisor,
      supervisor: {
        user_id: userId
      }
    }
  } = ctx
  let schema = getTableSchema(databaseType, databaseName, tableName)
  if (!schema) {
    ctx.throw(400, `Unknown table ${tableName}`)
  }
  let {
    databaseWrite = databaseName,
    editable,
    columns = []
  } = schema
  if (!commonUtils.checkRole(editable, supervisor)) {
    ctx.throw(400, `update not allowed.\nrequired: ${editable}, roles: ${supervisor.roles}, high: ${supervisor.highPrivilege}`)
  }

  let primaryColumns = columns.filter(c => c.primary)
  let primaryValid = primaryColumns.every(c => where[c.name] !== undefined)
  if (!primaryValid) {
    ctx.throw(400, 'primary column(s) not set')
    return
  }
  where = mapValues(where, primaryColumns)
  let resultWhere = mapValues(data, primaryColumns)
  data = mapValues(data, columns.filter(c => c.edit))
  let now = new Date()
  data.update_user_id = userId
  data.update_time = now

  let row
  switch (databaseType) {
    case 'mysql': {
      let table = getTable(databaseWrite, tableName)
      try {
        await table.update(data, {
          where,
          limit: 1
        })
      } catch (err) {
        ctx.throw(400, err)
      }
      row = await table.findOne({where: resultWhere, raw: true})
      break
    }
    case 'mongo': {
      let table = getCollection(databaseWrite, tableName)
      try {
        await table.update(where, {
          $set: data
        })
      } catch (err) {
        ctx.throw(400, err)
      }
      row = await table.findOne(resultWhere)
      break
    }
    default: {
      throw new Error(`Unknown database type ${databaseType}`)
    }
  }
  await fillReferAndReferred([row], schema)
  ctx.$respond(row)
}

let _delete = async function (ctx, where) {
  let {
    params: {
      databaseType,
      databaseName,
      tableName
    },
    $session: {
      supervisor
    }
  } = ctx
  let schema = getTableSchema(databaseType, databaseName, tableName)
  if (!schema) {
    ctx.throw(400, `Unknown table ${tableName}`)
  }
  let {
    databaseWrite = databaseName,
    deletable,
    columns = []
  } = schema
  if (!commonUtils.checkRole(deletable, supervisor)) {
    ctx.throw(400, `delete not allowed.\nrequired: ${deletable}, roles: ${supervisor.roles}, high: ${supervisor.highPrivilege}`)
  }

  let primaryColumns = columns.filter(c => c.primary)
  let primaryValid = primaryColumns.every(c => where[c.name] !== undefined)
  if (!primaryValid) {
    ctx.throw(400, 'primary column(s) not set')
    return
  }
  where = _.pick(where, primaryColumns.map(c => c.name))

  let result
  switch (databaseType) {
    case 'mysql': {
      let table = getTable(databaseWrite, tableName)
      try {
        result = await table.destroy({
          where,
          limit: 1
        })
      } catch (err) {
        ctx.throw(400, err)
      }
      break
    }
    case 'mongo': {
      let table = getCollection(databaseWrite, tableName)
      try {
        result = await table.removeOne(where)
      } catch (err) {
        ctx.throw(400, err)
      }
      break
    }
    default: {
      throw new Error(`Unknown database type ${databaseType}`)
    }
  }
  ctx.$respond(result)
}

export function withTransaction (func, options = {}) {
  let {databaseName = DISCOVERY_ADMIN_DB_NAME} = options
  return async function (...args) {
    let database = mysql[databaseName]
    if (!database) {
      throw new Error(`Unknown database ${databaseName}`)
    }
    let transaction = await database.database.transaction()
    let ret
    try {
      ret = await func(...args)
    } catch (err) {
      transaction.rollback()
      throw err
    }
    transaction.commit()
    return ret
  }
}

export var select = _select
export var create = withTransaction(_create)
export var update = withTransaction(_update)
export var delete_ = withTransaction(_delete)
