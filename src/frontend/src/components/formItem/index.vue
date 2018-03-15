<template>
  <div class="form-item">
    <xc-form-image
      v-if="schema.type === 'image'"
      class="xc-form-item"
      :schema="schema"
      :value="value"
      :row="row">
    </xc-form-image>
    <el-input-number
      v-else-if="schema.type === 'integer'"
      class="xc-form-item"
      :disabled="schema.disabled"
      v-model="row[schema.name]"
      :min="schema.min && schema.min()"
      :max="schema.max && schema.max()">
    </el-input-number>
    <xc-form-select
      v-else-if="schema.type === 'select'"
      :schema="schema"
      :value="value"
      :row="row"
      :visible="visible">
    </xc-form-select>
    <xc-form-code
      v-else-if="schema.type === 'code'"
      class="xc-form-item"
      :schema="schema"
      :value="value"
      :row="row">
    </xc-form-code>
    <xc-form-jsoninput
      v-else-if="schema.type === 'json'"
      class="xc-form-item"
      :schema="schema"
      :value="value"
      :row="row">
    </xc-form-jsoninput>
    <xc-form-date
      v-else-if="schema.type === 'date'"
      class="xc-form-item"
      :schema="schema"
      v-model="row[schema.name]"
      :row="row">
    </xc-form-date>
    <el-input
      v-else-if="schema.type === 'textarea'"
      class="xc-form-item"
      :disabled="schema.disabled"
      v-model="modelValue"
      :placeholder="schema.placeholder"
      type="textarea"
      :rows="schema.rows || 4">
    </el-input>
    <el-input
      v-else
      class="xc-form-item"
      v-model="modelValue"
      :type="schema.inputType"
      :placeholder="schema.placeholder"
      :disabled="disabled || schema.disabled"
      auto-complete="off">
    </el-input>
    <div class="form-item-hint" v-if="hint">
      <span v-for="item of hint">
        <span v-if="typeof item === 'string'">
          {{item}}
        </span>
        <xc-button-group
          v-else-if="item.type === 'buttons'"
          :buttons="item.buttons"
          size="mini"
          :model="{value: row[schema.name], row, schema}">
        </xc-button-group>
        <a
          v-else-if="isUrlExternal(item.to)"
          :href="item.to"
          :target="item.target || '_blank'"
          :style="item.style">
          <i v-if="item.icon" :class="item.icon"></i>
          {{item.text}}
        </a>
        <router-link
          v-else
          :to="item.to"
          :target="item.target || '_blank'"
          :style="item.style">
          <i v-if="item.icon" :class="item.icon"></i>
          {{item.text}}
        </router-link>
      </span>
    </div>
  </div>
</template>

<script>
import * as utils from 'common/utils'
import Image from './image'
import Select from './select'
import Code from './code'
import JsonInput from './jsonInput'
import ButtonGroup from 'components/buttonGroup'
import Date_ from './date'

export default {
  name: 'xc-form-item',
  components: {
    'xc-form-image': Image,
    'xc-form-code': Code,
    'xc-form-jsoninput': JsonInput,
    'xc-form-select': Select,
    'xc-button-group': ButtonGroup,
    'xc-form-date': Date_
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
    options: {
      type: Object
    },
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
    }
  },
  created () {
    this.initDefault()
  },
  computed: {
    disabled () {
      let {
        primary,
        edit
      } = this.schema
      return primary && !edit
    },
    modelValue: {
      get () {
        let {
          schema: {
            name,
            toText
          },
          row
        } = this
        let value = row[name]
        if (toText) {
          value = toText(value)
        }
        return value
      },
      set (value) {
        let {
          schema: {
            name,
            fromText
          },
          row
        } = this
        if (fromText) {
          value = fromText(value)
        }
        this.$set(row, name, value)
      }
    },
    hint () {
      let {
        value,
        row,
        schema,
        schema: {
          hint
        }
      } = this
      if (typeof hint === 'function') {
        hint = hint(value, row, schema)
      }
      if (!hint) {
        return hint
      }
      if (!Array.isArray(hint)) {
        hint = [hint]
      }
      return hint
    }
  },
  watch: {
    row () {
      this.initDefault()
    }
  },
  methods: {
    initDefault () {
      let {
        schema: {
          name,
          'default': defaultValue
        },
        row,
        row: {
          [name]: value
        }
      } = this
      if (defaultValue !== undefined && value === undefined) {
        this.$set(row, name, defaultValue)
      }
    },
    isUrlExternal (url) {
      return utils.isHttpUrl(url)
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.form-item {
  display: flex;
  flex-wrap: wrap;

  .xc-form-item {
    margin-right: 8px;
    &.el-input-number {
      width: $form-item-width;
    }
  }
  .form-item-hint {
    font-size: 12px;
    color: $light_font;
    margin-left: 6px;
    .xc-button-group {
      display: inline-block;
    }
  }
}

</style>
