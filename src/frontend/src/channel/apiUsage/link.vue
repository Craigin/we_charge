<template>
  <span class="xc-cell-link">
    <el-popover
      ref="popover"
      width="400"
      trigger="click"
      placement="left">
      <el-table :data="detail">
        <el-table-column width="320" property="href" label="#">
          <template slot-scope="scope">
            <a :href="scope.row.href" target="_blank">
              {{scope.row.text}}
            </a>
          </template>
        </el-table-column>
        <el-table-column width="80" property="total" label="数量">
        </el-table-column>
      </el-table>
    </el-popover>
    <a
      v-if="href"
      :href="href"
      target="_blank">
      {{text}}
    </a>
    <span
      v-else>
      {{text}}
    </span>
    <span class="total" v-popover:popover>
      {{total}}
    </span>
  </span>
</template>

<script>
export default {
  name: 'xc-cell-link',
  components: {
  },
  props: {
    scope: Object,
    column: Object,
    schema: Object,
    options: Object
  },
  data () {
    return {
      columns: [
      ]
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
    firstValue () {
      return this.value[0]
    },
    text () {
      return this.getText(this.firstValue)
    },
    href () {
      return this.getHref(this.firstValue)
    },
    total () {
      return this.firstValue && this.firstValue.total
    },
    detail () {
      let {
        value
      } = this
      if (!value) {
        return []
      }
      return value.map(row => {
        let {
          value,
          total
        } = row
        return {
          value,
          text: this.getText(row),
          href: this.getHref(row),
          total
        }
      })
    }
  },
  methods: {
    getText (value) {
      let {
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
    getHref (value) {
      let {
        scope: {
          row
        },
        column: {
          href
        }
      } = this
      if (href) {
        return href(value, row)
      }
      return '#'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~styles/_main';

.xc-cell-link {
  .total {
    color: #20A0FF;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
