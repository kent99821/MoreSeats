/**
 * date:2021.05.04
 * author:kent
 * state:finished
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
const db = cloud.database()
// 页面数据
let result
let obj = {}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.flag) {
    // 查询用户信息 若无记录 则isNewGuys为true
    case 0:
      result = await db.collection('users').where({
        openId: wxContext.OPENID
      }).get()
      // return result.data[0].openId
      if (result.data.length === 0) {
        obj.isNewGuys = true
        return obj
      } else {
        obj.openId = result.data[0].openId
        obj.recordNum = result.data[0].recordNum
        obj.sumTime = result.data[0].sumTime
        obj.isAdmin = result.data[0].isAdmin
        obj.userName = result.data[0].userName
        return obj
      }
      //用于触底加载功能 初步完成跳过event.skip条记录 查询返回后面的记录
      case 1:
        result = await db.collection('history').skip(event.skip).get()
        return result.data
        //修改用户名 
      case 2:
        result = await db.collection('users').where({
          openId: wxContext.OPENID
        }).update({
          data: {
            userName: event.userName
          }
        })
        return result.errMsg
        // 添加用户  输入用户名 其余默认
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