// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
const db = cloud.database()
// 初始化响应码reCode 结果result
let reCode = 0
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
      oresult.data[0].chairs.sitDown+=1
      oresult.data[0].chairs.infos[event.chairIndex].openId=wxContext.OPENID
      oresult.data[0].chairs.infos[event.chairIndex].state=true
      oresult.data[0].count.pepSum+=1 
      rresult=await db.collection('rooms').where({
        roomId:event.roomId
      }).update({
      data:{
      chairs:oresult.data[0].chairs,
      count:oresult.data[0].count
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