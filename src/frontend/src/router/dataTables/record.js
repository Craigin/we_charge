// import api from 'api'
import {
  DB_WECHARGE_NAME,
  TABLE_COLUMN_ID
  // TABLE_COLUMN_PAYLOAD,
  // COMMON_TABLE_COLUMNS,
  // TABLE_COLUMN_USER_ID_SHOW,
  // TABLE_COLUMN_CLIENT_ID_SHOW,
  // WIDTH
} from './common'
import {
  zoneName,
  referRoomColumns
} from './appCommon'

// import dateformat from 'dateformat'
import {format} from 'utils/dateFormat'

export default [
  {
    path: '/charge/manage/meter-reading/watermeterrecord',
    name: 'Watermeterrecord',
    title: '水表记录',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'watermeterrecord',
      entityClass: 4,
      selectPanel: {
        controls: {
          dayPicker: {
            name: 'RecordDate',
            dateType: 'month',
            placeholder: '选择日期'
          }
        },
        extraControls: [
          zoneName,
          {
            name: '*to*',
            title: '水电表',
            type: 'select',
            selected: 'Watermeterrecord',
            options: [
              {
                name: '水表记录',
                value: 'Watermeterrecord'
              },
              {
                name: '电表记录',
                value: 'Electricitymeterrecord'
              }
            ]
          }
        ]
      },
      actions (row, mergedSchema, defaultActions) {
        let actions = [
          {
            name: 'chargeStats',
            type: 'primary',
            icon: 'el-icon-bell',
            text: '未完成抄表查询',
            disabled: false,
            click: {
              name: 'UnFinshRecord',
              query: {
                activeMenu: '/charge/manage/meter-reading/watermeterrecord'
              }
            }
          }
        ]
        return defaultActions.filter(item => item.name === 'columnList').concat(actions)
      },
      columns: [
        TABLE_COLUMN_ID,
        ...referRoomColumns,
        {
          name: 'MeterCode',
          title: '水表编号',
          disabled: true
        },
        {
          name: 'PreviousNumber',
          title: '上月读数',
          type: 'integer',
          min () {
            return 0
          }
        },
        {
          name: 'LastNumber',
          title: '本月读数',
          type: 'integer',
          min () {
            return 0
          }
        },
        {
          name: 'UsedNumber',
          title: '实用数',
          disabled: true,
          calculate (row) {
            return row.LastNumber - row.PreviousNumber
          }
        },
        {
          name: 'ExchangeRate',
          title: '变比'
        },
        {
          name: 'RecordDate',
          title: '抄表月分',
          type: 'date',
          dateType: 'month',
          text (value) {
            return format(new Date(value), 'yyyy-MM')
          },
          disabled: true
        },
        {
          name: 'Notes',
          title: '抄表备注',
          type: 'textarea'
        }
      ]
    }
  },
  {
    path: '/charge/manage/meter-reading/electricitymeterrecord',
    name: 'Electricitymeterrecord',
    title: '电表记录',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'electricitymeterrecord',
      entityClass: 5,
      selectPanel: {
        controls: {
          dayPicker: {
            name: 'RecordDate',
            dateType: 'month',
            placeholder: '选择日期'
          }
        },
        extraControls: [
          zoneName,
          {
            name: '*to*',
            title: '水电表',
            type: 'select',
            selected: 'Electricitymeterrecord',
            options: [
              {
                name: '水表记录',
                value: 'Watermeterrecord'
              },
              {
                name: '电表记录',
                value: 'Electricitymeterrecord'
              }
            ]
          }
        ]
      },
      columns: [
        TABLE_COLUMN_ID,
        ...referRoomColumns,
        {
          name: 'MeterCode',
          title: '电表编号',
          disabled: true
        },
        {
          name: 'PreviousNumber',
          title: '上月读数',
          type: 'integer',
          min () {
            return 0
          }
        },
        {
          name: 'LastNumber',
          title: '本月读数',
          type: 'integer',
          min () {
            return 0
          }
        },
        {
          name: 'UsedNumber',
          title: '实用数',
          disabled: true,
          calculate (row) {
            return row.LastNumber - row.PreviousNumber
          }
        },
        {
          name: 'ExchangeRate',
          title: '变比'
        },
        {
          name: 'RecordDate',
          title: '抄表月份',
          type: 'date',
          dateType: 'month',
          text (value) {
            return format(new Date(value), 'yyyy-MM')
          },
          disabled: true
        },
        {
          name: 'Notes',
          title: '抄表备注',
          type: 'textarea'
        }
      ]
    }
  }
]
