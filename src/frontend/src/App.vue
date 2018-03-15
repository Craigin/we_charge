<template>
  <div id="app">
    <template v-if="showMenu">
      <xc-header
        :menu="navMenu"
        :showSidebar="showSidebar"
        :menu-default-active="activeIndex"
        @toggle-sidebar="handleToggleSidebar">
      </xc-header>
      <xc-menu
        class="sidebar"
        :class="{invisible: !showSidebar}"
        :schema="sidebarMenu"
        :default-active="sidebarIndex">
      </xc-menu>
    </template>
    <router-view
      class="main-content"
      :class="{fullpage: !showSidebar}">
    </router-view>
    <xc-credit-edit>
    </xc-credit-edit>
  </div>
</template>

<script>
import api from 'api'
import Header from 'components/header'
import Menu from 'components/menu'
import {getDescendent} from 'components/menu/utils'
import EditCredit from 'components/editCredit'
import menu from 'utils/menu'

export default {
  name: 'app',
  components: {
    'xc-header': Header,
    'xc-menu': Menu,
    'xc-credit-edit': EditCredit
  },
  data () {
    let showSidebar = window.localStorage.getItem('showSidebar')
    return {
      navMenu: {
        theme: '#545c64',
        mode: 'horizontal',
        children: menu
      },
      showSidebar: showSidebar !== 'false',
      showMenu: false
    }
  },
  computed: {
    activeIndex () {
      let {path} = this.$route
      return path
    },
    navIndex () {
      let {path} = this.$route
      let index = path.indexOf('/', 1)
      if (index >= 0) {
        path = path.substr(0, index)
      }
      return path !== '/' ? path : undefined
    },
    sidebarIndex () {
      let {path} = this.$route
      return path !== '/' ? path : undefined
    },
    sidebarMenu () {
      let {
        navIndex,
        navMenu
      } = this
      let child = getDescendent(navMenu.children, navIndex)
      return {
        children: (child && child.subMenu) || []
      }
    }
  },
  created () {
    api.getWhoami().then(data => {
      let {
        supervisor,
        ip
      } = data
      console.log('xxxtemp', data)
      this.$root.supervisor = supervisor
      this.$root.ip = ip
    }).catch(err => {
      console.error('getWhoami error', err)
    })

    // handle login page header
    setTimeout(() => {
      this.showMenu = true
    }, 100)
  },
  methods: {
    checkReviseLog () {
      api.dataTableSelect({
        type: 'company',
        _order: 'id-',
        _page: '1,1'
      }, {}, {
        type: 'mysql',
        database: 'discovery_admin',
        table: 'tbl_revise_log'
      }).then(data => {
        let {
          rows: [log]
        } = data
        if (!log) {
          return
        }
        let {
          errors,
          notify
        } = log
        errors = parseInt(errors)
        notify = parseInt(notify)
        if (!errors || !notify) {
          return
        }
        this.$notify.error({
          title: '公司数据订正错误',
          message: '上次数据订正存在错误',
          onClick: () => {
            this.$router.push({
              name: 'ReviseLog',
              query: {
                type: 'company',
                _order: 'id-'
              }
            })
          }
        })
      }).catch(err => {
        console.error('dataTableSelect error', err)
      })
    },
    handleToggleSidebar () {
      this.showSidebar = !this.showSidebar
      window.localStorage.setItem('showSidebar', this.showSidebar)
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

#app {
  height: 100%;

  .sidebar {
    top: $header-height;
    left: 0;
    height: 100%;
    width: 180px;
    position: fixed;
    // background-color: $main_light;
    transition: all .2s linear;
    overflow-y: auto;
    padding-bottom: $header-height;
    box-sizing: border-box;
    &.invisible {
      left: -240px;
    }
  }

  .main-content {
    $padding-top: 12px;
    $padding-horizontal: 20px;
    padding-bottom: 30px;
    position: absolute;
    top: $header-height + $padding-top;
    left: 0;
    margin-left: $menu_left + $padding-horizontal;
    width: calc(100% - #{$menu_left + $padding-horizontal * 2});
    min-height: calc(100% - #{$header-height + $padding-top});
    transition: margin-left .2s linear;
    &.fullpage {
      margin-left: $padding-horizontal;
      width: calc(100% - #{$padding-horizontal * 2});
    }
  }
}
</style>
