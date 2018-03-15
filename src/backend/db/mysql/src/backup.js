import co from 'co'
import {getTable} from '.'

let backupTable = (options) => {
  let {
    database: databaseName,
    table: tableName,
    last_modify: lastModify = 'update_time'
  } = options
  let table = getTable(databaseName, tableName)
  let backupTable = getTable('xim_lantern', 'tbl_config_table_backup')
  let name = databaseName + '.' + tableName

  return co(function * () {
    let newest = yield table.findOne({
      order: [[lastModify, 'DESC']]
    })
    let backupNewest = yield backupTable.findOne({
      where: {name},
      order: [['id', 'DESC']]
    })
    if (newest && backupNewest && backupNewest.update_time >= newest[lastModify]) {
      // no need to backup
      return
    }

    console.log(`[BACKUP] starting backup ${name}...`)
    let rows = yield table.findAll({raw: true})
    let now = new Date()
    let content = JSON.stringify(rows)
    let backupRow = yield backupTable.create({
      name,
      content,
      create_time: now,
      update_time: now
    })
    console.log(`[BACKUP] backup ${name} done`, typeof backupRow)
  }).catch((err) => {
    console.error(`[BACKUP] backup ${name} error`, err)
  })
}

let backupAllTables = () => {
  let tables = [
    { database: 'im_admin', table: 'tbl_kv_storage' },
    { database: 'im_admin', table: 'tbl_official_account' },
    { database: 'im_admin', table: 'tbl_official_account_template' },
    { database: 'eagle_eye', table: 'tbl_metric_tree', last_modify: 'create_time' },
    { database: 'eagle_eye', table: 'tbl_metric' },
    { database: 'eagle_eye', table: 'tbl_tags' }
  ]
  return Promise.all(tables.map(options => backupTable(options)))
}

export default function () {
  const BACKUP_INTERVAL = 1000 * 60 * 5
  backupAllTables()
  setInterval(() => {
    backupAllTables()
  }, BACKUP_INTERVAL)
}
