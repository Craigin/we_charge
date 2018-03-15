import api from 'api'
import Cell from './cell'

const fields = [
  'root',
  'web',
  'mysql',
  'mongo',
  'es',
  'redis'
].map(field => {
  return {
    field,
    label: field,
    align: 'center',
    component: Cell,
    text (value) {
      return value.success ? '✔' : '✘'
    },
    columnClassName: 'status',
    className (value) {
      return value.success ? 'success' : 'failure'
    }
  }
})

export const schema = {
  name: '推荐指标',
  sections: [
    {
      key: 'recommendationFilter',
      name: '服务状态',
      pagination: false,
      data (param) {
        return api.getDiagnose(param)
      },
      columns: [
        {
          field: 'tag',
          label: '-',
          align: 'right'
        },
        ...fields
      ]
    }
  ]
}
