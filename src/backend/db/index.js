import xn from '../config'
import * as mysql_ from './mysql'
import * as mongo_ from './mongo'
// import redis_, * as redis__ from './redis'

let {
  config: {
    database: mysqlConfig,
    mongo: mongoConfig
  }
} = xn

mysql_.setDBConfig(mysqlConfig)
export var mysql = mysql_.getDBRoot()
export var getTable = mysql_.getTable
export var transformRowDate = mysql_.transformRowDate
export var backup = mysql_.backup

mongo_.setConfig(mongoConfig)
export var mongo = mongo_.getMongo()
export var getCollection = mongo_.getCollection

// export var redis = redis_
// export var redisFactory = redis__.redisFactory

//定时备份mysql数据到指定目录
let add0 = (m) => {
  return m < 10 ? '0' + m : m
}
let formatDate = function (time) {
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()
  return year + "-" + add0(month) + "-" + add0(day)
}
let target_dir = 'D:/workspace/we-charge/data/'
let mysqlDump = require('mysqldump')

setInterval(() => {
  var dest = target_dir + formatDate(new Date()) + '.sql'
  mysqlDump({
    host: mysqlConfig.we_charge.host,
    user: mysqlConfig.we_charge.username,
    password: mysqlConfig.we_charge.password,
    database: 'we_charge',
    dest:dest // destination file
  },function(err){
    if(err)return console.log('======mysqldump err:',err.message);
    console.log('dump end')
    // create data.sql file;
  })
},24 * 60 * 60 * 1000)

