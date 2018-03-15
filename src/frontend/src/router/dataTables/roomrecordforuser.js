// import api from 'api'
import {
  DB_WECHARGE_NAME,
  TABLE_COLUMN_ID
} from './common'
import {
  dayPicker,
  zoneName
} from './appCommon'

import {format} from 'utils/dateFormat'

export default [
  {
    path: '/charge/manage/pay/person',
    name: 'Roomrecordforuser',
    title: '个人交费',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'roomrecordforuser',
      entityClass: 6,
      selectPanel: {
        controls: {
          dayPicker
        },
        extraControls: [
          zoneName,
          {
            title: '支付',
            placeholder: '请选择',
            name: 'PayStatus',
            selected: '',
            options: [
              {
                name: '不限',
                value: ''
              },
              {
                name: '已支付',
                value: 1
              },
              {
                name: '未支付',
                value: 0
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
            icon: 'printer',
            text: '统计',
            disabled: false,
            click: {
              name: 'ChargeStats',
              query: {
                activeMenu: '/charge/manage/pay/person'
              }
            }
          }
        ]
        return defaultActions.filter(item => item.name === 'columnList' || item.name === 'print').concat(actions)
      },
      hideActionColumn: true,
      columns: [
        TABLE_COLUMN_ID,
        {
          name: 'RecordDate',
          title: '抄表月份',
          type: 'date',
          text (value) {
            return format(new Date(value), 'yyyy-MM')
          }
        },
        {
          // name: 'Electricity_LastNumber',
          name: 'electricitymeterrecord[0].LastNumber',
          title: '电表本月读数'
        },
        {
          // name: 'Electricity_PreviousNumber',
          name: 'electricitymeterrecord[0].PreviousNumber',
          title: '电表上月读数'
        },
        {
          // name: 'ElectricityChargeSum',
          title: '电费',
          text (value, row) {
            let {
              roomelectricitycharge: [
                {
                  Electricity_Charge: ElectricityCharge = 0,
                  Equipment_Charge: EquipmentCharge = 0
                } = {}
              ]
            } = row
            return (ElectricityCharge + EquipmentCharge) * 100 / 100
          }
        },
        {
          name: 'ElectricityChargeClass',
          title: '电费标准'
        },
        {
          // name: 'Electricity_UsedNumberSum',
          name: 'roomelectricitycharge[0].UseNumber',
          title: '电实际用量'
        },
        {
          name: 'RoomName',
          title: '房间号'
        },
        {
          // name: 'AddtionalChargeSum',
          name: 'addtionalfeeforroom[0].Charge',
          title: '附加费'
        },
        {
          name: 'Addtional1ChargeSum',
          title: '附加费1',
          show: false
        },
        {
          name: 'Addtional2ChargeSum',
          title: '附加费2',
          show: false
        },
        {
          name: 'ZoneName',
          title: '管理区'
        },
        {
          // name: 'GarbageChargeSum',
          name: 'roomgarbagecharge[0].Charge',
          title: '垃圾处理费'
        },
        {
          name: 'GarbageChargeClass',
          title: '垃圾处理费标准'
        },
        {
          // name: 'SewageChargeSum',
          name: 'roomwatercharge[0].Sewage_Charge',
          title: '排污费'
        },
        {
          // name: 'Water_LastNumberSum',
          name: 'watermeterrecord[0].LastNumber',
          title: '水表本月读数'
        },
        {
          // name: 'Water_PreviousNumberSum',
          name: 'watermeterrecord[0].PreviousNumber',
          title: '水表上月读数'
        },
        {
          // name: 'WaterChargeSum',
          title: '水费',
          text (value, row) {
            let {
              roomwatercharge: [
                {
                  Water_Charge: WaterCharge = 0,
                  Sewage_Charge: SewageCharge = 0
                } = {}
              ]
            } = row
            return (WaterCharge + SewageCharge) * 100 / 100
          }
        },
        {
          name: 'WaterChargeClass',
          title: '水费标准'
        },
        {
          // name: 'Water_UsedNumberSum',
          name: 'roomwatercharge[0].UseNumber',
          title: '水实际用量'
        },
        {
          name: 'ChargeSum',
          title: '应交总额'
        },
        {
          // name: 'EquipmentChargeSum',
          name: 'roomelectricitycharge[0].Equipment_Charge',
          title: '用电设施费'
        },
        {
          name: 'UserName',
          title: '用户名称'
        },
        {
          name: 'PayNotes',
          title: '支付备注',
          type: 'textarea'
        },
        {
          name: 'PayDate',
          title: '支付日期',
          type: 'date',
          text (value) {
            if (value) {
              return format(new Date(value), 'yyyy-MM')
            }
          }
        },
        {
          name: 'PayStatus',
          title: '支付状态',
          type: 'select',
          options: [
            {
              name: '未支付',
              value: 0
            },
            {
              name: '已支付',
              value: 1
            }
          ]
        }
      ]
    }
  }
]
