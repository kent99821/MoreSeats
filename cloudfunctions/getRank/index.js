/**
 * date:2021.05.09
 * author:kent
 * state:finished
 * content:
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
const db = cloud.database()
const $ = db.command.aggregate
let PageData={
  resCode:0,
  result:{}//查询结果
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  PageData.result=await db.collection('ranks').where({
    roomId:event.roomId,
  }).orderBy('uTimeSum', 'desc').skip(event.skip).limit(event.num).get()
 return PageData.result

}