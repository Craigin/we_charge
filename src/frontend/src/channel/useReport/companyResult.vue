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
import {handleSQLByParam} from './schema'

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
            name: '搜索次数',
            data: []
          },
          {
            name: '0结果率(%)',
            yAxisIndex: 1,
            data: []
          }
        ],
        xAxis: [],
        yAxisText: [
          {
            label: '搜索次数'
          },
          {
            label: '0结果率(%)'
          }
        ]
      },
      lineTitle: this.schema.name
    }
  },
  created () {
    this.searchCount(this.param)
  },
  watch: {
    param () {
      this.searchCount(this.param)
    }
  },
  methods: {
    chartClick (param) {
      this.$emit('chartClick', param)
    },
    fixLineData (list) {
      let yData = list.map(item => item.count.value)
      let xAxis = list.map(item => item.key)
      // let yAxis = list.map(item => item.day)
      return {
        yData,
        xAxis
      }
    },
    // 搜索次数/流水 2335764
    searchCount (param) {
      let {sql} = param
      this.loading = true
      api.getEagleEyeOlQuery({sql}).then(data => {
        this.loading = false
        let result = this.fixLineData(data.aggregations.day.buckets)
        this.lineData.series[0].data = result.yData
        this.lineData.xAxis = result.xAxis
        this.lineTitle = `${this.schema.name}-总${result.xAxis.length}天`
        // total = 0
        this.searchEmptyTotal(this.param, data.aggregations.day.buckets)
      }).catch(err => {
        this.loading = false
        console.error('getEagleEyeOlQuery error', err)
      })
    },
    searchEmptyTotal (param, countData) {
      let _param = Object.assign({}, param, {where: 'total is null'})
      let sql = handleSQLByParam(_param, this.schema)
      api.getEagleEyeOlQuery({sql}).then(data => {
        this.lineData.series[1].data = this.lineData.xAxis.map(day => {
          let {count: {value: all}} = countData.find(item => item.key === day)
          let {count: {value: noneCount}} = data.aggregations.day.buckets.find(item => item.key === day) || {count: {value: 0}}
          return (noneCount * 100 / all).toFixed(2)
        })
      }).catch(err => {
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
