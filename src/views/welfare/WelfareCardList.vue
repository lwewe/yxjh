<template>
  <div class="welfareCardList">
    <template v-if="showList">
      <!-- ==================== 搜索区域 ==================== -->
      <el-card class="search-card serchForm">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="">
            <el-select v-model="searchForm.pid" placeholder="卡类型" class="w120" clearable>
              <el-option label="超级卡" value="1"></el-option>
              <el-option label="蛋糕卡" value="2"></el-option>
              <el-option label="电影卡" value="3"></el-option>
              <el-option label="图书卡" value="4"></el-option>
              <el-option label="超级券" value="5"></el-option>
              <el-option label="蛋糕券" value="6"></el-option>
              <el-option label="电影券" value="7"></el-option>
              <el-option label="图书券" value="8"></el-option>
              <el-option label="悦享卡" value="9"></el-option>
              <el-option label="商城尊享券" value="10"></el-option>
              <el-option label="电影尊享券" value="11"></el-option>
              <el-option label="蛋糕尊享券" value="12"></el-option>
              <el-option label="提货券" value="13"></el-option>
              <el-option label="工会消费券" value="14"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.search_key" placeholder="搜索类型" class="w120">
              <el-option label="开卡客户" value="company"></el-option>
              <el-option label="销售人" value="sale"></el-option>
              <el-option label="标题" value="title"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="searchForm.search_val" placeholder="关键词" class="w120"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120">
              <el-option label="制卡时间" value="add_time"></el-option>
              <el-option label="有效日期" value="end_time"></el-option>
              <el-option label="编号" value="id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120">
              <el-option label="降序" value="desc"></el-option>
              <el-option label="升序" value="asc"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- ==================== 添加/编辑弹窗 ==================== -->
      <el-dialog :title="isEdit ? '修改福利卡' : '添加福利卡'" :visible.sync="dialogVisible" width="50%"
        :before-close="handleClose">
        <el-form ref="cardForm" :model="cardForm" label-width="140px" style="width: 90%;text-align: left;">

          <!-- 卡类型 -->
          <el-form-item label="分类：" required>
            <el-select v-model="cardForm.pid" placeholder="请选择卡类型" style="width: 100%;" @change="onPidChange">
              <el-option label="超级卡" :value="1"></el-option>
              <el-option label="蛋糕卡" :value="2"></el-option>
              <el-option label="电影卡" :value="3"></el-option>
              <el-option label="图书卡" :value="4"></el-option>
              <el-option label="超级券" :value="5"></el-option>
              <el-option label="蛋糕券" :value="6"></el-option>
              <el-option label="电影券" :value="7"></el-option>
              <el-option label="图书券" :value="8"></el-option>
              <el-option label="悦享卡" :value="9"></el-option>
              <el-option label="工会消费券" :value="14"></el-option>
              <el-option label="商城尊享券" :value="10"></el-option>
              <el-option label="电影尊享券" :value="11"></el-option>
              <el-option label="蛋糕尊享券" :value="12"></el-option>
              <el-option label="提货券" :value="13"></el-option>
            </el-select>
          </el-form-item>

          <!-- 开卡客户名称 -->
          <el-form-item label="开卡客户名称：" required>
            <el-input v-model="cardForm.company" placeholder="请输入开卡客户名称"></el-input>
          </el-form-item>

          <!-- 销售人 -->
          <el-form-item label="销售人：" required>
            <el-input v-model="cardForm.sale" placeholder="请输入销售人"></el-input>
          </el-form-item>

          <!-- 数量 -->
          <el-form-item label="数量：">
            <el-input v-model="cardForm.geshu" placeholder="请输入数量" type="number"></el-input>
          </el-form-item>

          <!-- 尊享券标题（仅 pid=10/11/12 显示） -->
          <el-form-item label="标题：">
            <el-input v-model="cardForm.title" placeholder="请输入尊享券标题"></el-input>
          </el-form-item>

          <!-- Banner（仅 pid=10/11/12/13 显示） -->
          <el-form-item label="Banner：">
            <el-upload action="#" :http-request="res => customUpload(res, 'img')" :show-file-list="false"
              :before-upload="beforeUpload">
              <img v-if="cardForm.img" :src="cardForm.img" class="avatar" style="width: 100px;height: 100px;">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span style="color:red; font-size:12px;">尺寸：100*100，大小：1M以内</span>
          </el-form-item>

          <!-- ========== 商城尊享券专属 (pid=10) ========== -->
          <template v-if="cardForm.pid == 10">
            <el-form-item label="链接地址：">
              <el-input v-model="cardForm.url" placeholder="请输入链接地址" style="width: 70%;"></el-input>
              <span style="color:#ff0000; font-size:12px;margin-left: 10px;">填写后，页面形式失效</span>
            </el-form-item>

            <el-form-item label="页面形式：">
              <div style="line-height: 32px;">
                <div style="margin-bottom: 10px;">
                  <span style="font-weight: bold;">形式一(卡册)</span>
                  <el-radio-group v-model="cardForm.tid" style="margin-left: 10px;">
                    <el-radio v-for="item in sczxqForm1" :key="item.id" :label="item.id">
                      {{ item.title }}
                    </el-radio>
                  </el-radio-group>
                </div>
                <div>
                  <span style="font-weight: bold;">形式二(卡册)</span>
                  <el-radio-group v-model="cardForm.tid" style="margin-left: 10px;">
                    <el-radio v-for="item in sczxqForm2" :key="item.id" :label="item.id">
                      {{ item.title }}
                    </el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="产品价格：">
              <el-row style="width: 100%;">
                <el-col :span="8">
                  <div style="margin-bottom: 4px; color: #606266; font-size: 12px;">产品价格</div>
                  <el-select v-model="cardForm.mrprice" placeholder="请选择" style="width: 90%;">
                    <el-option label="全部" :value="0"></el-option>
                    <el-option label="100" :value="1"></el-option>
                    <el-option label="150" :value="2"></el-option>
                    <el-option label="200" :value="3"></el-option>
                    <el-option label="300" :value="4"></el-option>
                    <el-option label="400" :value="5"></el-option>
                    <el-option label="500" :value="6"></el-option>
                    <el-option label="600" :value="7"></el-option>
                    <el-option label="700" :value="8"></el-option>
                    <el-option label="150以下" :value="9"></el-option>
                    <el-option label="200以下" :value="10"></el-option>
                    <el-option label="300以下" :value="11"></el-option>
                    <el-option label="400以下" :value="12"></el-option>
                    <el-option label="500以下" :value="13"></el-option>
                    <el-option label="600以下" :value="14"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <div style="margin-bottom: 4px; color: #606266; font-size: 12px;">产品开始时间</div>
                  <el-date-picker v-model="cardForm.kstime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                    style="width: 90%;"></el-date-picker>
                </el-col>
                <el-col :span="8">
                  <div style="margin-bottom: 4px; color: #606266; font-size: 12px;">产品结束时间</div>
                  <el-date-picker v-model="cardForm.jstime" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                    style="width:90%;"></el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
          </template>

          <!-- ========== 提货券专属 (pid=13) ========== -->
          <template v-if="cardForm.pid == 13">
            <el-form-item label="首页形式：">
              <div style="line-height: 32px;">
                <div style="margin-bottom: 10px;">
                  <span style="font-weight: bold;">形式一(合卡)</span> <br>
                  <el-radio-group v-model="cardForm.hkid" style="margin-left: 10px;">
                    <el-radio v-for="item in thqForm1" :key="item.id" :label="item.id">
                      {{ item.title }}
                    </el-radio>
                  </el-radio-group>
                </div>
                <div>
                  <span style="font-weight: bold;">形式二(合卡)</span> <br>
                  <el-radio-group v-model="cardForm.hkid" style="margin-left: 10px;">
                    <el-radio v-for="item in thqForm2" :key="item.id" :label="item.id">
                      {{ item.title }}
                    </el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="公告：">
              <el-input v-model="cardForm.gonggao" type="textarea" :rows="3" placeholder="请输入提货券公告"></el-input>
            </el-form-item>
          </template>

          <!-- 制卡时间 -->
          <el-form-item label="制卡时间：" required>
            <el-date-picker v-model="cardForm.add_time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
              style="width: 100%;"></el-date-picker>
          </el-form-item>

          <!-- 有效日期 -->
          <el-form-item label="有效日期：" required>
            <el-date-picker v-model="cardForm.end_time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
              style="width: 100%;"></el-date-picker>
          </el-form-item>

          <!-- 是否发布 -->
          <el-form-item label="是否发布：">
            <el-radio-group v-model="cardForm.sh">
              <el-radio :label="1">即时发布</el-radio>
              <el-radio :label="0">暂不发布</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer" style="display: block;text-align: center;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitCard" :loading="submitting">保 存</el-button>
        </span>
      </el-dialog>

      <!-- ==================== 列表区域 ==================== -->
      <el-card class="search-card">
        <div style="text-align: left; margin-bottom: 20px;">
          <el-button type="danger" size="small" v-if="multipleSelection.length > 0"
            @click="batchDelete()">批量删除</el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog">添加福利卡</el-button>
          <el-button type="success" size="small" @click="cardSerch()">卡号查询</el-button>
        </div>
        <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange" v-loading="loading" stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column type="selection" width="39"></el-table-column>
          <el-table-column label="编号" width="70" align="center">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="标题" min-width="150" align="center">
            <template slot-scope="scope">
              <span :style="{ color: getPidBgColor(scope.row.pid) }" size="small">
                [{{ getPidName(scope.row.pid) }}]
              </span>
              <span>{{scope.row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column label="开卡客户名称" min-width="200" align="left">
            <template slot-scope="scope">{{ scope.row.company }}
              <span class=" dangerCl fs12">({{ scope.row.geshu || '-' }})</span>
            </template>
          </el-table-column>
          <el-table-column label="销售人" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.sale }}</template>
          </el-table-column>
          <!-- <el-table-column label="数量" width="80" align="center">
            <template slot-scope="scope">{{ scope.row.geshu || '-' }}</template>
          </el-table-column> -->
          <el-table-column label="制卡时间" width="120" align="center">
            <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
          </el-table-column>
          <el-table-column label="有效日期" width="120" align="center">
            <template slot-scope="scope">{{ formatTime(scope.row.end_time) }}</template>
          </el-table-column>
          <!-- <el-table-column label="是否发布" width="90" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0"
                @change="handleFbCard(scope.row)"></el-switch>
            </template>
          </el-table-column> -->
          <el-table-column label="是否发布" width="90" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0" active-text=" " inactive-text=" "
                @change="handleFbCard(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="390" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="cardNum(scope.row)">福利卡</el-button>
              <el-button size="mini" type="primary" @click="openEditDialog(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
              <el-button size="mini" v-if="scope.row.pid == 13" type="success"
                @click="classify(scope.row)">分类</el-button>
              <el-button size="mini" v-if="scope.row.pid == 10 || scope.row.pid == 11 || scope.row.pid == 12"
                type="primary" @click="cardLbt(scope.row)">轮播图</el-button>
              <el-button size="mini" v-if="scope.row.pid == 10 || scope.row.pid == 11 || scope.row.pid == 12"
                type="primary" @click="permission(scope.row)">权限</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right; margin-top: 20px;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </el-card>
    </template>
    <router-view />
  </div>
</template>

<script>
import { cardList, addCard, editCard, delCard, getCard, fbCard, sczxqFrom, thqFrom } from '@/api/modules/card'
import axios from 'axios'
import { GLOBAL_CONFIG } from '@/config/global'

export default {
  name: 'WelfareCardList',
  data() {
    return {
      statusChanging: false,  // 新增：防止重复点击
      sczxqOptions: [],   // 商城尊享券-页面形式
      thqOptions: [],     // 提货券-页面形式
      loading: false,
      submitting: false,
      isEdit: false,
      editId: '',
      dialogVisible: false,
      cardForm: {
        pid: 1,
        company: '',
        sale: '',
        geshu: '',
        title: '',
        img: '',
        add_time: '',
        end_time: '',
        sh: 1,
        // 商城尊享券
        tid: 0,
        mrprice: 0,
        url: '',
        kstime: '',
        jstime: '',
        // 提货券
        hkid: 0,
        gonggao: ''
      },
      searchForm: {
        pid: '',
        search_key: 'company',
        search_val: '',
        px_key: 'add_time',
        px_val: 'desc'
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      multipleSelection: [],
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  computed: {
    showList() {
      return this.$route.path === '/welfare/list'
    },
    sczxqForm1() {
      return this.sczxqOptions.filter(item => item.mb_id == 1)
    },
    sczxqForm2() {
      return this.sczxqOptions.filter(item => item.mb_id == 2)
    },
    thqForm1() {
      return this.thqOptions.filter(item => item.mb_id == 1)
    },
    thqForm2() {
      return this.thqOptions.filter(item => item.mb_id == 2)
    }
  },
  methods: {
    // ==================== 工具方法 ====================
    getPidBgColor(pid) {
      const colorMap = {
        1: '#b07229', 2: '#f8054f', 3: '#E6A23C', 4: '#419e3c',
        5: '#409EFF', 6: '#f8054f', 7: '#E6A23C', 8: '#419e3c',
        9: '#b07229', 10: '#409EFF', 11: '#E6A23C', 12: '#233722',
        13: '#233722', 14: '#909399'
      }
      return colorMap[pid] || '#409EFF'
    },
    getPidName(pid) {
      const map = {
        1: '超级卡', 2: '蛋糕卡', 3: '电影卡', 4: '图书卡',
        5: '超级券', 6: '蛋糕券', 7: '电影券', 8: '图书券',
        9: '悦享卡', 10: '商城尊享券', 11: '电影尊享券',
        12: '蛋糕尊享券', 13: '提货券', 14: '工会消费券'
      }
      return map[pid] || '未知'
    },
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    },

    // ==================== 上传 ====================
    async customUpload(options, field) {
      const { file } = options
      const timestamp = GLOBAL_CONFIG.getTimestamp()
      const sign = GLOBAL_CONFIG.generateSign()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('file_url', 'card')
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
        // 兼容 code 和 status 两种返回格式
        const res = response.data
        if (res.code === 200 || res.status === 200) {
          this.cardForm[field] = res.data || res.url || ''
          this.$message.success('上传成功')
        } else {
          this.$message.error(res.msg || res.message || '上传失败')
        }
      } catch (error) {
        console.error('上传失败:', error)
        this.$message.error('上传失败')
      }
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('图片大小不能超过 1MB!')
        return false
      }
      return true
    },

    // ==================== 页面形式加载 ====================
    async getSczxqOptions() {
      try {
        const res = await sczxqFrom()
        if (res.code === 200) {
          this.sczxqOptions = res.data || []
        }
      } catch (error) {
        console.error('获取商城尊享券页面形式失败')
      }
    },
    async getThqOptions() {
      try {
        const res = await thqFrom()
        if (res.code === 200) {
          this.thqOptions = res.data || []
        }
      } catch (error) {
        console.error('获取提货券页面形式失败')
      }
    },

    // ==================== 卡类型切换 ====================
    onPidChange(val) {
      if (val == 10) {
        // 商城尊享券
        this.getSczxqOptions()
        this.cardForm.hkid = 0
        this.cardForm.gonggao = ''
      } else if (val == 13) {
        // 提货券
        this.getThqOptions()
        this.cardForm.tid = 0
        this.cardForm.mrprice = 0
        this.cardForm.url = ''
        this.cardForm.kstime = ''
        this.cardForm.jstime = ''
      } else {
        // 其他类型：清空所有专属字段
        this.cardForm.tid = 0
        this.cardForm.mrprice = 0
        this.cardForm.url = ''
        this.cardForm.kstime = ''
        this.cardForm.jstime = ''
        this.cardForm.hkid = 0
        this.cardForm.gonggao = ''
      }
      // 非尊享券时清空标题
      if (val < 10 || val > 12) {
        this.cardForm.title = ''
      }
    },

    // ==================== 列表 ====================
    async getList() {
      this.loading = true
      try {
        const params = {
          pid: this.searchForm.pid,
          search_key: this.searchForm.search_key,
          search_val: this.searchForm.search_val,
          px_key: this.searchForm.px_key,
          px_val: this.searchForm.px_val,
          page: this.currentPage,
          limit: this.pageSize
        }
        const res = await cardList(params)
        if (res.code === 200) {
          const listData = res.data.list || res.data
          this.tableData = listData.data
          this.total = listData.total
          this.currentPage = listData.current_page
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
      } finally {
        this.loading = false
      }
    },
    handleSearch() {
      this.currentPage = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // ==================== 发布/取消发布 ====================
    // async handleFbCard(row) {
    //   try {
    //     const res = await fbCard({ id: row.id })
    //     if (res.code === 200) {
    //       this.$message.success(res.msg)
    //       row.sh = res.data.sh
    //     } else {
    //       this.$message.error(res.msg || '操作失败')
    //       this.getList()
    //     }
    //   } catch (error) {
    //     this.$message.error('请求失败')
    //     this.getList()
    //   }
    // },
// ==================== 发布/取消发布（带确认框） ====================
async handleFbCard(row) {
  const targetStatus = row.sh ? 1 : 0
  const actionText = targetStatus === 1 ? '发布' : '下架'
  
  try {
    await this.$confirm(`确认${actionText}该福利卡吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    // 用户取消，恢复原来的状态
    this.getList()
    return
  }
  
  if (this.statusChanging) return
  this.statusChanging = true

  try {
    const res = await fbCard({ id: row.id })
    if (res.code === 200) {
      this.$message.success(res.msg || `${actionText}成功`)
      row.sh = res.data.sh
    } else {
      this.$message.error(res.msg || `${actionText}失败`)
      // 失败时重新获取列表恢复状态
      this.getList()
    }
  } catch (error) {
    console.error('切换发布状态失败:', error)
    this.$message.error('网络错误，请稍后重试')
    // 失败时重新获取列表恢复状态
    this.getList()
  } finally {
    this.statusChanging = false
  }
},
    // ==================== 添加/编辑弹窗 ====================
    openAddDialog() {
      this.isEdit = false
      this.editId = ''
      this.cardForm = {
        pid: 1, company: '', sale: '', geshu: '', title: '', img: '',
        add_time: '', end_time: '', sh: 1,
        tid: 0, mrprice: 0, url: '', kstime: '', jstime: '',
        hkid: 0, gonggao: ''
      }
      this.dialogVisible = true
    },
    async openEditDialog(row) {
      this.isEdit = true
      this.editId = row.id
      try {
        const res = await getCard({ id: row.id })
        if (res.code === 200) {
          const data = res.data
          this.cardForm = {
            pid: data.pid || 1,
            company: data.company || '',
            sale: data.sale || '',
            geshu: data.geshu || '',
            title: data.title || '',
            img: data.img || '',
            add_time: data.add_time ? this.formatTime(data.add_time) : '',
            end_time: data.end_time ? this.formatTime(data.end_time) : '',
            sh: data.sh !== undefined ? data.sh : 1,
            tid: data.tid || 0,
            mrprice: data.mrprice || 0,
            url: data.url || '',
            kstime: data.kstime ? this.formatTime(data.kstime) : '',
            jstime: data.jstime ? this.formatTime(data.jstime) : '',
            hkid: data.hkid || 0,
            gonggao: data.gonggao || ''
          }
          if (data.pid == 10) await this.getSczxqOptions()
          if (data.pid == 13) await this.getThqOptions()
        }
      } catch (error) {
        this.$message.error('获取详情失败')
      }
      this.dialogVisible = true
    },
    async submitCard() {
      if (!this.cardForm.company) return this.$message.warning('请输入开卡客户名称')
      if (!this.cardForm.sale) return this.$message.warning('请输入销售人')
      if (!this.cardForm.end_time) return this.$message.warning('请选择有效日期')
      this.submitting = true
      try {
        const params = {
          company: this.cardForm.company,
          sale: this.cardForm.sale,
          geshu: this.cardForm.geshu || '',
          title: this.cardForm.title || '',
          img: this.cardForm.img || '',
          add_time: this.cardForm.add_time || '',
          end_time: this.cardForm.end_time,
          sh: this.cardForm.sh,
          pid: this.cardForm.pid
        }
        if (this.cardForm.pid == 10) {
          params.tid = this.cardForm.tid || 0
          params.mrprice = this.cardForm.mrprice || 0
          params.url = this.cardForm.url || ''
          params.kstime = this.cardForm.kstime || ''
          params.jstime = this.cardForm.jstime || ''
        }
        if (this.cardForm.pid == 13) {
          params.hkid = this.cardForm.hkid || 0
          params.gonggao = this.cardForm.gonggao || ''
        }
        if (this.isEdit) params.id = this.editId
        const apiMethod = this.isEdit ? editCard : addCard
        const res = await apiMethod(params)
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.dialogVisible = false
          this.getList()
        } else {
          this.$message.error(res.msg || '操作失败')
        }
      } catch (error) {
        this.$message.error('请求失败')
      } finally {
        this.submitting = false
      }
    },
    handleClose() {
      this.dialogVisible = false
    },

    // ==================== 删除 ====================
    handleDelete(row) {
      this.$confirm('确认删除吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(async () => {
          try {
            const res = await delCard({ ids: row.id.toString() })
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.getList()
            } else {
              this.$message.error(res.msg || '删除失败')
            }
          } catch (error) {
            this.$message.error('请求失败')
          }
        }).catch(() => { })
    },
    batchDelete() {
      if (this.multipleSelection.length === 0) return this.$message.warning('请先选择数据')
      this.$confirm('确认删除选中数据吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(async () => {
          const ids = this.multipleSelection.map(item => item.id).join(',')
          try {
            const res = await delCard({ ids })
            if (res.code === 200) {
              this.$message.success(res.msg)
              this.getList()
            } else {
              this.$message.error(res.msg || '删除失败')
            }
          } catch (error) {
            this.$message.error('请求失败')
          }
        }).catch(() => { })
    },

    // ==================== 路由跳转 ====================
    cardSerch() {
      this.$router.push({ name: 'CardNumsearch' })
    },
    cardNum(row) {
      this.$router.push({ name: 'CardNum', params: { id: row.id } })
    },
    classify(row) {
      this.$router.push({ name: 'ClassFiy', params: { id: row.id } })
    },
    cardLbt(row) {
      this.$router.push({ name: 'cardLbt', params: { id: row.id } })
    },
    permission(row) {
      this.$router.push({ name: 'PerView', params: { id: row.id } })
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
</style>

<style lang="scss" scoped>
.welfareCardList {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;

    .search-form {
      :deep(.el-form-item) {
        margin-bottom: 0;
      }
    }
  }

  .el-radio {
    width: 78px;
    margin-bottom: 4px;
  }

  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      border-color: #409EFF;
    }


    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 88px;
      height: 88px;
      line-height: 88px;
      text-align: center;
    }

    .avatar {
      width: 88px;
      height: 88px;
      display: block;
      object-fit: contain;
    }
  }
}
</style>