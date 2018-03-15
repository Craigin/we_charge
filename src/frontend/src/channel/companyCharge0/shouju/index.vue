<template>
  <div class="xc-person-shouju">
    <xc-button-panel
      :buttons="actions">
    </xc-button-panel>
    <div class="title" @click="test">
      交费处理
    </div>
    <div class="head-info">
      <div class="input-suffix">
        <span>房间号: </span>
        <el-autocomplete
          class="inline-input"
          v-model="roomName"
          :fetch-suggestions="querySearch"
          placeholder="请输入房间号"
          @blur="searchRoomInfo"
          @select="handleSelect">
        </el-autocomplete>
      </div>
      <xc-select-panel
        v-if="controls || extraControls.length"
        :controls="controls"
        :extraControls="extraControls">
      </xc-select-panel>
    </div>

    <div class="title">
      水表抄表录入
    </div>
    <xc-grid-table
      :data="chargeList"
      :pagination="pagination"
      :schema="schema"
      :loading="loading">
    </xc-grid-table>

    <div class="foot">
      <el-button
        :disabled="!waterData.length && !electricityData.length"
        type="success"
        @click="submit">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import api from 'api'
import XcSelectPanel from 'components/selectPanel'
import XcGridTable from 'components/gridTable'
import {
  zoneName
} from 'router/dataTables/appCommon'
import ButtonPanel from 'components/buttonPanel'
import {format} from 'utils/dateFormat'
import {getHtml} from 'utils/lodop'

export default {
  name: 'xc-person-shouju',
  components: {
    XcGridTable,
    XcSelectPanel,
    'xc-button-panel': ButtonPanel
  },
  props: {
  },
  data () {
    return {
      actions: [
        {
          name: 'back',
          type: 'primary',
          icon: 'arrow-left',
          text: '返回',
          disabled: false,
          click: {
            name: 'PersonCharge'
          }
        }
      ],
      controls: {
        dayPicker: {
          name: 'RecordDate',
          dateType: 'month',
          placeholder: '选择日期'
        }
      },
      extraControls: [
        zoneName
      ],
      roomInfo: {
        UserName: '',
        WaterChargeClass: '',
        ElectricityChargeClass: '',
        GarbageChargeClass: ''
      },
      roomName: '',
      rooms: [],
      waterData: [],
      electricityData: [],
      chargeList: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      loading: '',
      schema: {
        hideAction: true,
        columns: [
          {
            name: 'RecordDate',
            title: '抄表月份',
            type: 'date',
            text (value) {
              return format(new Date(value), 'yyyy-MM')
            }
          }
          // {
          //   // name: 'Electricity_LastNumber',
          //   name: 'electricitymeterrecord[0].LastNumber',
          //   title: '电表本月读数'
          // },
          // {
          //   // name: 'Electricity_PreviousNumber',
          //   name: 'electricitymeterrecord[0].PreviousNumber',
          //   title: '电表上月读数'
          // },
          // {
          //   // name: 'ElectricityChargeSum',
          //   title: '电费',
          //   text (value, row) {
          //     let {
          //       roomelectricitycharge: [
          //         {
          //           Electricity_Charge: ElectricityCharge = 0,
          //           Equipment_Charge: EquipmentCharge = 0
          //         } = {}
          //       ]
          //     } = row
          //     return (ElectricityCharge + EquipmentCharge) * 100 / 100
          //   }
          // },
          // {
          //   name: 'ElectricityChargeClass',
          //   title: '电费标准'
          // },
          // {
          //   // name: 'Electricity_UsedNumberSum',
          //   name: 'roomelectricitycharge[0].UseNumber',
          //   title: '电实际用量'
          // },
          // {
          //   name: 'RoomName',
          //   title: '房间号'
          // },
          // {
          //   // name: 'AddtionalChargeSum',
          //   name: 'addtionalfeeforroom[0].Charge',
          //   title: '附加费'
          // },
          // {
          //   name: 'Addtional1ChargeSum',
          //   title: '附加费1',
          //   show: false
          // },
          // {
          //   name: 'Addtional2ChargeSum',
          //   title: '附加费2',
          //   show: false
          // },
          // {
          //   name: 'ZoneName',
          //   title: '管理区'
          // },
          // {
          //   // name: 'GarbageChargeSum',
          //   name: 'roomgarbagecharge[0].Charge',
          //   title: '垃圾处理费'
          // },
          // {
          //   name: 'GarbageChargeClass',
          //   title: '垃圾处理费标准'
          // },
          // {
          //   // name: 'SewageChargeSum',
          //   name: 'roomwatercharge[0].Sewage_Charge',
          //   title: '排污费'
          // },
          // {
          //   // name: 'Water_LastNumberSum',
          //   name: 'watermeterrecord[0].LastNumber',
          //   title: '水表本月读数'
          // },
          // {
          //   // name: 'Water_PreviousNumberSum',
          //   name: 'watermeterrecord[0].PreviousNumber',
          //   title: '水表上月读数'
          // },
          // {
          //   // name: 'WaterChargeSum',
          //   title: '水费',
          //   text (value, row) {
          //     let {
          //       roomwatercharge: [
          //         {
          //           Water_Charge: WaterCharge = 0,
          //           Sewage_Charge: SewageCharge = 0
          //         } = {}
          //       ]
          //     } = row
          //     return (WaterCharge + SewageCharge) * 100 / 100
          //   }
          // },
          // {
          //   name: 'WaterChargeClass',
          //   title: '水费标准'
          // },
          // {
          //   // name: 'Water_UsedNumberSum',
          //   name: 'roomwatercharge[0].UseNumber',
          //   title: '水实际用量'
          // },
          // {
          //   name: 'ChargeSum',
          //   title: '应交总额'
          // },
          // {
          //   // name: 'EquipmentChargeSum',
          //   name: 'roomelectricitycharge[0].Equipment_Charge',
          //   title: '用电设施费'
          // },
          // {
          //   name: 'UserName',
          //   title: '用户名称'
          // },
          // {
          //   name: 'PayNotes',
          //   title: '支付备注',
          //   type: 'textarea'
          // },
          // {
          //   name: 'PayDate',
          //   title: '支付日期',
          //   type: 'date',
          //   text (value) {
          //     if (value) {
          //       return format(new Date(value), 'yyyy-MM')
          //     }
          //   }
          // },
          // {
          //   name: 'PayStatus',
          //   title: '支付状态',
          //   type: 'select',
          //   options: [
          //     {
          //       name: '未支付',
          //       value: 0
          //     },
          //     {
          //       name: '已支付',
          //       value: 1
          //     }
          //   ]
          // }
        ]
      }
    }
  },
  created () {
    this.searchRoomName()
    this.searchRoomInfo()
  },
  watch: {
    $route () {
      this.searchRoomName()
      this.searchRoomInfo()
    }
  },
  computed: {
    searchRoomNames () {
      let {rooms} = this
      return rooms.map(item => {
        return {
          value: item.RoomName
        }
      })
    }
  },
  methods: {
    test () {
      let x = getHtml('shouju')
      console.log('xxxtemp', x)
    },
    submit () {

    },
    calculate () {
      this.waterData.push()
      this.electricityData.push()
    },
    searchRoomName () {
      let {
        query: {
          ZoneName
        }
      } = this.$route
      let apiQuery = {
        _page: '1,999',
        ZoneName
      }
      api.dataTableSelect(apiQuery, {}, {type: 'mysql', database: 'we_charge', table: 'room'}).then(data => {
        this.rooms = data.rows
      })
    },
    querySearch (queryString, cb) {
      let {
        searchRoomNames
      } = this
      let res = queryString ? searchRoomNames.filter(this.createFilter(queryString)) : searchRoomNames
      cb(res)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      this.searchRoomInfo()
    },
    searchRoomInfo () {
      let {
        $route: {
          query: {
            ZoneName,
            RecordDate
          }
        },
        roomName
      } = this
      if (!roomName) {
        this.roomInfo = {}
        this.waterData = []
        this.electricityData = []
        return
      }
      let apiQuery = {
        _page: '1,999',
        ZoneName,
        RoomName: roomName
      }
      api.dataTableSelect(apiQuery, {}, {type: 'mysql', database: 'we_charge', table: 'room'}).then(data => {
        this.roomInfo = data.rows[0] || {}
      })

      api.dataTableSelect(apiQuery, {}, {type: 'mysql', database: 'we_charge', table: 'watermeterinroom'}).then(data => {
        this.waterData = data.rows
        this.waterData.forEach(item => {
          let _query = {
            ...apiQuery,
            _page: '1,5',
            MeterCode: item.MeterCode
          }
          api.dataTableSelect(_query, {}, {type: 'mysql', database: 'we_charge', table: 'watermeterrecord'}).then(data => {
            let one = data.rows[0] || {}
            let nowTime = new Date(RecordDate).getTime()
            let lastTime = new Date(one.RecordDate).getTime()
            let diff = nowTime <= lastTime
            this.waterRecordMonth = Math.floor((nowTime - lastTime) / 24 / 3600 / 1000 / 30)
            if (!one.RecordDate) {
              this.waterRecordMonth = 1
            }

            if (diff) {
              this.$set(item, 'hasRecord', true)
              item.PreviousNumber = one.PreviousNumber
              item.LastNumber = one.LastNumber
              item.Notes = one.Notes
            } else {
              item.PreviousNumber = one.LastNumber
              item.LastNumber = ''
            }

            this.waterData.push()
          })
        })
      })

      api.dataTableSelect(apiQuery, {}, {type: 'mysql', database: 'we_charge', table: 'electricitymeterinroom'}).then(data => {
        this.electricityData = data.rows
        this.electricityData.forEach(item => {
          let _query = {
            ...apiQuery,
            _page: '1,5',
            MeterCode: item.MeterCode
          }
          api.dataTableSelect(_query, {}, {type: 'mysql', database: 'we_charge', table: 'electricitymeterrecord'}).then(data => {
            let one = data.rows[0] || {}
            let nowTime = new Date(RecordDate).getTime()
            let lastTime = new Date(one.RecordDate).getTime()
            let diff = nowTime <= lastTime
            this.eleRecordMonth = Math.floor((nowTime - lastTime) / 24 / 3600 / 1000 / 30)
            if (!one.RecordDate) {
              this.eleRecordMonth = 1
            }

            if (diff) {
              this.$set(item, 'hasRecord', true)
              item.PreviousNumber = one.PreviousNumber
              item.LastNumber = one.LastNumber
              item.Notes = one.Notes
            } else {
              item.PreviousNumber = one.LastNumber
              item.LastNumber = ''
            }

            this.electricityData.push()
          })
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-person-shouju {
  .title {
    margin: 10px 0;
    font-weight: bold;
  }
  .head-info {
    display: flex;
    margin: 8px 0px;
    .input-suffix {
      display: flex;
      align-items: center;
      margin-right: 18px;
      input {
        margin-left: 8px;
        width: 179px;
      }
    }
  }
  .error {
    color: $main_red;
  }
  .success {
    color: $main_link;
  }
  .foot {
    margin-top: 16px;
  }
}
</style>
