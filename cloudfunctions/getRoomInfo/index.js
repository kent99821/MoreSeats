/**
 * date:2021.05.06
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
  //flag(number):0 查询多个自习室具体信息 roomIds(string) 
  if (event.flag === 0) {
    for (let index = 0; index < event.roomIds.length; index++) {
      let temp = await db.collection('rooms').where({
        roomId: event.roomIds[index]
      }).get()
      if(temp.data.length===0){
        break;
      }
      PageData.resArray[index] = {
        sitDown: temp.data[0].chairs.sitDown,
        chairNum: temp.data[0].chairs.chairNum,
        roomId: temp.data[0].roomId,
        roomName: temp.data[0].roomName,
        openTime: temp.data[0].openTime
      }
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
  }

  //flag(number):1 查询单个自习室基础信息 roomIds(string array) 
  else if (event.flag === 1) {
    PageData.result = await db.collection('rooms').where({
      roomId: event.roomId
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
      PageData.obj.chairs = PageData.result.data[0].chairs
      PageData.obj.isOpen = PageData.result.data[0].isOpen
      PageData.obj.openId = PageData.result.data[0].openId
      PageData.obj.openTime = PageData.result.data[0].openTime
      PageData.obj.roomId = PageData.result.data[0].roomId
      PageData.obj.roomName = PageData.result.data[0].roomName
      PageData.obj.roomNotice = PageData.result.data[0].roomNotice
      PageData.obj.rule = PageData.result.data[0].rule
      PageData.resCode=200
      return {
        "resCode":PageData.resCode,
        "Msg":"查询成功",
        "data":PageData.obj
       }
    }
    
  }
  



}