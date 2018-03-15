import xn from '../config'
import api from 'api'
import {CODE} from 'common/config'
import apiPrivileges from 'common/apiPrivileges'
import * as commonUtils from 'common/utils'
import {getTable} from 'db'
import * as utils from 'utils'
import Cookies from 'cookie'

export default function (options = {}) {
  let {supervisor: mustSupervisor = true} = options
  return async function (ctx, next) {
    let path = ctx.url.replace('/api', '')
    let access_list = ['/admin/login', '/handle/countCharge', '/handle/listChargeByRooms', '/handle/listChargeByZone', '/handle/listChargeByCompany', '/handle/countZoneChargeByTime', '/handle/listUnrecordRooms', '/handle/listCompanyChargeByZone',  '/handle/listCompanyChargeByTime', '/handle/updatePayByCompany', '/handle/updateAddtionalFee', '/handle/updatePayByUsers']
    if(access_list.indexOf(path)>=0) {
      return await next()
    }
    let {
      request: {
        headers: {
          cookie = ''
        }
      }
    } = ctx
    let {
      token
    } = Cookies.parse(cookie)

    let tbl_applicationuser = getTable('we_charge', 'applicationuser')

    let supervisor = await tbl_applicationuser.findOne({
      where: {
        token
      },
      raw: true
    })

    if (!supervisor) {
      ctx.body = {
          code: CODE.NO_LOGIN,
          msg: `no privilege for user`
      }
      return
    }
    let tbl_payinform = getTable('we_charge', 'payinform')
    let payinform = await tbl_payinform.findOne({
      where: {
        sector: supervisor.sectors
      },
      raw: true
    })
    supervisor.payinform = payinform

    if (supervisor.IsAdmin === 1) {
      supervisor.highPrivilege = true
    }
    if (supervisor.roles) {
      supervisor.roles = supervisor.roles.split(/[;,]/)
    }
    if (supervisor.sectors) {
      supervisor.sectors = supervisor.sectors.split(/[;,]/)
    }
    console.log('xxxtemp', supervisor)

    ctx.$session = {
      supervisor,
      ip: ctx.ip
    }

    await next()
  }
}
