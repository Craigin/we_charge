import URL from 'url'
import axios from 'axios'
import {CODE} from 'common/config'
import dateformat from 'dateformat'
import bodyParser from 'co-body'
import mongodb from 'mongodb'
import xn from '../config'
import api from 'api'
import {getTable, getCollection} from 'db'
import * as commonUtils from 'common/utils'

export default function (router) {
  router.get('/whoami', async function (ctx) {
    let res = ctx.$session
    delete res.supervisor.Password
    ctx.$respond(res)
  })
}
