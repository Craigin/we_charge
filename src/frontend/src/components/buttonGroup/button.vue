<template>
  <el-button
    class="xc-button"
    :type="button.type"
    :icon="newIcon"
    :title="button.title || button.text"
    :size="size"
    :disabled="button.disabled"
    v-popover:popover
    @click="handleClick($event, button)">
    {{button.text}}
    <el-popover
      ref="popover"
      placement="top"
      width="160"
      :disabled="!button.popover"
      v-model="popoverVisible">
      <p
        v-if="button.popover">
        {{button.popover.title}}
      </p>
      <div
        v-if="button.popover"
        style="text-align: right; margin: 0">
        <el-button
          v-for="(button, index) of button.popover.buttons"
          :key="index"
          size="mini"
          :type="button.type"
          :title="button.title || button.text"
          @click="handlePopoverClick($event, button)">
          {{button.text}}
        </el-button>
      </div>
    </el-popover>
  </el-button>
</template>

<script>
import * as utils from 'common/utils'

export default {
  name: 'xc-button',
  components: {
  },
  props: {
    button: {
      type: Object,
      required: true
    },
    size: String,
    model: {
    }
  },
  data () {
    return {
      popoverVisible: false
    }
  },
  computed: {
    newIcon () {
      let icon = this.button.icon
      if (!/el-icon-/.test(icon)) {
        icon = 'el-icon-' + icon
      }
      return icon
    }
  },
  created () {
  },
  methods: {
    handleClick (e, button) {
      this.invoke(e, button.click)
    },
    handlePopoverClick (e, button) {
      this.popoverVisible = false
      this.invoke(e, button.click)
    },
    invoke (e, click) {
      let {
        model
      } = this
      if (typeof click === 'function') {
        click(e, model)
      } else if (typeof click === 'string') {
        if (utils.isHttpUrl(click)) {
          window.open(click)
        } else {
          this.$router.push({
            path: click
          })
        }
      } else {
        click && this.$router.push(click)
      }
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-button {
}

</style>
