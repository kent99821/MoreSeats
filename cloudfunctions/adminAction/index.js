// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()


// 初始化数据库
let db=wx.cloud.database()
let rooms=db.collection('rooms')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}