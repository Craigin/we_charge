import api from 'api'
import {
  DB_WECHARGE_NAME,
  TABLE_COLUMN_ID
  // TABLE_COLUMN_PAYLOAD,
  // COMMON_TABLE_COLUMNS,
  // TABLE_COLUMN_USER_ID_SHOW,
  // TABLE_COLUMN_CLIENT_ID_SHOW,
  // WIDTH
} from './common'

export default [
  {
    path: '/charge/manage/company/hire',
    name: 'CompanyHire',
    title: '公司租用房间',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'companyhireroom',
      entityClass: null,
      actions: ['create'],
      selectPanel: {
        extraControls: [
          {
            title: '管理区',
            name: 'ZoneName',
            options: (row) => {
              return api.dataTableSelect({_page: '1,99999'}, {}, {type: 'mysql', database: DB_WECHARGE_NAME, table: 'zone'}).then(data => {
                return data.rows.map(item => {
                  return {
                    ...item,
                    name: item.ZoneName,
                    value: item.ZoneName
                  }
                })
              })
            }
          }
        ]
      },
      columns: [
        TABLE_COLUMN_ID,
        {
          name: 'CompanyName',
          title: '公司名称'
        },
        {
          name: 'ZoneName',
          title: '管理区',
          type: 'select',
          options: () => {
            return api.dataTableSelect({_page: '1,99999'}, {}, {type: 'mysql', database: DB_WECHARGE_NAME, table: 'zone'}).then(data => {
              return data.rows.map(item => {
                return {
                  ...item,
                  name: item.ZoneName,
                  value: item.ZoneName
                }
              })
            })
          }
        },
        {
          name: 'room[0].RoomClass',
          title: '房间类别',
          type: 'select',
          options: [
            {
              name: '私人',
              value: 0
            },
            {
              name: '集体',
              value: 1
            }
          ]
        },
        {
          name: 'RoomName',
          title: '房间号'
        },
        {
          name: 'room[0].UserName',
          title: '用户名称'
        },
        {
          name: 'room[0].WaterChargeClass',
          title: '水费标准'
        },
        {
          name: 'room[0].ElectricityChargeClass',
          title: '电费标准'
        },
        {
          name: 'room[0].GarbageChargeClass',
          title: '垃圾费标准'
        },
        {
          name: 'room[0].HireStatus',
          title: '是否租用',
          type: 'select',
          options: [
            {
              name: '未租用',
              value: 0
            },
            {
              name: '已租用',
              value: 1
            }
          ]
        },
        {
          name: 'room[0].Notes',
          title: '备注'
        }
      ]
    }
  },
  {
    path: '/charge/manage/company/info',
    name: 'CompanyInfo',
    title: '公司',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'company',
      entityClass: null,
      actions: ['create'],
      selectPanel: {
        extraControls: [
          {
            title: '管理区',
            name: 'ZoneName',
            options: () => {
              return api.dataTableSelect({_page: '1,99999'}, {}, {type: 'mysql', database: DB_WECHARGE_NAME, table: 'zone'}).then(data => {
                let list = data.rows.map(item => {
                  return {
                    ...item,
                    name: item.ZoneName,
                    value: item.ZoneName
                  }
                })
                return list
              })
            }
          }
        ]
      },
      rowActions (row, mergedSchema, defaultActions) {
        let actions = [
          // {
          //   name: 'to',
          //   type: 'default',
          //   icon: 'd-arrow-right',
          //   title: '租用',
          //   click: {
          //     name: 'CompanyHire',
          //     query: {
          //       CompanyName: row.CompanyName,
          //       ZoneName: row.ZoneName
          //     }
          //   }
          // }
        ]
        return defaultActions.concat(actions)
      },
      columns: [
        TABLE_COLUMN_ID,
        {
          name: '',
          title: '租房',
          show: true,
          index: 0,
          type: 'icon',
          width: 70,
          icons: [
            {
              name: 'zufang',
              style: {
                fontSize: '18px',
                color: '#23B46C',
                marginLeft: '6px'
              },
              to (row) {
                return {
                  name: 'CompanyHire',
                  query: {
                    CompanyName: row.CompanyName,
                    ZoneName: row.ZoneName
                  }
                }
              }
            }
          ]
        },
        {
          name: 'CompanyName',
          title: '公司名称'
        },
        {
          name: 'ZoneName',
          title: '管理区',
          type: 'select',
          options: () => {
            return api.dataTableSelect({_page: '1,99999'}, {}, {type: 'mysql', database: DB_WECHARGE_NAME, table: 'zone'}).then(data => {
              return data.rows.map(item => {
                return {
                  ...item,
                  name: item.ZoneName,
                  value: item.ZoneName
                }
              })
            })
          }
        },
        {
          name: 'Notes',
          title: '备注',
          type: 'textarea'
        }
      ]
    }
  }
]
