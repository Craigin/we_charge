import * as utils from './utils'
import backup0 from './backup'

let getNameFunc = (join = '') => {
  return (name, i) => {
    return name + join + (i > 9 ? i : '0' + i)
  }
}

let dbRoot

export function setDBConfig (config0) {
  let config = {
    host: config0.host || 'localhost',
    username: config0.username || 'root',
    password: config0.password||'',
    timezone: config0.timezone,

    shards: {
      we_charge: config0.we_charge
    }
  }
  console.log('======mysql config: ',config)

  dbRoot = utils.exportDatabases(config)
}

export function getDBRoot () {
  return dbRoot
}

export function getTable (database, table) {
  let _database = dbRoot[database]
  if (!_database) {
    throw new Error(`database ${database} not found`)
  }
  let _table = _database.tables[table]
  if (!_table) {
    throw new Error(`table ${database}.${table} not found`)
  }
  return _table.table
}

export var transformRowDate = utils.transformRowDate

export var backup = backup0
