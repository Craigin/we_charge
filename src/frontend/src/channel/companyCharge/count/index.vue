<template>
  <div class="xc-person-shouju">
    <xc-button-panel
      :buttons="actions">
    </xc-button-panel>
    <!-- <div class="title" @click="test">
      交费处理
    </div> -->
    <div class="head-info">
      <div class="input-suffix">
        <span>公司: </span>
        <el-autocomplete
          class="inline-input"
          v-model="roomName"
          :fetch-suggestions="querySearch"
          placeholder="请输入公司名称"
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

    <xc-grid-table
      :data="chargeList"
      :pagination="pagination"
      :schema="schema"
      :loading="loading">
    </xc-grid-table>


    <div class="foot">
      <el-button
        :disabled="!chargeList.length"
        :loading="printLoading"
        type="primary"
        @click="submit('print')">
        打印计费表
      </el-button>
      <el-button
        :disabled="!chargeList.length"
        type="warning"
        @click="submit('preview')">
        打印预览
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
import * as lodopUtils from 'utils/lodop'

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
            name: 'CompanyCharge'
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
      addtionalOptions: [],
      shoujuInfo: {
        addtionalfeeInfo: {

        }
      },
      roomName: '',
      rooms: [],
      chargeList: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      loading: '',
      printLoading: false,
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
          // {
          //   name: 'adInfo.total',
          //   title: '附加费'
          // },
          // {
          //   name: 'total_charge',
          //   title: '应交总额'
          // },
          // {
          //   name: 'pay_note',
          //   title: '支付备注',
          //   type: 'textarea'
          // },
          // {
          //   name: 'pay_date',
          //   title: '支付日期',
          //   type: 'date',
          //   text (value) {
          //     if (value) {
          //       return format(new Date(value), 'yyyy-MM')
          //     }
          //   }
          // },
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
          }
        ]
      }
    }
  },
  created () {
    let {
      initRoomName
    } = this.$route.query
    this.roomName = initRoomName

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
          value: item.RoomName || item.CompanyName
        }
      })
    }
  },
  methods: {
    submit (type) {
      let {
        shoujuInfo,
        $route: {
          query: {
            ZoneName,
            RecordDate
          }
        },
        roomName
      } = this
      if (!roomName) {
        this.$message.error('请选择公司')
        return
      }
      api.dataTableSelect({CompanyName: roomName, _page: '1,99999'}, {}, {type: 'mysql', database: 'we_charge', table: 'companyhireroom'}).then(data => {
        let apiQuery = data.rows.map(item => {
          return {
            ...item,
            ZoneName,
            RecordDate
          }
        })
        if (!apiQuery.length) {
          return
        }
        api.postListChargeByRooms({Rooms: apiQuery}).then(data => {
          let countRowList = data.map((item, index) => {
            item.index = index + 1
            return lodopUtils.getFixCountRow(item)
          })
          let companyCharge = lodopUtils.getFixCountRow(shoujuInfo)
          let countRow = {
            ...companyCharge,
            list: countRowList
          }
          console.log('countRow', countRow)
          this.printLoading = true
          try {
            lodopUtils.printCommonPage('company-count-charge', countRow, type)
          } catch (e) {
            console.log('printerr', e)
            window.location.reload()
          } finally {
            this.printLoading = false
          }
        }).catch(err => {
          console.log('postListChargeByRooms', err)
        })
      })
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
      api.dataTableSelect(apiQuery, {}, {type: 'mysql', database: 'we_charge', table: 'company'}).then(data => {
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
        this.shoujuInfo = {
          addtionalfeeInfo: {}
        }
        this.chargeList = []
        return
      }
      let apiQuery = {
        ZoneName,
        CompanyName: roomName,
        RecordDate
      }
      api.listChargeByCompany(apiQuery).then(data => {
        console.log('xxxtemp', data)
        this.chargeList = data
        this.setModel(data)
      }).catch(err => {
        console.log('listChargeByCompany', err)
      })
    },
    setModel (data) {
      let [row] = data
      if (!row) return
      this.shoujuInfo = {
        addtionalfeeInfo: {
        },
        ...row,
        pay_date: row.pay_date ? format(new Date(row.pay_date)) : format(new Date()),
        charge_date: format(new Date(row.RecordDate), 'yy年MM月')
      }
      this.pretotalCharge = this.shoujuInfo.total_charge || 0
      this.preaddtionalTotal = this.shoujuInfo.addtionalfeeInfo.Charge || 0
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
  .xc-grid-table {
    margin-top: 16px;
  }
  .action-checkbox {
    margin-top: 16px;
  }
  .form-section {
    margin-top: 18px;
    .el-form-item {
      margin-bottom: 4px;
    }
    .el-date-editor{
      width: 179px;
      .el-input__inner {
      }
    }
    .note {
      .el-form-item__content {
        width: 442px;
      }
    }
  }
  .foot {
    margin-top: 30px;
  }
}
</style>
