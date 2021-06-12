/**
 * date:2021.06.12
 * author:kent
 * state:finished
 * content:update flag:0
 */




// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
const db = cloud.database()
// 初始化页面数据  
const _ = db.command
let PageData = {
  openId: "", //初始化 openId
  userName: "", //用户名 
  howlong: 0, //时间差
  reCode: 0, //返回状态码
  uresult: {}, // users查询的结果
  hresult: {}, //history的查询结果
  uhresult: {}, //history的修改结果
  uuresult: {}, //users的修改结果
  rresult: {}, //rooms的查询结果
  urresult: {}, //rooms的更新结果
  rank: {}, //排行榜的查询结果
  arank: {}, //排行榜的添加结果
  urank: {} //排行榜的更新结果
}



// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.flag === 0) {
    PageData.openId = wxContext.OPENID
  } else if (event.flag === 1) {
    PageData.openId = event.openId
  }
  PageData.uresult = await db.collection('users').where({
    openId: PageData.openId
  }).get()
  // 之前已经签退
  if (PageData.uresult.data[0].isOver === true) {
    PageData.reCode = 201
    return {
      "resCode": PageData.reCode,
      "Msg": "之前已签退",
      "data": {}
    }
  } else {
    PageData.userName = PageData.uresult.data[0].userName
    // 查记录 方便计算
    PageData.hresult = await db.collection('history').where({
      openId: PageData.openId,
      roomId: event.roomId,
      isOver: false,
      chairIndex: event.chairIndex
    }).get()
    PageData.hresult.data[0].eTime = new Date()
    PageData.howlong = parseInt((PageData.hresult.data[0].eTime - PageData.hresult.data[0].sTime) / 60000)
    PageData.hresult.data[0].howlong = PageData.howlong
    //更新history记录
    if (event.flag === 0) {
      PageData.uhresult = await db.collection('history').where({
        openId: PageData.openId,
        roomId: event.roomId,
        isOver: false,
        chairIndex: event.chairIndex
      }).update({
        data: {
          "eTime": PageData.hresult.data[0].eTime,
          "howlong": PageData.hresult.data[0].howlong,
          "isOver": true,
          "todo": event.todo
        }
      })
    } else {
      PageData.uhresult = await db.collection('history').where({
        openId: PageData.openId,
        roomId: event.roomId,
        isOver: false,
        chairIndex: event.chairIndex
      }).update({
        data: {
          "eTime": new Date(),
          "howlong": PageData.hresult.data[0].howlong,
          "isOver": true
        }
      })
    }
    // return PageData.uhresult.errMsg: "collection.update:ok"
    PageData.rresult = await db.collection('rooms').where({
      roomId: event.roomId
    }).get()
    PageData.rresult.data[0].chairs.infos[event.chairIndex].openId = ""
    PageData.rresult.data[0].chairs.infos[event.chairIndex].state = false
    PageData.urresult = await db.collection('rooms').where({
      roomId: event.roomId,
    }).update({
      data: {
        'chairs.infos': PageData.rresult.data[0].chairs.infos,
        'chairs.sitDown': _.inc(-1),
        'count.timeSum': _.inc(PageData.howlong)
      }
    })
    //return PageData.urresult.errMsg: "collection.update:ok"
    // 查询排行榜中是否存在用户的记录
    PageData.rank = await db.collection('ranks').where({
      roomId: event.roomId,
      openId: PageData.openId
    }).get()
    // 排行榜中没有用户的记录 在排行榜中加一条用户的记录
    if (PageData.rank.data.length === 0) {
      PageData.arank = await db.collection('ranks').add({
        data: {
          openId: PageData.openId,
          roomId: event.roomId,
          userName: PageData.userName,
          utimeSum: PageData.howlong
        }
      })
      //return PageData.arank.errMsg: "collection.add:ok"
    }
    //用户已经在排行榜上有记录 在该用户的记录中的时长加上
    else {
      PageData.urank = await db.collection('ranks').where({
        roomId: event.roomId,
        openId: PageData.openId
      }).update({
        data: {
          userName: PageData.userName,
          utimeSum: _.inc(PageData.howlong)
        }
      })
      //return PageData.urank //errMsg: "collection.update:ok"
    }

    // 对users操作
    PageData.uuresult = await db.collection('users').where({
      openId: PageData.openId
    }).update({
      data: {
        isOver: true,
        recordNum: _.inc(1),
        sumTime: _.inc(PageData.howlong)
      }
    })
    // return PageData.uuresult
    // errMsg: "collection.update:ok"
    // 所有更新操作都完成后 返回成功码
    if (PageData.uhresult.errMsg === "collection.update:ok" && PageData.urresult.errMsg === "collection.update:ok" && PageData.arank.errMsg === "collection.add:ok" && PageData.uuresult.errMsg === "collection.update:ok") {
      PageData.reCode = 200
      return {
        "resCode": PageData.reCode,
        "Msg": "签退成功",
        "data": {}
      }
    } else if (PageData.uhresult.errMsg === "collection.update:ok" && PageData.urresult.errMsg === "collection.update:ok" && PageData.urank.errMsg === "collection.update:ok" && PageData.uuresult.errMsg === "collection.update:ok") {
      PageData.reCode = 200
      return {
        "resCode": PageData.reCode,
        "Msg": "签退成功",
        "data": {}
      }
    } else {
      PageData.reCode = 405
      return {
        "resCode": PageData.reCode,
        "Msg": "后台接口错误",
        "data": {}
      }
    }
  }

}