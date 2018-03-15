import axios from 'axios'
import qs from 'qs'
import {CODE} from './config'
import emitter from './emitter'

// http config
const TIMEOUT_TIME = 30000
// const THRESHOLD_TIME = 500

axios.defaults.timeout = TIMEOUT_TIME
axios.defaults.crossOrigin = true
axios.defaults.withCredentials = true
// axios.defaults.baseURL = '/api/'

axios.interceptors.request.use(
  config => {
    emitter.emit('http-start')
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  response => {
    emitter.emit('http-success')
    if (response.config.noInterceptor) {
      return response
    }
    let {
      data: {
        code
      }
    } = response

    for (let key in CODE) {
      let value = CODE[key]
      if (code !== value) {
        continue
      }
      if (key === 'SUCCESS') {
        return response
      }
      emitter.emit(key)
      console.error('response with error', key, response)
      return Promise.reject(response)
    }
    console.error('response with unknown error', response)
    return Promise.reject(response)
  },
  error => {
    return Promise.reject(error)
  }
)

export default axios

function fetchData (promise, options = {}) {
  let {dataLevel = 'data.data'} = options
  if (dataLevel === 'raw') {
    return promise
  }
  return promise.then(response => {
    if (dataLevel === 'data') {
      return response.data
    }
    return response.data.data
  })
}

export function get (url, apiOptions = {}) {
  let {config} = apiOptions
  return (params = {}, options, extras) => {
    let url1 = typeof url === 'function' ? url(params, options, extras) : url
    return fetchData(axios.get(url1, {...config, params}), options)
  }
}

export function post (url, apiOptions = {}) {
  let {bodyType, config} = apiOptions
  return (data = {}, options = {}, extras) => {
    let url1 = typeof url === 'function' ? url(data, options, extras) : url
    if (bodyType === 'qs') {
      data = qs.stringify(data)
    }
    return fetchData(axios.post(url1, data, {...config, ...options.config}), options)
  }
}
