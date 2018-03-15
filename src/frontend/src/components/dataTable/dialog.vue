<template>
  <el-dialog
    class="xc-data-table-dialog"
    :title="title"
    :visible.sync="visible">
    <el-form :model="row">
      <el-form-item
        v-for="column of columns"
        v-if="column.edit && column.show !== false"
        :key="column.name"
        :label="column.title"
        :label-width="formLabelWidth">
        <xc-form-item
          :schema="column"
          :value="row[column.name]"
          :row="row"
          :visible="visible">
        </xc-form-item>
      </el-form-item>
    </el-form>
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
import FormItem from 'components/formItem'

export default {
  name: 'xc-data-table-dialog',
  components: {
    'xc-form-item': FormItem
  },
  props: {
    editing: {
      type: Boolean,
      required: true
    },
    saving: {
      type: Boolean
    },
    title: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    row: {
      type: Object,
      required: true
    },
    schema: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  created () {
    // console.log(this.row)
    // console.log(this.columns)
  },
  computed: {
    formLabelWidth () {
      return this.schema.formLabelWidth || '100px'
    },
    visible: {
      get () {
        return this.editing
      },
      set (value) {
        if (this.editing && !value) {
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

.xc-data-table-dialog {
  .el-dialog__body {
  }
}

</style>
