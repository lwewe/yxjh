<template>
  <div class="cardnums">
    <el-card class="search-card serchForm formsTop">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
            <el-option label="卡号" value="num"></el-option>
            <el-option label="用户UID" value="uid"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.state" placeholder="状态" class="w120" clearable>
            <el-option label="未激活" value="1"></el-option>
            <el-option label="已激活" value="2"></el-option>
            <el-option label="已绑定" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.shop" placeholder="购物卡" class="w120" clearable>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>
          <el-button type="success" icon="el-icon-top-right" @click="handleExport()"
            style="display: none;">导出</el-button>

        </el-form-item>
      </el-form>
    </el-card>

    <!-- 卡片信息 -->
    <el-card class="mb20 mt20" v-if="cardInfo">
      <div class="txtleft dflex flex-between">
        <div>
          <span class="sizeCl6">开卡客户名称：</span>{{ cardInfo.company }}
        </div>
        <div>
          <span class="sizeCl6">已分配券数量：</span>{{ shuliang }}
          <span class="sizeCl6 ml10">已绑定：</span>{{ ybd }}
          <span class="sizeCl6 ml10">未绑定：</span>{{ wbd }}
          <span class="sizeCl6 ml10">卡类型：</span>{{ getPidName(cardInfo.pid) }}
        </div>
      </div>
    </el-card>

    <!-- 修改抽屉 -->
    <el-drawer title="修改卡号" :visible.sync="editDrawerVisible" :direction="direction"
      :before-close="handleEditDrawerClose" size="60%">
      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <el-form status-icon ref="ruleForm" :model="editForm" label-width="100px" style="width: 80%;text-align: left;"
            class="demo-ruleForm ">

            <!-- 卡号：只读 -->
            <el-form-item label="卡号：" class="addBorder">
              <el-input v-model="editForm.num" readonly />
            </el-form-item>

            <!-- 密码：只读 -->
            <el-form-item label="密码：" class="addBorder">
              <el-input v-model="editForm.pass" readonly />
            </el-form-item>

            <!-- 已删除提示 -->
            <el-form-item v-if="editForm.del == 1" label="" style="text-align: left;">
              <span style="color: #ff0000">卡已删除</span>
            </el-form-item>

            <!-- 价格：未绑定可编辑，已绑定只读 + 调整 -->
            <!-- 价格 -->
            <el-form-item label="价格：" style="text-align: left;">
              <!-- 未绑定：可编辑 -->
              <div v-if="editForm.state != 3" class="addBorder">
                <el-input v-model="editForm.price" placeholder="0.00" />
              </div>

              <!-- 已绑定：只读 + 调整 -->
              <div v-else class="price-control">
                <span class="addBorder">
                  <el-input v-model="editForm.price" placeholder="0.00" style="width: 100px;margin-right: 10px;"
                    readonly />
                </span>
                <span class="price-spacer"></span>
                <el-select v-model="editForm.addtype" style="width: 80px;margin-right: 10px;">
                  <el-option label="增加" value="1" />
                  <el-option label="减少" value="2" />
                </el-select>
                <el-input v-model="editForm.addprice" placeholder="金额" style="width: 100px;margin-right: 10px;" />
                <el-button type="success" @click="savePrice" :loading="priceSubmitting">保存</el-button>
              </div>
            </el-form-item>

            <!-- 分类：下拉选择 -->
            <el-form-item label="分类：">
              <el-select v-model="editForm.gid" filterable placeholder="请选择分类" style="width: 100%">
                <el-option v-for="item in cardList" :key="item.id"
                  :label="item.id + '-' + item.company + '-' + item.sale + '[' + getPidName(item.pid) + ']'"
                  :value="item.id" />
              </el-select>
            </el-form-item>

            <!-- 兑换购物卡：是/否下拉 -->
            <el-form-item label="兑换购物卡：" style="text-align: left;">
              <el-select v-model="editForm.shop" style="width: 80px;">
                <el-option label="否" :value="0" />
                <el-option label="是" :value="1" />
              </el-select>
            </el-form-item>

            <!-- 激活状态 -->
            <el-form-item label="激活状态：" v-if="editForm.state != 3">
              <el-radio-group v-model="editForm.state">
                <el-radio :label="1">未激活</el-radio>
                <el-radio :label="2">已激活</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="激活状态：" v-else class="addBorder">
              <el-input value="已绑定" readonly />
            </el-form-item>

            <!-- 兑换用户：已绑定时显示 -->
            <el-form-item v-if="editForm.state == 3" label="兑换用户：" class="addBorder">
              <el-input v-model="editForm.exchangeUser" readonly />
            </el-form-item>

            <!-- 隐藏字段：卡ID -->
            <el-form-item style="display: none">
              <el-input v-model="editForm.id" />
            </el-form-item>

            <!-- 保存按钮 -->
            <el-form-item class="txtleft">
              <el-button type="primary" @click="submitForm" :loading="submitting">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-drawer>

    <el-card class="search-card">
      <div class="dflex al-center txtleft mb10">
        <el-button type="danger" size="small" v-if="multipleSelection.length > 0"
          @click="batchDelete()">批量删除</el-button>

        <el-button type="success" size="small" @click="batchJihuo()"
          :disabled="!multipleSelection.length">激活</el-button>
        <el-button type="warning" size="small" @click="batchQxjihuo()"
          :disabled="!multipleSelection.length">取消激活</el-button>


      </div>
      <el-table ref="multipleTable" :data="tableData" border v-loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="39"></el-table-column>
        <el-table-column label="编号" width="110" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="卡号" width="220" align="center">
          <template slot-scope="scope">{{ scope.row.num }}

            <span v-if="scope.row.del === 1" class="dangerCl">[卡已删除]</span>


          </template>
        </el-table-column>
        <el-table-column label="密码" width="190" align="center">
          <template slot-scope="scope">{{ scope.row.pass }}</template>
        </el-table-column>
        <el-table-column label="价格" width="90" align="center">
          <template slot-scope="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="用户" width="100" align="center">
          <template slot-scope="scope">
            
 <span
      v-if="scope.row.uid"
      @click="handleEdit(scope.row)"
      style="color: #409eff; cursor: pointer;"
    >{{ scope.row.uid }}</span>
    <span v-else>-</span>

          </template>
        </el-table-column>
        <el-table-column label="绑定时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.bd_time ? formatTime(scope.row.bd_time) : '-' }}</template>
        </el-table-column>
        <!-- <el-table-column label="状态" width="90" align="center">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.state !== 3" v-model="scope.row.state" :active-value="2" :inactive-value="1"
              active-text=" " inactive-text=" " @change="handleStateChange(scope.row)">
            </el-switch>
            <el-tag v-else type="warning" size="small">已绑定</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="购物卡" width="90" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.shop" :active-value="1" :inactive-value="0"
              @change="handleGwNum(scope.row)"></el-switch>
          </template>
        </el-table-column> -->

        <el-table-column label="状态" width="90" align="center">
          <template slot-scope="scope">
            <el-switch v-if="scope.row.state !== 3" v-model="scope.row.state" :active-value="2" :inactive-value="1"
              active-text=" " inactive-text=" " @change="handleStateChange(scope.row)">
            </el-switch>
            <el-tag v-else type="warning" size="small">已绑定</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="购物卡" width="90" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.shop" :active-value="1" :inactive-value="0" active-text=" " inactive-text=" "
              @change="handleGwNum(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="250" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="openRecord(scope.row)">记录</el-button>
            <el-button size="mini" type="primary" @click="openEdit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;margin-top:20px;">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-sizes="[10, 20, 30, 50,100,200,500,1000]" :page-size="pageSize"
          layout="total,sizes,prev,pager,next,jumper" :total="total"></el-pagination>
      </div>
    </el-card>

    <!-- 消费记录抽屉 -->
    <el-drawer title="消费记录" :visible.sync="drawer" :direction="direction" :before-close="handleRecordDrawerClose" size="60%">
      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <el-form status-icon ref="ruleForm" :model="cardInfo" label-width="100px" style="width: 80%"
            class="demo-ruleForm ">
            <el-form-item label="卡号：" class="addBorder">
              <el-input v-model="cardInfo.kh" readonly />
            </el-form-item>
            <el-form-item label="密码：" class="addBorder">
              <el-input v-model="cardInfo.mm" readonly />
            </el-form-item>
            <el-form-item label="价格：" class="addBorder">
              <el-input v-model="cardInfo.price" readonly />
            </el-form-item>
            <el-form-item label="激活状态：" class="addBorder">
              <el-input v-model="cardInfo.activeStatus" readonly />
            </el-form-item>
            <el-form-item label="兑换用户：" class="addBorder">
              <el-input v-model="cardInfo.exchangeUser" readonly />
            </el-form-item>
          </el-form>

          <el-table :data="recordTableData" border style="width: 100%" max-height="300"
            :header-cell-style="headerCellStyle" v-loading="recordLoading">
            <el-table-column prop="bhh" label="编号" align="center">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column prop="jgg" label="金额" align="center">
              <template slot-scope="scope">
                <span :style="{ color: scope.row.flag == 1 || scope.row.flag == 4 ? '#f56c6c' : '#67c23a' }">
                  {{ scope.row.flag == 1 || scope.row.flag == 4 ? '-' : '+' }}{{ scope.row.price }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.flag == 3" class="dangerCl">后台充值</span>
                <span v-else-if="scope.row.flag == 4" class="blueCl">后台扣除</span>
                <span v-else-if="scope.row.flag == 1">消费</span>
                <span v-else-if="scope.row.flag == 2">充值</span>
              </template>
            </el-table-column>
            <el-table-column prop="sj" label="时间" align="center" width="200">
              <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
            </el-table-column>
            <el-table-column prop="dd" label="订单号" align="center">
              <template slot-scope="scope">{{ scope.row.order_no || '-' }}</template>
            </el-table-column>
            <el-table-column prop="jy" label="交易号" align="center">
              <template slot-scope="scope">{{ scope.row.transaction_id || '-' }}</template>
            </el-table-column>
            <el-table-column prop="sf" label="实付金额" align="center">
              <template slot-scope="scope">{{ scope.row.total_fee || '-' }}</template>
            </el-table-column>
          </el-table>

          <div style="text-align:right;margin-top:20px;">
            <el-pagination background @size-change="handleRecordSizeChange" @current-change="handleRecordCurrentChange"
              :current-page="recordCurrentPage" :page-sizes="[10, 20, 30, 50]" :page-size="recordPageSize"
              layout="total,sizes,prev,pager,next,jumper" :total="recordTotal">
            </el-pagination>
          </div>
        </el-card>
      </div>
    </el-drawer>
    <el-dialog title="选择导出类型" :visible.sync="exportDialogVisible" width="50%" :close-on-click-modal="false">
      <el-form label-width="100px" style="width: 90%; margin: 0 auto;">
        <el-form-item label="导出类型：">
          <el-radio-group v-model="exportFlag">
            <el-radio label="1">卡信息</el-radio>
            <el-radio label="2">余额信息</el-radio>
            <el-radio label="3">用户绑卡信息</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" style="display: block; text-align: center;">
        <el-button @click="exportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmExport" :loading="exportLoading">确认导出</el-button>
      </span>
    </el-dialog>


    <!-- 用户详情/编辑弹窗 -->
<el-dialog
  :title="dialogTitle"
  :visible.sync="dialogVisible"
  width="50%"
  :before-close="handleUserDialogClose"
  :close-on-click-modal="false"
>
  <div style="width: 80%; margin: auto;">
    <el-form ref="userForm" :model="form" label-width="130px" label-position="right">
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
          <el-upload
            class="avatar-uploader"
            action="#"
            :http-request="customUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <img
              v-if="form.img"
              :src="form.img"
              class="avatar-preview"
              style="width: 100px; height: 100px;"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
        <div class="fs12">尺寸：100*100，大小：1M以内</div>
      </el-form-item>

      <el-form-item label="用户状态：" style="text-align: left;">
        <el-radio-group v-model="form.sh">
          <el-radio label="0">正常</el-radio>
          <el-radio label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="注册时间：">
        <el-date-picker
          v-model="form.add_time"
          type="datetime"
          placeholder="选择时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
    </el-form>
  </div>

  <span slot="footer" class="dialog-footer" style="display: block; text-align: center;">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitUserForm()" :loading="submitting">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { cardNumList, getNumInfo, editNum, editPrice, delNum, jihuo, qxjihuo, gwNum, xfjl, fbNum, exportNumgid } from '@/api/modules/card'
 
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'
 
import { getRegister, editRegister } from '@/api/modules/zhichong'
export default {
  name: 'CardNum',
  data() {
    return {
      dialogVisible: false,
    dialogTitle: '用户详情',
    isEdit: false,
    form: {
      id: '',
      phone: '',
      openid: '',
      pass: '',
      img: '',
      sh: '0',
      add_time: '',
      number: '',
      numberpass: ''
    },

      statusChanging: false,  // 新增：防止重复点击（激活状态）
      shopChanging: false,    // 新增：防止重复点击（购物卡状态）
      exportDialogVisible: false,
      exportLoading: false,
      exportFlag: '1',  // 1-卡信息，2-余额信息，3-用户绑卡信息
      drawer: false,
      editDrawerVisible: false,
      direction: 'rtl',
      loading: false,
      submitting: false,
      priceSubmitting: false,
      // 搜索
      searchForm: { search_key: 'num', search_val: '', state: '', shop: '' },
      currentPage: 1,
      pageSize: 30,
      total: 0,
      multipleSelection: [],
      tableData: [],
      // 卡片信息
      cardInfo: {
        kh: '',
        mm: '',
        price: '',
        activeStatus: '',
        exchangeUser: ''
      },
      shuliang: 0,
      ybd: 0,
      wbd: 0,
      // 修改表单
      editForm: {
        id: '',
        num: '',
        pass: '',
        gid: '',
        price: '',
        addtype: '1',
        addprice: '',
        shop: 0,
        state: 1,
        del: 0,
        uid: 0,
        bd_time: 0,
        exchangeUser: '-'
      },
      cardList: [],
      // 消费记录
      recordLoading: false,
      recordTableData: [],
      recordCurrentPage: 1,
      recordPageSize: 10,
      recordTotal: 0,
      currentRecordRow: null
    }
  },
  mounted() {
    const gid = this.$route.params.id
    if (gid) this.initPage(gid)
  },
  methods: {
    // ==================== 用户详情 ====================

// 点击用户 UID 打开详情弹窗
async handleEdit(row) {
  if (!row.uid) {
    this.$message.warning('该卡未绑定用户')
    return
  }

  this.dialogTitle = '用户详情'
  this.isEdit = true
  this.form = {
    id: '', phone: '', openid: '', pass: '',
    img: '', sh: '0', add_time: '', number: '', numberpass: ''
  }

  try {
    const res = await getRegister({ id: row.uid })
    if (res.code === 200) {
      const data = res.data
      this.form = {
        id: data.id,
        phone: data.phone,
        openid: data.openid,
        pass: '',                                        // 密码留空，不修改
        img: data.img || '',
        sh: String(data.sh),
        add_time: this.formatUserTime(data.add_time),    // 秒级时间戳 → 字符串
        number: data.number || '',
        numberpass: ''                                   // 工号密码留空，不修改
      }
      this.dialogVisible = true
    } else {
      this.$message.error(res.msg || '获取用户信息失败')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    this.$message.error('获取用户信息失败')
  }
},

// 提交保存用户信息
async submitUserForm() {
  // if (!this.form.phone) {
  //   this.$message.warning('请输入手机号')
  //   return
  // }
  // if (!/^1\d{10}$/.test(this.form.phone)) {
  //   this.$message.warning('请输入正确的手机号')
  //   return
  // }
  if (!this.form.id) {
    this.$message.error('用户ID缺失，请重新打开详情')
    return
  }

  this.submitting = true
  try {
    // 接口要求 form-data
    const formData = new FormData()
    formData.append('id', String(this.form.id))   // 必填
    formData.append('phone', this.form.phone)
    formData.append('sh', String(this.form.sh))

    if (this.form.number)     formData.append('number', this.form.number)
    if (this.form.numberpass) formData.append('numberpass', this.form.numberpass)
    if (this.form.pass)       formData.append('pass', this.form.pass)   // 留空不修改
    if (this.form.img)        formData.append('img', this.form.img)
    if (this.form.add_time)   formData.append('add_time', this.form.add_time)

    const res = await editRegister(formData)
    if (res.code === 200) {
      this.$message.success(res.msg || '修改成功')
      this.dialogVisible = false
      this.refreshList()      // 刷新卡号列表
    } else {
      this.$message.error(res.msg || '修改失败')
    }
  } catch (error) {
    console.error('修改用户失败:', error)
    this.$message.error('操作失败')
  } finally {
    this.submitting = false
  }
},

// 用户详情弹窗关闭
handleUserDialogClose(done) {
  this.dialogVisible = false
  if (typeof done === 'function') done()
},

// 用户 add_time 时间戳 → 字符串（秒级）
formatUserTime(timestamp) {
  if (!timestamp || timestamp == 0) return ''
  const date = new Date(timestamp * 1000)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${min}:${s}`
},

// 头像上传
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

// ==================== 原有 methods 继续 ====================
    // ============ 导出相关方法 ============

    // 打开导出类型选择弹窗
    handleExport() {
      this.exportFlag = '1'
      this.exportDialogVisible = true
    },

    // 确认导出
    async confirmExport() {
      this.exportDialogVisible = false
      await this.doExport()
    },

    // 实际导出逻辑
    async doExport() {
      const gid = this.$route.params.id
      if (!gid) {
        this.$message.warning('缺少卡册ID')
        return
      }

      const exportTypeText = {
        '1': '卡信息',
        '2': '余额信息',
        '3': '用户绑卡信息'
      }

      const flagText = this.multipleSelection.length > 0
        ? `（已选中 ${this.multipleSelection.length} 条）`
        : ''

      try {
        await this.$confirm(
          `确认导出当前卡册的<b>${exportTypeText[this.exportFlag]}</b>${flagText}吗？`,
          '导出确认',
          {
            confirmButtonText: '确定导出',
            cancelButtonText: '取消',
            type: 'info',
            dangerouslyUseHTMLString: true
          }
        )
      } catch {
        return
      }

      this.exportLoading = true
      const loading = this.$loading({
        lock: true,
        text: '正在导出数据...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      try {
        const params = {
          gid: gid,
          flag: this.exportFlag
        }

        // 如果有选中的卡号，传 ids
        if (this.multipleSelection.length > 0) {
          params.ids = this.multipleSelection.map(item => item.id).join(',')
        }

        const { exportNumgid } = await import('@/api/modules/card')
        const res = await exportNumgid(params)

        if (res.code === 200 && res.data) {
          const { header, data, filename } = res.data

          if (!header || header.length === 0) {
            this.$message.error('导出数据表头为空')
            return
          }

          if (!data || data.length === 0) {
            this.$message.warning('没有数据可导出')
            return
          }

          // 使用 XLSX 导出
          if (typeof XLSX !== 'undefined') {
            try {
              const excelData = [header, ...data]
              const wb = XLSX.utils.book_new()
              const ws = XLSX.utils.aoa_to_sheet(excelData)

              // 根据不同导出类型设置列宽
              ws['!cols'] = header.map((h) => {
                if (h === '卡号' || h === '二维码内容') return { wch: 30 }
                if (h === '密码') return { wch: 15 }
                if (h === '姓名' || h === '手机号') return { wch: 16 }
                if (h === '用户UID' || h === '绑定时间') return { wch: 18 }
                if (h === '余额' || h === '价格') return { wch: 12 }
                return { wch: 12 }
              })

              const sheetName = exportTypeText[this.exportFlag]
              XLSX.utils.book_append_sheet(wb, ws, sheetName)
              XLSX.writeFile(wb, filename || 'export.xlsx')
              this.$message.success('导出成功')
            } catch (xlsxError) {
              console.error('XLSX导出失败，降级为HTML导出:', xlsxError)
              this.exportAsHtml(header, data, filename)
            }
          } else {
            // XLSX 不可用，降级为 HTML 导出
            this.exportAsHtml(header, data, filename)
          }
        } else {
          this.$message.error(res.msg || '导出失败')
        }
      } catch (error) {
        console.error('导出失败:', error)
        this.$message.error('导出失败：' + (error.message || '请稍后重试'))
      } finally {
        this.exportLoading = false
        loading.close()
      }
    },

    // HTML 方式导出（备用方案）
    exportAsHtml(header, data, filename) {
      let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; font-size: 12px; font-family: Arial, sans-serif; }
        th { background-color: #4472C4; color: #ffffff; font-weight: bold; padding: 6px 10px; border: 1px solid #999; text-align: center; }
        td { padding: 4px 10px; border: 1px solid #999; }
        tr:nth-child(even) { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <table>
        <thead><tr>
  `

      header.forEach(h => {
        html += `<th>${this.escapeHtml(String(h))}</th>`
      })

      html += `</tr></thead><tbody>`

      data.forEach(row => {
        html += '<tr>'
        row.forEach(cell => {
          const val = cell !== null && cell !== undefined ? String(cell) : ''
          html += `<td>${this.escapeHtml(val)}</td>`
        })
        html += '</tr>'
      })

      html += `</tbody></table></body></html>`

      const blob = new Blob(['\uFEFF' + html], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename ? filename.replace(/\.xlsx$/i, '.xls') : 'export.xls'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      this.$message.success('导出成功（HTML格式）')
    },

    // HTML 转义
    escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }
      return text.replace(/[&<>"']/g, function (m) { return map[m] })
    },
    // 快速切换激活状态
    // async handleStateChange(row) {
    //   try {
    //     const res = await fbNum({ id: row.id })
    //     if (res.code === 200) {
    //       row.state = res.data.state
    //       this.$message.success(res.msg || '状态修改成功')
    //     } else {
    //       this.$message.error(res.msg || '修改失败')
    //       // 恢复原状态
    //       row.state = row.state === 2 ? 1 : 2
    //     }
    //   } catch (e) {
    //     this.$message.error('请求失败')
    //     // 恢复原状态
    //     row.state = row.state === 2 ? 1 : 2
    //   }
    // },
    // 切换激活状态（带确认框）
    async handleStateChange(row) {
      const targetStatus = row.state === 2 ? 2 : 1
      const actionText = targetStatus === 2 ? '激活' : '取消激活'

      try {
        await this.$confirm(`确认${actionText}该卡号吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        // 用户取消，恢复原来的状态
        this.refreshList()
        return
      }

      if (this.statusChanging) return
      this.statusChanging = true

      try {
        const res = await fbNum({ id: row.id })
        if (res.code === 200) {
          row.state = res.data.state
          this.$message.success(res.msg || `${actionText}成功`)
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
          // 失败时重新获取列表恢复状态
          this.refreshList()
        }
      } catch (error) {
        console.error('切换激活状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        // 失败时重新获取列表恢复状态
        this.refreshList()
      } finally {
        this.statusChanging = false
      }
    },
    getPidName(pid) {
      const m = {
        1: '超级卡', 2: '蛋糕卡', 3: '电影卡', 4: '图书卡',
        5: '超级券', 6: '蛋糕券', 7: '电影券', 8: '图书券',
        9: '悦享卡', 10: '商城尊享券', 11: '电影尊享券',
        12: '蛋糕尊享券', 13: '提货券', 14: '工会消费券'
      }
      return m[pid] || ''
    },
    formatTime(ts) {
      if (!ts) return '-'
      const d = new Date(ts * 1000)
      const pad = n => String(n).padStart(2, '0')
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
    },
    stateName(s) {
      return { 1: '未激活', 2: '已激活', 3: '已绑定' }[s] || ''
    },
    stateType(s) {
      return { 1: 'info', 2: 'success', 3: 'warning' }[s] || ''
    },
    headerCellStyle() {
      return { background: '#f5f7fa', color: '#606266' }
    },

    initPage(gid) {
      this.getCardList(gid)
    },

    async getCardInfo(gid) {
      try {
        const res = await getNumInfo({ id: gid })
        if (res.code === 200) {
          const d = res.data
          const numData = d.num || {}
          this.cardInfo = {
            ...numData,
            ...(d.card || {})
          }
          this.cardList = d.card_list || []
        }
      } catch (e) {
        this.$message.error('获取卡片信息失败')
      }
    },

    async getCardList(gid) {
      this.loading = true
      try {
        const params = {
          gid: gid,
          page: String(this.currentPage),
          limit: String(this.pageSize)
        }
        if (this.searchForm.search_val) {
          params.search_key = this.searchForm.search_key
          params.search_val = this.searchForm.search_val
        }
        if (this.searchForm.state) {
          params.state = this.searchForm.state
        }
        if (this.searchForm.shop) {
          params.shop = this.searchForm.shop
        }

        const res = await cardNumList(params)
        if (res.code === 200) {
          const d = res.data
          this.cardInfo = d.card || {}
          this.shuliang = d.shuliang || 0
          this.ybd = d.ybd || 0
          this.wbd = d.wbd || 0
          const listData = d.list || {}
          this.tableData = listData.data || []
          this.total = listData.total || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.loading = false
      }
    },

    handleSearch() {
      this.currentPage = 1
      const gid = this.$route.params.id
      if (gid) this.getCardList(gid)
    },
    handleSizeChange(v) {
      this.pageSize = v
      this.currentPage = 1
      const gid = this.$route.params.id
      if (gid) this.getCardList(gid)
    },
    handleCurrentChange(v) {
      this.currentPage = v
      const gid = this.$route.params.id
      if (gid) this.getCardList(gid)
    },
    handleSelectionChange(v) {
      this.multipleSelection = v
    },

    refreshList() {
      const gid = this.$route.params.id
      if (gid) this.getCardList(gid)
    },

    // ==================== 修改抽屉 ====================
    async openEdit(row) {
      try {
        const res = await getNumInfo({ id: row.id })
        if (res.code === 200) {
          const d = res.data
          const numData = d.num || {}

          this.editForm = {
            id: numData.id || row.id,
            num: numData.num || row.num,
            pass: numData.pass || row.pass,
            gid: numData.gid || row.gid || '',
            price: numData.price || row.price,
            addtype: '1',
            addprice: '',
            shop: numData.shop !== undefined ? numData.shop : (row.shop || 0),
            state: numData.state || row.state,
            del: numData.del || 0,
            uid: numData.uid || row.uid || 0,
            bd_time: numData.bd_time || row.bd_time || 0,
            exchangeUser: numData.uid ? (numData.uid + '  兑换时间 ' + this.formatTime(numData.bd_time)) : '-'
          }

          this.cardList = d.card_list || []
          this.editDrawerVisible = true
        }
      } catch (e) {
        this.editForm = {
          id: row.id,
          num: row.num,
          pass: row.pass,
          gid: row.gid || '',
          price: row.price || '',
          addtype: '1',
          addprice: '',
          shop: row.shop || 0,
          state: row.state,
          del: 0,
          uid: row.uid || 0,
          bd_time: row.bd_time || 0,
          exchangeUser: row.uid ? (row.uid + '  兑换时间 ' + this.formatTime(row.bd_time)) : '-'
        }
        this.editDrawerVisible = true
      }
    },

    // 保存价格（已绑定状态使用 editPrice，未绑定状态在 submitForm 中处理）
    async savePrice() {
      if (!this.editForm.addprice) {
        this.$message.warning('请输入调整金额')
        return
      }
      this.priceSubmitting = true
      try {
        const params = {
          id: this.editForm.id,
          addtype: this.editForm.addtype,
          addprice: this.editForm.addprice
        }

        const res = await editPrice(params)
        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功')
          if (res.data && res.data.price !== undefined) {
            this.editForm.price = res.data.price
          }
          this.editForm.addprice = ''
          this.refreshList()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.priceSubmitting = false
      }
    },

    // 保存表单（未绑定状态）
    async submitForm() {
      this.submitting = true
      try {
        const formData = new FormData()
        formData.append('id', String(this.editForm.id))
        formData.append('gid', String(this.editForm.gid))
        formData.append('shop', String(this.editForm.shop))

        if (this.editForm.state != 3) {
          formData.append('state', String(this.editForm.state))
          formData.append('price', String(this.editForm.price))
        }

        const res = await editNum(formData)
        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功')
          this.editDrawerVisible = false
          this.refreshList()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.submitting = false
      }
    },
    handleEditDrawerClose(done) {
      this.editForm = {
        id: '',
        num: '',
        pass: '',
        gid: '',
        price: '',
        addtype: '1',
        addprice: '',
        shop: 0,
        state: 1,
        del: 0,
        uid: 0,
        bd_time: 0,
        exchangeUser: '-'
      }
      done()
    },

    // ==================== 购物卡切换 ====================
    // async handleGwNum(row) {
    //   try {
    //     const res = await gwNum({ id: row.id })
    //     if (res.code === 200) {
    //       row.shop = res.data.shop
    //       this.$message.success(res.msg)
    //     } else {
    //       this.$message.error(res.msg)
    //       this.refreshList()
    //     }
    //   } catch (e) {
    //     this.refreshList()
    //   }
    // },
    // ==================== 购物卡切换（带确认框） ====================
    async handleGwNum(row) {
      const targetStatus = row.shop ? 1 : 0
      const actionText = targetStatus === 1 ? '设为购物卡' : '取消购物卡'

      try {
        await this.$confirm(`确认${actionText}该卡号吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch {
        // 用户取消，恢复原来的状态
        this.refreshList()
        return
      }

      if (this.shopChanging) return
      this.shopChanging = true

      try {
        const res = await gwNum({ id: row.id })
        if (res.code === 200) {
          row.shop = res.data.shop
          this.$message.success(res.msg || `${actionText}成功`)
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
          // 失败时重新获取列表恢复状态
          this.refreshList()
        }
      } catch (error) {
        console.error('切换购物卡状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        // 失败时重新获取列表恢复状态
        this.refreshList()
      } finally {
        this.shopChanging = false
      }
    },
    // ==================== 删除 ====================
    handleDelete(row) {
      this.$confirm('确认删除吗？', '提示', { type: 'warning' }).then(async () => {
        try {
          const res = await delNum({ ids: row.id.toString() })
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.refreshList()
          } else {
            this.$message.error(res.msg)
          }
        } catch (e) {
          this.$message.error('请求失败')
        }
      }).catch(() => { })
    },

    batchDelete() {
      if (!this.multipleSelection.length) return this.$message.warning('请先选择')
      this.$confirm('确认删除选中卡号吗？', '提示', { type: 'warning' }).then(async () => {
        const ids = this.multipleSelection.map(i => i.id).join(',')
        try {
          const res = await delNum({ ids })
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.refreshList()
          }
        } catch (e) { }
      }).catch(() => { })
    },

    batchJihuo() {
      if (!this.multipleSelection.length) {
        this.$message.warning('请先选择卡号')
        return
      }

      // 检查是否有已绑定的卡（状态为3）
      const hasBinded = this.multipleSelection.some(item => item.state === 3)
      if (hasBinded) {
        this.$message.warning('已绑定的卡不能激活，请取消选择已绑定的卡')
        return
      }

      // 检查是否有已经激活的卡（状态为2）
      const hasActivated = this.multipleSelection.some(item => item.state === 2)
      if (hasActivated) {
        this.$message.warning('已激活的卡无需再次激活，请取消选择已激活的卡')
        return
      }

      const ids = this.multipleSelection.map(i => i.id).join(',')

      this.$confirm(`确认激活选中的 ${this.multipleSelection.length} 张卡吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在激活中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        jihuo({ ids }).then(res => {
          loading.close()
          if (res.code === 200) {
            this.$message.success(res.msg || '激活成功')
            this.$refs.multipleTable.clearSelection()
            this.refreshList()
          } else {
            this.$message.error(res.msg || '激活失败')
          }
        }).catch(err => {
          loading.close()
          console.error('批量激活失败:', err)
          const errorMsg = err?.response?.data?.msg || err?.message || '激活失败，请稍后重试'
          this.$message.error(errorMsg)
        })
      }).catch(() => {
        // 用户取消操作
      })
    },
    batchQxjihuo() {
      if (!this.multipleSelection.length) {
        this.$message.warning('请先选择卡号')
        return
      }

      const ids = this.multipleSelection.map(i => i.id).join(',')

      // 检查是否有已绑定的卡（状态为3）
      const hasBinded = this.multipleSelection.some(item => item.state === 3)
      if (hasBinded) {
        this.$message.warning('已绑定的卡不能取消激活，请取消选择已绑定的卡')
        return
      }

      this.$confirm(`确认取消激活选中的 ${this.multipleSelection.length} 张卡吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在取消激活...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        qxjihuo({ ids }).then(res => {
          loading.close()
          if (res.code === 200) {
            this.$message.success(res.msg || '取消激活成功')
            this.$refs.multipleTable.clearSelection()
            this.refreshList()
          } else {
            this.$message.error(res.msg || '取消激活失败')
          }
        }).catch(err => {
          loading.close()
          console.error('批量取消激活失败:', err)
          const errorMsg = err?.response?.data?.msg || err?.message || '取消激活失败，请稍后重试'
          this.$message.error(errorMsg)
        })
      }).catch(() => {
        // 用户取消操作
      })
    },
    // ==================== 消费记录 ====================
    openRecord(row) {
      this.cardInfo = {
        kh: row.num || '',
        mm: row.pass || '',
        price: row.price || '',
        activeStatus: this.stateName(row.state),
        exchangeUser: row.uid ? (row.uid + '  ' + this.formatTime(row.bd_time)) : '-'
      }

      this.currentRecordRow = row
      this.recordCurrentPage = 1
      this.drawer = true
      this.getRecordList()
    },

    async getRecordList() {
      if (!this.currentRecordRow) return
      this.recordLoading = true
      try {
        const params = {
          gid: String(this.currentRecordRow.gid || this.$route.params.id),
          id: String(this.currentRecordRow.id),
          page: String(this.recordCurrentPage),
          limit: String(this.recordPageSize)
        }

        const res = await xfjl(params)
        if (res.code === 200) {
          const data = res.data
          const listData = data.list || {}
          this.recordTableData = listData.data || []
          this.recordTotal = listData.total || 0
        } else {
          this.$message.error(res.msg || '获取消费记录失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.recordLoading = false
      }
    },

    handleRecordSizeChange(v) {
      this.recordPageSize = v
      this.recordCurrentPage = 1
      this.getRecordList()
    },

    handleRecordCurrentChange(v) {
      this.recordCurrentPage = v
      this.getRecordList()
    },

    handleRecordDrawerClose(done) {
      this.recordTableData = []
      this.recordTotal = 0
      this.currentRecordRow = null
      done()
    }
  }
}
</script>

<style scoped>
.cardnums .formsTop .el-form-item {
  margin-bottom: 0px;
}

.dangerCl {
  color: #f56c6c;
}

.blueCl {
  color: #409eff;
}
</style>