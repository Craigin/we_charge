<template>
  <div class="xc-charge-stats">
    <!-- <xc-button-panel
      :buttons="actions">
    </xc-button-panel> -->
    <div class="section">
      <xc-select-panel :extraControls="extraControls"></xc-select-panel>
    </div>
    <div class="section">
      <xc-select-panel :controls="controls"></xc-select-panel>
      <xc-select-panel :controls="controls2"></xc-select-panel>
    </div>
    <xc-grid-table
      :data="chargeList"
      :schema="schema"
      :loading="loading">
    </xc-grid-table>
  </div>
</template>

<script>
import _ from 'lodash'
import api from 'api'
import XcSelectPanel from 'components/selectPanel'
import GridTable from 'components/gridTable'
import ButtonPanel from 'components/buttonPanel'

export default {
  name: 'xc-charge-stats',
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
              return list
            })
          }
        },
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
      ],
      zoneList: [],
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
            name: 'CompanyName',
            title: '公司名称',
            width: 130
          },
          {
            name: 'All',
            title: '合计',
            width: 100
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
            title: '用电设施费',
            width: 100
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
            title: '垃圾处理费',
            width: 100
          }
        ]
      }
    }
  },
  created () {
    this.fetchRoomRecordForCompany()
  },
  watch: {
    $route () {
      this.fetchRoomRecordForCompany()
    },
    payStatus () {
      this.fetchRoomRecordForCompany()
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
      } else {
        list.shift()
      }
      return list
    },
    getWhere () {
      let {
        emptyValue = '',
        $route: {
          query: {
            begin,
            end,
            PayStatus
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

      if (PayStatus !== emptyValue) {
        where.PayStatus = PayStatus
      }
      return where
    },
    fetchRoomRecordForCompany () {
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

      api.dataTableSelect({ZoneName, _page: '1,99999'}, {}, {type: 'mysql', database: 'we_charge', table: 'companyhireroom'}).then(data => {
        if (!data.rows.length) {
          this.chargeList = []
          return
        }

        let companyhireroom = data.rows
        let companyGroup = _.groupBy(companyhireroom, 'CompanyName')
        let companyList = _.map(companyGroup, (v, k) => {
          return {
            name: k,
            rooms: v
          }
        })
        console.log('companyList', companyList)
        this.loading = 'loading'
        Promise.all(companyList.map(item => {
          let rooms = item.rooms
          let zoneRow = {
            ZoneName,
            CompanyName: item.name,
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
          return Promise.all(rooms.map(room => {
            let apiQuery = {
              ...this.getWhere(),
              ZoneName: room.ZoneName,
              RoomName: room.RoomName,
              _page: '1,99999'
            }
            return api.dataTableSelect(apiQuery, {}, {type: 'mysql', database: 'we_charge', table: 'roomrecordforuser'}).then(data => {
              // console.log('roomrecordforuser', data)

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
            return zoneRow
          })
        })).then(data => {
          console.log('all', data)
          this.loading = ''
          this.chargeList = data
        }).catch(err => {
          this.loading = ''
          console.error('dataTableSelect error', err)
          this.$message.error('请求超时, 请缩小查询范围')
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-charge-stats {
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
