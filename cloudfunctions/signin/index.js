/**
 * date:2021.05.06
 * author:kent
 * state:finished
 * content:update code
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
const db = cloud.database()
const _ = db.command
// 初始化响应码reCode 结果result
// 查找用户记录的结果 查询自习室的结果  添加学习记录的结果 更新用户记录的结果 更新自习室的结果
// let result, oresult,hresult,uresult,rresult
let PageData={
  reCode:0,
  result:{},
  oresult:{},
  hresult:{},
  uresult:{},
  rresult:{}
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  PageData.result = await db.collection('users').where({
    openId: wxContext.OPENID
  }).get()
  // 上次签到是否结束
  if (PageData.result.data[0].isOver === false) {
      PageData.reCode=201
    return {
      "resCode":PageData.reCode,
      "Msg":"上次学习未签退",
      "data":{user:PageData.result.data[0]}
     }

  } else {
    PageData.oresult = await db.collection('rooms').where({
      roomId: event.roomId
    }).get()
    // 自习室是否存在
    if (PageData.oresult.data.length === 0) {
      PageData.reCode = 404
    return {
      "resCode":PageData.reCode,
      "Msg":"自习室不存在",
      "data":{}
     }
    } else {
      // 该位置已有人坐下
      if (PageData.oresult.data[0].chairs.infos[event.chairIndex].openId !== "" && PageData.oresult.data[0].chairs.infos[event.chairIndex].state === true) {
        PageData.reCode = 300
        return {
          "resCode":PageData.reCode,
          "Msg":"位置已被使用",
          "data":{}
         }
      }
      // 自习室没有开门
      else if(PageData.oresult.data[0].isOpen===false){
        PageData.reCode=500
        return {
          "resCode":PageData.reCode,
          "Msg":"自习室未开启",
          "data":{}
         }
      }
      // 理想状态
      else{
        // 更新自习室座位相关信息
      PageData.oresult.data[0].chairs.infos[event.chairIndex].openId=wxContext.OPENID
      PageData.oresult.data[0].chairs.infos[event.chairIndex].state=true
      PageData.rresult=await db.collection('rooms').where({
        roomId:event.roomId
      }).update({
      data:{
      "chairs.sitDown":_.inc(1),
      "chairs.infos":PageData.oresult.data[0].chairs.infos,
      "count.pepSum":_.inc(1)
      }
      })
      // 更新用户的状态
      PageData.uresult=await db.collection('users').where({
        openId:wxContext.OPENID
      }).update({
        data:{
          isOver:false
        }
      })
      // 新增历记录
      PageData.hresult=await db.collection('history').add({
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
      // 签到成功
      if(PageData.rresult.errMsg==="collection.update:ok"&&PageData.uresult.errMsg==="collection.update:ok"&&PageData.hresult.errMsg==="collection.add:ok"){
        PageData.reCode=200
        return {
          "resCode":PageData.reCode,
          "Msg":"签到成功",
          "data":{}
         }
      }
      // 接口错误
      else{
        PageData.reCod=405
        return {
          "resCode":PageData.reCode,
          "Msg":"后台接口错误",
          "data":{}
         }
      }
      }
    }
  }


}