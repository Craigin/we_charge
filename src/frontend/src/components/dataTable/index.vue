<template>
  <div class="xc-data-table">
    <div class="first-actions-panel">
      <xc-button-panel
        :buttons="actions">
      </xc-button-panel>
    </div>
    <div class="second-actions-panel">
      <!-- <xc-button-panel
        v-if="secondActions"
        :buttons="secondActions">
      </xc-button-panel> -->
      <xc-select-panel
        v-if="controls || extraControls.length"
        :controls="controls"
        :extraControls="extraControls">
      </xc-select-panel>
    </div>
    <div class="third-actions-panel" v-if="searchColumns.length">
      <div>查找关键字:</div>
      <el-input
        class="search"
        :placeholder="searchPlaceholder"
        v-model="search"
        @keyup.enter.native="startSearch">
        <el-button @click="startSearch" slot="append" icon="el-icon-search">
        </el-button>
      </el-input>
    </div>

    <div class="table">
      <el-table
        border
        v-loading.body="loading === 'loading'"
        :default-sort="mergedSchema.defaultSort"
        :data="data.rows">
        <el-table-column
          v-if="newColumns.length && !mergedSchema.hideActionColumn"
          :width="mergedSchema.buttonGroupWidth || 130"
          key="actions"
          prop="name"
          label="操作">
          <template slot-scope="scope">
            <xc-button-group
              class="actions"
              :buttons="getRowActions(scope.row)"
              size="mini"
              :model="{row: scope.row, schema: mergedSchema, vnode}">
            </xc-button-group>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(column, index) of newColumns"
          v-if="column.show !== false"
          :sortable="column.sortable"
          :width="column.width"
          :key="column.name"
          :prop="column.name"
          :label="column.title || column.name">
          <template slot-scope="scope">
            <xc-data-table-column
              :schema="column"
              :mergedSchema="mergedSchema"
              :value="getValue(scope.row, column.name)"
              :row="scope.row"
              :style="column.cellStyle">
            </xc-data-table-column>
            <xc-button-group
              v-if="getCellActions(scope.row, column)"
              class="actions"
              :buttons="getCellActions(scope.row, column)"
              size="mini">
            </xc-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="after">
      <div></div>
      <el-pagination
        :total="data.pagination.total"
        :current-page="data.pagination.page"
        :page-sizes="[5, 10, 15, 20, 50]"
        :page-size="data.pagination.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <xc-data-table-dialog
      :editing="editing"
      :saving="dialogSaving"
      :title="editTitle"
      :columns="mergedSchema.columns"
      :row="editRow"
      :schema="mergedSchema"
      @ok="handleDialogOK"
      @cancel="handleDialogCancel">
    </xc-data-table-dialog>
    <xc-data-table-dialog
      v-if="customEdit"
      :editing="customEdit !== undefined"
      :saving="customDialogSaving"
      :title="customEdit.title"
      :columns="customEdit.columns"
      :row="customEdit.row"
      @ok="handleCustomDialogOK"
      @cancel="handleCustomDialogCancel">
    </xc-data-table-dialog>
    <xc-table-columns-list-dialog
      v-if="showColumnListDialog"
      :columnListDialogVisible="columnListDialogVisible"
      @ok="handleColumnDialogOK"
      @cancel="handleColumnDialogCancel">
    </xc-table-columns-list-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import api from 'api'
import * as commonUtils from 'common/utils'
import ButtonGroup from 'components/buttonGroup'
import ButtonPanel from 'components/buttonPanel'
import Column from './column'
import Dialog from './dialog'
import ColumnListDialog from './columnListDialog'
import XcSelectPanel from 'components/selectPanel'
import {DB_WECHARGE_NAME} from 'router/dataTables/common'

const DEFAULT_DATA = {
  rows: [],
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0
  }
}

export default {
  name: 'xc-data-table',
  components: {
    XcSelectPanel,
    'xc-table-columns-list-dialog': ColumnListDialog,
    'xc-button-panel': ButtonPanel,
    'xc-button-group': ButtonGroup,
    'xc-data-table-column': Column,
    'xc-data-table-dialog': Dialog
  },
  props: {
    schema: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      search: '',
      loading: '',
      dialogSaving: false,
      mergedSchema: this.schema,
      data: DEFAULT_DATA,
      editType: '',
      editRow: {},
      editPrimary: {},
      customEdit: undefined,
      formLabelWidth: '120px',
      columnListDialogVisible: false,
      newColumns: []
    }
  },
  created () {
    // console.log('loaded schema', this.schema)
    let {
      $route: {
        query: {
          _search
        }
      }
    } = this
    this.search = _search

    this.mergeSchema()
    this.select()
  },
  watch: {
    schema () {
      this.data = DEFAULT_DATA
      this.mergeSchema()
    },
    $route () {
      this.select()
    },
    editType () {
      // has listen
      /*
      let primaryColumn = this.mergedSchema.columns.find(item => item.primary)
      if (this.editType === 'create') {
        primaryColumn.edit = false
      } else {
        primaryColumn.edit = true
      }
      */
    }
  },
  computed: {
    vnode () {
      return this
    },
    editing: {
      get () {
        return this.editType.length > 0
      },
      set (value) {
        if (value) {
          // console.warn('invalid editing value set from dialog')
        } else {
          this.editType = ''
        }
      }
    },
    editTitle () {
      let {
        mergedSchema: {
          title
        },
        editType
      } = this
      if (editType) {
        return `${editType === 'create' ? '创建' : '编辑'} ${title}`
      }
      return ''
    },
    searchColumns () {
      let {
        mergedSchema: {
          columns
        }
      } = this
      return columns.filter(c => c.search)
    },
    searchPlaceholder () {
      let {
        searchColumns
      } = this
      return `搜索 ${searchColumns.map(c => c.title).join(', ')}`
    },
    secondActions () {
      return this.getSecondActions()
    },
    actions () {
      return this.getActions()
    },
    model () {
    },
    customDialogSaving () {
      let {
        customEdit: {
          saving = false
        } = {}
      } = this
      return saving
    },
    controls () {
      let {
        mergedSchema: {
          selectPanel: {
            controls = {}
          } = {}
        }
      } = this
      return controls
    },
    extraControls () {
      let {
        mergedSchema: {
          selectPanel: {
            extraControls = []
          } = {}
        }
      } = this
      return extraControls
    }
  },
  methods: {
    getValue (row, name) {
      let value = _.get(row, name)
      return value
    },
    mergeSchema () {
      let {
        schema,
        schema: {
          type,
          database,
          table
        }
      } = this
      this.mergedSchema = schema
      api.dataTableSchema({}, {}, {type, database, table}).then(data => {
        let {
          readable = true,
          creatable = true,
          editable = true,
          copyable = true,
          deletable,
          columns
        } = data
        let newColumns = schema.columns.map(column => {
          return {
            ...columns.find(c => c.name === column.name),
            ...column
          }
        })
        this.mergedSchema = {
          ...schema,
          readable,
          creatable,
          editable,
          copyable,
          deletable,
          columns: newColumns
        }
        // console.log('mergedSchema', this.mergedSchema)
        // order or show column
        this.setMergedSchemaColumns()
      }).catch(err => {
        console.error('dataTableSchema error', err)
        this.$notify.error({
          title: '加载服务器侧数据策略失败',
          message: err.message
        })
      })
    },
    setMergedSchemaColumns () {
      let {
        entityClass,
        columns
      } = this.mergedSchema
      if (!entityClass) {
        this.newColumns = columns
        return
      }
      api.dataTableSelect({_page: '1,9999', EntityClass: entityClass}, {}, {type: 'mysql', database: DB_WECHARGE_NAME, table: 'entity_listfieldname'}).then(data => {
        let {
          rows
        } = data
        // rows.forEach(item => {
        //   item.ColWidth = item.ColWidth / 10
        // })
        this.newColumns = columns.map(item => {
          let newItem
          let row = rows.find(one => one.PropertyName === item.title)
          if (row) {
            newItem = {
              ...item,
              index: row.ListIndex,
              ColWidth: row.ColWidth,
              width: row.ColWidth / 10,
              show: item.hasOwnProperty('show') ? item.show : true
            }
          } else {
            newItem = {
              ...item,
              index: item.hasOwnProperty('index') ? item.index : 1,
              show: item.hasOwnProperty('show') ? item.show : false
            }
          }
          return newItem
        }).sort((a, b) => a.index - b.index)
        // - - !
        let lastShowOne = this.newColumns.filter(item => item.show)
        let i = lastShowOne.length - 1
        lastShowOne[i].width = ''
        // console.log('columns', columns)
        // console.log('new columns', this.newColumns)
      })
    },
    // 做些控制 可酌情处理 - -!
    select () {
      let {
        $route: {
          query
        },
        mergedSchema: {
          type,
          database,
          table,
          attributes,
          defaultQuery = {},
          selectPanel: {
            controls = {},
            extraControls = []
          } = {}
        }
      } = this
      let selectKeys = []

      for (let k in controls) {
        let {
          name
        } = controls[k]
        if (name) {
          selectKeys = selectKeys.concat(name)
        }
      }

      if (extraControls.length) {
        selectKeys = selectKeys.concat(extraControls.map(item => item.name))
      }

      if (selectKeys.length) {
        let querykeys = Object.keys(query)
        let hasIn = selectKeys.every(item => querykeys.indexOf(item) > -1)
        if (!hasIn) {
          return
        }
      }

      this.loading = 'loading'
      let newQuery = {
        ...defaultQuery,
        ...query
      }
      if (attributes) {
        newQuery._attributes = attributes.join(',')
      }
      for (let key in newQuery) {
        if (newQuery[key] === '') {
          delete newQuery[key]
        }
      }
      api.dataTableSelect(newQuery, {}, {type, database, table}).then(data => {
        this.loading = ''
        this.data = data
      }).catch(err => {
        this.loading = 'error'
        console.error('dataTableSelect error', err)
        this.$notify.error({
          title: '加载失败',
          message: err.message
        })
      })
    },
    showColumnListDialog () {
      let {
        actions
      } = this
      return actions.find(item => item.name === 'columnList')
    },
    handleColumnDialogOK (data) {
      console.log('xxxtemp', data)
    },
    handleColumnDialogCancel () {
      this.columnListDialogVisible = false
    },
    getSecondActions (row) {
      let {
        mergedSchema,
        mergedSchema: {
          creatable,
          secondActions: actions
        },
        $root: {
          supervisor
        }
      } = this
      if (!actions) return

      let defaultActions = [
        {
          name: 'create',
          type: 'primary',
          icon: 'plus',
          text: '创建',
          disabled: !commonUtils.checkRole(creatable, supervisor),
          click: this.handleCreate
        },
        {
          name: 'columnList',
          type: 'primary',
          icon: 'tickets',
          text: '属性',
          disabled: false,
          click: this.handleColumnList
        },
        {
          name: 'print',
          type: 'primary',
          icon: 'printer',
          text: '打印',
          disabled: false,
          click: this.handlePrint
        }
      ]

      let extraActions = [
        {
          name: 'back',
          type: 'primary',
          icon: 'arrow-left',
          text: '返回',
          disabled: false,
          click: this.handleGoBack
        }
      ]

      if (!actions) {
        return defaultActions
      }
      if (typeof actions === 'function') {
        return actions(row, mergedSchema, defaultActions)
      }
      actions = actions || []
      return actions.map(action => {
        if (typeof action === 'string') {
          return [...defaultActions, ...extraActions].find(a => a.name === action)
        }
        return action
      })
    },
    getActions (row) {
      let {
        mergedSchema,
        mergedSchema: {
          creatable,
          actions
        },
        $root: {
          supervisor
        }
      } = this

      let defaultActions = [
        {
          name: 'create',
          type: 'primary',
          icon: 'plus',
          text: '创建',
          disabled: !commonUtils.checkRole(creatable, supervisor),
          click: this.handleCreate
        },
        {
          name: 'columnList',
          type: 'primary',
          icon: 'tickets',
          text: '属性',
          disabled: false,
          click: this.handleColumnList
        }
      ]

      let extraActions = [
        {
          name: 'back',
          type: 'primary',
          icon: 'arrow-left',
          text: '返回',
          disabled: false,
          click: this.handleGoBack
        },
        {
          name: 'print',
          type: 'primary',
          icon: 'printer',
          text: '打印',
          disabled: false,
          click: this.handlePrint
        }
      ]

      if (!actions) {
        return defaultActions
      }
      if (typeof actions === 'function') {
        return actions(row, mergedSchema, defaultActions)
      }
      actions = actions || []
      return actions.map(action => {
        if (typeof action === 'string') {
          return [...defaultActions, ...extraActions].find(a => a.name === action)
        }
        return action
      })
    },
    getRowActions (row) {
      let {
        mergedSchema,
        mergedSchema: {
          editable,
          copyable,
          deletable,
          rowActions
        },
        $root: {
          supervisor
        }
      } = this
      let defaultActions = [
        editable && commonUtils.checkRole(editable, supervisor) && {
          name: 'edit',
          type: 'default',
          icon: 'edit',
          title: '编辑',
          click: this.handleEdit.bind(this, row)
        },
        copyable && commonUtils.checkRole(copyable, supervisor) && {
          name: 'copy',
          type: 'default',
          icon: 'document',
          title: '复制',
          click: this.handleCopy.bind(this, row)
        },
        deletable && commonUtils.checkRole(deletable, supervisor) && {
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
        return defaultActions
      }
      if (typeof rowActions === 'function') {
        return rowActions(row, mergedSchema, defaultActions)
      }
      rowActions = rowActions || []
      return rowActions.map(action => {
        if (typeof action === 'string') {
          return defaultActions.find(a => a.name === action)
        }
        return action
      })
    },
    getCellActions (row, column) {
      let {
        actions
      } = column
      if (actions) {
        if (typeof actions === 'function') {
          actions = actions(row, column, this)
        }
        return actions
      }
    },
    handleColumnList () {
      // this.columnListDialogVisible = true
      let {
        $route: {
          path
        },
        schema: {
          entityClass
        }
      } = this
      if (entityClass) {
        this.$router.push({
          name: 'EntityFieldManage',
          query: {
            activeMenu: path,
            EntityClass: entityClass
          }
        })
      }
    },
    handleGoBack () {
      this.$router.go(-1)
    },
    handlePrint () {

    },
    handleCreate () {
      let {
        $route: {
          query
        },
        mergedSchema: {
          columns
        }
      } = this
      let editRow = {}
      columns.forEach(c => {
        if (!c.primary) {
          editRow[c.name] = query[c.name] || ''
        }
      })
      this.editType = 'create'
      this.editRow = editRow
      this.editPrimary = {}
    },
    handleEdit (row) {
      let {
        mergedSchema: {
          columns
        }
      } = this
      this.editType = 'update'
      this.editRow = {
        ...row
      }
      let primaryColumns = columns.filter(column => column.primary)
      if (primaryColumns.length === 0) {
        console.warn('primary column not set, maybe unable to edit')
      }
      this.editPrimary = _.pick(row, primaryColumns.map(column => column.name))
    },
    handleCopy (row) {
      this.editType = 'create'
      let {mergedSchema} = this
      let _row = this.copyRow(row, mergedSchema)
      this.editRow = {
        ..._row
      }
      this.editPrimary = {}
    },
    handleDelete (row) {
      let {
        mergedSchema: {
          type,
          database,
          table
        }
      } = this
      this.editType = ''
      api.dataTableDelete(row, {}, {type, database, table}).then(data => {
        this.select()
      }).catch(err => {
        console.error('dataTableDelete error', err)
        this.$notify.error({
          title: '删除失败',
          message: err.response.data
        })
      })
    },
    handleDialogOK () {
      let {
        mergedSchema,
        mergedSchema: {
          type,
          database,
          table,
          columns,
          toDB
        },
        editType,
        editRow,
        editPrimary
      } = this
      let row = {...editRow}
      columns.forEach(column => {
        let {
          name,
          toDB
        } = column
        if (toDB) {
          row[name] = toDB(row[name], row, mergedSchema)
        }
      })
      if (toDB) {
        row = toDB(row)
      }

      // handle row
      columns.forEach(column => {
        if (column.calculate && typeof column.calculate === 'function') {
          for (let key in row) {
            if (column.name === key) {
              row[key] = column.calculate(row)
            }
          }
        }
      })

      // console.log('row', row)
      switch (editType) {
        case 'create': {
          this.dialogSaving = true
          api.dataTableCreate(row, {}, {type, database, table}).then(data => {
            this.editing = false
            this.dialogSaving = false
            this.select()
          }).catch(err => {
            console.error('dataTableCreate error', err)
            this.dialogSaving = false
            this.$notify.error({
              title: '创建失败',
              message: err.response.data
            })
          })
          break
        }
        case 'update': {
          this.dialogSaving = true
          api.dataTableUpdate(row, {
            config: {
              params: editPrimary
            }
          }, {type, database, table}).then(data => {
            this.editing = false
            this.dialogSaving = false
            this.select()
          }).catch(err => {
            this.dialogSaving = false
            console.error('dataTableUpdate error', err)
            this.$notify.error({
              title: '更新失败',
              message: err.response.data
            })
          })
          break
        }
        default: {
          console.warn('Unknown edit type', editType)
        }
      }
    },
    openCustomDialog (customEdit) {
      this.customEdit = customEdit
    },
    closeCustomDialog (customEdit) {
      this.customEdit = undefined
    },
    handleDialogCancel () {
      this.editing = false
    },
    handleCustomDialogOK (row) {
      let {
        customEdit
      } = this
      if (!customEdit) {
        console.warn('custom edit not found')
        return
      }
      let {
        handleOK
      } = customEdit
      handleOK({
        row,
        vnode: this,
        edit: customEdit
      })
    },
    handleCustomDialogCancel () {
      this.customEdit = undefined
    },
    handleSizeChange (pageSize) {
      let {
        data: {
          pagination: {
            page
          }
        }
      } = this
      this.changeQuery({
        _page: `${page},${pageSize}`
      })
    },
    handleCurrentPageChange (page) {
      let {
        data: {
          pagination: {
            pageSize
          }
        }
      } = this
      this.changeQuery({
        _page: `${page},${pageSize}`
      })
    },
    startSearch () {
      let {
        $route: {
          query
        }
      } = this
      let searchQuery = {
        ...query,
        _search: this.search,
        _order: this.$route.query._order
      }
      this.$router.push({query: searchQuery})
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
    },
    copyRow (row, mergedSchema) {
      let _row = {
        ...row
      }
      let primaryColumns = mergedSchema.columns.filter(column => column.primary)
      primaryColumns.forEach(column => {
        delete _row[column.name]
      })
      return _row
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-data-table {
  .first-actions-panel {
    .xc-button-panel {
      display: flex;
      align-items: center;
    }
  }
  .second-actions-panel {
    display: flex;
    justify-content: space-between;
    // margin: 16px 0;
    .xc-select-panel {
      margin: 6px 0;
    }
  }
  .third-actions-panel {
    display: flex;
    align-items: center;
    .search {
      margin-left: 10px;
      margin-bottom: 4px;
      max-width: 40%;
    }
  }

  .table {
    position: relative;
    margin-top: 10px;
    margin-bottom: 10px;
    .cell {
      > .xc-data-table-column {
        display: inline-block;
      }
      > .xc-button-group {
        display: inline-block;
      }
    }
  }
  .after {
    display: flex;
    justify-content: space-between;
  }
}

</style>
