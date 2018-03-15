<template>
  <xc-line-chart
    v-loading.body="loading"
    :title="lineTitle"
    :lineData="lineData"
    @click="chartClick">
  </xc-line-chart>
</template>

<script>
import api from 'api'
import XcLineChart from 'components/lineChart'

export default {
  name: 'xc-base-line',
  components: {
    XcLineChart
  },
  props: {
    schema: Object,
    param: Object
  },
  data () {
    return {
      loading: false,
      lineData: {
        series: [
          {
            name: '发掘次数',
            data: []
          }
        ],
        xAxis: [],
        yAxisIndex: 0
      },
      lineTitle: this.schema.name
    }
  },
  created () {
    this.search(this.param)
  },
  watch: {
    param () {
      this.search(this.param)
    }
  },
  methods: {
    chartClick (param) {
      this.$emit('chartClick', param)
    },
    fixLineData (list) {
      let yData = list.map(item => item.count.value)
      let xAxis = list.map(item => item.key)
      return {
        yData,
        xAxis
      }
    },
    // 使用发掘情况
    search (param) {
      let {sql} = param
      this.loading = true
      api.getEagleEyeOlQuery({sql}).then(data => {
        this.loading = false
        let result = this.fixLineData(data.aggregations.day.buckets)
        this.lineData.series[0].data = result.yData
        this.lineData.xAxis = result.xAxis
        this.lineTitle = `${this.schema.name}-总${result.xAxis.length}天`
      }).catch(err => {
        this.loading = false
        console.error('getEagleEyeOlQuery error', err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-base-line {

}
</style>
