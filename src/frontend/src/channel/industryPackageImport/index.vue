<template>
  <div class="xc-industry-package-import">
    <el-form
      ref="form"
      :model="form"
      action="/api/data/import-industry-package"
      method="POST"
      enctype="multipart/form-data"
      label-width="80px">
      <el-form-item label="名称">
        <el-input name="name" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Excel文件">
        <el-input name="file" type="file" v-model="form.file"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
    <div class="description">
      <div class="item">
        1. 上传后的行业包，并不立即生效。如需生效，请在
        <router-link :to="{name: 'IndustryPackage'}" target="_blank">列表页</router-link>
        手动设置。
      </div>
      <div class="item">
        2. Excel的报价明细页，必须包含"{{xlsxConfig.sheetName}}"。仅处理第一个符合该条件的标签页。
      </div>
      <div class="item">
        3. 表头包括六列，名称必须完全一致。
        <div
          v-for="column of xlsxConfig.columns"
          class="sub-item"
          :key="column">
          * {{column}}
        </div>
      </div>
      <div class="item">
        4. "Discovery ID"遵循规范，一层行业两个字节，二层行业四个字节，二层行业的前两个字节即其父级行业。
      </div>
    </div>
  </div>
</template>

<script>
import {INDUSTRY_PACKAGE_XLSX_CONFIG} from 'common'
import * as dateUtils from 'utils/dateFormat'

export default {
  name: 'xc-industry-package-import',
  components: {
  },
  props: {
  },
  data () {
    let now = new Date()
    let name = '行业包报价 ' + dateUtils.formatDate(now, 'YYYY年MM月DD日')
    return {
      form: {
        name,
        file: ''
      },
      xlsxConfig: INDUSTRY_PACKAGE_XLSX_CONFIG
    }
  },
  computed: {
  },
  methods: {
    handleSubmit () {
      let {
        $refs: {
          form
        }
      } = this
      form.$el.submit()
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-industry-package-import {
  form {
    padding-top: 20px;
  }
  .description {
    padding-left: 80px;
    font-size: 14px;
    color: #5e6d82;
    .item {
      margin-top: 6px;
      .sub-item {
        font-size: 12px;
        padding-left: 16px;
        margin-top: 4px;
      }
    }
  }
}
</style>
