<template>
  <div class="xc-criteria-panel">
    <div class="select-item" v-if="showControl('clientUserSearch')">
      <div class="title">
        客户/账户:
      </div>
      <el-select
        v-model="clientOrUser"
        filterable
        remote
        placeholder="请输入关键词"
        :remote-method="searchClientsAndUsers"
        :loading="loading">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="select-item" v-if="showControl('clientType')">
      <div class="title">
        客户类型:
      </div>
      <el-select
        v-model="clientType"
        placeholder="请选择客户类型">
        <el-option label="不限" value=""></el-option>
        <el-option label="外部:1" value="1"></el-option>
        <el-option label="内部:2" value="2"></el-option>
      </el-select>
    </div>
    <div class="select-item" v-if="showControl('dateRange')">
      <div class="title">
        时间范围:
      </div>
      <xc-date-picker
        :default="dateRange"
        @change="datePickerChange">
      </xc-date-picker>
    </div>
    <div v-for="control in extraControls" class="select-item">
      <div class="title">
        {{control.title}}:
      </div>
      <el-autocomplete
        v-if="control.suggest"
        :class="['inline-input', `input-extra-${control.name}`, control.class]"
        :ref="control.name"
        :value="getExtraControlValue(control.name)"
        :fetch-suggestions="getSuggestion(control.name, control.suggest)"
        :placeholder="control.placeholder || '请输入'"
        @select="handleExtraControlAutoCompleteSelect(control.name, $event)"
        :select-when-unmatched="true">
      </el-autocomplete>
      <el-select
        v-if="control.options"
        :value="getExtraControlValue(control.name)"
        v-model="extraValues[control.name]"
        @change="handleExtraControlSelect(control.name, $event)"
        :placeholder="control.placeholder">
        <el-option
          v-for="item in control.options"
          :key="item.id"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import api from 'api'
import * as dateUtils from 'utils/dateFormat'
import XcDatePicker from 'components/datePicker'

export default{
  name: 'xc-criteria-panel',
  components: {
    XcDatePicker
  },
  props: {
    target: {
      type: String,
      default: 'query' // query|event, TODO implement event mode
    },
    controls: {
      type: [Array, Object],
      default () {
        return ['clientUserSearch', 'clientType', 'dateRange']
      }
    },
    extraControls: {
      type: Array,
      default () {
        return []
      }
    },
    defaultPivot: {
      type: String
    }
  },
  data () {
    return {
      loading: false,
      clientOrUser: undefined,
      options: [],
      extraValues: {}
    }
  },
  created () {
    let {
      $route: {
        query,
        query: {
          start
        }
      }
    } = this
    let newQuery = {
      ...query
    }

    if (!start) {
      let [start, end] = dateUtils.getCurrentWeek()
      newQuery = {
        ...newQuery,
        start,
        end
      }
    }

    if (this.extraControls.length) {
      for (let item of this.extraControls) {
        if (item.selected) {
          if (!this.$route.query[item.name]) {
            newQuery = {
              ...newQuery,
              [item.name]: item.selected
            }
          }
        }
      }
    }

    this.$router.replace({query: newQuery})

    let {
      query: {
        type,
        [type]: id
      }
    } = this.$route
    if (type) {
      let key = type === 'client_id' ? 'clients' : 'users'
      this.getClientAndUserByID(id, key)
    }

    this.updateExtraValues()
  },
  computed: {
    clientType: {
      get () {
        let {
          query: {
            client_type: clientType
          }
        } = this.$route
        return clientType || ''
      },
      set (clientType) {
        let {
          query
        } = this.$route
        let newQuery = {
          ...query,
          client_type: clientType
        }
        if (!clientType) {
          delete newQuery.client_type
        }
        this.$router.replace({query: newQuery})
      }
    },
    dateRange () {
      let {
        query: {
          start,
          end
        }
      } = this.$route

      if (start && end) {
        start = new Date(start)
        end = new Date(end)
        return [start, end]
      }
      return []
    }
  },
  watch: {
    clientOrUser (newValue) {
      let {
        query
      } = this.$route

      let {
        value: row
      } = this.options.find(item => item.id === newValue) || {}

      let newQuery
      if (newValue) {
        newQuery = {
          ...query,
          type: row.type || '',
          client_id: row.client_id || '',
          user_id: row.user_id || '',
          client_type: '' // 这个时候强制重置client_type
        }
      } else {
        newQuery = {
          ...query
        }
        delete newQuery.type
        delete newQuery.client_id
        delete newQuery.user_id
      }

      this.$router.replace({query: newQuery})
    },
    $route () {
      this.updateExtraValues()
    }
  },
  methods: {
    showControl (name) {
      let {
        controls
      } = this
      if (Array.isArray(controls)) {
        return controls.indexOf(name) >= 0
      }
      return controls[name]
    },
    searchClientsAndUsers (text) {
      if (text === '') {
        this.options = []
        this.clientOrUser = undefined
        return
      }
      this.loading = true
      api.getClientAndUser({keyword: text}).then(data => {
        this.loading = false
        this.options = this.fixUsers(data.users).concat(this.fixClients(data.clients))
      }).catch(err => {
        console.error('getClientAndUser error', err)
        this.options = []
      })
    },
    fixUsers (list) {
      return list.map(user => {
        return {
          label: `账户: ${user.email}#${user.user_id}`,
          value: {
            type: 'user_id',
            client_id: user.client_id,
            user_id: user.user_id,
            data: user
          },
          id: user.user_id
        }
      })
    },
    fixClients (list) {
      return list.map(client => {
        return {
          label: `客户: ${client.name || client.email}#${client.client_id}`,
          value: {
            type: 'client_id',
            client_id: client.client_id,
            user_id: '',
            data: client
          },
          id: client.client_id
        }
      })
    },
    getClientAndUserByID (id, key) {
      api.getClientAndUserByID({keyword: id}).then(data => {
        data.users = this.fixUsers(data.users)
        data.clients = this.fixClients(data.clients)
        let item = data[key][0]
        let clientOrUser = item && item.id
        this.clientOrUser = clientOrUser
        if (clientOrUser) {
          this.options = [item]
        }
      }).catch(err => {
        console.error('getClientAndUserByID error', err)
      })
    },
    datePickerChange (val, val2) {
      let {
        query
      } = this.$route
      let [start, end] = val2
      let newQuery = {
        ...query,
        start,
        end
      }
      this.$router.replace({query: newQuery})
    },
    getSuggestion (name, suggest) {
      return (text, callback) => {
        let {
          $route: {
            query: {
              [name]: queryValue
            }
          }
        } = this

        let fill = result => {
          if (text) {
            if (!result.length) {
              result.push({
                value: text
              })
            }
          } else if (queryValue) {
            result.unshift({
              value: '* 回车清空'
            })
          }
          return result
        }

        if (suggest) {
          suggest(text, result => {
            callback(fill(result))
          })
          return
        }

        callback(fill([]))
      }
    },
    handleExtraControlAutoCompleteSelect (name, select) {
      let {
        value
      } = select
      let {
        $route: {
          query
        },
        $refs: {
          [name]: [
            {
              $refs: {
                input: {
                  currentValue: inputValue
                }
              }
            }
          ]
        }
      } = this
      let {
        event
      } = window

      if (event.type === 'keydown' && !inputValue) {
        value = ''
      }

      let newQuery = {
        ...query,
        [name]: value
      }
      this.$router.replace({query: newQuery})
    },
    handleExtraControlSelect (name, value) {
      let {
        $route: {
          query
        }
      } = this

      let newQuery = {
        ...query,
        [name]: value
      }
      this.$router.replace({query: newQuery})
    },
    getExtraControlValue (name) {
      let {
        query: {
          [name]: value
        }
      } = this.$route
      return value
    },
    updateExtraValues () {
      let extraValues = {}
      this.extraControls.forEach(control => {
        extraValues[control.name] = this.getExtraControlValue(control.name)
      })
      this.extraValues = extraValues
    }
  }
}
</script>

<style lang="scss">
  /*
.el-select-dropdown__item {
  padding-left: 6px;
  display: flex;
  align-items: center;
}
*/

.xc-criteria-panel {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .select-item {
    display: flex;
    align-items: center;
    margin: 0 20px 20px 0;

    .title {
      margin-right: 12px;
    }
    &.item-title {
      color: #20a0ff;
    }
  }
}
</style>
