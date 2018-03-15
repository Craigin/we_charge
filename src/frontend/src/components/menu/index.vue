<template>
  <el-menu
    :class="['xc-menu', {vertical: mode === 'vertical'}]"
    :mode="mode"
    :default-active="defaultActive"
    menu-trigger="hover"
    @select="handleSelect">
    <xc-menu-item
      v-for="child of schema.children"
      v-if="checkRole(child.roles, child)"
      :key="child.index"
      :schema="child"
      :class="isActive(child.index)"
      :default-active="defaultActive">
    </xc-menu-item>
  </el-menu>
</template>

<script>
import * as commonUtils from 'common/utils'
import Item from './item'
import {getDescendent} from './utils'

export default {
  name: 'xc-menu',
  components: {
    'xc-menu-item': Item
  },
  props: {
    defaultActive: String,
    schema: {
      type: Object,
      required: true
    }
  },
  created () {
  },
  computed: {
    mode () {
      return this.schema.mode || 'vertical'
    }
  },
  methods: {
    isActive (index) {
      let {
        mode,
        defaultActive,
        $route: {
          query: {
            activeMenu
          }
        }
      } = this
      if (mode === 'vertical') {
        return index === defaultActive || index === decodeURIComponent(activeMenu) ? 'is-active' : ''
      } else {
        // console.log('index', index)
        // console.log('defaultActive', defaultActive)
        return defaultActive.indexOf(index) > -1 ? 'is-active' : ''
      }
    },
    handleSelect (index) {
      let child = this.getDescendent(index)
      if (child) {
        let {
          url,
          subMenu
        } = child
        if (url) {
          return // ignore
        }
        if (subMenu) {
          let subMenuChild = subMenu.find(c => c.default) || subMenu[0]
          if (subMenuChild) {
            this.$emit('subMenu', subMenuChild, child)
          }
        }
      }
    },
    getDescendent (index) {
      return getDescendent(this.schema.children, index)
    },
    checkRole (roles, schema) {
      let {
        $root: {
          supervisor
        }
      } = this
      return commonUtils.checkRole(roles, supervisor)
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.el-submenu {
  .el-menu {
    // background-color: #e4e8f1
  }
}

.xc-menu {
  &.el-menu--horizontal {
    background-color: $main_dark;
    border-bottom: none;
    .xc-menu-item {
      height: $header-height;
      line-height: $header-height;
      color: white;
      &:hover {
        background-color: #2b384a;
        // background-color: $main_dark !important;
        // color: $main_blue;
      }
      &.is-active {
        // background-color: #253040;
        border-bottom: 2px solid $main_blue !important;
        color: $main_blue;
      }
    }
  }
  &.vertical {
    .xc-menu-item {
      .el-submenu__title {
        color: $main_font;
      }
      a {
        color: $main_font;
      }
      &.el-menu-item.is-active {
        background-color: rgba(3, 169, 244, 0.07);
        a {
          color: $main_blue;
        }
      }
    }
  }
}
</style>
