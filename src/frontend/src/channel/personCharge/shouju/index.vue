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
      :data="chargeList"
      :pagination="pagination"
      :schema="schema"
      :loading="loading">
    </xc-grid-table>

    <el-form :inline="true" :model="shoujuInfo" class="form-section"  v-if="chargeList.length">
      <el-form-item label="附加费类别" >
        <el-select :disabled="!!shoujuInfo.pay_status" v-model="shoujuInfo.addtionalfeeInfo.ItemName" placeholder="请选择附加费类别">
          <el-option
            v-for="option of addtionalOptions"
            :key="option.value"
            :label="option.name"
            :value="option.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附加费">
        <el-input :disabled="!!shoujuInfo.pay_status" onmousewheel="return false;" type="number" v-model="shoujuInfo.addtionalfeeInfo.Charge" placeholder="请输入附加费" @blur="blurAddtionalfeeCharge"></el-input>
      </el-form-item>
      <el-form-item label="应交总额">
        <el-input :disabled="true" onmousewheel="return false;" type="number" v-model="shoujuInfo.total_charge" placeholder="" ></el-input>
      </el-form-item>
    </el-form>

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
        :disabled="!chargeList.length"
        type="primary"
        @click="submit('print')">
        打印收据
      </el-button>
      <el-button
        :disabled="!chargeList.length"
        type="warning"
        @click="submit('preview')">
        打印预览
      </el-button>
      <el-button
        :disabled="!chargeList.length || !!shoujuInfo.pay_status"
        :icon="!!shoujuInfo.pay_status ? 'el-icon-check' : ''"
        type="success"
        @click="chargeOk">
        交费确认
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
    this.fetchAddtionalOptions()
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
    blurAddtionalfeeCharge () {
      let {
        shoujuInfo,
        shoujuInfo: {
          addtionalfeeInfo: {
            Charge: addtionalTotal = 0
          },
          pay_status: payStatus
        },
        pretotalCharge,
        preaddtionalTotal,
        roomName
      } = this

      if (!roomName) {
        return
      }

      if (payStatus !== 1 && typeof pretotalCharge === 'number' && addtionalTotal) {
        let total = parseFloat(pretotalCharge) - parseFloat(preaddtionalTotal) + parseFloat(addtionalTotal)
        shoujuInfo.total_charge = total
      }
      console.log('shoujuInfo', shoujuInfo)
      console.log('xxxtemp', lodopUtils.getFixShoujuRow(shoujuInfo))
    },
    fetchAddtionalOptions () {
      api.dataTableSelect({_page: '1,99999', ItemClass: 2}, {}, {type: 'mysql', database: 'we_charge', table: 'sys_dictionary'}).then(data => {
        console.log('xxxtemp', data)
        this.addtionalOptions = data.rows.map(item => {
          return {
            ...item,
            name: item.ItemName,
            value: item.ItemName
          }
        })
      }).catch(err => {
        console.log('postListChargeByRooms', err)
      })
    },
    submit (type) {
      let {
        shoujuInfo,
        shoujuInfo: {
          addtionalfeeInfo: {
            ItemName = '',
            Charge: addtionalTotal = 0
          },
          pay_status: payStatus,
          room_class: roomClass
        },
        $route: {
          query: {
            ZoneName,
            RecordDate
          }
        },
        roomName
      } = this
      if (!roomName) {
        this.$message.error('请选择房间')
        return
      }
      if (roomClass === 1) {
        this.$message.error('该房间为公司租房, 请在公司交费处理')
        return
      }

      if (payStatus === 1) {
        shoujuInfo.PayDate = shoujuInfo.pay_date || format(new Date())
        shoujuInfo.PayNotes = shoujuInfo.pay_note
        api.dataTableUpdate(shoujuInfo, {}, {type: 'mysql', database: 'we_charge', table: 'roomrecordforuser'}).then(data => {
          console.log('xxxtemp', data)
          try {
            lodopUtils.printShouJu(lodopUtils.getFixShoujuRow(shoujuInfo), type)
            window.location.reload()
          } catch (e) {
            console.log('printerr', e)
            window.location.reload()
          } finally {

          }
        })
        return
      }

      if (addtionalTotal && addtionalTotal < 0) {
        this.$message.error('附加费不小于0')
        return
      }
      if (addtionalTotal && !ItemName) {
        this.$message.error('请选择附加费类别')
        return
      }

      let addtionalfeeforroom = {
        Type: 'room',
        ZoneName,
        RoomName: roomName,
        RecordDate,
        Name: roomName,
        ItemClass: '0',
        ItemName,
        Charge: addtionalTotal || 0
      }
      if (ItemName) {
        api.updateAddtionalFee(addtionalfeeforroom).then(data => {
          console.log('xxxtemp', data)
          try {
            lodopUtils.printShouJu(lodopUtils.getFixShoujuRow(shoujuInfo), type)
            window.location.reload()
          } catch (e) {
            console.log('printerr', e)
            window.location.reload()
          } finally {

          }
        })
      } else {
        try {
          lodopUtils.printShouJu(lodopUtils.getFixShoujuRow(shoujuInfo), type)
          window.location.reload()
        } catch (e) {
          console.log('printerr', e)
          window.location.reload()
        } finally {

        }
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
        this.setModel(data)
      }).catch(err => {
        console.log('postListChargeByRooms', err)
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
      this.pretotalCharge = this.shoujuInfo.total_charge
      this.preaddtionalTotal = this.shoujuInfo.addtionalfeeInfo.Charge
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
