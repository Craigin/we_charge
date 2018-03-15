import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import _ from 'lodash'
import dateformat from 'dateformat'

function evalfunc (func, ...args) {
  return typeof (func) === 'function' ? func(...args) : func
}

export function parseFields (schemaFile) {
  let text = fs.readFileSync(schemaFile, {
    encoding: 'utf8'
  })
  let leadIndex = text.indexOf('sequelize.define')
  if (leadIndex < 0) {
    throw new Error(`unable to find sequelize.define in ${schemaFile}`)
  }

  let startIndex = text.indexOf('{', leadIndex)
  if (startIndex < 0) {
    throw new Error(`unable to find start in ${schemaFile}`)
  }

  let depth = 1
  let index = startIndex + 1
  while (true) {
    let indexLeft = text.indexOf('{', index)
    let indexRight = text.indexOf('}', index)
    if (indexRight < 0) {
      throw new Error(`unable to find '}' in ${schemaFile}`)
    }
    if (indexLeft < 0) {
      index = indexRight + 1
      if (depth !== 0) {
        throw new Error(`reach end when invalid depth ${depth} ${schemaFile}`)
      }
      break
    }
    if (indexLeft < indexRight) {
      index = indexLeft + 1
      depth += 1
      continue
    }

    depth -= 1
    index = indexRight + 1
    if (depth <= 0) {
      break
    }
  }

  let script = text
    .substr(startIndex, index - startIndex)
    .replace(/(type:[ \t])DataTypes\.([A-Za-z0-9]+)(\(.+\))?(,)?/g, (m0, m1, m2, m3, m4) => `${m1}"${m2}"${m4}`)

  let schema
  try {
    schema = eval(`
let sequelize = {
  literal: function () {}
};
let _o_ = ${script}; _o_
`)  // eslint-disable-line no-eval
  } catch (err) {
    console.error('compile error', err)
    console.error(script)
  }

  let fields = {}
  for (let field in schema) {
    fields[field] = schema[field].type.toLowerCase()
  }
  return fields
}

export function mergeFields (schemaFile, fieldOpts = {}, globalFieldOpts = {}) {
  let fields = parseFields(schemaFile)
  let _fields = {}

  for (let field in fields) {
    let type = fields[field]
    _fields[field] = Object.assign({type}, fieldOpts[field], globalFieldOpts[field])
  }

  return _fields
}

export function improveExportTables (databaseName, opts) {
  let mapTable = (tableOpts, tableName) => {
    let mapField = (fieldOpts, fieldName) => {
      let {opts: optsOfFieldOpts} = fieldOpts
      switch (fieldOpts.subtype) {
        case 'refer':
          {
            let referOpts = Object.assign({}, optsOfFieldOpts)
            if (referOpts.label === undefined) {
              referOpts.label = 'name'
            }
            if (referOpts.title === undefined) {
              referOpts.title = referOpts.label
            }
            if (referOpts.field === undefined) {
              if (!fieldName.endsWith('_id')) {
                throw new Error(`${databaseName}.${tableName}.${fieldName} not endsWith '_id' to be a refer, while field empty`)
              }
              referOpts.field = fieldName.slice(0, fieldName.length - 3)
            }
            if (referOpts.to === undefined) {
              referOpts.to = 'id'
            }
            if (referOpts.database === undefined) {
              referOpts.database = databaseName
            }
            if (referOpts.table === undefined) {
              if (!fieldName.endsWith('_id')) {
                throw new Error(`${databaseName}.${tableName}.${fieldName} not endsWith '_id' to be a refer, while table empty`)
              }
              referOpts.table = 'tbl_' + fieldName.slice(0, fieldName.length - 3)
            }
            return Object.assign({}, fieldOpts, {
              opts: referOpts
            })
          }
        case 'referred':
          {
            return Object.assign({}, fieldOpts, {
              opts: _.mapValues(optsOfFieldOpts, (opts, name) => {
                let _opts = Object.assign({}, opts)
                if (_opts.label === undefined) {
                  _opts.label = name
                }
                if (_opts.database === undefined) {
                  _opts.database = databaseName
                }
                if (_opts.table === undefined) {
                  throw new Error(`${databaseName}.${tableName}.${name} has no referred table`)
                }
                if (_opts.from === undefined) {
                  if (!tableName.startsWith('tbl_')) {
                    throw new Error(`${databaseName}.${tableName} table name not startsWith 'tbl_'`)
                  }
                  _opts.from = tableName.slice(4) + '_id'
                }
                if (_opts.to === undefined) {
                  _opts.to = fieldName
                }
                return _opts
              })
            })
          }
        default:
          {
            return Object.assign({}, fieldOpts, {
              opts: optsOfFieldOpts
            })
          }
      }
    }
    return {
      options: tableOpts.options,
      fields: _.mapValues(tableOpts.fields, mapField)
    }
  }
  return _.mapValues(opts, mapTable)
}

/**
 *
 * @param sequelize
 * @param DataTypes
 * @param opts
 *   {
 *     shards: {
 *       tbl_message: {
 *         begin: 1,
 *         end: 90,
 *         name: function (name, i) {
 *           return `...`;
 *         }
 *       },
 *     },
 *     fieldOpts: {
 *     },
 *   }
 */
export function exportTables (databaseName, tables, dirname, sequelize, DataTypes, opts = {}) {
  tables = improveExportTables(databaseName, tables)

  let shards = opts.shards || {}

  let _tables = {}
  for (let table in tables) {
    let tableOpts = tables[table]
    let tableJs = path.join(dirname, table + '.js')
    let loadTable = require(tableJs)
    let fields = mergeFields(tableJs, tableOpts.fields, opts.fieldOpts)

    let masks = {}
    for (let field in fields) {
      let mask = fields[field].mask
      if (mask) {
        masks[field] = mask
      }
    }
    let options = tableOpts.options || {}

    let shard = shards[table]
    let sharded = shard && shard.begin !== undefined && shard.end !== undefined

    _tables[table] = {
      table: loadTable(sequelize, DataTypes),
      fields,
      options,
      masks,
      sharded
    }

    if (sharded) {
      for (let i = shard.begin; i < shard.end; i++) {
        let name = evalfunc(shard.name, table, i)
        _tables[name] = {
          table: loadTable(sequelize, DataTypes, name),
          fields,
          options,
          masks,
          shardFrom: table
        }
      }
    }
  }
  return _tables
}

/**
 * @param opts
 *   {
 *     host,
 *     username,
 *     password,
 *     dialect, // default to 'mysql'
 *     shards: {
 *       im_db: {
 *         host,     // string or function(i){}
 *         username, // string or function(i){}
 *         password, // string or function(i){}
 *         begin,
 *         end,
 *         name: function (name, i) {
 *         },
 *         shards: {
 *           tbl_message: {
 *             begin: 1,
 *             end: 91,
 *             name: function (name, i) {
 *               return `...`;
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 */
export function exportDatabases (opts) {
  let fieldOpts = {
    create_time: {
      editable: false
    },
    update_time: {
      editable: false
    }
  }

  let connect = (opts, name, shard = {}, i = undefined) => {
    let host = evalfunc(shard.host, i) || opts.host
    let username = evalfunc(shard.username, i) || opts.username
    let password = evalfunc(shard.password, i) || opts.password
    let timezone = evalfunc(shard.timezone, i) || opts.timezone
    // console.log('timezone', timezone)
    // xn.logger.info('connecting database', name, username, password, host);
    let options = {
      host,
      dialect: opts.dialect || 'mysql',
      dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true
      },
      charset: 'utf8mb4'
    }
    if (timezone !== undefined) {
      options.timezone = timezone // !!! have to be in this way
    }
    return new Sequelize(name, username, password, options)
  }

  let shards = opts.shards || {}
  let _databases = {}
  for (let database in shards) {
    let shard = shards[database]

    let loadDatabase = require('./' + database)
    if (loadDatabase.default) {
      loadDatabase = loadDatabase.default
    }
    let sequelize = connect(opts, (shard && shard.name) || database, shard)

    let sharded = shard && shard.begin !== undefined && shard.end !== undefined
    _databases[database] = {
      database: sequelize,
      tables: loadDatabase(database, sequelize, Sequelize, {
        shards: shard && shard.shards,
        fieldOpts
      }),
      sharded
    }

    if (sharded) {
      for (let i = shard.begin; i < shard.end; i++) {
        let name = evalfunc(shard.name, database, i) || database
        let sequelize = connect(opts, name, shard, i)
        _databases[name] = {
          database: sequelize,
          tables: loadDatabase(name, sequelize, Sequelize, {
            shards: shard.shards,
            fieldOpts
          }),
          shardFrom: database
        }
      }
    }
  }
  return _databases
}

export function formatdate (date, ms = false) {
  if (isNaN(date)) {
    return '0000-00-00 00:00:00'
  }
  if (ms && date.getMilliseconds()) {
    return dateformat(date, 'yyyy-mm-dd HH:MM:ss.l')
  }
  return dateformat(date, 'yyyy-mm-dd HH:MM:ss')
}

export function transformRowDate (row) {
  let row1 = {}
  for (let key in row) {
    let val = row[key]
    if (val instanceof Date) {
      row1[key] = formatdate(val)
    }
  }
  if (Object.keys(row1).length === 0) {
    return row
  }
  return Object.assign({}, row, row1)
}

export var scripts = {

  // im_db
  calcTblMessage: `
var typeBits = lib.Long.fromValue(type).shiftLeft(60);
var id = lib.Long.fromString(field, true);
var index = id.or(typeBits).mod(100).toString();
if (index.length < 2) {
  index = '0' + index;
}
return 'tbl_message_' + index;
`,
  calcTblMessageSession: `
var typeBits = lib.Long.fromValue(type).shiftLeft(60);
var id = lib.Long.fromString(field, true);
return id.or(typeBits).toString();
`,

  // cloud_info
  calcTblUserCallRecord: `
var index = lib.Long.fromValue(client_id).mod(100).toString();
if (index.length < 2) {
  index = '0' + index;
}
return 'tbl_user_call_record_' + index;
`,
  calcTblCallBankTransfer: `
var index = lib.Long.fromValue(client_id).mod(100).toString();
if (index.length < 2) {
  index = '0' + index;
}
return 'tbl_call_bank_transfer_' + index;
`,
  calcTblCallBankConsumeRecord: `
var index = lib.Long.fromValue(client_id).mod(100).toString();
if (index.length < 2) {
  index = '0' + index;
}
return 'tbl_call_bank_consume_record_' + index;
`,

  calcTblUserCallRelation: `
call_id = call_id.toString();
var value = 0;
for (var i = 0; i < call_id.length; i++) {
  value = value + call_id.charCodeAt(i) - '0'.charCodeAt();
}
var index = lib.Long.fromValue(value).mod(100).toString();
if (index.length < 2) {
  index = '0' + index;
}
return 'tbl_user_call_relation_' + index;
`,
  calcTblCloudCallEvent: `
call_id = call_id.toString();
var value = 0;
for (var i = 0; i < call_id.length; i++) {
  value = value + call_id.charCodeAt(i) - '0'.charCodeAt();
}
var index = lib.Long.fromValue(value).mod(100).toString();
if (index.length < 2) {
  index = '0' + index;
}
return 'tbl_cloud_call_event_' + index;
`
}
