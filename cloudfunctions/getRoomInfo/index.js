/**
 * date:2021.05.09
 * author:kent
 * state:finished
 * content:updata code
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 页面数据

let PageData={
  resCode:0,//响应码
  resArray:[],//结果数组
  result:{},//结果对象
  obj:{}//返回对象
}

// 创建数据库实例
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
 
  switch(event.flag){
     //flag(number):0 查询多个自习室具体信息 roomIds(string) 
    case 0:
      PageData.resArray=[]
      for (let index = 0; index < event.roomIds.length; index++) {
        let temp = await db.collection('rooms').where({
          roomId: event.roomIds[index]
        }).field({
          "chairs.sitDown":true,
          "chairs.chairNum":true,
          "roomId":true,
          "roomName":true,
          "openTime":true,
          "roomNotice":true
        }).get()
        if(temp.data.length===0){
          break;
        }
        PageData.resArray[index] = temp.data[0]
      }
      // return PageData.resArray
      // 判断结果的数组是否和传入的Id数组吻合
      if(PageData.resArray.length!==event.roomIds.length){
        PageData.resCode=201
        return {
          "resCode":PageData.resCode,
          "Msg":"查询的自习室Id有误",
          "data":PageData.resArray
         }
      }
      else{
        PageData.resCode=200
        return {
          "resCode":PageData.resCode,
          "Msg":"查询成功",
          "data":PageData.resArray
         }
      }
       //flag(number):1 查询单个自习室基础信息 roomId(string) 
    case 1:
      PageData.result = await db.collection('rooms').where({
        roomId: event.roomId
      }).field({
        chairs:true,
        isOpen:true,
        openId:true,
        openTime:true,
        roomId:true,
        roomName:true,
        roomNotice:true,
        rule:true
      }).get()
      if(PageData.result.data.length===0){
        PageData.resCode=404
        return {
          "resCode":PageData.resCode,
          "Msg":"查询的自习室Id不存在",
          "data":{}
         }
      }
      else{
  
        PageData.resCode=200
        return {
          "resCode":PageData.resCode,
          "Msg":"查询成功",
          "data":PageData.result.data[0]
         }
      }
    case 2:
      PageData.result = await db.collection('history').where({
        roomId: event.roomId,
        isOver:event.isOver
      }).field({
      chairIndex:true,
      sTime:true,
      howlong:true,
      openId:true,
      userName:true
      }).skip(event.skip).limit(event.num).get()
      if(PageData.result.data.length===0){
        PageData.resCode=404
        return {
          "resCode":PageData.resCode,
          "Msg":"自习室不存在或暂无学习记录",
          "data":{}
         }
      }
      else{
  
        PageData.resCode=200
        return {
          "resCode":PageData.resCode,
          "Msg":"查询成功",
          "data":PageData.result.data
         }
      }

  }


 

  



}