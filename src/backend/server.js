import 'babel-register'

import path from 'path'
import Koa from 'koa'
import koaStatic from 'koa-static'
import koaSend from 'koa-send'
import xn from './config'
import axios from 'common/http'
import router from 'router'
import bodyparser from 'koa-bodyparser'
import fs from 'fs'
// import './ws'

let {
  ENV,
  NODE_ENV,
  NODE_PATH,
  LOCALHOST_DEV_PROXY
} = process.env

const develop = NODE_ENV !== 'production'
console.log(`ENV=${ENV}, NODE_ENV=${NODE_ENV}, NODE_PATH=${NODE_PATH}`)

if (LOCALHOST_DEV_PROXY) {
  let proxyRE = /^(http:\/\/)?(([^:@]+):([^:@]+)@)?([^:@]+):([^:@]+)\/?$/
  let m = proxyRE.exec(LOCALHOST_DEV_PROXY)
  if (m) {
    let [, , , username, password, host, port] = m
    port = parseInt(port)
    let auth = username && password ? {username, password} : undefined

    axios.defaults.proxy = {
      host,
      port,
      auth
    }
  } else {
    console.warn('invalid XIAOMAN_INNER_PROXY')
  }
}

const app = new Koa()
app.proxy = true
app.use(bodyparser())
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(router.routes()).use(router.allowedMethods());

const {host = 'localhost', port} = xn.config
const server = app.listen(port, host, err => {
  if (err) {
    console.error(`listening ${host}:${port} error`, err)
  }
  console.info(`==> Backend listening ${host}:${port}...`)
})
let err_log = 'D:/code/南园/we-charge/log/error.log'
app.on('error', function (err) {
  fs.writeFileSync(err_log, err.stack + '\n', {flag: 'a'})
})
process.once('SIGUSR2', () => {
  server.close(() => {
    process.kill(process.pid, 'SIGUSR2')
  })
})

if (develop) {
  // let ppid0
  // setInterval(() => {
  //   const posix = require('posix')
  //   let ppid = posix.getppid()
  //   if (!ppid0) {
  //     ppid0 = ppid
  //   }
  //   if (ppid === 1) {
  //     console.info(`==> Parent ${ppid0} has gone. Stopping server.`)
  //     process.exit()
  //   }
  // }, 500)
} else {
  app.use(async (ctx) => {
    await koaSend(ctx, 'public/index.html');
  })
}
