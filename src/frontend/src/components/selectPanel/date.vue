<template>
  <el-date-picker
    class="xc-select-panel-date"
    :clearable="schema.clearable"
    :size="schema.size"
    :type="schema.dateType"
    v-model="valueModel"
    :placeholder="schema.placeholder"
    :format="schema.format"
    :unlink-panels="schema.unlink"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    @change="change">
  </el-date-picker>
</template>

<script>
import dateformat from 'dateformat'
import * as dateUtils from 'utils/dateFormat'

export default {
  name: 'xc-select-panel-date',
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
    this.setMonthDate()
  },
  watch: {
    $route () {
      this.setMonthDate()
    }
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
    setMonthDate () {
      let {
        $route: {
          query
        },
        schema: {
          name,
          dateType
        }
      } = this
      if (dateType === 'month') {
        if (!query.hasOwnProperty(name)) {
          let time = dateUtils.format(new Date(), 'yyyy-MM') + '-1'
          query = {
            ...query,
            [name]: dateUtils.format(new Date(time))
          }
          this.$router.replace({query})
        }
      }
    },
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
      // console.log('xxxtemp', newValue)
      this.$emit('change', newValue)
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-select-panel-date {
  width: 158px !important;
}

</style>
