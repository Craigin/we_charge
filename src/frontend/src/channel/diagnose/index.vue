<template>
  <div class="xc-diagnose">
    <div class="use-pannel">
      <ul>
        <li class="li-panel" v-for="(section, index) of schema.sections">
          <xc-table
            :schema="section"
            :param="{}">
          </xc-table>
        </li>
        <li class="li-panel">
          <div class="title">
            Hunter.io使用率
            <span v-if="loadHunterStatus == 'error'" class="loading-error">
              <i class="el-icon-error"></i>
              加载失败
            </span>
            <i v-else-if="loadHunterStatus" class="el-icon-loading"></i>
          </div>
          <div class="content hunter-progress">
            <el-progress type="circle" :percentage="hunterProgress"></el-progress>
            <div class="detail" v-if="hunterAccount">
              <div>
                {{hunterAccount.first_name}} {{hunterAccount.last_name}}
                -
                {{hunterAccount.email}}
              </div>
              <div>
                <div class="name">Usage:</div>
                {{formatNumber(hunterAccount.calls.used)}}
                /
                {{formatNumber(hunterAccount.calls.available)}}
              </div>
              <div>
                <div class="name">Team:</div>
                {{hunterAccount.team_id}}
              </div>
              <div>
                <div class="name">Plan:</div>
                {{hunterAccount.plan_name}} {{hunterAccount.plan_level}}
              </div>
              <div>
                <div class="name">Reset date:</div>
                {{hunterAccount.reset_date}}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from 'api'
import {formatNumber} from 'common/utils'
import XcTable from './table'
import {schema} from './schema'

export default {
  name: 'xc-diagnose',
  components: {
    XcTable
  },
  data () {
    return {
      schema,
      hunterAccount: undefined,
      loadHunterStatus: ''
    }
  },
  created () {
    this.loadHunterStatus = 'loading'
    api.getHunterAccount().then(data => {
      this.loadHunterStatus = ''
      this.hunterAccount = data
    }).catch(err => {
      this.loadHunterStatus = 'error'
      console.error('getHunterAccount err', err)
    })
  },
  computed: {
    hunterProgress () {
      let {
        hunterAccount
      } = this
      if (hunterAccount) {
        let {
          calls: {
            used,
            available
          }
        } = hunterAccount
        return Math.floor(100 * used / available)
      }
      return 0
    }
  },
  methods: {
    formatNumber
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-diagnose {
  .li-panel {
    // float: left;
    margin-bottom: 20px;
    margin-right: 40px;
    .content {
      margin-top: 16px;
    }
    .hunter-progress {
      display: flex;
      .detail {
        padding-left: 30px;
        color: $sub_font;
        align-self: center;
        .name {
          display: inline-block;
          width: 80px;
          color: $light_font;
        }
      }
    }
  }
}

</style>
