<template>
  <el-submenu
    v-if="schema.children"
    class="xc-menu-item"
    :index="schema.index">
    <template slot="title">
      <i v-if="schema.icon" :class="schema.icon"></i>
      {{schema.text}}
    </template>
    <xc-menu-item
      v-for="child of schema.children"
      v-if="checkRole(child.roles, child)"
      :key="child.index"
      :schema="child"
      :depth="depth + 1"
      :class="isActive(child.index)"
      :default-active="defaultActive">
    </xc-menu-item>
  </el-submenu>
  <el-menu-item
    v-else
    class="xc-menu-item"
    :index="schema.index"
    :style="{padding: 0}">
    <template>
      <a
        v-if="isHttpUrl(to)"
        :href="to"
        :target="target"
        :style="routeStyle">
        <i v-if="schema.icon" :class="schema.icon"></i>
        {{schema.text}}
      </a>
      <router-link
        v-else
        :to="to"
        :target="target"
        :style="routeStyle">
        <i v-if="schema.icon" :class="schema.icon"></i>
        {{schema.text}}
      </router-link>
    </template>
    <div class="button-group" v-if="schema.buttons">
      <template
        v-for="button of schema.buttons">
        <a
          v-if="isHttpUrl(button.index)"
          :key="button.title"
          :class="['button', {active: button.index === defaultActive}]"
          :title="button.title"
          :href="button.index">
          <i v-if="button.icon" :class="button.icon"></i>
          <template v-if="button.index === defaultActive">
            &middot;
            &middot;
            &middot;
          </template>
          {{button.text}}
        </a>
        <router-link
          v-else
          :key="button.title"
          :class="['button', {active: button.index === defaultActive}]"
          :title="button.title"
          :to="button.index">
          <i v-if="button.icon" :class="button.icon"></i>
          <template v-if="button.index === defaultActive">
            &middot;
            &middot;
            &middot;
          </template>
          {{button.text}}
        </router-link>
      </template>
    </div>
  </el-menu-item>
</template>

<script>
import * as commonUtils from 'common/utils'

export default {
  name: 'xc-menu-item',
  props: {
    schema: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'vertical'
    },
    depth: {
      type: Number,
      default: 1
    },
    defaultActive: String
  },
  computed: {
    to () {
      let {
        url,
        index,
        subMenu
      } = this.schema
      if (url) {
        return url
      }
      if (subMenu) {
        let subMenuChild = subMenu.find(c => c.default) || subMenu[0]
        if (subMenuChild) {
          index = subMenuChild.index
        }
      }
      return url || index
    },
    target () {
      let {
        url
      } = this.schema
      return url ? '_blank' : ''
    },
    routeStyle () {
      let {
        depth,
        mode
      } = this
      if (mode === 'vertical') {
        return {
          paddingLeft: `${depth * 20}px`,
          paddingRight: `20px`
        }
      }
      return {
        paddingLeft: `20px`,
        paddingRight: `20px`
      }
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
    isHttpUrl: commonUtils.isHttpUrl,
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

.xc-menu-item {
  .el-menu-item, &.el-menu-item {
    display: flex;
    &> a {
      display: inline-block;
      flex: 1;
    }

    .button-group {
      text-align: right;
    }
    .button {
      display: none;
      min-width: 20px;
      padding-right: 10px;
      &.active {
        display: inline-block;
      }
    }
    // &.is-active {
    //   .button {
    //     display: inline-block;
    //   }
    //   > a {
    //     color: #20a0ff;
    //   }
    // }
  }
}
</style>
