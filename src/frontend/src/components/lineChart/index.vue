<template>
  <div class="xc-line-chart"></div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'xc-line-chart',
  props: {
    lineData: {
      type: Object
    },
    title: {
      type: String
    },
    subTitle: {
      type: String
    }
  },
  data () {
    return {
      option: {
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: '650',
          top: 30,
          // orient: 'vertical',
          data: []
        },
        grid: {
          left: '3%',
          width: 600,
          // right: '400px',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value',
          name: '次数'
        },
        series: [
          // {
          //   name: '邮件营销',
          //   type: 'line',
          //   data: [2, 12]
          // }
        ]
      }
    }
  },
  computed: {
  },
  watch: {
    title () {
      this.setChartTitle()
    },
    subTitle () {
      this.setChartSubTitle()
    }
  },
  mounted () {
    this.myChart = echarts.init(this.$el)
    this.setChartData()
    this.setChartTitle()
    this.setChartSubTitle()
    // https://stackoverflow.com/questions/41626565/how-do-i-watch-all-keys-in-a-data-object-in-vue-2
    this.$watch('lineData', this.setChartData, { deep: true })
    this.myChart.on('click', this.handleChartClick)
  },
  methods: {
    handleChartClick (param) {
      this.$emit('click', param)
    },
    setChartData () {
      this.option.series = []
      this.myChart.clear()
      let {series, xAxis, yAxisText, legend} = this.lineData
      let _series = series.map(item => {
        return Object.assign({}, item, {
          type: 'line'
        })
      })
      let legendData = series.map(item => item.name)
      this.option.series = _series
      this.option.legend.data = legendData
      this.option.xAxis.data = xAxis
      if (yAxisText) {
        this.option.yAxis = yAxisText.map(item => {
          return {
            name: item.label,
            type: 'value',
            scale: true
          }
        })
      }
      Object.assign(this.option.legend, legend)
      this.myChart.setOption(this.option)
    },
    setChartTitle () {
      this.option.title.text = this.title
      this.myChart.setOption(this.option)
    },
    setChartSubTitle () {
      this.option.title.subtext = this.subTitle
      this.myChart.setOption(this.option)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-line-chart {
  width: 100%;
  min-width: 620px;
  height: 280px;
}

</style>
