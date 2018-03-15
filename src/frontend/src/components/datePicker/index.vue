<template>
  <el-date-picker
      v-model="value"
      :type="type"
      align="left"
      placeholder="选择日期范围"
      :picker-options="pickerOptions2"
      @change="change">
  </el-date-picker>
</template>

<script>
import {format} from 'utils/dateFormat'

export default {
  name: 'xc-date-picker',
  props: {
    default: Array,
    type: {
      type: String,
      default: 'daterange'
    }
  },
  data () {
    return {
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      value: ''
    }
  },
  created () {
    if (this.default) {
      this.value = this.default
    }
  },
  watch: {
    value () {
      this.value = this.value || []
      let [_value, _value2] = []
      if (this.type === 'daterange') {
        _value = this.value.filter(item => item).map(item => format(item, 'yyyyMMdd'))
        _value2 = this.value.filter(item => item).map(item => format(item, 'yyyy-MM-dd'))
      } else if (this.type === 'datetimerange') {
        _value = this.value.filter(item => item).map(item => format(item, 'yyyyMMdd hh:mm:ss'))
        _value2 = this.value.filter(item => item).map(item => format(item, 'yyyy-MM-dd hh:mm:ss'))
      }
      this.$emit('change', _value, _value2)
    }
  },
  methods: {
    change (val) {
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-date-picker {

}
</style>
