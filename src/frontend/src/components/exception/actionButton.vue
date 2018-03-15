<template>
  <div class="xc-action-button" @click="handleClick">
    {{text}}
  </div>
</template>

<script>

export default {
  name: 'xc-action-button',
  props: {
    text: {
      type: String,
      default () {
        return '返回'
      }
    },
    handleClick: {
      type: Function,
      default () {
        window.history.go(-1)
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-action-button {
  display: inline-block;
  // margin-top: 100px;
  border-radius: 21px;
  padding: 13px 25px;
  background: #12B56A;
  color: white;
  font-size: $font_normal;
  cursor: pointer;
}

</style>
