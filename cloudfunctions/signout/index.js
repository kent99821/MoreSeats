/**
 * date:2021.05.05
 * author:kent
 * state:finishing
 * howlong 记得赋值为0
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
const db = cloud.database()
// 初始化页面数据  
const _ = db.command
 let PageData={
  openId:"", //初始化 openId
  userName:"",//用户名 
  howlong:10,//时间差
  reCode:0,//返回状态码
  uresult:{}, // users查询的结果
  hresult:{}, //history的查询结果
  uhresult:{}, //history的修改结果
  uuresult:{},//users的修改结果
  rresult:{},//rooms的查询结果
  urresult:{},//rooms的更新结果
  rank:{},//排行榜的查询结果
  arank:{},//排行榜的添加结果
  urank:{}//排行榜的更新结果
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.flag === 0) {
    PageData.openId = wxContext.OPENID
  } else {
    PageData.openId = event.openId
  }
  PageData.uresult = await db.collection('users').where({
    openId: PageData.openId
  }).get()
  // 之前已经签退
  if(PageData.uresult.data[0].isOver===true){
    PageData.reCode=201
    return PageData.reCode
  }else{
    PageData.userName=uresult.data[0].userName
    // 查记录 方便计算
  // PageData.hresult=await db.collection('history').where({
  //   openId:PageData.openId,
  //   roomId:event.roomId,
  //   isOver:false,
  //   chairIndex:event.chairIndex
  // }).get()
  // PageData.hresult.data[0].eTime=new Date()
  // PageData.howlong=parseInt((PageData.hresult.data[0].eTime-PageData.hresult.data[0].sTime)/60000)
  // PageData.hresult.data[0].howlong=PageData.howlong
  // 更新history记录
  // PageData.uhresult=await db.collection('history').where({
  //   openId:PageData.openId,
  //   roomId:event.roomId,
  //   isOver:false,
  //   chairIndex:event.chairIndex  
  // }).update({
  //   data:{
  //     "eTime":PageData.hresult.data[0].eTime,
  //     "howlong":PageData.hresult.data[0].howlong,
  //     "isOver":true
  //   }
  // })
    // return PageData.uhresult.errMsg: "collection.update:ok"
    PageData.rresult=await db.collection('rooms').where({
      roomId:event.roomId
    }).get()
    PageData.rresult.data[0].chairs.infos[event.chairIndex].openId=""
    PageData.rresult.data[0].chairs.infos[event.chairIndex].state=false
    PageData.urresult=await db.collection('rooms').where({
      roomId:event.roomId,
    }).update({
      data:{
      'chairs.infos':PageData.rresult.data[0].chairs.infos,
      'chairs.sitDown':PageData.rresult.data[0].chairs.sitDown-1,
      'count.timeSum':_.inc(PageData.howlong)
      }
    })
      //return PageData.urresult.errMsg: "collection.update:ok"
    PageData.rank=await db.collection('rooms').where({
      roomId:event.roomId,
      'count.rank.openId':PageData.openId
    }).get()
    if(PageData.rank.data.length===0){
      PageData.arank=await db.collection('rooms').add({
        data:{
          // 'openId':PageData.openId,
          // 'utimeSum':PageData.howlong,
          // 'userName':PageData.userName
        }
      })
    } 
  }
  
}