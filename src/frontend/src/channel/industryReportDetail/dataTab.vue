<template>
  <div class="xc-data-tab">
    <div class="editor-container">
      <div class="editor-side-container editor-left-container">
        <xc-json-editor
          class="editor"
          :data="report.generated.data"
          v-model="report.generated.data"
          :editable="false">
        </xc-json-editor>
      </div>
      <div class="editor-side-container editor-right-container">
        <xc-json-editor
          class="editor import-bool"
          :data="report.config.importBool"
          v-model="report.config.importBool">
        </xc-json-editor>
        <div class="generate-container">
          <ul
            v-if="alerts.length"
            class="alerts">
            <li
              v-for="alert of alerts"
              class="alert">
              <a href="#" @click.prevent="handleAlertClick(alert.tab)">
                {{alert.text}}
              </a>
            </li>
          </ul>
          <el-button
            class="generate"
            type="primary"
            size="small"
            :icon="loading ? 'loading' : ''"
            :disabled="loading"
            @click="handleGenerate">
            重新生成
          </el-button>
          <el-popover
            ref="generatePopover"
            trigger="hover"
            placement="top">
            <div>
              <span class="hint">
                点击重新生成左侧数据（根据SIC、NAICS和HSCode生成）
              </span>
            </div>
            <div>
              <span class="hint">
                上方输入框设置海关数据过滤条件
              </span>
            </div>
            <div>
              <span class="hint">
                下方输入框设置覆盖的补丁数据，
                globalMarketSize和domesticMarketSize的格式参考
                <a class="" href="/api/public/fake-data?key=industryReport" target="_blank">
                  /api/public/fake-data?key=industryReport
                </a>
              </span>
            </div>
          </el-popover>
          <i
            class="el-icon-information"
            v-popover:generatePopover>
          </i>
        </div>
        <xc-json-editor
          class="editor patch"
          :data="report.data"
          v-model="report.data">
        </xc-json-editor>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import api from 'api'
import JsonEditor from 'components/jsonEditor'

export default {
  name: 'xc-data-tab',
  components: {
    'xc-json-editor': JsonEditor
  },
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    alerts () {
      let {
        report: {
          config: {
            timeRange,
            hscode
          }
        }
      } = this
      let alerts = []
      if (!timeRange) {
        alerts.push({
          text: '时间范围未设置',
          tab: 'base'
        })
      } else if (timeRange.length !== 2) {
        alerts.push({
          text: '时间范围设置不正确',
          tab: 'base'
        })
      }
      if (!hscode || !hscode.length) {
        alerts.push({
          text: 'HSCode没有设置',
          tab: 'industry'
        })
      }
      return alerts
    }
  },
  created () {
  },
  methods: {
    handleGenerate () {
      this.loading = true
      let {
        report: {
          config,
          generated
        }
      } = this
      config = _.pick(config, [
        'sic',
        'naics',
        'hscode',
        'timeRange',
        'industryCountryTopN',
        'importCountryTopN',
        'importCountryImporterTopN',
        'importCountryImporterExporterTopN',
        'importCountryImporterExporterProductTopN',
        'importImporterTopN',
        'importImporterExporterTopN',
        'importImporterExporterProductTopN',
        'importExporterTopN',
        'importExporterProductTopN',
        'importProductTopN',
        'importUnit',
        'importBool'
      ])
      return api.generateIndustryReportData(config).then(data => {
        this.loading = false
        this.$set(generated, 'data', data)
      }).catch(err => {
        this.loading = false
        console.error('generateIndustryReportData error', err)
        this.$notify.error({
          title: '生成报告数据失败',
          message: err.response.data
        })
      })
    },
    handleAlertClick (tab) {
      this.$emit('change-tab', tab)
    }
  }
}
</script>

<style lang="scss">
@import '~styles/_main';

.xc-data-tab {
  .generate {
    margin-bottom: 8px;
  }
  .alerts {
    margin-bottom: 8px;
    .alert a {
      color: $error;
      font-size: 13px;
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .editor-container {
    display: flex;
    flex-direction: row;
    height: 640px;

    .editor-side-container {
      display: flex;
      flex-direction: column;

      &.editor-left-container {
        flex: 3;
        .editor {
          flex: 1;
        }
      }
      &.editor-right-container {
        flex: 2;
        .editor {
          &.import-bool {
            flex: 1;
          }
          &.patch {
            flex: 2;
          }
        }
        .generate-container {
          padding: 6px 2px;
        }
      }
    }
    .editor {
      border: 1px solid $divider;
    }
  }
}
</style>
