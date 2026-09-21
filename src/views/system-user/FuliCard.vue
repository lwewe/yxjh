<template>
  <div class="systemfulika">
    <el-card class="search-card">
      <!-- Tab切换按钮 -->
      <div style="text-align: left; margin-bottom: 20px;">
        <el-button :type="activeTab === 'fuli' ? 'success' : 'default'" size="mini"
          @click="switchTab('fuli')">福利卡</el-button>
        <el-button :type="activeTab === 'exchange' ? 'success' : 'default'" size="mini"
          @click="switchTab('exchange')">观影权益券</el-button>
        <el-button :type="activeTab === 'quan' ? 'success' : 'default'" size="mini"
          @click="switchTab('quan')">购买的电子券</el-button>
      </div>

      <!-- ==================== 福利卡列表 ==================== -->
      <div v-if="activeTab === 'fuli'">
        <el-table :data="fuliList" border   style="width: 100%;" v-loading="loading"  stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }">
          <el-table-column label="编号" width="120" align="center" prop="id"></el-table-column>
          <el-table-column label="卡号" width="220" align="left">
            <template slot-scope="scope">
              {{ scope.row.num }}
              <span v-if="scope.row.del == 1" class="dangerCl">[卡已删除]</span>
            </template>
          </el-table-column>
          <el-table-column label="密码" width="190" align="center" prop="pass"></el-table-column>
          <el-table-column label="价格" width="100" align="center">
            <template slot-scope="scope">
              ¥{{ formatPrice(scope.row.price) }}
            </template>
          </el-table-column>
          <el-table-column label="标题" min-width="200" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.show" style="cursor:pointer;" @click="showDetail(scope.row)">
                <span :style="{ color: getPidBgColor(scope.row.pid) }">{{ cardTypeMap[scope.row.show.pid] || '未知'
                  }}</span>
                <span>{{ scope.row.show.id }}-{{ scope.row.show.company }}</span>
              </span>
              <span v-else style="color:#999">-</span>
            </template>
          </el-table-column>
          <el-table-column label="绑定时间" width="170" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.bd_time) }}
            </template>
          </el-table-column>
          <el-table-column label="截止日期" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.end_time ? formatTime(scope.row.end_time) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="openRecord(scope.row)">记录</el-button>
              <el-button size="mini" type="info" @click="openEdit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="fuliTotal > 0">
          <el-pagination key="fuli-pagination" background @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :current-page="fuliPage" :page-sizes="[10, 20, 50, 100]"
            :page-size="fuliLimit" layout="total, sizes, prev, pager, next, jumper" :total="fuliTotal">
          </el-pagination>
        </div>
      </div>

      <!-- ==================== 观影权益券列表 ==================== -->
      <div v-if="activeTab === 'exchange'">
        <el-table :data="exchangeList" border  stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }" style="width: 100%;" v-loading="loading">
          <el-table-column label="编号" width="120" align="center" prop="id"></el-table-column>
          <el-table-column label="卡号" width="190" align="left">
            <template slot-scope="scope">
              {{ scope.row.num }}
              <span v-if="scope.row.del == 1" class="dangerCl">[已删除]</span>
            </template>
          </el-table-column>
          <el-table-column label="密码" width="190" align="center" prop="pass"></el-table-column>
          <el-table-column label="次数" width="80" align="center" prop="cishu"></el-table-column>
          <el-table-column label="标题" min-width="220" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.show" class="blueCl" style="cursor:pointer;" @click="showExchangeDetail(scope.row)">
                {{ scope.row.show.id }}-{{ scope.row.show.company }}-{{ scope.row.show.sale }}
              </span>
              <span v-else style="color:#999">-</span>
            </template>
          </el-table-column>
          <el-table-column label="绑定时间" width="170" align="center">
            <template slot-scope="scope">
              {{ formatTime(scope.row.bd_time) }}
            </template>
          </el-table-column>
          <el-table-column label="截止日期" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.end_time ? formatTime(scope.row.end_time) : '-' }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="handleRecord(scope.row)">记录</el-button>
              <el-button size="mini" type="info" @click="handleEdit(scope.row)">修改</el-button>
            </template>
          </el-table-column> -->

          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="openExchangeRecord(scope.row)">记录</el-button>
              <el-button size="mini" type="info" @click="openExchangeEdit(scope.row)">修改</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="pagination" v-if="exchangeTotal > 0">
          <el-pagination key="exchange-pagination" background @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :current-page="exchangePage" :page-sizes="[10, 20, 50, 100]"
            :page-size="exchangeLimit" layout="total, sizes, prev, pager, next, jumper" :total="exchangeTotal">
          </el-pagination>
        </div>
      </div>

      <!-- ==================== 电子券列表 ==================== -->
      <div v-if="activeTab === 'quan'">
        <el-table :data="quanList" border  stripe
          :header-cell-style="{ background: '#f5f7fa', color: '#606266', fontWeight: 'bold' }" style="width: 100%;" v-loading="loading">
          <el-table-column label="编号" width="120" align="center" prop="id"></el-table-column>
          <el-table-column label="卡号" width="190" align="left" prop="num"></el-table-column>
          <el-table-column label="密码" width="190" align="center" prop="pass"></el-table-column>
          <el-table-column label="标题" min-width="200" align="left">
            <template slot-scope="scope">
              <span v-if="scope.row.show">{{ scope.row.show.id }}-{{ scope.row.show.title }}</span>
              <span v-else style="color:#999">({{ scope.row.pid }})</span>
            </template>
          </el-table-column>
          <el-table-column label="兑换时间" width="170" align="center">
            <template slot-scope="scope">{{ formatTime(scope.row.dh_time) }}</template>
          </el-table-column>
          <el-table-column label="截止日期" width="170" align="center">
            <template slot-scope="scope">{{ scope.row.end_time ? formatTime(scope.row.end_time) : '-' }}</template>
          </el-table-column>
          <el-table-column label="领取状态" width="100" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.state === 0">已领取</span>
              <span v-else>未领取</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="quanTotal > 0">
          <el-pagination key="quan-pagination" background @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :current-page="quanPage" :page-sizes="[10, 20, 50, 100]"
            :page-size="quanLimit" layout="total, sizes, prev, pager, next, jumper" :total="quanTotal">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- ==================== 福利卡修改抽屉 ==================== -->
    <el-drawer title="修改卡号" :visible.sync="editDrawerVisible" direction="rtl" size="60%"
      :before-close="handleEditDrawerClose">
      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <el-form :model="editForm" label-width="100px" style="width: 80%;text-align: left;">
            <el-form-item label="卡号：" class="addBorder">
              <el-input v-model="editForm.num" readonly />
            </el-form-item>
            <el-form-item label="密码：" class="addBorder">
              <el-input v-model="editForm.pass" readonly />
            </el-form-item>
            <el-form-item v-if="editForm.del == 1" style="text-align: left;">
              <span style="color: #ff0000">卡已删除</span>
            </el-form-item>
            <el-form-item label="价格：">
              <div v-if="editForm.state != 3" class="addBorder">
                <el-input v-model="editForm.price" placeholder="0.00" />
              </div>
              <div v-else class="dflex al-center">
                <el-input v-model="editForm.price" style="width:100px;margin-right:10px;" readonly />
                <el-select v-model="editForm.addtype" style="width:80px;margin-right:10px;">
                  <el-option label="增加" value="1" />
                  <el-option label="减少" value="2" />
                </el-select>
                <el-input v-model="editForm.addprice" placeholder="金额" style="width:100px;margin-right:10px;" />
                <el-button type="success" @click="savePrice" :loading="priceSubmitting">保存</el-button>
              </div>
            </el-form-item>
            <el-form-item label="删除状态：">
              <el-radio-group v-model="editForm.del">
                <el-radio :label="0">正常</el-radio>
                <el-radio :label="1">删除</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="激活状态：" v-if="editForm.state != 3">
              <el-radio-group v-model="editForm.state">
                <el-radio :label="1">未激活</el-radio>
                <el-radio :label="2">已激活</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="激活状态：" v-else class="addBorder">
              <el-input value="已绑定" readonly />
            </el-form-item>
            <el-form-item v-if="editForm.state == 3" label="兑换用户：" class="addBorder">
              <el-input :value="editForm.uid + '  兑换时间 ' + formatTime(editForm.bd_time)" readonly />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitEdit" :loading="editSubmitting">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-drawer>

    <!-- ==================== 消费记录抽屉 ==================== -->
    <el-drawer title="消费记录" :visible.sync="recordDrawer" direction="rtl" size="60%"
      :before-close="handleRecordDrawerClose">
      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <el-form :model="recordCardInfo" label-width="100px" style="width: 80%;text-align: left;">
            <el-form-item label="卡号：" class="addBorder">
              <el-input v-model="recordCardInfo.kh" readonly />
            </el-form-item>
            <el-form-item label="密码：" class="addBorder">
              <el-input v-model="recordCardInfo.mm" readonly />
            </el-form-item>
            <el-form-item label="价格：" class="addBorder">
              <el-input v-model="recordCardInfo.price" readonly />
            </el-form-item>
            <el-form-item label="激活状态：" class="addBorder">
              <el-input v-model="recordCardInfo.activeStatus" readonly />
            </el-form-item>
            <el-form-item label="兑换用户：" class="addBorder">
              <el-input v-model="recordCardInfo.exchangeUser" readonly />
            </el-form-item>
          </el-form>

          <el-table :data="recordList" border style="width: 100%" max-height="300" v-loading="recordLoading">
            <el-table-column label="编号" align="center" prop="id"></el-table-column>
            <el-table-column label="金额" align="center">
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
            <el-table-column label="时间" align="center" width="200">
              <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
            </el-table-column>
            <el-table-column label="订单号" align="center" prop="order_no"></el-table-column>
            <el-table-column label="交易号" align="center" prop="transaction_id"></el-table-column>
            <el-table-column label="实付金额" align="center" prop="total_fee"></el-table-column>
          </el-table>
          <div style="text-align:right;margin-top:20px;">
            <el-pagination background @size-change="handleRecordSizeChange" @current-change="handleRecordCurrentChange"
              :current-page="recordPage" :page-sizes="[10, 20, 30, 50]" :page-size="recordLimit"
              layout="total,sizes,prev,pager,next,jumper" :total="recordTotal">
            </el-pagination>
          </div>
        </el-card>
      </div>
    </el-drawer>

    <!-- ==================== 福利卡详情弹窗 ==================== -->
    <el-dialog title="福利卡详情" :visible.sync="detailVisible" width="50%" :before-close="handleDetailClose">
      <div v-loading="detailLoading" style="padding: 10px;">
        <el-form label-width="140px" style="text-align: left;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="卡类型：">
                <span :style="{ color: getPidBgColor(detailData.pid) }">{{ cardTypeMap[detailData.pid] || '未知' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开卡客户：">{{ detailData.company || '-' }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="销售人：">{{ detailData.sale || '-' }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数量：">{{ detailData.geshu || '-' }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标题：">{{ detailData.title || '-' }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="制卡时间：">{{ formatTime(detailData.add_time) }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效日期：">{{ formatTime(detailData.end_time) }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发布状态：">
                <span v-if="detailData.sh === 1">已发布</span>
                <span v-else>未发布</span>
              </el-form-item>
            </el-col>
          </el-row>
          <template v-if="detailData.pid == 10">
            <el-row>
              <el-col :span="12">
                <el-form-item label="页面形式：">{{ getSczxqTitle(detailData.tid) }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品价格：">{{ mrpriceMap[detailData.mrprice] || '全部' }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="链接地址：">{{ detailData.url || '-' }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品开始时间：">{{ formatTime(detailData.kstime) }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品结束时间：">{{ formatTime(detailData.jstime) }}</el-form-item>
              </el-col>
            </el-row>
          </template>
          <template v-if="detailData.pid == 13">
            <el-row>
              <el-col :span="12">
                <el-form-item label="首页形式：">{{ getThqTitle(detailData.hkid) }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="公告：">{{ detailData.gonggao || '-' }}</el-form-item>
              </el-col>
            </el-row>
          </template>
          <el-row v-if="detailData.img">
            <el-col :span="12">
              <el-form-item label="Banner：">
                <img :src="detailData.img" style="width:100px;height:100px;object-fit:contain;border:1px solid #eee;">
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="display:block;text-align:center;">
        <el-button @click="detailVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- ==================== 观影权益券详情弹窗 ==================== -->
    <el-dialog title="观影权益券详情" :visible.sync="exchangeDetailVisible" width="50%"
      :before-close="handleExchangeDetailClose">
      <div v-loading="exchangeDetailLoading" style="padding: 10px;">
        <el-form label-width="140px" style="text-align: left;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="开卡客户：">{{ exchangeDetailData.company || '-' }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="销售人：">{{ exchangeDetailData.sale || '-' }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="下单次数：">{{ exchangeDetailData.cishu || '-' }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="限制价格：">{{ exchangeDetailData.price || '-' }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="是否限制价格：">
                {{ exchangeDetailData.flag == 1 ? '限制(只展示限制价格以下的影片)' : '不限制(影片全部展示,价格超了微信支付)' }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="制券时间：">{{ formatTime(exchangeDetailData.add_time) }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效日期：">{{ formatTime(exchangeDetailData.end_time) }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="限制每日购买次数：">{{ exchangeDetailData.num || 0 }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布状态：">{{ exchangeDetailData.sh == 1 ? '已发布' : '未发布' }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style="display:block;text-align:center;">
        <el-button @click="exchangeDetailVisible = false">关 闭</el-button>
      </span>
    </el-dialog>



    </el-card>

    <!-- ==================== 观影权益券修改抽屉 ==================== -->
    <el-drawer title="修改券号" :visible.sync="exchangeEditDrawerVisible" direction="rtl" size="60%">
      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <el-form :model="exchangeEditForm" label-width="120px" style="width: 90%;text-align: left;">
            <el-form-item label="券号：">
              <span>{{ exchangeEditForm.num }}</span>
            </el-form-item>
            <el-form-item label="密码：">
              <span>{{ exchangeEditForm.pass }}</span>
            </el-form-item>
            <el-form-item label="下单次数：" v-if="exchangeEditForm.state == 3">
              <span>{{ exchangeEditForm.cishu || 0 }}</span>
              <span style="margin-left: 30px;">
                <el-select v-model="exchangeEditForm.addtype" style="width: 80px;">
                  <el-option label="增加" value="1"></el-option>
                  <el-option label="减少" value="2"></el-option>
                </el-select>
                <el-input v-model="exchangeEditForm.addcishu" placeholder="下单次数" style="width: 120px; margin-left: 5px;"
                  type="number"></el-input>
                <el-button type="success" style="margin-left: 5px;" @click="submitExchangeEditCishu"
                  :loading="exchangeEditCishuSubmitting">保存</el-button>
              </span>
            </el-form-item>
            <el-form-item label="下单次数：" v-else>
              <el-input v-model="exchangeEditForm.cishu" placeholder="请输入下单次数" type="number"></el-input>
            </el-form-item>
            <el-form-item label="激活状态：" v-if="exchangeEditForm.state == 3">
              <span>已绑定</span>
            </el-form-item>
            <el-form-item label="激活状态：" v-else>
              <el-radio-group v-model="exchangeEditForm.state">
                <el-radio :label="1">未激活</el-radio>
                <el-radio :label="2">已激活</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="绑定用户：" v-if="exchangeEditForm.uid">
              <span>{{ exchangeEditForm.uid }} &nbsp; 绑定时间 {{ formatTime(exchangeEditForm.bd_time) }}</span>
            </el-form-item>
          </el-form>
          <div style="text-align:center;margin-top:20px;" v-if="exchangeEditForm.state != 3">
            <el-button @click="exchangeEditDrawerVisible = false">取消</el-button>
            <el-button type="primary" @click="submitExchangeEdit" :loading="exchangeEditSubmitting">保存</el-button>
          </div>
        </el-card>
      </div>
    </el-drawer>

    <!-- ==================== 观影权益券记录抽屉 ==================== -->
    <el-drawer title="消费记录" :visible.sync="exchangeRecordDrawer" direction="rtl" size="60%"
      :before-close="handleExchangeRecordClose">
      <div style="padding: 0px 20px 20px 20px;">
        <el-card class="search-card">
          <el-form :model="exchangeRecordInfo" label-width="100px" style="width: 80%; text-align: left;">
            <el-form-item label="券号：" class="addBorder">
              <el-input v-model="exchangeRecordInfo.num" readonly />
            </el-form-item>
            <el-form-item label="密码：" class="addBorder">
              <el-input v-model="exchangeRecordInfo.pass" readonly />
            </el-form-item>
            <el-form-item label="下单次数：" class="addBorder">
              <el-input v-model="exchangeRecordInfo.cishu" readonly />
            </el-form-item>
            <el-form-item label="激活状态：" class="addBorder">
              <el-input :value="stateName(exchangeRecordInfo.state)" readonly />
            </el-form-item>
            <el-form-item v-if="exchangeRecordInfo.state == 3" label="绑定用户：" class="addBorder">
              <el-input
                :value="exchangeRecordInfo.uid ? exchangeRecordInfo.uid + '    绑定时间 ' + formatTime(exchangeRecordInfo.bd_time) : '-'"
                readonly />
            </el-form-item>
          </el-form>

          <el-table :data="exchangeRecordList" border style="width: 100%" max-height="300"
            v-loading="exchangeRecordLoading">
            <el-table-column label="编号" align="center" width="80" prop="id"></el-table-column>
            <el-table-column label="下单次数" align="center" width="100">
              <template slot-scope="scope">
                <span :style="{ color: scope.row.flag == 1 || scope.row.flag == 4 ? '#f56c6c' : '#67c23a' }">
                  {{ scope.row.flag == 1 || scope.row.flag == 4 ? '-' : '+' }}{{ scope.row.cishu }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="center" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.flag == 1" class="dangerCl">消费</span>
                <span v-else-if="scope.row.flag == 2" class="greenCl">充值</span>
                <span v-else-if="scope.row.flag == 3" class="dangerCl">后台充值</span>
                <span v-else-if="scope.row.flag == 4" class="blueCl">后台扣除</span>
              </template>
            </el-table-column>
            <el-table-column label="时间" align="center" width="180">
              <template slot-scope="scope">{{ formatTime(scope.row.add_time) }}</template>
            </el-table-column>
            <el-table-column label="订单号" align="center" prop="order_no"></el-table-column>
            <el-table-column label="交易号" align="center" prop="transaction_id"></el-table-column>
            <el-table-column label="实付金额" align="center" width="100" prop="total_fee"></el-table-column>
          </el-table>

          <div style="text-align:right;margin-top:20px;">
            <el-pagination background @size-change="handleExchangeRecordSizeChange"
              @current-change="handleExchangeRecordCurrentChange" :current-page="exchangeRecordPage"
              :page-sizes="[10, 20, 30, 50]" :page-size="exchangeRecordLimit"
              layout="total,sizes,prev,pager,next,jumper" :total="exchangeRecordTotal">
            </el-pagination>
          </div>
        </el-card>
      </div>
    </el-drawer>

  </div>
</template>

<script>
import { registerFuli, registerExchange, registerQuan } from '@/api/modules/zhichong'
import { getCard, sczxqFrom, thqFrom } from '@/api/modules/card'
import { getNumInfo, editNum, editPrice, xfjl } from '@/api/modules/card'
import { getExchange } from '@/api/modules/exchange'

import { getQuanInfo, editQuan, editCishu, xfjl as exchangeXfjl } from '@/api/modules/exchange'


export default {
  name: 'FuliCard',
  data() {
    return {
      // 观影券修改抽屉
      exchangeEditDrawerVisible: false,
      exchangeEditSubmitting: false,
      exchangeEditCishuSubmitting: false,
      exchangeEditForm: {
        id: '', num: '', pass: '', gid: '', cishu: '', state: 1,
        uid: '', bd_time: '', addtype: '1', addcishu: ''
      },
      exchangeCardList: [],
      // 观影券记录抽屉
      exchangeRecordDrawer: false,
      exchangeRecordLoading: false,
      exchangeRecordInfo: { num: '', pass: '', cishu: '', state: 1, uid: 0, bd_time: 0 },
      exchangeRecordList: [],
      exchangeRecordPage: 1,
      exchangeRecordLimit: 10,
      exchangeRecordTotal: 0,
      exchangeCurrentRecordRow: null,
      // 修改抽屉
      editDrawerVisible: false,
      editSubmitting: false,
      priceSubmitting: false,
      editForm: {
        id: '', num: '', pass: '', price: '', addtype: '1', addprice: '',
        del: 0, state: 1, uid: 0, bd_time: 0
      },
      // 记录抽屉
      recordDrawer: false,
      recordLoading: false,
      recordCardInfo: { kh: '', mm: '', price: '', activeStatus: '', exchangeUser: '' },
      recordList: [],
      recordPage: 1,
      recordLimit: 10,
      recordTotal: 0,
      currentRecordRow: null,
      // 观影券详情
      exchangeDetailVisible: false,
      exchangeDetailLoading: false,
      exchangeDetailData: {},
      // 页面形式
      sczxqOptions: [],
      thqOptions: [],
      mrpriceMap: {
        0: '全部', 1: '100', 2: '150', 3: '200', 4: '300',
        5: '400', 6: '500', 7: '600', 8: '700',
        9: '150以下', 10: '200以下', 11: '300以下',
        12: '400以下', 13: '500以下', 14: '600以下'
      },
      // 福利卡详情弹窗
      detailVisible: false,
      detailLoading: false,
      detailData: { id: '', pid: '', company: '', sale: '', geshu: '', title: '', img: '', add_time: '', end_time: '', sh: '', url: '', gonggao: '' },
      userId: '',
      activeTab: 'fuli',
      loading: false,
      fuliList: [], fuliPage: 1, fuliLimit: 10, fuliTotal: 0,
      exchangeList: [], exchangePage: 1, exchangeLimit: 10, exchangeTotal: 0,
      quanList: [], quanPage: 1, quanLimit: 10, quanTotal: 0,
      cardTypeMap: {
        1: '超级卡', 2: '蛋糕卡', 3: '电影卡', 4: '图书卡',
        5: '超级券', 6: '蛋糕券', 7: '电影券', 8: '图书券',
        9: '悦享卡', 10: '商城尊享券', 11: '电影尊享券',
        12: '蛋糕尊享券', 13: '提货券', 14: '工会消费券'
      }
    }
  },
  mounted() {
    this.userId = this.$route.query.id || this.$route.params.id || ''
    if (!this.userId) {
      this.$message.warning('缺少用户ID参数')
      return
    }
    this.getFuliList()
  },
  methods: {
    // ============ 观影券修改 ============
    async openExchangeEdit(row) {
      try {
        const res = await getQuanInfo({ id: row.id })
        if (res.code === 200) {
          const numData = res.data.num
          this.exchangeCardList = res.data.exchange_list || []
          this.exchangeEditForm = {
            id: numData.id, num: numData.num, pass: numData.pass,
            gid: numData.gid || '', cishu: numData.cishu || '',
            state: numData.state, uid: numData.uid || '',
            bd_time: numData.bd_time || '', addtype: '1', addcishu: ''
          }
          this.exchangeEditDrawerVisible = true
        } else {
          this.$message.error(res.msg || '获取信息失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      }
    },

    async submitExchangeEdit() {
      if (this.exchangeEditForm.state == 3) return
      this.exchangeEditSubmitting = true
      try {
        const res = await editQuan({
          id: this.exchangeEditForm.id,
          gid: this.exchangeEditForm.gid,
          cishu: this.exchangeEditForm.cishu,
          state: String(this.exchangeEditForm.state)
        })
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.exchangeEditDrawerVisible = false
          this.getExchangeList()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.exchangeEditSubmitting = false
      }
    },

    async submitExchangeEditCishu() {
      if (!this.exchangeEditForm.addcishu) {
        this.$message.warning('请输入次数')
        return
      }
      this.exchangeEditCishuSubmitting = true
      try {
        const res = await editCishu({
          id: this.exchangeEditForm.id,
          addtype: this.exchangeEditForm.addtype,
          addcishu: this.exchangeEditForm.addcishu
        })
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.exchangeEditForm.cishu = res.data.cishu
          this.exchangeEditForm.addcishu = ''
          this.getExchangeList()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.exchangeEditCishuSubmitting = false
      }
    },

    // ============ 观影券记录 ============
    openExchangeRecord(row) {
      this.exchangeCurrentRecordRow = row
      this.exchangeRecordInfo = {
        num: row.num || '', pass: row.pass || '', cishu: row.cishu || '',
        state: row.state, uid: row.uid || 0, bd_time: row.bd_time || 0
      }
      this.exchangeRecordPage = 1
      this.exchangeRecordDrawer = true
      this.getExchangeRecordList()
    },

    async getExchangeRecordList() {
      if (!this.exchangeCurrentRecordRow) return
      this.exchangeRecordLoading = true
      try {
        const formData = new FormData()
        formData.append('gid', String(this.exchangeCurrentRecordRow.gid || this.$route.query.id))
        formData.append('id', String(this.exchangeCurrentRecordRow.id))
        formData.append('page', String(this.exchangeRecordPage))
        formData.append('limit', String(this.exchangeRecordLimit))
        const res = await exchangeXfjl(formData)
        if (res.code === 200) {
          const data = res.data
          if (data.exchange_num) {
            this.exchangeRecordInfo = {
              num: data.exchange_num.num || '',
              pass: this.exchangeCurrentRecordRow.pass || '',
              cishu: String(data.exchange_num.cishu || 0),
              state: Number(data.exchange_num.state) || 1,
              uid: data.exchange_num.uid || 0,
              bd_time: this.exchangeCurrentRecordRow.bd_time || 0
            }
          }
          const listData = data.list || {}
          this.exchangeRecordList = listData.data || []
          this.exchangeRecordTotal = listData.total || 0
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.exchangeRecordLoading = false
      }
    },

    handleExchangeRecordSizeChange(v) {
      this.exchangeRecordLimit = v
      this.exchangeRecordPage = 1
      this.getExchangeRecordList()
    },
    handleExchangeRecordCurrentChange(v) {
      this.exchangeRecordPage = v
      this.getExchangeRecordList()
    },
    handleExchangeRecordClose() {
      this.exchangeRecordDrawer = false
      this.exchangeRecordList = []
      this.exchangeCurrentRecordRow = null
    },

    stateName(s) { return { 1: '未激活', 2: '已激活', 3: '已绑定' }[s] || '' },
    // ============ 修改抽屉 ============
    // ============ 修改抽屉 ============
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
            price: numData.price || row.price,
            addtype: '1',
            addprice: '',
            del: numData.del || 0,
            state: numData.state || row.state,
            uid: numData.uid || row.uid || 0,
            bd_time: numData.bd_time || row.bd_time || 0
          }
        }
      } catch (e) {
        this.editForm = {
          id: row.id, num: row.num, pass: row.pass, price: row.price || '',
          addtype: '1', addprice: '', del: row.del || 0, state: row.state,
          uid: row.uid || 0, bd_time: row.bd_time || 0
        }
      }
      this.editDrawerVisible = true
    },

    // 保存价格调整
    async savePrice() {
      if (!this.editForm.addprice) {
        this.$message.warning('请输入调整金额')
        return
      }
      this.priceSubmitting = true
      try {
        const res = await editPrice({
          id: this.editForm.id,
          addtype: this.editForm.addtype,
          addprice: this.editForm.addprice
        })
        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功')
          if (res.data && res.data.price !== undefined) {
            this.editForm.price = res.data.price
          }
          this.editForm.addprice = ''
          this.refreshFuliList()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.priceSubmitting = false
      }
    },

    // 提交修改
    async submitEdit() {
      this.editSubmitting = true
      try {
        const formData = new FormData()
        formData.append('id', String(this.editForm.id))
        formData.append('del', String(this.editForm.del))
        if (this.editForm.state != 3) {
          formData.append('state', String(this.editForm.state))
          formData.append('price', String(this.editForm.price))
        }
        const res = await editNum(formData)
        if (res.code === 200) {
          this.$message.success(res.msg || '修改成功')
          this.editDrawerVisible = false
          this.refreshFuliList()
        } else {
          this.$message.error(res.msg || '修改失败')
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.editSubmitting = false
      }
    },

    refreshFuliList() {
      if (this.activeTab === 'fuli') this.getFuliList()
      else if (this.activeTab === 'exchange') this.getExchangeList()
      else this.getQuanList()
    },

    // ============ 记录抽屉 ============
    async getRecordList() {
      if (!this.currentRecordRow) return
      this.recordLoading = true
      try {
        const params = {
          gid: String(this.currentRecordRow.gid || this.$route.query.id),
          id: String(this.currentRecordRow.id),
          page: String(this.recordPage),
          limit: String(this.recordLimit)
        }
        const res = await xfjl(params)
        if (res.code === 200) {
          const data = res.data
          const listData = data.list || {}
          this.recordList = listData.data || []
          this.recordTotal = listData.total || 0
        }
      } catch (e) {
        this.$message.error('请求失败')
      } finally {
        this.recordLoading = false
      }
    },
    handleEditDrawerClose() {
      this.editDrawerVisible = false
    },



    // ============ 记录抽屉 ============
    openRecord(row) {
      this.recordCardInfo = {
        kh: row.num || '',
        mm: row.pass || '',
        price: row.price || '',
        activeStatus: { 1: '未激活', 2: '已激活', 3: '已绑定' }[row.state] || '',
        exchangeUser: row.uid ? (row.uid + '  ' + this.formatTime(row.bd_time)) : '-'
      }
      this.currentRecordRow = row
      this.recordPage = 1
      this.recordDrawer = true
      this.getRecordList()
    },

    handleRecordDrawerClose() {
      this.recordDrawer = false
      this.recordList = []
      this.currentRecordRow = null
    },
    handleRecordSizeChange(v) { this.recordLimit = v; this.recordPage = 1; this.getRecordList() },
    handleRecordCurrentChange(v) { this.recordPage = v; this.getRecordList() },

    // ============ 观影券详情 ============
    async showExchangeDetail(row) {
      this.exchangeDetailVisible = true
      this.exchangeDetailLoading = true
      this.exchangeDetailData = {}
      try {
        const res = await getExchange({ id: row.show.id })
        if (res.code === 200) this.exchangeDetailData = res.data
      } catch (error) {
        this.$message.error('获取详情失败')
      } finally {
        this.exchangeDetailLoading = false
      }
    },
    handleExchangeDetailClose() {
      this.exchangeDetailVisible = false
      this.exchangeDetailData = {}
    },

    // ============ 福利卡详情弹窗 ============
    async loadFormOptions() {
      try {
        const [sczxqRes, thqRes] = await Promise.all([sczxqFrom(), thqFrom()])
        if (sczxqRes.code === 200) this.sczxqOptions = sczxqRes.data || []
        if (thqRes.code === 200) this.thqOptions = thqRes.data || []
      } catch (error) { console.error('加载页面形式失败') }
    },
    getSczxqTitle(tid) {
      if (!tid || tid == 0) return '未设置'
      const item = this.sczxqOptions.find(i => i.id == tid)
      return item ? item.title : '未知'
    },
    getThqTitle(hkid) {
      if (!hkid || hkid == 0) return '未设置'
      const item = this.thqOptions.find(i => i.id == hkid)
      return item ? item.title : '未知'
    },
    async showDetail(row) {
      this.detailVisible = true
      this.detailLoading = true
      this.detailData = {}
      try {
        await this.loadFormOptions()
        const res = await getCard({ id: row.show.id })
        if (res.code === 200) this.detailData = res.data
      } catch (error) { this.$message.error('获取详情失败') }
      finally { this.detailLoading = false }
    },
    handleDetailClose() { this.detailVisible = false; this.detailData = {} },

    // ============ 通用方法 ============
    getPidBgColor(pid) {
      const m = { 1: '#b07229', 2: '#f8054f', 3: '#E6A23C', 4: '#419e3c', 5: '#409EFF', 6: '#f8054f', 7: '#E6A23C', 8: '#419e3c', 9: '#b07229', 10: '#409EFF', 11: '#E6A23C', 12: '#233722', 13: '#233722', 14: '#909399' }
      return m[pid] || '#409EFF'
    },
    switchTab(tab) {
      this.activeTab = tab
      if (tab === 'fuli') this.getFuliList()
      else if (tab === 'exchange') this.getExchangeList()
      else if (tab === 'quan') this.getQuanList()
    },
    async getFuliList() {
      this.loading = true
      try {
        const res = await registerFuli({ id: this.userId, page: this.fuliPage, limit: this.fuliLimit })
        if (res.code === 200) { this.fuliList = res.data.data || []; this.fuliTotal = res.data.total || 0 }
      } catch (e) { this.$message.error('获取福利卡列表失败') }
      finally { this.loading = false }
    },
    async getExchangeList() {
      this.loading = true
      try {
        const res = await registerExchange({ id: this.userId, page: this.exchangePage, limit: this.exchangeLimit })
        if (res.code === 200) { this.exchangeList = res.data.data || []; this.exchangeTotal = res.data.total || 0 }
      } catch (e) { this.$message.error('获取观影权益券列表失败') }
      finally { this.loading = false }
    },
    async getQuanList() {
      this.loading = true
      try {
        const res = await registerQuan({ id: this.userId, page: this.quanPage, limit: this.quanLimit })
        if (res.code === 200) { this.quanList = res.data.data || []; this.quanTotal = res.data.total || 0 }
      } catch (e) { this.$message.error('获取电子券列表失败') }
      finally { this.loading = false }
    },
    handleSizeChange(val) {
      if (this.activeTab === 'fuli') { this.fuliLimit = val; this.fuliPage = 1; this.getFuliList() }
      else if (this.activeTab === 'exchange') { this.exchangeLimit = val; this.exchangePage = 1; this.getExchangeList() }
      else { this.quanLimit = val; this.quanPage = 1; this.getQuanList() }
    },
    handleCurrentChange(val) {
      if (this.activeTab === 'fuli') { this.fuliPage = val; this.getFuliList() }
      else if (this.activeTab === 'exchange') { this.exchangePage = val; this.getExchangeList() }
      else { this.quanPage = val; this.getQuanList() }
    },
    // handleRecord(row) { this.$message.info('记录功能待开发') },
    // handleEdit(row) { this.$message.info('修改功能待开发') },
    formatPrice(price) {
      if (price === null || price === undefined || price === '') return '0.00'
      return Number(price).toFixed(2)
    },
    formatTime(timestamp) {
      if (!timestamp || timestamp == 0) return '-'
      const date = new Date(timestamp * 1000)
      const pad = n => String(n).padStart(2, '0')
      return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds())
    }
  }
}
</script>

<style lang="scss" scoped>
.systemfulika {
  font-size: 14px;

  .search-card {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }

  .dangerCl {
    color: #f56c6c;
  }

  .blueCl {
    color: #409eff;
  }

  .addBorder {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }

  .greenCl {
    color: #67c23a;
    font-weight: bold;
  }

  .addBorder :deep(.el-input__inner) {
    border: 1px solid #dcdfe6;
    background-color: #f5f7fa;
  }
}
</style>