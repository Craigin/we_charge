<template>
  <div :class="['xc-diagnose-cell', className]" @click="handleCellClick">
    <el-popover
      ref="popover"
      width="400"
      trigger="click">
      <div :class="['xc-diagnose-cell-popover', className]">
        <div class="title">
          <span>{{text}}</span> {{value.options.url}}
        </div>
        <div class="status">{{value.status}} {{value.statusText}}</div>
        <ul class="headers">
          <li v-for="(val, key) of value.headers">
            <span class="header-key">{{key}}</span>
            :
            <span class="header-value">{{val}}</span>
          </li>
        </ul>
        <div class="data">{{value.data}}</div>
        <div>
        </div>
      </div>
    </el-popover>
    <div class="status-content" v-popover:popover>
      {{text}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'xc-diagnose-cell',
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
      if (value.options.status) {
        className = [className, 'should-fail']
      }
      return className
    }
  },
  methods: {
    handleCellClick (row, column, cell, event) {
      let {
        value,
        value: {
          success,
          status,
          statusText,
          headers,
          data,
          options
        }
      } = this
      console.log('cell value:', success, status, statusText, headers, data, options, value)
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-diagnose-cell {
  display: flex;
  align-items: center;
  align-content: center;
  text-align: center;
  height: 100%;
  user-select: none;
  cursor: default;
  .status-content {
    width: 100%;
  }
}

.xc-diagnose-cell-popover {
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
