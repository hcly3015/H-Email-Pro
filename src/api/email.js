import request from '@/http/request' // 正式API接口

export function getEmails (params) {
  return request({
    url: 'api/emails',
    method: 'get',
    data: params
  })
}

export function getEmail (params) {
  return request({
    url: 'api/email',
    method: 'get',
    data: params
  })
}
