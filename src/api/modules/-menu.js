 

import request from '@/utils/1request'

export function getMenuList() {
  return request({
    url: '/admin/v1/getMenu',
    method: 'post'
  })
}