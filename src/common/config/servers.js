const ENV = process.env.ENV

let SERVERS

switch (ENV) {
  case 'testing':
    SERVERS = {
      MIX: 'http://test.erp-api.xiaoman.cn'
    }
    break

  case 'production':
    SERVERS = {
      MIX: 'https://erp-api.xiaoman.cn'
    }
    break

  default:
    SERVERS = {
      MIX: 'http://test.erp-api.xiaoman.cn'
    }
    break
}

export default SERVERS
