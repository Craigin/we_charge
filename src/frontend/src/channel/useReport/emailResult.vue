<template>
  <div class="email-item" v-if="param.pivot === 'pv'">
    <xc-line-chart
      v-loading.body="loading"
      :title="lineTitle"
      :subTitle="subTitle"
      :lineData="lineData"
      @click="chartClick">
    </xc-line-chart>
  </div>
</template>

<script>
import * as dateUtils from 'utils/dateFormat'
import api from 'api'
import XcLineChart from 'components/lineChart'
// import {queryEagleEyeRaw} from './schema'

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
            name: '查看的公司数量',
            data: []
          },
          {
            name: '存在邮箱的公司数量',
            data: []
          },
          {
            name: '0邮箱率(%)',
            yAxisIndex: 1,
            data: []
          }
        ],
        xAxis: [],
        yAxisText: [
          {
            // label: '数量'
            label: '' // for UI clarity
          },
          {
            label: '0邮箱率(%)'
          }
        ],
        legend: {
          x: '24%'
        }
      },
      lineTitle: this.schema.name,
      subTitle: ''
    }
  },
  created () {
    this.getEmailsCount(this.param)
  },
  watch: {
    param () {
      if (this.param.pivot === 'pv') {
        this.getEmailsCount(this.param)
      }
    }
  },
  methods: {
    chartClick (param) {
      // this.$emit('chartClick', param)
    },
    fixLineData (list) {
      let allCount = list.map(item => item.allCount)
      let hasEmailsCount = list.map(item => item.hasEmailsCount)
      let noEmailsCount = list.map(item => item.noEmailsCount)
      let noEmailsPercent = list.map(item => (item.noEmailsCount * 100 / item.allCount).toFixed(2))
      let xAxis = list.map(item => item.key)
      let allDaysCount = allCount.reduce((a, b) => a + b)
      let allDaysNoEmailsCount = noEmailsCount.reduce((a, b) => a + b)
      let allDaysNoEmailsPercent = (allDaysNoEmailsCount * 100 / allDaysCount).toFixed(2)
      return {
        allCount,
        hasEmailsCount,
        noEmailsPercent,
        xAxis,
        allDaysCount,
        allDaysNoEmailsCount,
        allDaysNoEmailsPercent
      }
    },
    getEmailsCount (param) {
      let {start, end} = this.$route.query
      let query = {
        ...this.$route.query,
        start: dateUtils.format(new Date(start), 'yyyyMMdd'),
        end: dateUtils.format(new Date(end), 'yyyyMMdd')
      }
      this.loading = true
      api.getEmailsCount(query).then(data => {
        this.loading = false
        if (data.length > 0) {
          let result = this.fixLineData(data)
          this.lineData.series[0].data = result.allCount
          this.lineData.series[1].data = result.hasEmailsCount
          this.lineData.series[2].data = result.noEmailsPercent
          this.lineData.xAxis = result.xAxis
          this.subTitle = `总体0邮箱 ${result.allDaysNoEmailsCount} / ${result.allDaysCount} = ${result.allDaysNoEmailsPercent}%`
        }
      }).catch(err => {
        this.loading = false
        console.error('getEmailsCount error', err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.email-item {
  display: flex;
}
</style>
