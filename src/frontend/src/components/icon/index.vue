<template>
  <svg class="icon" aria-hidden="true" @click="click">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>

<script>
  export default {
    name: 'dx-icon',
    props: {
      name: {
        type: String,
        required: true
      }
    },
    methods: {
      click () {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icon {
     width: 1em;
     height: 1em;
     vertical-align: -0.15em;
     fill: currentColor;
     overflow: hidden;
  }
</style>
