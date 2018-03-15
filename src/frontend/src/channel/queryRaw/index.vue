<template>
  <div class="xc-es-query">
    <div>
      <el-button
        type="primary"
        @click="handleExecute">
        执行
      </el-button>
    </div>
    <div class="editor-container">
      <xc-json-editor class="inputEditor user-input"
        :data="defaultQuery"
        v-model="inputQuery">
      </xc-json-editor>
      <xc-json-editor class="resultEditor user-input"
        :data="resultQuery"
        :editable="false">
      </xc-json-editor>
    </div>
  </div>
</template>

<script>
import api from 'api'
import JsonEditor from 'components/jsonEditor'

const DEFAULT_QUERY = {
  table: 'dx.recommendation.get',
  query: {
    query: {
      bool: {
        filter: [
          {
            term: {
              type: 'refresh'
            }
          }
        ]
      }
    },
    aggs: {
      multi_field_cardinality: {
        cardinality: {
          script: {
            lang: 'painless',
            inline: `doc['user_id'].value + '#' + doc['company'].value`
          }
        }
      }
    },
    size: 10
  }
}

export default {
  name: 'xc-es-query',
  components: {
    'xc-json-editor': JsonEditor
  },
  props: {
  },
  data () {
    return {
      inputQuery: DEFAULT_QUERY,
      defaultQuery: DEFAULT_QUERY,
      resultQuery: {}
    }
  },
  computed: {
  },
  created () {
    this.execute()
  },
  methods: {
    handleExecute () {
      this.execute()
    },
    execute () {
      let {inputQuery} = this
      api.queryEagleEyeRaw(inputQuery).then(data => {
        this.resultQuery = data
      }).catch(err => {
        console.log('queryEagleEyeRaw error', err)
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

.xc-es-query {
  position: relative;
  .editor-container {
    display: flex;
    flex-direction: row;
  }

  .inputEditor {
    flex: 2;
    height: $editor-height;
    border: 1px solid $divider;
    position: relative;
  }
  .resultEditor {
    border: 1px solid $divider;
    position: relative;
    flex: 3;
    height: $editor-height;
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
