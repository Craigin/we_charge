<template>
  <div class="xc-industry-report-detail">
    <h2>
      <a :href="getUrl()" target="_blank">
        {{report.config.title}}
      </a>
    </h2>
    <el-form
      ref="form"
      :model="report"
      action="#"
      method="POST"
      enctype="multipart/form-data"
      v-loading.body="loading"
      label-width="80px">
      <el-tabs
        :value="tab"
        type="border-card"
        v-on:tab-click="handleTabClick">
        <el-tab-pane name="base" label="基础配置">
          <xc-base-tab :report="report" :schema="schema">
          </xc-base-tab>
        </el-tab-pane>
        <el-tab-pane name="industry" label="行业配置">
          <xc-industry-tab :report="report" :schema="schema">
          </xc-industry-tab>
        </el-tab-pane>
        <el-tab-pane name="etc" label="杂项配置">
          <xc-form-item-group :schema="schema.root" :model="report">
          </xc-form-item-group>
          <xc-form-item-group class="etc-section" :schema="schema.etc" :model="report.config">
          </xc-form-item-group>
        </el-tab-pane>
        <el-tab-pane name="data" label="数据">
          <xc-data-tab :report="report" v-on:change-tab="handleChangeTab">
          </xc-data-tab>
        </el-tab-pane>
        <el-tab-pane name="summary" label="文案">
          <xc-form-item-group :schema="schema.summary" :model="report.config">
          </xc-form-item-group>
        </el-tab-pane>
        <el-tab-pane
          v-for="l of lang"
          :key="l"
          :name="'lang-' + l"
          :label="'多语言 - ' + l">
          <xc-form-item-group :schema="schema.lang" :model="report.lang[l]">
          </xc-form-item-group>
        </el-tab-pane>
        <el-tab-pane name="preview" label="预览">
          <xc-preview-tab ref="previewTab" :report="report">
          </xc-preview-tab>
        </el-tab-pane>
      </el-tabs>
      <el-button
        class="submit"
        type="primary"
        :icon="saving ? 'loading' : ''"
        :disabled="saving || !editable"
        @click="handleSubmit">
        保存修改
      </el-button>
    </el-form>
  </div>
</template>

<script>
import api from 'api'
import {HOSTS} from 'config'
import * as commonUtils from 'common/utils'

import schema from './schema'
import JsonEditor from 'components/jsonEditor'
import FormItemGroup from 'components/formItemGroup'
import BaseTab from './baseTab'
import IndustryTab from './industryTab'
import DataTab from './dataTab'
import PreviewTab from './previewTab'

const LANG = [
  'en'
  // 'ru'
]

export default {
  name: 'xc-industry-report-detail',
  components: {
    'xc-json-editor': JsonEditor,
    'xc-form-item-group': FormItemGroup,
    'xc-base-tab': BaseTab,
    'xc-industry-tab': IndustryTab,
    'xc-data-tab': DataTab,
    'xc-preview-tab': PreviewTab
  },
  props: {
  },
  data () {
    return {
      tab: 'base',
      lang: LANG,
      formLabelWidth: '100px',
      loading: false,
      saving: false,
      report: this.supplementReport({}),
      refreshIndustry: false,
      hooverReport: undefined,
      refreshingIndustry: false,
      generatingHscode: false,
      schema
    }
  },
  watch: {
  },
  computed: {
    editable () {
      let {
        $root: {
          supervisor
        }
      } = this
      return commonUtils.checkRole(['Backend', 'Product'], supervisor)
    }
  },
  created () {
    let {
      $route: {
        query: {
          _id
        }
      }
    } = this
    this.loading = true
    api.dataTableSelect({
      _id,
      limit: 1
    }, {}, {
      type: 'mongo',
      database: 'discovery',
      table: 'industryReport'
    }).then(data => {
      this.loading = false
      let {
        rows: [
          report
        ]
      } = data
      this.report = this.supplementReport(report)
    }).catch(err => {
      this.options = []
      console.error('dataTableSelect error', err)
    })
  },
  methods: {
    getUrl () {
      let {
        report: {
          _id
        }
      } = this
      return `${HOSTS.DISCOVERY}/industry-report/${_id}`
    },
    supplementReport (report) {
      return {
        _id: '',
        data: {},
        index: 0,
        enable: 1,
        ...report,
        config: {
          sic: [],
          naics: [],
          hscode: [],
          ...report.config
        },
        generated: {
          lang: {},
          data: {},
          ...report.generated
        },
        lang: {
          ...this.getReportLang(LANG),
          ...report.lang
        }
      }
    },
    getReportLang (lang) {
      let reportLang = {}
      lang.forEach(l => {
        reportLang[l] = {}
      })
      return reportLang
    },
    handleSubmit (e) {
      e.preventDefault()

      let {
        report,
        report: {
          _id
        }
      } = this
      this.saving = true
      api.dataTableUpdate(report, {
        config: {
          params: {
            _id
          }
        }
      }, {
        type: 'mongo',
        database: 'discovery',
        table: 'industryReport'
      }).then(data => {
        this.saving = false
      }).catch(err => {
        this.saving = false
        console.error('dataTableUpdate error', err)
        this.$notify.error({
          title: '保存失败',
          message: err.response.data
        })
      })
    },
    handleTabClick (tab) {
      let {
        name
      } = tab
      let {
        $refs: {
          previewTab
        }
      } = this
      if (name === 'preview') {
        previewTab.updateData()
      }
      this.tab = name
    },
    handleChangeTab (tab) {
      this.tab = tab
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-industry-report-detail {
  h2 {
    color: $main_font;
    font-family: sans-serif;
  }
  form {
    padding-top: 20px;
    padding-bottom: 20px;
    .submit {
      margin-top: 20px;
    }

    .etc-section {
      border-top: 1px solid $divider;
      margin-top: 32px;
      padding-top: 18px;
    }
    .editor {
    }
  }

  .hint {
    font-size: 12px;
    color: $light_font;
  }
}
</style>
