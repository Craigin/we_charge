import {
  TABLE_COLUMN_TITLE,
  TABLE_COLUMN_IMAGE,
  TABLE_COLUMN_DESCRIPTION,
  TABLE_COLUMN_INDEX,
  TABLE_COLUMN_ENABLE
} from 'router/dataTables/common'

const separateStrategy = {
  toText (value) {
    if (Array.isArray(value)) {
      value = value.join(', ')
    }
    return value
  },
  fromText (value) {
    return value ? value.split(/[ ,;|\t\r\n]+/) : []
  }
}

const baseSchema = [
  TABLE_COLUMN_TITLE,
  {
    name: 'subject',
    title: '行业名',
    type: 'text'
  },
  {
    ...TABLE_COLUMN_IMAGE,
    default: ''
  },
  {
    name: 'pdf',
    title: 'pdf',
    type: 'image',
    default: ''
  },
  {
    ...TABLE_COLUMN_DESCRIPTION,
    rows: 2
  }
]

const summarySchema = [
  {
    name: 'industrySummary',
    title: '行业概要',
    type: 'textarea',
    placeholder: '',
    rows: 3
  },
  {
    name: 'industrySize',
    title: '行业规模',
    type: 'textarea',
    placeholder: '',
    rows: 3
  },
  {
    name: 'importSummary',
    title: '进口概要',
    type: 'textarea',
    placeholder: '',
    rows: 3
  },
  {
    name: 'conclusion',
    title: '结论/趋势',
    type: 'textarea',
    placeholder: '',
    rows: 3
  }
]

const schema = {
  root: {
    labelWidth: '300px',
    columns: [
      TABLE_COLUMN_INDEX,
      TABLE_COLUMN_ENABLE
    ]
  },
  etc: {
    labelWidth: '300px',
    columns: [
      {
        name: 'industryCountryTopN',
        title: '行业: 国家TopN',
        type: 'integer',
        default: 10
      },
      {
        name: 'importCountryTopN',
        title: '进口: 国家TopN',
        type: 'integer',
        default: 10
      },
      {
        name: 'importCountryWithImporter',
        title: '进口: 国家/进口商',
        type: 'integer',
        default: 3
      },
      {
        name: 'importCountryImporterTopN',
        title: '进口: 国家/进口商TopN',
        type: 'integer',
        default: 10
      },
      {
        name: 'importCountryImporterWithExporter',
        title: '进口: 国家/进口商/出口商',
        type: 'integer',
        default: 3
      },
      {
        name: 'importCountryImporterExporterTopN',
        title: '进口: 国家/进口商/出口商TopN',
        type: 'integer',
        default: 10
      },
      {
        name: 'importCountryImporterExporterProductTopN',
        title: '进口: 国家/进口商/出口商/产品TopN',
        type: 'integer',
        default: 3
      },
      {
        name: 'importImporterTopN',
        title: '进口: 进口商TopN',
        type: 'integer',
        default: 10
      },
      {
        name: 'importImporterExporterTopN',
        title: '进口: 进口商/出口商TopN',
        type: 'integer',
        default: 3
      },
      {
        name: 'importImporterExporterProductTopN',
        title: '进口: 进口商-出口商-产品TopN',
        type: 'integer',
        default: 3
      },
      {
        name: 'importExporterTopN',
        title: '进口: 出口商TopN',
        type: 'integer',
        default: 10
      },
      {
        name: 'importExporterProductTopN',
        title: '进口: 出口商-产品TopN',
        type: 'integer',
        default: 3
      },
      {
        name: 'importProductTopN',
        title: '进口: 产品TopN',
        type: 'integer',
        default: 10
      },
      {
        name: 'importUnit',
        title: '进口额单位',
        type: 'select',
        options: [
          {
            name: '百万美元',
            value: 'millionDollars'
          }
        ],
        default: 'millionDollars'
      },
      {
        name: 'importBool',
        title: '进口数据筛选',
        type: 'json',
        show: false,
        default: {
          must_not: [
            {
              terms: {
                importCountry: [
                  'Argentina',
                  'Vietnam'
                ]
              }
            }
          ]
        }
      }
    ]
  },
  base: {
    labelWidth: '100px',
    columns: [
      ...baseSchema,
      {
        name: 'timeRange',
        title: '时间范围',
        type: 'date',
        dateType: 'daterange',
        outputFormat: 'yyyy-mm-dd',
        hint: '生成数据的统计时间范围'
      }
    ]
  },
  industryHooverReportId: {
    labelWidth: '100px',
    columns: [
      {
        name: 'hooverReportId',
        title: 'Hoover报告ID',
        placeholder: '用于抓取Hoover数据'
      }
    ]
  },
  industry: {
    labelWidth: '100px',
    columns: [
      {
        name: 'sic',
        title: 'SIC代码',
        type: 'textarea',
        placeholder: '输入SIC代码，使用逗号或者空格分隔',
        ...separateStrategy,
        rows: 2
      },
      {
        name: 'naics',
        title: 'NAICS代码',
        type: 'textarea',
        placeholder: '输入NAICS代码，使用逗号或者空格分隔',
        ...separateStrategy,
        rows: 2
      },
      {
        name: 'hscode',
        title: 'HSCode',
        type: 'textarea',
        placeholder: '输入HSCode代码，使用逗号或者空格分隔',
        ...separateStrategy,
        rows: 2
      }
    ]
  },
  summary: {
    columns: summarySchema
  },
  lang: {
    columns: [
      ...baseSchema,
      ...summarySchema
    ]
  }
}

export default schema
