import Vue from 'vue'
import Router from 'vue-router'
import DATA_TABLE_ROUTES from './dataTables/index'

// const RedirectPortal = resolve => require(['components/exception/redirectPortal'], resolve)
const PageLost = resolve => require(['components/exception/PageLost'], resolve)
const Login = resolve => require(['channel/login'], resolve)
const WriteRecord = resolve => require(['channel/writeRecord'], resolve)
const ChargeStats = resolve => require(['channel/chargeStats'], resolve)
const CompanyCharge = resolve => require(['channel/companyCharge'], resolve)
const CompanyChargeShouJu = resolve => require(['channel/companyCharge/shouju'], resolve)
const CompanyChargeNotice = resolve => require(['channel/companyCharge/notice'], resolve)
const CompanyChargeCount = resolve => require(['channel/companyCharge/count'], resolve)
const PersonCharge = resolve => require(['channel/personCharge'], resolve)
const PersonChargeShouJu = resolve => require(['channel/personCharge/shouju'], resolve)
const PersonChargeShouJuByZone = resolve => require(['channel/personCharge/shoujuByZone'], resolve)
const PersonChargeNotice = resolve => require(['channel/personCharge/notice'], resolve)
const UnFinshRecord = resolve => require(['channel/unFinshRecord'], resolve)
const Sys = resolve => require(['channel/sys'], resolve)
// const UseReport = resolve => require(['channel/useReport'], resolve)
// const UseFlow = resolve => require(['channel/useFlow'], resolve)
// const Recommendation = resolve => require(['channel/recommendation'], resolve)
// const ApiUsage = resolve => require(['channel/apiUsage'], resolve)
// const Diagnose = resolve => require(['channel/diagnose'], resolve)
// const IndustryPackageImport = resolve => require(['channel/industryPackageImport'], resolve)
// const IndustryReportDetail = resolve => require(['channel/industryReportDetail'], resolve)
// const LogTailDetail = resolve => require(['channel/logTailDetail'], resolve)
// const SendMessage = resolve => require(['channel/sendMessage'], resolve)
// const SendMail = resolve => require(['channel/sendMail'], resolve)
// const Dist = resolve => require(['channel/dist'], resolve)
// const Redis = resolve => require(['channel/redis'], resolve)

Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      auth: false
    }
  },
  {
    path: '/charge/manage/meter-reading/write',
    name: 'WriteRecord',
    component: WriteRecord,
    meta: {
      auth: true
    }
  },
  {
    path: '/charge/manage/meter-reading/unfinsh',
    name: 'UnFinshRecord',
    component: UnFinshRecord,
    meta: {
      auth: true
    }
  },
  {
    path: '/charge/manage/stats',
    name: 'ChargeStats',
    component: ChargeStats,
    meta: {
      auth: true
    }
  },
  {
    path: '/charge/manage/pay/company',
    name: 'CompanyCharge',
    component: CompanyCharge,
    meta: {
      auth: true
    }
  },
  {
    path: '/charge/manage/pay/company/shouju',
    name: 'CompanyChargeShouJu',
    component: CompanyChargeShouJu,
    meta: {
      auth: true
    }
  },
  {
    path: '/charge/manage/pay/company/notice',
    name: 'CompanyChargeNotice',
    component: CompanyChargeNotice,
    meta: {
      auth: true
    }
  },
  {
    path: '/charge/manage/pay/company/count',
    name: 'CompanyChargeCount',
    component: CompanyChargeCount,
    meta: {
      auth: true
    }
  },
  {
    path: '/charge/manage/pay/person',
    name: 'PersonCharge',
    component: PersonCharge,
    meta: {
      auth: true
    }
  },
  {
    path: '/charge/manage/pay/person/shouju',
    name: 'PersonChargeShouJu',
    component: PersonChargeShouJu,
    meta: {
      auth: true
    }
  },
  {
    path: '/charge/manage/pay/person/shoujubyzone',
    name: 'PersonChargeShouJuByZone',
    component: PersonChargeShouJuByZone,
    meta: {
      auth: true
    }
  },
  {
    path: '/charge/manage/pay/person/notice',
    name: 'PersonChargeNotice',
    component: PersonChargeNotice,
    meta: {
      auth: true
    }
  },
  {
    path: '/system/setting/sys',
    name: 'Sys',
    component: Sys,
    meta: {
      auth: true
    }
  },
  ...DATA_TABLE_ROUTES,
  {
    path: '*',
    name: 'PageLost',
    component: PageLost,
    meta: {
      // auth: true
      title: '页面不存在'
    }
  }
]

export default new Router({
  mode: 'history',
  base: __webpack_public_path__,
  routes
})
