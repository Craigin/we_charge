<template>
  <div class="xc-unfinsh-record">
    <xc-button-panel
      :buttons="actions">
    </xc-button-panel>
    <div class="section">
      <xc-select-panel :controls="controls" :extraControls="extraControls"></xc-select-panel>
    </div>

    <xc-grid-table
      :data="chargeList"
      :pagination="pagination"
      :schema="schema"
      :loading="loading">
    </xc-grid-table>
  </div>
</template>

<script>
// import _ from 'lodash'
import api from 'api'
import XcSelectPanel from 'components/selectPanel'
import GridTable from 'components/gridTable'
import ButtonPanel from 'components/buttonPanel'
// import {format} from 'utils/dateFormat'
// import {
//   DB_WECHARGE_NAME
// } from 'router/dataTables/common'

export default {
  name: 'xc-unfinsh-record',
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
            name: 'Watermeterrecord'
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
        },
        {
          name: 'recordType',
          title: '水电表',
          type: 'select',
          selected: 'water',
          options: [
            {
              name: '水表记录',
              value: 'water'
            },
            {
              name: '电表记录',
              value: 'electricity'
            }
          ]
        }
      ],
      zoneList: [],
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
            name: 'ZoneName',
            title: '管理区',
            type: 'select'
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
            type: 'select'
          },
          {
            name: 'ElectricityChargeClass',
            title: '电费标准',
            type: 'select'
          },
          {
            name: 'GarbageChargeClass',
            title: '垃圾费标准',
            type: 'select'
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
    }
  },
  created () {
    this.listUnrecordRooms()
  },
  watch: {
    $route () {
      this.listUnrecordRooms()
    }
  },
  computed: {
  },
  methods: {
    test () {
      let LODOP = window.getLodop()
      console.log('xxxtemp', LODOP)
    },
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
    listUnrecordRooms () {
      let {
        $route: {
          query: {
            ZoneName,
            RecordDate,
            recordType: type,
            _page = '1,20'
          }
        }
      } = this
      if (!ZoneName) {
        return
      }
      let newQuery = {
        ZoneName,
        RecordDate,
        type,
        _page
      }

      this.loading = 'loading'
      api.listUnrecordRooms(newQuery).then(data => {
        this.loading = ''
        this.chargeList = data
        // this.pagination = data.pagination
        console.log('xxxtemp', data)
      }).catch(err => {
        this.loading = ''
        console.error('getListChargeByRooms error', err)
        this.$message.error('请求错误')
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-unfinsh-record {
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
