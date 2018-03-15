<template>
  <div class="xc-header">
    <div class="content">
      <div class="logo">
        <a href="/"  class="logo-title">
          <img src="/static/favicon.png">
          水电管理系统
        </a>
        <span
          class="toggle-sidebar"
          :class="{active: showSidebar}"
          @click="handleToggle">
          <i class="el-icon-menu"></i>
        </span>
      </div>
      <xc-menu
        v-if="menu"
        :schema="menu"
        :default-active="menuDefaultActive">
      </xc-menu>
      <xc-user-info :user="$root.supervisor"></xc-user-info>
    </div>
  </div>
</template>

<script>
import Menu from 'components/menu'
import UserInfo from 'components/userInfo'

export default {
  name: 'xc-header',
  components: {
    'xc-menu': Menu,
    'xc-user-info': UserInfo
  },
  props: {
    menu: Object,
    menuDefaultActive: String,
    user: Object,
    showSidebar: Boolean
  },
  data () {
    return {
    }
  },
  methods: {
    handleToggle () {
      this.$emit('toggle-sidebar')
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 46px;
  background: $main_dark;
  z-index: 1000;
  .content {
    display: flex;
    justify-content: space-between;
    height: 100%;
    margin: 0 auto;
    padding: 0 20px;
    .logo {
      display: flex;
      align-items: center;
      padding-right: 26px;
      .toggle-sidebar {
        display: inline-block;
        width: 40px;
        height: 40px;
        margin-left: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #bfcbd9;
        border-left: 1px solid #22324a;
        border-right: 1px solid #22324a;
        transition: all .2s linear;
        &.active {
          background: #22324a;
        }
        &:hover {
          color: #fff;
        }
      }
      a {
        display: flex;
        flex-direction: row;
        align-items: center;
        align-content: center;
        user-select: none;
        text-decoration: none;
        color: #fff;
        font-size: 15px;
      }
      img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
      }
    }
    .xc-menu {
      flex: 1;
    }
  }
}
</style>
