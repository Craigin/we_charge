<template>
  <a
    v-if="canBeUrl && url && isUrlExternal"
    :class="columnClass"
    :href="url"
    target="_blank">
    <xc-data-table-column
    :schema="schema"
    :mergedSchema="mergedSchema"
    :value="value"
    :row="row"
    :canBeUrl="false">
    </xc-data-table-column>
  </a>
  <router-link
    v-else-if="canBeUrl && url"
    :class="columnClass"
    :to="url">
    <xc-data-table-column
      :schema="schema"
      :mergedSchema="mergedSchema"
      :value="value"
      :row="row"
      :canBeUrl="false">
    </xc-data-table-column>
  </router-link>
  <div
    v-else-if="schema.type === 'text'"
    :class="columnClass"
    :title="text">
    {{text}}
  </div>
  <div
    v-else-if="schema.type === 'image'"
    :class="columnClass"
    :title="text">
    <a :href="value" target="_blank">
      <img :src="value" :style="{maxWidth: schema.width || '120px', maxWidth: schema.height || '40px'}" />
    </a>
  </div>
  <div
    v-else-if="schema.type === 'time'"
    :class="columnClass"
    :title="text">
    {{text}}
  </div>
  <div
    v-else-if="schema.type === 'popover'"
    :class="columnClass">
    <el-popover
      ref="popover"
      placement="right"
      trigger="hover">
      <el-table :data="value">
        <el-table-column
          v-for="column of popoverOptions"
          :width="column.width"
          :label="column.title || column.name"
          :key="column.name"
          :property="column.name">
        </el-table-column>
      </el-table>
    </el-popover>
    <router-link :to="url" v-popover:popover>
      {{text}}
      <div>
        <i class="el-icon-more"></i>
      </div>
    </router-link>
  </div>
  <div
    v-else-if="schema.type === 'icon'"
    :class="columnClass">
    <router-link :to="iconUrl(item)" :key="item.name" v-for="item of schema.icons">
      <dx-icon
        class="action-icon"
        :style="item.style"
        :name="item.name">
      </dx-icon>
    </router-link>
  </div>
  <div
    v-else
    :class="columnClass"
    :title="text">
    <!-- <span style="color: red;">{{schema.type}}</span> -->
    {{text}}
  </div>
</template>

<script>
import Icon from 'components/icon'
import * as utils from 'common/utils'

export default {
  name: 'xc-data-table-column',
  components: {
    'dx-icon': Icon
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    value: {
    },
    row: {
      type: Object,
      required: true
    },
    mergedSchema: {
      type: Object
    },
    canBeUrl: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
    columnClass () {
      let {
        className
      } = this.schema
      return ['xc-data-table-column', className]
    },
    text () {
      let text = this.calcProp('text')
      if (text !== undefined) {
        return text
      }
      let {
        schema: {
          type,
          options,
          refer
        },
        value,
        row
      } = this
      if (type === 'select' && options && Array.isArray(options)) {
        let option = options.find(o => o.value === value)
        if (option) {
          return `${option.name}`
        }
      }
      if (refer) {
        let {
          name,
          labelColumn
        } = refer
        let referData = row[name]
        return referData ? referData[labelColumn] : ''
      }

      return value
    },
    url () {
      let {
        schema: {
          type
        },
        value
      } = this
      return this.calcProp('url', type === 'url' ? value : undefined)
    },
    isUrlExternal () {
      let {
        url
      } = this
      return utils.isHttpUrl(url)
    },
    popoverOptions () {
      return this.calcProp('options')
    }
  },
  methods: {
    iconUrl (icon) {
      let {
        to
      } = icon
      if (typeof to === 'function') {
        return icon.to(this.row)
      }
      return {}
    },
    calcProp (prop, def) {
      let {
        mergedSchema,
        schema,
        schema: {
          [prop]: propValue
        },
        value,
        row
      } = this
      switch (typeof propValue) {
        case 'function': {
          propValue = propValue(value, row, schema, mergedSchema)
          break
        }
        case 'string': {
          break
        }
        default: {
          if (propValue === undefined) {
            propValue = def
          }
        }
      }
      return propValue
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.el-popover {
  .el-table__body-wrapper {
    .el-table__row {
      .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.xc-data-table-column {
  &.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.ellipsis2 {
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.ellipsis3 {
    display: -webkit-box !important;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

</style>
