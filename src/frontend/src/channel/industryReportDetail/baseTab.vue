<template>
  <div class="xc-base-tab">
    <xc-form-item-group :schema="schema.base" :model="report.config">
    </xc-form-item-group>
  </div>
</template>

<script>
import FormItemGroup from 'components/formItemGroup'

export default {
  name: 'xc-base-tab',
  components: {
    'xc-form-item-group': FormItemGroup
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    report: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      refreshIndustry: false,
      hooverReport: undefined,
      refreshingIndustry: false,
      generatingHscode: false
    }
  },
  watch: {
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

.xc-base-tab {
}
</style>
