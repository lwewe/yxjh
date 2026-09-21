import request from '../modules/request'

// 抖音订单
export function dyorderList(data) {
  return request({
    url: '/admin/v1/order/dyorderList',
    method: 'post',
    data: data
  })
}

export function getDyorder(data) {
  return request({
    url: '/admin/v1/order/getDyorder',
    method: 'post',
    data: data
  })
}

export function delDyorder(data) {
  return request({
    url: '/admin/v1/order/delDyorder',
    method: 'post',
    data: data
  })
}

export function dyExportOrder(data) {
  return request({
    url: '/admin/v1/order/dyExportOrder',
    method: 'post',
    data: data
  })
}

export function gxxkDyorder(data) {
  return request({
    url: '/admin/v1/order/gxxkDyorder',
    method: 'post',
    data: data
  })
}

export function gxqpDyorder(data) {
  return request({
    url: '/admin/v1/order/gxqpDyorder',
    method: 'post',
    data: data
  })
}

// 快手订单
export function kqorderList(data) {
  return request({
    url: '/admin/v1/order/kqorderList',
    method: 'post',
    data: data
  })
}

export function getKqorder(data) {
  return request({
    url: '/admin/v1/order/getKqorder',
    method: 'post',
    data: data
  })
}

export function delKqorder(data) {
  return request({
    url: '/admin/v1/order/delKqorder',
    method: 'post',
    data: data
  })
}

export function kqExportOrder(data) {
  return request({
    url: '/admin/v1/order/kqExportOrder',
    method: 'post',
    data: data
  })
}

// 自采订单
export function zcorderList(data) {
  return request({
    url: '/admin/v1/order/zcorderList',
    method: 'post',
    data: data
  })
}

export function getZcorder(data) {
  return request({
    url: '/admin/v1/order/getZcorder',
    method: 'post',
    data: data
  })
}

export function delZcorder(data) {
  return request({
    url: '/admin/v1/order/delZcorder',
    method: 'post',
    data: data
  })
}

export function zcExportOrder(data) {
  return request({
    url: '/admin/v1/order/zcExportOrder',
    method: 'post',
    data: data
  })
}

export function gxtlZcorder(data) {
  return request({
    url: '/admin/v1/order/gxtlZcorder',
    method: 'post',
    data: data
  })
}

export function subZcorder(data) {
  return request({
    url: '/admin/v1/order/subZcorder',
    method: 'post',
    data: data
  })
}

// 原创订单
export function ycorderList(data) {
  return request({
    url: '/admin/v1/order/ycorderList',
    method: 'post',
    data: data
  })
}

export function getYcorder(data) {
  return request({
    url: '/admin/v1/order/getYcorder',
    method: 'post',
    data: data
  })
}

export function delYcorder(data) {
  return request({
    url: '/admin/v1/order/delYcorder',
    method: 'post',
    data: data
  })
}

export function ycExportOrder(data) {
  return request({
    url: '/admin/v1/order/ycExportOrder',
    method: 'post',
    data: data
  })
}

export function gxYcorder(data) {
  return request({
    url: '/admin/v1/order/gxYcorder',
    method: 'post',
    data: data
  })
}

// 图书订单
export function tsorderList(data) {
  return request({
    url: '/admin/v1/order/tsorderList',
    method: 'post',
    data: data
  })
}

export function getTsorder(data) {
  return request({
    url: '/admin/v1/order/getTsorder',
    method: 'post',
    data: data
  })
}

export function delTsorder(data) {
  return request({
    url: '/admin/v1/order/delTsorder',
    method: 'post',
    data: data
  })
}

export function tsExportOrder(data) {
  return request({
    url: '/admin/v1/order/tsExportOrder',
    method: 'post',
    data: data
  })
}

export function gxTsorder(data) {
  return request({
    url: '/admin/v1/order/gxTsorder',
    method: 'post',
    data: data
  })
}

export function subTsorder(data) {
  return request({
    url: '/admin/v1/order/subTsorder',
    method: 'post',
    data: data
  })
}

export function quxiaoTsorder(data) {
  return request({
    url: '/admin/v1/order/quxiaoTsorder',
    method: 'post',
    data: data
  })
}

// 剧情订单
export function jqorderList(data) {
  return request({
    url: '/admin/v1/order/jqorderList',
    method: 'post',
    data: data
  })
}

export function getJqorder(data) {
  return request({
    url: '/admin/v1/order/getJqorder',
    method: 'post',
    data: data
  })
}

export function delJqorder(data) {
  return request({
    url: '/admin/v1/order/delTsorder',
    method: 'post',
    data: data
  })
}

export function jqExportOrder(data) {
  return request({
    url: '/admin/v1/order/jqExportOrder',
    method: 'post',
    data: data
  })
}

export function gxJqorder(data) {
  return request({
    url: '/admin/v1/order/gxJqorder',
    method: 'post',
    data: data
  })
}

export function qxJqorder(data) {
  return request({
    url: '/admin/v1/order/qxJqorder',
    method: 'post',
    data: data
  })
}

export default request