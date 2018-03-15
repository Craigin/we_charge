<template>
  <xc-line-chart
    v-loading.body="loading"
    :title="lineTitle"
    :lineData="lineData"
    @click="chartClick">
  </xc-line-chart>
</template>

<script>
import _ from 'lodash'
import api from 'api'
import XcLineChart from 'components/lineChart'
import {handleSQLByParam} from './schema'

const seriesLine = [
  {
    name: '搜索结果跳转',
    where: `referrer = ':searchResults'`
  },
  {
    name: '发掘结果跳转',
    where: `referrer = ':miningResults'`
  },
  {
    name: '推荐列表跳转',
    where: `referrer = ':recommendation'`
  },
  {
    name: '关注列表跳转',
    where: `referrer = ':favorites'`
  },
  {
    name: '历史记录跳转',
    where: `referrer = ':history'`
  },
  {
    name: '已购买跳转',
    where: `referrer = ':bought'`
  },
  {
    name: '头部搜索直接跳转',
    where: `referrer = ':header-search'`
  },
  {
    name: '名录列表跳转',
    where: `referrer = ':dataSquareDirectory'`
  }
]

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
        series: seriesLine.map(item => {
          return Object.assign({}, item, {
            data: []
          })
        }),
        xAxis: [],
        yAxisIndex: 0,
        legend: {
          x: '24%'
        }
      },
      lineTitle: this.schema.name
    }
  },
  created () {
    this.search(this.param)
  },
  watch: {
    param () {
      // this.lineData.xAxis = this.param.dateRange
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
    // 查看公司详情次数
    search (param) {
      let promises = this.lineData.series.map(item => {
        let _param = Object.assign({}, param, {where: item.where})
        let sql = handleSQLByParam(_param, this.schema)
        return new Promise((resolve, reject) => {
          api.getEagleEyeOlQuery({sql}).then(data => {
            resolve(data.aggregations.day.buckets)
          }).catch(err => {
            reject(err)
            console.error('getEagleEyeOlQuery error', err)
          })
        })
      })
      this.loading = true
      Promise.all(promises).then(posts => {
        this.loading = false
        // FIXME 这里的时间取值不是很对
        this.lineData.xAxis = _.max(posts, item => item.length).map(item => item.key)
        for (let i = 0; i < this.lineData.series.length; i++) {
          let serie = this.lineData.series[i]
          serie.data = this.lineData.xAxis.map(day => {
            let {count: {value: num}} = posts[i].find(item => item.key === day) || {count: {value: 0}}
            return num
          })
        }
        // 计算总数 TODO
        // this.lineData.series.
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
