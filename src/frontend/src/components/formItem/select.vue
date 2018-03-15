<template>
  <el-select
    v-if="schema.selectType === 'remoteSelect'"
    class="xc-form-select single"
    v-model="model"
    filterable
    remote
    placeholder="请输入关键词"
    @change="change"
    :remote-method="search"
    :loading="loading">
    <el-option
      v-if="schema.selectEmpty !== undefined"
      :label="`清空(${schema.selectEmpty})`"
      :value="schema.selectEmpty">
    </el-option>
    <el-option
      v-for="option in options"
      :key="option[valueKey]"
      :label="getLabel(option)"
      :value="option[valueKey]">
    </el-option>
  </el-select>
  <el-select
    v-else-if="schema.selectType === 'remoteMultipleSelect'"
    class="xc-form-select multiple"
    v-model="model"
    filterable
    remote
    multiple
    placeholder="请输入关键词"
    @change="change"
    :remote-method="search"
    :loading="loading">
    <el-option
      v-for="option in options"
      :key="option[valueKey]"
      :label="getLabel(option)"
      :value="option[valueKey]">
    </el-option>
  </el-select>
  <el-select
    v-else
    :class="['xc-form-select', {single: !schema.multiple, multiple: schema.multiple}]"
    :disabled="schema.disabled"
    :multiple="schema.multiple"
    v-model="model"
    @change="change"
    placeholder="请选择">
    <el-option
      v-for="option of selectOptions"
      :key="option[valueKey]"
      :label="getLabel(option)"
      :value="option[valueKey]">
    </el-option>
  </el-select>
</template>

<script>
import api from 'api'

export default {
  name: 'xc-form-select',
  components: {
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
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      loading: '',
      options: [],
      selectOptions: []
    }
  },
  created () {
    this.setSelectOptions()
  },
  watch: {
    visible (value) {
      if (value) {
        this.setSelectOptions()
      }
    }
  },
  computed: {
    isRemote () {
      let {
        schema: {
          selectType
        }
      } = this
      return ['remoteSelect', 'remoteMultipleSelect'].indexOf(selectType) >= 0
    },
    nameKey () {
      let {
        isRemote,
        schema: {
          selectName,
          refer: {
            labelColumn
          } = {}
        }
      } = this
      if (isRemote) {
        return selectName || labelColumn || 'title'
      }
      return 'name'
    },
    valueKey () {
      let {
        isRemote,
        schema: {
          selectValue,
          name
        }
      } = this
      if (isRemote) {
        if (name === 'report_id') {
          return selectValue || '_id'
        }
        return selectValue || 'id'
      }
      return 'value'
    },
    model: {
      get () {
        let {
          schema: {
            name,
            multiple,
            separator
          },
          row: {
            [name]: value
          }
        } = this
        if (multiple && separator && typeof value === 'string') {
          value = value ? value.split(separator) : []
        }
        return value
      },
      set (value) {
        let {
          schema: {
            name,
            multiple,
            separator
          },
          row
        } = this
        if (multiple && separator && Array.isArray(value)) {
          value = value.join(separator)
        }
        // console.log(name)
        // console.log(value)
        this.$set(row, name, value)
      }
    }
  },
  methods: {
    initSelected () {
      let {
        schema: {
          name,
          options
        },
        $route: {
          query,
          query: {
            [name]: queryValue
          }
        },
        selectOptions: [
          {
            value
          } = {}
        ]
      } = this
      if (typeof options !== 'function') {
        return
      }
      if (name && value && !queryValue) {
        query = {
          ...query,
          [name]: value
        }
        this.$router.replace({query})
      }
    },
    setSelectOptions () {
      let {
        schema: {
          options
        },
        row
      } = this
      if (typeof options === 'function') {
        Promise.resolve(options(row)).then(data => {
          this.selectOptions = data
        })
        return
      }
      this.selectOptions = options
    },
    search (text) {
      let {
        schema: {
          selectSearch,
          selectMax,
          refer: {
            type,
            database,
            table,
            attributes
          } = {}
        }
      } = this
      let searchPromise
      if (selectSearch) {
        searchPromise = selectSearch(text)
      } else {
        if (text === '') {
          this.options = []
          return
        }
        let query = {
          _search: text,
          _attributes: attributes && attributes.join(','),
          _page: `1,${selectMax || 6}`
        }
        searchPromise = api.dataTableSelect(query, {}, {type, database, table})
      }
      this.loading = true
      searchPromise.then(data => {
        this.loading = false
        this.options = data.rows
      }).catch(err => {
        this.options = []
        console.error('dataTableSelect error', err)
      })
    },
    change (newValue) {
      let {
        schema,
        schema: {
          change
        },
        row
      } = this
      if (change) {
        change(newValue, row, schema)
      }
    },
    getLabel (option) {
      let {
        nameKey
      } = this
      let {
        [nameKey]: name
      } = option
      if (nameKey === 'config') {
        name = name.title || name
      }
      return `${name}`
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-form-select {
  &.single {
    width: $form-item-width;
  }
  &.multiple {
    width: 100%;
  }
}

</style>
