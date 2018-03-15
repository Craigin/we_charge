<template>
  <xc-button
    v-if="buttons.length === 1"
    class="xc-button-group"
    :button="buttons[0]"
    :size="size"
    :model="model">
  </xc-button>
  <el-button-group
    v-else
    class="xc-button-group">
    <xc-button
      v-for="(button, index) of buttons"
      :key="index"
      :button="button"
      :size="size"
      :model="model">
    </xc-button>
  </el-button-group>
</template>

<script>
import Button from './button'

export default {
  name: 'xc-button-group',
  components: {
    'xc-button': Button
  },
  props: {
    buttons: {
      type: Array,
      required: true
    },
    size: String,
    model: {
    }
  },
  computed: {
    button () {
      return this.buttons[0]
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-button-group {
}

</style>
