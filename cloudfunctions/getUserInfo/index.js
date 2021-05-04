// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
const db = cloud.database()
// 页面数据
let result 
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.flag) {
    case 0:
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      result = await db.collection('users').add({
        data: {
          isAdmin: false,
          isOver: true,
          openId: wxContext.OPENID,
          recordNum: 0,
          roomAdminList: [],
          sumTime: 0,
          userName: event.userName
        },

      })
      return result.errMsg

  }
  

}