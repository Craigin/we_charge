<template>
  <div class="xc-charge-stats">
    <xc-button-panel
      :buttons="actions">
    </xc-button-panel>
    <div class="section">
      <xc-select-panel :extraControls="extraControls"></xc-select-panel>
      <xc-select-panel :controls="controls"></xc-select-panel>
      <xc-select-panel :controls="controls2"></xc-select-panel>
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
import {format} from 'utils/dateFormat'

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
          name: 'shouju',
          type: 'primary',
          icon: 'tickets',
          text: '交费处理',
          disabled: false,
          click: {
            name: 'PersonChargeShouJu',
            query: {
              activeMenu: '/charge/manage/pay/person'
            }
          }
        },
        {
          name: 'shoujubyzone',
          type: 'primary',
          icon: 'tickets',
          text: '批量交费处理',
          disabled: false,
          click: {
            name: 'PersonChargeShouJuByZone',
            query: {
              activeMenu: '/charge/manage/pay/person'
            }
          }
        },
        {
          name: 'shouju',
          type: 'primary',
          icon: 'menu',
          text: '交费统计',
          disabled: false,
          click: {
            name: 'ChargeStats',
            query: {
              activeMenu: '/charge/manage/pay/person'
            }
          }
        },
        {
          name: 'notice',
          type: 'primary',
          icon: 'el-icon-bell',
          text: '催费通知',
          disabled: false,
          click: {
            name: 'PersonChargeNotice',
            query: {
              activeMenu: '/charge/manage/pay/person'
            }
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
              value: '1'
            },
            {
              name: '未支付',
              value: '0'
            }
          ]
        }
      ],
      chargeList: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      loading: '',
      schema: {
        hideAction: true,
        columns: [
          {
            name: 'RoomName',
            title: '房间号'
          },
          {
            name: 'RecordDate',
            title: '抄表月份',
            type: 'date',
            text (value) {
              return format(new Date(value), 'yyyy-MM')
            }
          },
          {
            name: 'user_name',
            title: '用户名称'
          },
          {
            name: 'waterInfo.water_charge',
            title: '水费'
          },
          {
            name: 'waterInfo.sewage_charge',
            title: '排水费'
          },
          {
            name: 'electricityInfo.total',
            title: '电费'
          },
          {
            name: 'garbageInfo.total',
            title: '垃圾处理费'
          },
          {
            name: 'addtionalfeeInfo.Charge',
            title: '附加费'
          },
          {
            name: 'total_charge',
            title: '应交总额'
          },
          {
            name: 'pay_note',
            title: '支付备注',
            type: 'textarea'
          },
          {
            name: 'pay_date',
            title: '支付日期',
            type: 'date',
            text (value) {
              if (value) {
                return format(new Date(value), 'yyyy-MM')
              }
            }
          },
          {
            name: 'pay_status',
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
          },
          {
            name: '',
            title: '交费',
            show: true,
            index: 0,
            type: 'icon',
            width: 50,
            cellStyle: {
              textAlign: 'center'
            },
            icons: [
              {
                name: 'mony',
                style: {
                  fontSize: '20px',
                  color: '#23B46C'
                },
                to (row) {
                  return {
                    name: 'PersonChargeShouJu',
                    query: {
                      initRoomName: row.RoomName,
                      activeMenu: '/charge/manage/pay/person'
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    }
  },
  created () {
    this.postListChargeByZone()
  },
  watch: {
    $route () {
      this.postListChargeByZone()
    }
  },
  computed: {
  },
  methods: {
    postListChargeByZone () {
      let {
        $route: {
          query: {
            ZoneName,
            _page = '1,20',
            PayStatus,
            begin,
            end
          }
        }
      } = this
      // let where = getWhere
      if (!ZoneName) {
        return
      }
      let newQuery = {
        ZoneName,
        PayStatus,
        startRecordDate: begin,
        endRecordDate: end,
        _page
      }
      if (!newQuery.PayStatus) {
        delete newQuery.PayStatus
      }

      this.loading = 'loading'
      api.postListChargeByZone(newQuery).then(data => {
        this.loading = ''
        this.chargeList = data.list
        this.pagination = data.pagination
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
    margin: 14px 0;
  }
}
</style>
