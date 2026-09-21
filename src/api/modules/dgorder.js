import request from '../modules/request'

// 订单列表
export function orderList(data) {
  return request({
    url: '/admin/v1/dgorder/orderList',
    method: 'post',
    data: data
  })
}

// 快递列表
export function kuaidiList(data) {
  return request({
    url: '/admin/v1/dgorder/kuaidiList',
    method: 'post',
    data: data
  })
}

// 获取订单
export function getOrder(data) {
  return request({
    url: '/admin/v1/dgorder/getOrder',
    method: 'post',
    data: data
  })
}

// 快递查询
export function kuaidiQuery(data) {
  return request({
    url: '/admin/v1/dgorder/kuaidiQuery',
    method: 'post',
    data: data
  })
}

// 编辑快递
export function editKuaidi(data) {
  return request({
    url: '/admin/v1/dgorder/editKuaidi',
    method: 'post',
    data: data
  })
}

// 删除订单
export function delOrder(data) {
  return request({
    url: '/admin/v1/dgorder/delOrder',
    method: 'post',
    data: data
  })
}

// 导出订单
export function exportOrder(data) {
  return request({
    url: '/admin/v1/dgorder/exportOrder',
    method: 'post',
    data: data
  })
}

// 代收订单列表
export function dgssOrderList(data) {
  return request({
    url: '/admin/v1/dgorder/dgssOrderList',
    method: 'post',
    data: data
  })
}

// 支出列表
export function expendList(data) {
  return request({
    url: '/admin/v1/dgorder/expendList',
    method: 'post',
    data: data
  })
}

// 订单列表（订单调）
export function dingdanList(data) {
  return request({
    url: '/admin/v1/dgorder/dingdanList',
    method: 'post',
    data: data
  })
}

// 获取订单（订单调）
export function getDingdan(data) {
  return request({
    url: '/admin/v1/dgorder/getDingdan',
    method: 'post',
    data: data
  })
}

// 订单快递列表
export function ddKuaidiList(data) {
  return request({
    url: '/admin/v1/dgorder/ddKuaidiList',
    method: 'post',
    data: data
  })
}

// 订单快递查询
export function ddKuaidiQuery(data) {
  return request({
    url: '/admin/v1/dgorder/ddKuaidiQuery',
    method: 'post',
    data: data
  })
}

// 编辑订单快递
export function editDingdankd(data) {
  return request({
    url: '/admin/v1/dgorder/editDingdankd',
    method: 'post',
    data: data
  })
}

// 删除订单（订单调）
export function delDingdan(data) {
  return request({
    url: '/admin/v1/dgorder/delDingdan',
    method: 'post',
    data: data
  })
}

// 公司月结导出订单
export function gysExportOrder(data) {
  return request({
    url: '/admin/v1/dgorder/gysexportorder',
    method: 'post',
    data: data
  })
}