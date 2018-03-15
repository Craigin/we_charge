<template>
  <div class="xc-dist">
    <el-select
      v-if="envs"
      class="env"
      v-model="env"
      placeholder="请选择环境">
      <el-option
        v-for="item in envs"
        :key="item.key"
        :label="`${item.name}(${item.key}, ${item.suffix})`"
        :value="item.key">
      </el-option>
    </el-select>
    <xc-grid-table
      :schema="filteredSchema"
      :data="candidates"
      :loading="loading">
    </xc-grid-table>
  </div>
</template>

<script>
import api from 'api'
import GridTable from 'components/gridTable'
import Action from './action'

export default {
  name: 'xc-dist',
  components: {
    'xc-grid-table': GridTable
  },
  props: {
    category: {
      type: String,
      required: true
    },
    columns: {
      type: Array
    },
    onCandidates: {
      type: Function
    }
  },
  data () {
    return {
      schema: {
        rowStyle (data) {
          let {
            row
          } = data
          return row.style
        },
        columns: [
          {
            title: '操作',
            width: 120,
            component: Action,
            click: this.activeDist
          },
          {
            name: 'name',
            title: '文件名',
            width: 220
          },
          {
            name: 'timestamp',
            title: '时间',
            width: 220
          },
          {
            name: 'description',
            title: '说明',
            width: 180
          },
          {
            name: 'content',
            title: '内容'
            // className: 'ellipsis'
          }
        ]
      },
      envs: undefined,
      env: '',
      candidates: [],
      loading: ''
    }
  },
  computed: {
    filteredSchema () {
      let {
        schema,
        schema: {
          columns
        },
        columns: filterColumns
      } = this
      if (filterColumns) {
        columns = columns.filter(c => !c.name || filterColumns.indexOf(c.name) >= 0)
      }
      return {
        ...schema,
        columns
      }
    }
  },
  watch: {
    category () {
      this.updateDistEnv()
    },
    env () {
      this.updateDistStatus()
    }
  },
  created () {
    this.updateDistEnv()
  },
  methods: {
    updateDistEnv () {
      let {
        category
      } = this

      this.loading = 'loading'
      api.getDistEnv({
        category
      }).then(data => {
        this.loading = ''
        this.envs = data
        this.env = data && data.length ? data[0].key : ''
        this.updateDistStatus()
      }).catch(err => {
        this.loading = 'error'
        console.error('error', err)
        this.$notify.error({
          title: '加载失败',
          message: err.message
        })
      })
    },
    updateDistStatus () {
      let {
        category,
        env,
        onCandidates
      } = this

      this.loading = 'loading'
      api.getDistStatus({
        category,
        env
      }).then(data => {
        this.loading = ''
        let {
          candidates
        } = data
        if (onCandidates) {
          candidates = onCandidates(candidates)
        }
        this.candidates = candidates
      }).catch(err => {
        this.loading = 'error'
        console.error('error', err)
        this.$notify.error({
          title: '加载失败',
          message: err.message
        })
      })
    },
    activeDist (row) {
      let {
        category,
        env
      } = this
      let {
        name,
        timestamp
      } = row
      this.$confirm(`激活发布 ${name}@${timestamp}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = 'loading'
        return api.activeDist({
          category,
          env,
          name
        }).then(data => {
          this.loading = ''
          this.updateDistStatus()
        }).catch(err => {
          this.loading = 'error'
          console.error('error', err)
          this.$notify.error({
            title: '激活失败',
            message: err.message
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

$editor-height: 720px;

.xc-dist {
  .env {
    min-width: 360px;
  }
  .el-table {
    .col-content {
      .xc-data-table-column {
        max-height: 42px;
        overflow: hidden;
      }
    }
  }
}
</style>
