
// const LANG_ICON = '🌏'
// const PATCH_ICON = '💝'
// const UPLOAD_ICON = '📤'
// // const DOWNLOAD_ICON = '📥'
// const DETAIL_ICON = '🍱'
// const MESSAGE_ICON = '💌'

const menu = [
  {
    index: '/charge',
    text: '水电费管理',
    subMenu: [
      {
        index: '/charge/manage/room',
        text: '房间及水电表',
        children: [
          {
            index: '/charge/manage/room',
            text: '房间管理'
          },
          {
            index: '/charge/manage/watermeterinroom',
            text: '水表管理'
          },
          {
            index: '/charge/manage/electricitymeterinroom',
            text: '电表管理'
          }
        ]
      },
      {
        index: '/charge/manage/company/hire',
        text: '公司租房',
        children: [
          {
            index: '/charge/manage/company/info',
            text: '公司管理'
          },
          {
            index: '/charge/manage/company/hire',
            text: '租用房间'
          }
        ]
      },
      {
        index: '/charge/manage/meter-reading/watermeterrecord',
        text: '水电抄表',
        children: [
          {
            index: '/charge/manage/meter-reading/watermeterrecord',
            text: '水电查询'
          },
          {
            index: '/charge/manage/meter-reading/write',
            text: '水电录入'
          }
        ]
      },
      {
        index: '/charge/manage/pay/person',
        text: '个人交费'
      },
      {
        index: '/charge/manage/pay/company',
        text: '公司交费'
      },
      {
        index: '/charge/manage/bond',
        text: '保证金'
      }
    ]
  },
  {
    index: '/system',
    text: '系统设置',
    subMenu: [
      {
        index: '/system/setting/ZoneName',
        text: '管理区设置'
      },
      {
        index: '/system/setting/waterchargeclass/type',
        text: '水费标准',
        children: [
          {
            index: '/system/setting/waterchargeclass/type',
            text: '水费类别'
          },
          {
            index: '/system/setting/waterchargeclass/rule',
            text: '水费规则'
          }
        ]
      },
      {
        index: '/system/setting/electricitychargeclass/type',
        text: '电费标准',
        children: [
          {
            index: '/system/setting/electricitychargeclass/type',
            text: '电费类别'
          },
          {
            index: '/system/setting/electricitychargeclass/rule',
            text: '电费规则'
          }
        ]
      },
      {
        index: '/system/setting/garbagechargeclass',
        text: '垃圾处理费标准'
      },
      {
        index: '/system/setting/sys_dictionary/fujia',
        text: '附加费定义'
      },
      {
        index: '/system/setting/sys_dictionary/baozheng',
        text: '保证金定义'
      },
      {
        index: '/system/setting/users',
        text: '用户管理'
      },
      {
        index: '/system/setting/sys',
        text: '系统设置'
      }
    ]
  }
]

export default menu
