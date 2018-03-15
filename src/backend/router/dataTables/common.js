
import mongodb from 'mongodb'
export const DISCOVERY_ADMIN_DB_NAME = 'we_charge'
export const DB_WECHARGE_NAME = 'we_charge'

export const UNSEARCH_ID = {
  name: 'id',
  primary: true,
  search: false
}

export const COMMON_TABLE_COLUMN_COMPANY = {
  name: 'company_hash_id',
  edit: true,
  search: true,
  refer: {
    name: 'company',
    type: 'mongo', // default to 'mysql'
    database: 'discovery',
    table: 'hooverCompany',
    column: '_id',
    labelColumn: 'companyName',
    attributes: [
      '_id',
      'companyName'
      // 'description',
      // 'updateTime'
    ]
  }
}

export const COMMON_TABLE_COLUMN_MONGO_ID = {
  name: '_id',
  primary: true,
  search: true,
  transform (value) {
    if (typeof value === 'string') {
      value = mongodb.ObjectID(value)
    }
    return value
  }
}

export const COMMON_TABLE_COLUMN_REFER_USER = {
  database: 'v4_admin',
  table: 'tbl_user_info',
  column: 'user_id',
  attributes: [
    'user_id',
    'email',
    'nickname',
    'avatar'
  ]
}

export const COMMON_TABLE_COLUMN_REFER_CLIENT = {
  database: 'v4_admin',
  table: 'tbl_client',
  column: 'client_id',
  attributes: [
    'client_id',
    'name'
  ]
}

export const COMMON_TABLE_COLUMN_USER_ID = {
  name: 'user_id',
  refer: {
    name: 'user',
    ...COMMON_TABLE_COLUMN_REFER_USER
  }
}

export const COMMON_TABLE_COLUMN_CLIENT_ID = {
  name: 'client_id',
  refer: {
    name: 'client',
    ...COMMON_TABLE_COLUMN_REFER_CLIENT
  }
}

export const COMMON_TABLE_COLUMNS = [
  {
    name: 'create_user_id',
    refer: {
      name: 'create_user',
      ...COMMON_TABLE_COLUMN_REFER_USER
    }
  },
  {
    name: 'create_time'
  },
  {
    name: 'update_user_id',
    refer: {
      name: 'update_user',
      ...COMMON_TABLE_COLUMN_REFER_USER
    }
  },
  {
    name: 'update_time'
  }
]


export const COMMON_TABLE_COLUMNS_TIME = [
  {
    name: 'create_time'
  },
  {
    name: 'update_time'
  }
]
