<template>
  <div class="xc-list-report-section">
    <component :is="schema.component" :schema="schema" :param="options" @chartClick="chartClick"></component>
  </div>
</template>

<script>
import {handleSQLByParam} from './schema'
import {timeStrFormat} from 'utils/dateFormat'

export default {
  name: 'xc-list-report-section',
  props: {
    schema: Object,
    param: Object
  },
  data () {
    return {
      default: {}
    }
  },
  computed: {
    options () {
      if (this.schema.fixSQL) {
        this.default.sql = handleSQLByParam(this.param, this.schema)
      }
      Object.assign(this.param, this.default)
      return this.param
    }
  },
  methods: {
    chartClick (param) {
      this.$confirm(`查询${this.schema.name}-${param.name}的流水, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then((val) => {
        let {tagId: type, id} = this.param
        let day = timeStrFormat(param.name)
        let _query = {
          start: day,
          end: day,
          key: this.schema.key
        }
        if (id) {
          Object.assign(_query, {
            type,
            [type]: id
          })
        }
        this.$router.push({name: 'UseFlow', query: _query})
      }).catch((val) => {
        this.$message({
          type: 'info',
          message: '已取消',
          duration: 700
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-list-report-section {

}
</style>
