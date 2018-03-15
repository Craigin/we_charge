<template>
  <div class="login-page bg">
    <!-- <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.pwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form> -->

    <div class="container">
        <div class="line bouncein">
          <el-form ref="form" :model="form" label-width="80px">
            <div class="xs6 xm4 xs3-move xm4-move">
              <div class="panel loginbox">
                  <div class="text-center margin-big padding-big-top">
                      <h1>后台管理中心</h1>
                  </div>
                  <div class="panel-body">
                      <div class="form-group">
                          <div class="field ">
                              <el-input v-model="form.name" type="text" class="input input-big" name="name" id="username" placeholder="登录账号" />
                              <!-- <span class="icon icon-user margin-small"></span> -->
                              <dx-icon class="action-icon" name="person"></dx-icon>
                          </div>
                      </div>
                      <div class="form-group">
                          <div class="field ">
                              <el-input v-model="form.pwd" type="password" class="input input-big" name="password" id="password"  placeholder="登录密码" />
                              <dx-icon class="action-icon small" name="mima"></dx-icon>
                          </div>
                      </div>
                  </div>
                  <div class="submit-foot">
                      <el-button type="primary"  @click="onSubmit">登录</el-button>
                  </div>
              </div>
            </div>
          </el-form>
        </div>
    </div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
import api from 'api'
import Icon from 'components/icon'

export default {
  name: 'xc-login',
  components: {
    'dx-icon': Icon
  },
  data () {
    return {
      form: {
        name: '',
        pwd: ''
      }
    }
  },
  created () {
    // this.$router.replace({name: 'Diagnose'})
  },
  methods: {
    onSubmit () {
      api.login({userid: this.form.name, password: this.form.pwd}).then(data => {
        console.log(data)
        if (data) {
          let {
            supervisor,
            token,
            ip
          } = data
          this.$root.supervisor = supervisor
          this.$root.ip = ip
          this.$root.token = token
          // console.log('xxxtemp', this.$root.supervisor)
          Cookie('token', token)
          this.$router.push({
            name: 'Room'
          })
          // window.location.href = '/charge/manage/room'
        }
      }).catch(err => {
        this.$message.error({
          message: '登录失败，请检查输入的账号和密码',
          duration: 3000
        })
        console.error('login error', err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';
@import '~styles/login';
@import '~styles/login1';

.login-page {
  position: fixed !important;
  top: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  // background: white;
  z-index: 1500;
  margin-left: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  .margin-big {
    margin: 8px;
  }
  .action-icon {
    font-size: 26px;
    position: absolute;
    right: 10px;
    top: 10px;
    &.small {
      font-size: 25px;
    }
  }
  .input {
    margin-bottom: 4px;
    padding: 0px;
    border: none;
    .el-input__inner {
      height: 46px  !important;
    }
  }
  .el-input {
    .el-input__inner {
      height: 46px  !important;
    }
  }
  .submit-foot {
    display: flex;
    justify-content: center;
    padding: 0 15px;
    padding-bottom: 24px;
    .el-button {
      width: 100%;
      height: 44px;
    }
  }
}

</style>
