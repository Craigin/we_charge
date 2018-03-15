import xn from '../config'
import formidable from 'formidable'

export function passThroughResponse (koajsResponse, axiosResponse) {
  let {status, statusText, headers, data} = axiosResponse
  koajsResponse.set(headers)
  Object.assign(koajsResponse, {
    status,
    message: statusText,
    body: data
  })
}

export function parseForm (req, options) {
  let {
    uploadDir = 'uploads'
  } = xn.config
  return new Promise((resolve, reject) => {
    new formidable.IncomingForm({
      // encoding: 'utf-8',
      uploadDir,
      keepExtensions: true,
      ...options
    }).parse(req, (err, fields, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve({
        fields,
        files
      })
    })
  })
}

export function sleep (time) {
  return new Promise(resolve => setTimeout(resolve, time*1000))
}

export function parseMongoConnectString (str) {
  // "mongodb://discovery_ro:921SkYPcOR8r7FoBB@10.29.180.184:37017/discovery"
  // "mongodb://localhost:27017/discovery"
  if (!str) return

  str = str.replace('mongodb://', '')
  if (str.indexOf('@') === -1) {
    str = ':@' + str
  }
  let array = str.split(':')
  let username = array[0]
  let password = array[1].split('@')[0]
  let host = array[1].split('@')[1]
  let port = array[2].split('/')[0]
  let database = array[2].split('/')[1]
  return {
    username,
    password,
    host,
    port,
    database
  }
}

let {
  env: {
    ENV = 'dev'
  }
} = process

export const PSKEY = `pskey-${ENV}`
