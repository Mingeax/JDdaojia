/* 本文件的方法用于对数组变量应用 web storage API 相关的方法. */

// 'setArrayStorage'系列函数仅接收两个数组参数,
// 将其元素从头至尾一一对应成键值对,设置在 web storage 中.
export const setArraySessionStorage = (keys, values) => {
  if (Array.isArray(keys) && Array.isArray(values)) {
    keys.forEach((item, index) => {
      sessionStorage.setItem(item, values[index])
    })
  } else {
    Error('SetArraySessionStorage Received Not-An-Array Arguments')
  }
}
export const setArrayLocalStorage = (keys, values) => {
  if (Array.isArray(keys) && Array.isArray(values)) {
    keys.forEach((item, index) => {
      localStorage.setItem(item, values[index])
    })
  } else {
    Error('SetArrayLocalStorage Received Not-An-Array Arguments')
  }
}

// 'getArrayStorage'系列函数仅接收一个数组参数,
// 将其元素从头至尾一一当作键,获取其在 web storage 中对应的值,
// 然后将所有值排列成数组并返回它.
export const getArraySessionStorage = keys => {
  const result = []
  if (Array.isArray(keys)) {
    keys.forEach(item => {
      result.push(sessionStorage.getItem(item))
    })
  } else {
    Error('GetArraySessionStorage Received Not-An-Array Arguments')
  }
  return result
}
export const getArrayLocalStorage = keys => {
  const result = []
  if (Array.isArray(keys)) {
    keys.forEach(item => {
      result.push(localStorage.getItem(item))
    })
  } else {
    Error('GetArrayLocalStorage Received Not-An-Array Arguments')
  }
  return result
}

// 'removeArrayStorage' 系列函数仅接收一个数组参数,
// 将其元素从头至尾一一当作键,删除它们对应的存储值
export const removeArraySessionStorage = keys => {
  if (Array.isArray(keys)) {
    keys.forEach(item => {
      sessionStorage.removeItem(item)
    })
  } else {
    Error('RemoveArraySessionStorage Received Not-An-Array Arguments')
  }
}
export const removeArrayLocalStorage = keys => {
  if (Array.isArray(keys)) {
    keys.forEach(item => {
      localStorage.removeItem(item)
    })
  } else {
    Error('RemoveArrayLocalStorage Received Not-An-Array Arguments')
  }
}
