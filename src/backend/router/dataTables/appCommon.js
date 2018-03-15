import {
  DB_WECHARGE_NAME,
  COMMON_TABLE_COLUMN_COMPANY,
  COMMON_TABLE_COLUMN_MONGO_ID,
  COMMON_TABLE_COLUMNS,
  COMMON_TABLE_COLUMN_USER_ID,
  COMMON_TABLE_COLUMN_CLIENT_ID,
  COMMON_TABLE_COLUMN_REFER_USER,
  COMMON_TABLE_COLUMN_REFER_CLIENT,
  COMMON_TABLE_COLUMNS_TIME
} from './common'

export let extraRoom = {
  name: 'room',
  type: 'mysql',
  database: DB_WECHARGE_NAME,
  table: 'room',
  queryType: 'sql',
  sentence: (row) => {
    return `SELECT * FROM room where ZoneName = '${row.ZoneName}' and RoomName = '${row.RoomName}';`
  },
  options: {}
}
