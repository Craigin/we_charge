const ENV = process.env.ENV
console.log(`ENV=${ENV}`)

let HOSTS
switch (ENV) {
  case 'testing':
    HOSTS = {
      ACTIVE_HELP: 'https://omgk.xiaoman.cn/account/activeHelp',
      FIND_PASSWORD: 'https://omgk.xiaoman.cn/account/findPassword',
      CRM: 'http://omgk.xiaoman.cn',
      SALES: 'http://omgboss.xiaoman.cn',
      HELP: 'help.xiaoman.cn',
      ENTERPRISE: 'https://e.xiaoman.cn',
      HR: 'https://hr.xiaoman.cn',
      PERSON: 'https://me.xiaoman.cn',
      LOGIN: 'https://login.xiaoman.cn',
      ERP: 'http://test.erp-api.xiaoman.cn',
      LANTERN: 'http://g.xiaoman.cc:3030',
      DISCOVERY: 'https://x.xiaoman.cn'
    }
    break

  case 'beta':
    HOSTS = {
      ACTIVE_HELP: 'http://beta.k.xiaoman.cn/account/activeHelp',
      FIND_PASSWORD: 'http://dev.login.xiaoman.cn/retrieve',
      CRM: 'http://beta.k.xiaoman.cn',
      SALES: 'http://beta.boss.xiaoman.cn',
      HELP: 'help.xiaoman.cn',
      ENTERPRISE: 'http://dev.e.xiaoman.cn',
      HR: 'http://dev.hr.xiaoman.cn',
      PERSON: 'http://dev.me.xiaoman.cn',
      LOGIN: 'http://dev.login.xiaoman.cn',
      ERP: 'http://dev.erp-api.xiaoman.cn',
      LANTERN: 'http://dev.lantern.xiaoman.cn',
      DISCOVERY: 'http://dev.x.xiaoman.cn'
    }
    break

  case 'production':
    HOSTS = {
      ACTIVE_HELP: 'https://crm.xiaoman.cn/account/activeHelp',
      FIND_PASSWORD: 'https://crm.xiaoman.cn/account/findPassword',
      CRM: 'https://crm.xiaoman.cn',
      SALES: 'https://sales.xiaoman.cn',
      HELP: 'help.xiaoman.cn',
      ENTERPRISE: 'https://e.xiaoman.cn',
      HR: 'https://hr.xiaoman.cn',
      PERSON: 'https://me.xiaoman.cn',
      LOGIN: 'https://login.xiaoman.cn',
      ERP: 'https://erp-api.xiaoman.cn',
      LANTERN: 'http://lantern.xiaoman.cn',
      DISCOVERY: 'https://x.xiaoman.cn'
    }
    break

  default:
    HOSTS = {
      ACTIVE_HELP: 'http://test.k.xiaoman.cn/account/activeHelp',
      FIND_PASSWORD: 'http://test.k.xiaoman.cn/account/findPassword',
      CRM: 'http://test.k.xiaoman.cn',
      SALES: 'http://test.boss.xiaoman.cn',
      HELP: 'help.xiaoman.cn',
      ENTERPRISE: 'test.enterprise.xiaoman.cn',
      HR: 'http://test.enterprise.xiaoman.cn',
      PERSON: 'http://account.enterprise.xiaoman.cn',
      LOGIN: 'http://dev.login.xiaoman.cn',
      ERP: 'http://test.erp-api.xiaoman.cn',
      LANTERN: 'http://dev.lantern.xiaoman.cn',
      DISCOVERY: 'http://dev.x.xiaoman.cn'
    }
    break
}

export default HOSTS