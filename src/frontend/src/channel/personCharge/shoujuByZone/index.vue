<template>
  <div class="xc-person-shouju-zone">
    <xc-button-panel
      :buttons="actions">
    </xc-button-panel>
    <div class="head-info">
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
      :loading="loading"
      @handleSelectionChange="handleSelectionChange">
    </xc-grid-table>

    <el-form :inline="true" :model="shoujuInfo" class="form-section" v-if="chargeList.length">
      <el-form-item label="支付日期">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="shoujuInfo.pay_date"
          type="date"
          placeholder="选择支付日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="交费月份">
        <el-input v-model="shoujuInfo.charge_date" placeholder="请输入交费月份" ></el-input>
      </el-form-item>
    </el-form>

    <el-form :inline="true" :model="shoujuInfo" class="form-section" v-if="chargeList.length">
      <el-form-item label="支付备注" class="note">
        <el-input type="textarea" v-model="shoujuInfo.pay_note" placeholder="请输入支付备注"  ></el-input>
      </el-form-item>
    </el-form>

    <div class="foot">
      <el-button
        :disabled="!chargeList.length || !selectedList.length"
        type="primary"
        :loading="printLoading"
        @click="submit('print')">
        打印收据
      </el-button>
      <el-button
        :disabled="!chargeList.length || !selectedList.length"
        type="warning"
        @click="submit('preview')">
        打印预览
      </el-button>
      <!-- <el-button
        :disabled="!chargeList.length || !!shoujuInfo.pay_status"
        :icon="!!shoujuInfo.pay_status ? 'el-icon-check' : ''"
        type="success"
        @click="chargeOk">
        交费确认
      </el-button> -->
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
  name: 'xc-person-shouju-zone',
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
      addtionalOptions: [],
      shoujuInfo: {
        addtionalfeeInfo: {

        }
      },
      roomName: '',
      rooms: [],
      chargeList: [],
      selectedList: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0
      },
      loading: '',
      printLoading: false,
      schema: {
        hideAction: true,
        showSelection: true,
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
    // let {
    //   initRoomName
    // } = this.$route.query
    // this.roomName = initRoomName

    this.searchRoomInfo()
  },
  watch: {
    $route () {
      this.searchRoomInfo()
    }
  },
  computed: {
  },
  methods: {
    chargeOk () {
      let {
        shoujuInfo,
        shoujuInfo: {
          room_class: roomClass
        }
      } = this
      if (roomClass === 1) {
        this.$message.error('该房间为公司租房, 请在公司交费处理')
        return
      }

      shoujuInfo.PayStatus = 1
      api.dataTableUpdate(shoujuInfo, {}, {type: 'mysql', database: 'we_charge', table: 'roomrecordforuser'}).then(data => {
        this.searchRoomInfo()
      })
    },
    submit (type) {
      let {
        shoujuInfo,
        selectedList
      } = this

      // 后端只返回个人租房 roomClass：0
      if (!selectedList.length) {
        this.$message.error('请选择房间')
        return
      }
      this.$message.info('已开始打印')
      this.printLoading = true
      try {
        let rows = selectedList.map(item => {
          return lodopUtils.getFixShoujuRow({
            ...item,
            ...shoujuInfo
          })
        })
        lodopUtils.printShouJu(rows, type)
      } catch (e) {
        console.log('printShouJu error', e)
        window.location.reload()
      } finally {
        this.printLoading = false
        let users = selectedList.map(item => {
          let one = {
            ...item,
            ...shoujuInfo
          }
          return {
            ...one,
            UserName: one.user_name,
            PayDate: one.pay_date,
            PayNotes: one.pay_note
          }
        })
        api.updatePayByUsers({users}).then(data => {
          this.$message.info(`共交费确认${users.length}间房间`)
        }).catch(err => {
          console.log('updatePayByUsers', err)
        })
      }
    },
    handleSelectionChange (list) {
      console.log('xxxtemp', list)
      this.selectedList = list
    },
    searchRoomInfo () {
      let {
        $route: {
          query: {
            ZoneName,
            RecordDate
          }
        }
      } = this
      if (!ZoneName || !RecordDate) {
        return
      }

      let apiQuery = {
        ZoneName,
        startRecordDate: RecordDate,
        endRecordDate: RecordDate,
        PayStatus: '0',
        _page: '1,99999'
      }
      this.loading = 'loading'
      api.postListChargeByZone(apiQuery).then(data => {
        console.log('xxxtemp', data)
        this.loading = ''
        this.chargeList = data.list
        this.setModel()
      }).catch(err => {
        this.loading = ''
        console.log('postListChargeByRooms', err)
      })
    },
    setModel (data) {
      let {
        $route: {
          query: {
            RecordDate
          }
        }
      } = this
      this.shoujuInfo = {
        addtionalfeeInfo: {
        },
        pay_date: format(new Date()),
        charge_date: format(new Date(RecordDate), 'yy年MM月')
      }
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-person-shouju-zone {
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
  .xc-grid-table {
    max-height: 400px;
    overflow: auto;
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
