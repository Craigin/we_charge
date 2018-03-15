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
import room from './room'
import settings from './settings'
import company from './company'
import record from './record'
import roomrecordforuser from './roomrecordforuser'

const databases = [
  {
    type: 'mysql',
    name: DB_WECHARGE_NAME,
    tables: {
      ...settings,
      ...room,
      ...company,
      ...record,
      ...roomrecordforuser
    }
  }
]

export default databases
