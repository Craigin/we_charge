<template>
  <div class="xc-diagnose-table">
    <div class="title-item">
      <div class="title">
        {{schema.name}}
        <span v-if="loading == 'error'" class="loading-error">
          <i class="el-icon-error"></i>
          加载失败
        </span>
        <i v-else-if="loading" class="el-icon-loading"></i>
      </div>
    </div>
    <el-table
      :data="tableData"
      :border="true"
      :cell-class-name="getCellClassName"
      style="width: 100%">
      <el-table-column
        v-for="(column, index) of schema.columns"
        :key="column.field"
        :column-key="column.field"
        :prop="column.field"
        :label="column.label"
        :align="column.align"
        :width="column.width"
        :className="column.columnClassName">
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
  </div>
</template>

<script>
import emitter from 'common/emitter'

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
      tableData: []
    }
  },
  created () {
    this.search({
      ...this.options,
      fake: true
    }).then(() => {
      return this.search()
    })
  },
  computed: {
    options () {
      return {
        ...this.param,
        ...this.default
      }
    }
  },
  methods: {
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
      return data(param).then(data => {
        this.loading = false
        this.tableData = data
      }).catch(err => {
        this.loading = 'error'
        console.error('get data error', err)
      })
    },
    getCellClassName ({row, column, rowIndex, columnIndex}) {
      let {
        schema: {
          columns
        }
      } = this
      let {
        columnKey: field
      } = column
      column = columns.find(c => c.field === field)
      if (!column) {
        console.warn(`column ${field} not found`)
        return
      }

      let {
        className
      } = column
      let {
        [field]: value
      } = row

      if (typeof className === 'function') {
        className = className(value, row)
      }
      if (typeof value !== 'string' && value.options.status) {
        className = `${className} should-fail`
      }
      return className
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-diagnose-table {
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
    td.status .cell {
      height: 100%;
      width: 100%;
      padding: 0;
    }
    td {
      &.success {
        color: #13CE66;
      }
      &.failure {
        color: #FF4949;
      }
      &.should-fail {
        background: rgba(255, 73, 73, 0.15) !important;
      }
    }
  }
  .light-text {
    opacity: .8;
  }
}
</style>
