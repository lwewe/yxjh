import request from '../modules/request'
// 登录接口
export function login(username, password) {
  const params = new URLSearchParams()
  params.append('username', username)
  params.append('password', password)
  return request({
    url: '/admin/v1/login',
    method: 'post',
    data: params
  })
}

// 登出接口
export function logout() {
  return request({
    url: '/admin/v1/logout',
    method: 'post'
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/admin/v1/user/info',
    method: 'get'
  })
}
//查看配置
export function getWebConfig() {
  return request({
    url: '/admin/v1/webconfig/index',
    method: 'post'
  })
}
export function clearPermissionCache(params) {
  return request({
    url: '/admin/v1/clearPermissionCache',
    method: 'post',
    data: params
  })
}
export function viewPermissionCache(data) {
  return request({
    url: '/admin/v1/viewPermissionCache',
    method: 'post',
    data: data  
  })
}

export function getBalance() {
  return request({
    url: '/admin/v1/index/yufukuan',
    method: 'post'
  })
}
//保存配置
export function saveWebConfig(data) {
  return request({
    url: '/admin/v1/webconfig/addData',
    method: 'post',
    data: data
  })
}

export function getMenuList() {
  return request({
    url: '/admin/v1/getMenu',
    method: 'post'
  })
}

//图片上传
export function uploadImg() {
  return request({
    url: '/admin/v1/upload',
    method: 'post'
  })
}

//基本设置
export function companyIndex() {
  return request({
    url: '/admin/v1/company/index',
    method: 'post'
  })
}
//保存设置
export function companySave(data) {
  return request({
    url: '/admin/v1/company/addData',
    method: 'post',
    data: data
  })
}

//角色列表
export function roleList() {
  return request({
    url: '/admin/v1/rbac/roleList',
    method: 'post',
  })
}
//角色添加
export function addRole(data) {
  return request({
    url: '/admin/v1/rbac/addRole',
    method: 'post',
    data: data
  })
}
//角色查看
export function getRole(data) {
  return request({
    url: '/admin/v1/rbac/getRole',
    method: 'post',
    data: data
  })
}
//角色修改
export function editRole(data) {
  return request({
    url: '/admin/v1/rbac/editRole',
    method: 'post',
    data: data
  })
}
//角色删除
export function delRole(data) {
  return request({
    url: '/admin/v1/rbac/delRole',
    method: 'post',
    data: data
  })
}
//角色查询
export function roleAccess(data) {
  return request({
    url: '/admin/v1/rbac/access',
    method: 'post',
    data: data
  })
}

//角色设置
export function setAccess(data) {
  return request({
    url: '/admin/v1/rbac/setAccess',
    method: 'post',
    data: data
  })
}

//节点列表
export function nodeList(data) {
  return request({
    url: '/admin/v1/rbac/nodeList',
    method: 'post',
    data: data
  })
}
//节点添加
export function addNode(data) {
  return request({
    url: '/admin/v1/rbac/addNode',
    method: 'post',
    data: data
  })
}
export function getNode(data) {
  return request({
    url: '/admin/v1/rbac/getNode',
    method: 'post',
    data: data
  })
}
export function editNode(data) {
  return request({
    url: '/admin/v1/rbac/editNode',
    method: 'post',
    data: data
  })
}

export function delNode(data) {
  return request({
    url: '/admin/v1/rbac/delNode',
    method: 'post',
    data: data
  })
}
// 、、用户
export function userList(data) {
  return request({
    url: '/admin/v1/rbac/userList',
    method: 'post',
    data: data
  })
}

export function addUser(data) {
  return request({
    url: '/admin/v1/rbac/addUser',
    method: 'post',
    data: data
  })
}
export function getUser(data) {
  return request({
    url: '/admin/v1/rbac/getUser',
    method: 'post',
    data: data
  })
}
export function editUser(data) {
  return request({
    url: '/admin/v1/rbac/editUser',
    method: 'post',
    data: data
  })
}
export function delUser(data) {
  return request({
    url: '/admin/v1/rbac/delUser',
    method: 'post',
    data: data
  })
}


//轮播图列表
export function navList(data) {
  return request({
    url: '/admin/v1/nav/navList',
    method: 'post',
    data: data
  })
}
export function addNav(data) {
  return request({
    url: '/admin/v1/nav/addNav',
    method: 'post',
    data: data
  })
}

export function getNav(data) {
  return request({
    url: '/admin/v1/nav/getNav',
    method: 'post',
    data: data
  })
}
export function editNav(data) {
  return request({
    url: '/admin/v1/nav/editNav',
    method: 'post',
    data: data
  })
}

export function delNav(data) {
  return request({
    url: '/admin/v1/nav/delNav',
    method: 'post',
    data: data
  })
}
export function editPx(data) {
  return request({
    url: '/admin/v1/nav/editPx',
    method: 'post',
    data: data
  })
}


export function editFb(data) {
  return request({
    url: '/admin/v1/nav/editFb',
    method: 'post',
    data: data
  })
}

//关联分类列表

export function classiFication(data) {
  return request({
    url: '/admin/v1/nav/classification',
    method: 'post',
    data: data
  })
}
export function addClassification(data) {
  return request({
    url: '/admin/v1/nav/addClassification',
    method: 'post',
    data: data
  })
}


export function getClassification(data) {
  return request({
    url: '/admin/v1/nav/getClassification',
    method: 'post',
    data: data
  })
}

export function editClassification(data) {
  return request({
    url: '/admin/v1/nav/editClassification',
    method: 'post',
    data: data
  })
}

export function delClassification(data) {
  return request({
    url: '/admin/v1/nav/delClassification',
    method: 'post',
    data: data
  })
}


export function pxClassification(data) {
  return request({
    url: '/admin/v1/nav/pxClassification',
    method: 'post',
    data: data
  })
}
export function fbClassification(data) {
  return request({
    url: '/admin/v1/nav/fbClassification',
    method: 'post',
    data: data
  })
}
// 、、首页分类列表
export function syclassList(data) {
  return request({
    url: '/admin/v1/syclass/syclassList',
    method: 'post',
    data: data
  })
}
export function addSyclass(data) {
  return request({
    url: '/admin/v1/syclass/addSyclass',
    method: 'post',
    data: data
  })
}
export function getSyclass(data) {
  return request({
    url: '/admin/v1/syclass/getSyclass',
    method: 'post',
    data: data
  })
}

export function editSyclass(data) {
  return request({
    url: '/admin/v1/syclass/editSyclass',
    method: 'post',
    data: data
  })
}
export function delSyclass(data) {
  return request({
    url: '/admin/v1/syclass/delSyclass',
    method: 'post',
    data: data
  })
}
export function syclasseditPx(data) {
  return request({
    url: '/admin/v1/syclass/editPx',
    method: 'post',
    data: data
  })
}
export function syclasseditFb(data) {
  return request({
    url: '/admin/v1/syclass/editFb',
    method: 'post',
    data: data
  })
}

//关联产品

export function navClassificationProducts(data) {
  return request({
    url: '/admin/v1/nav/navClassificationProduct',
    method: 'post',
    data: data
  })
}


export function saveNavClassifications(data) {
  return request({
    url: '/admin/v1/nav/saveNavClassification',
    method: 'post',
    data: data
  })
}


export function navProductPages(data) {
  return request({
    url: '/admin/v1/nav/navProductPage',
    method: 'post',
    data: data
  })
}

export function showSyFenLens(data) {
  return request({
    url: '/admin/v1/nav/showSyFenLen',
    method: 'post',
    data: data
  })
}



//产品

export function productList(data) {
  return request({
    url: '/admin/v1/product/productList',
    method: 'post',
    data: data
  })
}

export function addProduct(data) {
  return request({
    url: '/admin/v1/product/addProduct',
    method: 'post',
    data: data
  })
}

export function getProduct(data) {
  return request({
    url: '/admin/v1/product/getProduct',
    method: 'post',
    data: data
  })
}

export function editProduct(data) {
  return request({
    url: '/admin/v1/product/editProduct',
    method: 'post',
    data: data
  })
}
export function delProduct(data) {
  return request({
    url: '/admin/v1/product/delProduct',
    method: 'post',
    data: data
  })
}


export function switchStatus(data) {
  return request({
    url: '/admin/v1/product/switchStatus',
    method: 'post',
    data: data
  })
}
export function batchAudit(data) {
  return request({
    url: '/admin/v1/product/batchAudit',
    method: 'post',
    data: data
  })
}

export function batchUp(data) {
  return request({
    url: '/admin/v1/product/batchUp',
    method: 'post',
    data: data
  })
}

export function batchDown(data) {
  return request({
    url: '/admin/v1/product/batchDown',
    method: 'post',
    data: data
  })
}



//查询一级分类
export function showoneFenLen(data) {
  return request({
    url: '/admin/v1/product/showoneFenLen',
    method: 'post',
    data: data
  })
}
export function showtwoFenlen(data) {
  return request({
    url: '/admin/v1/product/showtwoFenlen',
    method: 'post',
    data: data
  })
}
export function showSupplier(data) {
  return request({
    url: '/admin/v1/product/showSupplier',
    method: 'post',
    data: data
  })
}
export function addXinghao(data) {
  return request({
    url: '/admin/v1/product/addXinghao',
    method: 'post',
    data: data
  })
}

export function editXinghao(data) {
  return request({
    url: '/admin/v1/product/editXinghao',
    method: 'post',
    data: data
  })
}


export function delXinghao(data) {
  return request({
    url: '/admin/v1/product/delXinghao',
    method: 'post',
    data: data
  })
}

export function piliangUpdateClass(data) {
  return request({
    url: '/admin/v1/product/piliangUpdateClass',
    method: 'post',
    data: data
  })
}
export function piliangUpdateBrand(data) {
  return request({
    url: '/admin/v1/product/piliangUpdateBrand',
    method: 'post',
    data: data
  })
}
export function exportGoods(data) {
  return request({
    url: '/admin/v1/product/exportGoods',
    method: 'post',
    data: data
  })
}

export function updateYunzhongheProduct(data) {
  return request({
    url: '/admin/v1/product/updateYunzhongheProduct',
    method: 'post',
    data: data
  })
}



//导入信息（修改价格）
export function importGoods(data) {
  return request({
    url: '/admin/v1/product/importGoods',
    method: 'post',
    data: data
  })
}


// 产品分类列表
export function classificationList(data) {
  return request({
    url: '/admin/v1/product/classificationList',
    method: 'post',
    data: data
  })
}


export function addClassificationpro(data) {
  return request({
    url: '/admin/v1/product/addClassification',
    method: 'post',
    data: data
  })
}
export function getClassificationpro(data) {
  return request({
    url: '/admin/v1/product/getClassification',
    method: 'post',
    data: data
  })
}
export function editClassificationpro(data) {
  return request({
    url: '/admin/v1/product/editClassification',
    method: 'post',
    data: data
  })
}


export function delClassificationpro(data) {
  return request({
    url: '/admin/v1/product/delClassification',
    method: 'post',
    data: data
  })
}

export function saveRelationBrand(data) {
  return request({
    url: '/admin/v1/product/saveRelationBrand',
    method: 'post',
    data: data
  })
}


export function relationBrand(data) {
  return request({
    url: '/admin/v1/product/relationBrand',
    method: 'post',
    data: data
  })
}
export function fbClassificationpro(data) {
  return request({
    url: '/admin/v1/product/fbClassification',
    method: 'post',
    data: data
  })
}





//品牌列表
export function BrandList(data) {
  return request({
    url: '/admin/v1/product/BrandList',
    method: 'post',
    data: data
  })
}

export function addBrand(data) {
  return request({
    url: '/admin/v1/product/addBrand',
    method: 'post',
    data: data
  })
}

export function getBrand(data) {
  return request({
    url: '/admin/v1/product/getBrand',
    method: 'post',
    data: data
  })
}

export function editBrand(data) {
  return request({
    url: '/admin/v1/product/editBrand',
    method: 'post',
    data: data
  })
}

export function delBrand(data) {
  return request({
    url: '/admin/v1/product/delBrand',
    method: 'post',
    data: data
  })
}


export function pxBrand(data) {
  return request({
    url: '/admin/v1/product/pxBrand',
    method: 'post',
    data: data
  })
}

export function brandZt(data) {
  return request({
    url: '/admin/v1/product/brandZt',
    method: 'post',
    data: data
  })
}
export function updateBrand(data) {
  return request({
    url: '/admin/v1/product/updateBrand',
    method: 'post',
    data: data
  })
}



//dizhi地址
export function addressList(data) {
  return request({
    url: '/admin/v1/product/addressList',
    method: 'post',
    data: data
  })
}

export function showAddress(data) {
  return request({
    url: '/admin/v1/product/showAddress',
    method: 'post',
    data: data
  })
}

export function updateProvince(data) {
  return request({
    url: '/admin/v1/product/updateProvince',
    method: 'post',
    data: data
  })
}
export const updateCity = () => {
  return request({
    url: '/admin/v1/product/updateCity',
    method: 'POST'
  })
}
export function updateCounty(data) {
  return request({
    url: '/admin/v1/product/updateCounty',
    method: 'post',
    data: data
  })
}
export function updateTown(data) {
  return request({
    url: '/admin/v1/product/updateTown',
    method: 'post',
    data: data
  })
}

export function updateAddress(data) {
  return request({
    url: '/admin/v1/product/updateAddress',
    method: 'post',
    data: data
  })
}

//轮播图列表

export function navListcake(data) {
  return request({
    url: '/admin/v1/cake/navList',
    method: 'post',
    data: data
  })
}

export function addNavcake(data) {
  return request({
    url: '/admin/v1/cake/addNav',
    method: 'post',
    data: data
  })
}

export function getNavcake(data) {
  return request({
    url: '/admin/v1/cake/getNav',
    method: 'post',
    data: data
  })
}

export function editNavcake(data) {
  return request({
    url: '/admin/v1/cake/editNav',
    method: 'post',
    data: data
  })
}

export function delNavcake(data) {
  return request({
    url: '/admin/v1/cake/delNav',
    method: 'post',
    data: data
  })
}

export function editPxcake(data) {
  return request({
    url: '/admin/v1/cake/editPx',
    method: 'post',
    data: data
  })
}

export function editFbcake(data) {
  return request({
    url: '/admin/v1/cake/editFb',
    method: 'post',
    data: data
  })
}



//分类列表
export function classifyListcake(data) {
  return request({
    url: '/admin/v1/cake/classifyList',
    method: 'post',
    data: data
  })
}
export function addClassifycake(data) {
  return request({
    url: '/admin/v1/cake/addClassify',
    method: 'post',
    data: data
  })
}
export function getClassifycake(data) {
  return request({
    url: '/admin/v1/cake/getClassify',
    method: 'post',
    data: data
  })
}
export function editClassifycake(data) {
  return request({
    url: '/admin/v1/cake/editClassify',
    method: 'post',
    data: data
  })
}
export function delClassifycake(data) {
  return request({
    url: '/admin/v1/cake/delClassify',
    method: 'post',
    data: data
  })
}


export function pxClassifycake(data) {
  return request({
    url: '/admin/v1/cake/pxClassify',
    method: 'post',
    data: data
  })
}

export function fbClassifycake(data) {
  return request({
    url: '/admin/v1/cake/fbClassify',
    method: 'post',
    data: data
  })
}


export function fenLeicake(data) {
  return request({
    url: '/admin/v1/cake/fenLei',
    method: 'post',
    data: data
  })
}


export function addFenLeicake(data) {
  return request({
    url: '/admin/v1/cake/addFenLei',
    method: 'post',
    data: data
  })
}
export function getFenLeicake(data) {
  return request({
    url: '/admin/v1/cake/getFenLei',
    method: 'post',
    data: data
  })
}
export function editFenLeicake(data) {
  return request({
    url: '/admin/v1/cake/editFenLei',
    method: 'post',
    data: data
  })
}
export function delfFenLeicake(data) {
  return request({
    url: '/admin/v1/cake/delfFenLei',
    method: 'post',
    data: data
  })
}
export function classifyProductcake(data) {
  return request({
    url: '/admin/v1/cake/classifyProduct',
    method: 'post',
    data: data
  })
}

export function shopTwoFenleicake(data) {
  return request({
    url: '/admin/v1/cake/shopTwoFenlei',
    method: 'post',
    data: data
  })
}
export function dgCityBrandcake(data) {
  return request({
    url: '/admin/v1/cake/dgCityBrand',
    method: 'post',
    data: data
  })
}

export function cakeClassifyProductPagecake(data) {
  return request({
    url: '/admin/v1/cake/cakeClassifyProductPage',
    method: 'post',
    data: data
  })
}

export function cakeClassifyCakePagecake(data) {
  return request({
    url: '/admin/v1/cake/cakeClassifyCakePage',
    method: 'post',
    data: data
  })
}


export function cakeClassifyUpdatecake(data) {
  return request({
    url: '/admin/v1/cake/cakeClassifyUpdate',
    method: 'post',
    data: data
  })
}

export function cakeClassifyDelcake(data) {
  return request({
    url: '/admin/v1/cake/cakeClassifyDel',
    method: 'post',
    data: data
  })
}




// 品牌

export function brandListcake(data) {
  return request({
    url: '/admin/v1/cake/brandList',
    method: 'post',
    data: data
  })
}
export function addBrandcake(data) {
  return request({
    url: '/admin/v1/cake/addBrand',
    method: 'post',
    data: data
  })
}
export function getBrandcake(data) {
  return request({
    url: '/admin/v1/cake/getBrand',
    method: 'post',
    data: data
  })
}

export function editBrandcake(data) {
  return request({
    url: '/admin/v1/cake/editBrand',
    method: 'post',
    data: data
  })
}

export function delBrandcake(data) {
  return request({
    url: '/admin/v1/cake/delBrand',
    method: 'post',
    data: data
  })
}

export function brandCityListcake(data) {
  return request({
    url: '/admin/v1/cake/brandCityList',
    method: 'post',
    data: data
  })
}
export const updateCakeBrand = () => {
  return request({
    url: '/admin/v1/cake/updateBrand',
    method: 'POST'
  })
}
export function pxBrandcake(data) {
  return request({
    url: '/admin/v1/cake/pxBrand',
    method: 'post',
    data: data
  })
}

export function switchBrandcake(data) {
  return request({
    url: '/admin/v1/cake/switchBrand',
    method: 'post',
    data: data
  })
}

export function deliveryListcake(data) {
  return request({
    url: '/admin/v1/cake/deliveryList',
    method: 'post',
    data: data
  })
}
export function addDeliverycake(data) {
  return request({
    url: '/admin/v1/cake/addDelivery',
    method: 'post',
    data: data
  })
}
export function getDeliverycake(data) {
  return request({
    url: '/admin/v1/cake/getDelivery',
    method: 'post',
    data: data
  })
}

export function editDeliverycake(data) {
  return request({
    url: '/admin/v1/cake/editDelivery',
    method: 'post',
    data: data
  })
}


export function delDeliverycake(data) {
  return request({
    url: '/admin/v1/cake/delDelivery',
    method: 'post',
    data: data
  })
}

export function cityListcake(data) {
  return request({
    url: '/admin/v1/cake/cityList',
    method: 'post',
    data: data
  })
}


export function switchCitycake(data) {
  return request({
    url: '/admin/v1/cake/switchCity',
    method: 'post',
    data: data
  })
}

export function handleUpdateCity(data) {
  return request({
    url: '/admin/v1/cake/updateCity',
    method: 'post',
    data: data
  })
}

//产品蛋糕

export function goodsListcake(data) {
  return request({
    url: '/admin/v1/cake/goodsList',
    method: 'post',
    data: data
  })
}
export function addGoodscake(data) {
  return request({
    url: '/admin/v1/cake/addGoods',
    method: 'post',
    data: data
  })
}
export function getGoodscake(data) {
  return request({
    url: '/admin/v1/cake/getGoods',
    method: 'post',
    data: data
  })
}
export function editGoodscake(data) {
  return request({
    url: '/admin/v1/cake/editGoods',
    method: 'post',
    data: data
  })
}
export function delGoodscake(data) {
  return request({
    url: '/admin/v1/cake/delGoods',
    method: 'post',
    data: data
  })
}
export function switchStatuscake(data) {
  return request({
    url: '/admin/v1/cake/switchStatus',
    method: 'post',
    data: data
  })
}
export function goodsCityListcake(data) {
  return request({
    url: '/admin/v1/cake/goodsCityList',
    method: 'post',
    data: data
  })
}
// 更新蛋糕单品
export const updateOneGoods = (data) => {
  return request({
    url: '/admin/v1/cake/updateOneGoods',
    method: 'POST',
    data
  })
}


// 更新全部产品
export const updateAllGoods = () => {
  return request({
    url: '/admin/v1/cake/updateAllGoods',
    method: 'POST'
  })
}

// 更新商品可售卖城市
export const updateGoodsCity = () => {
  return request({
    url: '/admin/v1/cake/updateGoodsCity',
    method: 'POST'
  })
}

// 更新商品详情
export const updateGoodsDetail = () => {
  return request({
    url: '/admin/v1/cake/updateGoodsDetail',
    method: 'POST'
  })
}

// 更新全部产品数据
export const updateAllGoodsData = () => {
  return request({
    url: '/admin/v1/cake/updateAllGoodsData',
    method: 'POST'
  })
}

export function goodsBrandListcake(data) {
  return request({
    url: '/admin/v1/cake/goodsBrandList',
    method: 'post',
    data: data
  })
}
 
export function showSuppliercake(data) {
  return request({
    url: '/admin/v1/cake/showSupplier',
    method: 'post',
    data: data
  })
}
export function addSpecscake(data) {
  return request({
    url: '/admin/v1/cake/addSpecs',
    method: 'post',
    data: data
  })
}

 export function editSpecscake(data) {
  return request({
    url: '/admin/v1/cake/editSpecs',
    method: 'post',
    data: data
  })
}

 export function delSpecscake(data) {
  return request({
    url: '/admin/v1/cake/delSpecs',
    method: 'post',
    data: data
  })
}
 export function switchSpecsStatuscake(data) {
  return request({
    url: '/admin/v1/cake/switchSpecsStatus',
    method: 'post',
    data: data
  })
}

 //蛋糕结束
 export function brandListcoupons(data) {
  return request({
    url: '/admin/v1/coupons/brandList',
    method: 'post',
    data: data
  })
}
 export function addBrandcoupons(data) {
  return request({
    url: '/admin/v1/coupons/addBrand',
    method: 'post',
    data: data
  })
}
 export function getBrandcoupons(data) {
  return request({
    url: '/admin/v1/coupons/getBrand',
    method: 'post',
    data: data
  })
}

 export function editBrandcoupons(data) {
  return request({
    url: '/admin/v1/coupons/editBrand',
    method: 'post',
    data: data
  })
}
 export function delBrandcoupons(data) {
  return request({
    url: '/admin/v1/coupons/delBrand',
    method: 'post',
    data: data
  })
}

 export function pxBrandcoupons(data) {
  return request({
    url: '/admin/v1/coupons/pxBrand',
    method: 'post',
    data: data
  })
}
 export function fbBrandcoupons(data) {
  return request({
    url: '/admin/v1/coupons/fbBrand',
    method: 'post',
    data: data
  })
}


// 电子券
 

 export function couponsListcoupons(data) {
  return request({
    url: '/admin/v1/coupons/couponsList',
    method: 'post',
    data: data
  })
}

 export function addCouponscoupons(data) {
  return request({
    url: '/admin/v1/coupons/addCoupons',
    method: 'post',
    data: data
  })
}
 export function getCouponscoupons(data) {
  return request({
    url: '/admin/v1/coupons/getCoupons',
    method: 'post',
    data: data
  })
}
 export function editCouponscoupons(data) {
  return request({
    url: '/admin/v1/coupons/editCoupons',
    method: 'post',
    data: data
  })
}
 export function delCouponscoupons(data) {
  return request({
    url: '/admin/v1/coupons/delCoupons',
    method: 'post',
    data: data
  })
}
 export function fbCouponscoupons(data) {
  return request({
    url: '/admin/v1/coupons/fbCoupons',
    method: 'post',
    data: data
  })
}
 export function pinpaiListcoupons(data) {
  return request({
    url: '/admin/v1/coupons/pinpaiList',
    method: 'post',
    data: data
  })
}
 export function chengshiListcoupons(data) {
  return request({
    url: '/admin/v1/coupons/chengshiList',
    method: 'post',
    data: data
  })
}


 export function numListcoupons(data) {
  return request({
    url: '/admin/v1/coupons/numList',
    method: 'post',
    data: data
  })
}
 export function addNumcoupons(data) {
  return request({
    url: '/admin/v1/coupons/addNum',
    method: 'post',
    data: data
  })
}
 export function getNumcoupons(data) {
  return request({
    url: '/admin/v1/coupons/getNum',
    method: 'post',
    data: data
  })
}

 export function editNumcoupons(data) {
  return request({
    url: '/admin/v1/coupons/editNum',
    method: 'post',
    data: data
  })
}
 export function delNumcoupons(data) {
  return request({
    url: '/admin/v1/coupons/delNum',
    method: 'post',
    data: data
  })
}
 export function fbNumcoupons(data) {
  return request({
    url: '/admin/v1/coupons/fbNum',
    method: 'post',
    data: data
  })
}
 export function importNumcoupons(data) {
  return request({
    url: '/admin/v1/coupons/importNum',
    method: 'post',
    data: data
  })
}
 




export default request