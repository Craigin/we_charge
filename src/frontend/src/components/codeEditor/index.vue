<template>
  <div
    ref="editor"
    class="xc-code-editor editor user-input">
  </div>
</template>

<script>
import * as editorUtils from 'utils/editor'

export default {
  name: 'xc-code-editor',
  props: {
    data: {
      type: String
    },
    type: {
      type: String,
      required: true
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      cacheData: this.data
    }
  },
  watch: {
    data (data) {
      let {
        editor,
        cacheData
      } = this
      if (data !== cacheData && editor) {
        editor.setValue(data)
        this.cacheData = data
      }
    },
    cacheData (data) {
      this.$emit('input', data)
    }
  },
  created () {
    editorUtils.init().then(result => {
      let {
        type,
        data,
        editable,
        $refs: {
          editor: editorElement
        }
      } = this
      let {
        ace
      } = result
      let editor = ace.edit(editorElement)
      editor.getSession().setMode(`ace/mode/${type}`)
      // editor.setTheme(`ace/theme/${theme}`)
      editor.setValue(data)
      editor.setReadOnly(!editable)
      editor.setAutoScrollEditorIntoView(true)
      editor.on('change', () => {
        this.cacheData = editor.getValue()
      })
      this.editor = editor
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
    updateData () {
      let {
        editor,
        data
      } = this
      if (editor) {
        editor.set(data)
      }
    }
  }
}
</script>
