import localConfig from './app.json'
import devConfig from './app-dev.json'
import prodConfig from './app-prod.json'

const {ENV} = process.env

let Config

switch (ENV) {

  case 'dev':
    Config = devConfig
    break

  case 'production':
    Config = prodConfig
    break

  default:
    Config = localConfig
    break
}

export default {
  config: Config
}
