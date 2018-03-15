<template>
  <div class="xc-shouju-zone">
    <div class="section-title">
      管理区水电费统计
      <xc-button-panel
        :buttons="actions">
      </xc-button-panel>
    </div>
    <div class="section">
      <xc-select-panel :extraControls="extraControls"></xc-select-panel>
    </div>
    <div class="section">
      <xc-select-panel :controls="controls"></xc-select-panel>
      <el-checkbox-group v-model="roomClassList" :min="1">
        <el-checkbox label="0" >个人租房</el-checkbox>
        <el-checkbox label="1" >公司租房</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="section">
      <xc-select-panel :controls="controls2"></xc-select-panel>
      <el-radio-group v-model="payStatus">
        <el-radio :label="2">所有水电费及附加费</el-radio>
        <el-radio :label="1">已付水电费及附加费</el-radio>
        <el-radio :label="0">未付水电费及附加费</el-radio>
      </el-radio-group>
    </div>
    <xc-grid-table
      :data="chargeList"
      :schema="schema"
      :loading="loading">
    </xc-grid-table>
  </div>
</template>

<script>
import api from 'api'
import XcSelectPanel from 'components/selectPanel'
import GridTable from 'components/gridTable'
import ButtonPanel from 'components/buttonPanel'

export default {
  name: 'xc-shouju-zone',
  components: {
    XcSelectPanel,
    'xc-grid-table': GridTable,
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
            name: 'Roomrecordforuser'
          }
        }
      ],
      controls: {
        dayPicker: {
          name: 'begin',
          dateType: 'month',
          placeholder: '选择日期',
          title: '起始月份',
          clearable: false
        }
      },
      controls2: {
        dayPicker: {
          name: 'end',
          dateType: 'month',
          placeholder: '选择日期',
          title: '终止月份',
          clearable: false
        }
      },
      extraControls: [
        {
          name: 'ZoneName',
          title: '管理区',
          type: 'select',
          options: () => {
            return api.dataTableSelect({_page: '1,99999'}, {}, {type: 'mysql', database: 'we_charge', table: 'zone'}).then(data => {
              let list = data.rows.map(item => {
                return {
                  ...item,
                  name: item.ZoneName,
                  value: item.ZoneName
                }
              })
              // list.unshift({
              //   name: '全部',
              //   value: ''
              // })
              this.zoneList = list
              // this.fetchRoomRecordForUser()
              return list
            })
          }
        }
      ],
      zoneList: [],
      roomClassList: ['0', '1'],
      payStatus: 2,
      chargeList: [],
      loading: '',
      schema: {
        hideAction: true,
        columns: [
          {
            name: 'ZoneName',
            title: '管理区',
            width: 130
          },
          {
            name: 'UseNumberWater',
            title: '水用量'
          },
          {
            name: 'WaterCharge',
            title: '水费'
          },
          {
            name: 'SewageCharge',
            title: '排水费'
          },
          {
            name: 'AllWaterCharge',
            title: '水费小计'
          },
          {
            name: 'UseNumberElectricity',
            title: '电用量'
          },
          {
            name: 'ElectricityCharge',
            title: '电费'
          },
          {
            name: 'EquipmentCharge',
            title: '用电设施费'
          },
          {
            name: 'AllElectricityCharge',
            title: '电费小计'
          },
          {
            name: 'AddtionalCharge',
            title: '附加费'
          },
          {
            name: 'GarbageCharge',
            title: '垃圾处理费'
          },
          {
            name: 'All',
            title: '合计'
          }
        ]
      }
    }
  },
  created () {
    this.fetchRoomRecordForUser()
  },
  watch: {
    $route () {
      this.fetchRoomRecordForUser()
    },
    roomClassList () {
      this.fetchRoomRecordForUser()
    },
    payStatus () {
      this.fetchRoomRecordForUser()
    }
  },
  computed: {
  },
  methods: {
    getZones () {
      let {
        $route: {
          query: {
            ZoneName
          }
        },
        zoneList
      } = this
      let list = [...zoneList]
      if (ZoneName) {
        list = [{
          name: ZoneName,
          value: ZoneName
        }]
      }
      return list
    },
    getWhere () {
      let {
        roomClassList,
        payStatus,
        $route: {
          query: {
            begin,
            end
          }
        }
      } = this
      let where = {}

      if (begin || end) {
        where.RecordDate = {}
        if (begin) {
          where.RecordDate.$gte = begin
        }
        if (end) {
          where.RecordDate.$lte = end
        }
      }

      where.RoomClass = {
        $or: roomClassList
      }

      if (payStatus !== 2) {
        where.PayStatus = payStatus
      }
      // console.log('where', where)
      return where
    },
    fetchRoomRecordForUser () {
      let {
        $route: {
          query: {
            ZoneName
          }
        }
      } = this
      // console.log('ZoneName', ZoneName)
      if (!ZoneName) {
        return
      }
      let zones = [{
        name: ZoneName,
        value: ZoneName
      }]
      // console.log('zones', zones)

      this.loading = 'loading'
      Promise.all(zones.map(item => {
        let apiQuery = {
          ...this.getWhere(),
          ZoneName: item.value,
          _page: '1,99999'
        }
        // console.log('xxxtemp', apiQuery)
        return api.dataTableSelect(apiQuery, {}, {type: 'mysql', database: 'we_charge', table: 'roomrecordforuser'}).then(data => {
          // console.log('xxxtemp', data)
          let zoneRow = {
            ZoneName: item.value,
            UseNumberWater: 0,
            AllWaterCharge: 0,
            WaterCharge: 0,
            SewageCharge: 0,
            UseNumberElectricity: 0,
            AllElectricityCharge: 0,
            ElectricityCharge: 0,
            EquipmentCharge: 0,
            GarbageCharge: 0,
            AddtionalCharge: 0,
            All: 0
          }
          for (let row of data.rows) {
            let {
              roomwatercharge: [
                {
                  UseNumber: UseNumberWater = 0,
                  Water_Charge: WaterCharge = 0,
                  Sewage_Charge: SewageCharge = 0
                } = {}
              ],
              roomelectricitycharge: [
                {
                  UseNumber: UseNumberElectricity = 0,
                  Electricity_Charge: ElectricityCharge = 0,
                  Equipment_Charge: EquipmentCharge = 0
                } = {}
              ],
              roomgarbagecharge: [
                {
                  Charge: GarbageCharge = 0
                } = {}
              ],
              addtionalfeeforroom: [
                {
                  Charge: AddtionalCharge = 0
                } = {}
              ]
            } = row
            zoneRow.WaterCharge = zoneRow.WaterCharge + WaterCharge
            zoneRow.SewageCharge = zoneRow.SewageCharge + SewageCharge
            // zoneRow.AllWaterCharge = zoneRow.WaterCharge + zoneRow.SewageCharge
            zoneRow.UseNumberWater = zoneRow.UseNumberWater + UseNumberWater

            zoneRow.ElectricityCharge = zoneRow.ElectricityCharge + ElectricityCharge
            zoneRow.EquipmentCharge = zoneRow.EquipmentCharge + EquipmentCharge
            // zoneRow.AllElectricityCharge = zoneRow.ElectricityCharge + zoneRow.EquipmentCharge
            zoneRow.UseNumberElectricity = zoneRow.UseNumberElectricity + UseNumberElectricity

            zoneRow.GarbageCharge = zoneRow.GarbageCharge + GarbageCharge

            zoneRow.AddtionalCharge = zoneRow.AddtionalCharge + AddtionalCharge
          }
          zoneRow.AllWaterCharge = zoneRow.WaterCharge + zoneRow.SewageCharge
          zoneRow.AllElectricityCharge = zoneRow.ElectricityCharge + zoneRow.EquipmentCharge
          zoneRow.All = zoneRow.AllWaterCharge + zoneRow.AllElectricityCharge + zoneRow.GarbageCharge + zoneRow.AddtionalCharge

          for (let key in zoneRow) {
            let _value = zoneRow[key]
            if (typeof _value === 'number') {
              zoneRow[key] = +_value.toFixed(2)
            }
          }
          return zoneRow
        })
      })).then(data => {
        // console.log('all', data)
        this.loading = ''
        this.chargeList = data
      }).catch(err => {
        this.loading = ''
        console.error('dataTableSelect error', err)
        this.$message.error('请求超时, 请缩小查询范围')
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-shouju-zone {
  .section-title {
    font-weight: bold;
    display: flex;
    align-items: center;
    .xc-button-panel {
      margin-left: 12px;
    }
  }
  .section {
    display: flex;
    align-items: center;
    margin: 6px 0;
  }
}
</style>
