import request from '../modules/request'

// 订单列表
export function scorderList(data) {
  return request({
    url: '/admin/v1/scorder/scorderList',
    method: 'post',
    data: data
  })
}

// 获取订单详情
export function getScorder(data) {
  return request({
    url: '/admin/v1/scorder/getScorder',
    method: 'post',
    data: data
  })
}

// 快递列表
export function kuaidiList(data) {
  return request({
    url: '/admin/v1/scorder/kuaidiList',
    method: 'post',
    data: data
  })
}

// 快递查询
export function kuaidiQuery(data) {
  return request({
    url: '/admin/v1/scorder/kuaidiQuery',
    method: 'post',
    data: data
  })
}

// 编辑快递
export function editKuaidi(data) {
  return request({
    url: '/admin/v1/scorder/editKuaidi',
    method: 'post',
    data: data
  })
}

// 删除订单
export function delScorder(data) {
  return request({
    url: '/admin/v1/scorder/delScorder',
    method: 'post',
    data: data
  })
}

// 更新单个订单
export function gxOneScorder(data) {
  return request({
    url: '/admin/v1/scorder/gxOneScorder',
    method: 'post',
    data: data
  })
}

// 更新所有订单
export function gxAllScorder(data) {
  return request({
    url: '/admin/v1/scorder/gxAllScorder',
    method: 'post',
    data: data
  })
}

// 提交订单
export function subScorder(data) {
  return request({
    url: '/admin/v1/scorder/subScorder',
    method: 'post',
    data: data
  })
}

// 导出订单
export function exportScorderall(data) {
  return request({
    url: '/admin/v1/scorder/exportScorderall',
    method: 'post',
    data: data
  })
}

// 导出邮政订单
export function exportYzhorder(data) {
  return request({
    url: '/admin/v1/scorder/exportYzhorder',
    method: 'post',
    data: data
  })
}

// 快递公司列表
export function expressList(data) {
  return request({
    url: '/admin/v1/scorder/expressList',
    method: 'post',
    data: data
  })
}

// 添加快递公司
export function addExpress(data) {
  return request({
    url: '/admin/v1/scorder/addExpress',
    method: 'post',
    data: data
  })
}

// 获取快递公司
export function getExpress(data) {
  return request({
    url: '/admin/v1/scorder/getExpress',
    method: 'post',
    data: data
  })
}

// 编辑快递公司
export function editExpress(data) {
  return request({
    url: '/admin/v1/scorder/editExpress',
    method: 'post',
    data: data
  })
}

// 删除快递公司
export function delExpress(data) {
  return request({
    url: '/admin/v1/scorder/delExpress',
    method: 'post',
    data: data
  })
}

// 编辑排序
export function editPx(data) {
  return request({
    url: '/admin/v1/scorder/editPx',
    method: 'post',
    data: data
  })
}

// 获取订单(钉单)
export function getDingdan(data) {
  return request({
    url: '/admin/v1/scorder/getDingdan',
    method: 'post',
    data: data
  })
}

// 钉单快递列表
export function ddKuaidiList(data) {
  return request({
    url: '/admin/v1/scorder/ddKuaidiList',
    method: 'post',
    data: data
  })
}

// 钉单快递查询
export function ddKuaidiQuery(data) {
  return request({
    url: '/admin/v1/scorder/ddKuaidiQuery',
    method: 'post',
    data: data
  })
}
export function dingdanList(data) {
  return request({
    url: '/admin/v1/scorder/dingdanList',
    method: 'post',
    data: data
  })
}

// 编辑钉单快递
export function editDingdankd(data) {
  return request({
    url: '/admin/v1/scorder/editDingdankd',
    method: 'post',
    data: data
  })
}

// 删除钉单
export function delDingdan(data) {
  return request({
    url: '/admin/v1/scorder/delDingdan',
    method: 'post',
    data: data
  })
}

// 导出钉单
export function exportDingdan(data) {
  return request({
    url: '/admin/v1/scorder/exportDingdan',
    method: 'post',
    data: data
  })
}

// 导入钉单
export function importDingdan(data) {
  return request({
    url: '/admin/v1/scorder/importDingdan',
    method: 'post',
    data: data
  })
}

// 客户订单列表
export function khorderList(data) {
  return request({
    url: '/admin/v1/scorder/khorderList',
    method: 'post',
    data: data
  })
}

// 获取客户订单
export function getKhorder(data) {
  return request({
    url: '/admin/v1/scorder/getKhorder',
    method: 'post',
    data: data
  })
}

// 客户快递列表
export function khKuaidiList(data) {
  return request({
    url: '/admin/v1/scorder/khKuaidiList',
    method: 'post',
    data: data
  })
}

// 客户快递查询
export function khKuaidiQuery(data) {
  return request({
    url: '/admin/v1/scorder/khKuaidiQuery',
    method: 'post',
    data: data
  })
}

// 编辑客户订单快递
export function editKhorderkd(data) {
  return request({
    url: '/admin/v1/scorder/editKhorderkd',
    method: 'post',
    data: data
  })
}

// 短信通知客户订单
export function smsKhorder(data) {
  return request({
    url: '/admin/v1/scorder/smsKhorder',
    method: 'post',
    data: data
  })
}

// 删除客户订单
export function delKhorder(data) {
  return request({
    url: '/admin/v1/scorder/delKhorder',
    method: 'post',
    data: data
  })
}

// 导出客户订单
export function exportKhorder(data) {
  return request({
    url: '/admin/v1/scorder/exportKhorder',
    method: 'post',
    data: data
  })
}

// 导入客户订单
export function importKhorder(data) {
  return request({
    url: '/admin/v1/scorder/importKhorder',
    method: 'post',
    data: data
  })
}