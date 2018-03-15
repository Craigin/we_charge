import babelRegister from 'babel-register'
import babelResolver from 'babel-resolver'

import path from 'path'
import cp from 'child_process'
import xn from './config'

let {
  NODE_PATH,
  NODE_ENV
} = process.env

const backendDir = __dirname
const srcDir = path.dirname(backendDir)
const commonDir = path.join(srcDir, 'common')
const frontendDir = path.join(srcDir, 'frontend')
babelRegister({
  resolveModuleSource: babelResolver(backendDir, srcDir)
})

const develop = NODE_ENV !== 'production'
const {host = 'localhost', port} = xn.config

if (develop) {
  process.env.NODE_PATH = (backendDir + path.delimiter + srcDir) + (NODE_PATH ? path.delimiter + NODE_PATH : '')

  const Nodemon = require('nodemon')
  let argv0 = process.argv.slice(1)
  let args = [path.join(backendDir, 'server.js')]
    .concat(['--inspect', '--debug-brk'].filter(s => argv0.indexOf(s) >= 0))
  const nodemon = Nodemon({
    verbose: true,
    delay: 200,
    exec: 'babel-node',
    args,
    watch: [
      backendDir,
      commonDir
    ],
    ext: "js json"
  }).on('log', data => {
    console.log(`[${data.type}] ${data.colour}`)
  })

  const frontend = cp.spawn('node', [
    path.join(frontendDir, 'build/dev-server.js')
    // 'build/dev-server.js'
  ], {
    stdio: 'inherit',
    cwd: frontendDir,
    env: {
      ...process.env,
      BACKEND_HOST: host,
      BACKEND_PORT: port
    }
  }, (err, stdout, stderr) => {
    if (err) {
      console.log(stdout)
      console.error(stderr)
    }
    console.log('Frontend exits.')
  })
  frontend.on('error', err => {
    console.error('Frontend error', err)
    process.exit()
  })
  frontend.on('exit', ret => {
    console.error('Frontend exits', ret)
    process.exit()
  })

  const repl = require('repl')
  const replServer = repl.start('> ')
  Object.assign(replServer.context, {
    ...require('./db'),
    nodemon
  })

  global.replServerContext = replServer.context
  replServer.on('exit', () => {
    frontend.kill()
    process.exit()
  })
} else {
  require('./server')
  process.on('SIGHUP', () => {
    console.log('ignore SIGHUP under production')
  })
}
