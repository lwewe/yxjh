import request from '../modules/request'

// 券列表
export function quanList(data) {
  return request({
    url: '/admin/v1/exchange/quanList',
    method: 'post',
    data: data
  })
}

// 添加券
export function addQuan(data) {
  return request({
    url: '/admin/v1/exchange/addQuan',
    method: 'post',
    data: data
  })
}

// 删除券
export function delQuan(data) {
  return request({
    url: '/admin/v1/exchange/delQuan',
    method: 'post',
    data: data
  })
}

// 券导出
export function quanExport(data) {
  return request({
    url: '/admin/v1/exchange/quanExport',
    method: 'post',
    data: data
  })
}

// 权益券列表
export function quanQyqList(data) {
  return request({
    url: '/admin/v1/exchange/quanQyqList',
    method: 'post',
    data: data
  })
}

// 券批量PID
export function quanBatchPid(data) {
  return request({
    url: '/admin/v1/exchange/quanBatchPid',
    method: 'post',
    data: data
  })
}

// 兑换列表
export function exchangeList(data) {
  return request({
    url: '/admin/v1/exchange/exchangeList',
    method: 'post',
    data: data
  })
}

// 添加兑换
export function addExchange(data) {
  return request({
    url: '/admin/v1/exchange/addExchange',
    method: 'post',
    data: data
  })
}

// 获取兑换
export function getExchange(data) {
  return request({
    url: '/admin/v1/exchange/getExchange',
    method: 'post',
    data: data
  })
}

// 编辑兑换
export function editExchange(data) {
  return request({
    url: '/admin/v1/exchange/editExchange',
    method: 'post',
    data: data
  })
}

// 删除兑换
export function delExchange(data) {
  return request({
    url: '/admin/v1/exchange/delExchange',
    method: 'post',
    data: data
  })
}

// 发布兑换
export function fbExchange(data) {
  return request({
    url: '/admin/v1/exchange/fbExchange',
    method: 'post',
    data: data
  })
}

// 兑换券列表
export function exchangeQuanList(data) {
  return request({
    url: '/admin/v1/exchange/exchangeQuanList',
    method: 'post',
    data: data
  })
}

// 获取券信息
export function getQuanInfo(data) {
  return request({
    url: '/admin/v1/exchange/getQuanInfo',
    method: 'post',
    data: data
  })
}

// 编辑券
export function editQuan(data) {
  return request({
    url: '/admin/v1/exchange/editQuan',
    method: 'post',
    data: data
  })
}

// 编辑次数
export function editCishu(data) {
  return request({
    url: '/admin/v1/exchange/editCishu',
    method: 'post',
    data: data
  })
}

// 删除权益券
export function delQyQuan(data) {
  return request({
    url: '/admin/v1/exchange/delQyQuan',
    method: 'post',
    data: data
  })
}

// 发布券
export function fbQuan(data) {
  return request({
    url: '/admin/v1/exchange/fbQuan',
    method: 'post',
    data: data
  })
}

// 激活
export function jihuo(data) {
  return request({
    url: '/admin/v1/exchange/jihuo',
    method: 'post',
    data: data
  })
}

// 取消激活
export function qxjihuo(data) {
  return request({
    url: '/admin/v1/exchange/qxjihuo',
    method: 'post',
    data: data
  })
}

// 导出券GID
export function exportQuangid(data) {
  return request({
    url: '/admin/v1/exchange/exportQuangid',
    method: 'post',
    data: data
  })
}

// 消费记录
export function xfjl(data) {
  return request({
    url: '/admin/v1/exchange/xfjl',
    method: 'post',
    data: data
  })
}

// 券选择
export function quanSel(data) {
  return request({
    url: '/admin/v1/exchange/quanSel',
    method: 'post',
    data: data
  })
}

export default request