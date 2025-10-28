import qs from 'qs'
import { Message } from 'element-ui'
import axios from 'axios';
const { gatawayUrl } = window.__gconf
const request = axios.create({
  timeout: 30000,
  method: 'post',
  withCredentials: false
});

axios.defaults.baseURL = gatawayUrl

// 表单序列化
const serialize = data => {
  const list = []
  Object.keys(data).forEach(ele => {
    list.push(`${ ele }=${ data[ele] }`)
  })
  return list.join('&')
}

// HTTPrequest拦截
request.interceptors.request.use(config => {
  config.data = config.data || {}
  config.data['_token'] = localStorage.getItem('token')
  config.data['_agent_id'] = localStorage.getItem('agent_id') || 1
  config.data['lang'] = localStorage.getItem('language') || 'es'
  // headers中配置serialize为true开启序列化
  if (config.method === 'post' && config.headers.serialize) {
    config.data = serialize(config.data)
    delete config.data.serialize
  }
  if (config.dataType == 'formData') {
    config.headers['Content-Type'] = 'multipart/form-data;'
    let formData = new FormData();
    Object.keys(config.data).forEach(key => {
      formData.append(key, config.data[key]);
    })
    config.data = formData
  }
  return config
}, error => {
  return Promise.reject(error)
})

request.interceptors.response.use(response => {
  try {
    if (response.status === 200) {
      if (response.data.err == '1') {
        Message.error(response.data.msg)
        return Promise.reject(new Error(response.data.msg || 'Error'))
      } else {
        return response.data
      }
    } else {
      return response
    }
  } catch (e) {
    console.log(e)
  }
}, error => {
  return Promise.reject(error)
})

export default request
