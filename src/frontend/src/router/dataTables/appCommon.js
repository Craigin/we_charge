import api from 'api'
import {
  DB_WECHARGE_NAME
} from './common'

export let dayRangePicker = {
  name: 'RecordDate',
  dateType: 'daterange',
  unlink: true
}

export let dayPicker = {
  name: 'RecordDate',
  dateType: 'month',
  placeholder: '选择日期'
}

export let zoneName = {
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
}

export let referRoomColumns = [
  {
    disabled: true,
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
    disabled: true,
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
    disabled: true,
    name: 'RoomName',
    title: '房间号'
  },
  {
    disabled: true,
    name: 'room[0].UserName',
    title: '用户名称'
  },
  {
    disabled: true,
    name: 'room[0].WaterChargeClass',
    title: '水费标准'
  },
  {
    disabled: true,
    name: 'room[0].ElectricityChargeClass',
    title: '电费标准'
  },
  {
    disabled: true,
    name: 'room[0].GarbageChargeClass',
    title: '垃圾费标准'
  },
  {
    disabled: true,
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
    disabled: true,
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
    disabled: true,
    name: 'room[0].Notes',
    title: '备注'
  }
]

export let referWatermeterinroomColumns = [
  {
    name: 'ManufactoryCode',
    title: '出厂号'
  }
]
