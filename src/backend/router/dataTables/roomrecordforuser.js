import {
  DB_WECHARGE_NAME,
  UNSEARCH_ID,
  COMMON_TABLE_COLUMN_COMPANY,
  COMMON_TABLE_COLUMN_MONGO_ID,
  COMMON_TABLE_COLUMNS,
  COMMON_TABLE_COLUMN_USER_ID,
  COMMON_TABLE_COLUMN_CLIENT_ID,
  COMMON_TABLE_COLUMN_REFER_USER,
  COMMON_TABLE_COLUMN_REFER_CLIENT,
  COMMON_TABLE_COLUMNS_TIME
} from './common'
import {
  extraRoom
} from './appCommon'

import {
  format
} from 'common/dateFormat'

export default {
  roomrecordforuser: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    order: 'RecordDate-',
    columns: [
      UNSEARCH_ID,
      {
        name: 'UserName',
        edit: true,
        search: true
      },
      {
        name: 'RoomName',
        edit: true,
        search: true
      },
    ],
    extraColumns11: [
      {
        name: 'roomwatercharge',
        type: 'mysql',
        database: DB_WECHARGE_NAME,
        table: 'roomwatercharge',
        queryType: 'sql',
        sentence: (row) => {
          return `SELECT * FROM roomwatercharge where ZoneName = '${row.ZoneName}' and RoomName = '${row.RoomName}' and RecordDate = '${format(row.RecordDate)}';`
        },
        options: {}
      },
      {
        name: 'roomgarbagecharge',
        type: 'mysql',
        database: DB_WECHARGE_NAME,
        table: 'roomgarbagecharge',
        queryType: 'sql',
        sentence: (row) => {
          return `SELECT * FROM roomgarbagecharge where ZoneName = '${row.ZoneName}' and RoomName = '${row.RoomName}' and RecordDate = '${format(row.RecordDate)}';`
        },
        options: {}
      },
      {
        name: 'roomelectricitycharge',
        type: 'mysql',
        database: DB_WECHARGE_NAME,
        table: 'roomelectricitycharge',
        queryType: 'sql',
        sentence: (row) => {
          return `SELECT * FROM roomelectricitycharge where ZoneName = '${row.ZoneName}' and RoomName = '${row.RoomName}' and RecordDate = '${format(row.RecordDate)}';`
        },
        options: {}
      },
      {
        name: 'addtionalfeeforroom',
        type: 'mysql',
        database: DB_WECHARGE_NAME,
        table: 'addtionalfeeforroom',
        queryType: 'sql',
        sentence: (row) => {
          return `SELECT * FROM addtionalfeeforroom where ZoneName = '${row.ZoneName}' and RoomName = '${row.RoomName}' and RecordDate = '${format(row.RecordDate)}';`
        },
        options: {}
      },
      // {
      //   name: 'electricitymeterrecord',
      //   type: 'mysql',
      //   database: DB_WECHARGE_NAME,
      //   table: 'electricitymeterrecord',
      //   queryType: 'sql',
      //   sentence: (row) => {
      //     return `SELECT * FROM electricitymeterrecord where ZoneName = '${row.ZoneName}' and RoomName = '${row.RoomName}' and RecordDate = '${format(row.RecordDate)}';`
      //   },
      //   options: {}
      // },
      // {
      //   name: 'watermeterrecord',
      //   type: 'mysql',
      //   database: DB_WECHARGE_NAME,
      //   table: 'watermeterrecord',
      //   queryType: 'sql',
      //   sentence: (row) => {
      //     return `SELECT * FROM watermeterrecord where ZoneName = '${row.ZoneName}' and RoomName = '${row.RoomName}' and RecordDate = '${format(row.RecordDate)}';`
      //   },
      //   options: {}
      // },
    ]
  }
}
