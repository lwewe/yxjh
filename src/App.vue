<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import Layout from './layout/Layout.vue'

export default {
  name: 'App',
  components: {
    // HelloWorld,
    // Layout
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

ul,
li {
  list-style: none;
}

html,
body,
#app {
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
}

.mb16 {
  margin-bottom: 16px;
}

.w100 {
  width: 100%;
}

.dflex {
  display: flex;
}

.flex-between {
  justify-content: space-between;
}

.flex-around {
  justify-content: space-around;
}

.al-center {
  align-items: center;
}

.mt10 {
  margin-top: 10px;
}

.mt2 {
  margin-top: 2px;
}

.mt3 {
  margin-top: 3px;
}

.mt4 {
  margin-top: 4px;
}

.mt5 {
  margin-top: 5px;
}

.mt6 {
  margin-top: 6px;
}

.mt8 {
  margin-top: 8px;
}

.mt20 {
  margin-top: 20px;
}

.mb20 {
  margin-bottom: 20px;
}

.mb10 {
  margin-bottom: 10px;
}

.ml10 {
  margin-left: 10px;
}

.ml15 {
  margin-left: 15px;
}

.mr10 {
  margin-right: 10px;
}

.pl20 {
  padding-left: 20px;
}

.mr10 {
  margin-right: 10px;
}

.w120 {
  width: 120px !important;
}

.w136 {
  width: 136px !important;
}

.warningCl {
  color: #E6A23C;
}

.successCl {
  color: #67C23A;
}

.dangerCl {
  color: #F56C6C;
}

.blackCl {
  color: #333333;
}
.pl10{
  padding-left: 10px;
}
.dspb{
  display: inline-block;
}
.color666 {
  color: #666666;
}

.blueCl {
  color: #409eff;
}
.hoverStyle:hover{
  color: #347bcd;font-weight: 600;
}
.fwb {
  font-weight: bold;
}

 

.txtleft {
  text-align: left;
}

.txtright {
  text-align: right;
}
.txtcenter{
  text-align: center;
}
.flex1 {
  flex: 1;
}

.border1 {
  border: 1px solid #EBEEF5;
}

.pd20 {
  padding: 20px;
}

.pd10 {
  padding: 10px;
}

.fs10 {
  font-size: 10px;
}

.fs12 {
  font-size: 12px;
}
.fs14 {
  font-size: 14px;
}

.lh3 {
  line-height: 3;
}

.sizeCl6 {
  color: #606266
}

.w90 {
  width: 90px;
}

.el-textarea__inner {
  font-family: Arial, Helvetica, sans-serif;
}

.el-dialog__header .el-dialog__title {
  font-size: 14px;
}
</style>
