<template>
  <div class="xc-button-panel">
    <xc-button
      v-for="(button, index) of buttons"
      :key="index"
      :button="button"
      :size="size || 'small'"
      :model="model">
    </xc-button>
  </div>
</template>

<script>
import Button from './button'

export default {
  name: 'xc-button-panel',
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
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-button-panel {
}

</style>
