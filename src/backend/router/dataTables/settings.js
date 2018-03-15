import {
  DB_WECHARGE_NAME,
  UNSEARCH_ID,
  COMMON_TABLE_COLUMN_COMPANY,
  COMMON_TABLE_COLUMN_MONGO_ID,
  COMMON_TABLE_COLUMNS,
  COMMON_TABLE_COLUMN_USER_ID,
  COMMON_TABLE_COLUMN_CLIENT_ID,
  COMMON_TABLE_COLUMN_REFER_USER,
  COMMON_TABLE_COLUMN_REFER_CLIENT,
  COMMON_TABLE_COLUMNS_TIME
} from './common'


export default {
  zone: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
      {
        name: 'ZoneName',
        edit: true,
        search: true
      }
    ]
  },
  entity_listfieldname: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: false,
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
      {
        name: 'EntityClass',
        edit: true
        // referred: [
        //   {
        //     name: 'allField',
        //     table: 'entity_allfieldname',
        //     column: 'EntityClass',
        //     attributes: [
        //       'id',
        //       'EntityClass',
        //       'PropertyName',
        //       'FieldName',
        //       'ListIndex'
        //     ]
        //   }
        // ]
      },
      {
        name: 'PropertyName',
        edit: true
      }
    ]
  },
  entity_allfieldname: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
    ]
  },
  electricitychargeclass: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
      {
        name: 'ClassName',
        edit: true,
        search: true
      }
    ]
  },
  electricitychargerule: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
      {
        name: 'ClassName',
        edit: true,
        search: true
      }
    ]
  },
  garbagechargeclass: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
      {
        name: 'ClassName',
        edit: true,
        search: true
      }
    ]
  },
  waterchargeclass: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
      {
        name: 'ClassName',
        edit: true,
        search: true
      }
    ]
  },
  waterchargerule: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
      {
        name: 'ClassName',
        edit: true,
        search: true
      }
    ]
  },
  applicationuser: {
    creatable: [],
    editable: [],
    copyable: false,
    deletable: [],
    columns: [
      UNSEARCH_ID,
      {
        name: 'UserID',
        edit: true,
        search: true
      }
    ]
  },
  deposit: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    order: 'CheckInDate-',
    columns: [
      UNSEARCH_ID,
      {
        name: 'OwnerName',
        edit: true,
        search: true
      }
    ]
  },
  sys_dictionary: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
      {
        name: 'ItemName',
        edit: true,
        search: true
      }
    ]
  },
  addtionalfeeforroom: {
    creatable: ['admin'],
    editable: ['admin'],
    copyable: ['admin'],
    deletable: ['admin'],
    columns: [
      UNSEARCH_ID,
      {
        name: 'ItemName',
        edit: true,
        search: true
      }
    ]
  }
}
