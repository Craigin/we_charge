<template>
  <el-dialog title="修改点数" :visible.sync="visible">
    <el-form :model="form">
      <el-form-item label="修改客户" :label-width="labelWidth">
        <i v-if="!form.clientName" class="el-icon-loading"></i>
        <a :href="clientHref" target="_blank">{{form.clientName}}</a>
        <el-tag v-if="form.clientId">{{form.clientId}}</el-tag>
      </el-form-item>
      <el-form-item v-if="form.clientScore" label="当前积分" :label-width="labelWidth">
        <el-tag :type="typeof form.clientScore === 'number' ? 'success' : 'danger'">{{form.clientScore}}</el-tag>
      </el-form-item>
      <el-form-item label="模式" :label-width="labelWidth">
        <el-select v-model="form.mode" placeholder="请选择">
          <el-option label="绝对数值(abs)" value="abs">
          </el-option>
          <el-option label="变化数值(inc)" value="inc">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="valueLabel" :label-width="labelWidth">
        <el-input-number v-model="form.value">
        </el-input-number>
      </el-form-item>
      <el-form-item label="修改理由" :label-width="labelWidth" required>
        <el-input type="textarea" v-model="form.reason" placeholder="必填">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        :disabled="updatingCredit"
        :icon="updatingCredit ? 'loading' : ''"
        @click="handleOK">
        确定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from 'api'
import {HOSTS} from 'config'
import emitter from 'common/emitter'
import * as commonUtils from 'common/utils'
import apiPrivileges from 'common/apiPrivileges'

const DEFAULT_FORM = {
  clientId: 0,
  clientName: '',
  clientCredit: undefined,
  mode: 'inc',
  value: 0,
  reason: ''
}

export default {
  name: 'xc-credit-edit',
  components: {
  },
  data () {
    return {
      updatingCredit: false,
      visible: false,
      labelWidth: '40%',
      form: {
        ...DEFAULT_FORM
      }
    }
  },
  created () {
    emitter.on('editCredit', this.handleEdit)
  },
  beforeDestroy () {
    emitter.removeListener('editCredit', this.handleEdit)
  },
  computed: {
    valueLabel () {
      return this.form.mode === 'abs' ? '绝对数值' : '变化数值'
    },
    clientHref () {
      let {
        form: {
          clientId
        }
      } = this
      if (clientId) {
        let where = {client_id: clientId}
        where = encodeURIComponent(JSON.stringify(where))
        return `${HOSTS.LANTERN}/#/database/v4_admin/tbl_client?where=${where}`
      }
    }
  },
  methods: {
    loadClient (clientId) {
      api.getClientCredit({clientId}).then(data => {
        let {
          client,
          score
        } = data
        this.form.clientName = (client && client.name) || '???'
        this.form.clientScore = parseFloat(score)
      }).catch(err => {
        console.log('getClientCredit error', err)
        this.form.clientName = '???'
        this.form.clientScore = '获取点数记录失败，无法修改'
      })
    },
    handleEdit (data) {
      let {
        $root: {
          supervisor
        }
      } = this
      let {roles} = apiPrivileges['/admin/client-credit/update']
      if (!commonUtils.checkRole(roles, supervisor)) {
        this.$notify.error({
          title: '没有权限',
          message: '你没有权限修改公司点数'
        })
        return
      }
      this.visible = true
      let {client_id: clientId} = data
      this.form = {
        ...DEFAULT_FORM,
        clientId
      }
      this.loadClient(clientId)
    },
    handleCancel () {
      this.visible = false
    },
    handleOK () {
      this.updatingCredit = true
      api.setClientCredit(this.form).then(data => {
        this.updatingCredit = false
        this.visible = false
        this.$notify({
          title: '成功',
          message: `已设置客户点数为: ${data.score}`,
          type: 'success'
        })
      }).catch(err => {
        this.updatingCredit = false
        console.log('setClientCredit error', err)
        this.$notify({
          type: 'error',
          title: '失败',
          message: '设置客户点数失败'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
