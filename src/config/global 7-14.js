import CryptoJS from 'crypto-js'
// 全局配置
export const GLOBAL_CONFIG = {
  // API 基础地址 - 使用空字符串，让请求走代理
  BASE_URL: '',
  // http://backendapi.bjyxfl.com
  // 渠道号
  API_CHANNEL_NO: '12358',
  // 签名私钥
  SIGN_SECRET_KEY: '8687684cae5dad3eb9abc4df686f7313',
  // 获取时间戳（秒级）
  getTimestamp() {
    return Math.floor(Date.now() / 1000).toString()
  },

  // 生成签名
  generateSign() {
    const api_channel_no = this.API_CHANNEL_NO;
    const timestamp = this.getTimestamp();
    const secretKey = this.SIGN_SECRET_KEY;
    // 拼接字符串
    const signStr = "api_channel_no" + '12358' + 'timestamp' + timestamp + secretKey;
    // SHA1 加密
    const sha1Result = CryptoJS.SHA1(signStr).toString();
    // MD5 加密
    const sign = CryptoJS.MD5(sha1Result).toString();
    return sign
  }
}