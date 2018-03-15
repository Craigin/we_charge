<template>
  <div class="xc-list-report-section">
    <component
      v-if="schema.component"
      :is="schema.component"
      :schema="schema"
      :options="options">
    </component>
    <div v-else>
      <div class="title-item">
        <div class="title">
          {{schema.name}}
        </div>
        <el-button type="warning" size="mini"  @click="downloadFile">导出</el-button>
      </div>
      <el-table
        v-loading.body="loading"
        :data="tableData"
        :border="false"
        style="width: 100%">
        <el-table-column
          v-for="(column, index) of schema.columns"
          :key="column.field"
          :prop="column.field"
          :label="column.label"
          :width="column.width">
          <template slot-scope="scope">
            <component
              v-if="column.component"
              :is="column.component"
              :schema="schema"
              :options="options"
              :column="column"
              :scope="scope">
            </component>
            <span
              v-else
              :class="column.className">
              {{scope.row[column.field]}}
            </span>
            <el-dropdown
              v-if="column.actions && column.actions.length"
              :trigger="'click'"
              @command="handleAction($event, scope.row, column)">
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="action of column.actions"
                  :key="action.key"
                  :disabled="action.disabled"
                  :divided="action.divided"
                  :command="action.key">
                  {{action.title}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :current-page="pageInfo.currentPage"
       :page-sizes="pageInfo.pageSizes"
       :page-size="pageInfo.pageSize"
       layout="total, sizes, prev, pager, next, jumper"
       :total="pageInfo.total">
     </el-pagination>
    </div>
  </div>
</template>

<script>
import api from 'api'
import {format} from 'utils/dateFormat'
import emitter from 'common/emitter'
import {handleSQLByParam, limit, pageSizes} from './schema'
import _ from 'lodash'

export default {
  name: 'xc-list-report-section',
  props: {
    schema: Object,
    param: Object
  },
  data () {
    return {
      loading: false,
      default: {},
      tableData: [],
      pageInfo: {
        currentPage: 1,
        pageSizes: pageSizes,
        pageSize: limit,
        total: 0
      },
      userName: new Map(),
      clientName: new Map()
    }
  },
  created () {
    this.pageInfo.pageSize = limit
    this.pageInfo.currentPage = 1
    this.search(this.options)
  },
  watch: {
    options () {
      this.pageInfo.pageSize = limit
      this.pageInfo.currentPage = 1
      this.search(this.options)
    }
  },
  computed: {
    options () {
      if (this.schema.fixSQL) {
        this.default.sql = handleSQLByParam(this.param, this.schema)
      }
      Object.assign(this.param, this.default)
      return this.param
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pageInfo.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.pageInfo.currentPage = val
      let _param = Object.assign({}, this.param, {
        limit: this.pageInfo.pageSize,
        offset: (val - 1) * this.pageInfo.pageSize
      })
      let sql = handleSQLByParam(_param, this.schema)
      this.search({sql})
    },
    handleAction (key, row, column) {
      let action = column.actions.find(action => action.key === key)
      if (!action) {
        console.warn('unknown action', key)
        return
      }
      let event = action.event || action.key
      emitter.emit(event, row)
    },
    search (param) {
      let {sql} = param
      this.loading = true
      api.getEagleEyeFlowQuery({sql}).then(data => {
        this.loading = false
        this.pageInfo.total = data.hits.total
        this.tableData = this.fixTableData(data)
      }).catch(err => {
        this.loading = false
        console.error('getEagleEyeOlQuery error', err)
      })
    },
    fixTableData (data) {
      let clientIds = _.uniq(data.hits.hits.map(item => item._source.client_id))
      let userIds = _.uniq(data.hits.hits.map(item => item._source.user_id))
      this.getUserByID(userIds)
      this.getClientByID(clientIds)
      return data.hits.hits.map(item => {
        return Object.assign(item._source, {
          timestamp: format(new Date(item._source.timestamp))
        })
      })
    },
    getUserByID (id, item) {
      api.getUserByID({keyword: id.toString()}).then(data => {
        data.forEach(item => {
          this.userName.set(item.user_id, item.email)
        })
        this.tableData = this.tableData.map(item => {
          return Object.assign(item, {
            user_name: this.userName.get(item.user_id)
          })
        })
      }).catch(err => {
        console.error('getUserByID error', err)
      })
    },
    getClientByID (id, item) {
      api.getClientByID({keyword: id.toString()}).then(data => {
        data.forEach(item => {
          this.clientName.set(item.client_id, item.name)
        })
        this.tableData = this.tableData.map(item => {
          return Object.assign(item, {
            client_name: this.clientName.get(item.client_id)
          })
        })
      }).catch(err => {
        console.error('getUserByID error', err)
      })
    },
    downloadFile () {
      this.$confirm(`是否导出?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then((val) => {
        let sql = handleSQLByParam(this.param, this.schema, false)
        window.location.href = `/api/download/stats-file/${this.schema.key}/?sql=${sql}`
      }).catch((val) => {
        this.$message({
          type: 'info',
          message: '已取消',
          duration: 700
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-list-report-section {
  a {
    color: $main_link;
  }
  .title-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    .title {
      margin-right: 12px;
    }
  }
  .el-pagination {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
  .el-table {
    .el-table__body-wrapper {
      color: $main_font;
    }
  }
  .light-text {
    opacity: .8;
  }
}
</style>
