<template>
  <div :class="['xc-diagnose-field-cell', className]" @click="handleCellClick">
    <el-popover
      ref="popover"
      width="400"
      trigger="click">
      <div :class="['xc-diagnose-field-cell-popover', className]">
        <ul class="cell-ul">
          <li class="edit">
            <router-link :to=cellUrl>编辑</router-link>
          </li>
          <li>
            <span>id: </span><span>{{cell.id}}</span>
          </li>
          <li>
            <span>类型: </span><span>{{cell.type}}</span>
          </li>
          <li>
            <span>维度: </span><span>{{cell.aspect}}</span>
          </li>
          <li>
            <span>数据源: </span><span>{{cell.source}}</span>
          </li>
          <li>
            <span>语句: </span><span>{{cell.sentence}}</span>
          </li>
          <li>
            <span>执行语句: </span><span class="ellipsis3">{{cell.executeSentence}}</span>
          </li>
          <li>
            <span>提取方式: </span><span>{{cell.extract}}</span>
          </li>
          <li>
            <span>结果: </span><span>{{cell.value}}</span>
          </li>
        </ul>
      </div>
    </el-popover>
    <div class="status-content">
      <span v-popover:popover>{{text}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'xc-diagnose-field-cell',
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
    cellUrl () {
      let {
        id
      } = this.cell
      return {
        name: 'reportFieldCell',
        query: {
          id
        }
      }
    },
    cell () {
      let {
        field
      } = this.column
      let _cell = this.scope.row.cells.find(item => item.key === field).cell || {}
      _cell.value = this.scope.row[field]
      return _cell
    },
    value () {
      let {
        scope: {
          row
        },
        column: {
          field
        }
      } = this
      return row[field]
    },
    text () {
      let {
        value,
        scope: {
          row
        },
        column: {
          text
        }
      } = this
      let text1
      if (typeof text === 'string') {
        text1 = row[text]
      } else if (typeof text === 'function') {
        text1 = text(value, row)
      } else {
        text1 = value
      }
      return text1 || value
    },
    className () {
      let {
        value,
        scope: {
          row
        },
        column: {
          className
        }
      } = this
      if (typeof className === 'function') {
        className = className(value, row)
      }
      return className
    }
  },
  methods: {
    handleCellClick (row, column, cell, event) {
      // let {
      //   value,
      //   value: {
      //     success,
      //     status,
      //     statusText,
      //     headers,
      //     data,
      //     options
      //   }
      // } = this
      // console.log('cell value:', success, status, statusText, headers, data, options, value)
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.xc-diagnose-field-cell {
  display: flex;
  align-items: center;
  align-content: center;
  // text-align: center;
  height: 100%;
  user-select: none;
  cursor: default;
  &.success {
    color: #13CE66;
  }
  &.failure {
    color: #FF4949;
  }
  &.should-fail {
    background: rgba(255, 73, 73, 0.15);
  }
  .status-content {
    width: 100%;
    span {
      display: inline-block;
    }
  }
}

.xc-diagnose-field-cell-popover {
  .cell-ul {
    li {
      margin-bottom: 4px;
      &.edit {
        text-align: right;
      }
    }
    .ellipsis3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .title {
    font-size: 16px;
  }
  &.success {
    .title {
      span {
        color: #13CE66;
      }
    }
  }
  &.failure {
    .title {
      span {
        color: #FF4949;
      }
    }
  }

  .status {
    color: $sub_font;
  }

  .headers {
    margin-top: 5px;
    margin-bottom: 5px;

    .header-key {
      color: $main_font;
      font-weight: bold;
    }
    .header-value {
      color: $main_font;
    }
  }

  .data {
    color: $sub_font;
    max-height: 300px;
    overflow-x: auto;
    overflow-y: auto;
  }
}
</style>
