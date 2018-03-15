<template>
  <div class="xc-channel-send-message">
    <div class="use-pannel">
      <xc-user-filter></xc-user-filter>
      <el-form
        class="message-options"
        ref="form"
        :model="form"
        action="/api/admin/send-message"
        method="POST"
        enctype="multipart/form-data"
        label-width="80px">
        <xc-form-item-group :schema="schema" :model="form">
        </xc-form-item-group>
        <el-form-item>
          <el-button
            class="btn-send"
            type="primary"
            :icon="loading ? 'loading' : ''"
            :disabled="loading"
            @click="handleSubmit">
            发送消息
          </el-button>
          <span v-if="sendResult" class="send-result">
            已发送{{sendResult.count}}条消息，(id={{sendResult.batch_id}})
            <a href="#" @click.prevent="handleRevoke">
              撤回
            </a>
          </span>
          <span v-if="revokeResult" class="revoke-result">
            已撤回{{revokeResult.count}}条消息，(id={{revokeResult.batch_id}})
          </span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import api from 'api'
import * as dateUtils from 'utils/dateFormat'
import XcUserFilter from 'components/userFilter'
import XcFormItemGroup from 'components/formItemGroup'

export default {
  name: 'xc-channel-send-message',
  components: {
    XcUserFilter,
    XcFormItemGroup
  },
  data () {
    let {
      $route: {
        query: {
          keyname
        }
      }
    } = this
    return {
      loading: false,
      sendResult: undefined,
      revokeResult: undefined,
      schema: {
        labelWidth: '100px',
        columns: [
          {
            name: 'keyname',
            title: '模板',
            type: 'select',
            selectType: 'remoteSelect',
            selectValue: 'keyname',
            selectName: 'lang',
            refer: {
              type: 'mysql',
              database: 'discovery_admin',
              table: 'tbl_message_template',
              attributes: [
                'keyname',
                'lang'
              ]
            },
            hint (value) {
              return [
                '选择中文/英文是等价的。查看',
                {
                  text: '模板详情',
                  to: {
                    name: 'MessageTemplate',
                    query: {
                      keyname: value
                    }
                  }
                }
              ]
            }
          },
          {
            name: 'content',
            title: '消息参数',
            type: 'json'
          },
          {
            name: 'create_time',
            title: '时间',
            type: 'date',
            dateType: 'datetime',
            hint: '默认当前时间'
          },
          {
            name: 'status',
            title: '初始状态',
            type: 'select',
            options: [
              {
                value: 0,
                name: '未读'
              },
              {
                value: 1,
                name: '已读'
              }
            ],
            hint: '默认未读'
          }
        ]
      },
      form: {
        keyname: keyname || '',
        content: {},
        create_time: undefined,
        status: 0
      }
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
        type,
        clientId,
        userId,
        clientType,
        dateRange
      }
    }
  },
  methods: {
    handleSubmit () {
      let {
        $route: {
          query
        },
        form
      } = this

      let data = {
        ..._.pick(query, [
          'client_type',
          'client_id',
          'user_id'
        ]),
        ...form
      }
      this.loading = true
      this.sendResult = undefined
      this.revokeResult = undefined
      api.sendMessage(data).then(response => {
        this.loading = false
        this.sendResult = response
      }).catch(err => {
        this.loading = false
        console.error('sendMessage error', err)
        this.$notify.error({
          title: '发送消息失败',
          message: err.response.data
        })
      })
    },
    handleRevoke () {
      let {
        sendResult: {
          batch_id: batchId
        } = {}
      } = this
      api.revokeBatchMessage({
        id: batchId
      }).then(data => {
        this.sendResult = undefined
        this.revokeResult = data
      }).catch(err => {
        console.error('revokeBatchMessage error', err)
        this.$notify.error({
          title: '撤回消息失败',
          message: err.response.data
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-channel-send-message {
  .message-options {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid $divider;
  }

  .btn-send {
    margin-left: 20px;
  }
  .send-result {
    a {
      color: $error;
      font-weight: bold;
    }
  }
  .revoke-result {
    color: $main_green;
  }
}

</style>
