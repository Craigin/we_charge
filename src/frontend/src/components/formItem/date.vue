<template>
  <el-date-picker
    class="xc-form-date"
    :disabled="schema.disabled"
    :type="schema.dateType"
    v-model="valueModel"
    :format="schema.format"
    @change="change">
  </el-date-picker>
</template>

<script>
import dateformat from 'dateformat'

export default {
  name: 'xc-form-date',
  components: {
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
    },
    row: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      options: []
    }
  },
  created () {
  },
  computed: {
    valueModel: {
      get () {
        let {
          schema: {
            name
          },
          row
        } = this
        return row[name]
      },
      set (value) {
        let {
          schema: {
            name,
            outputFormat
          },
          row
        } = this
        if (value && outputFormat) {
          if (typeof outputFormat === 'function') {
            value = Array.isArray(value) ? value.map(d => outputFormat(d)) : outputFormat(value)
          } else {
            value = Array.isArray(value) ? value.map(d => dateformat(d, outputFormat)) : dateformat(value, outputFormat)
          }
        }
        this.$set(row, name, value)
      }
    }
  },
  methods: {
    change (newValue) {
      let {
        schema,
        schema: {
          change
        },
        row
      } = this
      if (change) {
        change(newValue, row, schema)
      }
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-form-date {
}

</style>
