<template>
  <div class="xc-write-record">
    <div class="title">
      水电抄表录入
    </div>
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
    <el-form :inline="true" :model="roomInfo" class="demo-form-inline">
      <el-form-item label="用户名称">
        <el-input v-model="roomInfo.UserName" placeholder="" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="水费标准">
        <el-input v-model="roomInfo.WaterChargeClass" placeholder="" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="电费标准">
        <el-input v-model="roomInfo.ElectricityChargeClass" placeholder="" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="垃圾处理费标准">
        <el-input v-model="roomInfo.GarbageChargeClass" placeholder="" :disabled="true"></el-input>
      </el-form-item>
    </el-form>
    <div class="title">
      水表抄表录入
    </div>
    <el-table
      :data="waterData"
      style="width: 100%">
      <el-table-column
        label="水表编号"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.MeterCode}}</span>
          <span v-if="scope.row.hasRecord" class="success"><i class="el-icon-check"></i>已录</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上月读数"
        width="180">
        <template slot-scope="scope">
          <el-input :disabled="scope.row.hasRecord"   v-model="scope.row.PreviousNumber" placeholder="" @blur="calculate"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="本月读数"
        width="180">
        <template slot-scope="scope">
          <el-input :disabled="scope.row.hasRecord"   v-model="scope.row.LastNumber" placeholder="" @blur="calculate"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="实用数"
        width="180">
        <template slot-scope="scope">
          <span
            :class="{error: scope.row.LastNumber && (scope.row.LastNumber - scope.row.PreviousNumber) < 0 }">
            {{scope.row.LastNumber ? (scope.row.LastNumber - scope.row.PreviousNumber) : ''}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注">
        <template slot-scope="scope">
          <el-input :disabled="scope.row.hasRecord" v-model="scope.row.Notes" placeholder=""></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div class="title">
      电表抄表录入
    </div>
    <el-table
      :data="electricityData"
      style="width: 100%">
      <el-table-column
        label="电表编号"
        width="100">
        <template slot-scope="scope">
          <span>{{scope.row.MeterCode}}</span>
          <span v-if="scope.row.hasRecord" class="success"><i class="el-icon-check"></i>已录</span>
        </template>
      </el-table-column>
      <el-table-column
        label="上月读数"
        width="180">
        <template slot-scope="scope">
          <el-input :disabled="scope.row.hasRecord"   v-model="scope.row.PreviousNumber" placeholder="" @blur="calculate"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="本月读数"
        width="180">
        <template slot-scope="scope">
          <el-input :disabled="scope.row.hasRecord"   v-model="scope.row.LastNumber" placeholder="" @blur="calculate"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="实用数"
        width="180">
        <template slot-scope="scope">
          <span
            :class="{error: scope.row.LastNumber && (scope.row.LastNumber - scope.row.PreviousNumber) < 0 }">
            {{scope.row.LastNumber ? (scope.row.LastNumber - scope.row.PreviousNumber) : ''}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注">
        <template slot-scope="scope">
          <el-input :disabled="scope.row.hasRecord" v-model="scope.row.Notes" placeholder=""></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div class="foot">
      <el-button
        :disabled="!waterData.length && !electricityData.length"
        type="success"
        @click="submit">
        保存
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

export default {
  name: 'xc-write-record',
  components: {
    XcGridTable,
    XcSelectPanel
  },
  props: {
  },
  data () {
    return {
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
      roomInfo: {
        UserName: '',
        WaterChargeClass: '',
        ElectricityChargeClass: '',
        GarbageChargeClass: ''
      },
      roomName: '',
      rooms: [],
      waterData: [],
      electricityData: []
    }
  },
  created () {
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
          value: item.RoomName
        }
      })
    }
  },
  methods: {
    submit () {
      let {
        $route: {
          query,
          query: {
            RecordDate,
            ZoneName
          }
        },
        waterData,
        electricityData
      } = this
      // check
      if (!RecordDate) {
        this.$message.error('请选择抄表月份')
        return
      }

      for (let item of waterData) {
        if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(item.PreviousNumber) || !/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(item.LastNumber)) {
          this.$message.error('水表录入数据有误')
          return
        }
        item.UsedNumber = item.LastNumber - item.PreviousNumber
        if (item.PreviousNumber < 0 || item.LastNumber < 0 || item.UsedNumber < 0) {
          this.$message.error('水表录入数据有误')
          return
        }
        item.ExchangeRate = 1
        Object.assign(item, query)
      }

      for (let item of electricityData) {
        if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(item.PreviousNumber) || !/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(item.LastNumber)) {
          this.$message.error('电表录入数据有误')
          return
        }
        item.UsedNumber = item.LastNumber - item.PreviousNumber
        if (item.PreviousNumber < 0 || item.LastNumber < 0 || item.UsedNumber < 0) {
          this.$message.error('电表录入数据有误')
          return
        }
        item.ExchangeRate = 1
        Object.assign(item, query)
      }

      // console.log('new waterData', waterData)
      let submitWaterData = waterData.filter(item => !item.hasRecord)
      let submitElecData = electricityData.filter(item => !item.hasRecord)

      // console.log('submitWaterData', submitWaterData)
      // console.log('submitElecData', submitElecData)
      if (!submitWaterData.length && !submitElecData.length) {
        this.$message.success('已保存')
        return
      }

      let w = Promise.all(submitWaterData.map(row => {
        return api.dataTableCreate(row, {}, {type: 'mysql', database: 'we_charge', table: 'watermeterrecord'})
      })).then(data => {
        // console.log('waterRecordMonth', this.waterRecordMonth)
        if (this.waterRecordMonth <= 0 || !submitWaterData.length) {
          return
        }
        // countCharge
        let RoomName = this.roomName
        api.postCountCharge({
          type: 'water',
          months: this.waterRecordMonth,
          ZoneName,
          RoomName,
          RecordDate
        }).then(data => {
          console.log('postCountCharge water', data)
        })
      })

      let e = Promise.all(submitElecData.map(row => {
        return api.dataTableCreate(row, {}, {type: 'mysql', database: 'we_charge', table: 'electricitymeterrecord'})
      })).then(data => {
        // console.log('eleRecordMonth', this.eleRecordMonth)
        if (this.eleRecordMonth <= 0 || !submitElecData.length) {
          return
        }
        // countCharge
        let RoomName = this.roomName
        api.postCountCharge({
          type: 'electricity',
          months: this.eleRecordMonth,
          ZoneName,
          RoomName,
          RecordDate
        }).then(data => {
          console.log('postCountCharge electricity', data)
        })
      })

      let p = [].concat(w).concat(e)
      Promise.all(p).then(data => {
        // console.log('xxxtemp', data)

        this.roomName = ''
        this.waterData = []
        this.electricityData = []

        this.$message.success('保存成功')
      }).catch(err => {
        console.error('dataTableCreate error', err)
        this.$notify.error({
          title: '录入失败',
          message: err.response.data
        })
      })
    },
    calculate () {
      this.waterData.push()
      this.electricityData.push()
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
        this.roomInfo = {}
        this.waterData = []
        this.electricityData = []
        return
      }
      let apiQuery = {
        _page: '1,999',
        ZoneName,
        RoomName: roomName
      }
      api.dataTableSelect(apiQuery, {}, {type: 'mysql', database: 'we_charge', table: 'room'}).then(data => {
        this.roomInfo = data.rows[0] || {}
      })

      api.dataTableSelect(apiQuery, {}, {type: 'mysql', database: 'we_charge', table: 'watermeterinroom'}).then(data => {
        this.waterData = data.rows
        this.waterData.forEach(item => {
          let _query = {
            ...apiQuery,
            _page: '1,5',
            MeterCode: item.MeterCode
          }
          api.dataTableSelect(_query, {}, {type: 'mysql', database: 'we_charge', table: 'watermeterrecord'}).then(data => {
            let one = data.rows[0] || {}
            let nowTime = new Date(RecordDate).getTime()
            let lastTime = new Date(one.RecordDate).getTime()
            let diff = nowTime <= lastTime
            this.waterRecordMonth = Math.floor((nowTime - lastTime) / 24 / 3600 / 1000 / 30)
            if (!one.RecordDate) {
              this.waterRecordMonth = 1
            }

            if (diff) {
              this.$set(item, 'hasRecord', true)
              item.PreviousNumber = one.PreviousNumber
              item.LastNumber = one.LastNumber
              item.Notes = one.Notes
            } else {
              item.PreviousNumber = one.LastNumber
              item.LastNumber = ''
            }

            this.waterData.push()
          })
        })
      })

      api.dataTableSelect(apiQuery, {}, {type: 'mysql', database: 'we_charge', table: 'electricitymeterinroom'}).then(data => {
        this.electricityData = data.rows
        this.electricityData.forEach(item => {
          let _query = {
            ...apiQuery,
            _page: '1,5',
            MeterCode: item.MeterCode
          }
          api.dataTableSelect(_query, {}, {type: 'mysql', database: 'we_charge', table: 'electricitymeterrecord'}).then(data => {
            let one = data.rows[0] || {}
            let nowTime = new Date(RecordDate).getTime()
            let lastTime = new Date(one.RecordDate).getTime()
            let diff = nowTime <= lastTime
            this.eleRecordMonth = Math.floor((nowTime - lastTime) / 24 / 3600 / 1000 / 30)
            if (!one.RecordDate) {
              this.eleRecordMonth = 1
            }

            if (diff) {
              this.$set(item, 'hasRecord', true)
              item.PreviousNumber = one.PreviousNumber
              item.LastNumber = one.LastNumber
              item.Notes = one.Notes
            } else {
              item.PreviousNumber = one.LastNumber
              item.LastNumber = ''
            }

            this.electricityData.push()
          })
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-write-record {
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
  .foot {
    margin-top: 16px;
  }
}
</style>
