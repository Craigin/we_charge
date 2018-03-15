import bodyParser from 'co-body'
import * as utils from './utils'

export default function (router) {
  router.get('/:databaseType/:databaseName/:tableName/schema', async function (ctx) {
    let {
      databaseType,
      databaseName,
      tableName
    } = ctx.params
    ctx.$respond(utils.getTableSchema(databaseType, databaseName, tableName))
  })

  router.post('/:databaseType/:databaseName/:tableName/schema', async function (ctx) {
    let {
      databaseType,
      databaseName,
      tableName
    } = ctx.params
    ctx.$respond(utils.getTableSchema(databaseType, databaseName, tableName))
  })

  router.get('/:databaseType/:databaseName/:tableName/select', async function (ctx) {
    await utils.select(ctx, ctx.query)
  })

  router.post('/:databaseType/:databaseName/:tableName/select', async function (ctx) {
    let data = {
      ...ctx.query,
      ...ctx.request.body
    }
    await utils.select(ctx, data)
  })

  router.get('/:databaseType/:databaseName/:tableName/create', async function (ctx) {
    await utils.create(ctx, ctx.query)
  })

  router.post('/:databaseType/:databaseName/:tableName/create', async function (ctx) {
    let data = {
      ...ctx.query,
      ...ctx.request.body
    }
    await utils.create(ctx, data)
  })

  router.get('/:databaseType/:databaseName/:tableName/update', async function (ctx) {
    await utils.update(ctx, ctx.query)
  })

  router.post('/:databaseType/:databaseName/:tableName/update', async function (ctx) {
    let data = ctx.request.body
    await utils.update(ctx, {
      ...ctx.query,
      ...data
    }, {
      ...data,
      ...ctx.query
    })
  })

  router.get('/:databaseType/:databaseName/:tableName/delete', async function (ctx) {
    await utils.delete(ctx, ctx.query)
  })

  router.post('/:databaseType/:databaseName/:tableName/delete', async function (ctx) {
    let data = {
      ...ctx.query,
      ...ctx.request.body
    }
    await utils.delete_(ctx, data)
  })
}
