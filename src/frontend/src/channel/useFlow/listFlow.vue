<template>
  <ul class="xc-list-report">
    <li class="li-panel" v-for="(section, index) of schema.sections">
      <xc-list-report-section
        v-if="section.key === flowKey || !flowKey"
        :schema="section"
        :param="param">
      </xc-list-report-section>
    </li>
  </ul>
</template>

<script>
import Section from './section'

export default {
  name: 'xc-list-report',
  components: {
    'xc-list-report-section': Section
  },
  props: {
    schema: Object,
    param: Object,
    flowKey: String
  },
  data () {
    return {
      default: {}
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-list-report {
  .li-panel {
    margin-bottom: 20px;
    // float: left;
    margin-right: 40px;
  }
}
</style>
