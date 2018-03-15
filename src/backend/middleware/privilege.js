import {CODE, HOSTS} from 'common/config'
import {getTable} from 'db'
import * as commonUtils from 'common/utils'
import apiPrivileges from 'common/apiPrivileges'
import * as sessionUtils from 'utils/session'

export default function (options = {}) {
  return async function (ctx, next) {
    let {
      $session: {
        supervisor
      } = {},
      path
    } = ctx
    let groupPath
    if (path.startsWith('/api')) {
      [, groupPath] = /\/api\/(.*?)\//.exec(path)
    }

    let privilege = apiPrivileges[groupPath]
    if (supervisor && privilege && !commonUtils.checkPrivilege(supervisor, privilege)) {
      ctx.body = {
        error: {
          code: CODE.NO_PRIVILEGE,
          msg: `no privilege to access ${path}, ${commonUtils.dumpPrivilege(supervisor, privilege)}`
        }
      }
      return
    }

    await next()
  }
}
