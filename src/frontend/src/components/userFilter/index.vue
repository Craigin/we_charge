<template>
  <div class="xc-user-filter">
    <xc-criteria-panel
      :controls="['clientUserSearch', 'clientType']">
    </xc-criteria-panel>
    <div v-if="summary" class="summary">
      共
      <span class="number">
        {{summary.clients}}
      </span>
      家客户，
      <span class="number">
        {{summary.users}}
      </span>
      位用户
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import api from 'api'
import XcCriteriaPanel from 'components/criteriaPanel'

export default {
  name: 'xc-user-filter',
  components: {
    XcCriteriaPanel
  },
  props: {
  },
  data () {
    return {
      summary: undefined
    }
  },
  watch: {
    $route () {
      this.updateSummary()
    }
  },
  created () {
    this.updateSummary()
  },
  methods: {
    updateSummary () {
      let {
        $route: {
          query
        }
      } = this
      let options = _.pick(query, [
        'client_type',
        'client_id',
        'user_id'
      ])
      api.filterUser(options).then(data => {
        let clients = _.uniqBy(data, 'client_id')
        this.summary = {
          clients: clients.length,
          users: data.length
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-user-filter {
  .summary {
    color: $sub_font;
    margin-left: 100px;
    .number {
      color: $error;
      font-weight: bold;
    }
  }
}
</style>
