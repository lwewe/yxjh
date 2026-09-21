import request from '../modules/request'

export function navList(data) {
  return request({
    url: '/admin/v1/video/navList',
    method: 'post',
    data: data
  })
}

export function addNav(data) {
  return request({
    url: '/admin/v1/video/addNav',
    method: 'post',
    data: data
  })
}

export function getNav(data) {
  return request({
    url: '/admin/v1/video/getNav',
    method: 'post',
    data: data
  })
}

export function editNav(data) {
  return request({
    url: '/admin/v1/video/editNav',
    method: 'post',
    data: data
  })
}

export function delNav(data) {
  return request({
    url: '/admin/v1/video/delNav',
    method: 'post',
    data: data
  })
}

export function pxNav(data) {
  return request({
    url: '/admin/v1/video/pxNav',
    method: 'post',
    data: data
  })
}

export function fbNav(data) {
  return request({
    url: '/admin/v1/video/fbNav',
    method: 'post',
    data: data
  })
}

export function cityList(data) {
  return request({
    url: '/admin/v1/video/cityList',
    method: 'post',
    data: data
  })
}

export function updateXuankuaCity(data) {
  return request({
    url: '/admin/v1/video/updateXuankuaCity',
    method: 'post',
    data: data
  })
}

export function updateQipiaoCity(data) {
  return request({
    url: '/admin/v1/video/updateQipiaoCity',
    method: 'post',
    data: data
  })
}

export function hotCity(data) {
  return request({
    url: '/admin/v1/video/hotCity',
    method: 'post',
    data: data
  })
}

export function diquList(data) {
  return request({
    url: '/admin/v1/video/diquList',
    method: 'post',
    data: data
  })
}

export function updateXuankuaDiqu(data) {
  return request({
    url: '/admin/v1/video/updateXuankuaDiqu',
    method: 'post',
    data: data
  })
}

export function updateQipiaoDiqu(data) {
  return request({
    url: '/admin/v1/video/updateQipiaoDiqu',
    method: 'post',
    data: data
  })
}

export function cinemaList(data) {
  return request({
    url: '/admin/v1/video/cinemaList',
    method: 'post',
    data: data
  })
}

export function editCinema(data) {
  return request({
    url: '/admin/v1/video/editCinema',
    method: 'post',
    data: data
  })
}

export function cinemaCityList(data) {
  return request({
    url: '/admin/v1/video/cinemaCityList',
    method: 'post',
    data: data
  })
}

export function cinemaDiquList(data) {
  return request({
    url: '/admin/v1/video/cinemaDiquList',
    method: 'post',
    data: data
  })
}

export function updateXuankuaCinema(data) {
  return request({
    url: '/admin/v1/video/updateXuankuaCinema',
    method: 'post',
    data: data
  })
}

export function updateQipiaoCinema(data) {
  return request({
    url: '/admin/v1/video/updateQipiaoCinema',
    method: 'post',
    data: data
  })
}

export function exportCinema(data) {
  return request({
    url: '/admin/v1/video/exportCinema',
    method: 'post',
    data: data
  })
}


export function booksNavList(data) {
  return request({
    url: '/admin/v1/books/navList',
    method: 'post',
    data: data
  })
}

export function booksAddNav(data) {
  return request({
    url: '/admin/v1/books/addNav',
    method: 'post',
    data: data
  })
}

export function booksGetNav(data) {
  return request({
    url: '/admin/v1/books/getNav',
    method: 'post',
    data: data
  })
}

export function booksEditNav(data) {
  return request({
    url: '/admin/v1/books/editNav',
    method: 'post',
    data: data
  })
}

export function booksDelNav(data) {
  return request({
    url: '/admin/v1/books/delNav',
    method: 'post',
    data: data
  })
}

export function booksPxNav(data) {
  return request({
    url: '/admin/v1/books/pxNav',
    method: 'post',
    data: data
  })
}

export function booksFbNav(data) {
  return request({
    url: '/admin/v1/books/fbNav',
    method: 'post',
    data: data
  })
}

// ========== 图书分类管理 ==========
export function booksTsclassList(data) {
  return request({
    url: '/admin/v1/books/tsclassList',
    method: 'post',
    data: data
  })
}

export function booksAddTsclass(data) {
  return request({
    url: '/admin/v1/books/addTsclass',
    method: 'post',
    data: data
  })
}

export function booksGetTsclass(data) {
  return request({
    url: '/admin/v1/books/getTsclass',
    method: 'post',
    data: data
  })
}

export function booksEditTsclass(data) {
  return request({
    url: '/admin/v1/books/editTsclass',
    method: 'post',
    data: data
  })
}

export function booksDelTsclass(data) {
  return request({
    url: '/admin/v1/books/delTsclass',
    method: 'post',
    data: data
  })
}

export function booksFbTsclass(data) {
  return request({
    url: '/admin/v1/books/fbTsclass',
    method: 'post',
    data: data
  })
}

// ========== 图书分类下的图书管理 ==========
export function booksTsclassBooksList(data) {
  return request({
    url: '/admin/v1/books/tsclassBooksList',
    method: 'post',
    data: data
  })
}

export function booksTsclassBooksPage(data) {
  return request({
    url: '/admin/v1/books/tsclassBooksPage',
    method: 'post',
    data: data
  })
}

export function booksTsclassBooksUpdate(data) {
  return request({
    url: '/admin/v1/books/tsclassBooksUpdate',
    method: 'post',
    data: data
  })
}

export function booksTsclassBooksDelete(data) {
  return request({
    url: '/admin/v1/books/tsclassBooksDelete',
    method: 'post',
    data: data
  })
}

// ========== 分类管理 ==========
export function booksClassifyList(data) {
  return request({
    url: '/admin/v1/books/classifyList',
    method: 'post',
    data: data
  })
}

export function booksAddClassify(data) {
  return request({
    url: '/admin/v1/books/addClassify',
    method: 'post',
    data: data
  })
}

export function booksGetClassify(data) {
  return request({
    url: '/admin/v1/books/getClassify',
    method: 'post',
    data: data
  })
}

export function booksEditClassify(data) {
  return request({
    url: '/admin/v1/books/editClassify',
    method: 'post',
    data: data
  })
}

export function booksDelClassify(data) {
  return request({
    url: '/admin/v1/books/delClassify',
    method: 'post',
    data: data
  })
}

export function booksPxClassify(data) {
  return request({
    url: '/admin/v1/books/pxClassify',
    method: 'post',
    data: data
  })
}

// ========== 图书管理 ==========
export function booksBooksList(data) {
  return request({
    url: '/admin/v1/books/booksList',
    method: 'post',
    data: data
  })
}

export function booksGetBooks(data) {
  return request({
    url: '/admin/v1/books/getBooks',
    method: 'post',
    data: data
  })
}

export function booksEditBooks(data) {
  return request({
    url: '/admin/v1/books/editBooks',
    method: 'post',
    data: data
  })
}

export function booksDelBooks(data) {
  return request({
    url: '/admin/v1/books/delBooks',
    method: 'post',
    data: data
  })
}

export function booksPxBooks(data) {
  return request({
    url: '/admin/v1/books/pxBooks',
    method: 'post',
    data: data
  })
}

export function booksSwitchStatus(data) {
  return request({
    url: '/admin/v1/books/switchStatus',
    method: 'post',
    data: data
  })
}

export function booksEditPriceData(data) {
  return request({
    url: '/admin/v1/books/editPriceData',
    method: 'post',
    data: data
  })
}

// ========== 图书特殊操作 ==========
export function booksBookstsflclass(data) {
  return request({
    url: '/admin/v1/books/bookstsflclass',
    method: 'post',
    data: data
  })
}

export function booksUpdateOneBook(data) {
  return request({
    url: '/admin/v1/books/updateOneBook',
    method: 'post',
    data: data
  })
}

export function booksUpdateAllBooks(data) {
  return request({
    url: '/admin/v1/books/updateAllBooks',
    method: 'post',
    data: data
  })
}

export function booksUpdateBookContent(data) {
  return request({
    url: '/admin/v1/books/updateBookContent',
    method: 'post',
    data: data
  })
}

// ========== 图书分类列表 ==========
export function booksTsflclassList(data) {
  return request({
    url: '/admin/v1/books/tsflclassList',
    method: 'post',
    data: data
  })
}

export function booksTjtsflclass(data) {
  return request({
    url: '/admin/v1/books/tjtsflclass',
    method: 'post',
    data: data
  })
}
export default request