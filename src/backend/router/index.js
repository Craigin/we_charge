import Router from 'koa-router'
import session from 'middleware/session'
import respond from 'middleware/respond'

import dataTables from './dataTables/index'
import admin from './admin'
import handle from './handle'
import public_ from './public'

const router = new Router({
  prefix: '/api'
})
const commonMiddlewares = [
  respond()
]
router.use(commonMiddlewares)

const routers = [
  {
    name: 'admin',
    router: admin,
    middleware: [
      session()
    ]
  },
  {
    name: 'handle',
    router: handle,
    middleware: [
      session()
    ]
  },
  {
    name: 'dataTables',
    router: dataTables,
    middleware: [
      session()
    ]
  },
  {
    name: 'public',
    router: public_,
    middleware: []
  }
]

routers.forEach(item => {
  let {name, router: func, middleware} = item
  const subRouter = new Router()
  subRouter.use(middleware)
  func(subRouter)
  router.use(`/${name}`, subRouter.routes(), subRouter.allowedMethods())
})


export default router
