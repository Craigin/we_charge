<template>
  <div class="xc-grid-table">
    <div class="table">
      <el-table
        border
        v-loading.body="loading === 'loading'"
        :data="data"
        :row-style="schema.rowStyle"
        @selection-change="handleSelectionChange">
        <el-table-column
          v-if="schema.showSelection"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          v-if="showAction && !schema.hideAction"
          width="140"
          key="actions"
          prop="name"
          label="操作">
          <template slot-scope="scope">
            <xc-button-group
              class="actions"
              :buttons="getRowActions(scope.row)"
              size="mini"
              :model="{row: scope.row, schema: schema, vnode}">
            </xc-button-group>
          </template>
        </el-table-column>
        <el-table-column
          v-for="column of schema.columns"
          :class-name="`col-${column.name}`"
          :width="column.width"
          :key="column.name"
          :prop="column.name"
          :label="column.title || column.name">
          <template slot-scope="scope">
            <component
              v-if="column.component"
              :is="column.component"
              :schema="schema"
              :column="column"
              :scope="scope"
              :value="getValue(scope.row, column.name)"
              :row="scope.row"
              :style="column.cellStyle">
            </component>
            <xc-grid-table-column
              :schema="column"
              :mergedSchema="schema"
              :value="getValue(scope.row, column.name)"
              :row="scope.row"
              :style="column.cellStyle">
            </xc-grid-table-column>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="after" v-if="pagination && pagination.total">
      <div></div>
      <el-pagination
        :total="pagination.total"
        :current-page="pagination.page"
        :page-sizes="[5, 10, 15, 20, 50]"
        :page-size="pagination.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import * as commonUtils from 'common/utils'
import ButtonGroup from 'components/buttonGroup'
import Column from './column'

export default {
  name: 'xc-grid-table',
  components: {
    'xc-grid-table-column': Column,
    'xc-button-group': ButtonGroup
  },
  props: {
    schema: {
      type: Object
    },
    loading: {
      type: String,
      default: ''
    },
    data: {
      type: [Array]
    },
    pagination: {
      type: Object
    }
  },
  data () {
    return {
      showAction: true
    }
  },
  computed: {
    vnode () {
      return this
    }
  },
  methods: {
    getValue (row, name) {
      let value = _.get(row, name)
      return value
    },
    handleEdit (row) {
      this.$emit('edit', row)
    },
    handleCopy (row) {
      this.$emit('copy', row)
    },
    handleDelete (row) {
      this.$emit('delete', row)
    },
    getRowActions (row) {
      let {
        schema,
        schema: {
          editable,
          copyable,
          deletable,
          rowActions
        },
        $root: {
          supervisor
        }
      } = this
      let _actions = []
      let defaultActions = [
        editable && commonUtils.checkPrivilege(supervisor, editable) && {
          name: 'edit',
          type: 'default',
          icon: 'edit',
          title: '编辑',
          click: this.handleEdit.bind(this, row)
        },
        copyable && commonUtils.checkPrivilege(supervisor, copyable) && {
          name: 'copy',
          type: 'default',
          icon: 'document',
          title: '复制',
          click: this.handleCopy.bind(this, row)
        },
        deletable && commonUtils.checkPrivilege(supervisor, deletable) && {
          name: 'delete',
          type: 'default',
          icon: 'delete',
          title: '删除',
          popover: {
            type: 'confirm',
            title: '确认要删除数据吗？',
            buttons: [
              {
                type: 'text',
                text: '取消'
              },
              {
                type: 'danger',
                text: '确定',
                click: this.handleDelete.bind(this, row)
              }
            ]
          }
        }
      ].filter(item => item)
      if (!rowActions) {
        _actions = defaultActions
      } else if (typeof rowActions === 'function') {
        _actions = rowActions(row, schema, defaultActions)
      } else {
        rowActions = rowActions || []
        _actions = rowActions.map(action => {
          if (typeof action === 'string') {
            return defaultActions.find(a => a.name === action)
          }
          return action
        })
      }
      if (!_actions.length) {
        this.showAction = false
      }
      return _actions
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    handleSizeChange (pageSize) {
      let {
        pagination: {
          page
        }
      } = this
      this.changeQuery({
        _page: `${page},${pageSize}`
      })
    },
    handleCurrentPageChange (page) {
      let {
        pagination: {
          pageSize
        }
      } = this
      this.changeQuery({
        _page: `${page},${pageSize}`
      })
    },
    changeQuery (newQuery) {
      let {
        $route: {
          path,
          query
        }
      } = this
      this.$router.push({
        path,
        query: {
          ...query,
          ...newQuery
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-grid-table {
  .after {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
