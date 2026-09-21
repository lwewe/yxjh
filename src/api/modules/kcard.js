import request from '../modules/request'

// KA列表
export function kaList(data) {
  return request({
    url: '/admin/v1/kace/kaList',
    method: 'post',
    data: data
  })
}

// 添加KA
export function addKa(data) {
  return request({
    url: '/admin/v1/kace/addKa',
    method: 'post',
    data: data
  })
}

// 删除KA
export function delKa(data) {
  return request({
    url: '/admin/v1/kace/delKa',
    method: 'post',
    data: data
  })
}

// 编辑KA名称
export function editName(data) {
  return request({
    url: '/admin/v1/kace/editName',
    method: 'post',
    data: data
  })
}

// 编辑KA手机号
export function editPhone(data) {
  return request({
    url: '/admin/v1/kace/editPhone',
    method: 'post',
    data: data
  })
}

// KA导出
export function kaExport(data) {
  return request({
    url: '/admin/v1/kace/kaExport',
    method: 'post',
    data: data
  })
}

// 卡片列表
export function cardList(data) {
  return request({
    url: '/admin/v1/kace/cardList',
    method: 'post',
    data: data
  })
}

// KA批量PID
export function kaBatchPid(data) {
  return request({
    url: '/admin/v1/kace/kaBatchPid',
    method: 'post',
    data: data
  })
}

// 相册列表
export function albumList(data) {
  return request({
    url: '/admin/v1/kace/albumList',
    method: 'post',
    data: data
  })
}

// 添加相册
export function addAlbum(data) {
  return request({
    url: '/admin/v1/kace/addAlbum',
    method: 'post',
    data: data
  })
}

// 获取相册
export function getAlbum(data) {
  return request({
    url: '/admin/v1/kace/getAlbum',
    method: 'post',
    data: data
  })
}

// 编辑相册
export function editAlbum(data) {
  return request({
    url: '/admin/v1/kace/editAlbum',
    method: 'post',
    data: data
  })
}

// 删除相册
export function delAlbum(data) {
  return request({
    url: '/admin/v1/kace/delAlbum',
    method: 'post',
    data: data
  })
}

// 发布相册
export function fbAlbum(data) {
  return request({
    url: '/admin/v1/kace/fbAlbum',
    method: 'post',
    data: data
  })
}

// 相册来源
export function albumFrom(data) {
  return request({
    url: '/admin/v1/kace/albumFrom',
    method: 'post',
    data: data
  })
}

// KACE产品
export function kaceProduct(data) {
  return request({
    url: '/admin/v1/kace/kaceProduct',
    method: 'post',
    data: data
  })
}

// KC产品分页
export function kcProductPage(data) {
  return request({
    url: '/admin/v1/kace/kcProductPage',
    method: 'post',
    data: data
  })
}

// KC产品更新
export function kcProductUpdate(data) {
  return request({
    url: '/admin/v1/kace/kcProductUpdate',
    method: 'post',
    data: data
  })
}

// KC产品删除
export function kcProductDel(data) {
  return request({
    url: '/admin/v1/kace/kcProductDel',
    method: 'post',
    data: data
  })
}

// 号码列表
export function numList(data) {
  return request({
    url: '/admin/v1/kace/numList',
    method: 'post',
    data: data
  })
}

// 获取号码
export function getNum(data) {
  return request({
    url: '/admin/v1/kace/getNum',
    method: 'post',
    data: data
  })
}

// 编辑号码
export function editNum(data) {
  return request({
    url: '/admin/v1/kace/editNum',
    method: 'post',
    data: data
  })
}

// 删除号码
export function delNum(data) {
  return request({
    url: '/admin/v1/kace/delNum',
    method: 'post',
    data: data
  })
}

// 激活号码
export function jhNum(data) {
  return request({
    url: '/admin/v1/kace/jhNum',
    method: 'post',
    data: data
  })
}

// 激活
export function jihuo(data) {
  return request({
    url: '/admin/v1/kace/jihuo',
    method: 'post',
    data: data
  })
}

// 取消激活
export function qxjihuo(data) {
  return request({
    url: '/admin/v1/kace/qxjihuo',
    method: 'post',
    data: data
  })
}

// 导出号码PID
export function exportNumPid(data) {
  return request({
    url: '/admin/v1/kace/exportNumPid',
    method: 'post',
    data: data
  })
}

// 导入
export function importData(data) {
  return request({
    url: '/admin/v1/kace/import',
    method: 'post',
    data: data
  })
}

// 号码选择
export function numSel(data) {
  return request({
    url: '/admin/v1/kace/numSel',
    method: 'post',
    data: data
  })
}

// 分类列表
export function classifyList(data) {
  return request({
    url: '/admin/v1/kace/classifyList',
    method: 'post',
    data: data
  })
}

// 添加分类
export function addClassify(data) {
  return request({
    url: '/admin/v1/kace/addClassify',
    method: 'post',
    data: data
  })
}

// 获取分类
export function getClassify(data) {
  return request({
    url: '/admin/v1/kace/getClassify',
    method: 'post',
    data: data
  })
}

// 编辑分类
export function editClassify(data) {
  return request({
    url: '/admin/v1/kace/editClassify',
    method: 'post',
    data: data
  })
}

// 删除分类
export function delClassify(data) {
  return request({
    url: '/admin/v1/kace/delClassify',
    method: 'post',
    data: data
  })
}

// 排序分类
export function pxClassify(data) {
  return request({
    url: '/admin/v1/kace/pxClassify',
    method: 'post',
    data: data
  })
}

// 发布分类
export function fbClassify(data) {
  return request({
    url: '/admin/v1/kace/fbClassify',
    method: 'post',
    data: data
  })
}

// 分类产品
export function fenleiProduct(data) {
  return request({
    url: '/admin/v1/kace/fenleiProduct',
    method: 'post',
    data: data
  })
}

// 分类产品分页
export function flProductPage(data) {
  return request({
    url: '/admin/v1/kace/flProductPage',
    method: 'post',
    data: data
  })
}

// 分类产品更新
export function flProductUpdate(data) {
  return request({
    url: '/admin/v1/kace/flProductUpdate',
    method: 'post',
    data: data
  })
}

// 分类产品删除
export function flProductDel(data) {
  return request({
    url: '/admin/v1/kace/flProductDel',
    method: 'post',
    data: data
  })
}

// 图集列表
export function tujiList(data) {
  return request({
    url: '/admin/v1/kace/tujiList',
    method: 'post',
    data: data
  })
}

// 添加图集
export function addTuji(data) {
  return request({
    url: '/admin/v1/kace/addTuji',
    method: 'post',
    data: data
  })
}

// 获取图集
export function getTuji(data) {
  return request({
    url: '/admin/v1/kace/getTuji',
    method: 'post',
    data: data
  })
}

// 编辑图集
export function editTuji(data) {
  return request({
    url: '/admin/v1/kace/editTuji',
    method: 'post',
    data: data
  })
}

// 删除图集
export function delTuji(data) {
  return request({
    url: '/admin/v1/kace/delTuji',
    method: 'post',
    data: data
  })
}

export default request