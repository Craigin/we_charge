import xn from '../config'
import {get, post} from 'common/http'

const rawQueryTransform = data => {
  return {
    code: 0,
    message: 'success',
    data: JSON.parse(data)
  }
}

const rawQueryConfig = {
  transformResponse: [
    rawQueryTransform // 由于这个远程接口不遵循我们通用的约定，需要transform一下
  ]
}

export default {
}
