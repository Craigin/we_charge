// import api from 'api'
import {
  DB_WECHARGE_NAME,
  TABLE_COLUMN_ID
} from './common'
import {
  // dayPicker,
  zoneName
  // referRoomColumns
} from './appCommon'
import {format} from 'utils/dateFormat'

export default [
  {
    path: '/system/setting/ZoneName',
    name: 'ZoneName',
    title: '管理区',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'zone',
      entityClass: null,
      actions: ['create'],
      selectPanel: {},
      columns: [
        TABLE_COLUMN_ID,
        {
          name: 'ZoneName',
          title: '管理区'
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
    path: '/system/setting/users',
    name: 'users',
    title: '用户管理',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'applicationuser',
      entityClass: null,
      actions: ['create'],
      selectPanel: {},
      columns: [
        {
          name: 'UserID',
          title: '账号'
        },
        {
          name: 'Password',
          title: '密码',
          text () {
            return '******'
          }
        },
        {
          name: 'sectors',
          title: '部门'
        },
        {
          name: 'IsAdmin',
          title: '是否为管理员',
          type: 'select',
          options: [
            {
              name: '否',
              value: 0
            },
            {
              name: '是',
              value: 1
            }
          ]
        }
      ]
    }
  },
  {
    path: '/system/setting/waterchargeclass/type',
    name: 'WaterChargeClassType',
    title: '水费类别',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'waterchargeclass',
      entityClass: null,
      formLabelWidth: '100px',
      actions: ['create'],
      selectPanel: {},
      columns: [
        TABLE_COLUMN_ID,
        {
          name: '',
          title: '计费规则',
          show: true,
          index: 0,
          type: 'icon',
          width: 80,
          cellStyle: {
            display: 'flex',
            justifyContent: 'center'
          },
          icons: [
            {
              name: 'icon-humidity',
              style: {
                fontSize: '18px',
                color: '#23B46C'
              },
              to (row) {
                return {
                  name: 'WaterChargeClassRule',
                  query: {
                    ClassName: row.ClassName
                  }
                }
              }
            }
          ]
        },
        {
          name: 'ClassName',
          title: '水费类别'
        },
        {
          name: 'SewagePercent',
          title: '排污量占用水量的百分比',
          type: 'integer'
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
    path: '/system/setting/waterchargeclass/rule',
    name: 'WaterChargeClassRule',
    title: '水费规则',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'waterchargerule',
      entityClass: null,

      actions: ['create'],
      selectPanel: {},
      columns: [
        TABLE_COLUMN_ID,
        {
          name: 'ClassName',
          title: '水费类别'
        },
        {
          name: 'GradeIndex',
          title: '等级'
        },
        {
          name: 'Start_Quantity',
          title: '起始用量(吨)'
        },
        {
          name: 'Over_Quantity',
          title: '终止用量(吨)'
        },
        {
          name: 'Water_UnitPrice',
          title: '水费单价'
        },
        {
          name: 'Sewage_UnitPrice',
          title: '排污费单价'
        }
      ]
    }
  },
  {
    path: '/system/setting/electricitychargeclass/type',
    name: 'ElectricitychargeclassType',
    title: '电费类别',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'electricitychargeclass',
      entityClass: null,
      formLabelWidth: '100px',

      actions: ['create'],
      selectPanel: {},
      columns: [
        TABLE_COLUMN_ID,
        {
          name: '',
          title: '计费规则',
          show: true,
          index: 0,
          type: 'icon',
          width: 80,
          cellStyle: {
            display: 'flex',
            justifyContent: 'center'
          },
          icons: [
            {
              name: 'iconfontchangemeter-copy',
              style: {
                fontSize: '18px',
                color: '#23B46C'
              },
              to (row) {
                return {
                  name: 'ElectricitychargeclassRule',
                  query: {
                    ClassName: row.ClassName
                  }
                }
              }
            }
          ]
        },
        {
          name: 'ClassName',
          title: '电费类别'
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
    path: '/system/setting/electricitychargeclass/rule',
    name: 'ElectricitychargeclassRule',
    title: '电费规则',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'electricitychargerule',
      entityClass: null,
      formLabelWidth: '112px',
      actions: ['create'],
      selectPanel: {},
      columns: [
        TABLE_COLUMN_ID,
        {
          name: 'ClassName',
          title: '电费类别'
        },
        {
          name: 'GradeIndex',
          title: '等级'
        },
        {
          name: 'Start_Quantity',
          title: '起始用量(度)'
        },
        {
          name: 'Over_Quantity',
          title: '终止用量(度)'
        },
        {
          name: 'Electricity_UnitPrice',
          title: '电费单价'
        },
        {
          name: 'Equipment_UnitPrice',
          title: '用电设备费单价'
        }
      ]
    }
  },
  {
    path: '/system/setting/garbagechargeclass',
    name: 'Garbagechargeclass',
    title: '垃圾处理费标准',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'garbagechargeclass',
      entityClass: null,
      formLabelWidth: '126px',
      actions: ['create'],
      selectPanel: {},
      columns: [
        TABLE_COLUMN_ID,
        {
          name: 'ClassName',
          title: '类别名称'
        },
        {
          name: 'CalcType',
          title: '计算方式',
          type: 'select',
          options: [
            {
              name: '不用收费',
              value: 1
            },
            {
              name: '按实际用水量计算',
              value: 2
            }
          ]
        },
        {
          name: 'PriceByUnitWater',
          title: '每吨水垃圾处理费'
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
    path: '/system/setting/sys_dictionary/fujia',
    name: 'SysDictionary',
    title: '附加费定义',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'sys_dictionary',
      entityClass: null,
      actions: ['create'],
      selectPanel: {},
      defaultQuery: {
        ItemClass: 2
      },
      columns: [
        TABLE_COLUMN_ID,
        {
          name: 'ItemName',
          title: '项目名称'
        },
        {
          name: 'NeedCopyFromPreMonth',
          title: '从上月复制作为缺省值',
          type: 'select',
          options: [
            {
              name: '是',
              value: 1
            },
            {
              name: '否',
              value: 0
            }
          ]
        }
      ]
    }
  },
  {
    path: '/system/setting/sys_dictionary/baozheng',
    name: 'SysDictionary',
    title: '保证金定义',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'sys_dictionary',
      entityClass: null,
      actions: ['create'],
      selectPanel: {},
      defaultQuery: {
        ItemClass: 1
      },
      columns: [
        TABLE_COLUMN_ID,
        {
          name: 'ItemName',
          title: '项目名称'
        },
        {
          name: 'NeedCopyFromPreMonth',
          title: '从上月复制作为缺省值',
          type: 'select',
          options: [
            {
              name: '是',
              value: 1
            },
            {
              name: '否',
              value: 0
            }
          ]
        }
      ]
    }
  },
  {
    path: '/charge/manage/bond',
    name: 'Deposit',
    title: '保证金',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'deposit',
      entityClass: 8,
      selectPanel: {
        extraControls: [
          zoneName
        ]
      },
      columns: [
        TABLE_COLUMN_ID,
        {
          name: 'ZoneName',
          title: '管理区'
        },
        {
          name: 'OwnerName',
          title: '用户名称'
        },
        {
          name: 'ItemName',
          title: '项目名称'
        },
        {
          name: 'CheckInDate',
          title: '交款日期',
          type: 'date',
          text (value) {
            if (value) {
              return format(new Date(value), 'yyyy-MM-dd')
            }
          }
        },
        {
          name: 'Charge',
          title: '金额'
        },
        {
          name: 'CheckInNotes',
          title: '交款备注'
        },
        {
          name: 'CheckOutDate',
          title: '退款日期',
          type: 'date',
          text (value) {
            if (value) {
              return format(new Date(value), 'yyyy-MM-dd')
            }
          }
        },
        {
          name: 'CheckOutNotes',
          title: '退款备注'
        }
      ]
    }
  }
]
