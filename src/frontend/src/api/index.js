import axios, {get, post} from 'common/http'
import {HOSTS} from 'config'
axios.defaults.baseURL = '/api/'

export default {
  getWhoami: get('/admin/whoami'),
  getUserInfo: get(HOSTS.ERP + '/user-read/info', {
    config: {
      noInterceptor: true
    }
  }),
  login: get('/public/login'),
  logout: get(HOSTS.ERP + '/account/write/logout', {
    config: {
      noInterceptor: true
    }
  }),
  logoutCompass: get('/public/logout'),

  getHunterAccount: get('/admin/hunter-account'),
  getDiagnose: get('/admin/diagnose'),
  clearOptionCache: get('/admin/clear-option-cache'),
  // 搜索
  getClientAndUser: get('/admin/search-client-user'),
  getClientAndUserByID: get('/admin/search-client-user/id'),
  getClientByID: get('/admin/search-client/id'),
  getUserByID: get('/admin/search-user/id'),
  // 点数
  getClientCredit: get('/admin/client-credit'),
  setClientCredit: get('/admin/client-credit/update'),

  filterUser: get('/admin/filter-user'),
  sendMessage: post('/admin/send-message'),
  sendMail: post('/mail/send-mail'),
  getApiList: get('/mail/api-list'),
  setRenderMailOptions: post('/mail/set-render-mail-options'),
  deleteMailOptions: get('/mail/delete-render-mail-options'),
  revokeBatchMessage: get('/admin/revoke-batch-message'),
  // eagle_eye
  getEagleEyeOlQuery: get('/proxy/eagleEyeOlQuery'),
  getEagleEyeFlowQuery: get('/proxy/eagleEyeFlowQuery'),
  // download
  getUseStatsFile: get('/download/stats-file/:type/?dateRange=xxx'),
  // getEmailsCount
  getEmailsCount: get('/query/emailCount', {config: {timeout: 1000 * 60 * 2}}),
  queryEagleEyeRaw: post('/query/eagleEyeRaw'),

  dataTableSchema: post((data, options, extra) => `dataTables/${extra.type}/${extra.database}/${extra.table}/schema`),
  dataTableSelect: post((data, options, extra) => `dataTables/${extra.type}/${extra.database}/${extra.table}/select`),
  dataTableCreate: post((data, options, extra) => `dataTables/${extra.type}/${extra.database}/${extra.table}/create`),
  dataTableUpdate: post((data, options, extra) => `dataTables/${extra.type}/${extra.database}/${extra.table}/update`),
  dataTableDelete: post((data, options, extra) => `dataTables/${extra.type}/${extra.database}/${extra.table}/delete`),

  postListChargeByRooms: post('/handle/listChargeByRooms'),
  postCountCharge: post('/handle/countCharge'),
  postListChargeByZone: post('/handle/listChargeByZone'),
  countZoneChargeByTime: post('/handle/countZoneChargeByTime'),
  listUnrecordRooms: post('/handle/listUnrecordRooms'),
  listCompanyChargeByZone: post('/handle/listCompanyChargeByZone'),
  listChargeByCompany: post('/handle/listChargeByCompany'),
  updatePayByCompany: post('/handle/updatePayByCompany'),

  updatePayByUsers: post('/handle/updatePayByUsers'),
  updateAddtionalFee: post('/handle/updateAddtionalFee')
}
