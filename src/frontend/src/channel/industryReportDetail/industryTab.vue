<template>
  <div class="xc-base-tab">
    <xc-form-item-group :schema="schema.industryHooverReportId" :model="report.config">
    </xc-form-item-group>
    <div v-if="needRefreshIndustry" :style="{paddingLeft: schema.base.labelWidth}">
      <el-button
        type="primary"
        size="small"
        :disabled="!hooverReport || refreshingIndustry"
        :icon="refreshingIndustry ? 'loading' : ''"
        @click="handleCrawlHoover">
        更新行业信息
      </el-button>
      <span class="hint">
        点击更新以下SIC/NAICS（从hoovers官网
        <a v-if="hooverReport" :href="hooverReport.url" target="_blank">
          {{hooverReport.url}}
        </a>
        抓取），HSCode（根据NAICS代码生成）
      </span>
    </div>
    <xc-form-item-group class="industry-section" :schema="schema.industry" :model="report.config">
    </xc-form-item-group>
    <div :style="{paddingLeft: schema.industry.labelWidth}">
      <el-button
        type="default"
        size="mini"
        :disabled="generatingHscode"
        :icon="generatingHscode ? 'loading' : ''"
        @click="handleGenerateHscode">
        更新HSCode
      </el-button>
      <span class="hint">
        点击更新HSCode（根据NAICS代码生成）
      </span>
    </div>
    <xc-json-editor
      class="editor user-input hoover-generated"
      :data="hooverGenerated"
      :editable="false">
    </xc-json-editor>
  </div>
</template>

<script>
import api from 'api'
import JsonEditor from 'components/jsonEditor'
import FormItemGroup from 'components/formItemGroup'
import * as commonUtils from 'common/utils'
import hooverReport from 'common/database/hooverReport.json'

export default {
  name: 'xc-base-tab',
  components: {
    'xc-json-editor': JsonEditor,
    'xc-form-item-group': FormItemGroup
  },
  props: {
    schema: {
      type: Object,
      required: true
    },
    report: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      needRefreshIndustry: false,
      hooverReport: undefined,
      refreshingIndustry: false,
      generatingHscode: false
    }
  },
  watch: {
    'report.config.hooverReportId' (value) {
      let {
        event: {
          type
        } = {}
      } = window
      if (type !== 'input') {
        return
      }
      this.needRefreshIndustry = !!value
      this.hooverReport = commonUtils.getTreeNode(hooverReport, value)
    }
  },
  computed: {
    hooverGenerated () {
      let {
        report: {
          generated: {
            lang
          }
        }
      } = this
      return {
        lang
      }
    }
  },
  created () {
  },
  methods: {
    handleCrawlHoover () {
      let {
        hooverReport: {
          url
        } = {}
      } = this
      if (!url) {
        return
      }
      this.refreshingIndustry = true
      return api.crawlHooverReport({
        url
      }).then(data => {
        this.refreshingIndustry = false
        this.needRefreshIndustry = false
        let {
          sic,
          naics,
          summaryParagraphs = []
        } = data
        let industrySummary = summaryParagraphs.map(p => `${p.title}\n${p.paragraph}`).join(`\n\n`)
        let {
          report,
          report: {
            config,
            generated
          }
        } = this
        let newConfig = {
          ...config,
          sic,
          naics
          // hscode
        }
        this.$set(report, 'config', newConfig)

        let newGenerated = {
          ...generated,
          lang: {
            en: {
              industrySummary
            }
          }
        }
        this.$set(report, 'generated', newGenerated)
      }).catch(err => {
        this.refreshingIndustry = false
        console.error('refreshIndustry error', err)
      })
    },
    handleGenerateHscode () {
      let {
        report: {
          config,
          config: {
            naics
          }
        }
      } = this
      this.generatingHscode = true
      return api.naicsHS({
        naics: naics.join(',')
      }).then(hscode => {
        this.generatingHscode = false
        this.$set(config, 'hscode', hscode)
      }).catch(err => {
        this.generatingHscode = false
        console.error('naicsHS error', err)
      })
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-base-tab {
  .industry-section {
    border-top: 1px solid $divider;
    margin-top: 32px;
    padding-top: 18px;
  }

  .editor {
    &.hoover-generated {
      margin-left: 100px;
      margin-top: 20px;
    }
  }
}
</style>
