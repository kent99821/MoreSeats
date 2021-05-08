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
const db = cloud.database()
let PageData = {
  reCode: 0, //状态码
  result: {}, //查询结果
  aresult: {}, //添加结果
  croomId: "", //创建的roomid
}

function uuid() {
  var chars = '0123456789'.split('');
  var uuid = [],
    i;
  for (i = 0; i < 6; i++) uuid[i] = chars[0 | Math.random() * 10];
  return uuid.join('');
}

// room的记录格式
// chairs: {infos:[], sitDown: 0, type: 0, chairNum: 0, group: []}
// count: {pepSum: 0, rank: [], timeSum: 0}
// isOpen: true
// openId: ""
// openTime: ""
// roomId: ""
// roomName: ""
// roomNorice: {}
// rule: {type:0 , size: 0, longtitude: 0, latitude: 0}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.flag) {
    case 0:
      while (1) {
        PageData.croomId = uuid()
        PageData.result = await db.collection('rooms').where({
          roomId: PageData.croomId
        }).get()
        if (PageData.result.data.length === 0) {
          PageData.aresult = await db.collection('rooms').add({
            data: {
              chairs: {
                infos: [],
                sitDown: 0,
                type: 0,
                chairNum: 0,
                group: []
              },
              count: {
                pepSum: 0,
                rank: [],
                timeSum: 0
              },
              isOpen: true,
              openId: wxContext.OPENID,
              openTime: "",
              roomId: PageData.croomId,
              roomName: event.roomName,
              roomNorice: {},
              rule: {
                type: 0,
                size: 0,
                longtitude: 0,
                latitude: 0
              }
            }
          })
          if (PageData.aresult.errMsg === "collection.add:ok") {
            PageData.reCode = 200
            return {
              "resCode": PageData.reCode,
              "Msg": "创建成功",
              "data": {
                roomId:PageData.croomId,
                roomName:event.roomName
              }
            }
          } else {
            PageData.reCode = 201
            return {
              "resCode": PageData.reCode,
              "Msg": "后台接口错误 创建失败",
              "data": {}
            }
          }

        }
      }
  }
}