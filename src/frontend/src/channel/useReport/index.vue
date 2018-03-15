<template>
  <div class="channel-use-report">
    <div class="use-pannel">
      <xc-criteria-panel :extraControls="extraControls"></xc-criteria-panel>
      <xc-list-report :schema="schema" :param="param"></xc-list-report>
    </div>
  </div>
</template>

<script>
import * as dateUtils from 'utils/dateFormat'
import XcCriteriaPanel from 'components/criteriaPanel'
import XcListReport from './listReport'
import {schema, param} from './schema'

export default {
  name: 'xc-channel-use-report',
  components: {
    XcCriteriaPanel,
    XcListReport
  },
  data () {
    return {
      schema,
      lineData: {
        series: [
          {
            name: '次数',
            data: []
          }
        ],
        xAxis: []
      },
      lineTitle: '登录情况(页面启动次数)',
      extraControls: [
        {
          title: '统计粒度',
          placeholder: '请选择统计粒度(pivot)',
          name: 'pivot',
          selected: 'pv',
          options: [
            {
              label: '客户',
              value: 'client_id'
            },
            {
              label: '用户',
              value: 'user_id'
            },
            {
              label: 'PV',
              value: 'pv'
            }
          ]
        }
      ]
    }
  },
  created () {
  },
  computed: {
    dateRange () {
      let {
        start,
        end
      } = this.$route.query

      if (start && end) {
        start = dateUtils.format(new Date(start), 'yyyyMMdd')
        end = dateUtils.format(new Date(end), 'yyyyMMdd')
        return [start, end]
      }
      return []
    },
    param () {
      let {
        dateRange,
        $route: {
          query: {
            type,
            client_id: clientId,
            user_id: userId,
            client_type: clientType = '',
            pivot
          }
        }
      } = this
      return {
        ...param,
        type,
        clientId,
        userId,
        clientType,
        dateRange,
        pivot
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-channel-use-report {
}

</style>
