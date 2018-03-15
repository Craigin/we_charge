<template>
<div class="xc-form-item-group">
  <el-form-item
    v-for="column of schema.columns"
    :key="column.name"
    :class="{hide: getColumnShow(column) === false}"
    :label="column.title"
    :label-width="schema.labelWidth || formLabelWidth">
    <xc-form-item
      :schema="column"
      :value="model[column.name]"
      :row="model">
    </xc-form-item>
  </el-form-item>
</div>
</template>

<script>
import FormItem from 'components/formItem'

export default {
  name: 'xc-form-item-group',
  components: {
    'xc-form-item': FormItem
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      formLabelWidth: '100px'
    }
  },
  methods: {
    getColumnShow (column) {
      let {
        show,
        name
      } = column
      if (typeof show === 'function') {
        let {
          model,
          model: {
            [name]: value
          }
        } = this
        return show(value, model, column)
      }
      return show
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-form-item-group {
  .hide {
    display: none;
  }
}
</style>
