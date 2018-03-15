import xn from '../config'
import api from 'api'
import {CODE} from 'common/config'
import {getTable} from 'db'

export default function (options = {}) {
  let {} = options
  return async function (ctx, next) {
    ctx.$respond = (data) => {
      ctx.body = {
        code: 0,
        msg: 'ok',
        data
      }
    }

    await next()
  }
}
