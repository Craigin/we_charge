<template>
  <div class="xc-preview-tab">
    <xc-json-editor
      ref="editor"
      class="editor user-input hoover-generated"
      :data="realReport"
      :editable="false">
    </xc-json-editor>
  </div>
</template>

<script>
import _ from 'lodash'
import JsonEditor from 'components/jsonEditor'

export default {
  name: 'xc-preview-tab',
  components: {
    'xc-json-editor': JsonEditor
  },
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    realReport () {
      return _.omit(this.report, [
        'create_user_id',
        'update_user_id',
        'create_user',
        'update_user',
        'create_time',
        'update_time'
      ])
    }
  },
  created () {
  },
  methods: {
    updateData () {
      let {
        $refs: {
          editor
        }
      } = this
      editor.updateData()
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-preview-tab {
  display: flex;
  flex-direction: row;
  height: 600px;

  .editor {
    flex: 1;
  }
}
</style>
