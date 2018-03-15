
// 1in = 2.54cm = 25.4mm = 72pt = 96px
// LODOP.PRINT_INITA("套打收据模板")
//  LODOP.SET_PRINT_PAGESIZE(1, '209mm', '113mm', '') //设置纸张高度
import mustache from 'mustache'
import {format} from 'utils/dateFormat'
import _ from 'lodash'

const tplMap = {
  'shouju': {
    name: 'shouju',
    template: `
    {{#list}}
    <div id="shouju">
      <table border="0" width="680" style="border-collapse:collapse">
          <tr height="83">
              <td style="vertical-align: bottom;padding-left: 94px;padding-bottom: 10px;">
                  {{pay_date}}
              </td>
          </tr>
      </table>
      <table border="0" width="680"  cellspacing="0" style="border-collapse:collapse">
        <tr height="30">
          <td rowspan="2" width="45" style="text-align: center;"></td>
          <td colspan="3" style="padding-left: 38px;" >{{user_name}}</td>
          <td colspan="4" style="padding-left: 42px;">{{charge_date}}</td>
        </tr>
        <tr height="26">
          <td width="83" style="text-align: center;"></td>
          <td width="111" style="text-align: center;"></td>
          <td width="111" style="text-align: center;"></td>
          <td colspan="2" style="text-align: center;"></td>
          <td width="63" style="text-align: center;"></td>
          <td width="113" style="text-align: center;"></td>
        </tr>


        <tr height="26">
          <td rowspan="3" width="45" style="text-align: center;"></td>
          <td rowspan="3" width="83" style="text-align: center;"></td>
          <td rowspan="3" width="111" style="text-align: center;">{{w_pre}}</td>
          <td rowspan="3" width="111" style="text-align: center;">{{w_last}}</td>
          <td colspan="2" style="text-align: center;">{{w_g1_use}}</td>
          <td width="63" style="text-align: center;">{{w_g1_price}}</td>
          <td width="113" style="text-align: center;">{{w_g1_total}}</td>
        </tr>
        <tr height="26">
          <td width="68" style="text-align: center;"></td>
          <td width="83" style="text-align: center;">{{w_g2_use}}</td>
          <td width="63" style="text-align: center;">{{w_g2_price}}</td>
          <td width="113" style="text-align: center;">{{w_g2_total}}</td>
        </tr>
        <tr height="26">
          <td width="68" style="text-align: center;"></td>
          <td width="83" style="text-align: center;">{{w_g3_use}}</td>
          <td width="63" style="text-align: center;">{{w_g3_price}}</td>
          <td width="113" style="text-align: center;">{{w_g3_total}}</td>
        </tr>

        <tr height="26">
          <td rowspan="3" width="45" style="text-align: center;"></td>
          <td rowspan="3" width="83" style="text-align: center;"></td>
          <td rowspan="3" width="111" style="text-align: center;"></td>
          <td rowspan="3" width="111" style="text-align: center;"></td>
          <td colspan="2" style="text-align: center;">{{s_g1_use}}</td>
          <td width="63" style="text-align: center;">{{s_g1_price}}</td>
          <td width="113" style="text-align: center;">{{s_g1_total}}</td>
        </tr>
        <tr height="26">
          <td width="68" style="text-align: center;"></td>
          <td width="83" style="text-align: center;">{{s_g2_use}}</td>
          <td width="63" style="text-align: center;">{{s_g2_price}}</td>
          <td width="113" style="text-align: center;">{{s_g2_total}}</td>
        </tr>
        <tr height="26">
          <td width="68" style="text-align: center;"></td>
          <td width="83" style="text-align: center;">{{s_g3_use}}</td>
          <td width="63" style="text-align: center;">{{s_g3_price}}</td>
          <td width="113" style="text-align: center;">{{s_g3_total}}</td>
        </tr>


        <tr height="26">
          <td rowspan="2" width="45" style="text-align: center;"></td>
          <td rowspan="2" width="83" style="text-align: center;"></td>
          <td rowspan="2" width="111" style="text-align: center;"></td>
          <td rowspan="2" width="111" style="text-align: center;"></td>
          <td width="68" style="text-align: center;"></td>
          <td width="83" style="text-align: center;">{{g_g1_use}}</td>
          <td width="63" style="text-align: center;">{{g_g1_price}}</td>
          <td width="113" style="text-align: center;">{{g_g1_total}}</td>
        </tr>
        <tr height="26">
          <td width="68" style="text-align: center;"></td>
          <td width="83" style="text-align: center;">{{g_g2_use}}</td>
          <td width="63" style="text-align: center;">{{g_g2_price}}</td>
          <td width="113" style="text-align: center;">{{g_g2_total}}</td>
        </tr>

        <tr height="26">
          <td width="45" style="text-align: center;"></td>
          <td width="83" style="text-align: center;"></td>
          <td width="111" style="text-align: center;">{{e_pre}}</td>
          <td width="111" style="text-align: center;">{{e_last}}</td>
          <td width="68" style="text-align: center;"></td>
          <td width="83" style="text-align: center;">{{e_use}}</td>
          <td width="63" style="text-align: center;">{{e_price}}</td>
          <td width="113" style="text-align: center;">{{e_total}}</td>
        </tr>

        <tr height="26">
          <td width="45" style="text-align: center;"></td>
          <td width="83" style="text-align: center;"></td>
          <td width="111" style="text-align: center;"></td>
          <td width="111" style="text-align: center;"></td>
          <td width="68" style="text-align: center;"></td>
          <td width="83" style="text-align: center;"></td>
          <td width="63" style="text-align: center;"></td>
          <td width="113" style="text-align: center;">{{ad_total}}</td>
        </tr>

        <tr height="26">
          <td width="45" style="text-align: center;"></td>
          <td width="83" style="text-align: center;"></td>
          <td width="111" style="text-align: center;"></td>
          <td width="111" style="text-align: center;"></td>
          <td width="68" style="text-align: center;"></td>
          <td width="83" style="text-align: center;"></td>
          <td width="63" style="text-align: center;"></td>
          <td width="113" style="text-align: center;"></td>
        </tr>

        <tr height="26">
          <td width="45" style="text-align: center;"></td>
          <td width="83" style="text-align: center;"></td>
          <td width="111" style="text-align: center;"></td>
          <td width="111" style="text-align: center;"></td>
          <td width="68" style="text-align: center;"></td>
          <td width="83" style="text-align: center;"></td>
          <td width="63" style="text-align: center;"></td>
          <td width="113" style="text-align: center;"></td>
        </tr>

        <tr height="34">
          <td colspan="8" style="padding-left: 96px">{{total_charge}}</td>
        </tr>

      </table>
    </div>
    {{/list}}
    `
  },
  'company-count-charge': {
    name: 'company-count-charge',
    template: `<div style="padding-top: 40px;">
        <table border="0" width="90%" style="border-collapse:collapse;">
            <tr>
                <td style="font-size: 22px;text-align: center">
                    {{user_name}}水电费计费表
                </td>
            </tr>
            <tr height="30">
                <td style="font-size: 13px;text-align: right">
                    抄表日期: {{record_date}}
                </td>
            </tr>
        </table>
        <table border="1" width="90%" style="border-collapse:collapse">
          <tr height="30" style="text-align: center">
            <td width="11%">顺序</td>
            <td width="11%">房号</td>
            <td width="11%">项目</td>
            <td width="11%">上月数</td>
            <td width="11%">本月数</td>
            <td width="11%">实用数</td>
            <td width="11%">单价</td>
            <td width="11%">金额</td>
            <td width="11%">合计</td>
          </tr>
          {{#list}}
            <tr height="30" style="text-align: center">
              <td rowspan="4">{{index}}</td>
              <td rowspan="4">{{room_name}}</td>
              <td>水费</td>
              <td>{{w_pre}}</td>
              <td>{{w_last}}</td>
              <td>{{w_use}}</td>
              <td>{{w_price}}</td>
              <td>{{w_total}}</td>
              <td rowspan="4">{{total}}</td>
            </tr>
            <tr height="30" style="text-align: center">
              <td>排水费</td>
              <td></td>
              <td></td>
              <td>{{w_use}}</td>
              <td>{{s_price}}</td>
              <td>{{s_total}}</td>
            </tr>
            <tr height="30" style="text-align: center">
              <td>垃圾处理费</td>
              <td></td>
              <td></td>
              <td>{{w_use}}</td>
              <td>{{g_price}}</td>
              <td>{{g_total}}</td>
            </tr>
            <tr height="30" style="text-align: center">
              <td>电费</td>
              <td>{{e_pre}}</td>
              <td>{{e_last}}</td>
              <td>{{e_use}}</td>
              <td>{{e_price}}</td>
              <td>{{e_total}}</td>
            </tr>
          {{/list}}
        </table>

        <table border="0" width="90%" style="border-collapse:collapse;margin-top: 60px">
            <tr>
                <td style="font-size: 22px;text-align: center">
                    {{user_name}}水电费汇总表
                </td>
            </tr>
            <tr height="30">
                <td style="font-size: 13px;text-align: right">
                    抄表日期: {{record_date}}
                </td>
            </tr>
        </table>
        <table border="1" width="90%" style="border-collapse:collapse">
          <tr height="30" style="text-align: center">
            <td width="25%">项目</td>
            <td width="25%">实用数</td>
            <td width="25%">单价</td>
            <td width="25%">金额</td>
          </tr>
          <tr height="30" style="text-align: center">
            <td>水费</td>
            <td>{{w_use}}</td>
            <td>{{w_price}}</td>
            <td>{{w_total}}</td>
          </tr>
          <tr height="30" style="text-align: center">
            <td>排水费</td>
            <td>{{w_use}}</td>
            <td>{{s_price}}</td>
            <td>{{s_total}}</td>
          </tr>
          <tr height="30" style="text-align: center">
            <td>垃圾处理费</td>
            <td>{{w_use}}</td>
            <td>{{g_price}}</td>
            <td>{{g_total}}</td>
          </tr>
          <tr height="30" style="text-align: center">
            <td>电费</td>
            <td>{{e_use}}</td>
            <td>{{e_price}}</td>
            <td>{{e_total}}</td>
          </tr>
          <tr height="30" style="text-align: center">
            <td>合计</td>
            <td></td>
            <td></td>
            <td>{{total}}</td>
          </tr>
        </table>
        </div>
    `
  },
  'person-notice-charge0': {
    name: 'person-notice-charge0',
    template: `
    {{#notice}}
      <table border="0" width="100%" cellspacing="0"  style="border-collapse:collapse">
          <tr>
            {{#list}}
              <td colspan="8" style="width: 50%">
                <div style="text-align: center;margin: 12px;font-size: 22px; font-weight: bold;">
                  通知单
                </div>
                <div style="padding-left: 4%">
                  用户:  {{user_name}}
                </div>
                <div style="padding-left: 4%;line-height: 1.5;margin-bottom: 4px;word-break: break-all;">
                  <span style="width: 16px;display: inline-block;"></span>
                  <span>
                  贵用户请在{{end_date}}，到{{location}}交{{charge_date}}份的水费、电费、卫生费及垃圾处理费等{{total_charge}}元，水表：上月行度：{{w_pre}}，本月行度：{{w_last}}，实用数：{{w_use}}; 电表：上月行度：{{e_pre}}，本月行度：{{e_last}}，实用数：{{e_use}}，请务必在指定日期内交完，否则我公司将采取相应措施，凭通知单收费。
                  </span>
                </div>
                <div style="padding-left: 4%">
                  <span style="width: 16px;display: inline-block;"></span>
                  多谢合作!
                </div>
                <div style="text-align: right; margin-right: 16px;margin-bottom: 6px;">
                  南 园 村 水 电 组
                </div>
                <div style="text-align: right; margin-right: 16px">
                  {{notice_date}}
                </div>
              </td>
            {{/list}}
          </tr>
      </table>
    {{/notice}}
    `
  },
  'person-notice-charge': {
    name: 'person-notice-charge',
    template: `
    {{#notice}}
      <div style="float: left;width: 50%;margin-top: 45px;height: 480px">
        <div style="text-align: center;margin: 12px;font-size: 22px; font-weight: bold;">
          通知单
        </div>
        <div style="padding-left: 4%">
          用户:  {{user_name}}
        </div>
        <div style="padding-left: 4%;line-height: 1.5;margin-bottom: 4px;word-break: break-all;">
          <span style="width: 16px;display: inline-block;"></span>
          <span>
          贵用户请在{{end_date}}，到{{location}}交{{charge_date}}份的水费、电费、卫生费及垃圾处理费等{{total_charge}}元，水表：上月行度：{{w_pre}}，本月行度：{{w_last}}，实用数：{{w_use}}; 电表：上月行度：{{e_pre}}，本月行度：{{e_last}}，实用数：{{e_use}}，请务必在指定日期内交完，否则我公司将采取相应措施，凭通知单收费。
          </span>
        </div>
        <div style="padding-left: 4%">
          <span style="width: 16px;display: inline-block;"></span>
          多谢合作!
        </div>
        <div style="text-align: right; margin-right: 16px;margin-bottom: 6px;">
          南 园 村 水 电 组
        </div>
        <div style="text-align: right; margin-right: 16px">
          {{notice_date}}
        </div>
      </div>
    {{/notice}}
    `
  },
  'company-notice-charge': {
    name: 'person-notice-charge',
    template: `
    {{#notice}}
      <div style="float: left;width: 50%;margin-top: 45px;height: 480px">
        <div style="text-align: center;margin: 12px;font-size: 22px; font-weight: bold;">
          通知单
        </div>
        <div style="padding-left: 4%">
          用户:  {{user_name}}
        </div>
        <div style="padding-left: 4%;line-height: 1.5;margin-bottom: 4px;word-break: break-all;">
          <span style="width: 16px;display: inline-block;"></span>
          <span>
          贵用户{{charge_date}}份水费、电费、卫生管理费及垃圾处理费等{{total_charge}}元，请于{{end_date}}前把欠费交清，逾期缴费者将按应交总额每天增收滞纳金0.5%计算并采取相应的措施。
          </span>
        </div>
        <div style="padding-left: 4%;margin-bottom: 6px;">
          <span style="width: 54px;text-align-last: justify;display: inline-block">开户行</span>: {{BankName}}
        </div>
        <div style="padding-left: 4%;margin-bottom: 6px;">
          <span style="width: 54px;text-align-last: justify;display: inline-block">名称</span>: {{AccountName}}
        </div>
        <div style="padding-left: 4%;margin-bottom: 6px;">
          <span style="width: 54px;text-align-last: justify;display: inline-block">账号</span>: {{AccountNumber}}
        </div>
        <div style="text-align: right; margin-right: 16px;margin-bottom: 6px;">
          南 园 村 水 电 组
        </div>
        <div style="text-align: right; margin-right: 16px">
          {{notice_date}}
        </div>
      </div>
    {{/notice}}
    `
  }
}
export let getHtml = (type, row) => {
  let {
    [type]: {
      template = ''
    } = {}
  } = tplMap
  return mustache.render(template, row)
}

// let xx = getHtml ('person-notice-charge', {
//   "notice": [
//     {
//       list: [
//         { "user_name": "John", "lastName": "Lennon" },
//         { "user_name": "Paul", "lastName": "McCartney" }
//       ]
//     }
//   ]
// })
// console.log('xxxtemp', xx)

export let printShouJu = (row, type = 'print') => {
  let {
    shouju: {
      name = '',
      template = ''
    } = {}
  } = tplMap
  let rows = [].concat(row)
  let LODOP = window.getLodop()
  LODOP.PRINT_INIT(name)
  rows.forEach((e)=>{
    let html = mustache.render(template, {list: [e]})
     console.log('xxxtemp', html)
    // 设置纸张高度
    // LODOP.SET_PRINT_STYLE("FontSize", 16)
    // LODOP.SET_PRINT_STYLE("Bold", 1)
    let strCenterStyle = '<!DOCTYPE html><body><style/>table {margin: 0 auto}</style>'
    LODOP.SET_PRINT_PAGESIZE(1, '209mm', '113mm', '')
    LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', strCenterStyle + html)
    LODOP.NEWPAGEA();
  })


  if (type === 'print') {
    LODOP.PRINT()
  } else if (type === 'preview') {
    LODOP.PREVIEW()
  } else {
    console.warn('unknown type', type)
  }
}

export let printCommonPage = (tplType, row, type = 'print') => {
  let {
    [tplType]: {
      name = '',
      template = ''
    } = {}
  } = tplMap
  let html = mustache.render(template, row)
  // console.log('xxxtemp', html)

  let LODOP = window.getLodop()
  LODOP.PRINT_INIT(name)
  let strCenterStyle = '<!DOCTYPE html><body><style/>table {margin: 0 auto}</style>'
  LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', strCenterStyle + html)

  if (type === 'print') {
    LODOP.PRINT()
  } else if (type === 'preview') {
    LODOP.PREVIEW()
  } else {
    console.warn('unknown type', type)
  }
}

let getFixUserName = (row) => {
  let {
    ZoneName,
    RoomName,
    user_name
  } = row
  if (RoomName) {
    return `${user_name}(${ZoneName} ${RoomName})`
  }
  return `${user_name}(${ZoneName})`
}

function DX (n) {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
  return "";
  var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
  n += "00";
  var p = n.indexOf('.');
  if (p >= 0)
  n = n.substring(0, p) + n.substr(p+1, 2);
  unit = unit.substr(unit.length - n.length);
  for (var i=0; i < n.length; i++)
  str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
  return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g,"").replace(/元$/g, "元整");
}

//费用保留小数点
let savePoint = (num, n) => {
  let tmp_num = Math.pow(10, n)
  return Math.round(num * tmp_num) / tmp_num
}

let getFixTotalCharge = (row) => {
  let {
    total_charge: total
  } = row
  let x = DX(total)
  total = savePoint(total, 1)
  return `${x} ￥${total}`
}

let getItemInfo = (row, field, GradeIndex) => {
  let {
    list = []
  } = _.get(row, field) || {}
  let one = list.find(item => item.GradeIndex === GradeIndex) || {}
  return one
}

export let getFixPersonNoticeRow = (row) => {
  let _row = {
    user_name: getFixUserName(row),
    end_date: row.end_date,
    location: row.location,
    charge_date: row.charge_date,
    total_charge: row.total_charge,
    notice_date: row.notice_date,
    BankName: row.BankName,
    AccountName: row.AccountName,
    AccountNumber: row.AccountNumber,
    w_pre: _.get(row, 'waterInfo.pre'),
    w_last: _.get(row, 'waterInfo.last'),
    w_use: _.get(row, 'waterInfo.last', 0) - _.get(row, 'waterInfo.pre', 0),
    e_pre: _.get(row, 'electricityInfo.pre'),
    e_last: _.get(row, 'electricityInfo.last'),
    e_use: _.get(row, 'electricityInfo.last', 0) - _.get(row, 'electricityInfo.pre', 0)
  }
  for (let key in _row) {
    let item = _row[key]
    if (typeof item === 'undefined') {
      _row[key] = ''
    }
  }
  return _row
}

export let getFixShoujuRow = (row) => {
  let shouju = {
    pay_date: format(new Date(row.pay_date), 'yyyy年MM月dd日'),
    user_name: getFixUserName(row),
    charge_date: _.get(row, 'charge_date'),
    w_pre: _.get(row, 'waterInfo.pre'),
    w_last: _.get(row, 'waterInfo.last'),
    w_g1_use: getItemInfo(row, 'waterInfo', 1).UseNumber,
    w_g1_price: getItemInfo(row, 'waterInfo', 1).Water_UnitPrice,
    w_g1_total: getItemInfo(row, 'waterInfo', 1).Water_Charge,
    w_g2_use: getItemInfo(row, 'waterInfo', 2).UseNumber,
    w_g2_price: getItemInfo(row, 'waterInfo', 2).Water_UnitPrice,
    w_g2_total: getItemInfo(row, 'waterInfo', 2).Water_Charge,
    w_g3_use: getItemInfo(row, 'waterInfo', 3).UseNumber,
    w_g3_price: getItemInfo(row, 'waterInfo', 3).Water_UnitPrice,
    w_g3_total: getItemInfo(row, 'waterInfo', 3).Water_Charge,
    s_g1_use: getItemInfo(row, 'waterInfo', 1).UseNumber,
    s_g1_price: getItemInfo(row, 'waterInfo', 1).Sewage_UnitPrice,
    s_g1_total: getItemInfo(row, 'waterInfo', 1).Sewage_Charge,
    s_g2_use: getItemInfo(row, 'waterInfo', 2).UseNumber,
    s_g2_price: getItemInfo(row, 'waterInfo', 2).Sewage_UnitPrice,
    s_g2_total: getItemInfo(row, 'waterInfo', 2).Sewage_Charge,
    s_g3_use: getItemInfo(row, 'waterInfo', 3).UseNumber,
    s_g3_price: getItemInfo(row, 'waterInfo', 3).Sewage_UnitPrice,
    s_g3_total: getItemInfo(row, 'waterInfo', 3).Sewage_Charge,
    g_g1_use: getItemInfo(row, 'garbageInfo', 1).UsedNumber,
    g_g1_price: getItemInfo(row, 'garbageInfo', 1).UnitPrice,
    g_g1_total: getItemInfo(row, 'garbageInfo', 1).Charge,
    g_g2_use: getItemInfo(row, 'garbageInfo', 2).UsedNumber,
    g_g2_price: getItemInfo(row, 'garbageInfo', 2).UnitPrice,
    g_g2_total: getItemInfo(row, 'garbageInfo', 2).Charge,
    e_pre: _.get(row, 'electricityInfo.pre'),
    e_last: _.get(row, 'electricityInfo.last'),
    e_use: _.get(row, 'electricityInfo.last', 0) - _.get(row, 'electricityInfo.pre', 0),
    e_price: getItemInfo(row, 'electricityInfo', 1).Electricity_UnitPrice || getItemInfo(row, 'electricityInfo', 1).Equipment_UnitPrice,
    e_total: _.get(row, 'electricityInfo.total'),
    ad_total: _.get(row, 'addtionalfeeInfo.Charge'),
    total_charge: getFixTotalCharge(row)
  }
  for (let key in shouju) {
    let item = shouju[key]
    if (typeof item === 'undefined' || item === 0) {
      shouju[key] = ''
    }
  }
  return shouju
}

let getCountRowPrice = (row, key, priceKey) => {
  let one = _.get(row, key) || {}
  let {
    list = [],
    list: [
      first = {}
    ] = []
  } = one
  if (list.length === 1) {
    return first[priceKey]
  }
  return '*'
}

export let getFixCountRow = (row) => {
  let shouju = {
    index: row.index,
    user_name: _.get(row, 'user_name'),
    record_date: format(new Date(_.get(row, 'RecordDate')), 'yyyy年MM月'),
    room_name: _.get(row, 'RoomName'),
    w_pre: _.get(row, 'waterInfo.pre'),
    w_last: _.get(row, 'waterInfo.last'),
    w_use: _.get(row, 'waterInfo.last', 0) - _.get(row, 'waterInfo.pre', 0),
    w_price: getCountRowPrice(row, 'waterInfo', 'Water_UnitPrice'),
    w_total: _.get(row, 'waterInfo.water_charge'),
    s_price: getCountRowPrice(row, 'waterInfo', 'Sewage_UnitPrice'),
    s_total: _.get(row, 'waterInfo.sewage_charge'),
    g_price: getCountRowPrice(row, 'garbageInfo', 'UnitPrice'),
    g_total: _.get(row, 'garbageInfo.total'),

    e_pre: _.get(row, 'electricityInfo.pre'),
    e_last: _.get(row, 'electricityInfo.last'),
    e_use: _.get(row, 'electricityInfo.last', 0) - _.get(row, 'electricityInfo.pre', 0),
    e_price: getItemInfo(row, 'electricityInfo', 1).Electricity_UnitPrice || getItemInfo(row, 'electricityInfo', 1).Equipment_UnitPrice,
    e_total: _.get(row, 'electricityInfo.total'),

    total: _.get(row, 'total_charge')
  }
  for (let key in shouju) {
    let item = shouju[key]
    if (typeof item === 'undefined') {
      shouju[key] = ''
    }
  }
  return shouju
}
