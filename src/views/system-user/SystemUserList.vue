<template>
  <div class="systemImgList">
    <template v-if="isFUlika">
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
              <el-option label="手机号" value="phone"></el-option>
              <el-option label="工号/姓名" value="number"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
              <el-option label="注册时间" value="add_time"></el-option>
              <el-option label="最后登录" value="login_time"></el-option>
              <el-option label="登录次数" value="num"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.sh" placeholder="用户状态" class="w120">
              <el-option label="正常用户" value="0"></el-option>
              <el-option label="禁用用户" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleImport()">导入手机号</el-button>
            <el-button type="success" @click="handleNumberImport()">导入工号</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 表格卡片 -->
      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="danger" size="small" v-if="multipleSelection.length > 0"
            @click="delOptions()">批量删除</el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd()">添加用户</el-button>
        </div>

        <!-- 添加/编辑用户弹窗 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
          <div style="width: 80%;margin: auto;">
            <el-form ref="form" :model="form" label-width="130px" label-position="right">
              <el-form-item label="手机号：">
                <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="微信：" v-if="isEdit">
                <el-input v-model="form.openid" readonly></el-input>
              </el-form-item>
              <el-form-item label="支付密码：">
                <el-input v-model="form.pass" placeholder="留空则不修改"></el-input>
              </el-form-item>
              <el-form-item label="工号/姓名：">
                <el-input v-model="form.number" placeholder="请输入工号/姓名"></el-input>
              </el-form-item>
              <el-form-item label="工号密码：">
                <el-input v-model="form.numberpass" placeholder="工号密码"></el-input>
              </el-form-item>

              <el-form-item label="头像：" style="text-align: left;">
                <div style="display: flex; line-height: 20px;">
                  <el-upload class="avatar-uploader" action="#" :http-request="customUpload" :show-file-list="false"
                    :before-upload="beforeUpload">
                    <img v-if="form.img" :src="form.img" class="avatar-preview" />
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>

                </div>
                <div class="fs12">尺寸：100*100,大小：1M以内</div>
              </el-form-item>
              <el-form-item label="用户状态：" style="text-align: left;">
                <el-radio-group v-model="form.sh">
                  <el-radio label="0">正常</el-radio>
                  <el-radio label="1">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="注册时间：">
                <el-date-picker v-model="form.add_time" type="datetime" placeholder="选择时间"
                  value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm()">确 定</el-button>
          </span>
        </el-dialog>

        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="编号" width="80" align="center" prop="id"></el-table-column>
          <el-table-column label="头像" width="80" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.img || defaultImg" style="width: 40px; height: 40px; border-radius: 50%;" alt="">
            </template>
          </el-table-column>
          <el-table-column label="手机号" align="center">
            <template slot-scope="scope">
              <span @click="handleEdit(scope.row)" class="blackCl" style="cursor: pointer;">{{ scope.row.phone }}</span>
            </template>
          </el-table-column>

          <el-table-column label="工号/姓名" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.number }}</span>
            </template>
          </el-table-column>




          <el-table-column label="注册时间" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.add_time) }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sh" :active-value="0" :inactive-value="1"
                @change="handleStatusChange(scope.row)"></el-switch>
            </template>
          </el-table-column> -->

          <el-table-column label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sh" :active-value="0" :inactive-value="1" active-text=" " inactive-text=" "
                @change="handleStatusChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>



          <el-table-column label="最后登录" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.login_time) }}
            </template>
          </el-table-column>
          <el-table-column label="登录次数" align="center" prop="num" width="80"></el-table-column>
          <!-- <el-table-column label="蛋叔ID" align="center" prop="">
            <template slot-scope="scope">
              <span v-if="scope.row.api_id === 0">关联</span>
              <span v-else>{{ (scope.row.api_id) }}</span>

            </template>
          </el-table-column> -->

          <el-table-column label="蛋叔ID" align="center" width="120">
            <template slot-scope="scope">

              <el-tag v-if="scope.row.api_id === 0" @click="handleAddApiUser(scope.row)" size="mini"
                type="warning">关联</el-tag>
              <span v-else>{{ scope.row.api_id }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="480" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="showAddress(scope.row)">收货地址</el-button>
              <el-button size="mini" type="warning" @click="showShop(scope.row)">购物车</el-button>
              <el-button size="mini" type="warning" @click="showFuli(scope.row)">福利卡</el-button>
              <el-button size="mini" type="primary" @click="handleEdit(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-card>

      <!-- ==================== 收货地址抽屉（表格形式） ==================== -->
      <el-drawer title="收货地址" :visible.sync="addressDrawer" size="70%" :with-header="true">
        <div class="drawer-content" v-loading="addressLoading">

          <!-- 蛋糕收货地址 -->
          <h5 class="section-title">蛋糕收货地址列表</h5>
          <el-table :data="addressList" border stripe style="width: 100%; margin-bottom: 20px;">
            <el-table-column label="编号" width="70" align="center" prop="id"></el-table-column>
            <el-table-column label="姓名" width="120" align="center" prop="name"></el-table-column>
            <el-table-column label="手机号" width="130" align="center" prop="phone"></el-table-column>
            <el-table-column label="地址" align="left">
              <template slot-scope="scope">
                {{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}{{ scope.row.addr }}
                <span v-if="scope.row.is_default == 1" style="color:#ff0000">[默认]</span>
              </template>
            </el-table-column>
            <el-table-column label="添加时间" width="170" align="center">
              <template slot-scope="scope">
                {{ formatTime(scope.row.add_time) }}
              </template>
            </el-table-column>
          </el-table>

          <!-- 商城收货地址 -->
          <h5 class="section-title">商城收货地址列表</h5>
          <el-table :data="scAddressList" border stripe style="width: 100%; margin-bottom: 20px;">
            <el-table-column label="编号" width="70" align="center" prop="id"></el-table-column>
            <el-table-column label="姓名" width="120" align="center" prop="name"></el-table-column>
            <el-table-column label="手机号" width="130" align="center" prop="phone"></el-table-column>
            <el-table-column label="地址" align="left">
              <template slot-scope="scope">
                {{ scope.row.province ? scope.row.province.name : '' }}{{ scope.row.city ? scope.row.city.name : '' }}{{
                  scope.row.county ? scope.row.county.name : '' }}{{ scope.row.addr }}
              </template>
            </el-table-column>
            <el-table-column label="添加时间" width="170" align="center">
              <template slot-scope="scope">
                {{ formatTime(scope.row.add_time) }}
              </template>
            </el-table-column>
          </el-table>

          <!-- 图书收货地址 -->
          <h5 class="section-title">图书收货地址列表</h5>
          <el-table :data="tsAddressList" border stripe style="width: 100%;">
            <el-table-column label="编号" width="70" align="center" prop="id"></el-table-column>
            <el-table-column label="姓名" width="120" align="center" prop="name"></el-table-column>
            <el-table-column label="手机号" width="130" align="center" prop="phone"></el-table-column>
            <el-table-column label="地址" align="left">
              <template slot-scope="scope">
                {{ scope.row.province ? scope.row.province.name : '' }}{{ scope.row.city ? scope.row.city.name : '' }}{{
                  scope.row.county ? scope.row.county.name : '' }}{{ scope.row.addr }}
                <span v-if="scope.row.is_default == 1" style="color:#ff0000">[默认]</span>
              </template>
            </el-table-column>
            <el-table-column label="添加时间" width="170" align="center">
              <template slot-scope="scope">
                {{ formatTime(scope.row.add_time) }}
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-if="!addressList.length && !scAddressList.length && !tsAddressList.length"
            description="暂无收货地址"></el-empty>
        </div>
      </el-drawer>

      <!-- ==================== 购物车抽屉（表格形式） ==================== -->
      <el-drawer title="购物车" :visible.sync="shopDrawer" size="70%" :with-header="true">
        <div class="drawer-content" v-loading="shopLoading">

          <!-- 蛋糕购物车 -->
          <h5 class="section-title">蛋糕购物车</h5>
          <el-table :data="cartList" border stripe style="width: 100%; margin-bottom: 20px;">
            <el-table-column label="编号" width="70" align="center" prop="id"></el-table-column>
            <el-table-column label="缩略图" width="90" align="center">
              <template slot-scope="scope">
                <img v-if="scope.row.product" :src="scope.row.product.image_path || scope.row.product.thumbnailimage"
                  width="50" alt="" />
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="产品名称" min-width="180" align="left">
              <template slot-scope="scope">
                {{ scope.row.product ? (scope.row.product.title || scope.row.product.name) : '商品已下架' }}
              </template>
            </el-table-column>


            <el-table-column label="规格" width="140" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.specs && scope.row.specs.name">{{ scope.row.specs.name }}</span>
                <span v-else-if="scope.row.product && scope.row.product.xinghao">{{ scope.row.product.xinghao.xinghao
                }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>


            <el-table-column label="价格" width="100" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.specs && scope.row.specs.price">¥{{ scope.row.specs.price }}</span>
                <span v-else-if="scope.row.product && scope.row.product.xinghao">¥{{ scope.row.product.xinghao.price
                }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>

            <el-table-column label="数量" width="70" align="center" prop="quantity"></el-table-column>
            <el-table-column label="添加时间" width="170" align="center">
              <template slot-scope="scope">
                {{ formatTime(scope.row.add_time) }}
              </template>
            </el-table-column>
          </el-table>

          <!-- 商城购物车 -->
          <h5 class="section-title">商城购物车</h5>
          <el-table :data="cartScList" border stripe style="width: 100%; margin-bottom: 20px;">
            <el-table-column label="编号" width="70" align="center" prop="id"></el-table-column>
            <el-table-column label="缩略图" width="90" align="center">
              <template slot-scope="scope">
                <img v-if="scope.row.product" :src="scope.row.product.thumbnailimage" width="50" alt="">
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="产品名称" min-width="180" align="left">
              <template slot-scope="scope">
                {{ scope.row.product ? scope.row.product.name : '商品已下架' }}
              </template>
            </el-table-column>
            <el-table-column label="规格" width="140" align="center">
              <template slot-scope="scope">
                {{ scope.row.product && scope.row.product.xinghao ? scope.row.product.xinghao.xinghao : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="价格" width="100" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.product && scope.row.product.xinghao">¥{{ scope.row.product.xinghao.price
                }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="70" align="center" prop="quantity"></el-table-column>
            <el-table-column label="添加时间" width="170" align="center">
              <template slot-scope="scope">
                {{ formatTime(scope.row.add_time) }}
              </template>
            </el-table-column>
          </el-table>

          <!-- 图书购物车 -->
          <h5 class="section-title">图书购物车</h5>
          <el-table :data="tsCartList" border stripe style="width: 100%;">
            <el-table-column label="编号" width="70" align="center" prop="id"></el-table-column>
            <el-table-column label="缩略图" width="90" align="center">
              <template slot-scope="scope">
                <img v-if="scope.row.tushu_show" :src="scope.row.tushu_show.imageurl" width="50" alt="">
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="图书名称" min-width="180" align="left">
              <template slot-scope="scope">
                {{ scope.row.tushu_show ? scope.row.tushu_show.bookname : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="书号" width="150" align="left">
              <template slot-scope="scope">
                {{ scope.row.tushu_show ? scope.row.tushu_show.bookisbn : '-' }}
              </template>
            </el-table-column>
            <el-table-column label="价格" width="100" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.tushu_show">¥{{ scope.row.tushu_show.price }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="70" align="center" prop="quantity"></el-table-column>
            <el-table-column label="添加时间" width="170" align="center">
              <template slot-scope="scope">
                {{ formatTime(scope.row.add_time) }}
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-if="!cartList.length && !cartScList.length && !tsCartList.length"
            description="暂无购物车数据"></el-empty>
        </div>
      </el-drawer>
      <input ref="fileInput" type="file" accept=".xls,.xlsx,.csv" style="display: none" @change="handleFileChange" />
    </template>
    <router-view />
  </div>


</template>
<script>
import * as XLSX from 'xlsx'
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
import { registerList, addRegister, getRegister, editRegister, delRegister, registerAddress, registerShop, addApiUser, importRegister, importNumber } from '@/api/modules/zhichong'

export default {
  name: 'UserManage',
  data() {
    return {
      importType: 'phone',
      statusChanging: false,
      uploadData: {
        file_url: 'upload/register'
      },
      defaultImg: require('../../assets/111.png'),
      loading: false,
      addressLoading: false,
      shopLoading: false,
      searchForm: {
        search_key: 'phone',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc',
        sh: ''
      },
      page: 1,
      limit: 10,
      total: 0,
      dialogVisible: false,
      dialogTitle: '添加用户',
      addressDrawer: false,
      shopDrawer: false,
      form: {
        id: '',
        phone: '',
        openid: "",
        pass: '',
        img: '',
        sh: '0',
        add_time: '',
        number: '',
        numberpass: ''
      },
      isEdit: false,
      multipleSelection: [],
      tableData: [],
      addressList: [],
      scAddressList: [],
      tsAddressList: [],
      cartList: [],
      cartScList: [],
      tsCartList: []
    }
  },
  mounted() {
    this.getList()
  },
  computed: {
    isFUlika() {
      return this.$route.name === 'SystemUserList' || this.$route.path === '/system-user/list'
    }
  },
  methods: {
    // 工号导入按钮点击
    handleNumberImport() {
      this.importType = 'number'
      this.$refs.fileInput.click()
    },

    // 手机号导入按钮点击
    handleImport() {
      this.importType = 'phone'
      this.$refs.fileInput.click()
    },

    // 文件选择变化处理
    async handleFileChange(event) {
      const file = event.target.files[0]
      if (!file) return

      // 验证文件类型
      const validExtensions = ['.xls', '.xlsx', '.csv']
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

      if (!validExtensions.includes(fileExtension)) {
        this.$message.error('请上传 .xls、.xlsx 或 .csv 格式的文件')
        this.$refs.fileInput.value = ''
        return
      }

      // 根据导入类型显示不同的确认信息
      const confirmMessage = this.importType === 'phone'
        ? '(新用户-注册绑卡,旧用户-直接绑卡)导入列格式:手机号,福利卡(已分配,已激活)'
        : '(新用户-注册绑卡,旧用户-直接绑卡)导入列格式:工号,密码,福利卡(已分配,已激活)'

      this.$confirm(confirmMessage, '导入确认', {
        confirmButtonText: '确定导入',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(async () => {
        await this.processImportFile(file)
      }).catch(() => {
        this.$refs.fileInput.value = ''
      })
    },

    // 处理导入文件（唯一版本）
    async processImportFile(file) {
      const loading = this.$loading({
        lock: true,
        text: '正在导入数据...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        // 读取文件
        const data = await this.readImportFile(file)

        if (!data || data.length === 0) {
          this.$message.warning('文件中没有有效数据')
          loading.close()
          this.$refs.fileInput.value = ''
          return
        }

        // 根据导入类型调用不同的接口
        let res
        if (this.importType === 'phone') {
          // 手机号导入
          res = await importRegister({ data: JSON.stringify(data) })
        } else {
          // 工号导入
          res = await importNumber({ data: JSON.stringify(data) })
        }

        loading.close()

        if (res.code === 200) {
          this.$message.success(res.msg || '导入成功')
          this.getList()
        } else {
          this.$message.error(res.msg || '导入失败')
        }
      } catch (error) {
        loading.close()
        console.error('导入失败:', error)
        this.$message.error('导入失败：' + (error.message || '请稍后重试'))
      } finally {
        this.$refs.fileInput.value = ''
      }
    },

    // 读取导入文件（支持 xls、xlsx、csv）
    readImportFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase()

        reader.onload = (e) => {
          try {
            let jsonData = []

            if (fileExtension === '.csv') {
              // 处理 CSV 文件
              const text = e.target.result
              const rows = text.split('\n').filter(row => row.trim())

              rows.forEach((row, index) => {
                if (!row.trim()) return
                const cols = row.split(/[,，]/).map(col => col.trim().replace(/^"|"$/g, ''))

                if (index === 0) {
                  jsonData.push(cols)
                } else {
                  jsonData.push(cols)
                }
              })
            } else {
              // 处理 Excel 文件
              const data = new Uint8Array(e.target.result)
              const workbook = XLSX.read(data, { type: 'array' })
              const firstSheetName = workbook.SheetNames[0]
              const worksheet = workbook.Sheets[firstSheetName]
              jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            }

            if (jsonData.length <= 1) {
              resolve([])
              return
            }

            // 根据导入类型解析数据
            const result = []
            if (this.importType === 'phone') {
              // 手机号导入解析
              const headers = jsonData[0]
              let phoneIndex = -1
              let cardIndex = -1

              headers.forEach((header, index) => {
                const h = String(header || '').trim()
                if (h.includes('手机号') || h === 'phone') {
                  phoneIndex = index
                } else if (h.includes('福利卡') || h.includes('卡号') || h === 'card' || h === 'num') {
                  cardIndex = index
                }
              })

              if (phoneIndex === -1) phoneIndex = 0
              if (cardIndex === -1) cardIndex = 1

              for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i]
                if (!row || row.length === 0) continue

                const phone = row[phoneIndex] ? String(row[phoneIndex]).trim() : ''
                const card = row[cardIndex] ? String(row[cardIndex]).trim() : ''

                if (phone && card) {
                  const cleanPhone = phone.replace(/\s+/g, '').replace(/['']/g, '')
                  if (/^1\d{10}$/.test(cleanPhone)) {
                    result.push({
                      '手机号': cleanPhone,
                      '福利卡': card
                    })
                  }
                }
              }
            } else {
              // 工号导入解析
              const headers = jsonData[0]
              let numberIndex = -1
              let passIndex = -1
              let cardIndex = -1

              headers.forEach((header, index) => {
                const h = String(header || '').trim()
                if (h.includes('工号') || h === 'number') {
                  numberIndex = index
                } else if (h.includes('密码') || h === 'password' || h === 'pass') {
                  passIndex = index
                } else if (h.includes('福利卡') || h.includes('卡号') || h === 'card' || h === 'num') {
                  cardIndex = index
                }
              })

              // 如果没有找到明确的列名，默认第一列是工号，第二列是密码，第三列是福利卡
              if (numberIndex === -1) numberIndex = 0
              if (passIndex === -1) passIndex = 1
              if (cardIndex === -1) cardIndex = 2

              for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i]
                if (!row || row.length === 0) continue

                const number = row[numberIndex] ? String(row[numberIndex]).trim() : ''
                const pass = row[passIndex] ? String(row[passIndex]).trim() : ''
                const card = row[cardIndex] ? String(row[cardIndex]).trim() : ''

                // 工号、密码、福利卡都必填
                if (number && pass && card) {
                  result.push({
                    '工号': number,
                    '密码': pass,
                    '福利卡': card
                  })
                }
              }
            }

            resolve(result)
          } catch (error) {
            reject(new Error('文件解析失败：' + error.message))
          }
        }

        reader.onerror = () => {
          reject(new Error('文件读取失败'))
        }

        // 根据文件类型选择读取方式
        if (fileExtension === '.csv') {
          reader.readAsText(file, 'UTF-8')
        } else {
          reader.readAsArrayBuffer(file)
        }
      })
    },

    // 关联蛋叔用户
    async handleAddApiUser(row) {
      this.$confirm('确认关联该用户到蛋糕叔叔吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        const loading = this.$loading({ target: '.el-table', text: '关联中...' })
        try {
          const res = await addApiUser({ id: row.id })
          if (res.code === 200) {
            this.$message.success(res.msg || '关联成功')
            this.getList()
          } else {
            this.$message.error(res.msg || '关联失败')
          }
        } catch (error) {
          this.$message.error('关联失败，请稍后重试')
        } finally {
          loading.close()
        }
      }).catch(() => { })
    },

    // 自定义上传
    async customUpload(options) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'upload/register')
      formData.append('api_channel_no', GLOBAL_CONFIG.API_CHANNEL_NO)
      formData.append('timestamp', timestamp)
      formData.append('sign', sign)

      try {
        const response = await axios({
          url: GLOBAL_CONFIG.BASE_URL + '/admin/v1/upload',
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })

        if (response.data.status === 200 || response.data.code === 200) {
          this.form.img = response.data.data
          this.$message.success('上传成功')
        } else {
          this.$message.error(response.data.msg || '上传失败')
        }
      } catch (error) {
        if (error.response && error.response.data) {
          const data = error.response.data
          if (data.status === 200 || data.code === 200) {
            this.form.img = data.data
            this.$message.success('上传成功')
            return
          }
        }
        this.$message.error('上传失败，请稍后重试')
      }
    },

    // 上传前校验
    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isImage) {
        this.$message.error('只能上传 JPG/PNG 格式的图片!')
        return false
      }
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 1MB!')
        return false
      }
      return true
    },

    // 图片加载失败处理
    handleImageError(e) {
      console.error('图片加载失败:', this.form.img)
    },

    // 获取列表
    async getList() {
      this.loading = true
      try {
        const params = {
          page: this.page,
          limit: this.limit
        }
        if (this.searchForm.search_key && this.searchForm.search_val) {
          params.search_key = this.searchForm.search_key
          params.search_val = this.searchForm.search_val
        }
        if (this.searchForm.px_key) params.px_key = this.searchForm.px_key
        if (this.searchForm.px_val) params.px_val = this.searchForm.px_val
        if (this.searchForm.sh !== '') params.sh = this.searchForm.sh

        const res = await registerList(params)
        if (res.code === 200) {
          this.tableData = res.data.data
          this.total = res.data.total
        }
      } catch (error) {
        this.$message.error('获取列表失败')
      } finally {
        this.loading = false
      }
    },

    handleSearch() {
      this.page = 1
      this.getList()
    },

    handleSizeChange(val) {
      this.limit = val
      this.getList()
    },

    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },

    handleAdd() {
      this.dialogTitle = '添加用户'
      this.isEdit = false
      this.form = { id: '', phone: '', pass: '', img: '', sh: '0', add_time: '', openid: "", number: '', numberpass: '' }
      this.dialogVisible = true
    },

    async handleEdit(row) {
      this.dialogTitle = '编辑用户'
      this.isEdit = true
      try {
        const res = await getRegister({ id: row.id })
        if (res.code === 200) {
          const data = res.data
          this.form = {
            id: data.id,
            phone: data.phone,
            openid: data.openid,
            pass: '',
            img: data.img,
            sh: String(data.sh),
            add_time: this.formatTime(data.add_time),
            number: data.number,          // ✅ 补上
            numberpass: ''   // ✅ 补上
          }
        }
      } catch (error) {
        this.$message.error('获取用户信息失败')
      }
      this.dialogVisible = true
    },

    async submitForm() {
      try {
        if (this.isEdit) {
          const res = await editRegister(this.form)
          if (res.code === 200) {
            this.$message.success('修改成功')
            this.dialogVisible = false
            this.getList()
          }
        } else {
          const res = await addRegister(this.form)
          if (res.code === 200) {
            this.$message.success('添加成功')
            this.dialogVisible = false
            this.getList()
          }
        }
      } catch (error) {
        this.$message.error('操作失败')
      }
    },

    // 修改用户状态（带确认框）
    async handleStatusChange(row) {
      const targetStatus = row.sh === 0 ? 0 : 1
      const actionText = targetStatus === 0 ? '启用' : '禁用'

      try {
        await this.$confirm(`确认${actionText}该用户吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        this.getList()
        return
      }

      if (this.statusChanging) return
      this.statusChanging = true

      try {
        await editRegister({ id: row.id, sh: row.sh })
        this.$message.success(`${actionText}成功`)
      } catch (error) {
        console.error('切换用户状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        this.getList()
      } finally {
        this.statusChanging = false
      }
    },

    handleDelete(row) {
      this.$confirm('确认删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await delRegister({ ids: String(row.id) })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    delOptions() {
      if (this.multipleSelection.length === 0) return
      this.$confirm('确认删除选中的用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const ids = this.multipleSelection.map(item => item.id).join(',')
        try {
          const res = await delRegister({ ids })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          }
        } catch (error) {
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 收货地址
    async showAddress(row) {
      this.addressDrawer = true
      this.addressLoading = true
      this.addressList = []
      this.scAddressList = []
      this.tsAddressList = []
      try {
        const res = await registerAddress({ id: row.id })
        if (res.code === 200) {
          this.addressList = res.data.addr_list || []
          this.scAddressList = res.data.scaddr_list || []
          this.tsAddressList = res.data.tsaddr_list || []
        }
      } catch (error) {
        this.$message.error('获取地址失败')
      } finally {
        this.addressLoading = false
      }
    },

    // 购物车
    async showShop(row) {
      this.shopDrawer = true
      this.shopLoading = true
      this.cartList = []
      this.cartScList = []
      this.tsCartList = []
      try {
        const res = await registerShop({ id: row.id })
        if (res.code === 200) {
          this.cartList = res.data.cart_list || []
          this.cartScList = res.data.cart_sc_list || []
          this.tsCartList = res.data.tscart_list || []
        }
      } catch (error) {
        this.$message.error('获取购物车失败')
      } finally {
        this.shopLoading = false
      }
    },

    showFuli(row) {
      this.$router.push({ name: 'FuliCard', query: { id: row.id } })
    },

    handleClose() {
      this.dialogVisible = false
    },

    formatTime(timestamp) {
      if (!timestamp || timestamp == 0) return '未登录'
      const date = new Date(timestamp * 1000)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const h = String(date.getHours()).padStart(2, '0')
      const min = String(date.getMinutes()).padStart(2, '0')
      const s = String(date.getSeconds()).padStart(2, '0')
      return `${y}-${m}-${d} ${h}:${min}:${s}`
    }
  }
}
</script>
<style>
.serchForm .search-form .el-input__inner {
  height: 36px;
  line-height: 36px;
}

.serchForm .search-form .el-form-item__content .el-button {
  padding: 10px 20px;
}

.serchForm .el-card__body {
  text-align: left;
}

.serchForm .el-input__icon {
  line-height: 36px;
}

.serchForm .el-form-item__content {
  line-height: 36px;
}

.serchForm .el-form-item__label {
  line-height: 36px;
}

.serchForm .search-form .el-form-item {
  margin-top: 10px !important;
}

.serchForm .el-card__body {
  padding-top: 10px !important;
}
</style>

<style lang="scss" scoped>
.systemImgList {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .drawer-content {
    padding: 20px;

    .section-title {
      margin: 10px 0;
      font-size: 15px;
      font-weight: bold;
      color: #333;
      text-align: left;
      padding-bottom: 8px;
      // border-bottom: 2px solid #409EFF;
    }
  }



  .avatar-uploader {
    display: inline-block;

    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409EFF;
      }
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }

  .avatar-preview {
    width: 80px;
    height: 80px;
    object-fit: contain;
    display: block;
  }

}
</style>