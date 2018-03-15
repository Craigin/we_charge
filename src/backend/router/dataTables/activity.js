import {
  COMMON_TABLE_COLUMNS,
  COMMON_TABLE_COLUMN_REFER_USER,
  COMMON_TABLE_COLUMN_REFER_CLIENT
} from './common'

const ACTIVITY_ID = {
  name: 'activity_id',
  edit: true,
  refer: {
    name: 'activity',
    table: 'tbl_activity',
    column: 'id',
    labelColumn: 'name',
    attributes: [
      'id',
      'name'
    ]
  }
}

const CLIENT_ID = {
  name: 'client_id',
  edit: true,
  refer: {
    name: 'client',
    ...COMMON_TABLE_COLUMN_REFER_CLIENT
  }
}

const USER_ID = {
  name: 'user_id',
  edit: true,
  search: true,
  refer: {
    name: 'create_user',
    ...COMMON_TABLE_COLUMN_REFER_USER
  }
}

export const activity = {
  tbl_activity: {
    creatable: ['Develop', 'Product'],
    editable: ['Develop', 'Product'],
    deletable: ['Develop', 'Product'],
    columns: [
      {
        name: 'id',
        primary: true,
        search: true,
        referred: [
        ]
      },
      CLIENT_ID,
      {
        name: 'name',
        edit: true,
        search: 'like'
      },
      ...COMMON_TABLE_COLUMNS
    ]
  },
  tbl_activity_event: {
    creatable: ['Develop', 'Product'],
    editable: ['Develop', 'Product'],
    deletable: ['Develop', 'Product'],
    columns: [
      {
        name: 'id',
        primary: true,
        search: true,
        referred: [
        ]
      },
      ACTIVITY_ID,
      {
        name: 'name',
        edit: true,
        search: 'like'
      },
      ...COMMON_TABLE_COLUMNS
    ]
  },
  tbl_activity_reward: {
    columns: [
      {
        name: 'id',
        primary: true,
        search: true,
        referred: [
        ]
      },
      ACTIVITY_ID,
      {
        name: 'title',
        edit: true,
        search: 'like'
      },
      ...COMMON_TABLE_COLUMNS
    ],
    extraColumns: [
      {
        name: 'domains_reward',
        type: 'mysql',
        database: 'discovery_admin',
        table: 'tbl_activity_user_reward',
        queryType: 'sql',
        sentence: (row) => {
          return `SELECT domain, count(*) as count FROM tbl_activity_user_reward where activity_reward_id = ${row.id} group by domain order by domain ;`
        },
        options: {}
      }
    ]
  },
  tbl_user_event: {
    creatable: ['Develop', 'Product'],
    editable: ['Develop', 'Product'],
    deletable: ['Develop', 'Product'],
    columns: [
      {
        name: 'id',
        primary: true,
        search: true,
        referred: [
        ]
      },
      CLIENT_ID,
      {
        name: 'name',
        edit: true,
        search: 'like'
      },
      ...COMMON_TABLE_COLUMNS
    ]
  },
  tbl_activity_user: {
    creatable: ['Develop', 'Product'],
    editable: ['Develop', 'Product'],
    deletable: ['Develop', 'Product'],
    columns: [
      {
        name: 'id',
        primary: true,
        search: true,
        referred: [
        ]
      },
      ACTIVITY_ID,
      CLIENT_ID,
      {
        name: 'domain',
        search: true
      },
      ...COMMON_TABLE_COLUMNS
    ]
  },
  tbl_activity_user_reward: {
    creatable: ['Develop', 'Product'],
    editable: ['Develop', 'Product'],
    deletable: ['Develop', 'Product'],
    columns: [
      {
        name: 'id',
        primary: true,
        search: true,
        referred: [
        ]
      },
      ACTIVITY_ID,
      CLIENT_ID,
      USER_ID,
      {
        name: 'domain',
        search: true
      },
      {
        name: 'activity_reward_id',
        edit: true,
        refer: {
          name: 'reward',
          table: 'tbl_activity_reward',
          column: 'id',
          labelColumn: 'title',
          attributes: [
            'id',
            'title'
          ]
        }
      },
      ...COMMON_TABLE_COLUMNS
    ]
  }
}
