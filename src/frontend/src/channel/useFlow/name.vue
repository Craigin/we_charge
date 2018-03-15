<template>
  <div class="xc-cell-username">
    <span class="light-text">{{scope.row[column.supply]}}</span>
    {{scope.row[column.field]}}
  </div>
</template>

<script>
export default {
  name: 'xc-cell-username',
  components: {
  },
  props: {
    schema: Object,
    options: Object,
    column: Object,
    scope: Object
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-cell-username {

}
</style>
