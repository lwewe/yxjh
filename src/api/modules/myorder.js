import request from '../modules/request'

// 我的订单
export function orderList(data) {
  return request({
    url: '/admin/v1/myorder/orderList',
    method: 'post',
    data: data
  })
}

export function getOrder(data) {
  return request({
    url: '/admin/v1/myorder/getOrder',
    method: 'post',
    data: data
  })
}

export function delOrder(data) {
  return request({
    url: '/admin/v1/myorder/delOrder',
    method: 'post',
    data: data
  })
}

export function dcExportOrder(data) {
  return request({
    url: '/admin/v1/myorder/dcExportOrder',
    method: 'post',
    data: data
  })
}

export function myorderList(data) {
  return request({
    url: '/admin/v1/myorder/myorderList',
    method: 'post',
    data: data
  })
}

export function getMyorder(data) {
  return request({
    url: '/admin/v1/myorder/getMyorder',
    method: 'post',
    data: data
  })
}

export function qporderList(data) {
  return request({
    url: '/admin/v1/myorder/qporderList',
    method: 'post',
    data: data
  })
}

export function getQporder(data) {
  return request({
    url: '/admin/v1/myorder/getQporder',
    method: 'post',
    data: data
  })
}

// 反馈管理
export function feedbackList(data) {
  return request({
    url: '/admin/v1/feedback/feedbackList',
    method: 'post',
    data: data
  })
}

export function getFeedback(data) {
  return request({
    url: '/admin/v1/feedback/getFeedback',
    method: 'post',
    data: data
  })
}

export function editFeedback(data) {
  return request({
    url: '/admin/v1/feedback/editFeedback',
    method: 'post',
    data: data
  })
}

export function delFeedback(data) {
  return request({
    url: '/admin/v1/feedback/delFeedback',
    method: 'post',
    data: data
  })
}

export function ckFeedback(data) {
  return request({
    url: '/admin/v1/feedback/ckFeedback',
    method: 'post',
    data: data
  })
}

export function showFenLen(data) {
  return request({
    url: '/admin/v1/feedback/showFenLen',
    method: 'post',
    data: data
  })
}

export function yjclassList(data) {
  return request({
    url: '/admin/v1/feedback/yjclassList',
    method: 'post',
    data: data
  })
}

export function addYjclass(data) {
  return request({
    url: '/admin/v1/feedback/addYjclass',
    method: 'post',
    data: data
  })
}

export function getYjclass(data) {
  return request({
    url: '/admin/v1/feedback/getYjclass',
    method: 'post',
    data: data
  })
}

export function editYjclass(data) {
  return request({
    url: '/admin/v1/feedback/editYjclass',
    method: 'post',
    data: data
  })
}

export function delYjclass(data) {
  return request({
    url: '/admin/v1/feedback/delYjclass',
    method: 'post',
    data: data
  })
}

export function pxYjclass(data) {
  return request({
    url: '/admin/v1/feedback/pxYjclass',
    method: 'post',
    data: data
  })
}

export function fbYjclass(data) {
  return request({
    url: '/admin/v1/feedback/fbYjclass',
    method: 'post',
    data: data
  })
}

// 辅助管理
export function singleList(data) {
  return request({
    url: '/admin/v1/fuzhu/singleList',
    method: 'post',
    data: data
  })
}

export function getSingle(data) {
  return request({
    url: '/admin/v1/fuzhu/getSingle',
    method: 'post',
    data: data
  })
}

export function editSingle(data) {
  return request({
    url: '/admin/v1/fuzhu/editSingle',
    method: 'post',
    data: data
  })
}

export function bannerList(data) {
  return request({
    url: '/admin/v1/fuzhu/bannerList',
    method: 'post',
    data: data
  })
}

export function getBanner(data) {
  return request({
    url: '/admin/v1/fuzhu/getBanner',
    method: 'post',
    data: data
  })
}

export function editBanner(data) {
  return request({
    url: '/admin/v1/fuzhu/editBanner',
    method: 'post',
    data: data
  })
}

// 密码管理
export function getCode(data) {
  return request({
    url: '/admin/v1/password/getCode',
    method: 'post',
    data: data
  })
}

export function updatePassword(data) {
  return request({
    url: '/admin/v1/password/updatePassword',
    method: 'post',
    data: data
  })
}

// 首页
export function index(data) {
  return request({
    url: '/admin/v1/index/index',
    method: 'post',
    data: data
  })
}

export function yufukuan(data) {
  return request({
    url: '/admin/v1/index/yufukuan',
    method: 'post',
    data: data
  })
}

export default request