<template>
  <div class="xc-api-usage">
    <div class="use-pannel">
      <xc-criteria-panel
        :controls="controls"
        :extraControls="extraControls"
        :defaultPivot="defaultPivot">
      </xc-criteria-panel>
      <xc-line-chart class="xc-line-chart"
        v-loading.body="loading"
        :title="lineTitle"
        :lineData="lineData"
        :seriesData="lineData.series">
      </xc-line-chart>
      <el-table
        v-loading.body="loading"
        :data="data"
        @header-click="handleHeaderClick"
        style="width: 100%">
        <el-table-column
          v-for="column of columns"
          :class-name="`${column.pivotal ? 'pivotal' : ''} ${column.key === pivot ? 'pivot' : ''}`"
          :key="column.key"
          :prop="column.key"
          :label="(column.key === pivot ? '* ' : '') + column.title"
          :width="column.width">
          <template slot-scope="scope">
            <component
              v-if="column.component"
              :is="column.component"
              :schema="{columns}"
              :column="column"
              :scope="scope">
            </component>
            <span
              v-else
              :class="column.className">
              {{scope.row[column.field]}}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from 'api'
import {IP_QUERY_PROVIDER} from 'common'
import {HOSTS} from 'config'
import * as dateUtils from 'utils/dateFormat'
import XcCriteriaPanel from 'components/criteriaPanel'
import XcLineChart from 'components/lineChart'
import _ from 'lodash'
import Link from './link'
import Text from './text'

const NULL_FILTER_VALUE = '-'

export default {
  name: 'xc-api-usage',
  components: {
    XcCriteriaPanel,
    XcLineChart
  },
  props: {
    metric: {
      type: String,
      required: true
    },
    extraFields: {
      type: Array,
      default () {
        return []
      }
    },
    defaultPivot: {
      type: String,
      default: 'name'
    },
    ipAsKeyword: {
      type: Boolean
    }
  },
  data () {
    return {
      loading: false,
      data: [],
      lineData: {
        series: [
          {
            name: '访问次数',
            data: []
          }
        ],
        xAxis: [],
        yAxisIndex: 0
      },
      lineTitle: 'API访问次数',
      userName: new Map(),
      clientName: new Map()
    }
  },
  created () {
    this.updateData()
  },
  watch: {
    $route (data) {
      this.updateData()
    }
  },
  computed: {
    controls () {
      return [
        'clientUserSearch',
        'clientType',
        'dateRange'
      ]
    },
    maxKeys () {
      let {
        extraFields
      } = this
      return [
        ...extraFields.map(field => {
          let {
            title,
            name,
            width = 120
          } = field
          return {
            key: name,
            title,
            width,
            component: Text,
            text (value, row) {
              if (!value) {
                return
              }
              return value.value
            }
          }
        }),
        {
          key: 'name',
          title: 'API',
          width: 260,
          component: Text,
          text (value, row) {
            if (!value) {
              return
            }
            let {
              value: name
            } = value
            return name
          }
        },
        {
          key: 'ip',
          field: this.getIpKey(),
          title: 'IP',
          width: 120,
          component: Link,
          href (value, row) {
            if (!value) {
              return
            }
            let {
              value: ip
            } = value
            return IP_QUERY_PROVIDER + ip
          },
          text (value, row) {
            if (!value) {
              return
            }
            let {
              value: ip
            } = value
            return ip
          }
        },
        {
          key: 'day',
          title: '日期',
          component: Text,
          text (value, row) {
            if (!value) {
              return
            }
            let {
              value: day
            } = value
            return day
          }
        },
        {
          key: 'source',
          title: '来源',
          component: Text,
          text (value, row) {
            if (!value) {
              return
            }
            let {
              value: source
            } = value
            return source || '-'
          }
        },
        {
          key: 'client_id',
          title: '客户',
          component: Link,
          href (value, row) {
            if (!value) {
              return
            }
            let {
              value: clientId
            } = value
            if (clientId) {
              let where = encodeURIComponent(JSON.stringify({client_id: clientId}))
              return `${HOSTS.LANTERN}/#/database/v4_admin/tbl_client?where=${where}`
            }
          },
          text (value, row) {
            if (!value) {
              return
            }
            let {
              value: clientId,
              name
            } = value
            return clientId && name || '-'
          }
        },
        {
          key: 'user_id',
          title: '用户',
          component: Link,
          href (value, row) {
            if (!value) {
              return
            }
            let {
              value: userId
            } = value
            if (userId) {
              let where = encodeURIComponent(JSON.stringify({user_id: userId}))
              return `${HOSTS.LANTERN}/#/database/v4_admin/tbl_user_info?where=${where}`
            }
          },
          text (value, row) {
            if (!value) {
              return
            }
            let {
              value: userId,
              name
            } = value
            return userId && name || '-'
          }
        }
      ]
    },
    columns () {
      return [
        {
          field: 'total',
          title: '总数量',
          width: 100
        },
        ...this.maxKeys.map(maxKey => {
          let {
            title,
            tableTitle = `TOP ${title}`,
            key,
            tableKey = `max_${key}`
          } = maxKey
          return {
            ...maxKey,
            title: tableTitle,
            field: tableKey,
            pivotal: true
          }
        })
      ]
    },
    extraControls () {
      let {
        extraFields
      } = this
      return [
        ...extraFields.map(field => {
          let {
            title,
            name,
            suggestOptions
          } = field
          return {
            title,
            placeholder: `请输入${title}`,
            name,
            suggest: this.createSuggest(name, suggestOptions)
          }
        }),
        {
          title: 'IP',
          placeholder: '请输入IP',
          name: 'ips',
          suggest: this.createSuggest(this.getIpKey())
        },
        {
          title: '来源平台(source)',
          placeholder: '请输入来源平台名称(source)',
          name: 'source',
          suggest: this.createSuggest('source', {
            after (items) {
              return [
                {
                  value: NULL_FILTER_VALUE
                },
                ...items
              ]
            }
          })
        },
        {
          title: 'API(name)',
          placeholder: '请输入API名称(name)',
          name: 'name',
          suggest: this.createSuggest('name')
        },
        {
          title: '主聚合维度',
          placeholder: '请选择主聚合维度(pivot)',
          name: 'pivot',
          options: [
            ...extraFields.map(field => {
              let {
                title,
                name
              } = field
              return {
                label: title,
                value: name
              }
            }),
            {
              label: 'API',
              value: 'name'
            },
            {
              label: '日期',
              value: 'day'
            },
            {
              label: 'IP',
              value: 'ip'
            },
            {
              label: '来源',
              value: 'source'
            },
            {
              label: '客户',
              value: 'client_id'
            },
            {
              label: '用户',
              value: 'user_id'
            }
          ]
        }
      ]
    },
    dateRange () {
      let {
        start,
        end
      } = this.$route.query

      if (start && end) {
        start = dateUtils.format(new Date(start), 'yyyyMMdd')
        end = dateUtils.format(new Date(end), 'yyyyMMdd')
        return [parseInt(start), parseInt(end)]
      }
      return []
    },
    boolQuery () {
      let {
        maxKeys,
        dateRange: [start, end],
        $route: {
          params: {
            type
          },
          query
        }
      } = this

      let filter = []
      if (type) {
        filter.push({
          term: {
            type
          }
        })
      }
      let mustNot = []
      let boolQuery = {
        filter,
        must_not: mustNot
      }

      let keys = [
        ...maxKeys.map(maxKey => maxKey.key),
        'client_type'
      ]
      keys.forEach(key => {
        let value = query[key]
        if (value) {
          if (value === NULL_FILTER_VALUE) {
            mustNot.push({
              exists: {
                field: key
              }
            })
          } else {
            filter.push({
              term: {
                [key]: value
              }
            })
          }
        }
      })

      let dayRange = {}
      if (start) {
        dayRange.gte = start
      }
      if (end) {
        dayRange.lte = end
      }
      if (Object.keys(dayRange).length) {
        filter.push({
          range: {
            day: dayRange
          }
        })
      }

      return boolQuery
    },
    pivot () {
      let {
        defaultPivot,
        $route: {
          query: {
            pivot = defaultPivot
          }
        }
      } = this

      return pivot || 'name'
    },
    maxSubAggs () {
      let {
        $route: {
          query: {
            maxSubAggs
          }
        }
      } = this

      return maxSubAggs || 5
    }
  },
  methods: {
    getIpKey () {
      return this.ipAsKeyword ? 'ips.keyword' : 'ips'
    },
    updateData () {
      let {
        metric,
        boolQuery,
        pivot,
        maxKeys,
        maxSubAggs,
        $route: {
          query: {
            limit
          }
        }
      } = this
      let pivotKey = maxKeys.find(maxKey => maxKey.key === pivot)
      pivot = pivotKey && (pivotKey.field || pivotKey.key) || 'name'
      let maxAggs = {}
      maxKeys.forEach(maxKey => {
        let {
          key,
          field = key
        } = maxKey
        maxAggs[`max_${key}`] = {
          terms: {
            field,
            size: maxSubAggs,
            order: {
              total: 'desc'
            }
          },
          aggs: {
            total: {
              sum: {
                field: 'value'
              }
            }
          }
        }
      })
      let esQuery = {
        table: metric,
        query: {
          query: {
            bool: boolQuery
          },
          aggs: {
            rows: {
              terms: {
                field: pivot,
                size: limit || 12,
                order: {
                  total: 'desc'
                }
              },
              aggs: {
                total: {
                  sum: {
                    field: 'value'
                  }
                },
                ...maxAggs,
                hist: {
                  histogram: {
                    field: 'day',
                    interval: 1
                  },
                  aggs: {
                    total: {
                      sum: {
                        field: 'value'
                      }
                    }
                  }
                }
              }
            }
          },
          size: 0
        }
      }
      this.loading = true
      api.queryEagleEyeRaw(esQuery).then(data => {
        this.loading = false
        let {
          aggregations: {
            rows: {
              buckets: rows
            }
          }
        } = data
        rows = rows.map(api_ => {
          let {
            key: name,
            total: {
              value: total
            },
            hist: {
              buckets: hist
            }
          } = api_

          hist = hist.map(item => {
            let {
              key: day,
              total: {
                value: total
              }
            } = item
            let day1 = String(day)
            let day2 = `${day1.substring(0, 4)}-${day1.substring(4, 6)}-${day1.substring(6, 8)}`
            if (isNaN(Date.parse(day2))) {
              return
            }
            return {
              day,
              total
            }
          }).filter(item => item)
          let newItem = {
            total,
            hist,
            name
          }

          maxKeys.forEach(maxKey => {
            let {
              key,
              field = key
            } = maxKey
            newItem[`max_${key}`] = api_[`max_${key}`].buckets.map(item => {
              let {
                key: value,
                total: {
                  value: total
                }
              } = item
              return {
                field,
                value,
                total
              }
            })
          })

          return newItem
        })
        this.data = rows
        this.fixChartData(rows)
        this.patchClientUser(rows)
      }).catch(err => {
        this.loading = false
        console.log('queryEagleEyeRaw error', err)
        this.$notify({
          title: '失败',
          message: `查询失败`,
          type: 'error'
        })
      })
    },
    createSuggest (field, options = {}) {
      let {
        metric
      } = this
      let {
        count = 10,
        table = metric,
        after
      } = options
      return (text, callback) => {
        let query
        if (text) {
          query = {
            prefix: {
              [field]: text || ''
            }
          }
        }
        let esQuery = {
          table,
          query: {
            query: {
              ...query
            },
            aggs: {
              items: {
                terms: {
                  field: field,
                  size: count,
                  order: {
                    _count: 'desc'
                  }
                }
              }
            },
            size: 0
          }
        }
        api.queryEagleEyeRaw(esQuery).then(data => {
          let {
            aggregations: {
              items: {
                buckets: items
              }
            }
          } = data
          items = items.map(item => {
            let {
              key
            } = item
            return {
              value: key
            }
          })
          if (after) {
            items = after(items)
          }
          callback(items)
        }).catch(err => {
          callback([
            {
              value: '* 出错'
            }
          ])
          console.error('queryEagleEyeRaw error', err)
        })
      }
    },
    patchClientUser (data) {
      let clientIds = _.uniq(_.flatten(data.map(item => item.max_client_id.map(item => item.value))))
      let userIds = _.uniq(_.flatten(data.map(item => item.max_user_id.map(item => item.value))))
      this.getUserByID(userIds)
      this.getClientByID(clientIds)
    },
    fixChartData (rows) {
      let allDays = _.flatten(rows.map(row => row.hist.map(item => item.day)))
      let days = _.orderBy(_.uniq(allDays))
      this.lineData.xAxis = days
      this.lineData.series = rows.map(row => {
        let {
          name,
          hist
        } = row
        let data = days.map(day => {
          let item = hist.find(item => item.day === day)
          return {
            name: day,
            value: item ? item.total : 0
          }
        })
        return {
          name,
          data
        }
      })
    },
    getUserByID (id) {
      api.getUserByID({keyword: id.join(',')}).then(data => {
        data.forEach(row => {
          this.userName.set(row.user_id, row.email)
        })
        this.data = this.data.map(row => {
          return {
            ...row,
            max_user_id: row.max_user_id.map(item => {
              return {
                ...item,
                name: this.userName.get(item.value)
              }
            })
          }
        })
      }).catch(err => {
        console.error('getUserByID error', err)
      })
    },
    getClientByID (id) {
      api.getClientByID({keyword: id.join(',')}).then(data => {
        data.forEach(item => {
          this.clientName.set(item.client_id, item.name)
        })
        this.data = this.data.map(row => {
          return {
            ...row,
            max_client_id: row.max_client_id.map(item => {
              return {
                ...item,
                name: this.clientName.get(item.value)
              }
            })
          }
        })
      }).catch(err => {
        console.error('getClientByID error', err)
      })
    },
    handleHeaderClick (column, event) {
      let {
        maxKeys,
        $route: {
          query
        }
      } = this
      let maxKey = maxKeys.find(maxKey => maxKey.key === column.property)
      if (!maxKey) {
        return
      }

      let {
        key
      } = maxKey
      let newQuery = {
        ...query,
        pivot: key
      }
      this.$router.replace({query: newQuery})
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-api-usage {
  .li-panel {
    margin-bottom: 20px;
    // float: left;
    margin-right: 40px;
  }

  .xc-line-chart {
    width: 100%;
  }

  .input-extra-source {
    min-width: 200px;
  }
  .input-extra-name {
    min-width: 280px;
  }
  .el-table {
    margin-bottom: 30px;
    th {
      &.pivot {
      }
      &.pivotal {
        cursor: pointer;
        .cell {
          text-decoration: underline;
        }
      }
    }
    td.pivot {
    }
  }
  .xc-line-chart {
    padding-bottom: 30px;
  }

  a {
    color: $main_green;
  }
  .light-text {
    opacity: .6;
  }
}

</style>
