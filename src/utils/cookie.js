import { Message } from 'element-ui'
import { ajax } from 'jquery'
// import { router } from '../router/router'

const cookie = {
  get (name) {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    let arr = document.cookie.match(reg)
    if (arr) { return unescape(arr[2]) } else { return null }
  },
  set (name, value, day, domain) {
    if (day !== 0) { // 当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
      let expires = day * 1000
      let date = new Date(new Date().getTime() + expires)
      document.cookie = name + '=' + escape(value) + ';expires=' + date.toUTCString() + ';domain=' + escape(domain) + ';path=/'
    } else {
      document.cookie = name + '=' + escape(value)
    }
  },
  delete (name) {
    this.set(name, '', -1000, location.hostname)
    location.reload()
  },
  refresh () {
    let _this = this
    ajax({
      type: 'post',
      url: process.env.VUE_APP_LOGIN,
      data: {
        client_id: 'Web',
        grant_type: 'refresh_token',
        refresh_token: this.get('tokenRefresh')
      },
      success: function (data) {
        _this.set('tokenRefresh', data.refresh_token, data.expires_in * 24, location.hostname)
        _this.set('tokenType', data.token_type, data.expires_in * 24, location.hostname)
        _this.set('token', data.access_token, data.expires_in, location.hostname)
        _this.set('tokenExpires', data.expires_in, data.expires_in * 24, location.hostname)
        _this.set('tokenTime', (new Date()).getTime(), data.expires_in * 24, location.hostname)
      },
      error: function (data) {
        Message.error('您尚未登录，请重新登录')
      }
    })
    return this.get('tokenType') + ' ' + this.get('token')// data.token_type + ' ' + data.access_token
  },
  cookieToken () {
    let expiresIn = this.get('tokenExpires')// 有效时长
    let tokenTime = this.get('tokenTime')// 存入时间
    let tokenType = this.get('tokenType')
    let token = this.get('token')
    let date = (new Date()).getTime()// 现在时间
    if ((date - tokenTime) / 1000 > expiresIn - 500) {
      this.refresh()
    } else {
      return tokenType + ' ' + token
    }
  }
}

export default cookie
