/**
 * date:2021.05.04
 * author:kent
 * state:finished
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 页面数据
let resArray = []

// 创建数据库实例
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  //flag(number):0 查询单个自习室具体信息 roomId(string) 
  if (event.flag === 0) {
    for (let index = 0; index < event.roomIds.length; index++) {

      let temp = await db.collection('rooms').where({
        roomId: event.roomIds[index]
      }).get()
      resArray[index] = {
        sitDown: temp.data[0].chairs.sitDown,
        chairNum: temp.data[0].chairs.chairNum,
        roomId: temp.data[0].roomId,
        roomName: temp.data[0].roomName,
        openTime: temp.data[0].openTime
      }
    }
    return resArray
  }

  //flag(number):0 查询多个自习室基础信息 roomIds(string array) 
  else if (event.flag === 1) {
    return await db.collection('rooms').where({
      roomId: event.roomId
    }).get()
  }


}