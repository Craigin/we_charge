<template>
  <div class="xc-charge-stats">
    <xc-button-panel
      :buttons="actions">
    </xc-button-panel>
    <div class="section">
      <xc-select-panel :extraControls="extraControls"></xc-select-panel>
    </div>
    <div class="section">
      <xc-select-panel :controls="controls"></xc-select-panel>
      <!-- <el-checkbox-group v-model="roomClassList" :min="1">
        <el-checkbox label="0" >个人租房</el-checkbox>
        <el-checkbox label="1" >公司租房</el-checkbox>
      </el-checkbox-group> -->
    </div>
    <div class="section">
      <xc-select-panel :controls="controls2"></xc-select-panel>
      <!-- <el-radio-group v-model="payStatus">
        <el-radio :label="2">所有水电费及附加费</el-radio>
        <el-radio :label="1">已付水电费及附加费</el-radio>
        <el-radio :label="0">未付水电费及附加费</el-radio>
      </el-radio-group> -->
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
            name: 'PersonCharge'
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
          // {
          //   name: 'UseNumberWater',
          //   title: '水用量'
          // },
          {
            name: 'water_charge',
            title: '水费'
          },
          {
            name: 'sewage_charge',
            title: '排水费'
          },
          {
            name: 'water_totalcharge',
            title: '水费小计'
          },
          // {
          //   name: 'UseNumberElectricity',
          //   title: '电用量'
          // },
          {
            name: 'electricity_charge',
            title: '电费'
          },
          {
            name: 'equipment_charge',
            title: '用电设施费'
          },
          {
            name: 'electricity_totalcharge',
            title: '电费小计'
          },
          {
            name: 'addtionalfee_totalcharge',
            title: '附加费'
          },
          {
            name: 'garbage_totalcharge',
            title: '垃圾处理费'
          },
          {
            name: 'totalcharge',
            title: '合计'
          }
        ]
      }
    }
  },
  created () {
    this.countZoneChargeByTime()
  },
  watch: {
    $route () {
      this.countZoneChargeByTime()
    },
    roomClassList () {
      this.countZoneChargeByTime()
    },
    payStatus () {
      this.countZoneChargeByTime()
    }
  },
  computed: {
  },
  methods: {
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
    countZoneChargeByTime () {
      let {
        $route: {
          query: {
            ZoneName,
            begin,
            end
          }
        }
      } = this
      if (!ZoneName) {
        return
      }

      let q = {
        ZoneName,
        startRecordDate: begin,
        endRecordDate: end
      }

      this.loading = 'loading'
      api.countZoneChargeByTime(q).then(data => {
        // console.log('all', data)
        this.loading = ''
        if (!data) {
          return
        }
        this.chargeList = [data]
      }).catch(err => {
        this.loading = ''
        console.error('dataTableSelect error', err)
        this.$message.error('请求超时, 请缩小查询范围, 时间跨度不要过大')
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
