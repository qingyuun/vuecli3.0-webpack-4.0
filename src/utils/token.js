import { Message } from 'element-ui'
import { ajax } from 'jquery'
import { router } from '../router/router'

const token = function (token) {
  let date = (new Date()).getTime()
  let time = (date - localStorage['tokenTime']) / 1000 > (localStorage['tokenExpires'] - 500)
  if (time || token) {
    ajax({
      type: 'post',
      url: process.env.API_LOGIN,
      data: {
        client_id: 'Web',
        grant_type: 'refresh_token',
        refresh_token: localStorage['tokenRefresh']
      },
      success: function (data) {
        localStorage['token'] = data.access_token
        localStorage['tokenRefresh'] = data.refresh_token
        localStorage['tokenType'] = data.token_type
        localStorage['tokenExpires'] = data.expires_in
        localStorage['tokenTime'] = (new Date()).getTime()
      },
      error: function (data) {
        Message.error('您尚未登录，请重新登录')
        router.push('/login')
      }
    })
  }
  return localStorage['tokenType'] + ' ' + localStorage['token']
}

export default token
