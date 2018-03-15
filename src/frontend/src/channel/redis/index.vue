<template>
  <div class="xc-redis">
    <div class="head">
      <el-input
        class="search"
        :placeholder="searchPlaceholder"
        v-model="search"
        @keyup.enter.native="startSearch">
        <el-button slot="append" icon="el-icon-search" @click="startSearch" >
        </el-button>
        <el-button v-if="deletablePattern" class="delete-icon"  slot="append" icon="el-icon-delete" @click="deletePattern">
        </el-button>
      </el-input>
      <div class="select">
        <span>数量:</span>
        <el-select
          v-model="count"
          placeholder="请选择数量">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="pager">
      <span class="cursor">{{cursor}}/{{data.dbsize}}</span>
      <el-button size="mini" @click="nextPage">
        下一页
        <i class="el-icon-arrow-right el-icon--right">
        </i>
      </el-button>
    </div>
    <xc-grid-table
      :data="data.list"
      :schema="schema"
      :loading="loading"
      @delete="handleDelete">
    </xc-grid-table>
  </div>
</template>

<script>
import api from 'api'
import GridTable from 'components/gridTable'
import * as commonUtils from 'common/utils'

export default {
  name: 'xc-redis',
  components: {
    'xc-grid-table': GridTable
  },
  props: {
  },
  data () {
    return {
      search: '',
      searchPlaceholder: '请输入key模式，默认*',
      cursor: 0,
      count: 10,
      options: [
        {
          value: 10,
          label: 10
        },
        {
          value: 20,
          label: 20
        },
        {
          value: 30,
          label: 30
        }
      ],
      data: {},
      loading: '',
      deletablePatternRoles: [],
      schema: {
        creatable: false,
        editable: false,
        copyable: false,
        deletable: ['Backend'],
        columns: [
          {
            name: 'key',
            title: 'Key',
            width: 120
          },
          {
            name: 'type',
            title: 'Type',
            width: 120
          },
          {
            name: 'ttl',
            title: 'TTL',
            width: 120
          },
          {
            name: 'data',
            title: 'Data',
            className: 'ellipsis2'
          }
        ]
      }
    }
  },
  computed: {
    deletablePattern () {
      let {
        deletablePatternRoles,
        $root: {
          supervisor
        }
      } = this
      return commonUtils.checkRole(deletablePatternRoles, supervisor)
    }
  },
  created () {
    this.startSearch()
  },
  watch: {
    count () {
      this.getRedisKeys()
    }
  },
  methods: {
    startSearch () {
      this.getRedisKeys()
    },
    nextPage () {
      let {
        data: {
          cursor = 0
        }
      } = this
      this.cursor = cursor
      this.getRedisKeys()
    },
    getRedisKeys () {
      let {
        cursor,
        count
      } = this
      let pattern = this.search || '*'
      this.loading = 'loading'
      let query = {
        pattern,
        cursor,
        count
      }
      api.getRedisKeys(query).then(data => {
        this.loading = ''
        this.data = data
        if (data.cursor !== '0' && !data.list.length) {
          this.nextPage()
        }
      }).catch(err => {
        this.loading = ''
        console.error('getRedisKeys error', err)
      })
    },
    handleDelete (row) {
      let {
        key
      } = row
      api.deleteRedisKey({key}).then(data => {
        if (data.code === 0) {
          this.getRedisKeys()
        }
      }).catch(err => {
        console.error('getRedisKeys error', err)
      })
    },
    deletePattern () {
      let {
        search: pattern
      } = this
      if (!pattern) {
        this.$message({
          type: 'info',
          message: '请输入删除的pattern'
        })
        return
      }
      this.$confirm(`delete pattern ${pattern}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return api.deleteRedisKeyPattern({
          pattern
        }).then(data => {
          if (data.code === 0) {
            this.$message({
              type: 'info',
              message: `成功删除共 ${data.num}条`
            })
            this.search = ''
            this.getRedisKeys()
          } else {
            this.$notify.error({
              title: '删除失败',
              message: data.msg
            })
          }
        }).catch(err => {
          console.error('error', err)
          this.$notify.error({
            title: '删除失败',
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

.xc-redis {
  .head {
    display: flex;
    margin-bottom: 20px;
    .search {
      // flex: 0 0 120px;
      width: 400px;
      margin-right: 40px;
      .delete-icon {
        color: $main_red;
        border-left: 1px solid #d8dce5;
        padding-left: 16px;
      }
    }
    .select {
    }
  }
  .pager {
    .cursor {
      color: #67C23A;
    }
  }
}
</style>
