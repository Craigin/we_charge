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


export default {
  room: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
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
    ]
  },
  watermeterinroom: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
      {
        name: 'RoomName',
        edit: true,
        search: true
      }
    ],
    extraColumns: [
      {
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
    ]
  },
  electricitymeterinroom: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
      {
        name: 'RoomName',
        edit: true,
        search: true
      },
    ],
    extraColumns: [
      {
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
    ]
  }
}
