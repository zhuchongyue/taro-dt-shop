import Taro from '@tarojs/taro';
import { baseUrl, noConsole } from '../config';


export default (options = { method: 'GET', data: {}, url: '' }) => {
  Taro.showLoading({
    title: '加载中'
  })
  if (!noConsole) {
    console.log(`${new Date().toLocaleString()}【${options.url} 】【请求】`, options.data);
  }
  for (const key in options.data) {
    if (options.data.hasOwnProperty(key) && (options.data[key] === undefined || options.data[key] == null)) {
      delete options.data[key];
    }
  }
  return Taro.request({
    url: baseUrl + options.url,
    data: {
      ...options.data
    },
    header: {
      'X-Nideshop-Token': Taro.getStorageSync('token'),
      'Content-Type': 'application/json',
    },
    method: options.method.toUpperCase(),
  }).then((res) => {
    setTimeout(() => {
      Taro.hideLoading();
    }, 200)
    const { statusCode, data } = res;
    if (statusCode >= 200 && statusCode < 300) {
      if (!noConsole) {
        console.log(`${new Date().toLocaleString()}【${options.url} 】【返回】`, res.data);
      }
      if (data.errno !== 0) {
        Taro.showModal({
          title: '错误提示',
          content: res.data.errmsg || res.data.errno,
          showCancel: false,
        });
      }
      return data;
    } else {
      Taro.showModal({
        title: '错误提示',
        content: `网络请求错误，请重试`,
        showCancel: false,
      });
      console.log(`网络请求错误，请重试`);
      return;
    }
  })
}