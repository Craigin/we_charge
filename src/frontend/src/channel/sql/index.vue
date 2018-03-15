<template>
  <div class="xc-sql">
    <div>
      <el-button
        type="primary"
        @click="handleExecute">
        执行
      </el-button>
      <span :class="['hint', {active: hintActive}]">
        SQL中不可以有分号';'
      </span>
    </div>
    <div class="editor-container">
      <div ref="editor" class="editor user-input">
      </div>
      <xc-json-editor class="resultEditor user-input"
        :data="result"
        :editable="false">
      </xc-json-editor>
    </div>
  </div>
</template>

<script>
import api from 'api'
import * as editorUtils from 'utils/editor'
import JsonEditor from 'components/jsonEditor'

export default {
  name: 'xc-sql',
  components: {
    'xc-json-editor': JsonEditor
  },
  props: {
  },
  data () {
    return {
      sql: 'select count(*) from dx.start\nwhere client_type = 1',
      result: {}
    }
  },
  computed: {
    hintActive () {
      return this.sql.indexOf(';') >= 0
    }
  },
  created () {
    editorUtils.init().then(result => {
      let {
        ace
      } = result
      let editor = ace.edit(this.$refs.editor)
      editor.getSession().setMode(`ace/mode/sql`)
      // editor.setTheme(`ace/theme/${theme}`)
      editor.setValue(this.sql)
      editor.on('change', () => {
        this.sql = editor.getValue()
      })
      this.editor = editor

      this.execute()
    })
  },
  destroyed () {
    let {
      editor
    } = this
    if (editor) {
      editor.destroy()
      editor.container.remove()
    }
  },
  methods: {
    handleExecute () {
      this.execute()
    },
    execute () {
      let {sql} = this
      api.getEagleEyeFlowQuery({sql}).then(data => {
        this.result = data
      }).catch(err => {
        console.log('getEagleEyeFlowQuery error', err)
        this.$notify({
          title: '失败',
          message: `查询失败`,
          type: 'error'
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

$editor-height: 720px;

.xc-sql {
  .editor-container {
    display: flex;
    flex-direction: row;
  }

  .editor {
    flex: 1;
    height: $editor-height;
    border: 1px solid $main_green;
  }
  .resultEditor {
    position: relative;
    height: $editor-height;
    flex: 2;
    .jsoneditor {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
  .user-input {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .hint {
    padding-left: 16px;
    font-size: 12px;
    color: $light_font;
    &.active {
      color: $error;
      font-weight: bold;
    }
  }
}
</style>
