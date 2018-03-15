<template>
  <div class="xc-operate-report">
    <div class="use-pannel">
      <div class="filter-panel">
        <xc-criteria-panel :controls="['clientType', 'dateRange']"></xc-criteria-panel>
        <el-button type="primary" plain @click="dialogFormVisible = true">上传ids</el-button>
      </div>
      <ul>
        <li class="li-panel" v-for="(section, index) of dynamicSchema.sections">
          <xc-table
            :schema="section"
            :param="param">
          </xc-table>
        </li>
      </ul>
    </div>
    <el-dialog title="上传ids" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="类别" :label-width="formLabelWidth">
          <el-select v-model="form.idsPivot" placeholder="请选择类别">
            <el-option label="客户" value="client_id"></el-option>
            <el-option label="用户" value="user_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="请输入内容"
            v-model="form.idsContent">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitIds">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from 'api'
import * as dateUtils from 'utils/dateFormat'
import XcCriteriaPanel from 'components/criteriaPanel'
import XcTable from './table'
import {generateSchema, param} from './schema'

export default {
  name: 'xc-operate-report',
  components: {
    XcCriteriaPanel,
    XcTable
  },
  props: {
    schema: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dynamicSchema: {},
      dialogFormVisible: false,
      formLabelWidth: '40px',
      form: {
        idsContent: '',
        idsPivot: ''
      }
    }
  },
  watch: {
    param () {
      this.getSchema()
    },
    dialogFormVisible () {
      let {
        idsPivot,
        idsContent
      } = this.$route.query
      this.form = {
        idsPivot,
        idsContent
      }
    }
  },
  created () {
    this.getSchema()
  },
  computed: {
    dateRange () {
      let {
        start,
        end
      } = this.$route.query

      if (start && end) {
        start = dateUtils.format(new Date(start), 'yyyyMMdd')
        end = dateUtils.format(new Date(end), 'yyyyMMdd')
        return [start, end]
      }
      return []
    },
    param () {
      let {
        form,
        dateRange,
        $route: {
          query: {
            type,
            client_id: clientId,
            user_id: userId,
            client_type: clientType = ''
          }
        }
      } = this
      return {
        ...param,
        type,
        clientId,
        userId,
        clientType,
        dateRange,
        form
      }
    }
  },
  methods: {
    submitIds () {
      let {
        query
      } = this.$route
      let {
        idsPivot,
        idsContent
      } = this.form
      let newQuery = {
        ...query,
        idsPivot,
        idsContent
      }
      this.$router.replace({query: newQuery})
      this.dialogFormVisible = false
    },
    getSchema () {
      this.dynamicSchema = {}

      let {
        schema: {
          type,
          database,
          table,
          reportId: id
        }
      } = this
      api.dataTableSelect({id}, {}, {type, database, table}).then(data => {
        this.loading = ''
        this.dynamicSchema = generateSchema(data)
      }).catch(err => {
        this.loading = 'error'
        console.error('dataTableSelect error', err)
        this.$notify.error({
          title: '加载失败',
          message: err.message
        })
      })
    }
  }
}
</script>

<style lang="scss" >
@import '~styles/_main';

.xc-operate-report {
  .li-panel {
    margin-bottom: 20px;
    // float: left;
    margin-right: 40px;
  }
  .filter-panel {
    display: flex;
    align-items: center;
    .el-button {
      margin: 0 20px 20px 0;
    }
  }
  .el-form-item {
    margin-bottom: 20px;
  }
}

</style>
