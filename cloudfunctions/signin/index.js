/**
 * date:2021.05.06
 * author:kent
 * state:finished
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
const db = cloud.database()
// 初始化响应码reCode 结果result
let reCode = 0
// 查找用户记录的结果 查询自习室的结果  添加学习记录的结果 更新用户记录的结果 更新自习室的结果
let result, oresult,hresult,uresult,rresult
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  result = await db.collection('users').where({
    openId: wxContext.OPENID
  }).get()
  // 上次签到是否结束
  if (result.data[0].isOver === false) {
    let noEnd={
      user:result.data[0],
      reCode:201
    }
    return noEnd
  } else {
    oresult = await db.collection('rooms').where({
      roomId: event.roomId
    }).get()
    // 自习室是否存在
    if (oresult.data.length === 0) {
      reCode = 404
      return reCode
    } else {
      // 该位置已有人坐下
      if (oresult.data[0].chairs.infos[event.chairIndex].openId !== "" && oresult.data[0].chairs.infos[event.chairIndex].state === true) {
        reCode = 300
        return reCode
      }
      // 自习室没有开门
      else if(oresult.data[0].isOpen===false){
        reCode=500
        return reCode
      }
      // 理想状态
      else{
      oresult.data[0].chairs.infos[event.chairIndex].openId=wxContext.OPENID
      oresult.data[0].chairs.infos[event.chairIndex].state=true
      rresult=await db.collection('rooms').where({
        roomId:event.roomId
      }).update({
      data:{
      "chairs.sitDown":oresult.data[0].chairs.sitDown+1,
      "chairs.infos":oresult.data[0].chairs.infos,
      "count.pepSum":oresult.data[0].count.pepSum+1
      }
      })
      uresult=await db.collection('users').where({
        openId:wxContext.OPENID
      }).update({
        data:{
          isOver:false
        }
      })
      hresult=await db.collection('history').add({
        data:{
        chairIndex:event.chairIndex,
        howlong:0,
        isOver:false,
        openId:wxContext.OPENID,
        roomId:event.roomId,
        roomName:event.roomName,
        sTime:db.serverDate(),
        eTime:db.serverDate()  
        } 
      })
      if(rresult.errMsg==="collection.update:ok"&&uresult.errMsg==="collection.update:ok"&&hresult.errMsg==="collection.add:ok"){
        reCode=200
        return reCode
      }
      else{
        reCode=405
        return reCode
      }
      }
    }
  }


}