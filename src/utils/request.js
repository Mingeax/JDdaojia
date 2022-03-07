import axios from 'axios'

const instance = axios.create({
  // 注:端口号对应后端端口.
  baseURL: 'http://192.168.50.46:3000/api/',
  timeout: 1000,
  headers: {
    'content-type': 'application/json'
  }
})

export const get = (url, config = {}) => {
  return new Promise((resolve, reject) => {
    instance.get(url, config)
      .then(res => {
        resolve(res.data)
      },
      err => {
        console.log('err:', err)
        reject(err)
      })
  })
}

export const post = (url, data, config = {}) => {
  return new Promise((resolve, reject) => {
    instance.post(url, data, config)
      .then(res => {
        resolve(res.data)
      },
      err => {
        console.log('err:', err)
        reject(err)
      })
  })
}
