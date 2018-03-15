// import api from 'api'
// import {HOSTS} from 'config'
import * as dateFormatUtils from 'utils/dateFormat'

import {
  TABLE_COLUMN_ID,
  TABLE_COLUMN_PAYLOAD,
  COMMON_TABLE_COLUMNS,
  TABLE_COLUMN_USER_ID_SHOW,
  TABLE_COLUMN_CLIENT_ID_SHOW,
  WIDTH
} from './common'

const ACTIVITY_ID = {
  name: 'activity_id',
  title: '活动',
  type: 'select',
  selectType: 'remoteSelect',
  url (value, row, schema, mergedSchema) {
    return {
      name: 'Activity',
      query: {
        id: value
      }
    }
  }
}

const VALUE = {
  name: 'value',
  title: '计数',
  type: 'integer',
  width: WIDTH.long
}

const DOMAIN = {
  name: 'domain',
  title: '计数域'
}

const CLIENT_TYPE = {
  name: 'client_type',
  title: '客户类型',
  type: 'select',
  options: [
    {
      name: '内部',
      value: 2
    },
    {
      name: '外部',
      value: 1
    }
  ]
}
export const activity = [
  {
    path: '/operate/activity/activity',
    name: 'Activity',
    title: '运营活动',
    table: {
      type: 'mysql',
      database: 'discovery_admin',
      table: 'tbl_activity',
      columns: [
        TABLE_COLUMN_ID,
        TABLE_COLUMN_CLIENT_ID_SHOW,
        {
          name: 'name',
          title: '名称',
          width: WIDTH.long
        },
        {
          name: 'type',
          title: '类型',
          type: 'select',
          options: [
            {
              name: '抽奖',
              value: 'lottery'
            },
            {
              name: '排行',
              value: 'rank'
            }
          ]
        },
        {
          name: 'title',
          title: '标题',
          width: WIDTH.long
        },
        {
          name: 'description',
          title: '描述',
          type: 'textarea',
          className: 'ellipsis'
        },
        {
          name: 'max',
          title: '最高抽奖次数',
          type: 'integer',
          hint: '当前计数域下(现指每天)的最高抽奖次数',
          max () {
            return 10000
          },
          min () {
            return 0
          }
        },
        DOMAIN,
        {
          name: 'start_time',
          title: '开始时间',
          type: 'date',
          dateType: 'datetime',
          show: false,
          width: WIDTH.main,
          text (value, row) {
            if (value) {
              return dateFormatUtils.format(new Date(value))
            }
          }
        },
        {
          name: 'end_time',
          title: '结束时间',
          type: 'date',
          dateType: 'datetime',
          show: false,
          width: WIDTH.main,
          text (value, row) {
            if (value) {
              return dateFormatUtils.format(new Date(value))
            }
          }
        },
        TABLE_COLUMN_PAYLOAD,
        ...COMMON_TABLE_COLUMNS
      ]
    }
  },
  {
    path: '/operate/activity/activity-event',
    name: 'ActivityEvent',
    title: '活动事件',
    table: {
      type: 'mysql',
      database: 'discovery_admin',
      table: 'tbl_activity_event',
      columns: [
        TABLE_COLUMN_ID,
        ACTIVITY_ID,
        {
          name: 'name',
          title: '名称',
          width: WIDTH.long
        },
        VALUE,
        ...COMMON_TABLE_COLUMNS
      ]
    }
  },
  {
    path: '/operate/activity/activity-reward',
    name: 'ActivityReward',
    title: '活动奖品',
    table: {
      type: 'mysql',
      database: 'discovery_admin',
      table: 'tbl_activity_reward',
      columns: [
        TABLE_COLUMN_ID,
        ACTIVITY_ID,
        {
          name: 'title',
          title: '名称',
          width: WIDTH.long
        },
        {
          name: 'total',
          title: '库存数量',
          type: 'integer',
          width: WIDTH.long,
          hint: '当前计数域下(现指每天), 奖品的库存数量, 0则表示库存为0，当天下不会中奖'
        },
        {
          name: 'domains_reward',
          title: '计数域下(每天)已抽取的数量',
          width: WIDTH.long,
          type: 'popover',
          text: () => {
            return ''
          },
          options: [
            {
              name: 'domain',
              title: '计数域',
              width: WIDTH.long
            },
            {
              name: 'count',
              title: '数量'
            }
          ],
          url (value, row, schema, mergedSchema) {
            return {
              name: 'ActivityUserReward',
              query: {
              }
            }
          }
        },
        {
          name: 'rate',
          title: '中奖率'
        },
        {
          name: 'max',
          title: '最多获得次数',
          hint: '整个活动期间, 对于每个用户, 该奖品可最多获得的次数',
          type: 'integer'
        },
        {
          name: 'type',
          title: '类型',
          type: 'select',
          options: [
            {
              name: '点数',
              value: 'credit'
            },
            {
              name: '其他',
              value: 'other'
            }
          ]
        },
        {
          name: 'value',
          title: '数值',
          type: 'integer',
          hint: '点数的数值, 其他类型奖品的数量',
          width: WIDTH.long
        },
        {
          name: 'index',
          title: '序号'
        },
        {
          name: 'description',
          title: '描述',
          type: 'textarea',
          className: 'ellipsis'
        },
        {
          name: 'rank_start',
          title: '奖品排行起始',
          type: 'integer'
        },
        {
          name: 'rank_end',
          title: '奖品排行截止',
          type: 'integer'
        },
        ...COMMON_TABLE_COLUMNS
      ]
    }
  },
  {
    path: '/operate/activity/user-event',
    name: 'UserEvent',
    title: '用户事件',
    table: {
      type: 'mysql',
      database: 'discovery_admin',
      table: 'tbl_user_event',
      columns: [
        TABLE_COLUMN_ID,
        CLIENT_TYPE,
        TABLE_COLUMN_CLIENT_ID_SHOW,
        TABLE_COLUMN_USER_ID_SHOW,
        {
          name: 'name',
          title: '名称',
          width: WIDTH.long
        },
        VALUE,
        {
          name: 'activities',
          title: '命中的运营活动id号列表',
          width: WIDTH.long
        },
        TABLE_COLUMN_PAYLOAD,
        ...COMMON_TABLE_COLUMNS
      ]
    }
  },
  {
    path: '/operate/activity/activity-user',
    name: 'ActivityUser',
    title: '活动用户',
    table: {
      type: 'mysql',
      database: 'discovery_admin',
      table: 'tbl_activity_user',
      columns: [
        TABLE_COLUMN_ID,
        ACTIVITY_ID,
        CLIENT_TYPE,
        TABLE_COLUMN_CLIENT_ID_SHOW,
        TABLE_COLUMN_USER_ID_SHOW,
        DOMAIN,
        VALUE,
        {
          name: 'used',
          title: '已经使用的抽奖次数',
          width: WIDTH.long
        },
        {
          name: 'blocked',
          title: 'blocked',
          type: 'select',
          options: [
            {
              name: 'unblocked',
              value: 0
            },
            {
              name: 'blocked',
              value: 1
            }
          ]
        },
        ...COMMON_TABLE_COLUMNS
      ]
    }
  },
  {
    path: '/operate/activity/activity-user-reward',
    name: 'ActivityUserReward',
    title: '活动用户奖励',
    table: {
      type: 'mysql',
      database: 'discovery_admin',
      table: 'tbl_activity_user_reward',
      columns: [
        TABLE_COLUMN_ID,
        ACTIVITY_ID,
        CLIENT_TYPE,
        TABLE_COLUMN_CLIENT_ID_SHOW,
        TABLE_COLUMN_USER_ID_SHOW,
        DOMAIN,
        {
          name: 'activity_reward_id',
          title: '奖品',
          type: 'select',
          selectType: 'remoteSelect',
          url (value, row, schema, mergedSchema) {
            return {
              name: 'ActivityReward',
              query: {
                id: value
              }
            }
          }
        },
        {
          name: 'rank',
          title: '榜单名次',
          type: 'integer'
        },
        {
          name: 'granted',
          title: '是否发放',
          type: 'select',
          options: [
            {
              name: '未发放',
              value: 0
            },
            {
              name: '已发放',
              value: 1
            }
          ]
        },
        ...COMMON_TABLE_COLUMNS
      ]
    }
  }
]
