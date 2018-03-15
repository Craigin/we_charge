<template>
  <div class="xc-user-info" v-if="user">
    <div class="time">
      {{date}}
    </div>
    <el-dropdown  @command="handleCommand">
      <div class="el-dropdown-link">
        <div class="avatar" :title="user.UserID" :style="avatarStyle">
          {{user.UserID}}
        </div>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item class="logout" command="logout">
          <span>退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import api from 'api'
import { HOSTS } from 'config'
import dateformat from 'dateformat'

export default {
  name: 'xc-user-info',
  props: {
    user: Object
  },
  data () {
    return {
      host: HOSTS.PERSON,
      date: dateformat(new Date(), 'yyyy/mm/dd')
    }
  },
  computed: {
    avatarStyle () {
      let color = ['#E6A23C', '#67C23A', '#409EFF']
      let n = Math.ceil(Math.random() * 10)
      let bg
      if (n < 3) {
        bg = color[0]
      } else if (n < 6) {
        bg = color[1]
      } else {
        bg = color[2]
      }
      return {
        background: bg
      }
    }
  },
  methods: {
    handleCommand (command) {
      if (command === 'logout') {
        this.handleLogout()
      }
    },
    handleLogout () {
      api.logoutCompass().then(data => {
        this.$router.push({name: 'Login'})
      }).catch(err => {
        console.error('logout error', err)
        window.location.reload()
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-user-info {
  display: flex;
  align-items: center;
  color: white;
  .time {
    margin-right: 20px;
    font-size: 14px;
  }
  .avatar {
    color: white;
    cursor: pointer;
    // background: #E6A23C;
    height: 36px;
    width: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid #aaa;
      user-select: none;
      cursor: pointer;
    }
  }
}
.logout {
  a {
    color: #FF4949 !important;
  }
}
</style>
