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
    path: '/charge/manage/room',
    name: 'Room',
    title: '房间',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'room',
      entityClass: 1,
      selectPanel: {
        extraControls: [
          {
            title: '管理区',
            name: 'ZoneName',
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
          }
        ]
      },
      rowActions (row, mergedSchema, defaultActions) {
        let actions = [
          // {
          //   name: 'to',
          //   type: 'default',
          //   icon: 'goods',
          //   title: '水表管理',
          //   click: {
          //     name: 'Watermeterinroom',
          //     query: {
          //       RoomName: row.RoomName,
          //       ZoneName: row.ZoneName
          //     }
          //   }
          // },
          // {
          //   name: 'to',
          //   type: 'default',
          //   icon: 'news',
          //   title: '电表管理',
          //   click: {
          //     name: 'Electricitymeterinroom',
          //     query: {
          //       RoomName: row.RoomName,
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
          title: '水电表',
          show: true,
          index: 0,
          type: 'icon',
          width: 70,
          icons: [
            {
              name: 'icon-humidity',
              style: {
                fontSize: '18px',
                color: '#23B46C',
                marginRight: '4px'
              },
              to (row) {
                return {
                  name: 'Watermeterinroom',
                  query: {
                    RoomName: row.RoomName,
                    ZoneName: row.ZoneName
                  }
                }
              }
            },
            {
              name: 'iconfontchangemeter-copy',
              style: {
                fontSize: '18px',
                color: '#23B46C'
              },
              to (row) {
                return {
                  name: 'Electricitymeterinroom',
                  query: {
                    RoomName: row.RoomName,
                    ZoneName: row.ZoneName
                  }
                }
              }
            }
          ]
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
          name: 'RoomClass',
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
          name: 'UserName',
          title: '用户名称'
        },
        {
          name: 'RoomName',
          title: '房间号'
        },
        {
          name: 'WaterChargeClass',
          title: '水费标准',
          type: 'select',
          options: () => {
            return api.dataTableSelect({_page: '1,99999'}, {}, {type: 'mysql', database: DB_WECHARGE_NAME, table: 'waterchargeclass'}).then(data => {
              return data.rows.map(item => {
                return {
                  ...item,
                  name: item.ClassName,
                  value: item.ClassName
                }
              })
            })
          }
        },
        {
          name: 'ElectricityChargeClass',
          title: '电费标准',
          type: 'select',
          options: () => {
            return api.dataTableSelect({_page: '1,99999'}, {}, {type: 'mysql', database: DB_WECHARGE_NAME, table: 'electricitychargeclass'}).then(data => {
              return data.rows.map(item => {
                return {
                  ...item,
                  name: item.ClassName,
                  value: item.ClassName
                }
              })
            })
          }
        },
        {
          name: 'GarbageChargeClass',
          title: '垃圾费标准',
          type: 'select',
          options: () => {
            return api.dataTableSelect({_page: '1,99999'}, {}, {type: 'mysql', database: DB_WECHARGE_NAME, table: 'garbagechargeclass'}).then(data => {
              return data.rows.map(item => {
                return {
                  ...item,
                  name: item.ClassName,
                  value: item.ClassName
                }
              })
            })
          }
        },
        {
          name: 'HireStatus',
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
          name: 'Notes',
          title: '备注',
          type: 'textarea'
        }
      ]
    }
  },
  {
    path: '/charge/manage/watermeterinroom',
    name: 'Watermeterinroom',
    title: '水表',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'watermeterinroom',
      entityClass: 2,
      selectPanel: {
        extraControls: [
          {
            title: '管理区',
            name: 'ZoneName',
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
          }
        ]
      },
      columns: [
        TABLE_COLUMN_ID,
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
          name: 'RoomName',
          title: '房间号'
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
          name: 'room[0].HireStatus',
          title: '是否出租',
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
          name: 'room[0].UserName',
          title: '用户名称'
        },
        {
          name: 'room[0].WaterChargeClass',
          title: '水费标准'
        },
        {
          name: 'MeterCode',
          title: '水表编号'
        },
        {
          name: 'InitNumber',
          title: '初始读数'
        },
        {
          name: 'ManufactoryCode',
          title: '出厂号'
        },
        {
          name: 'ExchangeRate',
          title: '变比'
        },
        {
          name: 'Notes',
          title: '备注',
          type: 'textarea'
        }
      ]
    }
  },
  {
    path: '/charge/manage/electricitymeterinroom',
    name: 'Electricitymeterinroom',
    title: '电表',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'electricitymeterinroom',
      entityClass: 3,
      selectPanel: {
        extraControls: [
          {
            title: '管理区',
            name: 'ZoneName',
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
          }
        ]
      },
      columns: [
        TABLE_COLUMN_ID,
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
          name: 'RoomName',
          title: '房间号'
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
          name: 'room[0].HireStatus',
          title: '是否出租',
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
          name: 'room[0].UserName',
          title: '用户名称'
        },
        {
          name: 'room[0].ElectricityChargeClass',
          title: '电费标准'
        },
        {
          name: 'MeterCode',
          title: '电表编号'
        },
        {
          name: 'InitNumber',
          title: '初始读数'
        },
        {
          name: 'ManufactoryCode',
          title: '出厂号'
        },
        {
          name: 'ExchangeRate',
          title: '变比'
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
