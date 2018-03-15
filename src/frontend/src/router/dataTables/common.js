import {HOSTS} from 'config'
import * as dateFormatUtils from 'utils/dateFormat'

export const DB_WECHARGE_NAME = 'we_charge'

export const WIDTH = {
  main: 140,
  short: 120,
  shorter: 94,
  long: 180,
  longer: 220
}

export const TABLE_COLUMN_ID = {
  index: 1,
  name: 'id',
  title: '#',
  width: WIDTH.short,
  show: false
}

export const TABLE_COLUMN_TITLE = {
  name: 'title',
  title: '标题',
  type: 'text',
  width: WIDTH.main
}

export const TABLE_COLUMN_IMAGE = {
  name: 'image',
  title: '图片',
  type: 'image',
  width: WIDTH.main
}

export const TABLE_COLUMN_URL = {
  name: 'url',
  title: '链接',
  type: 'url',
  className: 'ellipsis',
  width: WIDTH.main
}

export const TABLE_COLUMN_DESCRIPTION = {
  name: 'description',
  title: '描述',
  type: 'textarea',
  className: 'ellipsis',
  width: WIDTH.long
}

export const TABLE_COLUMN_INDEX = {
  name: 'index',
  title: '顺序',
  width: WIDTH.short,
  type: 'integer',
  hint: '数字越大，顺序越靠前，默认是1',
  max () {
    return 10
  },
  min () {
    return 1
  }
}

export const TABLE_COLUMN_SHOW = {
  name: 'show',
  title: '是否展示',
  type: 'select',
  width: WIDTH.shorter,
  options: [
    {
      name: '展示',
      value: 1
    },
    {
      name: '隐藏',
      value: 0
    }
  ],
  text (value, row, schema) {
    return schema.options.find(item => item.value === value).name
  }
}

export const TABLE_COLUMN_ENABLE = {
  name: 'enable',
  title: '是否生效',
  type: 'select',
  width: WIDTH.short,
  options: [
    {
      name: '生效',
      value: 1
    },
    {
      name: '不生效',
      value: 0
    }
  ]
}

export const TABLE_COLUMN_PAYLOAD = {
  name: 'payload',
  title: '附加数据',
  type: 'json',
  width: WIDTH.longer,
  className: 'ellipsis'
}

export const TABLE_COLUMN_LANG = {
  name: 'lang',
  title: '语言',
  type: 'select',
  options: [
    {
      name: '英文',
      value: 'en'
    },
    {
      name: '中文',
      value: 'zh'
    }
  ]
}

export const TABLE_COLUMN_AGGREGATE_LANG = {
  name: 'lang',
  title: '多语言',
  type: 'popover',
  text (value, row) {
    return value.map(row => row.lang).join(', ')
  }
}

export const TABLE_COLUMN_COMPANY = {
  name: 'company_hash_id',
  title: '公司',
  type: 'select',
  selectType: 'remoteSelect',
  selectValue: '_id',
  width: WIDTH.longer,
  text (value, row) {
    let {
      company
    } = row
    let name = (company && company.companyName) || ''
    return `${name}#${value}`
  },
  url (value, row) {
    return `${HOSTS.DISCOVERY}/company/${value}`
  }
}

const TABLE_COLUMN_USER = {
  name: 'user_id',
  title: '账户',
  width: WIDTH.main,
  type: 'select',
  selectType: 'remoteSelect',
  selectName: 'email',
  selectValue: 'user_id',
  text (value, row, schema) {
    if (!value) {
      return
    }
    let {
      referField = 'user'
    } = schema
    let {
      [referField]: {
        nickname
      } = {}
    } = row
    return nickname || `user#${value || '???'}`
  },
  url (value, row) {
    let where = {user_id: value}
    where = encodeURIComponent(JSON.stringify(where))
    return `${HOSTS.LANTERN}/#/database/v4_admin/tbl_user_info?where=${where}`
  }
}

export const TABLE_COLUMN_USER_ID = {
  ...TABLE_COLUMN_USER,
  show: false
}

export const TABLE_COLUMN_USER_ID_SHOW = TABLE_COLUMN_USER

const TABLE_COLUMN_CLIENT = {
  name: 'client_id',
  title: '客户',
  width: WIDTH.main,
  type: 'select',
  selectType: 'remoteSelect',
  selectName: 'name',
  selectValue: 'client_id',
  selectEmpty: 0,
  url (value, row) {
    let where = {client_id: value}
    where = encodeURIComponent(JSON.stringify(where))
    return `${HOSTS.LANTERN}/#/database/v4_admin/tbl_client?where=${where}`
  },
  text (value, row, schema) {
    if (!value) {
      return
    }
    let {
      referField = 'client'
    } = schema
    let {
      [referField]: {
        name
      } = {}
    } = row
    return name || `client#${value || '???'}`
  }
}

export const TABLE_COLUMN_CLIENT_ID = {
  ...TABLE_COLUMN_CLIENT,
  show: false
}

export const TABLE_COLUMN_CLIENT_ID_SHOW = TABLE_COLUMN_CLIENT

export const TABLE_COLUMN_CREATE_USER_ID = {
  ...TABLE_COLUMN_USER_ID,
  name: 'create_user_id',
  title: '创建者',
  referField: 'create_user'
}

export const TABLE_COLUMN_UPDATE_USER_ID = {
  ...TABLE_COLUMN_USER_ID,
  name: 'update_user_id',
  title: '更新者',
  referField: 'update_user'
}

export const TABLE_COLUMN_TIME = {
  name: 'time',
  title: '时间',
  type: 'date',
  dateType: 'datetime',
  show: false,
  width: WIDTH.main,
  text (value, row) {
    if (value) {
      return dateFormatUtils.format(new Date(value))
    }
  }
}

export const TABLE_COLUMN_CREATE_TIME = {
  ...TABLE_COLUMN_TIME,
  name: 'create_time',
  title: '创建时间'
}

export const TABLE_COLUMN_UPDATE_TIME = {
  ...TABLE_COLUMN_TIME,
  name: 'update_time',
  title: '更新时间'
}

export const COMMON_TABLE_COLUMNS = [
  TABLE_COLUMN_CREATE_USER_ID,
  TABLE_COLUMN_CREATE_TIME,
  TABLE_COLUMN_UPDATE_USER_ID,
  TABLE_COLUMN_UPDATE_TIME
]
export const COMMON_TABLE_COLUMNS_TIME = [
  TABLE_COLUMN_CREATE_TIME,
  TABLE_COLUMN_UPDATE_TIME
]
