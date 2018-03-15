import URL from 'url'
import axios from 'axios'
import dateformat from 'dateformat'
import bodyParser from 'co-body'
import mongodb from 'mongodb'
import xn from '../config'
import api from 'api'
import {getTable, getCollection} from 'db'
import * as mail from 'utils/mail'
import * as dataUtils from 'utils/data'
import * as commonUtils from 'common/utils'

export default function (router) {
  router.get('/whoami', async function (ctx) {
    ctx.$respond(ctx.$session)
  })

  router.get('/hunter-account', async function (ctx) {
    let response = await api.getHunterAccount({})
    ctx.$respond(response)
  })

  router.get('/diagnose', async function (ctx) {
    let {
      fake
    } = ctx.query
    const {
      service: {
        discovery: {
          url: discoveryUrl,
          upstreams: discoveryUpstreams = []
        },
        discovery_admin: {
          url: discoveryAdminUrl,
          upstreams: discoveryAdminUpstreams = []
        }
      }
    } = xn.config
    let generateRequests = (tag, url0, hosts, requests) => {
      let url = URL.parse(url0)

      return hosts.map(host => {
        let row = {
          tag: host ? `${tag}@${host}` : tag
        }
        return Promise.all(requests.map(request => {
          let url1
          if (host) {
            let pathname = url.pathname !== '/' ? url.pathname : ''
            url1 = `${url.protocol}//${host}${pathname}${request.path}`
          } else {
            url1 = `${url0}${request.path}`
          }
          let options = {
            url: url1,
            host: url.host,
            status: request.status
          }
          if (fake) {
            row[request.tag] = {
              success: true,
              options
            }
            return Promise.resolve();
          }
          return axios.get(url1, {
            headers: {
              HOST: url.host
            },
            timeout: 5000,
            noInterceptor: true
          }).then(response => {
            let success
            if (request.status) {
              success = response.status === request.status
            } else if (request.api) {
              success = response.data.code === 0
            } else {
              success = true
            }
            return {
              success,
              response
            }
          }).catch(err => {
            let {response} = err
            return {
              success: request.status && response && response.status === request.status,
              response
            }
          }).then(data => {
            let {success, response} = data
            row[request.tag] = {
              success,
              options,
              status: response && response.status,
              statusText: response && response.statusText,
              headers: response && response.headers,
              data: response && response.data
            }
          })
        })).then(() => row)
      })
    }
    let apiPath = {
      root: '/',
      web: '/static/ie/index.html',
      totalCompany: '/api/interface-read/total-company?dx-api-source=xcompass',
      emailCount: '/api/admin/platform-read/emails-count?dx-api-source=xcompass&keys=a3ba1e3993258c9f&is_cache=true',
      profile: '/api/admin/platform-read/profile?dx-api-source=xcompass&id=xiaoman.cn&brief_only=true',
      redis: '/api/admin/compass-read/redis-test?dx-api-source=xcompass'
    }
    let allRequests = generateRequests('public', discoveryUrl, ['', ...discoveryUpstreams], [
      {
        tag: 'root',
        path: apiPath.root
      },
      {
        tag: 'web',
        path: apiPath.web
      },
      {
        tag: 'es',
        path: apiPath.totalCompany,
        api: true
      },
      {
        tag: 'mongo',
        path: apiPath.emailCount,
        status: 404
      },
      {
        tag: 'mysql',
        path: apiPath.profile,
        status: 404
      },
      {
        tag: 'redis',
        path: apiPath.redis,
        status: 404
      }
    ]).concat(generateRequests('admin', discoveryAdminUrl, ['', ...discoveryAdminUpstreams], [
      {
        tag: 'root',
        path: apiPath.root
      },
      {
        tag: 'web',
        path: apiPath.web,
        status: 404
      },
      {
        tag: 'es',
        path: apiPath.totalCompany,
        api: true
      },
      {
        tag: 'mongo',
        path: apiPath.emailCount,
        api: true
      },
      {
        tag: 'mysql',
        path: apiPath.profile,
        api: true
      },
      {
        tag: 'redis',
        path: apiPath.redis,
        api: true
      }
    ]))

    ctx.$respond(await Promise.all(allRequests))
  })

  router.get('/search-client-user', async function (ctx) {
    let {keyword, limit} = ctx.query

    let tblClient = getTable('v4_admin', 'tbl_client')
    let clients = await tblClient.findAll({
      where: {
        $or: {
          client_id: keyword,
          name: keyword,
          full_name: keyword,
          homepage: keyword,
          email: keyword,
          master_account: keyword
        }
      },
      limit,
      raw: true
    })

    let tblUserInfo = getTable('v4_admin', 'tbl_user_info')
    let users = await tblUserInfo.findAll({
      where: {
        $or: {
          user_id: keyword,
          email: keyword,
          nickname: keyword
        }
      },
      limit,
      raw: true
    })

    let result = {
      clients,
      users
    }

    ctx.$respond(result)
  })

  router.get('/search-client-user/id', async function (ctx) {
    let {keyword, limit} = ctx.query

    let tblClient = getTable('v4_admin', 'tbl_client')
    let clients = await tblClient.findAll({
      where: {
        client_id: keyword
      },
      limit,
      raw: true
    })

    let tblUserInfo = getTable('v4_admin', 'tbl_user_info')
    let users = await tblUserInfo.findAll({
      where: {
        user_id: keyword
      },
      limit,
      raw: true
    })

    let result = {
      clients,
      users
    }
    ctx.$respond(result)
  })

  router.get('/search-user/id', async function (ctx) {
    let {keyword, limit} = ctx.query
    keyword = keyword.split(',')
    let tblUserInfo = getTable('v4_admin', 'tbl_user_info')
    let users = await tblUserInfo.findAll({
      where: {
        user_id: keyword
      },
      limit,
      raw: true
    })
    ctx.$respond(users)
  })

  router.get('/search-client/id', async function (ctx) {
    let {keyword, limit} = ctx.query
    keyword = keyword.split(',')
    let tblClient = getTable('v4_admin', 'tbl_client')
    let clients = await tblClient.findAll({
      where: {
        client_id: keyword
      },
      limit,
      raw: true
    })
    ctx.$respond(clients)
  })

  router.get('/client-credit', async function (ctx) {
    let {clientId} = ctx.query

    let tblShopIntegral = getTable('discovery', 'tbl_shop_integral')
    let shopIntegral = await tblShopIntegral.findOne({
      where: {
        client_id: clientId
      },
      raw: true
    })
    if (!shopIntegral) {
      ctx.throw(404)
    }

    let tblClient = getTable('v4_admin', 'tbl_client')
    let client = await tblClient.findOne({
      where: {
        client_id: clientId
      },
      raw: true
    })

    shopIntegral.client = client
    ctx.$respond(shopIntegral)
  })

  router.get('/client-credit/update', async function (ctx) {
    let {
      query,
      query: {
        clientId,
        mode = 'inc',
        value = 0,
        reason
      },
      $session: {
        supervisor,
        user
      }
    } = ctx // mode: inc/abs

    if (!reason) {
      ctx.throw(400, '请填写修改理由')
    }

    let tblShopIntegral = getTable('discovery', 'tbl_shop_integral')
    let oldShopIntegral = await tblShopIntegral.findOne({
      where: {
        client_id: clientId
      }
    })
    if (!oldShopIntegral) {
      ctx.throw(404)
    }

    let sign
    switch (mode) {
      case 'inc': {
        sign = '+'
        await oldShopIntegral.increment('score', {by: value})
        break
      }
      case 'abs': {
        sign = '='
        await oldShopIntegral.update({score: value})
        break
      }
      default: {
        sign = '?'
        console.log('unknown client credit update mode', mode)
        ctx.throw(400)
        break
      }
    }

    let newShopIntegral = await tblShopIntegral.findOne({
      where: {
        client_id: clientId
      },
      raw: true
    })

    let now = new Date()
    let tblSupervisorHistory = getTable('discovery_admin', 'tbl_supervisor_history')
    let supervisorHistory = await tblSupervisorHistory.create({
      supervisor_id: supervisor.id,
      type: 'modify',
      operation: 'editCredit',
      target: 'discovery.tbl_shop_integral',
      params: JSON.stringify({clientId, mode, value}),
      payload: JSON.stringify({
        query,
        from: oldShopIntegral,
        to: newShopIntegral
      }),
      create_time: now,
      update_time: now
    })

    let tblShopIntegralLog = getTable('discovery', 'tbl_shop_integral_log')
    await tblShopIntegralLog.create({
      client_id: clientId,
      user_id: 0,
      score: value,
      status: sign,
      order_id: supervisorHistory.id,
      type: 4, // 退还
      create_time: now,
      update_time: now
    })

    let tblClient = getTable('v4_admin', 'tbl_client')
    let client = await tblClient.findOne({
      where: {
        client_id: clientId
      },
      raw: true
    })

    let {
      html,
      metadata,
      metadata: {
        subject,
        preview
      },
      errors
    } = await mail.renderMail({
      keyname: 'edit-credit',
      view: {
        supervisor,
        data: {
          reason,
          client,
          oldIntegral: oldShopIntegral,
          newIntegral: newShopIntegral,
          detail: JSON.stringify(query, undefined, 2)
        }
      }
    })

    let users = await dataUtils.getAllSupervisorUsers()
    let emails = users.map(user => user.email)
    console.log('mailing', emails, metadata, html)
    let mailResult = await mail.sendMail({
      emails,
      subject,
      text: subject,
      html
    })
    console.log('mailResult', mailResult)

    ctx.$respond(newShopIntegral)
  })

  router.get('/filter-user', async function (ctx) {
    let users = await dataUtils.filterDiscoveryUser(ctx.query)
    ctx.$respond(users)
  })

  router.post('/send-message', async function (ctx) {
    let data = await bodyParser.json(ctx)
    let {
      $session: {
        supervisor,
        user
      }
    } = ctx
    if (!commonUtils.checkRole(['Backend', 'Product', 'OperateManager'], supervisor)) {
      ctx.throw(400, `权限不足.
required: ${['Backend', 'Product', 'OperateManager']},
roles: ${supervisor.roles},
high: ${supervisor.highPrivilege}`)
    }

    let {
      keyname,
      content,
      create_time: createTime,
      status
    } = data

    let tblMessageTemplate = getTable('discovery_admin', 'tbl_message_template')
    let messageTemplate = await tblMessageTemplate.findOne({
      where: {
        keyname
      },
      raw: true
    })
    if (!messageTemplate) {
      ctx.throw(404, `消息模板 ${keyname} 不存在`)
    }

    createTime = createTime ? new Date(createTime) : new Date()
    createTime = dateformat(createTime, 'yyyy-MM-dd hh:mm:ss')

    if (status === undefined || status === '') {
      status = 0
    }

    let users = await dataUtils.filterDiscoveryUser(data)

    let batchId = new mongodb.ObjectID()
    let message = {
      keyname,
      content,
      create_time: createTime,
      status,

      batch_id: batchId
    }

    let messages = users.map(item => {
      return {
        client_id: item.client_id,
        user_id: parseInt(item.user_id),
        ...message
      }
    })
    let colMessage = getCollection('discovery_biz', 'message')
    let result = await colMessage.insertMany(messages)
    let {
      result: {
        n: count
      }
    } = result
    console.log(`sent ${messages.length} messages, batch_id=${batchId.toString()}, success=${count}`, data, message)

    ctx.$respond({
      count,
      message,
      batch_id: batchId.toString()
    })
  })

  router.get('/revoke-batch-message', async function (ctx) {
    let {
      $session: {
        supervisor,
        user
      },
      query: {
        id
      }
    } = ctx
    if (!id) {
      ctx.throw(404, `id为空`)
    }
    if (!commonUtils.checkRole(['Backend', 'Product', 'OperateManager'], supervisor)) {
      ctx.throw(400, `权限不足.
required: ${['Backend', 'Product', 'OperateManager']},
roles: ${supervisor.roles},
high: ${supervisor.highPrivilege}`)
    }

    let batchId = new mongodb.ObjectID(id)
    let colMessage = getCollection('discovery_biz', 'message')
    let result = await colMessage.remove({
      batch_id: batchId
    })

    ctx.$respond({
      batch_id: batchId,
      count: result.result.n
    })
  })

  router.get('/clear-option-cache', async function (ctx) {
    let {
      query: {
        key
      }
    } = ctx

    let result = await api.clearOptionCache({key})

    ctx.$respond(result)
  })
}
