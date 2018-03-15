<template>
  <div class="xc-form-code">
    <xc-code-editor ng-if
      :type="schema.codeType"
      :data="row[schema.name]"
      v-model="row[schema.name]"
      :style="schema.editorStyle">
    </xc-code-editor>
  </div>
</template>

<script>
import CodeEditor from 'components/codeEditor'

export default {
  name: 'xc-form-code',
  components: {
    'xc-code-editor': CodeEditor
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    row: {
      type: Object,
      required: true
    }
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

<style lang="scss">
@import '~styles/_main';

.xc-form-code {
  width: 100%;
}

</style>
