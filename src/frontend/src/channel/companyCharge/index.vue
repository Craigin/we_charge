<template>
  <div class="xc-charge-stats">
    <xc-button-panel
      :buttons="actions">
    </xc-button-panel>
    <div class="section">
      <xc-select-panel :extraControls="extraControls"></xc-select-panel>
      <xc-select-panel :controls="controls"></xc-select-panel>
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
            name: 'CompanyChargeShouJu',
            query: {
              activeMenu: '/charge/manage/pay/company'
            }
          }
        },
        {
          name: 'notice',
          type: 'primary',
          icon: 'el-icon-plus',
          text: '计费汇总',
          disabled: false,
          click: {
            name: 'CompanyChargeCount',
            query: {
              activeMenu: '/charge/manage/pay/company'
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
            name: 'CompanyChargeNotice',
            query: {
              activeMenu: '/charge/manage/pay/company'
            }
          }
        }
      ],
      controls: {
        dayPicker: {
          name: 'RecordDate',
          dateType: 'month',
          placeholder: '选择日期',
          title: '当前月份',
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
          // {
          //   name: 'RoomName',
          //   title: '房间号'
          // },
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
                    name: 'CompanyChargeShouJu',
                    query: {
                      initRoomName: row.RoomName,
                      activeMenu: '/charge/manage/pay/company'
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
    this.listCompanyChargeByZone()
  },
  watch: {
    $route () {
      this.listCompanyChargeByZone()
    }
  },
  computed: {
  },
  methods: {
    listCompanyChargeByZone () {
      let {
        $route: {
          query: {
            ZoneName,
            _page = '1,20',
            RecordDate,
            PayStatus
          }
        }
      } = this
      // let where = getWhere
      if (!ZoneName) {
        return
      }
      let newQuery = {
        ZoneName,
        RecordDate,
        PayStatus,
        _page
      }
      if (PayStatus === '') {
        delete newQuery.PayStatus
      }

      this.loading = 'loading'
      api.listCompanyChargeByZone(newQuery).then(data => {
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
