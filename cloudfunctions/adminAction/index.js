/**
 * date:2021.05.06
 * author:kent
 * state:finishing
 * content:create
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
let db=wx.cloud.database()
let PageData={
reCode:0,//状态码
result:{},//查询结果
aresult:{},//添加结果
croomId:"",//创建的roomid
}
function uuid() {
  var chars = '0123456789'.split('');
  var uuid = [], i;
    for (i = 0; i < 6; i++) uuid[i] = chars[0 | Math.random()*10];
  return uuid.join('');
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
      PageData.result=await db.collection('rooms').where({
      roomId:"123456"
    }).get()
    return PageData.result
// switch(event.flag){
//   case 0:
//     while(1){
//      PageData.croomId=uuid()
//     PageData.result=await db.collection('rooms').where({
//       roomId:PageData.croomId
//     }).get()
//   if(PageData.result.data.length===0){
//     // PageData.aresult=await db.collection('rooms').where({
//     //   openId:event.openId
//     // }).get()
//   }
//     }
// }
}