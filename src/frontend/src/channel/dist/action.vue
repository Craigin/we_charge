<template>
  <div class="xc-grid-table-action">
    <i v-if="row.active" class="el-icon-check"></i>
    <el-button
      v-else
      :disabled="row.disabled"
      type="primary"
      size="medium"
      @click="handleClick">
      激活
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'xc-grid-table-action',
  components: {
  },
  props: {
    scope: Object,
    column: Object,
    schema: Object,
    options: Object,
    row: Object
  },
  data () {
    return {
    }
  },
  computed: {
    show () {
      return true
    }
  },
  methods: {
    handleClick () {
      if (typeof this.column.click === 'function') {
        this.column.click(this.row)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-grid-table-action {
  text-align: center;
  .el-icon-check {
    color: $main_green;
  }
}
</style>
