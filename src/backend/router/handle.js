/**
 * Created by paki on 2018/1/15.
 */
import URL from 'url'
import axios from 'axios'
import {CODE} from 'common/config'
import dateformat from 'dateformat'
import bodyParser from 'co-body'
import mongodb from 'mongodb'
import xn from '../config'
import api from 'api'
import {mysql,getTable, getCollection} from 'db'
import * as commonUtils from 'common/utils'
import { DB_WECHARGE_NAME } from './dataTables/common'
import Sequelize from 'sequelize'

let table_roomrecordforuser = getTable(DB_WECHARGE_NAME, "roomrecordforuser")
let table_roomwatercharge = getTable(DB_WECHARGE_NAME, "roomwatercharge")
let table_roomelectricitycharge = getTable(DB_WECHARGE_NAME, "roomelectricitycharge")
let table_roomgarbagecharge = getTable(DB_WECHARGE_NAME, "roomgarbagecharge")
let table_garbagechargeclass = getTable(DB_WECHARGE_NAME, "garbagechargeclass")
let table_watermeterrecord = getTable(DB_WECHARGE_NAME, "watermeterrecord")
let table_electricitymeterrecord = getTable(DB_WECHARGE_NAME, "electricitymeterrecord")
let table_room = getTable(DB_WECHARGE_NAME, "room")
let table_companyhireroom = getTable(DB_WECHARGE_NAME, "companyhireroom")
let table_addtionalfeeforroom = getTable(DB_WECHARGE_NAME, "addtionalfeeforroom")
let table_addtionalfeeforcompany = getTable(DB_WECHARGE_NAME, "addtionalfeeforcompany")
//费用保留小数点
let savePoint = (num, n) => {
  let tmp_num = Math.pow(10, n)
  return Math.round(num * tmp_num) / tmp_num
}
//计算某月某房间缴费
let checkCharge = async (ZoneName, RoomName, RecordDate) => {
    let where = { ZoneName: ZoneName, RoomName: RoomName, RecordDate: RecordDate }
    console.log('============checkCharge params:', where)
    let record = await table_roomrecordforuser.findOne({where: where, raw: true})
    if (record) {
      let roomwatercharge = await table_roomwatercharge.findAll({where: where, raw: true}) || {}
      let roomelectricitycharge = await table_roomelectricitycharge.findAll({where: where, raw: true}) || {}
      let roomgarbagecharge = await table_roomgarbagecharge.findAll({where: where, raw: true}) || {}
      let waterMeterInfo = await table_watermeterrecord.findOne({where: where, raw: true}) || {}
      let electricityMeterInfo = await table_electricitymeterrecord.findOne({where: where, raw: true}) || {}
      let addtionalFeeInfo = await table_addtionalfeeforroom.findOne({where: where, raw: true}) || {}
      let total_charge = 0
      let water_charge = 0
      let sewage_charge = 0
      let water_charge_total = 0
      let electricity_charge = 0
      let equipment_charge = 0
      let electricity_charge_total = 0
      let garbage_charge_total = 0
      if (roomwatercharge.length) {
        roomwatercharge.forEach(function (e, i) {
          water_charge += e.Water_Charge
          sewage_charge += e.Sewage_Charge
          if (e.GradeIndex === 1) {
            roomwatercharge[i].pre = waterMeterInfo.PreviousNumber
            roomwatercharge[i].last = waterMeterInfo.LastNumber
            roomwatercharge[i].name = '正常'
          } else if (e.GradeIndex === 2) {
            roomwatercharge[i].name = '超标：1'
          } else if (e.GradeIndex === 3) {
            roomwatercharge[i].name = '超标：2'
          }
        })
      }
      if (roomelectricitycharge.length) {
        roomelectricitycharge.forEach(function (e, i) {
          electricity_charge += e.Electricity_Charge
          equipment_charge += e.Equipment_Charge
          if (roomwatercharge.length > i) {
            if (e.GradeIndex === 1) {
              // console.log('==============roomwatercharge2:', roomwatercharge)
              roomelectricitycharge[i].pre = electricityMeterInfo.PreviousNumber
              roomelectricitycharge[i].last = electricityMeterInfo.LastNumber
              roomelectricitycharge[i].name = '正常'
            } else if (e.GradeIndex === 2) {
              roomelectricitycharge[i].name = '超标：1'
            } else if (e.GradeIndex === 3) {
              roomelectricitycharge[i].name = '超标：2'
            }
          }
        })
      }
      if (roomgarbagecharge) {
        roomgarbagecharge.forEach(function (e) {
          garbage_charge_total += e.Charge
        })
      }
      water_charge_total = water_charge + sewage_charge
      electricity_charge_total = electricity_charge + equipment_charge
      total_charge = water_charge_total + electricity_charge_total + garbage_charge_total + (addtionalFeeInfo.Charge || 0)
      console.log('======total_charge', water_charge_total, electricity_charge_total, garbage_charge_total, addtionalFeeInfo, total_charge)
      let message = {
        waterInfo: {
          pre: waterMeterInfo.PreviousNumber,
          last: waterMeterInfo.LastNumber,
          total: savePoint(water_charge, 2) + savePoint(sewage_charge, 2),
          water_charge: savePoint(water_charge, 2),
          sewage_charge: savePoint(sewage_charge, 2),
          list: roomwatercharge
        },
        electricityInfo: {
          pre: electricityMeterInfo.PreviousNumber,
          last: electricityMeterInfo.LastNumber,
          total: savePoint(electricity_charge, 2) + savePoint(equipment_charge, 2),
          electricity_charge: savePoint(electricity_charge, 2),
          equipment_charge: savePoint(equipment_charge, 2),
          list: roomelectricitycharge
        },
        garbageInfo: {
          pre: waterMeterInfo.PreviousNumber,
          last: waterMeterInfo.LastNumber,
          total: savePoint(garbage_charge_total, 2),
          garbage_charge: savePoint(garbage_charge_total, 2),
          list: roomgarbagecharge
        },
        addtionalfeeInfo: addtionalFeeInfo,
        total_charge: savePoint(total_charge, 2),
        room_class: record.RoomClass,
        user_name: record.UserName || null,
        pay_status: record.PayStatus || 0,
        pay_date: record.PayDate || null,
        pay_note: record.PayNotes || null,
        id: record.id
      }
      // let message = {
      //   watercharge: roomwatercharge,
      //   electricitycharge: roomelectricitycharge,
      //   garbagecharge: roomgarbagecharge,
      //   water_charge:savePoint(water_charge, 2),
      //   sewage_charge: savePoint(sewage_charge, 2),
      //   water_charge_total: savePoint(water_charge_total, 2),
      //   electricity_charge: savePoint(electricity_charge, 2),
      //   equipment_charge: savePoint(equipment_charge, 2),
      //   electricity_charge_total: savePoint(electricity_charge_total, 2),
      //   garbage_charge_total: savePoint(garbage_charge_total, 2),
      //   total_charge:savePoint(total_charge, 2),
      //   user_name: record.UserName || null,
      //   pay_status: record.PayStatus || 0,
      //   pay_date: record.PayDate || null,
      //   pay_note: record.PayNotes || null
      // }
      Object.assign(message, where)
      return new Promise((resolve, reject) => {
        resolve({code: CODE.SUCCESS, data: message})
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve({code: CODE.FAIL, msg: "record not exit"})
      })
    }
}
//获取公司当月计费
let getCompanyChargeByMonth = async (CompanyName, RecordDate) => {
  // let rooms = await table_companyhireroom.findAll({where: {CompanyName: CompanyName}, raw: true})
  let rooms = await table_roomrecordforuser.findAll({
    where: {
      UserName: CompanyName,
      RoomClass: 1,
      RecordDate: RecordDate
    },
    raw: true
  })
  let addtionalfeeInfo = await table_addtionalfeeforcompany.findOne({
    where: {
      CompanyName: CompanyName,
      RecordDate: RecordDate
    },
    raw: true
  })
  if (rooms.length) {
    let task = []
    rooms.forEach((e) => {
      task.push(checkCharge(e.ZoneName, e.RoomName, RecordDate))
    })
    return await Promise.all(task).then((result) => {
      console.log('=========result:', JSON.stringify(result))
      if (result.length) {
        let total_charge = 0
        let water_charge = 0
        let sewage_charge = 0
        let water_charge_total = 0
        let electricity_charge = 0
        let equipment_charge = 0
        let electricity_charge_total = 0
        let garbage_charge_total = 0
        let water_pre = 0
        let water_last = 0
        let electricity_pre = 0
        let electricity_last = 0
        let list = []
        result.forEach((e) => {
          if (e.code === CODE.SUCCESS) {
            list.push(e.data)
            if (e.data.waterInfo) {
              water_pre += e.data.waterInfo.pre || 0
              water_last += e.data.waterInfo.last || 0
              console.log('==============water:', water_pre, water_last)
              water_charge += e.data.waterInfo.water_charge
              sewage_charge += e.data.waterInfo.sewage_charge
              water_charge_total += e.data.waterInfo.total
            }
            if (e.data.electricityInfo) {
              electricity_pre += e.data.electricityInfo.pre || 0
              electricity_last += e.data.electricityInfo.last || 0
              electricity_charge += e.data.electricityInfo.electricity_charge
              equipment_charge += e.data.electricityInfo.equipment_charge
              electricity_charge_total += e.data.electricityInfo.total
            }
            if (e.data.garbageInfo && e.data.garbageInfo.total) {
              garbage_charge_total += e.data.garbageInfo.total
            }
          }
        })
        total_charge = savePoint(water_charge_total + electricity_charge_total + garbage_charge_total + (addtionalfeeInfo ? addtionalfeeInfo.Charge : 0),2)
        return {
          waterInfo: {
            pre: water_pre,
            last: water_last,
            total: savePoint(water_charge_total, 2),
            water_charge: savePoint(water_charge, 2),
            sewage_charge: savePoint(sewage_charge, 2)
          },
          electricityInfo: {
            pre: electricity_pre,
            last: electricity_last,
            total: savePoint(electricity_charge_total, 2),
            electricity_charge: savePoint(electricity_charge, 2),
            equipment_charge: savePoint(equipment_charge, 2)
          },
          garbageInfo: {
            pre: water_pre,
            last: water_last,
            total: savePoint(garbage_charge_total, 2),
            garbage_charge: savePoint(garbage_charge_total,2)
          },
          addtionalfeeInfo,
          total_charge,
          user_name: CompanyName || null,
          company_name: CompanyName || null,
          pay_status: rooms[0].PayStatus || 0,
          pay_date: rooms[0].PayDate || null,
          pay_note: rooms[0].PayNotes || null,
          RecordDate:RecordDate,
          list
        }
        // return Promise.resolve({
        //   code: CODE.SUCCESS,
        //   totalcharge: totalcharge,
        //   water_totalcharge: water_totalcharge,
        //   electricity_totalcharge: electricity_totalcharge,
        //   garbage_totalcharge: garbage_totalcharge
        // })
      }
    })
  }
}
//创建垃圾月收费记录
let garbage_change = async (ZoneName, RoomName, RecordDate, UsedNumber) => {
  let where = {
    ZoneName: ZoneName,
    RoomName: RoomName,
    RecordDate: RecordDate
  }
  let garbagecharge = await table_roomgarbagecharge.findOne({where: where, raw: true})
  if (garbagecharge) {
    let Charge = UsedNumber * garbagecharge.UnitPrice
    let ret = await table_roomgarbagecharge.update({
      UsedNumber: UsedNumber,
      Charge: Charge,
      RecordDate: where.RecordDate
    }, {where: where})
    return new Promise((resolve, reject) => {
      resolve({
        code: CODE.SUCCESS,
        data: ret
      })
    })
  } else {
    let room_info = await table_room.findOne({where: {ZoneName: where.ZoneName, RoomName: where.RoomName}, raw: true})
    if (room_info) {
      let table_waterchargerule = getTable(DB_WECHARGE_NAME, 'waterchargerule')
      let class_info = await table_garbagechargeclass.findOne({
        where: {ClassName: room_info.GarbageChargeClass},
        raw: true
      })
      // let gradeindex_info = await table_waterchargerule.findOne({
      //   where: {ClassName: room_info.GarbageChargeClass},
      //   raw: true
      // })
      let roomcharge_obj = {
        UsedNumber: UsedNumber,
        GradeIndex: 1,
        CalcType: class_info.CalcType,
        UnitPrice: class_info.PriceByUnitWater,
        Charge: UsedNumber * class_info.PriceByUnitWater
      }
      Object.assign(roomcharge_obj, where)
      console.log('============roomcharge_obj:', roomcharge_obj)
      let ret = await table_roomgarbagecharge.create(roomcharge_obj)
      return new Promise((resolve, reject) => {
        resolve({
          code: CODE.SUCCESS,
          data: ret
        })
      })
    }
  }
}
//保存roomcharge数据，有则修改，没有则创建
let saveCharge = async (tablename, obj) => {
  console.log('===============run in saveCharge')
  let table_save = getTable(DB_WECHARGE_NAME, tablename)
  let where = {ZoneName: obj.ZoneName, RoomName: obj.RoomName, RecordDate: obj.RecordDate, GradeIndex: obj.GradeIndex}
  let roomcharge_info = await table_save.findOne({where: where, raw: true})
  let ret
  if (roomcharge_info) {
    ret = await table_save.update({ UseNumber: obj.UseNumber, Water_Charge: obj.Water_Charge, Sewage_Charge: obj.Sewage_Charge, RecordDate: obj.RecordDate }, {where: where})
    console.log('=========update ret:', ret)
  } else {
    ret = await table_save.create(obj)
    console.log('=========create ret:', ret)
  }
  return new Promise((resolve, reject) => {
    resolve(ret)
  })
}
//检查月份缴费记录是否存在
let checkUserRecord = async (room_obj) => {
  let where = {ZoneName: room_obj.ZoneName, RoomName: room_obj.RoomName, RecordDate: room_obj.RecordDate}
  let record = await table_roomrecordforuser.findOne({where: where, raw: true})
  if (!record) {
    let ret = await table_roomrecordforuser.create(room_obj)
  }
  return new Promise((resolve, reject) => {
    resolve({code: CODE.SUCCESS})
  })
}
//检查附加费是否存在，没有则生成
let checkAddtionalFee = async (room_info) => {
  let table_fee
  let where = {}
  if (room_info.RoomClass === 0) {
    where.ZoneName = room_info.ZoneName
    where.RoomName = room_info.RoomName
    table_fee = getTable(DB_WECHARGE_NAME, 'addtionalfeeforroom')
  } else {
    table_fee = getTable(DB_WECHARGE_NAME, 'addtionalfeeforcompany')
  }
  let fee_info = await table_fee.findOne({where: where, raw: true, order: "RecordDate DESC"})
  if (fee_info && fee_info.RecordDate != room_info.RecordDate) {
    //查询是否可复制
    let table_sys = getTable(DB_WECHARGE_NAME, "sys_dictionary")
    let sys_info = await table_sys.findOne({ItemName: fee_info.ItemName, raw:true})
    if(sys_info.NeedCopyFromPreMonth === 1){
      let params = {
        RecordDate: room_info.RecordDate,
        ItemClass: fee_info.ItemClass,
        ItemName: fee_info.ItemName,
        Charge: fee_info.Charge
      }
      await table_fee.create(params)
    }
  }
}
export default function (router) {
  router.get('/test', async function (ctx) {
    let ret = await checkCharge('欣荔苑', '5-703', '2017-12-01 00:00:00')
    ctx.body = ret
  })
  router.post('/countCharge', async function (ctx) {
    let body = ctx.request.body
    console.log('=======body:', body)
    let switch_obj = {
      water: {
        meterrecord: "watermeterrecord",
        roomcharge: "roomwatercharge",
        chargeclass: "waterchargeclass",
        chargerule: "waterchargerule",
        ChargeClass: "WaterChargeClass"
      },
      electricity: {
        meterrecord: "electricitymeterrecord",
        roomcharge: "roomelectricitycharge",
        chargeclass: "electricitychargeclass",
        chargerule: "electricitychargerule",
        ChargeClass: "ElectricityChargeClass"
      }
    }
    if (!switch_obj[body.type]) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `type not right`
      }
    }
    let months = body.months ? parseInt(body.months) : 1
    let where = {ZoneName: body.ZoneName, RoomName: body.RoomName, RecordDate: body.RecordDate}
    let table_record = getTable(DB_WECHARGE_NAME, switch_obj[body.type].meterrecord)
    let table_charge = getTable(DB_WECHARGE_NAME, switch_obj[body.type].roomcharge)
    let meterrecords = await table_record.findAll({where: where, raw: true})
    if (meterrecords.length) {
      console.log('===========meterrecords:', meterrecords)
      let charge_info = await table_charge.findOne({where: where, raw: true})
      let use_number_total = 0
      console.log('==========charge_info:', charge_info)
      let room_info = await table_room.findOne({where: {ZoneName: body.ZoneName, RoomName: body.RoomName}, raw: true})
      if (room_info) {
        let chargeclass = room_info[switch_obj[body.type].ChargeClass]
        let table_chargeclass = getTable(DB_WECHARGE_NAME, switch_obj[body.type].chargeclass)
        let table_chargerule = getTable(DB_WECHARGE_NAME, switch_obj[body.type].chargerule)
        let rule_info = await table_chargerule.findAll({where: {ClassName: chargeclass}, raw: true})
        meterrecords.forEach(function (e) {
          use_number_total += e.UsedNumber * e.ExchangeRate
        })
        if (rule_info.length) {
          for (var i = 0; i < rule_info.length; i++) {
            let use_number
            if (use_number_total > rule_info[i].Over_Quantity * months) {
              use_number = (rule_info[i].Over_Quantity - rule_info[i].Start_Quantity) * months
            } else if (use_number_total > rule_info[i].Start_Quantity * months) {
              use_number = use_number_total - rule_info[i].Start_Quantity * months
            } else {
              continue
            }
            if (body.type == 'water') {
              let sewage_info = await table_chargeclass.findOne({where: {ClassName: chargeclass}, raw: true})
              console.log('=======params:', rule_info[i].Water_UnitPrice, rule_info[i].Sewage_UnitPrice, use_number, months, sewage_info.SewagePercent)
              let w_charge = rule_info[i].Water_UnitPrice * use_number
              let s_charge = rule_info[i].Sewage_UnitPrice * use_number * sewage_info.SewagePercent
              let roomcharge_obj = {
                UseNumber: use_number,
                GradeIndex: rule_info[i].GradeIndex,
                Water_UnitPrice: rule_info[i].Water_UnitPrice,
                Sewage_UnitPrice: rule_info[i].Sewage_UnitPrice,
                SewagePercent: sewage_info.SewagePercent,
                Water_Charge: w_charge,
                Sewage_Charge: s_charge
              }
              Object.assign(roomcharge_obj, where)
              console.log('============roomcharge_obj water:', roomcharge_obj)
              let ret = await saveCharge(switch_obj[body.type].roomcharge, roomcharge_obj)
            } else {
              let Electricity_Charge = rule_info[i].Electricity_UnitPrice * use_number
              let Equipment_Charge = rule_info[i].Equipment_UnitPrice * use_number
              let roomcharge_obj = {
                UseNumber: use_number,
                GradeIndex: rule_info[i].GradeIndex,
                Electricity_UnitPrice: rule_info[i].Electricity_UnitPrice,
                Equipment_UnitPrice: rule_info[i].Equipment_UnitPrice,
                Electricity_Charge: Electricity_Charge,
                Equipment_Charge: Equipment_Charge
              }
              Object.assign(roomcharge_obj, where)
              console.log('============roomcharge_obj elec:', roomcharge_obj)
              let ret = await saveCharge(switch_obj[body.type].roomcharge, roomcharge_obj)
            }
          }
        }
        ctx.body = {
          code: CODE.SUCCESS
          // data: ret
        }
        if (body.type == 'water') {
          //更新garbage
          await garbage_change(where.ZoneName, where.RoomName, where.RecordDate, use_number_total)
        }
        //检查月份缴费记录是否存在
        delete room_info.id
        room_info.RecordDate = where.RecordDate
        await checkUserRecord(room_info)
        //检查附加费是否存在，没有则生成
        await checkAddtionalFee(room_info)
      } else {
        ctx.body = {
          code: CODE.FAIL,
          msg: "room not exit"
        }
      }
    }
  })
  router.post('/countCharge_old', async function (ctx) {
    let body = ctx.request.body
    console.log('=======body:', body)
    let switch_obj = {
      water: {
        meterrecord: "watermeterrecord",
        roomcharge: "roomwatercharge",
        chargeclass: "waterchargeclass",
        chargerule: "waterchargerule",
        ChargeClass: "WaterChargeClass"
      },
      electricity: {
        meterrecord: "electricitymeterrecord",
        roomcharge: "roomelectricitycharge",
        chargeclass: "electricitychargeclass",
        chargerule: "electricitychargerule",
        ChargeClass: "ElectricityChargeClass"
      }
    }
    if (!switch_obj[body.type]) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `type not right`
      }
    }
    let months = body.months || 1
    let where = {ZoneName: body.ZoneName, RoomName: body.RoomName, RecordDate: body.RecordDate}
    let table_record = getTable(DB_WECHARGE_NAME, switch_obj[body.type].meterrecord)
    let table_charge = getTable(DB_WECHARGE_NAME, switch_obj[body.type].roomcharge)
    let meterrecords = await table_record.findAll({where: where, raw: true})
    if (meterrecords.length) {
      console.log('===========meterrecords:', meterrecords)
      let charge_info = await table_charge.findOne({where: where, raw: true})
      let use_number = 0
      console.log('==========charge_info:', charge_info)
      if (charge_info) {
        meterrecords.forEach(function (e) {
          use_number += e.UsedNumber
        })
        let w_charge = charge_info.Water_UnitPrice * use_number
        let s_charge = charge_info.Sewage_UnitPrice * use_number * charge_info.SewagePercent
        console.log('========count:', w_charge, s_charge)
        let ret = await table_charge.update({
          UseNumber: use_number,
          Water_Charge: w_charge,
          Sewage_Charge: s_charge,
          RecordDate: where.RecordDate
        }, {where: where})
        ctx.body = {
          code: CODE.SUCCESS,
          data: ret
        }
      } else {
        let table_room = getTable(DB_WECHARGE_NAME, 'room')
        let room_info = await table_room.findOne({where: {ZoneName: body.ZoneName, RoomName: body.RoomName}, raw: true})
        if (room_info) {
          let chargeclass = room_info[switch_obj[body.type].ChargeClass]
          let table_chargeclass = getTable(DB_WECHARGE_NAME, switch_obj[body.type].chargeclass)
          let table_chargerule = getTable(DB_WECHARGE_NAME, switch_obj[body.type].chargerule)
          let rule_info = await table_chargerule.findOne({where: {ClassName: chargeclass}, raw: true})
          let sewage_info = await table_chargeclass.findOne({where: {ClassName: chargeclass}, raw: true})
          meterrecords.forEach(function (e) {
            use_number += e.UsedNumber
          })
          let w_charge = rule_info.Water_UnitPrice * use_number
          let s_charge = rule_info.Sewage_UnitPrice * use_number * sewage_info.SewagePercent
          let roomcharge_obj = {
            UseNumber: use_number,
            GradeIndex: rule_info.GradeIndex,
            Water_UnitPrice: rule_info.Water_UnitPrice,
            Sewage_UnitPrice: rule_info.Sewage_UnitPrice,
            SewagePercent: sewage_info.SewagePercent,
            Water_Charge: w_charge,
            Sewage_Charge: s_charge
          }
          Object.assign(roomcharge_obj, where)
          console.log('============roomcharge_obj:', roomcharge_obj)
          let ret = await table_charge.create(roomcharge_obj)
          ctx.body = {
            code: CODE.SUCCESS,
            data: ret
          }
        }
      }
    }
  })
  router.post('/listChargeByRooms', async (ctx) => {
    let body = ctx.request.body
    if (!body.Rooms) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `params not right`
      }
    }
    let list = []
    let room_list = body.Rooms
    console.log('xxxtemp', room_list)
    if (room_list.length) {
      for (let i = 0; i < room_list.length; i++) {
        let ret = await checkCharge(room_list[i].ZoneName, room_list[i].RoomName, room_list[i].RecordDate)
        console.log('######################checkCharge ret:', ret.code === 0, ret)
        if (ret.code == 0) {
          list.push(ret.data)
        }
      }
    }
    ctx.body = {
      code: CODE.SUCCESS,
      data: list
    }
  })
  router.post('/listChargeByZone', async (ctx) => {
    let body = ctx.request.body
    if (!body.ZoneName || !body.startRecordDate || !body.endRecordDate) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `params not right`
      }
    }
    let where = {ZoneName: body.ZoneName, RoomClass: 0 , RecordDate: {"$gte": body.startRecordDate, "$lte": body.endRecordDate}}
    let list = []
    let pagination = body._page
    if (body.PayStatus) {
      where.PayStatus = parseInt(body.PayStatus)
    }
    let count_info = await table_roomrecordforuser.findAndCountAll({where: where, raw: true})
    if (pagination) {
      if (typeof pagination === 'string') {
        let [page = 1, pageSize = 20] = pagination.split(',')
        page = parseInt(page)
        pageSize = parseInt(pageSize)
        let total_page = Math.ceil(count_info.count / pageSize)
        pagination = {
          page,
          pageSize,
          total_page,
          total: count_info.count
        }
      } else if (Array.isArray(pagination)) {
        let [page = 1, pageSize = 20] = pagination
      }
    } else {
      pagination = {}
    }
    let {
      page = 1,
      pageSize = 20
    } = pagination
    let room_list = await table_roomrecordforuser.findAll({
      where: where,
      raw: true,
      offset: (page - 1) * pageSize,
      limit: pageSize
    })
    if (room_list.length) {
      let tasks = []
      for (let i = 0; i < room_list.length; i++) {
        tasks.push(checkCharge(room_list[i].ZoneName, room_list[i].RoomName, room_list[i].RecordDate))
      }
      let ret = await Promise.all(tasks).then((result) => {
        if (result && result.length) {
          result.forEach((e) => {
            if (e.code === 0) {
              list.push(e.data)
            }
          })
        }
        return Promise.resolve({code: CODE.SUCCESS})
      })
    }
    ctx.body = {
      code: CODE.SUCCESS,
      data: {
        list,
        pagination
      }
    }
  })
  router.post('/listChargeByCompany', async (ctx) => {
    console.log('==================run listChargeByCompany')
    let body = ctx.request.body
    if (!body.CompanyName || !body.RecordDate) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `params not right`
      }
    }
    let rooms = await table_companyhireroom.findAll({where: {CompanyName: body.CompanyName}, raw: true})
    let addtionalfeeInfo = await table_addtionalfeeforcompany.findOne({
      where: {
        CompanyName: body.CompanyName,
        RecordDate: body.RecordDate
      },
      raw: true
    }) || {}
    if (rooms.length) {
      let task = []
      rooms.forEach((e) => {
        task.push(checkCharge(e.ZoneName, e.RoomName, body.RecordDate))
      })
      ctx.body = await Promise.all(task).then((result) => {
        console.log('=========result:', JSON.stringify(result))
        let check = false;
        if (result.length) {
          result.forEach((e)=>{
            if(e.code ==  CODE.SUCCESS)check=true
          })
          if(!check){
            return ctx.body = {
              code: CODE.FAIL,
              msg: `no record`
            }
          }
          let total_charge = 0
          let water_charge = 0
          let sewage_charge = 0
          let water_charge_total = 0
          let electricity_charge = 0
          let equipment_charge = 0
          let electricity_charge_total = 0
          let garbage_charge_total = 0
          let water_pre = 0
          let water_last = 0
          let electricity_pre = 0
          let electricity_last = 0
          result.forEach((e) => {
            if (e.code === CODE.SUCCESS) {
              if (e.data.waterInfo) {
                water_pre += e.data.waterInfo.pre || 0
                water_last += e.data.waterInfo.last || 0
                console.log('==============water:', water_pre, water_last)
                water_charge += e.data.waterInfo.water_charge
                sewage_charge += e.data.waterInfo.sewage_charge
                water_charge_total += e.data.waterInfo.total
              }
              if (e.data.electricityInfo) {
                electricity_pre += e.data.electricityInfo.pre || 0
                electricity_last += e.data.electricityInfo.last || 0
                electricity_charge += e.data.electricityInfo.electricity_charge
                equipment_charge += e.data.electricityInfo.equipment_charge
                electricity_charge_total += e.data.electricityInfo.total
              }
              if (e.data.garbageInfo && e.data.garbageInfo.total) {
                garbage_charge_total += e.data.garbageInfo.total
              }
            }
          })
          total_charge = water_charge_total + electricity_charge_total + garbage_charge_total + (addtionalfeeInfo ? addtionalfeeInfo.Charge : 0)
          return {
            code: CODE.SUCCESS,
            data: [
              {
                waterInfo: {
                  pre: water_pre,
                  last: water_last,
                  total: savePoint(water_charge_total, 2),
                  water_charge,
                  sewage_charge
                },
                electricityInfo: {
                  pre: electricity_pre,
                  last: electricity_last,
                  total: savePoint(electricity_charge_total, 2),
                  electricity_charge,
                  equipment_charge
                },
                garbageInfo: {
                  pre: water_pre,
                  last: water_last,
                  total: savePoint(garbage_charge_total, 2),
                  garbage_charge: garbage_charge_total
                },
                addtionalfeeInfo,
                total_charge: total_charge || 0,
                ZoneName: body.ZoneName,
                RecordDate: body.RecordDate,
                user_name: body.CompanyName,
                CompanyName: body.CompanyName || null,
                pay_status: rooms[0].PayStatus || 0,
                pay_date: rooms[0].PayDate || null,
                pay_note: rooms[0].PayNotes || null
              }
            ]
          }
        }
      })
      // let ret = await Promise.all(task).then((result) => {
      //   console.log('=========result:', JSON.stringify(result))
      //   if (result.length) {
      //     let totalcharge = 0
      //     let water_totalcharge = 0
      //     let electricity_totalcharge = 0
      //     let garbage_totalcharge = 0
      //     let list = []
      //     result.forEach((e) => {
      //       if (e.code === CODE.SUCCESS) {
      //         list.push(e.data)
      //         if (e.data.watercharge instanceof Array && e.data.watercharge.length) {
      //           e.data.watercharge.forEach((charge) => {
      //             water_totalcharge += charge.Water_Charge + charge.Sewage_Charge
      //           })
      //         }
      //         if (e.data.electricitycharge instanceof Array && e.data.electricitycharge.length) {
      //           e.data.electricitycharge.forEach((charge) => {
      //             electricity_totalcharge += charge.Electricity_Charge + charge.Equipment_Charge
      //           })
      //         }
      //         if (e.data.electricitycharge instanceof Array && e.data.garbagecharge.length) {
      //           e.data.garbagecharge.forEach((charge) => {
      //             garbage_totalcharge += charge.Charge
      //           })
      //         }
      //       }
      //       console.log(water_totalcharge, electricity_totalcharge, garbage_totalcharge)
      //     })
      //     totalcharge = water_totalcharge + electricity_totalcharge + garbage_totalcharge
      //     return Promise.resolve({
      //       code: CODE.SUCCESS,
      //       data: list,
      //       totalcharge: totalcharge,
      //       water_totalcharge: water_totalcharge,
      //       electricity_totalcharge: electricity_totalcharge,
      //       garbage_totalcharge: garbage_totalcharge
      //     })
      //   }
      // })
      // ctx.body = ret
    } else {
      ctx.body = {
        code: CODE.SUCCESS,
        data: []
      }
    }
  }).post('/countZoneChargeByTime', async (ctx) => {
    let body = ctx.request.body
    if (!body.ZoneName || !body.startRecordDate || !body.endRecordDate) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `params not right`
      }
    }
    let where = {ZoneName: body.ZoneName, RecordDate: {"$gte": body.startRecordDate, "$lte": body.endRecordDate}}
    let list = []
    let room_list = await table_roomrecordforuser.findAll({where: where, raw: true})
    console.log('====================room list:', room_list)
    if (room_list.length) {
      let tasks = []
      for (let i = 0; i < room_list.length; i++) {
        tasks.push(checkCharge(room_list[i].ZoneName, room_list[i].RoomName, room_list[i].RecordDate))
      }
      let totalcharge = 0
      let water_charge = 0
      let sewage_charge = 0
      let water_totalcharge = 0
      let electricity_charge = 0
      let equipment_charge =0
      let electricity_totalcharge = 0
      let garbage_totalcharge = 0
      let addtionalfee_totalcharge = 0
      let ret = await Promise.all(tasks).then((result) => {
        if (result && result.length) {
          result.forEach((e) => {
            if (e.code === 0) {
              list.push(e.data)
              if (e.data.waterInfo && e.data.waterInfo.total) {
                water_charge += e.data.waterInfo.water_charge
                sewage_charge += e.data.waterInfo.sewage_charge
                water_totalcharge += e.data.waterInfo.total
              }
              if (e.data.electricityInfo && e.data.electricityInfo.total) {
                electricity_charge += e.data.electricityInfo.electricity_charge
                equipment_charge += e.data.electricityInfo.equipment_charge
                electricity_totalcharge += e.data.electricityInfo.total
              }
              if (e.data.garbageInfo && e.data.garbageInfo.total) {
                garbage_totalcharge += e.data.garbageInfo.total
              }
              if (e.data.addtionalfeeInfo && e.data.addtionalfeeInfo.Charge) {
                addtionalfee_totalcharge += e.data.addtionalfeeInfo.Charge
              }
            }
          })
          totalcharge = water_totalcharge + electricity_totalcharge + garbage_totalcharge + addtionalfee_totalcharge
          return {
            code: CODE.SUCCESS,
            data: {
              ZoneName: body.ZoneName,
              totalcharge,
              water_charge,
              sewage_charge,
              water_totalcharge,
              electricity_charge,
              equipment_charge,
              electricity_totalcharge,
              garbage_totalcharge,
              addtionalfee_totalcharge,
              list
            }
          }
        }
        return Promise.resolve({code: CODE.SUCCESS})
      })
      ctx.body = ret
    } else {
      ctx.body = {
        code: CODE.SUCCESS,
        data: {
          totalcharge: 0,
          water_totalcharge: 0,
          electricity_totalcharge: 0,
          garbage_totalcharge: 0
        }
      }
    }
  })
  //获取区域未录表房间
  router.post('/listUnrecordRooms', async (ctx) => {
    let body = ctx.request.body
    if (!body.ZoneName || !body.RecordDate || !body.type) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `params not right`
      }
    }
    let table_name = body.type + 'meterrecord'
    let table_meterrecord = getTable(DB_WECHARGE_NAME, table_name)
    let rooms_pay = await table_meterrecord.findAll({
      where: {ZoneName: body.ZoneName, RecordDate: body.RecordDate},
      attributes: ['RoomName'],
      raw: true
    })
    console.log('=========pay rooms:', rooms_pay)
    let rooms_pay_arr = []
    rooms_pay.forEach((e) => {
      rooms_pay_arr.push(e.RoomName)
    })
    let rooms = await table_room.findAll({where: {RoomName: {'$notIn': rooms_pay_arr}, ZoneName: body.ZoneName}})
    console.log(rooms.length)
    ctx.body = {
      code: CODE.SUCCESS,
      data: rooms
    }
  })
  //按照区域列出公司缴费情况
  router.post('/listCompanyChargeByZone', async (ctx) => {
    console.log('==================run listChargeByCompany')
    // ctx.body = await getCompanyChargeByMonth('信誉服装宿舍', '2017-10-01 00:00:00')
    // return
    let body = ctx.request.body
    // if (!body.ZoneName  || !body.startRecordDate || !body.endRecordDate) {
    if (!body.ZoneName || !body.RecordDate) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `params not right`
      }
    }
    let where = {ZoneName: body.ZoneName, RecordDate: body.RecordDate, RoomClass:1}
    if (body.PayStatus) {
      where.PayStatus = parseInt(body.PayStatus)
    }
    let companys = await table_roomrecordforuser.findAll({attributes: ['UserName'], where: where, group:"UserName"})
    let charges = await Promise.all(companys.map((company) => {
      return getCompanyChargeByMonth(company.UserName, body.RecordDate)
    })).then((result) => {
      console.log('=======company result:', result)
      return result
    })
    ctx.body = {
      code: CODE.SUCCESS,
      data: charges
    }
  })
  //获取单个公司的某月缴费信息
  router.post('/listCompanyChargeByTime', async (ctx) => {
    let body = ctx.request.body
    if (!body.CompanyName  || !body.RecordDates ) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `params not right`
      }
    }
    let RecordDates = JSON.parse(body.RecordDates)
    let charges = await Promise.all(RecordDates.map((RecordDate) => {
      return getCompanyChargeByMonth(body.CompanyName, RecordDate)
    })).then((result) => {
      console.log('=======company result:', result)
      return result
    })
    ctx.body = {
      code: CODE.SUCCESS,
      data: charges
    }
    // ctx.body = await getCompanyChargeByMonth('信誉服装宿舍', '2017-10-01 00:00:00')
  })
  //更新公司的支付状态到roomrecordforuser
  router.post('/updatePayByCompany', async (ctx) => {
    let body = ctx.request.body
    if (!body.CompanyName  || !body.RecordDate || !body.PayDate || !body.PayNotes  ) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `params not right`
      }
    }
    let ret = await table_roomrecordforuser.update({PayStatus: 1, PayDate: body.PayDate, PayNotes: body.PayNotes, RecordDate: body.RecordDate}, {where: {UserName: body.CompanyName, RecordDate: body.RecordDate}})
    ctx.body = {code: CODE.SUCCESS}
  })
  //区域打印后，更新支付状态
  router.post('/updatePayByUsers', async (ctx) => {
    let body = ctx.request.body
    if (!body.users) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `params not right`
      }
    }
    let users = body.users
    ctx.body = await Promise.all(users.map(async (user) => {
      let where = {RecordDate: user.RecordDate, ZoneName: user.ZoneName, RoomName: user.RoomName}
      let update_params = {PayStatus: 1, RecordDate: user.RecordDate}
      if (user.PayDate) update_params.PayDate = user.PayDate
      if (user.PayNotes) update_params.PayNotes = user.PayNotes
      return await table_roomrecordforuser.update(update_params, {where: where})
    })).then((result) => {
      return {code: CODE.SUCCESS}
    })
  })
  //修改附加费
  router.post('/updateAddtionalFee', async (ctx) => {
    let body = ctx.request.body
    if (!body.Type || !body.RecordDate || !body.Name || !body.ItemClass || !body.ItemName) {
      return ctx.body = {
        code: CODE.FAIL,
        msg: `params not right`
      }
    }
    let table_fee = getTable(DB_WECHARGE_NAME, 'addtionalfeefor' + body.Type)
    let where = {
      RecordDate: body.RecordDate
    }
    let params = {
      RecordDate: body.RecordDate,
      ItemClass: body.ItemClass,
      ItemName: body.ItemName,
      Charge: body.Charge
    }
    if (body.Type === 'room') {
      where.ZoneName = body.ZoneName
      where.RoomName = body.Name
      params.ZoneName = body.ZoneName
      params.RoomName = body.Name
    }else{
      where.CompanyName = body.Name
      params.CompanyName = body.Name
    }
    let fee_info = await table_fee.findOne({where: where, raw: true})
    console.log('========fee_info:', where, fee_info)
    let ret
    if (fee_info) {
      ret = await table_fee.update(params, {where: where})
    } else {
      ret = await table_fee.create(params)
    }
    ctx.body = {
      code: CODE.SUCCESS,
      data: ret
    }
  })
}
