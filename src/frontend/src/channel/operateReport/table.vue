<template>
  <div class="xc-recommendation-table">
    <div class="title-item">
      <div class="title">
        <router-link :to=groupUrl> {{schema.name}} </router-link>
      </div>
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
            :class="typeof column.className === 'function' ? column.className(scope.row[column.field], scope.row) : column.className">
            {{column.text ? column.text(scope.row[column.field], scope.row) : scope.row[column.field]}}
          </span>
          <el-dropdown
            v-if="column.actions"
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
      v-if="schema.pagination !== false"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.currentPage"
      :page-sizes="pageInfo.pageSizes"
      :page-size="pageInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total">
    </el-pagination>
  </div>
</template>

<script>
import emitter from 'common/emitter'
import {queryEagleEyeRaw, limit, pageSizes} from './schema'

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
    groupUrl () {
      return {
        name: 'reportGroup',
        query: {
          id: this.schema.id
        }
      }
    },
    options () {
      if (this.schema.fixSQL) {
        this.default.sql = queryEagleEyeRaw(this.param, this.schema)
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
      let _param = {
        ...this.param,
        limit: this.pageInfo.pageSize,
        offset: (val - 1) * this.pageInfo.pageSize
      }
      this.search(_param)
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
      let {
        schema: {
          data
        }
      } = this

      this.loading = true
      data(param).then(data => {
        this.loading = false
        this.tableData = data
      }).catch(err => {
        this.loading = false
        console.error('err', err)
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-recommendation-table {
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
