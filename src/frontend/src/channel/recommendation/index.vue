<template>
  <div class="xc-recommendation">
    <div class="use-pannel">
      <xc-criteria-panel></xc-criteria-panel>
      <ul>
        <li class="li-panel" v-for="(section, index) of schema.sections">
          <xc-table
            :schema="section"
            :param="param">
          </xc-table>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as dateUtils from 'utils/dateFormat'
import XcCriteriaPanel from 'components/criteriaPanel'
import XcTable from './table'
import {schema, param} from './schema'

export default {
  name: 'xc-recommendation',
  components: {
    XcCriteriaPanel,
    XcTable
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

.xc-recommendation {
  .li-panel {
    margin-bottom: 20px;
    // float: left;
    margin-right: 40px;
  }
}

</style>
