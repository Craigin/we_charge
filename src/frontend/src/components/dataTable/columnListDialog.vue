<template>
  <el-dialog
    class="xc-table-columns-list-dialog"
    :title="title"
    :visible.sync="visible">
    <xc-data-table :schema="schema"></xc-data-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        :disabled="saving"
        :icon="saving ? 'loading' : ''"
        @click="handleOK">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from 'api'
import DataTable from 'components/dataTable'
import {DB_WECHARGE_NAME, TABLE_COLUMN_ID} from 'router/dataTables/common'

export default {
  name: 'xc-table-columns-list-dialog',
  components: {
    'xc-data-table': DataTable
  },
  props: {
    columnListDialogVisible: {
      type: Boolean
    },
    editing: {
      type: Boolean
    },
    saving: {
      type: Boolean
    },
    title: {
      type: String
    },
    columns: {
      type: Array
    },
    row: {
      type: Object
    }
  },
  data () {
    return {
      formLabelWidth: '120px',
      schema: {
        type: 'mysql',
        database: DB_WECHARGE_NAME,
        table: 'room',
        selectPanel: {
          extraControls: [
            {
              title: '管理区',
              name: 'ZoneName',
              options: () => {
                return api.dataTableSelect({_page: '1,9999'}, {}, {type: 'mysql', database: DB_WECHARGE_NAME, table: 'zone'}).then(data => {
                  return data.rows.map(item => {
                    return {
                      ...item,
                      name: item.ZoneName,
                      value: item.ZoneName
                    }
                  })
                })
              }
            }
          ]
        },
        columns: [
          TABLE_COLUMN_ID,
          {
            index: 2,
            name: 'RoomClass',
            title: '房间类别',
            type: 'select',
            options: [
              {
                name: '私人',
                value: 0
              },
              {
                name: '集体',
                value: 1
              }
            ]
          },
          {
            index: 3,
            name: 'UserName',
            title: '用户名称'
          },
          {
            index: 4,
            name: 'RoomName',
            title: '房间号'
          },
          {
            index: 5,
            name: 'WaterChargeClass',
            title: '水费标准'
          },
          {
            index: 6,
            name: 'ElectricityChargeClass',
            title: '电费标准'
          },
          {
            index: 7,
            name: 'GarbageChargeClass',
            title: '垃圾费标准'
          },
          {
            index: 8,
            name: 'Notes',
            title: '备注'
          }
        ]
      }
    }
  },
  created () {
    // console.log(this.row)
    // console.log(this.columns)
  },
  computed: {
    visible: {
      get () {
        return this.columnListDialogVisible
      },
      set (value) {
        if (this.columnListDialogVisible && !value) {
          this.$emit('cancel')
        }
      }
    }
  },
  methods: {
    handleOK () {
      this.$emit('ok', this.row)
    },
    handleCancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-table-columns-list-dialog {
}

</style>
