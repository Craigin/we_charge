// import api from 'api'
// import {HOSTS} from 'config'
// const OperateReport = resolve => require(['channel/operateReport'], resolve)
// import * as dateFormatUtils from 'utils/dateFormat'

import {
  // TABLE_COLUMN_ID
  // TABLE_COLUMN_USER_ID_SHOW,
  // TABLE_COLUMN_TITLE,
  // TABLE_COLUMN_DESCRIPTION,
  // TABLE_COLUMN_IMAGE,
  // TABLE_COLUMN_URL,
  // TABLE_COLUMN_INDEX,
  // TABLE_COLUMN_SHOW,
  // TABLE_COLUMN_ENABLE,
  // TABLE_COLUMN_LANG,
  // TABLE_COLUMN_PAYLOAD,
  // TABLE_COLUMN_COMPANY,
  // TABLE_COLUMN_AGGREGATE_LANG,
  // TABLE_COLUMN_TIME,
  // TABLE_COLUMN_CREATE_TIME,
  // TABLE_COLUMN_UPDATE_TIME,
  // COMMON_TABLE_COLUMNS,
  // TABLE_COLUMN_CLIENT_ID_SHOW,
  // COMMON_TABLE_COLUMNS_TIME,
  // WIDTH
} from './common'

import room from './room'
import columnList from './columnList'
import company from './company'
import record from './record'
// import roomrecordforuser from './roomrecordforuser'
import setting from './setting'

const dataTables = [
  ...room,
  ...columnList,
  ...company,
  ...record,
  ...setting
]

export default dataTables
