import api from 'api'
import {
  DB_WECHARGE_NAME,
  TABLE_COLUMN_ID
  // TABLE_COLUMN_PAYLOAD,
  // COMMON_TABLE_COLUMNS,
  // TABLE_COLUMN_USER_ID_SHOW,
  // TABLE_COLUMN_CLIENT_ID_SHOW,
  // WIDTH
} from './common'

export default [
  {
    path: '/charge/entity/field/manage',
    name: 'EntityFieldManage',
    title: '',
    table: {
      type: 'mysql',
      database: DB_WECHARGE_NAME,
      table: 'entity_listfieldname',
      defaultSort: {
        prop: 'ListIndex',
        order: 'ascending'
      },
      buttonGroupWidth: 0,
      formLabelWidth: '50px',
      actions: ['create', 'back'],
      selectPanel: {},
      columns: [
        TABLE_COLUMN_ID,
        {
          name: 'EntityClass',
          title: 'EntityClass',
          show: false
        },
        {
          name: 'PropertyName',
          title: '属性',
          width: 200,
          type: 'select',
          options: (row) => {
            if (!row) return
            let {
              EntityClass
            } = row
            return api.dataTableSelect({_page: '1,9999', EntityClass}, {}, {type: 'mysql', database: DB_WECHARGE_NAME, table: 'entity_listfieldname'}).then(listFieldData => {
              return api.dataTableSelect({_page: '1,9999', EntityClass}, {}, {type: 'mysql', database: DB_WECHARGE_NAME, table: 'entity_allfieldname'}).then(allFieldData => {
                let hiddenFieldList = allFieldData.rows.filter(section => {
                  return !listFieldData.rows.find(item => item.PropertyName === section.PropertyName)
                })
                return hiddenFieldList.map(item => {
                  return {
                    ...item,
                    name: item.PropertyName,
                    value: item.PropertyName
                  }
                })
              })
            })
          }
        },
        {
          name: 'ColWidth',
          title: '宽度',
          width: 150
        },
        {
          name: 'ListIndex',
          title: '顺序',
          sortable: true,
          type: 'integer',
          max () {
            return 9999
          },
          min () {
            return 1
          }
        }
      ]
    }
  }
]
