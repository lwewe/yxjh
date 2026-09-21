<template>
  <div class="booklists">
    <el-card class="search-card serchForm">
      <el-form :inline="true" :model="searchForm" class="search-form" style="text-align: left;">
        <!-- 中图法分类筛选 -->
        <el-form-item label="">
          <el-select v-model="searchForm.catflag" placeholder="中图法分类" class="w180" clearable filterable>
            <el-option v-for="item in tsflclassList" :key="item.id" :label="item.catname"
              :value="item.catflag"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.search_key" placeholder="搜索字段" class="w120" clearable>
            <el-option label="图书名" value="bookname"></el-option>
            <el-option label="书号" value="bookisbn"></el-option>
            <el-option label="出版单位" value="brandname"></el-option>
            <el-option label="作者" value="author"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchForm.search_val" placeholder="关键词" class="w150" clearable></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.px_key" placeholder="排序字段" class="w120" clearable>
            <el-option label="排序" value="px"></el-option>
            <el-option label="库存" value="stocknum"></el-option>
            <el-option label="出版日期" value="productdate"></el-option>
            <el-option label="编号" value="id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.px_val" placeholder="排序方式" class="w120" clearable>
            <el-option label="降序" value="desc"></el-option>
            <el-option label="升序" value="asc"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="searchForm.tuij" placeholder="推荐状态" class="w120" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="推荐" value="1"></el-option>
            <el-option label="未推荐" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.sh" placeholder="上架状态" class="w120" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="未上架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="searchForm.lilv" placeholder="结价/市价" class="w140" clearable>
            <el-option label="全部" value="0"></el-option>
            <el-option label="大于0.8" value="1"></el-option>
            <el-option label="小于0.8" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">查询</el-button>

        </el-form-item>
      </el-form>
    </el-card>

    <!-- 批量修改价格弹窗 -->
    <!-- 批量修改价格弹窗 -->
    <el-dialog title="批量修改价格" :visible.sync="priceDialogVisible" width="50%">
      <el-form :model="priceForm" label-width="100px" style="width: 90%;text-align: left;">


        <el-form-item label="中图法分类">
          <el-select v-model="priceForm.catflag" placeholder="不选则修改全部分类" clearable filterable style="width: 100%">
            <el-option v-for="item in tsflclassList" :key="item.id" :label="item.catname"
              :value="item.catflag"></el-option>
          </el-select>
          <div class="form-tip" style="font-size: 12px; color: #999;">不选则修改全部分类</div>
        </el-form-item>

        <el-form-item label="结价/市价">
          <el-select v-model="priceForm.lilv" placeholder="不选则修改全部产品" clearable style="width: 100%">
            <el-option label="全部" value="0"></el-option>
            <el-option label="大于0.8" value="1"></el-option>
            <el-option label="小于0.8" value="2"></el-option>
          </el-select>
          <div class="form-tip" style="font-size: 12px; color: #999;">不选则修改全部产品</div>
        </el-form-item>

        <el-form-item label="价格调整">
          <el-input v-model="priceForm.edprice" style="width: 90%"></el-input>
          <span style="margin-left: 10px;">%</span>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="priceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPriceChange" :loading="priceLoading">确 定</el-button>
      </div>
    </el-dialog>

    <el-card class="search-card">
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button type="success" size="small" icon="el-icon-edit-outline" @click="openPriceDialog()">修改价格</el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" @click="batchDelete"
          v-if="multipleSelection.length > 1">批量删除</el-button>
      </div>

      <el-table ref="multipleTable" :data="tableData" border tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" v-loading="loading" stripe
        :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
        <el-table-column type="selection" min-width="55"></el-table-column>
        <el-table-column label="编号" min-width="100" prop="id" align="center"></el-table-column>

        <el-table-column label="排序" min-width="120" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.px" size="mini" style="width: 70px;"
              @change="(val) => updatePx(scope.row.id, val)"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="书名" min-width="250" align="left">
          <template slot-scope="scope">
            <div>{{ scope.row.bookname }}</div>
            <div style="font-size: 12px; color: #999;">{{ scope.row.author || '' }}</div>
            <div v-if="scope.row.guanpei_fen1 || scope.row.guanpei_fen2" style="font-size: 11px; color: #409EFF;">
              <span v-if="scope.row.guanpei_fen1">[{{ scope.row.guanpei_fen1.catname }}]</span>
              <span v-if="scope.row.guanpei_fen2">[{{ scope.row.guanpei_fen2.catname }}]</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="书号" min-width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.bookisbn || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="库存/折扣" min-width="130" align="center">
          <template slot-scope="scope">
            {{ scope.row.stocknum || 0 }} / {{ scope.row.zhekou || 0 }}%
          </template>
        </el-table-column>

        <el-table-column label="原价/售价/协议价" min-width="180" align="center">
          <template slot-scope="scope">
            ¥{{ scope.row.price || 0 }} / ¥{{ scope.row.jiage || 0 }} / ¥{{ scope.row.soldprice || 0 }}
          </template>
        </el-table-column>

        <!-- <el-table-column label="精选" width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.jx" :active-value="1" :inactive-value="0" size="small"
              @change="(val) => switchStatus(scope.row.id, 'jx', val)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="推荐" width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.tuij" :active-value="1" :inactive-value="0" size="small"
              @change="(val) => switchStatus(scope.row.id, 'tuij', val)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="上架" width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0"
              @change="(val) => switchStatus(scope.row.id, 'sh', val)"></el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="精选" min-width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.jx" :active-value="1" :inactive-value="0" size="small" active-text=" "
              inactive-text=" " @change="(val) => switchStatus(scope.row.id, 'jx', val)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="推荐" min-width="100" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.tuij" :active-value="1" :inactive-value="0" size="small" active-text=" "
              inactive-text=" " @change="(val) => switchStatus(scope.row.id, 'tuij', val)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="上架" min-width="85" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.sh" :active-value="1" :inactive-value="0" active-text=" " inactive-text=" "
              @change="(val) => switchStatus(scope.row.id, 'sh', val)">
            </el-switch>
          </template>
        </el-table-column>


        <el-table-column label="操作" min-width="220" fixed="right" align="center">
          <template slot-scope="scope">

            <el-button size="mini" type="primary" @click="handleView(scope.row)">查看</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" @click="handleEdit(scope.row)">更新</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
          :page-sizes="[10, 20, 30, 50]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
          :total="total"></el-pagination>
      </div>
    </el-card>

    <!-- 查看/更新抽屉 -->
    <el-drawer :title="dialogTitle" :visible.sync="drawer" direction="rtl" size="60%" :before-close="handleClose">
      <div style="padding: 0 20px;">
        <el-form :model="dialogForm" label-width="100px" label-position="right" style="text-align: left;">


          <el-row>
            <el-col :span="12"> <el-form-item label="图书名：">
                <div class="form-value">{{ dialogForm.bookname || '-' }}</div>
              </el-form-item></el-col>
            <el-col :span="12"> <el-form-item label="图书书号：">
                <div class="form-value">{{ dialogForm.bookisbn || '-' }}</div>
              </el-form-item></el-col>
          </el-row>




          <el-form-item label="商品售价：">
            <el-input v-model="dialogForm.jiage" style="width: 150px;" size="small"></el-input>
            <span class="unit">元</span>
          </el-form-item>

          <el-row>
            <el-col :span="8"><el-form-item label="商品原价：">
                <div class="form-value">¥{{ dialogForm.price || 0 }} 元</div>
              </el-form-item></el-col>
            <el-col :span="8"> <el-form-item label="协议价：">
                <div class="form-value">¥{{ dialogForm.soldprice || 0 }} 元</div>
              </el-form-item></el-col>
            <el-col :span="8"><el-form-item label="折扣：">
                <div class="form-value">{{ dialogForm.zhekou || 0 }}%</div>
              </el-form-item>
            </el-col>
          </el-row>



          <el-row>
            <el-col :span="8"><el-form-item label="商品库存：">


                <div class="form-value">{{ dialogForm.stocknum || '-' }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8"> <el-form-item label="商品重量：">
                <div class="form-value">{{ dialogForm.weight || 0 }} 克</div>
              </el-form-item></el-col>


            <el-col :span="8">
              <el-form-item label="排序：">
                <div class="form-value">{{ dialogForm.px || 0 }}</div>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
            <el-col :span="8"> <el-form-item label="出版单位：">
                <div class="form-value">{{ dialogForm.brandname || '-' }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8"> <el-form-item label="作者、编者：">
                <div class="form-value">{{ dialogForm.author || '-' }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出版日期：">
                <div class="form-value">{{ dialogForm.productdate || '-' }}</div>
              </el-form-item>
            </el-col>
          </el-row>



          <el-form-item label="分类：">
            <div class="form-value">
              <span v-if="dialogForm.guanpei_fen1">[{{ dialogForm.guanpei_fen1.catname }}]</span>
              <span v-if="dialogForm.guanpei_fen2">[{{ dialogForm.guanpei_fen2.catname }}]</span>
              <span v-if="!dialogForm.guanpei_fen1 && !dialogForm.guanpei_fen2">-</span>
            </div>
          </el-form-item>


          <el-form-item label="商品主图：">
            <el-image v-if="dialogForm.imageurl" :src="dialogForm.imageurl"
              style="width: 100px; height: 100px; object-fit: cover;" :preview-src-list="[dialogForm.imageurl]">
            </el-image>
            <span v-else class="form-value">暂无图片</span>
          </el-form-item>

          <el-form-item label="图书简介：">
            <div class="form-value">{{ dialogForm.bookdesc || '暂无' }}</div>
          </el-form-item>

          <el-form-item label="图书目录：">
            <div class="form-value">{{ dialogForm.bookcatalog || '暂无' }}</div>
          </el-form-item>

          <el-form-item label="作者简介：">
            <div class="form-value">{{ dialogForm.authordesc || '暂无' }}</div>
          </el-form-item>


          <el-form-item label="精选：">
            <el-radio-group v-model="dialogForm.jx">
              <el-radio :label="1">精选</el-radio>
              <el-radio :label="0">不精选</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="推荐：">
            <el-radio-group v-model="dialogForm.tuij">
              <el-radio :label="1">推荐</el-radio>
              <el-radio :label="0">不推荐</el-radio>
            </el-radio-group>
          </el-form-item>



          <!-- <el-form-item label="中图法分类：">
            <div class="form-value">
              <span v-if="dialogForm.guanpei_fen1">[{{ dialogForm.guanpei_fen1.catname }}]</span>
              <span v-if="dialogForm.guanpei_fen2">[{{ dialogForm.guanpei_fen2.catname }}]</span>
              <span v-if="!dialogForm.guanpei_fen1 && !dialogForm.guanpei_fen2">-</span>
            </div>
          </el-form-item>

          <el-form-item label="上架状态：">
            <el-switch v-model="dialogForm.sh" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item> -->
        </el-form>

        <div class="drawer-footer">
          <el-button @click="drawer = false">取 消</el-button>
          <el-button type="primary" @click="updateBook" :loading="updateLoading">保 存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  booksBooksList,
  booksEditBooks,
  booksDelBooks,
  booksPxBooks,
  booksSwitchStatus,
  booksBookstsflclass,
  booksEditPriceData
} from '@/api/modules/video'

export default {
  name: 'BookList',
  data() {
    return {
      statusChanging: false,  // 新增：防止重复点击
      drawer: false,
      direction: 'rtl',
      loading: false,
      updateLoading: false,
      priceLoading: false,
      priceDialogVisible: false,
      dialogTitle: '查看图书',
      currentBook: null,
      page: 1,
      limit: 20,
      total: 0,
      tsflclassList: [],
      searchForm: {
        catflag: '',
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        tuij: '',
        sh: '',
        lilv: '0'
      },
      priceForm: {
        edprice: 0,      // 价格调整百分比
        catflag: '',     // 中图法分类（可选）
        lilv: ''         // 结价/市价比率：1-大于0.8，2-小于0.8（可选）
      },
      dialogForm: {
        id: '',
        bookname: '',
        bookisbn: '',
        brandname: '',
        author: '',
        productdate: '',
        stocknum: 0,
        jiage: 0,
        price: 0,
        soldprice: 0,
        zhekou: 0,
        weight: 0,
        px: 0,
        jx: 0,
        tuij: 0,
        sh: 0,
        imageurl: '',
        bookdesc: '',
        bookcatalog: '',
        authordesc: '',
        guanpei_fen1: null,
        guanpei_fen2: null
      },
      multipleSelection: [],
      tableData: []
    }
  },
  created() {
    this.getTsflclassList()
    this.getList()
  },
  methods: {
    handleClose(done) {
      done()
    },

    async getTsflclassList() {
      try {
        const res = await booksBookstsflclass({})
        if (res.code === 200) {
          this.tsflclassList = res.data.list || []
        }
      } catch (error) {
        console.error('获取中图法分类失败:', error)
      }
    },

    async getList() {
      this.loading = true
      try {
        const params = {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })
        const res = await booksBooksList(params)
        if (res.code === 200) {
          this.tableData = res.data.data || []
          this.total = res.data.total || 0
        } else {
          this.$message.error(res.msg || '获取列表失败')
        }
      } catch (error) {
        console.error('获取列表失败:', error)
        this.$message.error('获取列表失败')
      } finally {
        this.loading = false
      }
    },

    handleSearch() {
      this.page = 1
      this.getList()
    },

    resetSearch() {
      this.searchForm = {
        catflag: '',
        search_key: '',
        search_val: '',
        px_key: '',
        px_val: '',
        tuij: '',
        sh: '',
        lilv: ''
      }
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

    handleView(row) {
      this.dialogTitle = '查看图书'
      this.drawer = true
      this.dialogForm = {
        id: row.id,
        bookname: row.bookname,
        bookisbn: row.bookisbn,
        brandname: row.brandname,
        author: row.author,
        productdate: row.productdate,
        stocknum: row.stocknum,
        jiage: row.jiage,
        price: row.price,
        soldprice: row.soldprice,
        zhekou: row.zhekou,
        weight: row.weight,
        px: row.px,
        jx: row.jx,
        tuij: row.tuij,
        sh: row.sh,
        imageurl: row.imageurl,
        bookdesc: row.bookdesc,
        bookcatalog: row.bookcatalog,
        authordesc: row.authordesc,
        guanpei_fen1: row.guanpei_fen1,
        guanpei_fen2: row.guanpei_fen2
      }
    },

    handleEdit(row) {
      this.dialogTitle = '编辑图书'
      this.drawer = true
      this.dialogForm = {
        id: row.id,
        bookname: row.bookname,
        bookisbn: row.bookisbn,
        brandname: row.brandname,
        author: row.author,
        productdate: row.productdate,
        stocknum: row.stocknum,
        jiage: row.jiage,
        price: row.price,
        soldprice: row.soldprice,
        zhekou: row.zhekou,
        weight: row.weight,
        px: row.px,
        jx: row.jx,
        tuij: row.tuij,
        sh: row.sh,
        imageurl: row.imageurl,
        bookdesc: row.bookdesc,
        bookcatalog: row.bookcatalog,
        authordesc: row.authordesc,
        guanpei_fen1: row.guanpei_fen1,
        guanpei_fen2: row.guanpei_fen2
      }
    },

    async updateBook() {
      this.updateLoading = true
      try {
        const res = await booksEditBooks({
          id: this.dialogForm.id,
          jiage: this.dialogForm.jiage,
          sh: this.dialogForm.sh,
          jx: this.dialogForm.jx,
          tuij: this.dialogForm.tuij,
          px: this.dialogForm.px,
          // stocknum: this.dialogForm.stocknum
        })
        if (res.code === 200) {
          this.$message.success('更新成功')
          this.drawer = false
          this.getList()
        } else {
          this.$message.error(res.msg || '更新失败')
        }
      } catch (error) {
        console.error('更新失败:', error)
        this.$message.error('更新失败')
      } finally {
        this.updateLoading = false
      }
    },

    handleDelete(id) {
      this.$confirm('确认删除该图书吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await booksDelBooks({ ids: id })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      const ids = this.multipleSelection.map(item => item.id).join(',')
      this.$confirm(`确认删除选中的${this.multipleSelection.length}条图书吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await booksDelBooks({ ids })
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.msg || '删除失败')
          }
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      }).catch(() => { })
    },

    async updatePx(id, px) {
      try {
        const res = await booksPxBooks({ id, px })
        if (res.code === 200) {
          this.$message.success('排序修改成功')
        } else {
          this.$message.error(res.msg || '排序修改失败')
          this.getList()
        }
      } catch (error) {
        console.error('排序修改失败:', error)
        this.$message.error('排序修改失败')
        this.getList()
      }
    },
    // 修改状态（带确认框）
    async switchStatus(id, type, val) {
      const targetStatus = val ? 1 : 0

      // 根据类型生成对应的文本
      let typeText = ''
      let actionText = ''
      switch (type) {
        case 'jx':
          typeText = '精选'
          actionText = targetStatus === 1 ? '设为精选' : '取消精选'
          break
        case 'tuij':
          typeText = '推荐'
          actionText = targetStatus === 1 ? '设为推荐' : '取消推荐'
          break
        case 'sh':
          typeText = '上架'
          actionText = targetStatus === 1 ? '上架' : '下架'
          break
        default:
          typeText = '状态'
          actionText = targetStatus === 1 ? '开启' : '关闭'
      }

      try {
        await this.$confirm(`确认${actionText}该图书吗？`, '提示', {
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
        const res = await booksSwitchStatus({ id, type })
        if (res.code === 200) {
          this.$message.success(`${actionText}成功`)
          // 不需要重新获取列表，因为状态已经在界面上通过 v-model 更新了
        } else {
          this.$message.error(res.msg || `${actionText}失败`)
          // 失败时重新获取列表恢复状态
          this.getList()
        }
      } catch (error) {
        console.error('切换状态失败:', error)
        this.$message.error('网络错误，请稍后重试')
        // 失败时重新获取列表恢复状态
        this.getList()
      } finally {
        this.statusChanging = false
      }
    },
    // async switchStatus(id, type, val) {
    //   try {
    //     const res = await booksSwitchStatus({ id, type })
    //     if (res.code === 200) {
    //       this.$message.success('状态修改成功')
    //     } else {
    //       this.$message.error(res.msg || '状态修改失败')
    //       this.getList()
    //     }
    //   } catch (error) {
    //     console.error('状态修改失败:', error)
    //     this.$message.error('状态修改失败')
    //     this.getList()
    //   }
    // },

    openPriceDialog() {
      this.priceForm = {
        edprice: 0,
        catflag: '',
        lilv: ''
      }
      this.priceDialogVisible = true
    },

    async submitPriceChange() {
      if (this.priceForm.edprice === 0) {
        this.$message.warning('请输入调整值')
        return
      }

      this.priceLoading = true
      try {
        const params = {}

        // 必传参数
        params.edprice = String(this.priceForm.edprice)

        // 可选参数：有值才传
        if (this.priceForm.catflag) {
          params.catflag = this.priceForm.catflag
        }
        if (this.priceForm.lilv) {
          params.lilv = this.priceForm.lilv
        }

        const res = await booksEditPriceData(params)
        if (res.code === 200) {
          this.$message.success(`价格修改成功，共修改 ${res.data?.count || 0} 条数据`)
          this.priceDialogVisible = false
          this.getList()  // 刷新列表
        } else {
          this.$message.error(res.msg || '价格修改失败')
        }
      } catch (error) {
        console.error('价格修改失败:', error)
        this.$message.error('价格修改失败')
      } finally {
        this.priceLoading = false
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
.booklists {
  font-size: 14px;
}

.booklists .search-card {
  margin-bottom: 20px;
}

.booklists .search-card .search-form :deep(.el-form-item) {
  margin-bottom: 0;
}

.booklists .pagination {
  margin-top: 20px;
  text-align: right;
}

.booklists {
  .w120 {
    width: 120px;
  }

  .w140 {
    width: 140px;
  }

  .w150 {
    width: 150px;
  }

  .w180 {
    width: 180px;
  }

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

  .form-value {
    /* line-height: 32px; */
    color: #606266;
  }

  .unit {
    margin-left: 8px;
    color: #909399;
  }

  .drawer-footer {
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid #e4e7ed;
    margin-top: 20px;
  }
}
</style>