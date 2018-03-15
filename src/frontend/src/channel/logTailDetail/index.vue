<template>
  <div class="log-tail-detail-container">
    <h2>
      {{title}}
    </h2>
    <el-tabs
      :value="tab"
      type="border-card"
      v-on:tab-click="handleTabClick">
      <el-tab-pane name="realTime" label="实时模式">
        <xc-realTime-tab :data="data" v-if="tab === 'realTime'">
        </xc-realTime-tab>
      </el-tab-pane>
      <!-- <el-tab-pane name="fixed" label="固定模式">
        <xc-fixed-tab :data="data" v-if="tab === 'fixed'">
        </xc-fixed-tab>
      </el-tab-pane> -->
      <!-- <el-tab-pane name="realTime" label="实时模式">
        <xc-realTime-tab :data="data" v-if="tab === 'realTime'">
        </xc-realTime-tab>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import api from 'api'
import Fixed from './fixed'
import RealTime from './realTime'

export default {
  name: 'xc-log-tail-detail',
  components: {
    'xc-realTime-tab': RealTime,
    'xc-fixed-tab': Fixed
  },
  data () {
    return {
      id: this.$route.query._id,
      title: '',
      tab: 'realTime',
      data: {}
    }
  },
  created () {
    // this.getData(this.id)
  },
  methods: {
    getData (id) {
      api.dataTableSelect({
        id,
        limit: 1
      }, {}, {
        type: 'mysql',
        database: 'discovery_admin',
        table: 'tbl_log_tail'
      }).then(data => {
        this.title = data.rows[0].title
        this.data = data.rows[0]
      }).catch(err => {
        this.options = []
        console.error('dataTableSelect error', err)
      })
    },
    handleTabClick (tab) {
      let {
        name
      } = tab
      let {
        $refs: {
          previewTab
        }
      } = this
      if (name === 'preview') {
        previewTab.updateData()
      }
      this.tab = name
    }
  }
}
</script>

<style lang="scss" scoped>
h2 {
  padding: 20px 0 10px;
}
</style>
