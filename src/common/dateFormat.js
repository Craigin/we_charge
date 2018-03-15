/**
 * 时间格式化 返回格式化的时间
 * @param date {object}  可选参数，要格式化的data对象，没有则为当前时间
 * @param fomat {string} 格式化字符串，例如：'YYYY年MM月DD日 hh时mm分ss秒 星期' 'YYYY/MM/DD week' (中文为星期，英文为week)
 * @return {string} 返回格式化的字符串
 *
 * 例子:
 * formatDate(new Date('january 01,2012'))
 * formatDate(new Date())
 * formatDate('YYYY年MM月DD日 hh时mm分ss秒 星期 YYYY-MM-DD week')
 * formatDate(new Date('january 01,2012'),'YYYY年MM月DD日 hh时mm分ss秒 星期 YYYY/MM/DD week')
 *
 * 格式：
 * YYYY：4位年,如1993
 * YY：2位年,如93
 * MM：月份
 * DD：日期
 * hh：小时
 * mm：分钟
 * ss：秒钟
 * 星期：星期，返回如 星期二
 * 周：返回如 周二
 * week：英文星期全称，返回如 Saturday
 * www：三位英文星期，返回如 Sat
 */
export function formatDate (date, format) {
  if (arguments.length < 2 && !date.getTime) {
    format = date
    date = new Date()
  }
  typeof format !== 'string' && (format = 'YYYY年MM月DD日 hh时mm分ss秒')
  let week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', '日', '一', '二', '三', '四', '五', '六']
  return format.replace(/YYYY|YY|MM|DD|hh|mm|ss|星期|周|www|week/g, function (a) {
    switch (a) {
      case 'YYYY': return date.getFullYear()
      case 'YY': return (date.getFullYear() + '').slice(2)
      case 'MM': return date.getMonth() + 1
      case 'DD': return date.getDate()
      case 'hh': return date.getHours()
      case 'mm': return date.getMinutes()
      case 'ss': return date.getSeconds()
      case '星期': return '星期' + week[date.getDay() + 7]
      case '周': return '周' + week[date.getDay() + 7]
      case 'week': return week[date.getDay()]
      case 'www': return week[date.getDay()].slice(0, 3)
    }
  })
}

export function isToday (str) {
  let date = new Date()
  let y = date.getFullYear() //  2014
  let m = date.getMonth() + 1 //  7,月份从0开始的，注意
  let d = date.getDate() //  9
  let dateStr = y + '-' + m + '-' + d
  str = str.split('-').map(item => parseInt(item)).join('-')
  return str === dateStr
}

// console.log(date.Format("yyyy年MM月dd日 hh:mm:ss.S")); //输出: 2016年04月01日 10:41:08.133
// console.log(date.Format("yyyy-MM-dd hh:mm:ss")); //输出: 2016-04-01 10:41:08
// console.log(date.Format("yy-MM-dd hh:mm:ss")); //输出: 16-04-01 10:41:08
// console.log(date.Format("yy-M-d hh:mm:ss")); //输出: 16-4-1 10:41:08
export function format (date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!date) return
  var o = {
    'y+': date.getFullYear(),
    'M+': date.getMonth() + 1,                 // 月份
    'd+': date.getDate(),                    // 日
    'h+': date.getHours(),                   // 小时
    'm+': date.getMinutes(),                 // 分
    's+': date.getSeconds(),                 // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S+': date.getMilliseconds()             // 毫秒
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      if (k === 'y+') {
        fmt = fmt.replace(RegExp.$1, ('' + o[k]).substr(4 - RegExp.$1.length))
      } else if (k === 'S+') {
        var lens = RegExp.$1.length
        lens = lens === 1 ? 3 : lens
        fmt = fmt.replace(RegExp.$1, ('00' + o[k]).substr(('' + o[k]).length - 1, lens))
      } else {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
  }
  return fmt
}

// 20170417 -> 2017-04-17
export function timeStrFormat (time) {
  let year = time.substring(0, 4)
  let mon = time.substring(4, 6)
  let date = time.substring(6, 8)
  return `${year}-${mon}-${date}`
}

// 处理时区问题  2017-05-12->2017-05-11T16:00:00
export function fixTimeZoneDay (start, end) {
  let _start = new Date(start)
  let preDay = format(new Date(_start.getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  preDay += 'T16:00:00'
  end += 'T16:00:00'
  return [preDay, end]
}
// 获取最近一周
export function getCurrentWeek () {
  let today = new Date()
  let weekDay = format(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  today = format(today, 'yyyy-MM-dd')
  return [weekDay, today]
}
// 获取某一天的后一天
export function getAfterDay (day) {
  let today = new Date(day)
  let afterDay = format(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), 'yyyyMMdd')
  return afterDay
}
