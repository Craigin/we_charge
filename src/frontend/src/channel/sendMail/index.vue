<template>
  <div class="xc-channel-send-mail">
    <!-- <xc-user-filter></xc-user-filter> -->
    <xc-user-upload v-model="form.user_path"></xc-user-upload>
    <xc-image-upload ></xc-image-upload>
    <div class="send-panel">
      <el-form
        ref="form"
        :model="form"
        action="/api/admin/send-mail"
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
            发送邮件
          </el-button>
          <span v-if="sendResult" class="send-result">
          已建立任务，开始发送{{sendResult.count}}封邮件
          <span class="href-span" @click="goTask">点此查看</span>
        </span>
        </el-form-item>
        
      </el-form>
      <div v-if="preview" class="preview">
        <p>预览地址： <a :href="previewNewTabUrl" target="_blank">{{previewNewTabUrl}}</a></p>
        <iframe
          :src="previewUrl"
          frameborder="0"
          width="100%"
          height="100%">
        </iframe>
      </div>

      <div
        :class="['toggle-preview', {active: preview}]"
        title="预览"
        @click="togglePreview">
        <i class="el-icon-picture"></i>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import api from 'api'
import * as dateUtils from 'utils/dateFormat'
import XcUserFilter from 'components/userFilter'
import XcFormItemGroup from 'components/formItemGroup'
import XcUserUpload from 'components/userUpload'
import XcImageUpload from 'components/userUpload/image'

export default {
  name: 'xc-channel-send-mail',
  components: {
    XcUserFilter,
    XcFormItemGroup,
    XcUserUpload,
    XcImageUpload
  },
  data () {
    let {
      $route: {
        query: {
          keyname,
          taskId
        }
      }
    } = this
    let self = this
    return {
      loading: false,
      preview: true,
      previewUrl: '',
      previewNewTabUrl: '',
      apiArray: [],
      taskId: taskId,
      sendResult: undefined,
      url: '',
      schema: {
        labelWidth: '100px',
        columns: [
          {
            name: 'keyname',
            title: '模板',
            type: 'select',
            selectType: 'remoteSelect',
            selectValue: 'keyname',
            selectName: 'title',
            refer: {
              type: 'mysql',
              database: 'discovery_admin',
              table: 'tbl_mail_template',
              attributes: [
                'keyname',
                'title'
              ]
            },
            hint (value) {
              return [
                {
                  type: 'buttons',
                  buttons: [
                    {
                      type: 'primary',
                      text: '编辑模板',
                      click (e, model) {
                        let {
                          row: form,
                          row: {
                            edit_template: editTemplate
                          }
                        } = model
                        form.edit_template = !editTemplate
                      }
                    }
                  ]
                },
                '，或者查看',
                {
                  type: 'link',
                  text: '模板详情',
                  to: {
                    name: 'MailTemplate',
                    query: {
                      keyname: value
                    }
                  }
                }
              ]
            }
          },
          {
            name: 'template',
            title: '模板正文',
            type: 'code',
            codeType: 'html',
            show (value, form) {
              return form.edit_template
            },
            editorStyle: {
              minHeight: '320px'
            },
            hint (value) {
              return [
                {
                  type: 'buttons',
                  buttons: [
                    {
                      type: 'primary',
                      text: '保存此模板',
                      click (e, model) {
                        let {
                          row: {
                            keyname,
                            template,
                            template_id: templateId,
                            body: isMailList,
                            data: mailData
                          }
                        } = model
                        console.log(model)
                        if (!templateId) {
                          throw new Error('模板尚未加载')
                        }
                        api.dataTableUpdate({
                          id: templateId,
                          data: template,
                          mailData: mailData,
                          isMailList: isMailList
                        }, {}, {
                          type: 'mysql',
                          database: 'discovery_admin',
                          table: 'tbl_mail_template'
                        }).then(data => {
                          self.$notify.info({
                            title: '邮件模板保存成功',
                            message: `${keyname}#${templateId}`
                          })
                        }).catch(err => {
                          console.error('dataTableUpdate error', err)
                          self.$notify.error({
                            title: '邮件模板保存失败',
                            message: err.response.data
                          })
                        })
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            name: 'data',
            title: '邮件参数',
            type: 'json'
          },
          {
            name: 'body',
            title: '相同邮件正文',
            type: 'select',
            options: [
              {
                name: '相同',
                value: 'same'
              },
              {
                name: '不同',
                value: 'different'
              }
            ]
          },
          {
            name: 'send_user_name',
            title: '发送人名称'
          }
        ]
      },
      form: {
        keyname: keyname || '',
        template: '',
        template_id: undefined,
        edit_template: !!keyname,
        data: null,
        body: undefined,
        send_user_name: '小满科技',
        api_data: '{}',
        api: null,
        user_path: ''
      }
    }
  },
  created () {
    this.debouncedUpdatePreviewUrl = _.debounce(this.updatePreviewUrl, 1000)
    this.updatePreviewUrl()
    this.getTaskPayload(this.taskId)
  },
  destroyed () {
    this.deletePreview()
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
  watch: {
    form: {
      handler () {
        this.debouncedUpdatePreviewUrl()
      },
      deep: true
    },
    'form.keyname' () {
      let {
        form
      } = this
      form.template = ''
      form.template_id = undefined
    },
    'form.user_path' (data) {
      console.log(data)
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
      api.sendMail(data).then(response => {
        this.loading = false
        this.sendResult = response
        this.url = response.resultId
      }).catch(err => {
        this.loading = false
        console.error('sendMail error', err)
        this.$notify.error({
          title: '发送消息失败',
          message: err.response.data
        })
      })
    },
    togglePreview () {
      this.preview = !this.preview
    },
    getPreviewUrl () {
      let {
        form,
        form: {
          edit_template: editTemplate
        }
      } = this
      let queryString = editTemplate ? `q=${Math.random()}` : _.map(form, (value, key) => {
        return `${key}=${encodeURIComponent(value)}`
      }).join('&')
      return `/api/mail/render-mail?${queryString}`
    },
    updatePreviewUrl () {
      let {
        form,
        form: {
          keyname,
          template,
          edit_template: editTemplate
        }
      } = this
      if (!editTemplate) {
        this.previewUrl = this.getPreviewUrl()
        return
      }
      Promise.resolve().then(() => {
        if (template) {
          return
        }
        return api.dataTableSelect({
          keyname
        }, {}, {
          type: 'mysql',
          database: 'discovery_admin',
          table: 'tbl_mail_template'
        }).then(data => {
          let {
            rows: [
              row
            ]
          } = data
          if (!row) {
            this.$notify.error({
              title: `邮件模板'${keyname}'不存在`,
              message: '模板不存在'
            })
            return
          }
          form.template_id = row.id
          form.template = row.data
          form.data = form.data ? form.data : row.mailData
          form.body = form.body ? form.body : row.isMailList
        }).catch(err => {
          console.error('dataTableSelect error', err)
          this.$notify.error({
            title: `加载邮件模板'${keyname}'失败`,
            message: err.message
          })
        })
      }).then(() => {
        return api.setRenderMailOptions(form).then(data => {
          this.previewNewTabUrl = `${window.location.protocol}//${window.location.host}/api/public/render-mail?id=${data.user_id}`
          this.previewUrl = this.getPreviewUrl()
        }).catch(err => {
          console.error('set render mail options', err)
        })
      })
    },
    goTask () {
      this.$router.push({
        name: 'Task',
        query: {
          _search: this.url
        }
      })
    },
    deletePreview () {
      api.deleteMailOptions().then().catch(err => {
        console.error('delete render mail options', err)
      })
    },
    getApiData (id) {
      api.getApiList({id: id}).then(data => {
        this.form['api_data'] = JSON.stringify(data)
      }).catch(err => {
        console.error('get api list', err)
      })
    },
    getTaskPayload (id) {
      if (id) {
        api.dataTableSelect({
          id: id
        }, {}, {
          type: 'mysql',
          database: 'discovery_admin',
          table: 'tbl_task'
        }).then(data => {
          let rowData = data.rows[0]
          rowData = JSON.parse(rowData.payload)
          this.form['user_path'] = rowData.userPath
          this.form.data = rowData.mailData
          this.form['send_user_name'] = rowData.sendName
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-channel-send-mail {
  .href-span {
    cursor: pointer;
    color: $error;
  }
  .send-panel {
    display: flex;
    flex-direction: row;
    position: relative;
    min-height: 600px;

    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid $divider;

    form {
      flex: 2;
    }
    .preview {
      flex: 3;

      p {
        margin-bottom: 10px;
      }
    }

    .toggle-preview {
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
      padding: 2px 5px;
      border-radius: 2px;

      color: #666;
      background: #eee;
      &:hover {
        color: #222;
      }
      &.active {
        background: #aaa;
      }
    }
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
}

</style>
