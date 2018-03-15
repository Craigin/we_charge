<template>
  <div class="channel-use-flow">
    <div class="use-pannel">
      <xc-criteria-panel></xc-criteria-panel>
      <xc-list-flow
        :schema="schema"
        :param="param">
      </xc-list-flow>
    </div>
  </div>
</template>

<script>
import * as dateUtils from 'utils/dateFormat'
import XcCriteriaPanel from 'components/criteriaPanel'
import XcListFlow from './listFlow'
import {schema, param} from './schema'

export default {
  name: 'xc-user-flow',
  components: {
    XcCriteriaPanel,
    XcListFlow
  },
  data () {
    return {
      schema
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
        start = dateUtils.format(new Date(start), 'yyyy-MM-dd')
        end = dateUtils.format(new Date(end), 'yyyy-MM-dd')
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
            client_type: clientType = ''
          }
        }
      } = this
      return {
        ...param,
        type,
        clientId,
        userId,
        clientType,
        dateRange
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.channel-use-flow {
}

</style>
