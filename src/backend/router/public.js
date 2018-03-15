import fs from 'fs'
import cp from 'child_process'
import xn from '../config'
import {getTable, redis} from 'db'
import * as utils from 'utils'
import * as commonUtils from 'common/utils'
import {CODE} from 'common/config'

export default function (router) {
  router.get('/logout', async function (ctx) {
    ctx.cookies.set('token', '')
    ctx.$respond({})
  })

  router.get('/login',async function(ctx) {
    let {
      userid,
      password
    } = ctx.query

    let applicationuser = getTable('we_charge', 'applicationuser')
    console.log('===========find params:',{UserID: userid, Password: password});
    let user = await applicationuser.findOne({where: {UserID: userid, Password: password}, raw: true})

    if (!user) {
      ctx.body = {
        code: CODE.FAIL,
        msg: `userinfo not right`
      }
    } else {
      let token = commonUtils.randomString()
      applicationuser.update({
        token
      }, {
        where: {
          UserID: userid,
          Password: password
        },
        limit: 1
      })
      // ctx.cookies.set('token', token)

      let tbl_payinform = getTable('we_charge', 'payinform')
      let payinform = await tbl_payinform.findOne({
        where: {
          sector: user.sectors
        },
        raw: true
      })
      user.payinform = payinform

      if (user.IsAdmin === 1) {
        user.highPrivilege = true
      }
      if (user.roles) {
        user.roles = user.roles.split(/[;,]/)
      }
      if (user.sectors) {
        user.sectors = user.sectors.split(/[;,]/)
      }

      delete user.Password
      ctx.body = {
        code: CODE.SUCCESS,
        data: {
          token,
          supervisor: user,
          ip: ctx.ip
        }
      }
    }
  })

}
