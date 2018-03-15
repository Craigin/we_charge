<template>
  <div class="editor-m-container" :style="{height: `${height}px`}">
    <div ref="editor" class="xc-json-editor editor">
    </div>
    <div class="border" @mousedown="startDrag"></div>
  </div>
</template>

<script>
import * as editorUtils from 'utils/editor'

export default {
  name: 'xc-json-editor',
  props: {
    data: {
      type: [
        Object,
        Array
      ]
    },
    editable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      inputQuery: {},
      dragFlag: false,
      startY: 0,
      deltaY: 0,
      height: undefined
    }
  },
  watch: {
    data (data) {
      let {
        editor,
        inputQuery
      } = this
      if (data !== inputQuery && editor) {
        editor.set(data)
      }
    },
    inputQuery (data) {
      this.$emit('input', data)
    }
  },
  created () {
    editorUtils.init().then(result => {
      let {
        ace,
        JSONEditor
      } = result
      let _this = this
      let editor = new JSONEditor(this.$refs.editor, {
        ace,
        modes: ['code', 'tree'],
        onEditable () {
          return _this.editable
        },
        onChange () {
          let text = editor.getText()
          _this.inputQuery = text ? JSON.parse(text) : ''
        }
      })
      editor.set(this.data || '')
      this.editor = editor
    })
  },
  mounted () {
    console.log()
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
    },
    startDrag (e) {
      this.startY = e.clientY
      this.deltaY = this.height || this.$el.querySelector('.editor').clientHeight
      window.addEventListener('mousemove', this.move)
      window.addEventListener('mouseup', this.endDrag)
    },
    endDrag () {
      window.removeEventListener('mousemove', this.move)
      window.removeEventListener('mouseup', this.endDrag)
    },
    move (e) {
      this.height = (this.deltaY + e.clientY - this.startY) > 190 ? this.deltaY + e.clientY - this.startY : 190
      this.editor.resize()
    }
  }
}
</script>
<style lang="scss">
.editor-m-container {
  // height: 400px;
  position: relative;
  .editor {
    height: 100%;
  }
  .border {
    cursor: s-resize;
    height: 5px;
    font-size: 0;
    background: #EEE url('http://g.xiaoman.cc:8080/static/557f8ffc/images/textarea-handle.gif') no-repeat 50% 1px;
    // border: 20px solid transparent;
    border: 1px solid #BABDB6;
    border-top: none;
    // position: absolute;
    // bottom: -20px;
    // width: 100%;
    // border-top: 40px solid transparent;
  }
}
</style>
