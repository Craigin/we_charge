<template>
  <div class="xc-person-notice">
    <xc-button-panel
      :buttons="actions">
    </xc-button-panel>
    <!-- <div class="title" @click="test">
      交费处理
    </div> -->
    <div class="section">
      <el-radio-group v-model="printType">
        <el-radio :label="1">管理区所有欠费用户</el-radio>
        <el-radio :label="2">单一房间</el-radio>
      </el-radio-group>
    </div>

    <div class="head-info">
      <div class="input-suffix" v-if="printType === 2">
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

    <xc-grid-table
      v-if="printType === 2"
      :data="chargeList"
      :pagination="pagination"
      :schema="schema"
      :loading="loading">
    </xc-grid-table>

    <el-form :model="noticeInfo" class="form-section-wrap" label-width="68px">
      <el-form-item label="交费时间">
        <el-input v-model="noticeInfo.end_date" placeholder="请输入交费时间" ></el-input>
      </el-form-item>
      <el-form-item label="交费地点">
        <el-input v-model="noticeInfo.location" placeholder="请输入交费地点" ></el-input>
      </el-form-item>
      <el-form-item label="通知日期">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="noticeInfo.notice_date"
          type="date"
          placeholder="请选择通知日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="交费月份">
        <el-input v-model="noticeInfo.charge_date" placeholder="请输入交费月份" ></el-input>
      </el-form-item>
    </el-form>


    <div class="foot" v-if="printType===1">
      <el-button
        type="primary"
        :loading="submitAllLoading"
        @click="submitAll('print')">
        打印
      </el-button>
      <el-button
        type="warning"
        :loading="submitAllLoading"
        @click="submitAll('preview')">
        打印预览
      </el-button>
    </div>
    <div class="foot" v-if="printType===2">
      <el-button
        :disabled="!chargeList.length || !!shoujuInfo.pay_status"
        type="primary"
        @click="submit('print')">
        打印
      </el-button>
      <el-button
        :disabled="!chargeList.length || !!shoujuInfo.pay_status"
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
  name: 'xc-person-notice',
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
      printType: 1,
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
      },
      noticeInfo: {

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
      submitAllLoading: false,
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
    this.setNoticeInfo()
  },
  watch: {
    $route () {
      this.searchRoomName()
      this.searchRoomInfo()
      this.setNoticeInfo()
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
    submitAll (type) {
      let {
        $route: {
          query: {
            ZoneName,
            _page = '1,2000',
            RecordDate
          }
        }
      } = this
      if (!ZoneName) {
        return
      }
      let newQuery = {
        ZoneName,
        PayStatus: '0',
        startRecordDate: RecordDate,
        endRecordDate: RecordDate,
        _page
      }

      this.submitAllLoading = true
      api.postListChargeByZone(newQuery).then(data => {
        this.submitAllLoading = false
        console.log('xxxtemp', data)
        if (!data.list || !data.list.length) {
          this.$message.info('没有欠费的用户')
          return
        }
        this.$confirm(`共${data.list.length}个欠费房间, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let notice = data.list.map((item, index) => {
            let {
              noticeInfo
            } = this
            let obj = {
              ...item,
              ...noticeInfo
            }
            obj.notice_date = format(new Date(obj.notice_date), 'yyyy年MM月dd日')
            let row = lodopUtils.getFixPersonNoticeRow(obj)
            return row
          })

          let noticeRow = {
            notice
          }
          try {
            lodopUtils.printCommonPage('person-notice-charge', noticeRow, type)
          } catch (e) {
            console.log('printerr', e)
            window.location.reload()
          } finally {

          }
        }).catch(() => {
        })
      }).catch(err => {
        this.submitAllLoading = false
        console.error('getListChargeByRooms error', err)
        this.$message.error('请求错误')
      })
    },
    submit (type) {
      let {
        shoujuInfo,
        shoujuInfo: {
          room_class: roomClass
        },
        noticeInfo
      } = this

      if (roomClass === 1) {
        this.$message.error('该房间为公司租房, 请在公司交费处理')
        return
      }

      let obj = {
        ...shoujuInfo,
        ...noticeInfo
      }
      obj.notice_date = format(new Date(obj.notice_date), 'yyyy年MM月dd日')

      let row = lodopUtils.getFixPersonNoticeRow(obj)
      let noticeRow = {
        notice: [row]
      }
      // console.log('xxxtemp', row)
      // console.log('noticeList', lodopUtils.getHtml('person-notice-charge', noticeList))
      try {
        lodopUtils.printCommonPage('person-notice-charge', noticeRow, type)
      } catch (e) {
        console.log('printerr', e)
        window.location.reload()
      } finally {

      }
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
        this.shoujuInfo = {
          addtionalfeeInfo: {}
        }
        this.chargeList = []
        return
      }
      let apiQuery = [{
        ZoneName,
        RoomName: roomName,
        RecordDate
      }]
      api.postListChargeByRooms({Rooms: apiQuery}).then(data => {
        console.log('xxxtemp', data)
        this.chargeList = data
        let [row] = data
        if (row) {
          this.shoujuInfo = row
        }
      }).catch(err => {
        console.log('postListChargeByRooms', err)
      })
    },
    setNoticeInfo () {
      let {
        $route: {
          query: {
            RecordDate
          }
        },
        $root: {
          supervisor: {
            payinform: {
              location = ''
            } = {}
          } = {}
        }
      } = this
      if (!RecordDate) {
        return
      }
      this.noticeInfo = {
        end_date: format(new Date(RecordDate), 'yyyy年MM月'),
        charge_date: format(new Date(RecordDate), 'yy年MM月'),
        notice_date: format(new Date()),
        location
      }
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-person-notice {
  .title {
    margin: 10px 0;
    font-weight: bold;
  }
  .section {
    margin: 16px 0;
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
  .form-section-wrap {
    width: 600px;
    margin-top: 16px;
    .el-form-item {
      margin-bottom: 16px;
    }
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
